<template>
  <div id="app">
    <div class="mystical-bg"></div>
    <canvas ref="fractalCanvas" class="fractal-canvas"></canvas>
    
    <div class="container">
      <h1 class="main-title">✨ Birth Chart ✨</h1>
      
      <div v-if="!showInterpretation" class="wizard-container glass-panel">
        <WizardProgress :currentStep="currentStep" />
        
        
        <transition :name="transitionName" mode="out-in">
          <component 
            :is="currentStepComponent"
            :key="currentStep"
            @next="handleNext"
            @back="handleBack"
            @submit="handleSubmit"
          />
        </transition>
      </div>
      
      <transition name="fade" mode="out-in">
        <ChartInterpretation 
          v-if="showInterpretation"
          :interpretation="interpretation"
          :chartData="chartData"
          @reset="resetForm"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import WizardStep1 from './components/WizardStep1.vue'
import WizardStep2 from './components/WizardStep2.vue'
import WizardStep3 from './components/WizardStep3.vue'
import WizardStep4 from './components/WizardStep4.vue'
import WizardProgress from './components/WizardProgress.vue'
import ChartInterpretation from './components/ChartInterpretation.vue'
import { initFractalAnimation } from './utils/fractalAnimation'
import { calculateBirthChart } from './utils/astrology'
import { getAIInterpretation } from './utils/aiService'

export default {
  name: 'App',
  components: {
    WizardStep1,
    WizardStep2,
    WizardStep3,
    WizardStep4,
    WizardProgress,
    ChartInterpretation
  },
  setup() {
    const fractalCanvas = ref(null)
    const showInterpretation = ref(false)
    const interpretation = ref('')
    const chartData = ref(null)
    const currentStep = ref(1)
    const transitionName = ref('slide-right')
    
    const formData = ref({
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: ''
    })
    
    // Load saved form data on mount
    const loadSavedData = () => {
      try {
        const saved = localStorage.getItem('birthChartData')
        if (saved) {
          const parsedData = JSON.parse(saved)
          formData.value = { ...parsedData }
          
          // Don't auto-generate chart, just load the data
          // User needs to go through wizard or click button to generate
        }
      } catch (error) {
        console.log('No saved data found')
      }
    }
    
    // Save form data to localStorage
    const saveFormData = (data) => {
      try {
        localStorage.setItem('birthChartData', JSON.stringify(data))
      } catch (error) {
        console.log('Could not save data')
      }
    }
    
    const stepComponents = {
      1: 'WizardStep1',
      2: 'WizardStep2',
      3: 'WizardStep3',
      4: 'WizardStep4'
    }
    
    const currentStepComponent = computed(() => stepComponents[currentStep.value])

    onMounted(() => {
      if (fractalCanvas.value) {
        initFractalAnimation(fractalCanvas.value)
      }
      loadSavedData()
    })
    
    const handleNext = (data) => {
      Object.assign(formData.value, data)
      saveFormData(formData.value)
      transitionName.value = 'slide-right'
      currentStep.value++
    }
    
    const handleBack = () => {
      transitionName.value = 'slide-left'
      currentStep.value--
    }
    
    const handleSubmit = async (data) => {
      Object.assign(formData.value, data)
      saveFormData(formData.value)
      await generateChart()
    }

    const generateChart = async () => {
      try {
        console.log('Generating chart with data:', formData.value)
        chartData.value = calculateBirthChart(formData.value)
        console.log('Chart data calculated:', chartData.value)
        interpretation.value = await getAIInterpretation(chartData.value)
        console.log('Interpretation generated')
        showInterpretation.value = true
        console.log('Show interpretation set to true')
      } catch (error) {
        console.error('Error generating chart:', error)
      }
    }

    const resetForm = () => {
      showInterpretation.value = false
      interpretation.value = ''
      chartData.value = null
      currentStep.value = 1
      formData.value = {
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: ''
      }
      // Clear saved data
      localStorage.removeItem('birthChartData')
    }
    
    const testGenerate = async () => {
      // Set test data if form is empty
      if (!formData.value.name) {
        formData.value = {
          name: 'Test User',
          birthDate: '1990-01-01',
          birthTime: '12:00',
          birthPlace: 'New York, USA'
        }
      }
      await generateChart()
    }

    return {
      fractalCanvas,
      showInterpretation,
      interpretation,
      chartData,
      currentStep,
      currentStepComponent,
      transitionName,
      formData,
      handleNext,
      handleBack,
      handleSubmit,
      resetForm,
      testGenerate
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.main-title {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 3rem;
  text-align: center;
  animation: glow 2s ease-in-out infinite alternate;
  white-space: nowrap;
  overflow: hidden;
}

.wizard-container {
  padding: 3rem;
  min-height: 500px;
}

@keyframes glow {
  from { text-shadow: 0 0 20px rgba(183, 148, 246, 0.5); }
  to { text-shadow: 0 0 30px rgba(183, 148, 246, 0.8), 0 0 40px rgba(183, 148, 246, 0.6); }
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.5s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>