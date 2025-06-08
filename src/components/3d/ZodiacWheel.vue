<template>
  <TresGroup ref="zodiacGroup">
    <!-- Zodiac Segments -->
    <TresMesh
      v-for="(sign, index) in zodiacSigns"
      :key="`segment-${sign.name}`"
      :rotation="[-Math.PI / 2, 0, 0]"
    >
      <TresRingGeometry 
        :args="[8, 10, 32, 1, index * segmentAngle, segmentAngle]" 
      />
      <TresMeshStandardMaterial
        :color="sign.color"
        :emissive="sign.color"
        :emissive-intensity="0.2"
        :metalness="0.8"
        :roughness="0.2"
        :side="2"
      />
    </TresMesh>
    
    <!-- Zodiac Symbol Sprites -->
    <ZodiacSymbol 
      v-for="(sign, index) in zodiacSigns"
      :key="`symbol-${sign.name}`"
      :sign="sign"
      :position="getSymbolPosition(index)"
    />
    
    <!-- Zodiac Name Sprites -->
    <ZodiacName
      v-for="(sign, index) in zodiacSigns"
      :key="`name-${sign.name}`"
      :sign="sign"
      :position="getNamePosition(index)"
    />
  </TresGroup>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRenderLoop } from '@tresjs/core'
import ZodiacSymbol from './ZodiacSymbol.vue'
import ZodiacName from './ZodiacName.vue'

const zodiacGroup = ref()

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

const segmentAngle = computed(() => (Math.PI * 2) / 12)

const getSymbolPosition = (index) => {
  const angle = (index * 30 - 90) * Math.PI / 180
  const radius = 11
  return [
    radius * Math.cos(angle),
    1,
    radius * Math.sin(angle)
  ]
}

const getNamePosition = (index) => {
  const angle = (index * 30 - 90) * Math.PI / 180
  const radius = 12.5
  return [
    radius * Math.cos(angle),
    -0.5,
    radius * Math.sin(angle)
  ]
}

// Animate the zodiac wheel rotation
const { onBeforeRender } = useRenderLoop()
onBeforeRender(() => {
  if (zodiacGroup.value) {
    zodiacGroup.value.rotation.z += 0.001
  }
})
</script>