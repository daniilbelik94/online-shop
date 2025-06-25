# 🚀 Развертывание интернет-магазина

Этот документ описывает различные способы развертывания проекта для демонстрации в качестве пет-проекта.

## 📋 Подготовка проекта

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/your-username/online-shop.git
   cd online-shop
   ```

2. **Убедитесь, что все файлы готовы:**
   - ✅ `docker-compose.prod.yml` - продакшн конфигурация
   - ✅ `Dockerfile.backend` - Docker образ для бэкенда
   - ✅ `frontend/Dockerfile.prod` - Docker образ для фронтенда
   - ✅ `env.example` - пример переменных окружения

## 🛤️ Варианты развертывания

### 1. Railway (Рекомендуется) 🚂

**Преимущества:** Простота, автоматический деплой, PostgreSQL из коробки

1. **Создайте аккаунт на [Railway](https://railway.app)**

2. **Подключите GitHub репозиторий:**

   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите ваш репозиторий

3. **Настройте переменные окружения:**

   ```
   APP_ENV=production
   DB_HOST=database
   DB_NAME=railway
   DB_USERNAME=postgres
   DB_PASSWORD=<автоматически-генерируется>
   JWT_SECRET=your-super-secret-jwt-key-very-long-and-random
   ```

4. **Railway автоматически:**
   - Создаст PostgreSQL базу данных
   - Запустит ваше приложение
   - Предоставит публичный URL

### 2. Render 🎨

**Преимущества:** Бесплатный план, хорошая документация

1. **Создайте аккаунт на [Render](https://render.com)**

2. **Создайте PostgreSQL базу данных:**

   - Dashboard → New → PostgreSQL
   - Выберите план (Free для тестирования)
   - Сохраните DATABASE_URL

3. **Создайте Web Service:**

   - Dashboard → New → Web Service
   - Подключите GitHub репозиторий
   - Runtime: Docker
   - Dockerfile Path: `Dockerfile.backend`

4. **Настройте переменные окружения:**
   ```
   APP_ENV=production
   DATABASE_URL=<из-шага-2>
   JWT_SECRET=your-super-secret-jwt-key
   ```

### 3. DigitalOcean App Platform 🌊

**Преимущества:** Надежность, хорошая производительность

1. **Создайте аккаунт на [DigitalOcean](https://digitalocean.com)**

2. **Создайте новое приложение:**

   - Apps → Create App
   - Подключите GitHub
   - Выберите репозиторий

3. **Настройте компоненты:**

   - Backend: Docker, `Dockerfile.backend`
   - Database: PostgreSQL
   - Frontend: Static Site, `frontend/`

4. **Настройте переменные окружения**

### 4. VPS (Самостоятельное развертывание) 🖥️

**Для опытных пользователей**

1. **Арендуйте VPS** (DigitalOcean, Linode, Vultr)

2. **Установите Docker и Docker Compose:**

   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Клонируйте проект и запустите:**
   ```bash
   git clone https://github.com/your-username/online-shop.git
   cd online-shop
   cp env.example .env
   # Отредактируйте .env файл
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🔐 Безопасность

**Обязательно измените перед продакшеном:**

1. **JWT Secret** - сгенерируйте случайную строку длиной 64+ символа
2. **Database Password** - используйте сложный пароль
3. **CORS настройки** - ограничьте домены в продакшене

## 🗄️ База данных

**Ваша база содержит:**

- 📦 35+ продуктов с изображениями
- 🏷️ 10 категорий товаров
- 👤 3 тестовых пользователя
- 🛒 Готовая корзина и система заказов

**Тестовые аккаунты:**

- **Админ:** admin@example.com / password
- **Пользователь:** test@example.com / password

## 🔍 Мониторинг

**Проверьте что все работает:**

1. **Backend API:** `https://your-domain.com/api/health`
2. **Продукты:** `https://your-domain.com/api/products`
3. **Frontend:** `https://your-domain.com`

## 🛠️ Troubleshooting

**Частые проблемы:**

1. **База данных не подключается:**

   - Проверьте переменные окружения
   - Убедитесь что PostgreSQL запущен

2. **Изображения не загружаются:**

   - Проверьте CORS настройки
   - Убедитесь что Unsplash доступен

3. **Frontend не видит API:**
   - Проверьте `VITE_API_URL` в переменных окружения
   - Убедитесь что бэкенд доступен

## 📚 Демонстрация

**Что показать в вашем пет-проекте:**

✅ **Полнофункциональный интернет-магазин**
✅ **Microservices архитектура (Backend + Frontend)**  
✅ **PostgreSQL с реальными данными**
✅ **Docker контейнеризация**
✅ **REST API с документацией**
✅ **Responsive дизайн**
✅ **Авторизация и корзина покупок**

---

**🎯 Готово! Ваш интернет-магазин развернут и готов к демонстрации!**
