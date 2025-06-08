<template>
  <div class="wizard-step">
    <div class="step-header">
      <h2>Where Were You Born?</h2>
      <p class="step-subtitle">Your birthplace affects planetary positions</p>
    </div>
    
    <div class="step-content">
      <div class="zodiac-symbol floating">🌍</div>
      
      <div class="form-group">
        <input 
          v-model="birthPlace" 
          type="text" 
          class="form-input large-input" 
          placeholder="City, Country"
          @keyup.enter="submit"
          ref="placeInput"
        />
      </div>
      
      <div class="button-group">
        <button @click="$emit('back')" class="glow-button secondary">
          ← Back
        </button>
        <button 
          @click="submit" 
          class="glow-button primary"
          :disabled="!birthPlace.trim() || isLoading"
        >
          <span v-if="!isLoading">✨ Generate Chart ✨</span>
          <span v-else>Creating Magic...</span>
        </button>
      </div>
      
      <div v-if="isLoading" class="loading-spinner"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'WizardStep4',
  emits: ['submit', 'back'],
  setup(props, { emit }) {
    const birthPlace = ref('')
    const placeInput = ref(null)
    const isLoading = ref(false)
    
    onMounted(() => {
      // Load saved data
      try {
        const saved = localStorage.getItem('birthChartData')
        if (saved) {
          const data = JSON.parse(saved)
          if (data.birthPlace) {
            birthPlace.value = data.birthPlace
          }
        }
      } catch (error) {
        console.log('No saved data')
      }
      
      setTimeout(() => {
        placeInput.value?.focus()
      }, 100)
    })
    
    const submit = async () => {
      if (birthPlace.value.trim() && !isLoading.value) {
        isLoading.value = true
        emit('submit', { birthPlace: birthPlace.value })
      }
    }
    
    return {
      birthPlace,
      placeInput,
      isLoading,
      submit
    }
  }
}
</script>

<style scoped>
.wizard-step {
  text-align: center;
  animation: slideIn 0.5s ease-out;
}

.primary {
  background: linear-gradient(135deg, #d53a9d, #743ad5);
  font-size: 1.1rem;
  padding: 15px 30px;
}
</style>