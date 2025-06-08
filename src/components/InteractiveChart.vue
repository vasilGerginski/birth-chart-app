<template>
  <div class="interactive-chart-container">
    <div class="chart-toggle">
      <button @click="show3D = false" class="toggle-btn" :class="{ active: !show3D }">
        📊 2D View
      </button>
      <button @click="show3D = true" class="toggle-btn" :class="{ active: show3D }">
        🌌 3D View
      </button>
    </div>
    
    <WorkingChart3D v-if="show3D" :chartData="chartData" />
    
    <div v-else class="chart-wrapper" @mousemove="handleMouseMove" @mouseleave="hideTooltip">
      <canvas ref="chartCanvas" width="400" height="400"></canvas>
      <transition name="tooltip-fade">
        <div 
          v-if="tooltip.visible" 
          class="tooltip glass-panel"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
          <div class="tooltip-header">
            <span class="tooltip-symbol">{{ tooltip.data.symbol }}</span>
            <span class="tooltip-name">{{ tooltip.data.name }}</span>
          </div>
          <div class="tooltip-content">
            <p><strong>Sign:</strong> {{ tooltip.data.sign?.name }} {{ tooltip.data.sign?.symbol }}</p>
            <p><strong>House:</strong> {{ tooltip.data.house }}</p>
            <p><strong>Degree:</strong> {{ tooltip.data.degree }}°</p>
            <p class="tooltip-meaning">{{ tooltip.data.meaning }}</p>
          </div>
        </div>
      </transition>
    </div>
    
    <div class="chart-summary glass-panel">
      <h3>Your Astrological Summary</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">Sun Sign</div>
          <div class="summary-value">
            {{ chartData.sunSign.symbol }} {{ chartData.sunSign.name }}
          </div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Moon Sign</div>
          <div class="summary-value">
            {{ chartData.moonSign.symbol }} {{ chartData.moonSign.name }}
          </div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Rising Sign</div>
          <div class="summary-value">
            {{ chartData.ascendant.symbol }} {{ chartData.ascendant.name }}
          </div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Dominant Element</div>
          <div class="summary-value">
            {{ getDominantElement() }}
          </div>
        </div>
      </div>
      
      <div class="planetary-positions">
        <h4>Planetary Positions</h4>
        <div class="planets-grid">
          <div 
            v-for="(planet, key) in chartData.planetaryPositions" 
            :key="key"
            class="planet-info"
            @mouseenter="highlightPlanet(key)"
            @mouseleave="unhighlightPlanet"
          >
            <span class="planet-symbol">{{ planet.symbol }}</span>
            <span class="planet-details">{{ planet.name }} in {{ planet.sign.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import WorkingChart3D from './WorkingChart3D.vue'

export default {
  name: 'InteractiveChart',
  components: {
    WorkingChart3D
  },
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    const planetPositions = ref([])
    const highlightedPlanet = ref(null)
    const show3D = ref(false)
    const tooltip = ref({
      visible: false,
      x: 0,
      y: 0,
      data: {}
    })
    
    const getDominantElement = () => {
      const elements = props.chartData.elements
      const dominant = Object.entries(elements)
        .sort(([,a], [,b]) => b - a)[0]
      return `${dominant[0].charAt(0).toUpperCase() + dominant[0].slice(1)} (${dominant[1]} planets)`
    }
    
    
    const drawChart = () => {
      if (!chartCanvas.value) return
      
      const ctx = chartCanvas.value.getContext('2d')
      const centerX = 200
      const centerY = 200
      const radius = 150
      
      ctx.clearRect(0, 0, 400, 400)
      
      // Outer circle
      ctx.strokeStyle = '#b794f6'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.stroke()
      
      // Inner circles
      ctx.strokeStyle = 'rgba(183, 148, 246, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.7, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI)
      ctx.stroke()
      
      // House divisions
      ctx.strokeStyle = '#e9d8fd'
      ctx.lineWidth = 1
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(
          centerX + radius * Math.cos(angle),
          centerY + radius * Math.sin(angle)
        )
        ctx.stroke()
      }
      
      // Zodiac symbols
      ctx.fillStyle = '#b794f6'
      ctx.font = '20px Cinzel'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const zodiacSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
      const zodiacNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
      
      zodiacSymbols.forEach((symbol, i) => {
        const angle = (i * 30 - 75) * Math.PI / 180
        const x = centerX + (radius - 25) * Math.cos(angle)
        const y = centerY + (radius - 25) * Math.sin(angle)
        ctx.fillText(symbol, x, y)
      })
      
      // Clear planet positions
      planetPositions.value = []
      
      // Draw planets
      Object.entries(props.chartData.planetaryPositions).forEach(([key, planet], i) => {
        const houseAngle = ((planet.house - 1) * 30 - 90) * Math.PI / 180
        const offset = (planet.degree / 30) * 30 * Math.PI / 180
        const angle = houseAngle + offset
        const r = 40 + (i % 3) * 30
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)
        
        // Highlight effect
        if (highlightedPlanet.value === key) {
          ctx.shadowColor = 'rgba(183, 148, 246, 0.8)'
          ctx.shadowBlur = 20
        }
        
        // Planet glow
        ctx.fillStyle = 'rgba(183, 148, 246, 0.2)'
        ctx.beginPath()
        ctx.arc(x, y, 15, 0, 2 * Math.PI)
        ctx.fill()
        
        ctx.shadowBlur = 0
        
        // Planet symbol
        ctx.fillStyle = highlightedPlanet.value === key ? '#fff' : '#e9d8fd'
        ctx.font = highlightedPlanet.value === key ? 'bold 18px Quicksand' : '16px Quicksand'
        ctx.fillText(planet.symbol, x, y)
        
        planetPositions.value.push({
          key,
          x,
          y,
          data: planet
        })
      })
    }
    
    const handleMouseMove = (event) => {
      const rect = chartCanvas.value.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const hoveredPlanet = planetPositions.value.find(planet => {
        const distance = Math.sqrt(Math.pow(x - planet.x, 2) + Math.pow(y - planet.y, 2))
        return distance < 20
      })
      
      if (hoveredPlanet) {
        // Calculate tooltip position to keep it within viewport
        let tooltipX = event.clientX - rect.left
        let tooltipY = event.clientY - rect.top
        
        // Keep tooltip centered above cursor
        tooltipX = Math.max(100, Math.min(tooltipX, rect.width - 100))
        tooltipY = Math.max(20, tooltipY)
        
        tooltip.value = {
          visible: true,
          x: tooltipX,
          y: tooltipY,
          data: hoveredPlanet.data
        }
        chartCanvas.value.style.cursor = 'pointer'
      } else {
        hideTooltip()
        chartCanvas.value.style.cursor = 'default'
      }
    }
    
    const hideTooltip = () => {
      tooltip.value.visible = false
    }
    
    const highlightPlanet = (key) => {
      highlightedPlanet.value = key
      drawChart()
    }
    
    const unhighlightPlanet = () => {
      highlightedPlanet.value = null
      drawChart()
    }
    
    onMounted(() => {
      drawChart()
    })
    
    return {
      chartCanvas,
      show3D,
      tooltip,
      handleMouseMove,
      hideTooltip,
      highlightPlanet,
      unhighlightPlanet,
      getDominantElement
    }
  }
}
</script>

