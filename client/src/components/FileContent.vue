<template>
    <v-app id="fileContentContainer">
        <!--<h1>{{ uploadedFiles.length }} uploaded file(s)</h1>
        <h1>Current Uoload progress: {{ selectedFiles.uploadProgress }}</h1>-->
        <div class="cardsContainer" v-for="(file, index) in uploadedFiles" :key="index">
            <v-card
                class="mx-auto"
                width="300px"
            >
            <!-- src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" -->
                <div v-if="file.contentType.search(/^image\/.*/) > -1">
                    <v-img
                        class="fill-height white--text align-end"
                        height="200px"
                        :src="file.metadata ? file.metadata.base64Str : ''"
                    >
                        <!-- <v-card-title>Top 10 Australian beaches</v-card-title> -->
                    </v-img>
                </div>
                <div v-else-if="file.contentType.search(/^text\/.*/) > -1">
                    <v-img
                        class="fill-height white--text align-end"
                        height="200px"
                        :src="require('../assets/text_file.png')"
                    >
                        <!-- <v-card-title>Top 10 Australian beaches</v-card-title> -->
                    </v-img>
                </div>
                <div v-else>
                    <v-img
                        class="white--text align-end"
                        height="200px"
                        :src="require('../assets/logo.png')"
                    >
                        <!-- <v-card-title>Top 10 Australian beaches</v-card-title> -->
                    </v-img>
                </div>
                <v-card-subtitle class="pb-0">
                    {{ file.filename }}
                </v-card-subtitle>

                <v-card-text class="text--primary">
                    <div>{{ 'by ' + (file.metadata ? (file.metadata.username ? file.metadata.username : 'Unknown') : 'Unknown') }}</div>
                    <div>{{ file.contentType }}</div>

                    <div>{{ formatBytes(file.length) }}</div>
                </v-card-text>

                <v-card-actions>
                    <!-- <v-btn
                    color="orange"
                    text
                    left
                    >
                    Share
                    </v-btn> -->

                    <v-btn
                        color="info"
                        fab
                        x-small
                        right
                        @click="download(file)"
                    >
                        <v-icon>mdi-download</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
        <v-progress-circular
            :rotate="-90"
            :size="100"
            :width="15"
            :value="selectedFiles.uploadProgress"
            color="teal"
            v-show="isUploading"
        >
            {{ selectedFiles.uploadProgress }}
        </v-progress-circular>

    </v-app>
</template>

<script>
    import FileService from '@/services/FileService'
    import { toastMixin } from '../../mixins/Mixin'

    export default {
        mixins: [toastMixin],
        props: ['selectedFiles'],
        data () {
            return {
                uploadedFiles: [],
                isUploading: false
            }
        },
        methods: {
            async fetchAllFiles () {
                await FileService.fetchAllFiles().then((returnedData) => {
                    console.log(returnedData.blob)
                    if (returnedData && returnedData.files) {
                        console.log('Fetch All returned: ' + returnedData.files)

                        // const reader = new FileReader()
                        // reader.readAsDataURL(returnedData.blob)
                        // reader.onloadend = function () {
                        //     const base64data = reader.result
                        //     console.log('My 64: ' + base64data)
                        // }
                        this.uploadedFiles = returnedData.files
                    }
                })
            },
            formatBytes (bytes, decimals = 2) {
                if (bytes === 0) {
                    return '0 Bytes'
                }

                const k = 1024
                const dm = decimals < 0 ? 0 : decimals
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

                const i = Math.floor(Math.log(bytes) / Math.log(k))

                return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
            },
            async download (fileInfo) {
                console.log(JSON.stringify(fileInfo))
                if (!fileInfo || !fileInfo._id) {
                    this.showToast('danger', 'The file is missing information')

                    return
                }

                this.showToast('info', 'Preparing for downloading file')

                await FileService.download(fileInfo).then((returnedData) => {
                    this.showToast('success', 'Downloaded file: ' + JSON.stringify(returnedData))
                }).catch((error) => {
                    this.showToast('danger', 'Download failed' + error)
                })
            }
        },
        mounted () {
            this.fetchAllFiles()
        }
    }
</script>
