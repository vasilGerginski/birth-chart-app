<template>
  <div class="canvas-container">
    <div class="chart-info">
      <h3>3D Birth Chart</h3>
      <p>Planet count: {{ Object.keys(chartData.planetaryPositions).length }}</p>
      <p>Sun: {{ chartData.sunSign.name }} {{ chartData.sunSign.symbol }}</p>
      <p>Moon: {{ chartData.moonSign.name }} {{ chartData.moonSign.symbol }}</p>
      <p>Rising: {{ chartData.ascendant.name }} {{ chartData.ascendant.symbol }}</p>
    </div>
    
    <TresCanvas clear-color="#0a0a0f" alpha>
      <TresPerspectiveCamera :position="[0, 8, 25]" :fov="50" />
      
      <!-- Simple lighting -->
      <TresAmbientLight :intensity="0.6" />
      <TresDirectionalLight :position="[10, 10, 5]" :intensity="0.4" />
      
      <!-- Simple test cube -->
      <TresMesh>
        <TresBoxGeometry :args="[2, 2, 2]" />
        <TresMeshStandardMaterial color="#b794f6" />
      </TresMesh>
      
      <!-- Orbit controls -->
      <OrbitControls />
    </TresCanvas>
  </div>
</template>

<script setup>
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 400px;
  margin: 2rem 0;
}

.chart-info {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.7);
  padding: 1rem;
  border-radius: 10px;
  z-index: 10;
}
</style>