<style scoped>
.interactive-chart-container {
  margin: 2rem 0;
}

.chart-toggle {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e0d5ff;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.toggle-btn.active {
  background: linear-gradient(135deg, #9f7aea, #805ad5);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 15px rgba(159, 122, 234, 0.4);
}

.chart-wrapper {
  position: relative;
  display: inline-block;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.chart-wrapper canvas {
  border: 2px solid rgba(183, 148, 246, 0.3);
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(183, 148, 246, 0.05), transparent);
  transition: transform 0.3s ease;
}

.chart-wrapper canvas:hover {
  transform: scale(1.02);
}

.tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 10;
  padding: 1rem;
  min-width: 200px;
  max-width: 250px;
  background: rgba(10, 10, 15, 0.95) !important;
  transform: translate(-50%, -100%);
  margin-top: -10px;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(183, 148, 246, 0.3);
}

.tooltip-symbol {
  font-size: 1.5rem;
}

.tooltip-name {
  font-weight: 600;
  color: #b794f6;
}

.tooltip-content p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.tooltip-meaning {
  margin-top: 0.5rem;
  font-style: italic;
  color: #e9d8fd;
}

.tooltip-fade-enter-active, .tooltip-fade-leave-active {
  transition: opacity 0.2s ease;
}

.tooltip-fade-enter-from, .tooltip-fade-leave-to {
  opacity: 0;
}

.chart-summary {
  margin-top: 2rem;
  padding: 2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.summary-item {
  text-align: center;
}

.summary-label {
  font-size: 0.9rem;
  color: #b794f6;
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e9d8fd;
}

.planetary-positions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(183, 148, 246, 0.2);
}

.planetary-positions h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #b794f6;
}

.planets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.planet-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.planet-info:hover {
  background: rgba(183, 148, 246, 0.1);
  transform: translateX(5px);
}

.planet-symbol {
  font-size: 1.3rem;
}

.planet-details {
  font-size: 0.9rem;
  color: #e9d8fd;
}
</style>