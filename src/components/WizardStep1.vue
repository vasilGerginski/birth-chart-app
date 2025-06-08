<template>
  <div class="wizard-step">
    <div class="step-header">
      <h2>What's Your Name?</h2>
      <p class="step-subtitle">Let's begin your cosmic journey</p>
    </div>
    
    <div class="step-content">
      <div class="zodiac-symbol floating">✨</div>
      
      <div class="form-group">
        <input 
          v-model="name" 
          type="text" 
          class="form-input large-input" 
          placeholder="Enter your name"
          @keyup.enter="nextStep"
          ref="nameInput"
        />
      </div>
      
      <button 
        @click="nextStep" 
        class="glow-button"
        :disabled="!name.trim()"
      >
        Continue →
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'WizardStep1',
  emits: ['next'],
  setup(props, { emit }) {
    const name = ref('')
    const nameInput = ref(null)
    
    // Load saved data
    onMounted(() => {
      try {
        const saved = localStorage.getItem('birthChartData')
        if (saved) {
          const data = JSON.parse(saved)
          if (data.name) {
            name.value = data.name
          }
        }
      } catch (error) {
        console.log('No saved data')
      }
    })
    
    // Focus input after loading data
    setTimeout(() => {
      nameInput.value?.focus()
    }, 100)
    
    const nextStep = () => {
      if (name.value.trim()) {
        emit('next', { name: name.value })
      }
    }
    
    return {
      name,
      nameInput,
      nextStep
    }
  }
}
</script>

<style scoped>
.wizard-step {
  text-align: center;
  animation: fadeIn 0.6s ease-out;
}

.step-header {
  margin-bottom: 3rem;
}

.step-subtitle {
  color: #b794f6;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

.step-content {
  max-width: 400px;
  margin: 0 auto;
}

.large-input {
  font-size: 1.3rem;
  padding: 1rem 1.5rem;
  text-align: center;
}

.floating {
  animation: float 4s ease-in-out infinite;
  margin-bottom: 2rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>