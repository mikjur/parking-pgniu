<script setup>
import { ref, onMounted, computed } from 'vue'

const spots = ref([
  { id: 1, status: 'Свободно' },
  { id: 2, status: 'Занято' },
  { id: 3, status: 'Свободно' }
])

const isDark = ref(false)

onMounted(() => {
  const savedSpots = localStorage.getItem('parking-spots')
  if (savedSpots) {
    spots.value = JSON.parse(savedSpots)
  }
  
  const savedTheme = localStorage.getItem('parking-theme')
  if (savedTheme === 'dark') {
    isDark.value = true
  } else if (!savedTheme) {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('parking-theme', isDark.value ? 'dark' : 'light')
}

const total = computed(() => spots.value.length)
const free = computed(() => spots.value.filter(s => s.status === 'Свободно').length)
const busy = computed(() => spots.value.filter(s => s.status === 'Занято').length)

const toggleSpot = (spot) => {
  spot.status = spot.status === 'Свободно' ? 'Занято' : 'Свободно'
  localStorage.setItem('parking-spots', JSON.stringify(spots.value))
}

const resetSpots = () => {
  spots.value = [
    { id: 1, status: 'Свободно' },
    { id: 2, status: 'Занято' },
    { id: 3, status: 'Свободно' }
  ]
  localStorage.setItem('parking-spots', JSON.stringify(spots.value))
}
</script>

<template>
  <div class="container" :class="{ dark: isDark }">
    <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Светлая тема' : 'Тёмная тема'">
      <span v-if="isDark">☀️</span>
      <span v-else>🌙</span>
    </button>

    <h1>🅿️ Парковка ПГНИУ</h1>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-number">{{ total }}</div>
        <div class="stat-label">Всего мест</div>
      </div>
      <div class="stat-card">
        <div class="stat-number free-num">{{ free }}</div>
        <div class="stat-label">Свободно</div>
      </div>
      <div class="stat-card">
        <div class="stat-number busy-num">{{ busy }}</div>
        <div class="stat-label">Занято</div>
      </div>
    </div>
    
    <div class="spots">
      <div v-for="spot in spots" :key="spot.id" 
           class="spot" 
           :class="spot.status === 'Свободно' ? 'free' : 'busy'"
           @click="toggleSpot(spot)">
        <h3>Место {{ spot.id }}</h3>
        <span class="status">{{ spot.status }}</span>
        <p class="hint">Нажми, чтобы изменить</p>
      </div>
    </div>
    
    <button @click="resetSpots" class="reset-btn">🔄 Сбросить</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background: #ffffff;
  color: #1a1a1a;
  transition: background 0.3s ease, color 0.3s ease;
  position: relative;
}

.container.dark {
  background: #121212;
  color: #e0e0e0;
}

.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #ddd;
  background: #f5f5f5;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container.dark .theme-toggle {
  border-color: #444;
  background: #2a2a2a;
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
}

h1 { 
  margin-bottom: 30px; 
  font-size: 32px; 
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.container.dark .stat-card {
  background: #1e1e1e;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #007bff;
}

.free-num { color: #28a745; }
.busy-num { color: #dc3545; }

.stat-label { 
  color: #666; 
  margin-top: 5px; 
}

.container.dark .stat-label {
  color: #999;
}

.spots {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.spot {
  padding: 25px;
  border: 3px solid;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: transform 0.2s, background 0.3s ease;
}

.container.dark .spot {
  background: #1e1e1e;
}

.spot:hover { 
  transform: scale(1.05); 
}

.spot.free { border-color: #28a745; }
.spot.busy { border-color: #dc3545; }

.spot h3 { 
  margin: 0 0 10px 0; 
}

.status {
  font-weight: bold;
  font-size: 18px;
  padding: 5px 15px;
  border-radius: 20px;
  color: white;
  display: inline-block;
}

.spot.free .status { background: #28a745; }
.spot.busy .status { background: #dc3545; }

.hint { 
  font-size: 12px; 
  color: #999; 
  margin-top: 10px; 
}

.reset-btn {
  padding: 12px 30px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.reset-btn:hover { 
  background: #0056b3; 
}
</style>