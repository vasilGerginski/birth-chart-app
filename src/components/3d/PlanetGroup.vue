<template>
  <TresGroup ref="planetsGroup">
    <Planet
      v-for="(planet, key) in planetaryData"
      :key="key"
      :planet-data="planet"
      :planet-key="key"
    />
  </TresGroup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRenderLoop } from '@tresjs/core'
import Planet from './Planet.vue'

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const planetsGroup = ref()

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

const planetaryData = computed(() => {
  const data = {}
  
  Object.entries(props.chartData.planetaryPositions).forEach(([key, planet]) => {
    const angle = ((planet.house - 1) * 30 + planet.degree - 90) * Math.PI / 180
    const radius = 4 + Math.random() * 2
    const height = (Math.random() - 0.5) * 2
    
    data[key] = {
      ...planet,
      position: [
        radius * Math.cos(angle),
        height,
        radius * Math.sin(angle)
      ],
      color: planetColors[planet.name] || '#b794f6',
      size: planet.name === 'Sun' ? 0.6 : planet.name === 'Moon' ? 0.5 : 0.4
    }
  })
  
  return data
})

// Animate floating planets
const { onBeforeRender } = useRenderLoop()
onBeforeRender(() => {
  if (planetsGroup.value) {
    planetsGroup.value.children.forEach((planet, index) => {
      if (planet.position) {
        planet.position.y = Math.sin(Date.now() * 0.001 + index) * 0.2
      }
    })
  }
})
</script>