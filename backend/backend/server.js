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
// Маршрут: логин
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Простая проверка (позже можно заменить на базу данных)
    if (username === 'admin' && password === 'admin') {
        res.json({ 
            success: true, 
            token: 'admin-token-123',
            username: 'admin'
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Неверный логин или пароль' 
        });
    }
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Сервер работает на порту ${PORT}`);
});