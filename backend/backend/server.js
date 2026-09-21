const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Для хостинга порт задается автоматически

// Разрешаем запросы с любого адреса (временно, для разработки)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Тестовые данные парковки
let spots = [
    { id: 1, number: 'Место 1', status: 'Свободно' },
    { id: 2, number: 'Место 2', status: 'Занято' },
    { id: 3, number: 'Место 3', status: 'Свободно' }
];

// Главная страница (проверка, что сервер работает)
app.get('/', (req, res) => {
    res.json({ message: 'API парковки ПГНИУ работает!' });
});

// Маршрут: отдать все места
app.get('/api/spots', (req, res) => {
    res.json(spots);
});

// Маршрут: забронировать место
app.post('/api/spots/:id/book', (req, res) => {
    const spotId = parseInt(req.params.id);
    const spot = spots.find(s => s.id === spotId);

    if (!spot) return res.status(404).json({ error: 'Место не найдено' });
    if (spot.status !== 'Свободно') return res.status(400).json({ error: 'Место уже занято' });

    spot.status = 'Забронировано';
    res.json({ message: 'Место забронировано!', spot });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Сервер работает на порту ${PORT}`);
});