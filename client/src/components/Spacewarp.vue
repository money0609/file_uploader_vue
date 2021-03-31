<template>
    <div id="spacewarpContainer" ref="spacewarpContainer"></div>
</template>

<script>
import * as Three from 'three/build/three.module.js'

export default ({
    data () {
        return {
            jaytest: null,
            camera: null,
            scene: null,
            renderer: null,
            mesh: null,
            stars: null,
            starsNum: 5000,
            position: null,
            positionArr: [],
            velocityArr: []
        }
    },
    methods: {
        init () {
            console.log('In THREE INIT')
            const spacewarpContainer = this.$refs.spacewarpContainer

            // ************************    Cube    ************************
            // this.camera = new Three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
            // this.camera.position.z = 1

            // this.scene = new Three.Scene()

            // const geometry = new Three.BoxGeometry(0.2, 0.2, 0.2)
            // const material = new Three.MeshNormalMaterial()

            // this.mesh = new Three.Mesh(geometry, material)
            // this.scene.add(this.mesh)

            // this.renderer = new Three.WebGLRenderer({ antialias: true })
            // this.renderer.setSize(spacewarpContainer.clientWidth, spacewarpContainer.clientHeight)
            // spacewarpContainer.appendChild(this.renderer.domElement)

            // this.jaytest = Three

            // ************************    Spacewarp    ************************
            // const starGeom = new Three.SphereGeometry()
            const starGeom = new Three.BufferGeometry()
            this.scene = new Three.Scene()
            // this.scene.fog = new Three.FogExp2(0x000000, 0.001)

            // setup camera with facing upward
            this.camera = new Three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 2, 2000)
            this.camera.position.z = 1
            this.camera.rotation.x = Math.PI / 2

            // const sprite = new Three.TextureLoader().load('../assets/sprite.jpg')

            const vertices = {
                position: [],
                velocity: []
            }

            for (let i = 0; i < this.starsNum; i++) {
                const x = 2000 * Math.random() - 1000
                const y = 2000 * Math.random() - 1000
                const z = 2000 * Math.random() - 1000

                vertices.position.push(x, y, z)
                vertices.velocity[i] = 0
            }

            starGeom.setAttribute('position', new Three.Float32BufferAttribute(vertices.position, 3))
            starGeom.setAttribute('velocity', new Three.Float32BufferAttribute(vertices.velocity, 1))

            const starMaterial = new Three.PointsMaterial({
                color: 0xffffff,
                size: 0.7,
                map: new Three.TextureLoader().load('https://i.ibb.co/phHQQMH/particle-sprite.png')
            })
            // setup renderer
            this.renderer = new Three.WebGLRenderer()

            // will set overflow hidden later on.

            this.renderer.setSize(window.innerWidth, window.innerHeight)
            // append the scene to the div
            spacewarpContainer.appendChild(this.renderer.domElement)

            // const starNum = 1000

            // starGeom.setAttribute('position', new Three.BufferAttribute(new Float32Array(6 * starNum), 3))

            this.position = starGeom.getAttribute('position')
            this.positionArr = this.position.array
            this.velocityArr = starGeom.getAttribute('velocity').array

            this.stars = new Three.Points(starGeom, starMaterial)

            this.scene.add(this.stars)

            // play it
            this.animate()
        },
        animate () {
            // console.log('In animate')
            // ************************    Cube    ************************
            // requestAnimationFrame(this.animate)
            // this.mesh.rotation.x += 0.01
            // this.mesh.rotation.y += 0.02
            // this.renderer.render(this.scene, this.camera)

            // ************************    Spacewarp    ************************
            const acceleration = 0.002

            for (let i = 0; i < this.starsNum; i++) {
                this.velocityArr[2 * i] += acceleration
                this.positionArr[6 * i + 1] -= this.velocityArr[2 * i]

                if (this.positionArr[6 * i + 1] < -200) {
                    this.positionArr[6 * i + 1] = Three.MathUtils.randFloatSpread(2000)
                    this.velocityArr[2 * i] = 0
                }
            }
            this.position.needsUpdate = true
            this.stars.rotation.y += 0.0002
            this.renderer.render(this.scene, this.camera)
            requestAnimationFrame(this.animate)
        }
    },
    mounted () {
        this.init()
        // this.animate()
        console.log('Test working.')
    }
})
</script>
