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
        <FileContent :selectedFiles="selectedFiles"/>
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
        jaytest: '',
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
            console.log('Upload method clicked!')
            this.showToast('info', 'Upload method clicked!')
            this.$refs.uploader.click()
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
        async preLoadFile (imgBase64) {
            console.log('IN PRE LOAD CHECK BASE64: ' + this.username)
            let preUploadData = { username: this.username }

            if (imgBase64) {
                preUploadData.base64Str = imgBase64
            }

            await FileService.preUpload(preUploadData).then((returnedData) => {
                console.log('preLoadFile end')
                console.log(returnedData)
                return returnedData
            })
        },
        async onFileChanged (e) {
            let selectedFileList = e.target.files

            let selectedFileArr = []

            console.log('!! SELECTED LEN: ' + selectedFileList.length)
            if (!selectedFileList.length || selectedFileList.length < 1) {
                console.log('Must select at least 1 file!')
                return
            }

            // Check if the file exists. Yes, warning & return; No, continue.

            const formData = new FormData()
            for (let i = 0; i < selectedFileList.length; i++) {
                let imgBase64 = ''
                console.log('I am 1')
                if (selectedFileList[i].type.search(/^image\/.*/) > -1) {
                    const reader = new FileReader()

                    reader.addEventListener('load', () => {
                        // convert image file to base64 string
                        // console.log('File Base64: ' + reader.result)
                        imgBase64 = reader.result
                    }, false)

                    imgBase64 = await this.readFileAsDataURL(selectedFileList[i])
                    console.log(imgBase64 ? 'I am 2' : 'Missing 2')
                    await this.preLoadFile(imgBase64)
                    console.log('I am 3')
                }

                formData.append('file', selectedFileList[i])
                console.log('I am 4')
            }

            // Save selected files.
            this.selectedFiles.files = selectedFileArr

            let config = {
                headers: { 'content-type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    console.log('Loaded: ' + progressEvent.loaded + ' Total: ' + progressEvent.total)
                    this.selectedFiles.uploadProgress = Math.round((progressEvent.loaded * 90) / progressEvent.total)
                    // do something with the percentCompleted
                    // I used an observable to pass the data to a component and subscribed to it, to fill the progressbar
                    console.log('Progress Loaded: ' + progressEvent.loaded)
                    console.log('Current progress: ' + this.selectedFiles.uploadProgress)
                }
            }

            await FileService.upload(formData, config).then((returnedData) => {
                if (returnedData && returnedData.files) {
                    returnedData.files.forEach(element => {
                        console.log('test loop ele: ' + element)

                        // this.uploadedFiles.push(element)
                    })
                    this.selectedFiles.uploadProgress = 100
                } else {
                    this.showToast('danger', 'Something broken, no uploaded files found.')
                    this.selectedFiles.uploadProgress = 0
                }
            })
        }
    }
}
</script>
