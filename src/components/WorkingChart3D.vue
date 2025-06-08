<template>
  <div class="canvas-container">
    <canvas ref="canvas3d"></canvas>
    
    <!-- Info Panel -->
    <transition name="fade">
      <div v-if="hoveredPlanet" class="planet-info glass-panel">
        <h4>{{ hoveredPlanet.name }} {{ hoveredPlanet.symbol }}</h4>
        <p><strong>Sign:</strong> {{ hoveredPlanet.sign.name }} {{ hoveredPlanet.sign.symbol }}</p>
        <p><strong>House:</strong> {{ hoveredPlanet.house }}</p>
        <p><strong>Degree:</strong> {{ hoveredPlanet.degree }}°</p>
        <p class="planet-meaning">{{ hoveredPlanet.meaning }}</p>
      </div>
    </transition>
    
    <!-- Controls -->
    <div class="controls glass-panel">
      <button @click="toggleRotation" class="control-btn">
        {{ autoRotate ? '⏸️' : '▶️' }} Rotation
      </button>
      <button @click="resetCamera" class="control-btn">
        🎯 Reset View
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'WorkingChart3D',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const canvas3d = ref(null)
    const hoveredPlanet = ref(null)
    const autoRotate = ref(true)
    
    let scene, camera, renderer, controls
    let zodiacGroup, planetsGroup
    let raycaster, mouse
    let animationId
    
    const zodiacSigns = [
      { name: 'Aries', symbol: '♈', color: 0xff6b6b },
      { name: 'Taurus', symbol: '♉', color: 0x4ecdc4 },
      { name: 'Gemini', symbol: '♊', color: 0xffe66d },
      { name: 'Cancer', symbol: '♋', color: 0xa8dadc },
      { name: 'Leo', symbol: '♌', color: 0xff9f1c },
      { name: 'Virgo', symbol: '♍', color: 0x95e1d3 },
      { name: 'Libra', symbol: '♎', color: 0xf38181 },
      { name: 'Scorpio', symbol: '♏', color: 0xaa96da },
      { name: 'Sagittarius', symbol: '♐', color: 0xfcbad3 },
      { name: 'Capricorn', symbol: '♑', color: 0x8fcaca },
      { name: 'Aquarius', symbol: '♒', color: 0xa8e6cf },
      { name: 'Pisces', symbol: '♓', color: 0xffd3b6 }
    ]
    
    const planetColors = {
      Sun: 0xffd700,
      Moon: 0xc0c0c0,
      Mercury: 0x8b7355,
      Venus: 0xff69b4,
      Mars: 0xdc143c,
      Jupiter: 0xdaa520,
      Saturn: 0xf4a460,
      Uranus: 0x4fdddd,
      Neptune: 0x4169e1,
      Pluto: 0x8b4513
    }
    
    const init = () => {
      // Scene setup
      scene = new THREE.Scene()
      scene.fog = new THREE.Fog(0x0a0a0f, 10, 50)
      
      // Camera setup
      camera = new THREE.PerspectiveCamera(
        50,
        canvas3d.value.clientWidth / canvas3d.value.clientHeight,
        0.1,
        1000
      )
      camera.position.set(0, 5, 20)
      
      // Renderer setup
      renderer = new THREE.WebGLRenderer({ 
        canvas: canvas3d.value,
        antialias: true,
        alpha: true
      })
      renderer.setSize(canvas3d.value.clientWidth, canvas3d.value.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      
      // Controls
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.autoRotate = autoRotate.value
      controls.autoRotateSpeed = 0.5
      
      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
      scene.add(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
      directionalLight.position.set(10, 10, 5)
      scene.add(directionalLight)
      
      const pointLight = new THREE.PointLight(0xb794f6, 1, 20)
      pointLight.position.set(0, 0, 0)
      scene.add(pointLight)
      
      // Raycaster for interactions
      raycaster = new THREE.Raycaster()
      mouse = new THREE.Vector2()
      
      createStars()
      createZodiacWheel()
      createPlanets()
      
      // Event listeners
      canvas3d.value.addEventListener('mousemove', onMouseMove)
      window.addEventListener('resize', onWindowResize)
    }
    
    const createStars = () => {
      const starsGeometry = new THREE.BufferGeometry()
      const starsVertices = []
      
      for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 200
        const y = (Math.random() - 0.5) * 200
        const z = (Math.random() - 0.5) * 200
        starsVertices.push(x, y, z)
      }
      
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))
      
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
      })
      
      const stars = new THREE.Points(starsGeometry, starsMaterial)
      scene.add(stars)
    }
    
    const createZodiacWheel = () => {
      zodiacGroup = new THREE.Group()
      
      // Main wheel
      const wheelGeometry = new THREE.RingGeometry(8, 10, 32)
      const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0xb794f6,
        emissive: 0xb794f6,
        emissiveIntensity: 0.2,
        metalness: 0.8,
        roughness: 0.2,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      })
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.rotation.x = -Math.PI / 2
      zodiacGroup.add(wheel)
      
      // Zodiac markers
      zodiacSigns.forEach((sign, index) => {
        const angle = (index * 30 - 90) * Math.PI / 180
        const radius = 9
        
        const markerGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.5)
        const markerMaterial = new THREE.MeshStandardMaterial({
          color: sign.color,
          emissive: sign.color,
          emissiveIntensity: 0.3
        })
        const marker = new THREE.Mesh(markerGeometry, markerMaterial)
        marker.position.set(
          radius * Math.cos(angle),
          0.2,
          radius * Math.sin(angle)
        )
        zodiacGroup.add(marker)
      })
      
      scene.add(zodiacGroup)
    }
    
    const createPlanets = () => {
      planetsGroup = new THREE.Group()
      
      Object.entries(props.chartData.planetaryPositions).forEach(([key, planet]) => {
        const angle = ((planet.house - 1) * 30 + planet.degree - 90) * Math.PI / 180
        const radius = 4 + Math.random() * 2
        const height = (Math.random() - 0.5) * 2
        
        // Planet sphere
        const size = planet.name === 'Sun' ? 0.6 : planet.name === 'Moon' ? 0.5 : 0.4
        const geometry = new THREE.SphereGeometry(size, 16, 16)
        const material = new THREE.MeshStandardMaterial({
          color: planetColors[planet.name] || 0xb794f6,
          emissive: planetColors[planet.name] || 0xb794f6,
          emissiveIntensity: 0.4,
          metalness: 0.5,
          roughness: 0.2
        })
        
        const planetMesh = new THREE.Mesh(geometry, material)
        planetMesh.position.set(
          radius * Math.cos(angle),
          height,
          radius * Math.sin(angle)
        )
        planetMesh.userData = planet
        
        // Glow effect
        const glowGeometry = new THREE.SphereGeometry(size * 1.5, 16, 16)
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: planetColors[planet.name] || 0xb794f6,
          transparent: true,
          opacity: 0.2
        })
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
        planetMesh.add(glowMesh)
        
        planetsGroup.add(planetMesh)
      })
      
      scene.add(planetsGroup)
    }
    
    const onMouseMove = (event) => {
      const rect = canvas3d.value.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(planetsGroup.children, true)
      
      if (intersects.length > 0) {
        const planet = intersects[0].object.userData
        if (planet && planet.name) {
          hoveredPlanet.value = planet
          canvas3d.value.style.cursor = 'pointer'
        }
      } else {
        hoveredPlanet.value = null
        canvas3d.value.style.cursor = 'default'
      }
    }
    
    const onWindowResize = () => {
      camera.aspect = canvas3d.value.clientWidth / canvas3d.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvas3d.value.clientWidth, canvas3d.value.clientHeight)
    }
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      controls.update()
      
      // Rotate zodiac wheel
      if (zodiacGroup) {
        zodiacGroup.rotation.z += 0.001
      }
      
      // Float planets
      if (planetsGroup) {
        planetsGroup.children.forEach((planet, index) => {
          planet.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001
        })
      }
      
      renderer.render(scene, camera)
    }
    
    const toggleRotation = () => {
      autoRotate.value = !autoRotate.value
      controls.autoRotate = autoRotate.value
    }
    
    const resetCamera = () => {
      camera.position.set(0, 5, 20)
      controls.reset()
    }
    
    onMounted(() => {
      init()
      animate()
    })
    
    onUnmounted(() => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', onWindowResize)
      canvas3d.value?.removeEventListener('mousemove', onMouseMove)
      
      // Clean up Three.js
      renderer?.dispose()
      scene?.traverse((child) => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose())
          } else {
            child.material.dispose()
          }
        }
      })
    })
    
    return {
      canvas3d,
      hoveredPlanet,
      autoRotate,
      toggleRotation,
      resetCamera
    }
  }
}
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 500px;
  margin: 2rem 0;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 15px;
}

.planet-info {
  position: absolute;
  top: 20px;
  right: 20px;
  max-width: 250px;
  padding: 1.5rem;
  pointer-events: none;
}

.planet-info h4 {
  color: #b794f6;
  margin-bottom: 0.5rem;
}

.planet-info p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.planet-meaning {
  margin-top: 0.5rem;
  font-style: italic;
  color: #e9d8fd;
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.control-btn {
  background: rgba(183, 148, 246, 0.2);
  border: 1px solid rgba(183, 148, 246, 0.4);
  color: #e9d8fd;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.control-btn:hover {
  background: rgba(183, 148, 246, 0.3);
  transform: translateY(-2px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>