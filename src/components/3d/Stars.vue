<template>
  <TresPoints>
    <TresBufferGeometry>
      <TresBufferAttribute
        :args="[starsVertices, 3]"
        attach="attributes-position"
      />
    </TresBufferGeometry>
    <TresPointsMaterial
      color="white"
      :size="0.1"
      :transparent="true"
      :opacity="0.8"
    />
  </TresPoints>
</template>

<script setup>
import { computed } from 'vue'

// Generate random star positions
const starsVertices = computed(() => {
  const vertices = new Float32Array(3000) // 1000 stars * 3 coordinates
  
  for (let i = 0; i < 3000; i += 3) {
    vertices[i] = (Math.random() - 0.5) * 200     // x
    vertices[i + 1] = (Math.random() - 0.5) * 200 // y
    vertices[i + 2] = (Math.random() - 0.5) * 200 // z
  }
  
  return vertices
})
</script>