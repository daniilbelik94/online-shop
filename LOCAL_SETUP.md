# 🏠 Локальная разработка с Railway БД

## Настройка локального окружения

Ваше приложение теперь настроено для работы с базой данных Railway локально!

### 🚀 Быстрый старт

1. **Запуск backend API:**

   ```bash
   cd backend/public
   php -S localhost:8000
   ```

2. **Запуск frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Тестирование API:**
   Откройте в браузере: `http://localhost:8000/test-local-api.html`

### 🗄️ Конфигурация базы данных

Настройки Railway БД находятся в файле `backend/config/local.php`:

```php
'database' => [
    'host' => 'interchange.proxy.rlwy.net',
    'port' => '45401',
    'name' => 'railway',
    'username' => 'postgres',
    'password' => 'BOreDfeaiQUZeSJCtAUELdcwDISAwkfA'
]
```

### 🔗 URL'ы для разработки

- **Backend API:** http://localhost:8000/api
- **Frontend:** http://localhost:5173
- **Тест API:** http://localhost:8000/test-local-api.html

### ✅ Проверка работоспособности

1. **Здоровье API:**

   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Продукты:**

   ```bash
   curl http://localhost:8000/api/products
   ```

3. **Категории:**
   ```bash
   curl http://localhost:8000/api/categories
   ```

### 📊 Данные в БД

В базе данных уже есть тестовые данные:

- 2 продукта (iPhone 15 Pro, MacBook Air M3)
- 4 категории (Electronics, Clothing, Books, Home & Garden)
- Админ пользователь (email: admin@example.com, password: password)

### 🛠️ Полезные команды

**Остановить PHP сервер:**

```bash
# Найти процесс
lsof -i :8000
# Убить процесс
kill -9 <PID>
```

**Перезапуск с очисткой кеша:**

```bash
cd backend/public
php -S localhost:8000 -t .
```

### 🐛 Решение проблем

1. **Ошибка подключения к БД:**

   - Проверьте интернет соединение
   - Убедитесь, что Railway БД доступна

2. **CORS ошибки:**

   - Убедитесь, что PHP сервер запущен на порту 8000
   - Проверьте настройки в `backend/public/index.php`

3. **Frontend не видит продукты:**
   - Проверьте URL API в `frontend/src/lib/api.ts`
   - Должен быть: `http://localhost:8000/api`

### 🎯 Готово!

Теперь вы можете разрабатывать локально, используя данные из Railway БД!
