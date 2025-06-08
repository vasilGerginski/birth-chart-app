<template>
  <TresSprite 
    :position="position"
    :scale="[3, 0.75, 1]"
  >
    <TresSpriteMaterial
      :map="nameTexture"
      :transparent="true"
      :alpha-test="0.5"
    />
  </TresSprite>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  sign: {
    type: Object,
    required: true
  },
  position: {
    type: Array,
    required: true
  }
})

// Create canvas texture for the zodiac name
const nameTexture = computed(() => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 256
  canvas.height = 64
  
  // Clear canvas
  ctx.clearRect(0, 0, 256, 64)
  
  // Draw name
  ctx.fillStyle = '#e9d8fd'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.sign.name, 128, 32)
  
  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  
  return texture
})
</script>