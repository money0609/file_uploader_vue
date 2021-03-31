<template>
    <div class="videoContainer">
        <!-- <video :id="'vid_' + fileId" ref="videoPlayer" class="video-js"></video> -->
        <video id="idtest" ref="videoPlayer" class="video-js"></video>
    </div>
</template>

<script>
import videojs from 'video.js'

export default {
    name: 'VideoPlayer',
    props: {
        options: {
            type: Object,
            default () {
                return {}
            }
        },
        fileId: {
            type: String,
            default () {
                return ''
            }
        }
    },
    data () {
        return {
            player: null
        }
    },
    mounted () {
        this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady () {
            console.log('onPlayerReady', this)
            // console.log('Play Ready check: ' + JSON.stringify(this.file))
        })

        // 605d051281106d646cd669f2
        this.player.bigPlayButton.on('click', function () {
            // do the action
            console.log('########## BIG BUTTON CLICKED: ' + JSON.stringify(this.options()))
        })
    },
    beforeDestroy () {
        if (this.player) {
            this.player.dispose()
        }
    }
}
</script>
