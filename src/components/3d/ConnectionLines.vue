<template>
  <TresGroup>
    <TresLine
      v-for="(connection, index) in connections"
      :key="`line-${index}`"
    >
      <TresBufferGeometry>
        <TresBufferAttribute
          :args="[connection.points, 3]"
          attach="attributes-position"
        />
      </TresBufferGeometry>
      <TresLineBasicMaterial
        :color="connection.color"
        :transparent="true"
        :opacity="0.3"
      />
    </TresLine>
  </TresGroup>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const connections = computed(() => {
  const lines = []
  const planets = Object.values(props.chartData.planetaryPositions)
  
  // Create aspect lines between planets
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i]
      const p2 = planets[j]
      
      const angle1 = ((p1.house - 1) * 30 + p1.degree - 90) * Math.PI / 180
      const angle2 = ((p2.house - 1) * 30 + p2.degree - 90) * Math.PI / 180
      
      const points = new Float32Array([
        4 * Math.cos(angle1), 0, 4 * Math.sin(angle1),
        4 * Math.cos(angle2), 0, 4 * Math.sin(angle2)
      ])
      
      lines.push({
        points,
        color: '#b794f6'
      })
    }
  }
  
  return lines
})
</script>