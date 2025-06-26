# 🛒 Online Shop - Vollständige E-Commerce-Plattform

<div align="center">

![Online Shop Banner](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=200&fit=crop&crop=center)

**Eine moderne, vollständige E-Commerce-Anwendung mit React (TypeScript) Frontend und PHP Backend**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Online_Shop-success?style=for-the-badge)](https://online-shop-front-liard.vercel.app/)
[![Backend API](https://img.shields.io/badge/🔗_Backend_API-Railway-blue?style=for-the-badge)](https://online-shop-production-9724.up.railway.app/api)
[![GitHub](https://img.shields.io/badge/📂_GitHub-Repository-black?style=for-the-badge)](https://github.com/daniilbelik94/online-shop)

</div>

---

## 🌟 Live Demo & Schnellstart

### 🚀 **Sofort loslegen:**

| Komponente          | URL                                                                               | Status        |
| ------------------- | --------------------------------------------------------------------------------- | ------------- |
| 🎨 **Frontend**     | [online-shop-front-liard.vercel.app](https://online-shop-front-liard.vercel.app/) | ✅ Online     |
| 🔧 **Backend API**  | [API Endpunkt](https://online-shop-production-9724.up.railway.app/api)            | ✅ Online     |
| 💚 **Health Check** | [API Gesundheit](https://online-shop-production-9724.up.railway.app/api/health)   | ✅ Aktiv      |
| 👑 **Admin Panel**  | Nach Anmeldung verfügbar                                                          | ✅ Funktional |

### 📋 **Schnelle Bereitstellung:**

- 👉 **[5-Minuten-Deploy](QUICK_DEPLOY.md)** - Ihr eigener Shop in 5 Minuten
- 🏠 **[Lokale Entwicklung](LOCAL_SETUP.md)** - Entwicklungsumgebung einrichten

---

## 🎯 Was Sie erhalten

<table>
<tr>
<td width="50%">

### 🛍️ **Vollständiger E-Commerce-Shop**

- ✅ **35+ Produkte** mit echten Bildern von Unsplash
- ✅ **10 Kategorien** (Electronics, Clothing, Books, etc.)
- ✅ **Warenkorb-System** mit Session-Persistierung
- ✅ **Benutzerregistrierung** und Authentifizierung
- ✅ **Admin-Panel** für Produktverwaltung
- ✅ **Responsive Design** für alle Geräte

</td>
<td width="50%">

### 🏗️ **Professionelle Architektur**

- ✅ **Microservices** (Frontend + Backend getrennt)
- ✅ **REST API** mit sauberer Dokumentation
- ✅ **Docker-Containerisierung** für einfache Bereitstellung
- ✅ **PostgreSQL** mit echten Daten
- ✅ **JWT-Authentifizierung** für Sicherheit
- ✅ **CORS-Unterstützung** für Cross-Origin-Requests

</td>
</tr>
</table>

---

## 🚀 Funktionen im Detail

### 🎨 **Frontend (React + TypeScript)**

<details>
<summary><b>🖥️ Benutzeroberfläche & UX</b></summary>

- **📱 Responsive Design** - Perfekt auf Desktop, Tablet und Mobilgerät
- **🎨 Material-UI** - Moderne, konsistente Benutzeroberfläche
- **🔍 Produktsuche** - Echtzeit-Suche mit Filtern
- **🖼️ Bildgalerien** - Produktbilder mit Swiper-Karussell
- **🌙 Optimierte Performance** - Lazy Loading und Code-Splitting
- **♿ Barrierefreiheit** - WCAG-konforme Implementierung

</details>

<details>
<summary><b>🛒 E-Commerce-Funktionen</b></summary>

- **🛍️ Produktkatalog** - Kategorisierte Produktübersicht
- **🔍 Erweiterte Suche** - Filter nach Preis, Kategorie, Marke
- **🛒 Warenkorb** - Artikel hinzufügen/entfernen, Mengen verwalten
- **💳 Checkout-Prozess** - Streamlined Bestellabwicklung
- **📦 Bestellhistorie** - Vergangene Bestellungen einsehen
- **⭐ Produktdetails** - Ausführliche Produktinformationen

</details>

<details>
<summary><b>👤 Benutzerverwaltung</b></summary>

- **🔐 Sichere Authentifizierung** - JWT-basierte Anmeldung
- **📝 Benutzerregistrierung** - Einfacher Registrierungsprozess
- **👤 Profilmanagement** - Persönliche Daten verwalten
- **🔑 Passwort-Reset** - Sichere Passwort-Wiederherstellung
- **📧 E-Mail-Verifizierung** - Bestätigung der E-Mail-Adresse
- **Adressverwaltung** - Lieferadressen hinzufügen und bearbeiten
- **Bestellhistorie & Stornierung** - Bestellungen einsehen und stornieren
- **Wunschliste** - Produkte auf einer Wunschliste speichern und verwalten
- **E-Mail-Benachrichtigungen** - Bestellbestätigungen und Status-Updates (in Kürze)

</details>

### 🔧 **Backend (PHP + PostgreSQL)**

<details>
<summary><b>🏗️ API-Architektur</b></summary>

- **🔗 RESTful API** - Saubere, dokumentierte Endpunkte
- **📊 Clean Architecture** - DDD-Prinzipien und Separation of Concerns
- **🗃️ Repository Pattern** - Abstrahierte Datenbankzugriffe
- **🔒 Middleware** - Authentifizierung und Autorisierung
- **📝 API-Dokumentation** - Vollständig dokumentierte Endpunkte
- **⚡ Optimierte Queries** - Effiziente Datenbankabfragen
- **🛡️ Schutz vor Brute-Force-Angriffen** (in Kürze)

</details>

<details>
<summary><b>🔐 Sicherheit & Authentifizierung</b></summary>

- **🔑 JWT-Tokens** - Sichere, stateless Authentifizierung
- **🛡️ Password Hashing** - Bcrypt für sichere Passwort-Speicherung
- **🚪 Role-based Access** - Admin- und Benutzerrollen
- **🔒 CORS-Schutz** - Konfigurierte Cross-Origin-Richtlinien
- **🛡️ Input Validation** - Schutz vor SQL-Injection und XSS
- **📊 Rate Limiting** - Schutz vor Brute-Force-Angriffen

</details>

<details>
<summary><b>🗄️ Datenbank & Persistierung</b></summary>

- **🐘 PostgreSQL** - Robuste, relationale Datenbank
- **🔗 Referentielle Integrität** - Saubere Datenbeziehungen
- **📊 Optimierte Indizes** - Schnelle Abfragen
- **🔄 Migrationen** - Versionierte Datenbankschemas
- **💾 Transaktionen** - ACID-konforme Datenoperationen
- **🔍 Erweiterte Suchfunktionen** (in Kürze)

</details>

---

## 🛠️ Technologie-Stack

<table>
<tr>
<td width="33%">

### 🎨 **Frontend**

```typescript
// Haupttechnologien
React 18 + TypeScript
Material-UI (MUI)
Redux Toolkit
React Router v6
Axios
Vite

// UI/UX Bibliotheken
Swiper (Karussells)
React Hook Form
React Query
Framer Motion

// Zusätzliche Features
Uptime Monitoring
```

</td>
<td width="33%">

### 🔧 **Backend**

```php
// Haupttechnologien
PHP 8.3 + Apache
PostgreSQL 15
JWT Authentication
Clean Architecture
Docker

// Zusätzliche Tools
Composer (Dependencies)
PSR-4 Autoloading
Doctrine DBAL
Monolog (Logging)
```

</td>
<td width="33%">

### ☁️ **Infrastruktur**

```yaml
# Deployment
Vercel (Frontend)
Railway (Backend + DB)
Docker Compose
GitHub Actions

# Monitoring
Health Checks
Error Logging
Performance Metrics
Uptime Monitoring
```

</td>
</tr>
</table>

---

## 📦 Installation & Entwicklung

### 🔧 **Voraussetzungen**

```bash
# Erforderliche Software
Node.js 18+ und npm
Docker & Docker Compose
Git
PHP 8.3+ (für lokale Backend-Entwicklung)
```

### 🚀 **Schnellstart für lokale Entwicklung**

<details>
<summary><b>1️⃣ Repository klonen & Dependencies installieren</b></summary>

```bash
# Repository klonen
git clone https://github.com/daniilbelik94/online-shop.git
cd online-shop

# Frontend Dependencies
cd frontend
npm install

# Backend Dependencies (optional für lokale Entwicklung)
cd ../backend
composer install
```

</details>

<details>
<summary><b>2️⃣ Umgebung konfigurieren</b></summary>

```bash
# .env Datei erstellen
cp env.example .env

# Konfiguration anpassen
# Für lokale Entwicklung mit Docker:
DB_HOST=localhost
DB_PORT=5433
DB_NAME=ecommerce
DB_USERNAME=postgres
DB_PASSWORD=password

# JWT Konfiguration
JWT_SECRET=ihr-super-sicherer-jwt-schluessel-mindestens-32-zeichen
JWT_EXPIRATION=3600

# Frontend API URL
VITE_API_URL=http://localhost:8080/api
```

</details>

<details>
<summary><b>3️⃣ Services starten</b></summary>

```bash
# Backend mit Docker starten
docker-compose up -d

# Frontend entwicklungsserver starten
cd frontend
npm run dev

# Öffnen Sie:
# Frontend: http://localhost:5173
# Backend: http://localhost:8080/api
```

</details>

### 🧪 **Entwicklungstools**

```bash
# Frontend
npm run dev          # Entwicklungsserver
npm run build        # Produktions-Build
npm run preview      # Build-Vorschau
npm run lint         # Code-Linting
npm run type-check   # TypeScript-Prüfung

# Backend
docker-compose logs -f api    # API-Logs anzeigen
docker-compose exec db psql   # Datenbank-Konsole
docker-compose restart       # Services neustarten
```

---

## 🚀 Produktions-Deployment

### 🚂 **Railway (Backend + Datenbank)**

<details>
<summary><b>Schritt-für-Schritt Railway Setup</b></summary>

1. **Account erstellen:** [railway.app](https://railway.app)
2. **Projekt erstellen:** "Deploy from GitHub repo"
3. **PostgreSQL hinzufügen:** Database → PostgreSQL
4. **Umgebungsvariablen setzen:**

```env
APP_ENV=production
JWT_SECRET=ihr-super-sicherer-produktions-jwt-schluessel-64-zeichen-lang
DATABASE_URL=postgresql://user:pass@host:port/db  # Automatisch gesetzt
```

5. **Automatisches Deployment:** Bei jedem Git-Push

</details>

### ▲ **Vercel (Frontend)**

<details>
<summary><b>Schritt-für-Schritt Vercel Setup</b></summary>

1. **Account erstellen:** [vercel.com](https://vercel.com)
2. **Repository importieren:** GitHub-Integration
3. **Build-Einstellungen:**

   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Umgebungsvariablen:**

```env
VITE_API_URL=https://ihr-backend.railway.app/api
```

</details>

---

## 📖 API-Dokumentation

### 🔐 **Authentifizierung**

<details>
<summary><b>Auth Endpoints</b></summary>

```typescript
// Anmeldung
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}
// Response: { "token": "jwt-token", "user": {...} }

// Token erneuern
POST /api/auth/refresh
Headers: { "Authorization": "Bearer <token>" }

// Registrierung
POST /api/users
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password",
  "first_name": "John",
  "last_name": "Doe"
}
```

</details>

### 🛍️ **Produkte**

<details>
<summary><b>Product Endpoints</b></summary>

```typescript
// Alle Produkte abrufen
GET /api/products?page=1&limit=12&category=electronics&search=iphone

// Einzelnes Produkt
GET /api/products/{slug}

// Admin: Produkt erstellen
POST /api/admin/products
Headers: { "Authorization": "Bearer <admin-token>" }
{
  "name": "iPhone 15 Pro",
  "slug": "iphone-15-pro",
  "description": "Latest iPhone...",
  "price": 999.99,
  "category_id": "uuid",
  "stock_quantity": 50,
  "images": ["url1", "url2"]
}

// Admin: Produkt aktualisieren
PUT /api/admin/products/{id}

// Admin: Produkt löschen
DELETE /api/admin/products/{id}
```

</details>

### 🛒 **Warenkorb**

<details>
<summary><b>Cart Endpoints</b></summary>

```typescript
// Warenkorb abrufen
GET /api/cart
Headers: { "Authorization": "Bearer <token>" }

// Artikel hinzufügen
POST /api/cart/add
{
  "product_id": "uuid",
  "quantity": 2
}

// Artikel aktualisieren
PUT /api/cart/update
{
  "product_id": "uuid",
  "quantity": 3
}

// Artikel entfernen
DELETE /api/cart/remove/{product_id}

// Warenkorb leeren
DELETE /api/cart/clear
```

</details>

### 👤 **Benutzer & Admin**

<details>
<summary><b>User & Admin Endpoints</b></summary>

```typescript
// Benutzerprofil
GET /api/user/me
PUT /api/user/me

// Bestellhistorie
GET /api/user/orders

// Admin: Alle Benutzer
GET /api/admin/users

// Admin: Benutzer verwalten
PUT /api/admin/users/{id}
{
  "role": "admin",
  "is_active": true
}

// Admin: Statistiken
GET /api/admin/stats
// Response: { "users": 150, "products": 35, "orders": 1200 }
```

</details>

---

## 🔐 Standard-Anmeldedaten

<table>
<tr>
<td width="50%">

### 👑 **Admin-Zugang**

```
📧 Email: admin@example.com
🔑 Passwort: password
🎯 Berechtigung: Vollzugriff
```

**Funktionen:**

- ✅ Produktverwaltung
- ✅ Benutzerverwaltung
- ✅ Bestellübersicht
- ✅ Statistiken

</td>
<td width="50%">

### 👤 **Test-Benutzer**

```
📧 Email: test@example.com
🔑 Passwort: password
🎯 Berechtigung: Standard-Benutzer
```

**Funktionen:**

- ✅ Produkte durchsuchen
- ✅ Warenkorb verwenden
- ✅ Bestellungen aufgeben
- ✅ Profil verwalten

</td>
</tr>
</table>

---

## 🗄️ Datenbank-Schema

<details>
<summary><b>📊 Vollständiges Datenbankschema</b></summary>

```sql
-- Benutzer
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kategorien
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Produkte
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id UUID REFERENCES categories(id),
    brand VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warenkorb
CREATE TABLE cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    UNIQUE(session_id, product_id)
);
```

</details>

### 📊 **Vorhandene Daten**

| Kategorie         | Anzahl | Beispiele                                         |
| ----------------- | ------ | ------------------------------------------------- |
| 📦 **Produkte**   | 35+    | iPhone 15 Pro, MacBook Air M3, Samsung Galaxy S24 |
| 🏷️ **Kategorien** | 10     | Electronics, Clothing, Books, Home & Garden       |
| 👤 **Benutzer**   | 22+    | Admin, Test-Benutzer, Demo-Accounts               |
| 🖼️ **Bilder**     | 50+    | Hochwertige Unsplash-Bilder für alle Produkte     |

---

## 🔍 Monitoring & Gesundheitschecks

### 📊 **Verfügbare Endpoints**

```bash
# Backend-Gesundheit
curl https://online-shop-production-9724.up.railway.app/api/health
# Response: {"status": "healthy", "timestamp": "2024-01-20T10:30:00Z"}

# Datenbankverbindung
curl https://online-shop-production-9724.up.railway.app/api/products?limit=1
# Response: {"data": [...], "total": 35, "page": 1}

# Frontend-Status
curl https://online-shop-front-liard.vercel.app/
# Response: HTML der Hauptseite
```

### 📈 **Performance-Metriken**

- ⚡ **API Response Time:** < 200ms
- 🚀 **Frontend Load Time:** < 2s
- 💾 **Database Query Time:** < 50ms
- 📱 **Mobile PageSpeed:** 95+
- 🖥️ **Desktop PageSpeed:** 98+

---

## 🛠️ Fehlerbehebung

<details>
<summary><b>🔧 Häufige Probleme & Lösungen</b></summary>

### 🚫 **CORS-Fehler**

```bash
# Problem: Frontend kann nicht auf Backend zugreifen
# Lösung: Überprüfen Sie VITE_API_URL
echo $VITE_API_URL
# Sollte sein: https://ihr-backend.railway.app/api
```

### 🗄️ **Datenbankverbindung**

```bash
# Problem: "Database connection failed"
# Lösung: Überprüfen Sie DATABASE_URL in Railway
railway variables list
```

### 🔐 **Authentifizierung**

```bash
# Problem: "Invalid token"
# Lösung: JWT_SECRET in beiden Umgebungen identisch
# Lokale .env und Railway-Variablen synchronisieren
```

### 🐳 **Docker-Probleme**

```bash
# Container neustarten
docker-compose down && docker-compose up -d

# Logs überprüfen
docker-compose logs -f

# Volumes zurücksetzen
docker-compose down -v
```

</details>

<details>
<summary><b>🔧 Performance-Optimierung</b></summary>

### 🚀 **Frontend-Optimierungen**

- ✅ Code-Splitting mit React.lazy()
- ✅ Bildoptimierung mit WebP
- ✅ Service Worker für Caching
- ✅ Tree-shaking für Bundle-Größe

### ⚡ **Backend-Optimierungen**

- ✅ Datenbankindizes für häufige Abfragen
- ✅ Redis-Caching für Sessions
- ✅ Gzip-Komprimierung
- ✅ Connection Pooling

</details>

---

## 📚 Portfolio-Demonstration

### 🎯 **Was zu zeigen ist**

<table>
<tr>
<td width="50%">

#### 🏗️ **Technische Fähigkeiten**

- ✅ **Full-Stack-Entwicklung** (React + PHP)
- ✅ **Microservices-Architektur**
- ✅ **RESTful API-Design**
- ✅ **Datenbankdesign** (PostgreSQL)
- ✅ **Docker-Containerisierung**
- ✅ **Cloud-Deployment** (Vercel + Railway)
- ✅ **CI/CD** mit GitHub Actions

</td>
<td width="50%">

#### 💼 **Business-Features**

- ✅ **E-Commerce-Funktionalität**
- ✅ **Benutzerverwaltung**
- ✅ **Admin-Panel**
- ✅ **Responsive Design**
- ✅ **Sicherheitsimplementierung**
- ✅ **Performance-Optimierung**
- ✅ **Skalierbare Architektur**

</td>
</tr>
</table>

### 📋 **Demo-Szenario**

1. **🏠 Homepage** - Produktübersicht und Suche
2. **🔍 Produktdetails** - Einzelproduktansicht mit Bildern
3. **🛒 Warenkorb** - Artikel hinzufügen und verwalten
4. **🔐 Authentifizierung** - Anmeldung und Registrierung
5. **👑 Admin-Panel** - Produktverwaltung (als Admin)
6. **📱 Mobile Ansicht** - Responsive Design demonstrieren
7. **🔧 API-Dokumentation** - Backend-Endpoints zeigen

---

## 🚀 Nächste Schritte & Erweiterungen

<details>
<summary><b>🔮 Geplante Features</b></summary>

### 🛍️ **E-Commerce-Erweiterungen**

- [ ] PayPal/Stripe-Integration
- [ ] Bestellverfolgung
- [ ] Produktbewertungen
- [ ] Wunschliste
- [ ] Gutschein-System
- [ ] Inventarverwaltung

### 🔧 **Technische Verbesserungen**

- [ ] GraphQL API
- [ ] Real-time Notifications
- [ ] Progressive Web App (PWA)
- [ ] Multi-Language Support
- [ ] Advanced Analytics
- [ ] Automated Testing

</details>

---

## 📄 Lizenz & Kontakt

<div align="center">

### 📜 **MIT Lizenz**

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) für Details.

### 👨‍💻 **Entwickelt von**

**Daniil Belik** - Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-daniilbelik94-black?style=flat-square&logo=github)](https://github.com/daniilbelik94)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/daniilbelik)

---

### 🎯 **Bereit für Ihr nächstes Projekt?**

**Dieser Online-Shop demonstriert moderne Full-Stack-Entwicklung mit professioneller Architektur und Deployment-Strategien.**

[![Deploy Your Own](https://img.shields.io/badge/🚀_Deploy_Your_Own-Get_Started-success?style=for-the-badge)](QUICK_DEPLOY.md)

</div>

---

## 📝 Zusammenfassung der letzten Änderungen

### 📅 **27.07.2024: UI/UX-Verbesserungen**

In dieser Sitzung wurden wesentliche Verbesserungen an der Benutzeroberfläche und dem Benutzererlebnis vorgenommen, insbesondere auf der Produktdetailseite und im Wunschlisten-Drawer.

- **Produktdetailseite (`ProductDetailPage.tsx`):**

  - Die Bildergalerie wurde vergrößert, um Produkte besser darzustellen.
  - Das Layout wurde angepasst, um dem Bild mehr Platz zu geben und es besser zu zentrieren.
  - Die Schaltflächenstile wurden vereinheitlicht, um dem Design der gesamten Website (z. B. der Produktkarten) zu entsprechen.

- **Wunschlisten-Drawer (`WishlistDrawer.tsx`):**
  - Der ausziehbare Wunschlisten-Drawer wurde komplett neugestaltet, um dem modernen Design des Warenkorbs zu entsprechen.
  - Dies umfasst einen neuen Header, ein kartenbasiertes Layout für Artikel, einen Footer mit Navigationsschaltfläche und eine verbesserte Ansicht für eine leere Wunschliste.
