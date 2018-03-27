<template>
    <div class="lattice-file-root">
        <div @click="openBigCanvasDialog"
             class="lattice-file-info-container">
            <div v-loading="parsingFile">
                <canvas ref="cnv"
                        class="info-canvas"
                        width="128"
                        height="128"></canvas>
            </div>
            <div class="right-part">
                <div class="file-info-and-close">
                    <div class="filename">
                        {{ file.name }}
                    </div>
                    <div class="filesize">
                        {{ fileSize }}
                    </div>
                    <el-button type="text"
                               @click="$emit('remove')"
                               class="close-button"
                               icon="el-icon-close"/>
                </div>
                <div class="check-row"
                     v-if="!parsingFile">
                    <div class="check-by-clasters-block">
                        <div class="method-label">
                            Метод кластеров
                        </div>
                        <el-button v-if="checkByClastersResult === null"
                                   :loading="checkingByClasters"
                                   @click.stop="checkByClasters">
                            Проверить
                        </el-button>
                        <div v-if="checkByClastersResult === 'yes'"
                             class="result success">
                            <i class="el-icon-check"/>
                        </div>
                        <div v-if="checkByClastersResult === 'no'"
                             class="result failed">
                            <i class="el-icon-close"/>
                        </div>
                    </div>
                    <div class="check-by-neighbours-block">
                        <div class="method-label">
                            Метод соседей
                        </div>
                        <el-button v-if="checkByNeighboursResult === null"
                                   :loading="checkingByNeighbours"
                                   @click.stop="checkByNeighbours">
                            Проверить
                        </el-button>
                        <div v-if="checkByNeighboursResult === 'yes'"
                             class="result success">
                            <i class="el-icon-check"/>
                        </div>
                        <div v-if="checkByNeighboursResult === 'no'"
                             class="result failed">
                            <i class="el-icon-close"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            class="scaled-view-dialog"
            @open="bigCanvasDialogOpened"
            :show-close="false"
            :visible.sync="bigCanvasDialogVisible">
            <canvas ref="bigCanvas"
                    class="big-canvas"
                    width="512"
                    height="512"/>
        </el-dialog>
    </div>
</template>

<script>
import { LatticeValuesEnum, parseFile } from '@/self_assembly_library/utils';
import { catchError } from '@/assets/js/ErrorHandle/ErrorHandle';
// import checkAssembly from '@/assets/js/CheckAssembly';
import checkByClasters from '@/assets/js/CheckAssembly';
import checkByNeighbours from '@/assets/js/CheckAssemblyByNeignbours';
import filesize from 'filesize';

