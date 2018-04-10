<template>
    <div id="app">
        <el-upload
            class="files-upload"
            multiple
            action=""
            :show-file-list="false"
            :http-request="handleUpload">
            <el-button size="small"
                       type="primary">Выбрать файлы
            </el-button>
            <div slot="tip"
                 class="el-upload__tip">файлы с данными квадратной решётки
            </div>
        </el-upload>
        <div class="lattice-files-list">
            <div class="no-files"
                 v-if="!addedFiles.length">
                Выберите файлы с данными
            </div>
            <lattice v-for="(file, i) in addedFiles"
                     @remove="removeAddedFile(i)"
                     class="lattice-file"
                     :file="file"
                     :key="file.uid"/>
        </div>
    </div>
</template>

<script>
import { validateFileType } from '@/assets/js/utils';
import { catchError } from '@/assets/js/ErrorHandle/ErrorHandle';
import Lattice from '@/components/LatticeFile';

export default {
    name: 'App',
    data() {
        return {
            addedFiles: [],
        };
    },
    methods: {
        handleUpload({ file }) {
            if (_.some(this.addedFiles, uploadedFile => uploadedFile.name === file.name)) {
                catchError(this.$store.dispatch, { reason: 'already_uploaded' }, { reject: false });
                return;
            }
            validateFileType(file).then(() => {
                this.addedFiles.push(file);
            });
        },
        removeAddedFile(index) {
            this.addedFiles.splice(index, 1);
        },
    },
    components: {
        Lattice,
    },
};
</script>

<style lang="scss">
    @import "~@/assets/style/main.scss";

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /*text-align: center;*/
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
<style lang="scss" scoped>
    $bp-max-mobile: 450px;
    $bp-min-phablet: $bp-max-mobile + 1px;
    $bp-max-phablet: 750px;
    $bp-min-tablet: $bp-max-phablet + 1px;
    $bp-max-tablet: 1050px;
    $bp-min-desktop: $bp-max-tablet + 1px;

    .lattice-files-list {
        /*padding: 5px;*/
        .lattice-file {
            background-color: whitesmoke;
            padding: 5px;
        }
        .lattice-file:not(:last-child) {
            margin-bottom: 5px;
        }
        .no-files {
            text-align: center;
        }
    }

    @media (min-width: $bp-min-phablet) and (max-width: $bp-max-phablet) {
        .lattice-files-list {
            margin-left: 3%;
            margin-right: 3%;
        }
    }

    @media (max-width: $bp-max-tablet) and (min-width: $bp-min-tablet) {
        .lattice-files-list {
            margin-left: 14%;
            margin-right: 14%;
        }
    }

    @media (min-width: $bp-min-desktop) {
        .lattice-files-list {
            padding: 10px;
            margin-left: 20%;
            margin-right: 20%;
            .lattice-file:not(:last-child) {
                margin-bottom: 10px;
            }
        }
    }

    .files-upload {
        text-align: center;
    }
</style>
