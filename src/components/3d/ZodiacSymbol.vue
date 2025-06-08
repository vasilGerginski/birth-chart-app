<template>
  <TresSprite 
    :position="position"
    :scale="[2, 2, 1]"
    @pointer-enter="onHover"
    @pointer-leave="onLeave"
  >
    <TresSpriteMaterial
      :map="symbolTexture"
      :transparent="true"
      :alpha-test="0.5"
    />
  </TresSprite>
</template>

<script setup>
import { computed } from 'vue'
import { useTexture } from '@tresjs/core'

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

// Create canvas texture for the zodiac symbol
const symbolTexture = computed(() => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 128
  canvas.height = 128
  
  // Clear canvas
  ctx.clearRect(0, 0, 128, 128)
  
  // Draw symbol
  ctx.fillStyle = props.sign.color
  ctx.font = 'bold 64px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.sign.symbol, 64, 64)
  
  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  
  return texture
})

const onHover = () => {
  console.log(`Hovered ${props.sign.name}`)
}

const onLeave = () => {
  console.log(`Left ${props.sign.name}`)
}
</script>