<template>
  <div class="progress-container">
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressWidth }"
        ></div>
      </div>
      <div class="progress-steps">
        <div 
          v-for="step in 4" 
          :key="step"
          class="progress-step"
          :class="{ 
            active: step === currentStep,
            completed: step < currentStep 
          }"
        >
          <div class="step-circle">{{ step }}</div>
          <div class="step-label">{{ stepLabels[step - 1] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'WizardProgress',
  props: {
    currentStep: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const stepLabels = ['Name', 'Date', 'Time', 'Place']
    
    const progressWidth = computed(() => {
      return `${(props.currentStep / 4) * 100}%`
    })
    
    return {
      stepLabels,
      progressWidth
    }
  }
}
</script>

<style scoped>
.progress-container {
  margin-bottom: 3rem;
  position: relative;
}

.progress-bar-container {
  position: relative;
}

.progress-bar {
  position: absolute;
  top: 18px;
  left: 18px;
  right: 18px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  z-index: 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #b794f6, #d53a9d);
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(183, 148, 246, 0.5);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.progress-step {
  text-align: center;
  position: relative;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0a0a0f;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.step-label {
  font-size: 0.85rem;
  margin-top: 0.5rem;
  color: #b794f6;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.progress-step.active .step-circle {
  background: linear-gradient(135deg, #b794f6, #d53a9d);
  border-color: transparent;
  box-shadow: 0 0 20px rgba(183, 148, 246, 0.6);
  transform: scale(1.1);
}

.progress-step.active .step-label {
  opacity: 1;
}

.progress-step.completed .step-circle {
  background: rgba(183, 148, 246, 0.3);
  border-color: #b794f6;
}

.progress-step.completed .step-label {
  opacity: 0.9;
}
</style>