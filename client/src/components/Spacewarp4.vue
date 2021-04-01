<template>
    <div id="spacewarpContainer" ref="spacewarpContainer"></div>
</template>

<script>
// import * as Three from 'three'
import * as THREE from 'three/build/three.module.js'
import * as POSTPROCESSING from 'postprocessing'
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
// import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
//   CSS3DRenderer,
export default ({
    data () {
        return {
            jaytest: null,
            camera: null,
            scene: null,
            cloudParticles: [],
            controls: null,
            renderer: null,
            composer: null,
            parameters: null,
            mouseX: 0,
            mouseY: 0,
            target: new THREE.Vector3(),
            windowHalfX: window.innerWidth / 2,
            windowHalfY: window.innerHeight / 2,
            materials: []
        }
    },
    methods: {
        init () {
            console.log('In THREE INIT')
            // this.spacewarpContainer = this.$refs.spacewarpContainer
            let cloudMaterial = null
            let cloudGeo = null

            this.scene = new THREE.Scene()
            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
            this.camera.position.z = 1
            this.camera.rotation.x = 1.16
            this.camera.rotation.y = -0.12
            this.camera.rotation.z = 0.27
            let ambient = new THREE.AmbientLight(0x555555) // 80ffff
            this.scene.add(ambient)

            let directionalLight = new THREE.DirectionalLight(0xf2f2f2)
            directionalLight.position.set(0, 0, 1)
            this.scene.add(directionalLight)

            let orangeLight = new THREE.PointLight(0xcc6600, 50, 450, 1.7)
            orangeLight.position.set(200, 300, 100)
            this.scene.add(orangeLight)

            let redLight = new THREE.PointLight(0xd8547e, 50, 450, 1.7)
            redLight.position.set(100, 300, 100)
            this.scene.add(redLight)

            let blueLight = new THREE.PointLight(0x3677ac, 50, 450, 1.7)
            blueLight.position.set(300, 300, 200)
            this.scene.add(blueLight)

            this.renderer = new THREE.WebGLRenderer()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.scene.fog = new THREE.FogExp2(0x010b13, 0) // 80ffff
            this.renderer.setClearColor(this.scene.fog.color)
            this.$refs.spacewarpContainer.appendChild(this.renderer.domElement)

            let loader = new THREE.TextureLoader()
            loader.load('https://i.ibb.co/4Yn1YCr/smoke-1.png', (texture) => {
                // texture is loaded
                cloudGeo = new THREE.PlaneBufferGeometry(500, 500)
                cloudMaterial = new THREE.MeshLambertMaterial({
                    map: texture,
                    transparent: true
                })

                for (let p = 0; p < 30; p++) {
                    let cloud = new THREE.Mesh(cloudGeo, cloudMaterial)

                    cloud.position.set(
                        Math.random() * 800 - 400,
                        500,
                        Math.random() * 500 - 500
                    )

                    cloud.rotation.x = 1.16
                    cloud.rotation.y = -0.12
                    cloud.rotation.z = Math.random() * 2 * Math.PI

                    cloud.material.opacity = 0.55

                    this.cloudParticles.push(cloud)

                    this.scene.add(cloud)
                }
            })

            const sudo = this
            loader.load('https://i.ibb.co/M2BPHFz/space-stars.jpg', function (texture) {
                const textureEffect = new POSTPROCESSING.TextureEffect({
                    blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
                    texture: texture
                })

                textureEffect.blendMode.opacity.value = 0.8

                const bloomEffect = new POSTPROCESSING.BloomEffect({
                    blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
                    kernelSize: POSTPROCESSING.KernelSize.SMALL,
                    useLuminanceFilter: true,
                    luminanceThreshold: 0.3,
                    luminanceSmoothing: 0.75
                })
                bloomEffect.blendMode.opacity.value = 1.5

                let effectPass = new POSTPROCESSING.EffectPass(
                    sudo.camera,
                    bloomEffect,
                    textureEffect
                )

                effectPass.renderToScreen = true

                sudo.composer = new POSTPROCESSING.EffectComposer(sudo.renderer)

                sudo.composer.addPass(new POSTPROCESSING.RenderPass(sudo.scene, sudo.camera))

                sudo.composer.addPass(effectPass)

                sudo.render()
            })

            // add cards
            // const cardContainer = document.getElementById('menuContainer')

            // const objectCSS = new CSS3DObject(cardContainer)
            // objectCSS.position.x = Math.random() * 4000 - 2000
            // objectCSS.position.y = Math.random() * 4000 - 2000
            // objectCSS.position.z = Math.random() * 4000 - 2000
            // this.scene.add(objectCSS)
            // spacewarpContainer.appendChild(cardContainer)
            // window.addEventListener('resize', this.onWindowResize(), false)

            // const cameraPerspectiveHelper = new THREE.CameraHelper(this.camera)
            // this.scene.add(cameraPerspectiveHelper)
        },
        onWindowResize () {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        },
        onPointerMove (event) {
            if (!event || event.isPrimary === false) {
                return
            }
            this.mouseX = event.clientX - this.windowHalfX
            this.mouseY = event.clientY - this.windowHalfY
            // console.log('X: ' + event.clientX + ', Y: ' + event.clientY)
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

            // this.target.x += (this.mouseX - this.target.x) * 0.02
            // this.target.y += (-this.mouseY - this.target.y) * 0.02
            // this.target.z = this.camera.position.z

            // this.camera.lookAt(this.target)
            this.render()
        },
        render () {
            for (let i = 0; i < this.cloudParticles.length; i++) {
                this.cloudParticles[i].rotation.z -= 0.001
            }

            this.composer.render(0.1)

            // this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05
            // this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05

            // this.camera.lookAt(this.scene.position)
            // console.log('X-Y-Z: ' + this.camera.position.x + '-' + this.camera.position.y + '-' + this.camera.position.z)

            this.renderer.render(this.scene, this.camera)
            requestAnimationFrame(this.render)
        }
    },
    created: function () {
        window.addEventListener('resize', this.onWindowResize)
        // document.addEventListener('mousemove', this.onPointerMove)
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.onWindowResize)
        // document.removeEventListener('mousemove', this.onPointerMove)
    },
    mounted () {
        this.init()
        // this.animate()
        console.log('Test working.')
    }
})
</script>
