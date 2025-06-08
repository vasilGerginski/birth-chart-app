<template>
  <div class="canvas-container">
    <TresCanvas clear-color="#0a0a0f" alpha>
      <TresPerspectiveCamera :position="[0, 8, 25]" :fov="50" />
      
      <!-- Lighting -->
      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight :position="[10, 10, 5]" :intensity="0.5" />
      <TresPointLight :position="[0, 0, 0]" :intensity="0.8" color="#b794f6" />
      
      <!-- Stars -->
      <TresPoints>
        <TresBufferGeometry>
          <TresBufferAttribute
            :args="[starsVertices, 3]"
            attach="attributes-position"
          />
        </TresBufferGeometry>
        <TresPointsMaterial
          color="white"
          :size="0.05"
          :transparent="true"
          :opacity="0.6"
        />
      </TresPoints>
      
      <!-- Zodiac Wheel -->
      <TresGroup ref="zodiacGroup">
        <!-- Outer ring -->
        <TresMesh :rotation="[-Math.PI / 2, 0, 0]">
          <TresRingGeometry :args="[8, 9, 64]" />
          <TresMeshStandardMaterial
            color="#b794f6"
            :emissive="'#b794f6'"
            :emissive-intensity="0.1"
            :metalness="0.7"
            :roughness="0.3"
            :transparent="true"
            :opacity="0.8"
          />
        </TresMesh>
        
        <!-- Zodiac signs -->
        <TresGroup
          v-for="(sign, index) in zodiacSigns"
          :key="sign.name"
          :position="getZodiacPosition(index)"
        >
          <TresMesh>
            <TresBoxGeometry :args="[0.5, 0.1, 0.5]" />
            <TresMeshStandardMaterial
              :color="sign.color"
              :emissive="sign.color"
              :emissive-intensity="0.3"
            />
          </TresMesh>
        </TresGroup>
      </TresGroup>
      
      <!-- Planets -->
      <TresGroup ref="planetsGroup">
        <TresGroup
          v-for="(planet, key) in planetaryData"
          :key="key"
          :position="planet.position"
        >
          <!-- Planet sphere -->
          <TresMesh
            @pointer-enter="() => onPlanetHover(planet)"
            @pointer-leave="onPlanetOut"
          >
            <TresSphereGeometry :args="[planet.size, 16, 16]" />
            <TresMeshStandardMaterial
              :color="planet.color"
              :emissive="planet.color"
              :emissive-intensity="hoveredPlanet === planet ? 0.6 : 0.3"
              :metalness="0.4"
              :roughness="0.3"
            />
          </TresMesh>
          
          <!-- Planet name text -->
          <TresMesh :position="[0, planet.size + 0.8, 0]">
            <TresPlaneGeometry :args="[1.5, 0.4]" />
            <TresMeshBasicMaterial
              :color="planet.color"
              :transparent="true"
              :opacity="0.8"
            />
          </TresMesh>
        </TresGroup>
      </TresGroup>
      
      <!-- Orbit controls -->
      <OrbitControls
        :enableDamping="true"
        :dampingFactor="0.05"
        :autoRotate="autoRotate"
        :autoRotateSpeed="0.3"
      />
    </TresCanvas>
    
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
      <button @click="resetView" class="control-btn">
        🎯 Reset View
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { TresCanvas, useRenderLoop } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const zodiacGroup = ref()
const planetsGroup = ref()
const hoveredPlanet = ref(null)
const autoRotate = ref(true)

const zodiacSigns = [
  { name: 'Aries', symbol: '♈', color: '#ff6b6b' },
  { name: 'Taurus', symbol: '♉', color: '#4ecdc4' },
  { name: 'Gemini', symbol: '♊', color: '#ffe66d' },
  { name: 'Cancer', symbol: '♋', color: '#a8dadc' },
  { name: 'Leo', symbol: '♌', color: '#ff9f1c' },
  { name: 'Virgo', symbol: '♍', color: '#95e1d3' },
  { name: 'Libra', symbol: '♎', color: '#f38181' },
  { name: 'Scorpio', symbol: '♏', color: '#aa96da' },
  { name: 'Sagittarius', symbol: '♐', color: '#fcbad3' },
  { name: 'Capricorn', symbol: '♑', color: '#8fcaca' },
  { name: 'Aquarius', symbol: '♒', color: '#a8e6cf' },
  { name: 'Pisces', symbol: '♓', color: '#ffd3b6' }
]

const planetColors = {
  Sun: '#ffd700',
  Moon: '#c0c0c0',
  Mercury: '#8b7355',
  Venus: '#ff69b4',
  Mars: '#dc143c',
  Jupiter: '#daa520',
  Saturn: '#f4a460',
  Uranus: '#4fdddd',
  Neptune: '#4169e1',
  Pluto: '#8b4513'
}

// Generate stars
const starsVertices = computed(() => {
  const vertices = new Float32Array(1500) // 500 stars
  for (let i = 0; i < 1500; i += 3) {
    vertices[i] = (Math.random() - 0.5) * 100
    vertices[i + 1] = (Math.random() - 0.5) * 100
    vertices[i + 2] = (Math.random() - 0.5) * 100
  }
  return vertices
})

const getZodiacPosition = (index) => {
  const angle = (index * 30 - 90) * Math.PI / 180
  const radius = 8.5
  return [
    radius * Math.cos(angle),
    0.2,
    radius * Math.sin(angle)
  ]
}

const planetaryData = computed(() => {
  const data = {}
  
  Object.entries(props.chartData.planetaryPositions).forEach(([key, planet]) => {
    const angle = ((planet.house - 1) * 30 + planet.degree - 90) * Math.PI / 180
    const radius = 3 + Math.random() * 2
    const height = (Math.random() - 0.5) * 1.5
    
    data[key] = {
      ...planet,
      position: [
        radius * Math.cos(angle),
        height,
        radius * Math.sin(angle)
      ],
      color: planetColors[planet.name] || '#b794f6',
      size: planet.name === 'Sun' ? 0.4 : planet.name === 'Moon' ? 0.3 : 0.25
    }
  })
  
  return data
})

const onPlanetHover = (planet) => {
  hoveredPlanet.value = planet
}

const onPlanetOut = () => {
  hoveredPlanet.value = null
}

const toggleRotation = () => {
  autoRotate.value = !autoRotate.value
}

const resetView = () => {
  autoRotate.value = true
}

// Animation loop
const { onBeforeRender } = useRenderLoop()
onBeforeRender(() => {
  // Rotate zodiac wheel slowly
  if (zodiacGroup.value) {
    zodiacGroup.value.rotation.z += 0.001
  }
  
  // Gentle planet floating
  if (planetsGroup.value) {
    planetsGroup.value.children.forEach((planet, index) => {
      if (planet.position) {
        planet.position.y += Math.sin(Date.now() * 0.0008 + index) * 0.001
      }
    })
  }
})
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 500px;
  margin: 2rem 0;
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