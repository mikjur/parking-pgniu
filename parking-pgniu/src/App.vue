<script setup>
import { ref, onMounted, computed } from 'vue'

const defaultSpots = () => [
  { id: 1, status: 'Свободно' },
  { id: 2, status: 'Занято' },
  { id: 3, status: 'Свободно' },
  { id: 4, status: 'Свободно' },
  { id: 5, status: 'Занято' },
  { id: 6, status: 'Свободно' }
]

const spots = ref(defaultSpots())
const isDark = ref(false)

onMounted(() => {
  // Новая версия ключа — старые сохранения (3 места) игнорируются
  const savedSpots = localStorage.getItem('parking-spots-v2')
  if (savedSpots) spots.value = JSON.parse(savedSpots)

  const savedTheme = localStorage.getItem('parking-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

const save = () => localStorage.setItem('parking-spots-v2', JSON.stringify(spots.value))

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('parking-theme', isDark.value ? 'dark' : 'light')
}

const total = computed(() => spots.value.length)
const free = computed(() => spots.value.filter(s => s.status === 'Свободно').length)
const busy = computed(() => total.value - free.value)

const toggleSpot = (spot) => {
  spot.status = spot.status === 'Свободно' ? 'Занято' : 'Свободно'
  save()
}

const resetSpots = () => {
  spots.value = defaultSpots()
  save()
}

const pad = (n) => String(n).padStart(2, '0')
</script>

<template>
  <div class="app" :class="{ dark: isDark }">
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

    <div class="page">
      <header class="topbar">
        <span class="badge">
          <span class="badge-dot"></span>
          Мониторинг активен
        </span>

        <button
          class="theme-switch"
          @click="toggleTheme"
          :title="isDark ? 'Светлая тема' : 'Тёмная тема'"
        >
          <span class="ts-track">
            <span class="ts-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            </span>
            <span class="ts-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </span>
            <span class="ts-thumb" :class="{ on: isDark }"></span>
          </span>
        </button>
      </header>

      <section class="hero">
        <h1 class="title">Парковка <span class="accent">ПГНИУ</span></h1>
        <p class="subtitle">Мониторинг свободных мест в реальном времени</p>
      </section>

      <section class="stats">
        <div class="stat">
          <span class="stat-value grad-text">{{ total }}</span>
          <span class="stat-label">Всего мест</span>
        </div>
        <div class="stat">
          <span class="stat-value free-text">{{ free }}</span>
          <span class="stat-label">Свободно</span>
        </div>
        <div class="stat">
          <span class="stat-value busy-text">{{ busy }}</span>
          <span class="stat-label">Занято</span>
        </div>
      </section>

      <section class="grid">
        <button
          v-for="(spot, i) in spots"
          :key="spot.id"
          class="card"
          :class="spot.status === 'Свободно' ? 'is-free' : 'is-busy'"
          :style="{ animationDelay: i * 60 + 'ms' }"
          @click="toggleSpot(spot)"
        >
          <div class="card-top">
            <span class="card-id">МЕСТО {{ pad(spot.id) }}</span>
            <span class="card-dot"></span>
          </div>
          <div class="card-status">{{ spot.status }}</div>
          <div class="card-hint">Нажмите, чтобы изменить</div>
        </button>
      </section>

      <div class="actions">
        <button class="btn-primary" @click="resetSpots">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
          Сбросить всё
        </button>
      </div>

      <footer class="footer">© 2026 ПГНИУ · Система мониторинга парковки</footer>
    </div>
  </div>
</template>

<style>
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
</style>

<style scoped>
.app {
  --bg: #f5f6fa;
  --card: #ffffff;
  --border: rgba(15, 23, 42, 0.08);
  --text: #0d1220;
  --muted: #6b7280;
  --accent-1: #0ea5e9;
  --accent-2: #8b5cf6;
  --free: #10b981;
  --busy: #f43f5e;
  --shadow: 0 8px 24px rgba(13, 18, 32, 0.06);
  --shadow-lg: 0 16px 40px rgba(13, 18, 32, 0.1);

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  position: relative;
  overflow: hidden;
  transition: background 0.4s ease, color 0.4s ease;
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app.dark {
  --bg: #0a0c12;
  --card: #12151f;
  --border: rgba(255, 255, 255, 0.08);
  --text: #e8ebf4;
  --muted: #9aa3b5;
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.5);
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.3;
  pointer-events: none;
}
.glow-a { width: 480px; height: 480px; background: var(--accent-1); top: -160px; left: -120px; }
.glow-b { width: 420px; height: 420px; background: var(--accent-2); bottom: -160px; right: -120px; }
.app.dark .glow { opacity: 0.15; }

.page {
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px 48px;
  z-index: 1;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--free);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
  70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.theme-switch { border: none; background: transparent; padding: 0; cursor: pointer; }

.ts-track {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 64px;
  height: 32px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.ts-icon { display: flex; color: var(--muted); z-index: 1; }

.ts-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ts-thumb.on { transform: translateX(32px); }

.hero { text-align: center; margin-bottom: 40px; }

.title {
  font-size: clamp(34px, 6vw, 52px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
}

.accent {
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle { margin: 0; color: var(--muted); font-size: 17px; font-weight: 500; }

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 22px 16px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.4s;
}

.stat:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }

.stat-value { font-size: 34px; font-weight: 800; }

.grad-text {
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.free-text { color: var(--free); }
.busy-text { color: var(--busy); }

.stat-label {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 36px;
}

.card {
  appearance: none;
  text-align: left;
  font-family: inherit;
  color: inherit;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.4s;
  animation: rise 0.5s ease backwards;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.card:active { transform: translateY(-1px) scale(0.98); }
.card.is-free { border-color: rgba(16, 185, 129, 0.35); }
.card.is-busy { border-color: rgba(244, 63, 94, 0.35); }

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.card-id {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  background: var(--bg);
  padding: 4px 10px;
  border-radius: 8px;
  letter-spacing: 0.08em;
}

.card-dot { width: 10px; height: 10px; border-radius: 50%; }
.is-free .card-dot { background: var(--free); box-shadow: 0 0 10px rgba(16, 185, 129, 0.6); }
.is-busy .card-dot { background: var(--busy); box-shadow: 0 0 10px rgba(244, 63, 94, 0.6); }

.card-status { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
.is-free .card-status { color: var(--free); }
.is-busy .card-status { color: var(--busy); }

.card-hint { font-size: 12px; color: var(--muted); font-weight: 500; }

.actions { display: flex; justify-content: center; margin-bottom: 40px; }

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 30px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #ffffff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(99, 102, 241, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(99, 102, 241, 0.45); }
.btn-primary:active { transform: scale(0.97); }

.footer { text-align: center; color: var(--muted); font-size: 13px; font-weight: 500; }

@media (max-width: 560px) {
  .stats { gap: 10px; }
  .stat-value { font-size: 26px; }
  .topbar { margin-bottom: 32px; }
}
</style>