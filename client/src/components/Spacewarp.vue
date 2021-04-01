<template>
    <div id="spacewarpContainer" ref="spacewarpContainer"></div>
</template>

<script>
import * as THREE from 'three/build/three.module.js'
import * as POSTPROCESSING from 'postprocessing'

export default ({
    data () {
        return {
            camera: null,
            scene: null,
            cloudParticles: [],
            renderer: null,
            composer: null
        }
    },
    methods: {
        init () {
            let cloudMaterial = null
            let cloudGeo = null

            this.scene = new THREE.Scene()
            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)

            // set camera position Z to 1.
            this.camera.position.z = 1

            // roate camera to see all of the plane objects.
            this.camera.rotation.x = 1.16
            this.camera.rotation.y = -0.12
            this.camera.rotation.z = 0.27

            // set lights color and postion.
            let ambient = new THREE.AmbientLight(0x555555)
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

            this.scene.fog = new THREE.FogExp2(0x010b13, 0)

            this.renderer.setClearColor(this.scene.fog.color)

            // append to the div
            this.$refs.spacewarpContainer.appendChild(this.renderer.domElement)

            // add Cloud texture
            let loader = new THREE.TextureLoader()
            loader.load('https://i.ibb.co/4Yn1YCr/smoke-cloud.png', (texture) => {
                // texture is loaded
                cloudGeo = new THREE.PlaneBufferGeometry(500, 500)
                cloudMaterial = new THREE.MeshLambertMaterial({
                    map: texture,
                    transparent: true
                })

                // generate 30 clouds
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
        },
        onWindowResize () {
            const container = document.querySelector('#spacewarpContainer')

            if (container.offsetWidth > 250 && container.offsetHeight > 500) {
                this.camera.aspect = container.offsetWidth / container.offsetHeight

                this.camera.updateProjectionMatrix()

                this.renderer.setSize(container.offsetWidth, container.offsetHeight)
            }
        },
        render () {
            for (let i = 0; i < this.cloudParticles.length; i++) {
                this.cloudParticles[i].rotation.z -= 0.001
            }

            this.composer.render(0.1)

            this.renderer.render(this.scene, this.camera)

            requestAnimationFrame(this.render)
        }
    },
    created: function () {
        window.addEventListener('resize', this.onWindowResize)
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.onWindowResize)
    },
    mounted () {
        this.init()
    }
})
</script>
