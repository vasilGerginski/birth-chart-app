<template>
  <div class="wizard-step">
    <div class="step-header">
      <h2>When Were You Born?</h2>
      <p class="step-subtitle">Select your birth date</p>
    </div>
    
    <div class="step-content">
      <div class="zodiac-symbol floating">🌙</div>
      
      <div class="form-group">
        <input 
          v-model="birthDate" 
          type="date" 
          class="form-input large-input"
          ref="dateInput"
        />
      </div>
      
      <div class="button-group">
        <button @click="$emit('back')" class="glow-button secondary">
          ← Back
        </button>
        <button 
          @click="nextStep" 
          class="glow-button"
          :disabled="!birthDate"
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
  name: 'WizardStep2',
  emits: ['next', 'back'],
  setup(props, { emit }) {
    const birthDate = ref('')
    const dateInput = ref(null)
    
    onMounted(() => {
      // Load saved data
      try {
        const saved = localStorage.getItem('birthChartData')
        if (saved) {
          const data = JSON.parse(saved)
          if (data.birthDate) {
            birthDate.value = data.birthDate
          }
        }
      } catch (error) {
        console.log('No saved data')
      }
      
      setTimeout(() => {
        dateInput.value?.focus()
      }, 100)
    })
    
    const nextStep = () => {
      if (birthDate.value) {
        emit('next', { birthDate: birthDate.value })
      }
    }
    
    return {
      birthDate,
      dateInput,
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

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.secondary {
  background: rgba(255, 255, 255, 0.1);
}

.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>