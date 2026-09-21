<script setup>
import { ref, onMounted } from 'vue'

const spots = ref([])
const loading = ref(true)
const error = ref(null)

// Функция для получения данных с сервера
const fetchParkingSpots = async () => {
  try {
    loading.value = true
    error.value = null
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const response = await fetch(`${API_URL}/api/spots`)
    
    if (!response.ok) {
      throw new Error('Ошибка подключения к серверу')
    }
    
    spots.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Загружаем данные при открытии страницы
onMounted(() => {
  fetchParkingSpots()
})

// Функция для определения цвета статуса
const getStatusColor = (status) => {
  switch(status) {
    case 'Свободно': return '#4CAF50' // зеленый
    case 'Занято': return '#f44336'   // красный
    case 'Забронировано': return '#FF9800' // оранжевый
    default: return '#9E9E9E' // серый
  }
}
</script>

<template>
  <div class="parking-container">
    <h1>🅿️ Парковка ПГНИУ</h1>
    
    <div v-if="loading" class="loading">
      Загрузка данных...
    </div>
    
    <div v-else-if="error" class="error">
      ❌ {{ error }}
    </div>
    
    <div v-else>
      <div class="stats">
        <div class="stat">
          <span class="stat-number">{{ spots.length }}</span>
          <span class="stat-label">Всего мест</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ spots.filter(s => s.status === 'Свободно').length }}</span>
          <span class="stat-label">Свободно</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ spots.filter(s => s.status !== 'Свободно').length }}</span>
          <span class="stat-label">Занято</span>
        </div>
      </div>
      
      <div class="spots-grid">
        <div 
          v-for="spot in spots" 
          :key="spot.id" 
          class="spot-card"
          :style="{ borderColor: getStatusColor(spot.status) }"
        >
          <div class="spot-number">{{ spot.number }}</div>
          <div 
            class="spot-status" 
            :style="{ backgroundColor: getStatusColor(spot.status) }"
          >
            {{ spot.status }}
          </div>
        </div>
      </div>
      
      <button @click="fetchParkingSpots" class="refresh-btn">
        🔄 Обновить
      </button>
    </div>
  </div>
</template>

<style scoped>
.parking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.loading, .error {
  text-align: center;
  font-size: 18px;
  padding: 40px;
}

.error {
  color: #f44336;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
  min-width: 150px;
}

.stat-number {
  display: block;
  font-size: 36px;
  font-weight: bold;
  color: #2196F3;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.spot-card {
  background: white;
  border: 4px solid;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.spot-card:hover {
  transform: translateY(-5px);
}

.spot-number {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.spot-status {
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  display: inline-block;
}

.refresh-btn {
  display: block;
  margin: 0 auto;
  padding: 15px 30px;
  font-size: 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.refresh-btn:hover {
  background: #1976D2;
}
</style>