<template>
  <TresGroup :position="planetData.position">
    <!-- Main planet sphere -->
    <TresMesh
      :cast-shadow="true"
      :receive-shadow="true"
      @pointer-enter="onHover"
      @pointer-leave="onLeave"
    >
      <TresSphereGeometry :args="[planetData.size, 32, 32]" />
      <TresMeshStandardMaterial
        :color="planetData.color"
        :emissive="planetData.color"
        :emissive-intensity="isHovered ? 0.8 : 0.5"
        :metalness="0.5"
        :roughness="0.2"
      />
    </TresMesh>
    
    <!-- Glow effect -->
    <TresMesh>
      <TresSphereGeometry :args="[planetData.size * 1.5, 32, 32]" />
      <TresMeshBasicMaterial
        :color="planetData.color"
        :opacity="isHovered ? 0.4 : 0.2"
        :transparent="true"
      />
    </TresMesh>
    
    <!-- Planet symbol sprite -->
    <TresSprite 
      :position="[0, planetData.size + 1, 0]"
      :scale="[1.5, 0.75, 1]"
    >
      <TresSpriteMaterial
        :map="symbolTexture"
        :transparent="true"
        :alpha-test="0.5"
      />
    </TresSprite>
  </TresGroup>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const props = defineProps({
  planetData: {
    type: Object,
    required: true
  },
  planetKey: {
    type: String,
    required: true
  }
})

const hoveredPlanet = inject('hoveredPlanet')
const isHovered = ref(false)

// Create canvas texture for planet symbol
const symbolTexture = computed(() => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 256
  canvas.height = 128
  
  // Clear canvas
  ctx.clearRect(0, 0, 256, 128)
  
  // Draw symbol
  ctx.fillStyle = props.planetData.color
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.planetData.symbol, 128, 64)
  
  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  
  return texture
})

const onHover = () => {
  isHovered.value = true
  hoveredPlanet.value = props.planetData
}

const onLeave = () => {
  isHovered.value = false
  hoveredPlanet.value = null
}
</script>