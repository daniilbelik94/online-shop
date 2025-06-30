# 🧪 Тестирование Online Shop

## Backend тесты (PHP)

### Установка зависимостей

```bash
cd backend
composer install
```

### Запуск тестов

```bash
# Запустить все тесты
./vendor/bin/phpunit

# Запустить только unit тесты
./vendor/bin/phpunit tests/Unit/

# Запустить конкретный тест
./vendor/bin/phpunit tests/Unit/ValidatorTest.php

# Запустить тесты с покрытием кода
./vendor/bin/phpunit --coverage-html coverage/
```

### Структура тестов

```
backend/tests/
├── Unit/                    # Unit тесты
│   ├── ValidatorTest.php    # Тесты валидации
│   └── ProductServiceTest.php # Тесты сервисов
└── Integration/             # Integration тесты
    └── (будущие тесты)
```

### Написание тестов

Пример unit теста:

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Utils\Validator;

class ValidatorTest extends TestCase
{
    private Validator $validator;

    protected function setUp(): void
    {
        $this->validator = new Validator();
    }

    public function testRequiredField()
    {
        $this->validator->required('name', '');
        $this->assertFalse($this->validator->isValid());
    }
}
```

## Frontend тесты (React/TypeScript)

### Установка зависимостей

```bash
cd frontend
npm install
```

### Запуск тестов

```bash
# Запустить все тесты
npm test

# Запустить тесты в watch режиме
npm test -- --watch

# Запустить тесты с покрытием
npm test -- --coverage
```

### Структура тестов

```
frontend/src/
├── components/
│   ├── __tests__/           # Тесты компонентов
│   │   └── StripePayment.test.tsx
│   └── StripePayment.tsx
└── utils/
    └── __tests__/           # Тесты утилит
        └── validation.test.ts
```

### Написание тестов

Пример теста компонента:

```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import StripePayment from "../StripePayment";

describe("StripePayment", () => {
  test("renders payment form", () => {
    render(
      <StripePayment amount={99.99} onSuccess={jest.fn()} onError={jest.fn()} />
    );

    expect(screen.getByText("Payment Information")).toBeInTheDocument();
  });
});
```

## E2E тесты (будущие)

### Cypress

```bash
# Установка
npm install cypress --save-dev

# Запуск
npx cypress open
```

### Playwright

```bash
# Установка
npm install playwright --save-dev

# Запуск
npx playwright test
```

## Покрытие кода

### Backend

```bash
# Генерация отчета о покрытии
./vendor/bin/phpunit --coverage-html coverage/

# Открыть отчет
open coverage/index.html
```

### Frontend

```bash
# Генерация отчета о покрытии
npm test -- --coverage --watchAll=false

# Отчет будет доступен в coverage/lcov-report/index.html
```

## CI/CD интеграция

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.1"
      - name: Install dependencies
        run: composer install
      - name: Run tests
        run: ./vendor/bin/phpunit

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test -- --coverage --watchAll=false
```

## Лучшие практики

### Backend

1. **Используйте моки для внешних зависимостей**
2. **Тестируйте граничные случаи**
3. **Группируйте тесты по функциональности**
4. **Используйте data providers для множественных тестов**

### Frontend

1. **Тестируйте поведение, а не реализацию**
2. **Используйте user-centric тесты**
3. **Мокайте API вызовы**
4. **Тестируйте accessibility**

### Общие

1. **Пишите тесты до кода (TDD)**
2. **Держите тесты простыми и читаемыми**
3. **Используйте описательные имена тестов**
4. **Поддерживайте тесты в актуальном состоянии**

## Отладка тестов

### Backend

```bash
# Запуск с подробным выводом
./vendor/bin/phpunit --verbose

# Запуск конкретного метода
./vendor/bin/phpunit --filter testMethodName
```

### Frontend

```bash
# Запуск в debug режиме
npm test -- --verbose

# Запуск конкретного теста
npm test -- --testNamePattern="test name"
```

## Полезные команды

```bash
# Backend
composer test                    # Запуск тестов
composer test:coverage          # Тесты с покрытием
composer test:unit              # Только unit тесты

# Frontend
npm test                        # Запуск тестов
npm run test:coverage          # Тесты с покрытием
npm run test:watch             # Тесты в watch режиме
```
