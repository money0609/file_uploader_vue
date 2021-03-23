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
                    multiple
                    @change="onFileChanged"
                >
            </v-navigation-drawer>
        </v-card>
        <div id="fileContentContainer">

            <h1>{{ uploadedFiles.length }} uploaded file(s)</h1>
            <h1>Current Uoload progress: {{ this.selectedFiles.uploadProgress }}</h1>
            <v-progress-circular
                :rotate="-90"
                :size="100"
                :width="15"
                :value="selectedFiles.uploadProgress"
                color="teal"
            >
                {{ selectedFiles.uploadProgress }}
            </v-progress-circular>
            <FileContent/>
        </div>
    </div>
</template>

<script>
import FileService from '@/services/FileService'
import FileContent from './FileContent'

  export default {
    components: {
        FileContent
    },
    data () {
      return {
        selectedFiles: {
            uploadProgress: 0,
            files: []
        },
        uploadedFiles: [],
        drawer: true,
        items: [
          { title: 'Upload', icon: 'mdi-cloud-upload', callFunc: 'uploadFileClick' },
          { title: 'My Account', icon: 'mdi-account', callFunc: '' },
          { title: 'Users', icon: 'mdi-account-group-outline', callFunc: '' }
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

            this.$refs.uploader.click()
        },
        async onFileChanged (e) {
            let selectedFileArr = this.selectedFiles.files

            selectedFileArr = e.target.files
            console.log(selectedFileArr)
            if (!selectedFileArr.length || selectedFileArr.length < 1) {
                console.log('Must select at least 1 file!')
                return
            }

            const formData = new FormData()

            for (let i = 0; i < selectedFileArr.length; i++) {
                formData.append('file', selectedFileArr[i])
            }

            let config = {
                headers: { 'content-type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    console.log('Loaded: ' + progressEvent.loaded + ' Total: ' + progressEvent.total)
                this.selectedFiles.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    // do something with the percentCompleted
                    // I used an observable to pass the data to a component and subscribed to it, to fill the progressbar
                console.log('Progress Loaded: ' + progressEvent.loaded)
                console.log('Current progress: ' + this.selectedFiles.uploadProgress)
                }
            }

            // return axios.post(url, formData, config)
            await FileService.upload(formData, config).then((returnedData) => {
                if (returnedData && returnedData.files) {
                    returnedData.files.forEach(element => {
                        console.log('test loop ele: ' + element)
                        this.uploadedFiles.push(element)
                    })
                } else {
                    console.log('no returned data: ' + JSON.stringify(returnedData))
                }
            })
            // do something
        }
    }
  }
</script>
