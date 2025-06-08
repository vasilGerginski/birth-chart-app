<template>
  <div class="glass-panel form-container">
    <h2>Enter Your Birth Details</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label" for="name">Name</label>
        <input 
          id="name"
          v-model="formData.name" 
          type="text" 
          class="form-input" 
          placeholder="Your name"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="birthDate">Birth Date</label>
        <input 
          id="birthDate"
          v-model="formData.birthDate" 
          type="date" 
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="birthTime">Birth Time</label>
        <input 
          id="birthTime"
          v-model="formData.birthTime" 
          type="time" 
          class="form-input"
          required
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="birthPlace">Birth Place</label>
          <input 
            id="birthPlace"
            v-model="formData.birthPlace" 
            type="text" 
            class="form-input" 
            placeholder="City, Country"
            required
          />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="glow-button" :disabled="isLoading">
          <span v-if="!isLoading">✨ Generate My Chart ✨</span>
          <span v-else>Creating Magic...</span>
        </button>
      </div>
    </form>

    <div v-if="isLoading" class="loading-spinner"></div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'BirthChartForm',
  emits: ['submit'],
  setup(props, { emit }) {
    const formData = ref({
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: ''
    })
    
    const isLoading = ref(false)

    const handleSubmit = async () => {
      isLoading.value = true
      
      setTimeout(() => {
        emit('submit', { ...formData.value })
        isLoading.value = false
      }, 2000)
    }

    return {
      formData,
      isLoading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.glow-button {
  font-size: 1.1rem;
  padding: 15px 40px;
}

.loading-spinner {
  margin-top: 2rem;
}
</style>