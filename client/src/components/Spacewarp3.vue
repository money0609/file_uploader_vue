<template>
    <div>
        <div id="spacewarpContainer" ref="spacewarpContainer"></div>
        <div id="blocker"></div>
    </div>
</template>

<script>
// import * as Three from 'three'
import * as THREE from 'three/build/three.module.js'

export default ({
    data () {
        return {
            jaytest: null,
            camera: null,
            scene: null,
            controls: null,
            renderer: null,
            parameters: null,
            mouseX: 0,
            mouseY: 0,
            windowHalfX: window.innerWidth / 2,
            windowHalfY: window.innerHeight / 2,
            materials: []
        }
    },
    methods: {
        init () {
            console.log('In THREE INIT')
            const spacewarpContainer = this.$refs.spacewarpContainer

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000)
            this.camera.position.z = 1000

            this.scene = new THREE.Scene()
            this.scene.fog = new THREE.FogExp2(0x000000, 0.0008)

            const geometry = new THREE.BufferGeometry()
            const vertices = []

            const textureLoader = new THREE.TextureLoader()

            const sprite1 = textureLoader.load('https://i.ibb.co/ZY8TSf5/snowflake2.png')
            const sprite2 = textureLoader.load('https://i.ibb.co/ZY8TSf5/snowflake2.png')
            const sprite3 = textureLoader.load('https://i.ibb.co/ZY8TSf5/snowflake2.png')
            const sprite4 = textureLoader.load('https://i.ibb.co/ZY8TSf5/snowflake2.png')
            const sprite5 = textureLoader.load('https://i.ibb.co/ZY8TSf5/snowflake2.png')

            for (let i = 0; i < 200; i++) {
                const x = Math.random() * 2000 - 1000
                const y = Math.random() * 2000 - 1000
                const z = Math.random() * 2000 - 1000

                vertices.push(x, y, z)
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

            this.parameters = [
                [[1.0, 0.2, 0.5], sprite2, 20],
                [[0.95, 0.1, 0.5], sprite3, 15],
                [[0.90, 0.05, 0.5], sprite1, 10],
                [[0.85, 0, 0.5], sprite5, 8],
                [[0.80, 0, 0.5], sprite4, 5]
            ]

            for (let i = 0; i < this.parameters.length; i++) {
                const color = this.parameters[i][0]
                const sprite = this.parameters[i][1]
                const size = this.parameters[i][2]

                this.materials[i] = new THREE.PointsMaterial({ size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true })
                this.materials[i].color.setHSL(color[0], color[1], color[2])

                const particles = new THREE.Points(geometry, this.materials[i])

                particles.rotation.x = Math.random() * 6
                particles.rotation.y = Math.random() * 6
                particles.rotation.z = Math.random() * 6

                this.scene.add(particles)
            }

            //

            this.renderer = new THREE.WebGLRenderer()
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            spacewarpContainer.appendChild(this.renderer.domElement)

            // document.body.style.touchAction = 'none'
            // document.body.addEventListener('pointermove', this.onPointerMove())

            //

            window.addEventListener('resize', this.onWindowResize())
        },
        onWindowResize () {
            this.windowHalfX = window.innerWidth / 2
            this.windowHalfY = window.innerHeight / 2

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
            this.render()
        },
        render () {
            const time = Date.now() * 0.00005

            this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05
            this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05

            this.camera.lookAt(this.scene.position)

            for (let i = 0; i < this.scene.children.length; i++) {
                const object = this.scene.children[i]

                if (object instanceof THREE.Points) {
                    object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1))
                }
            }

            for (let i = 0; i < this.materials.length; i++) {
                const color = this.parameters[i][0]

                const h = (360 * (color[0] + time) % 360) / 360
                this.materials[i].color.setHSL(h, color[1], color[2])
            }

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
