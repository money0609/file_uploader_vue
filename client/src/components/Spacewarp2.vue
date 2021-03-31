<template>
    <div>
        <div id="spacewarpContainer" ref="spacewarpContainer"></div>
        <div id="blocker"></div>
    </div>
</template>

<script>
// import * as Three from 'three'
import * as THREE from 'three/build/three.module.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

export default ({
    data () {
        return {
            jaytest: null,
            camera: null,
            scene: null,
            controls: null
        }
    },
    methods: {
        element (id, x, y, z, ry) {
            // const div = document.createElement('div')
            // div.style.width = '480px'
            // div.style.height = '360px'
            // div.style.backgroundColor = '#000'

            // const iframe = document.createElement('iframe')
            // iframe.style.width = '480px'
            // iframe.style.height = '360px'
            // iframe.style.border = '0px'
            // iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('')
            // div.appendChild(iframe)

            const object = new CSS3DObject(document.querySelector("#fileContentContainer > div:nth-child(1)"))
            object.position.set(x, y, z)
            object.rotation.y = ry

            return object
        },
        init () {
            console.log('In THREE INIT')
            const spacewarpContainer = this.$refs.spacewarpContainer

            this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000)
            this.camera.position.set(500, 350, 750)

            this.scene = new THREE.Scene()

            this.renderer = new CSS3DRenderer()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            spacewarpContainer.appendChild(this.renderer.domElement)

            const group = new THREE.Group()
            group.add(this.element('SJOz3qjfQXU', 0, 0, 0, 0))
            group.add(this.element('Y2-xZ-1HE-Q', 240, 0, 0, Math.PI / 2))
            group.add(this.element('IrydklNpcFI', 0, 0, -240, Math.PI))
            group.add(this.element('9ubytEsCaS0', -240, 0, 0, -Math.PI / 2))
            this.scene.add(group)

            this.controls = new TrackballControls(this.camera, this.renderer.domElement)
            this.controls.rotateSpeed = 4

            window.addEventListener('resize', this.onWindowResize())

            // Block iframe events when dragging camera

            const blocker = document.getElementById('blocker')
            blocker.style.display = 'none'

            this.controls.addEventListener('start', function () {
                blocker.style.display = ''
            })

            this.controls.addEventListener('end', function () {
                blocker.style.display = 'none'
            })
        },
        onWindowResize () {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        },
        animate () {
            // console.log('In animate')
            // ************************    Cube    ************************
            // requestAnimationFrame(this.animate)
            // this.mesh.rotation.x += 0.01
            // this.mesh.rotation.y += 0.02
            // this.renderer.render(this.scene, this.camera)

            // ************************    Spacewarp    ************************
            // eslint-disable-next-line
            requestAnimationFrame(this.animate)
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
        }
    },
    mounted () {
        this.init()
        this.animate()
        console.log('Test working.')
    }
})
</script>

<style>
    body {
        background-color: #ffffff;
    }

    #blocker {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
</style>
