<template>
    <v-app id="outterWrapper">
        <div id="contentHeaderContainer">
            <div id="contentHeader">
                <p id="subHeader" class="text-h5">Shared Files</p>
                <p id="loginUser">{{ this.username ? 'Welcome ' + this.username : ''}}</p>
            </div>
            <hr role="separator" aria-orientation="horizontal" class="v-divider theme--light"><!-- <v-divider inset></v-divider> -->
        </div>
        <div id="fileContentContainer" ref="fileContentContainer">
            <!--<h1>{{ uploadedFiles.length }} uploaded file(s)</h1>
            <h1>Current Uoload progress: {{ selectedFiles.uploadProgress }}</h1>-->

            <div v-if="uploadedFiles.length === 0 && !this.fetchingFiles" class="emptyPage">
                <p class="font-weight-thin text-lg-h6">Upload files by clicking the <v-icon>mdi-cloud-upload</v-icon> button on the left menu bar</p>
            </div>
            <div class="cardsContainer" v-else v-for="(file, index) in uploadedFiles" :key="index">
                <v-lazy
                    v-model="isLazyActive"
                    :options="{
                    threshold: .5
                    }"
                    min-height="200"
                    transition="fade-transition"
                >
                <v-card
                    class="mx-auto"
                    width="250px"
                    style="overflow-wrap='normal'"
                    hover
                >
                <!-- src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" -->
                    <div v-if="file.contentType.search(/^image\/.*/) > -1">
                        <v-img
                            class="fill-height white--text align-end"
                            height="200px"
                            :src="file.metadata ? file.metadata.base64Str : ''"
                        >
                        </v-img>
                    </div>
                    <div class="cardThumbnail" v-else-if="file.contentType.search(/^video\/.*/) > -1">
                        <v-img
                            v-if="!showVideo['v' + file._id]"
                            class="fill-height white--text align-end"
                            height="200px"
                            :src="require('../assets/video_file3.png')"
                        >
                            <v-btn
                                color="info"
                                fab
                                @click="getFileById(file)"
                            >
                                <v-icon>mdi-arrow-right-drop-circle</v-icon>
                            </v-btn>
                            <v-overlay
                                :id="'vLoad_' + file._id"
                                :absolute="absolute"
                                :value="prepareVideo['vLoad_' + file._id]"
                            >
                                <v-progress-circular
                                    indeterminate
                                    size="50"
                                ></v-progress-circular>
                            </v-overlay>
                        </v-img>

                        <video-player ref='jRef' v-else :id="'v' + file._id" :fileId="file._id" :options="videoOptions"/>

                    </div>
                    <div v-else>
                        <v-img
                            class="fill-height white--text align-end"
                            height="200px"
                            :src="require('../assets/text_file.png')"
                        >
                            <!-- <v-card-title>Top 10 Australian beaches</v-card-title> -->
                        </v-img>
                    </div>
                    <!-- <span>{{ 'Name: ' + file.filename + '\n' + 'by: ' + (file.metadata.username ? file.metadata.username : 'Unknown') + '\n' + 'Type: ' + file.contentType + '\n' + 'Size: ' + (file.length ? formatBytes(file.length) : 'Unknown')}}</span> -->
                    <v-card-subtitle class="pb-0" v-b-tooltip.hover="{ variant: 'info' }"  v-b-tooltip.hover.bottomright="file.filename">
                        {{ file.filename }}
                    </v-card-subtitle>

                    <v-card-text class="text--primary">
                        <div v-b-tooltip.hover="{ variant: 'info' }"  v-b-tooltip.hover.bottomright="file.metadata.username">{{ 'by ' + (file.metadata ? (file.metadata.username ? file.metadata.username : 'Unknown') : 'Unknown') }}</div>
                        <div v-b-tooltip.hover="{ variant: 'info' }"  v-b-tooltip.hover.bottomright="file.contentType">{{ file.contentType }}</div>

                        <div v-b-tooltip.hover="{ variant: 'info' }"  v-b-tooltip.hover.bottomright="formatBytes(file.length)">{{ file.length ? formatBytes(file.length) : 'Unknown' }}</div>
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
                </v-lazy>
            </div>
            <div class="cardsContainer skeletonContainer" v-show="isLoading">
                <b-skeleton-wrapper :loading="isLoading" v-show="isLoading">
                    <template #loading>
                        <b-card no-body img-top>
                            <b-skeleton-img card-img="top"></b-skeleton-img>
                            <b-card-body>
                                <b-skeleton width="85%" animation="fade"></b-skeleton>
                                <b-skeleton width="55%" animation="fade"></b-skeleton>
                                <b-skeleton width="70%" animation="fade"></b-skeleton>
                                <b-skeleton type="avatar"></b-skeleton>
                            </b-card-body>
                        </b-card>
                    </template>
                </b-skeleton-wrapper>
                <b-progress max="100" v-show="isLoading">
                    <b-progress-bar :value="selectedFiles.uploadProgress" :label="`Uploading: ${selectedFiles.uploadProgress}%`"></b-progress-bar>
                </b-progress>
            </div>

            <!-- <v-progress-circular
                :rotate="-90"
                :size="100"
                :width="15"
                :value="selectedFiles.uploadProgress"
                color="teal"
                v-show=showProgress
            >
                {{ selectedFiles.uploadProgress }}
            </v-progress-circular> -->
        </div>
        <v-overlay :value="prepareDownload">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-app>
