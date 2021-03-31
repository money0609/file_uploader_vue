<template>
    <div id="spacewarpContainer" ref="spacewarpContainer"></div>
</template>

<script>
import * as Three from 'three'

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
            velocity: null,
            velocityArr: []
        }
    },
    methods: {
        init () {
            console.log('In THREE INIT')
            const spacewarpContainer = this.$refs.spacewarpContainer

            const starGeom = new Three.BufferGeometry()
            starGeom.setAttribute('position', new Three.BufferAttribute(new Float32Array(6 * this.starsNum), 3))
            starGeom.setAttribute('velocity', new Three.BufferAttribute(new Float32Array(2 * this.starsNum), 1))
            this.position = starGeom.getAttribute('position')
            this.positionArr = this.position.array
            this.velocity = starGeom.getAttribute('velocity')
            this.velocityArr = this.velocity.array

            this.scene = new Three.Scene()
            // this.scene.fog = new Three.FogExp2(0x000000, 0.001)

            // setup camera with facing upward
            this.camera = new Three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
            this.camera.position.z = 200
            // this.camera.rotation.x = Math.PI / 2

            // setup renderer
            this.renderer = new Three.WebGLRenderer({ antialias: true })
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            // append the scene to the div
            spacewarpContainer.appendChild(this.renderer.domElement)

            // const sprite = new Three.TextureLoader().load('../assets/sprite.jpg')

            for (let i = 0; i < this.starsNum; i++) {
                const x1 = 400 * Math.random() - 200
                const y1 = 200 * Math.random() - 100
                const z1 = 500 * Math.random() - 100

                // Line one end
                this.positionArr[i * 6] = x1
                this.positionArr[i * 6 + 1] = y1
                this.positionArr[i * 6 + 2] = z1

                // Line the other end
                this.positionArr[i * 6 + 3] = x1
                this.positionArr[i * 6 + 4] = y1
                this.positionArr[i * 6 + 5] = z1

                this.velocityArr[i * 2] = this.velocityArr[i * 2 + 1] = 0
            }
            let starMaterial = new Three.LineBasicMaterial({ color: 0xffffff })

            this.stars = new Three.LineSegments(starGeom, starMaterial)

            this.scene.add(this.stars)

            // const starMaterial = new Three.PointsMaterial({
            //     color: 0xffffff,
            //     size: 0.7 // ,
            //     // map: new Three.TextureLoader().load('../assets/particle-sprite.png')
            // })

            // will set overflow hidden later on.

            // const starNum = 1000

            // starGeom.setAttribute('position', new Three.BufferAttribute(new Float32Array(6 * starNum), 3))

            // this.position = starGeom.getAttribute('position')
            // this.positionArr = this.position.array
            // this.velocityArr = starGeom.getAttribute('velocity').array

            // this.stars = new Three.Points(starGeom, starMaterial)

            window.addEventListener(
                'resize',
                this.onWindowResize(),
                false
            )
            // play it
            this.animate()
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

            for (let i = 0; i < this.starsNum; i++) {
                this.velocityArr[2 * i] += 0.03
                this.velocityArr[2 * i + 1] += 0.03

                this.positionArr[6 * i + 2] += this.velocityArr[2 * i]

                this.positionArr[6 * i + 5] += this.velocityArr[2 * i + 1]

                if (this.positionArr[6 * i + 5] > 200) {
                    const zLoc = Math.random() * 200 - 100
                    this.positionArr[6 * i + 2] = zLoc
                    this.positionArr[6 * i + 5] = zLoc

                    this.velocityArr[2 * i] = 0
                    this.velocityArr[2 * i + 1] = 0
                }
            }

            this.position.needsUpdate = true
            this.stars.rotation.z += 0.002
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
