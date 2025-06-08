<template>
  <div class="interpretation-container">
    <div class="glass-panel">
      <div class="chart-header">
        <h2>Your Cosmic Blueprint</h2>
        <div class="zodiac-symbol">{{ chartData.sunSign.symbol }}</div>
      </div>

      <InteractiveChart :chartData="chartData" />

      <div class="interpretation-text">
        <p v-for="(paragraph, index) in formattedInterpretation" :key="index">
          {{ paragraph }}
        </p>
      </div>

      <div class="element-balance">
        <h3>Elemental Balance</h3>
        <div class="elements-grid">
          <div v-for="(count, element) in chartData.elements" :key="element" class="element-card">
            <div class="element-icon">{{ getElementIcon(element) }}</div>
            <div class="element-name">{{ element }}</div>
            <div class="element-count">{{ count }}</div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button @click="$emit('reset')" class="glow-button">
          ✨ New Reading ✨
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import InteractiveChart from './InteractiveChart.vue'

export default {
  name: 'ChartInterpretation',
  components: {
    InteractiveChart
  },
  props: {
    interpretation: {
      type: String,
      required: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  emits: ['reset'],
  setup(props) {

    const formattedInterpretation = computed(() => {
      return props.interpretation
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim())
    })

    const getElementIcon = (element) => {
      const icons = {
        fire: '🔥',
        earth: '🌍',
        air: '💨',
        water: '💧'
      }
      return icons[element] || '✨'
    }


    return {
      formattedInterpretation,
      getElementIcon
    }
  }
}
</script>

<style scoped>
.interpretation-container {
  max-width: 800px;
  margin: 0 auto;
}

.chart-header {
  text-align: center;
  margin-bottom: 2rem;
}


.interpretation-text p {
  margin-bottom: 1rem;
}

.element-balance {
  margin: 2rem 0;
  text-align: center;
}

.elements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.element-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
}

.element-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.element-name {
  text-transform: capitalize;
  color: #b794f6;
  font-weight: 600;
}

.element-count {
  font-size: 1.2rem;
  color: #e9d8fd;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>