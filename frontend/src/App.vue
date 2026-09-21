<script setup>
import { ref, onMounted } from 'vue'

const spots = ref([])
const loading = ref(true)
const error = ref('')

const fetchSpots = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/spots')
    spots.value = await response.json()
  } catch (err) {
    error.value = 'Не удалось загрузить данные'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSpots()
})
</script>

<template>
  <div class="container">
    <h1>🅿️ Парковка ПГНИУ</h1>
    
    <div v-if="loading">Загрузка...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="!loading && !error" class="spots">
      <div v-for="spot in spots" :key="spot.id" class="spot">
        <h3>Место {{ spot.id }}</h3>
        <span :class="spot.status === 'Свободно' ? 'free' : 'busy'">
          {{ spot.status }}
        </span>
      </div>
    </div>
    
    <button @click="fetchSpots">Обновить</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.spots {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.spot {
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 10px;
}

.free {
  color: green;
  font-weight: bold;
}

.busy {
  color: red;
  font-weight: bold;
}

button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>