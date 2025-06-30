#!/bin/bash

# 🚀 Скрипт настройки переменных окружения для Online Shop
# Автор: AI Assistant
# Версия: 1.0

set -e

echo "🔐 Настройка переменных окружения для Online Shop"
echo "=================================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для генерации случайного секрета
generate_secret() {
    openssl rand -base64 32 2>/dev/null || echo "your-super-secret-jwt-key-$(date +%s)"
}

# Функция для проверки существования файла
check_file() {
    if [ -f "$1" ]; then
        echo -e "${YELLOW}⚠️  Файл $1 уже существует. Пропускаем...${NC}"
        return 1
    else
        return 0
    fi
}

# Функция для создания .env файла
create_env_file() {
    local env_file=$1
    local template_file=$2
    
    if check_file "$env_file"; then
        echo -e "${BLUE}📝 Создаю $env_file...${NC}"
        cp "$template_file" "$env_file"
        echo -e "${GREEN}✅ $env_file создан успешно!${NC}"
    fi
}

# Функция для безопасной замены в файле (совместимость с macOS)
safe_replace() {
    local file=$1
    local search=$2
    local replace=$3
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|$search|$replace|g" "$file"
    else
        # Linux
        sed -i "s|$search|$replace|g" "$file"
    fi
}

# Основной .env файл
echo -e "${BLUE}🔧 Настройка основного .env файла...${NC}"
create_env_file ".env" "env.example"

# Фронтенд .env файл
echo -e "${BLUE}🔧 Настройка фронтенд .env файла...${NC}"
create_env_file "frontend/.env" "frontend/env.example"

# Генерация JWT секрета
echo -e "${BLUE}🔑 Генерация JWT секрета...${NC}"
JWT_SECRET=$(generate_secret)
echo -e "${GREEN}✅ JWT секрет сгенерирован: ${JWT_SECRET:0:20}...${NC}"

# Обновление .env файлов с реальными значениями
echo -e "${BLUE}📝 Обновление .env файлов...${NC}"

# Обновляем основной .env
if [ -f ".env" ]; then
    # Заменяем placeholder значения
    safe_replace ".env" "your-super-secret-jwt-key-change-in-production-make-it-very-long-and-random" "$JWT_SECRET"
    safe_replace ".env" "your-local-password" "postgres"
    safe_replace ".env" "your-secure-password-here" "postgres"
    echo -e "${GREEN}✅ Основной .env файл обновлен${NC}"
fi

# Обновляем фронтенд .env
if [ -f "frontend/.env" ]; then
    # Заменяем placeholder значения
    safe_replace "frontend/.env" "pk_test_your_stripe_publishable_key_here" "pk_test_placeholder_key"
    echo -e "${GREEN}✅ Фронтенд .env файл обновлен${NC}"
fi

# Проверка Docker
echo -e "${BLUE}🐳 Проверка Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker найден${NC}"
else
    echo -e "${RED}❌ Docker не найден. Установите Docker для запуска приложения${NC}"
fi

# Проверка Docker Compose
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose найден${NC}"
else
    echo -e "${RED}❌ Docker Compose не найден. Установите Docker Compose${NC}"
fi

# Создание директорий для загрузок
echo -e "${BLUE}📁 Создание директорий...${NC}"
mkdir -p backend/public/uploads
chmod 755 backend/public/uploads
echo -e "${GREEN}✅ Директория uploads создана${NC}"

# Финальные инструкции
echo ""
echo -e "${GREEN}🎉 Настройка завершена!${NC}"
echo ""
echo -e "${YELLOW}📋 Следующие шаги:${NC}"
echo "1. Отредактируйте .env файлы с вашими реальными значениями"
echo "2. Настройте Stripe ключи в .env файлах"
echo "3. Запустите приложение: docker-compose up -d"
echo "4. Откройте http://localhost:5173 в браузере"
echo ""
echo -e "${BLUE}📖 Подробная документация: ENVIRONMENT_SETUP.md${NC}"
echo -e "${BLUE}🔐 Безопасность: Никогда не коммитьте .env файлы в Git!${NC}"
echo ""

# Проверка безопасности
echo -e "${YELLOW}🔍 Проверка безопасности...${NC}"
if grep -q "your-super-secret" .env 2>/dev/null; then
    echo -e "${RED}⚠️  ВНИМАНИЕ: В .env файле остались placeholder значения!${NC}"
    echo -e "${YELLOW}   Отредактируйте .env файл перед продакшеном${NC}"
else
    echo -e "${GREEN}✅ .env файл настроен безопасно${NC}"
fi

echo ""
echo -e "${GREEN}✨ Готово к разработке!${NC}" 