# 🚀 Быстрое развертывание на Railway

## За 5 минут до живого сайта!

### 1. Подготовка репозитория

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Регистрация на Railway

1. Идите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. Дайте разрешения

### 3. Создание проекта

1. Нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Выберите ваш репозиторий `online-shop`

### 4. Добавление базы данных

1. В дашборде проекта нажмите **"New"**
2. Выберите **"Database"** → **"PostgreSQL"**
3. Дождитесь создания

### 5. Настройка переменных окружения

В настройках сервиса добавьте:

```
APP_ENV=production
JWT_SECRET=your-super-secure-jwt-key-minimum-32-characters-long
```

### 6. Готово! 🎉

- Railway автоматически развернет ваше приложение
- Получите URL вида: `https://your-app-name.railway.app`
- База данных автоматически инициализируется

## 📱 Тестовые аккаунты

- **Админ:** `admin@example.com` / `password`
- **Пользователь:** `test@example.com` / `password`

## 🔗 Что получается

✅ Полноценный интернет-магазин  
✅ 35+ товаров с картинками  
✅ Регистрация и авторизация  
✅ Корзина покупок  
✅ Админ панель  
✅ Responsive дизайн

---

**Время развертывания: ~5 минут**  
**Стоимость: Бесплатно (Railway Free Tier)**
