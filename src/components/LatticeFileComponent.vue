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
            <div class="info-fileinfo">
                <div class="fileinfo-line">
                    {{ file.name }}
                </div>
                <div class="fileinfo-line">
                    {{ fileSize }}
                </div>
            </div>
            <div v-if="!parsingFile"
                 class="check">
                <el-button v-if="checkResult === null"
                           :loading="checking"
                           @click.stop="checkClick">
                    Проверить
                </el-button>
                <div v-if="checkResult === 'yes'"
                     class="result success">
                    Есть самоорганизация
                </div>
                <div v-if="checkResult === 'no'"
                     class="result failed">
                    Нет самоорганизации
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
import checkAssembly from '@/assets/js/CheckAssembly';
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
            checking: false,
            checkResult: null, // true or false
            parsedData: [],
            parsingFile: false,
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
            console.log('canvas non scaled');
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
            console.log('canvas non scaled end');
            return newCanvas;
        },
    },
    methods: {
        checkClick() {
            this.checking = true;
            checkAssembly(this.parsedData)
                .then(() => {
                    this.checking = false;
                    this.checkResult = 'yes';
                })
                .catch(() => {
                    this.checking = false;
                    this.checkResult = 'no';
                });
        },
        fillCanvas() {
            console.log('fill canvas');
            if (!this.canvasContext) {
                return;
            }
            this.canvasContext.drawImage(this.canvasNonScaled, 0, 0, this.canvas.width, this.canvas.height);
        },
        fillBigCanvas() {
            console.log('fill big canvas');
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
                console.log('canvas handler');
                this.fillCanvas();
                this.bigCanvasWasDrawn = false;
                this.fillBigCanvas();
            },
            immediate: true,
        },
        file: {
            handler() {
                console.log('file handler');
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
        .info-fileinfo {
            margin-left: 5px;
            display: flex;
            flex-direction: column;
            .fileinfo-line {
                &:not(:last-child) {
                    margin-bottom: 5px;
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
