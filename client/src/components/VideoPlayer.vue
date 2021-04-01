<template>
    <div class="videoContainer">
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
        // Initialize videojs Object.
        this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady () {
            // Do something on player ready eventually.
        })
    },
    beforeDestroy () {
        if (this.player) {
            this.player.dispose()
        }
    }
}
</script>