export default {
    name: 'LatticeFileComponent',
    props: {
        file: { type: File, required: true },
    },
    data() {
        return {
            canvas: null,
            canvasContext: null,
            bigCanvasDialogVisible: false,
            bigCanvasWasDrawn: false,
            parsedData: [],
            parsingFile: false,
            checkingByClasters: false,
            checkingByNeighbours: false,
            checkByClastersResult: null, // true or false
            checkByNeighboursResult: null, // true or false
        };
    },
    computed: {
        fileSize() {
            return filesize(this.file.size);
        },
        size() {
            return this.parsedData.length;
        },
        canvasNonScaled() {
            // console.log('canvas non scaled');
            const scale = 1;
            const sz = this.size;
            const newCanvas = document.createElement('canvas');
            newCanvas.width = sz * scale;
            newCanvas.height = sz * scale;
            const canvCtx = newCanvas.getContext('2d');

            const dt = this.parsedData;
            for (let x = 0; x < sz; x++) {
                for (let y = 0; y < sz; y++) {
                    const res = dt[y][x];
                    switch (res) {
                        case LatticeValuesEnum.VERTICAL:
                            canvCtx.fillStyle = 'red';
                            break;
                        case LatticeValuesEnum.HORIZONTAL:
                            canvCtx.fillStyle = 'blue';
                            break;
                        case LatticeValuesEnum.EMPTY:
                        default:
                            canvCtx.fillStyle = 'white';
                    }
                    canvCtx.fillRect(x * scale, y * scale, scale, scale);
                }
            }
            // console.log('canvas non scaled end');
            return newCanvas;
        },
    },
    methods: {
        checkByClasters() {
            this.checkingByClasters = true;
            checkByClasters(this.parsedData)
                .then(() => {
                    this.checkByClastersResult = 'yes';
                    this.checkingByClasters = false;
                })
                .catch(() => {
                    this.checkByClastersResult = 'no';
                    this.checkingByClasters = false;
                });
        },
        checkByNeighbours() {
            this.checkingByNeighbours = true;
            checkByNeighbours(this.parsedData)
                .then(() => {
                    this.checkByNeighboursResult = 'yes';
                    this.checkingByNeighbours = false;
                })
                .catch(() => {
                    this.checkByNeighboursResult = 'no';
                    this.checkingByNeighbours = false;
                });
        },
        fillCanvas() {
            if (!this.canvasContext) {
                return;
            }
            this.canvasContext.drawImage(this.canvasNonScaled, 0, 0, this.canvas.width, this.canvas.height);
        },
        fillBigCanvas() {
            if (this.bigCanvasWasDrawn) {
                return;
            }
            const cnv = this.$refs.bigCanvas;
            if (!cnv) {
                return;
            }
            const ctx = cnv.getContext('2d');
            if (!ctx) {
                return;
            }
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(this.canvasNonScaled, 0, 0, cnv.width, cnv.height);
            this.bigCanvasWasDrawn = true;
        },
        openBigCanvasDialog() {
            this.bigCanvasDialogVisible = true;
        },
        bigCanvasDialogOpened() {
            this.$nextTick(() => {
                this.fillBigCanvas();
            });
        },
        parseFile() {
            this.parsingFile = true;
            return parseFile(this.file, 256).then((parsedData) => {
                this.parsingFile = false;
                this.parsedData = parsedData;
            }).catch((err) => {
                this.parsingFile = false;
                this.$emit('remove');
                return catchError(this.$store.dispatch, err, { reject: false });
            });
        },
    },
    mounted() {
        this.canvas = this.$refs.cnv;
        this.canvasContext = this.canvas.getContext('2d');
        this.canvasContext.imageSmoothingEnabled = false;
        this.fillCanvas();
    },
    watch: {
        canvasNonScaled: {
            handler() {
                this.fillCanvas();
                this.bigCanvasWasDrawn = false;
                this.fillBigCanvas();
            },
            immediate: true,
        },
        file: {
            handler() {
                this.parseFile();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss">
    .lattice-file {
        .scaled-view-dialog {
            display: flex;
            flex-direction: column;
            align-items: center;
            .el-dialog {
                width: unset;
                margin-top: auto !important;
                margin-bottom: auto !important;
                max-width: 96%;
                > .el-dialog__body {
                    padding-top: 0;
                }
            }
        }
    }
</style>

<style lang="scss" scoped>
    .lattice-file-info-container {
        display: flex;
        justify-content: flex-start;

        .right-part {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: space-between;
            margin-left: 1.5ch;
            .file-info-and-close {
                display: flex;
                .filename, .filesize {
                    margin-right: 1ch;
                }
                .close-button {
                    margin-left: auto;
                    font-size: 1.6em;
                    padding: 0;
                }
            }
            .check-row {
                display: flex;
                margin-bottom: 0.7em;
                .check-by-clasters-block, .check-by-neighbours-block {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex-basis: 50%;
                    .method-label {
                        margin-bottom: 0.8em;
                    }

                    .result {
                        font-size: 2em;
                        &.success {
                            color: limegreen;
                        }
                        &.failed {
                            color: red;
                        }
                    }
                }
            }
        }

        .check {
            margin-left: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
    }

    .big-canvas {
        width: 512px;
        max-width: 100%;
        display: block;
    }

    .info-canvas {
        display: block;
    }
</style>