</template>

<script>
    import FileService from '@/services/FileService'
    import VideoPlayer from './VideoPlayer'
    import { toastMixin } from '../../mixins/Mixin'
    // import videojs from 'video.js'

    export default {
        mixins: [toastMixin],
        props: ['selectedFiles', 'isLoading', 'username'],
        components: {
            VideoPlayer
        },
        data () {
            return {
                uploadedFiles: [],
                isLazyActive: false,
                fetchingFiles: true,
                showVideo: {},
                videoBlobUrl: '',
                prepareDownload: false,
                prepareVideo: {},
                absolute: true,
                videoOptions: {
                    autoplay: true,
                    controls: true,
                    sources: []
                }
            }
        },
        methods: {
            async fetchAllFiles () {
                this.fetchingFiles = true

                await FileService.fetchAllFiles().then((returnedData) => {
                    if (returnedData && returnedData.files) {
                        console.log('Fetched ' + returnedData.files.length + ' records.')

                        // const reader = new FileReader()
                        // reader.readAsDataURL(returnedData.blob)
                        // reader.onloadend = function () {
                        //     const base64data = reader.result
                        //     console.log('My 64: ' + base64data)
                        // }
                        this.uploadedFiles = returnedData.files

                        this.uploadedFiles.forEach(element => {
                            // this.showVideo['v' + element._id] = false
                            if (element.contentType.search(/^video\/.*/) > -1) {
                                this.$set(this.showVideo, 'v' + element._id, false)
                                // this.prepareVideo['vLoad_' + element._id] = false

                                this.$set(this.prepareVideo, 'vLoad_' + element._id, false)
                            }
                        })
                    }
                }).catch((error) => {
                    this.showToast('danger', 'Fetch failed. ' + error.message)
                })

                this.fetchingFiles = false
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
            getVideo (fileObj) {
                return window.URL.createObjectURL(fileObj)
            },
            async download (fileInfo) {
                console.log(JSON.stringify(fileInfo))
                this.prepareDownload = true

                if (!fileInfo || !fileInfo._id) {
                    this.showToast('danger', 'The file id is required.')

                    this.prepareDownload = false

                    return
                }

                this.showToast('info', 'Preparing for download...')

                await FileService.download(fileInfo).then((returnedData) => {
                    console.log('TYPE: ' + typeof returnedData)
                    console.log('WHAT"S RETURNED DATA: ' + JSON.stringify(returnedData))
                    this.downloadFile(fileInfo, returnedData)
                    this.showToast('success', 'Downloaded.')
                    this.prepareDownload = false
                }).catch((error) => {
                    this.showToast('danger', 'Download failed. ' + error.message)

                    this.prepareDownload = false
                })
            },
            async readFileAsDataURL (image) {
                let resultBase64 = await new Promise((resolve) => {
                    let fileReader = new FileReader()
                    fileReader.onload = (e) => resolve(fileReader.result)
                    fileReader.readAsDataURL(image)
                })

                console.log('Testing readFile func: ' + resultBase64) // aGV5IHRoZXJl...

                return resultBase64
            },
            async downloadFile (fileInfo, base64Uri, returnBlobUrl) {
                var blob = new Blob([base64Uri])

                const filename = fileInfo.filename

                // console.log('%% JAY TEST : ' + jaytestimgBase64)

                try {
                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                        window.navigator.msSaveBlob(blob, filename)
                    } else {
                        let URL = window.URL || window.webkitURL
                        const downloadUrl = URL.createObjectURL(blob)

                        if (returnBlobUrl) {
                            return downloadUrl
                        }

                        // use HTML5 a[download] attribute to specify filename
                        const anchor = document.createElement('a')
                        // safari doesn't support this yet
                        if (typeof anchor.download === 'undefined') {
                            window.location.href = downloadUrl
                        } else {
                            anchor.href = downloadUrl
                            anchor.download = filename
                            document.body.appendChild(anchor)
                            anchor.click()
                        }

                        setTimeout(function () {
                            URL.revokeObjectURL(downloadUrl)
                            document.body.removeChild(anchor)
                        }, 100) // cleanup
                    }
                } catch (error) {
                    throw new Error(error.message)
                }
            },
            updateFileContent (files) {
                if (files && files.length) {
                    for (let i = 0; i < files.length; i++) {
                        this.uploadedFiles.push(files[i])
                    }
                }
            },
            async getFileById (file) {
                console.log(file._id + ' is showing video now')
                // this.prepareVideo['vLoad_' + file._id] = true
                this.$set(this.prepareVideo, 'vLoad_' + file._id, true)
                // this.showVideo['v' + file._id] = true

                if (!file || !file._id) {
                    this.showToast('danger', 'The file id is required.')

                    // this.prepareVideo['vLoad_' + file._id] = false
                    this.$set(this.prepareVideo, 'vLoad_' + file._id, false)

                    return
                }

                this.showToast('info', 'Preparing for the Video...')

                const returnedData = await FileService.getFileById(file) // .then((returnedData) => {
                        if (!returnedData) {
                            // this.prepareVideo['vLoad_' + file._id] = false
                            this.$set(this.prepareVideo, 'vLoad_' + file._id, false)

                            throw new Error('Get file by ID failed. ')
                        }
                const blob = await this.downloadFile(file, returnedData, true) // .then((blob) => {
                        if (!blob) {
                            // this.prepareVideo['vLoad_' + file._id] = false
                            this.$set(this.prepareVideo, 'vLoad_' + file._id, false)

                            throw new Error('Create video blob failed. ')
                        }
                        this.videoBlobUrl = blob
                    // })
                    console.log('Video is available now: ' + this.videoBlobUrl)
                    // this.showVideo['v' + file._id] = true
                    console.log('TEST: v' + file._id)
                    // this.jaytest = videojs('idtest')
                    // this.jaytest.src({type: 'video/mp4', src: this.videoBlobUrl})
                    // this.jaytest.load()
                    // console.log('TEST after: v' + this.jaytest)
                    // this.jaytest = this.$refs.jRef[0].player
                    // this.jaytest.src({type: 'video/mp4', src: this.videoBlobUrl})
                    // this.jaytest.load()
                    // this.videoOptions.sources.src = this.videoBlobUrl
                    // this.videoOptions.sources.type = file.contentType
                    this.$set(this.videoOptions, 'sources', [
                        {
                            src: this.videoBlobUrl,
                            type: file.contentType
                        }
                    ])
                    // this.$set(this.videoOptions.sources, 'type', )
                    this.$set(this.showVideo, 'v' + file._id, true)

                    this.showToast('success', 'Video is available now. ')

                    // this.prepareVideo['vLoad_' + file._id] = false

                    this.$set(this.prepareVideo, 'vLoad_' + file._id, false)
                // }).catch((error) => {
                //     this.showToast('danger', 'Fetch video file failed. ' + error.message)
                // })
            }
        },
        watch: {
            isLoading () {
                if (this.isLoading) {
                    this.$el.scrollTop = this.$el.scrollHeight
                }
            }
        },
        async mounted () {
            await this.fetchAllFiles()
        }
    }
</script>
