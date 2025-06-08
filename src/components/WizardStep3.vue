<template>
  <div class="wizard-step">
    <div class="step-header">
      <h2>What Time Were You Born?</h2>
      <p class="step-subtitle">Your exact birth time helps us calculate your rising sign</p>
    </div>
    
    <div class="step-content">
      <div class="zodiac-symbol floating">⏰</div>
      
      <div class="form-group">
        <input 
          v-model="birthTime" 
          type="time" 
          class="form-input large-input"
          ref="timeInput"
        />
      </div>
      
      <div class="button-group">
        <button @click="$emit('back')" class="glow-button secondary">
          ← Back
        </button>
        <button 
          @click="nextStep" 
          class="glow-button"
          :disabled="!birthTime"
        >
          Continue →
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'WizardStep3',
  emits: ['next', 'back'],
  setup(props, { emit }) {
    const birthTime = ref('')
    const timeInput = ref(null)
    
    onMounted(() => {
      // Load saved data
      try {
        const saved = localStorage.getItem('birthChartData')
        if (saved) {
          const data = JSON.parse(saved)
          if (data.birthTime) {
            birthTime.value = data.birthTime
          }
        }
      } catch (error) {
        console.log('No saved data')
      }
      
      setTimeout(() => {
        timeInput.value?.focus()
      }, 100)
    })
    
    const nextStep = () => {
      if (birthTime.value) {
        emit('next', { birthTime: birthTime.value })
      }
    }
    
    return {
      birthTime,
      timeInput,
      nextStep
    }
  }
}
</script>

<style scoped>
.wizard-step {
  text-align: center;
  animation: slideIn 0.5s ease-out;
}
</style>