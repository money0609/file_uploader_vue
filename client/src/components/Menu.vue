<template>
    <div id="menuContainer">
        <v-card>
            <v-navigation-drawer
                v-model="drawer"
                permanent
                expand-on-hover
            >
                <v-list-item class="px-2">
                    <v-list-item-avatar>
                        <v-img :src="require('../assets/logo.png')" aspect-ratio="1"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-title>File Uploader</v-list-item-title>

                </v-list-item>

                <v-divider></v-divider>

                <v-list dense>
                    <v-list-item
                        v-for="item in items"
                        :key="item.title"
                        link
                        @click="handleFunctionCall(item.callFunc)"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <input
                    ref="uploader"
                    class="d-none"
                    type="file"
                    name="file"
                    @change="onFileChanged"
                    @click="() => this.$refs.uploader.value = ''"
                >
            </v-navigation-drawer>
        </v-card>
        <FileContent :selectedFiles="selectedFiles" :isLoading="isLoading" :username="this.username" ref="fileContent"/>
    </div>
</template>

<script>
import FileService from '@/services/FileService'
import FileContent from './FileContent'
import { toastMixin } from '../../mixins/Mixin'

export default {
    mixins: [toastMixin],
    props: ['username'],
    components: {
        FileContent
    },
    data () {
      return {
        selectedFiles: {
            uploadProgress: 0,
            files: []
        },
        isLoading: false,
        drawer: true,
        items: [
          { title: 'Upload', icon: 'mdi-cloud-upload', callFunc: 'uploadFileClick' }// ,
          // { title: 'My Account', icon: 'mdi-account', callFunc: '' },
          // { title: 'Users', icon: 'mdi-account-group-outline', callFunc: '' }
        ],
        mini: true
      }
    },
    methods: {
        handleFunctionCall (functioName) {
            this[functioName]()
        },
        uploadFileClick () {
            // Show user that Multi uploading not supported yet if user clicked upload btn while it's loading. If it's not loading, then reset the progress value
            if (this.isLoading) {
                this.showToast('warning', 'The secret to multitasking is that it isn’t actually multitasking. It’s just extreme focus and organization. Not supported just yet :)')

                return
            } else {
                if (this.selectedFiles.uploadProgress === 100) {
                    this.selectedFiles.uploadProgress = 0
                    this.isLoading = false
                }
            }

            this.$refs.uploader.click()
        },
        async readFileAsDataURL (image) {
            try {
                let resultBase64 = await new Promise((resolve) => {
                    let fileReader = new FileReader()
                    fileReader.onload = (e) => resolve(fileReader.result)
                    fileReader.readAsDataURL(image)
                })

                console.log('Testing readFile func: ' + resultBase64) // aGV5IHRoZXJl...

                return resultBase64
            } catch (error) {
                throw new Error(error.message)
            }
        },
        async preLoadFile (imgBase64, videoBlobUrl) {
            console.log('IN PRE LOAD CHECK BASE64: ' + this.username)
            let preUploadData = { username: this.username }

            if (imgBase64) {
                preUploadData.base64Str = imgBase64
            }

            if (videoBlobUrl) {
                preUploadData.videoBlobUrl = videoBlobUrl
            }

            await FileService.preUpload(preUploadData).then((returnedData) => {
                console.log('preLoadFile end')
                console.log(returnedData)
                return returnedData
            }).catch((error) => {
                this.showToast('danger', error.message)
                this.selectedFiles.uploadProgress = 0
                this.isLoading = false
            })
        },
        async onFileChanged (e) {
            let selectedFileList = e.target.files

            console.log('!! SELECTED LEN: ' + JSON.stringify(selectedFileList[0]))
            if (!selectedFileList.length || selectedFileList.length < 1) {
                console.log('Must select at least 1 file!')
                return
            }

            // Show loading card
            this.isLoading = true

            //  !!!!!!!!!!!!!!!!!!!!!!!!!!!! Check if the file exists. Yes, warning & return; No, continue.

            const formData = new FormData()

            for (let i = 0; i < selectedFileList.length; i++) {
                let imgBase64 = ''
                let videoBlobUrl = ''

                if (selectedFileList[i].type.search(/^image\/.*/) > -1) {
                    imgBase64 = await this.readFileAsDataURL(selectedFileList[i])
                } else if (selectedFileList[i].type.search(/^video\/.*/) > -1) {
                    videoBlobUrl = selectedFileList[i]
                }

                await this.preLoadFile(imgBase64, videoBlobUrl)

                formData.append('file', selectedFileList[i])
            }

            let config = {
                headers: { 'content-type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    // console.log('Loaded: ' + progressEvent.loaded + ' Total: ' + progressEvent.total)
                    this.selectedFiles.uploadProgress = Math.round((progressEvent.loaded * 90) / progressEvent.total)
                }
            }

            await FileService.upload(formData, config).then((returnedData) => {
                if (returnedData && returnedData.files) {
                    this.$refs.fileContent.updateFileContent(returnedData.files)
                    returnedData.files.forEach(element => {
                        console.log('test loop ele: ' + element)

                        // this.uploadedFiles.push(element)
                    })
                    this.selectedFiles.uploadProgress = 100

                    // Hide loading card and reset progress value
                    this.isLoading = false
                    this.selectedFiles.uploadProgress = 0

                    // scroll to the file position (end of page)
                    this.$el.querySelector('#fileContentContainer').scrollTop = this.$el.querySelector('#fileContentContainer').scrollHeight
                } else {
                    this.showToast('danger', 'Something broken, no uploaded files found.')
                    this.selectedFiles.uploadProgress = 0
                    this.isLoading = false
                }
            }).catch((error) => {
                this.showToast('danger', error.message)
                this.selectedFiles.uploadProgress = 0
                this.isLoading = false
            })
        }
    }
}
</script>
