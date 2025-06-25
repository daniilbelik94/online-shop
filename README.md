# �� Online Shop - Full-Stack E-Commerce Platform

Eine moderne, vollständige E-Commerce-Anwendung mit React (TypeScript) Frontend und PHP Backend, bereitgestellt auf Vercel und Railway.

## 🌟 Live Demo

🚀 **Bereit, Ihre eigene zu implementieren?**

👉 **[Schnelle Bereitstellung](QUICK_DEPLOY.md)** - Online in 5 Minuten  
🏠 **[Lokale Entwicklung](LOCAL_SETUP.md)** - Entwicklungsumgebung einrichten

**Beispiel-Bereitstellung:**

- **Frontend**: https://online-shop-front-liard.vercel.app/
- **Backend API**: https://online-shop-production-9724.up.railway.app/api
- **Admin-Panel**: Verfügbar nach Anmeldung mit Admin-Anmeldedaten

### 🎯 Was Sie erhalten:

- ✅ **Vollständige E-Commerce-Lösung** mit 35+ Produkten
- ✅ **Benutzerauthentifizierung** und Warenkorb
- ✅ **Admin-Panel** für Produktverwaltung
- ✅ **Responsive Design** für alle Geräte
- ✅ **REST API** mit ordnungsgemäßer Dokumentation
- ✅ **Docker-Containerisierung** für einfache Bereitstellung

## 🚀 Funktionen

### Frontend (React + TypeScript)

- ✅ **Responsive Design** - Funktioniert auf Desktop, Tablet und Mobilgerät
- ✅ **Produktkatalog** - Produkte durchsuchen und suchen
- ✅ **Warenkorb** - Artikel hinzufügen/entfernen, Mengenverwaltung
- ✅ **Benutzerauthentifizierung** - Anmeldung, Registrierung, Profilverwaltung
- ✅ **Admin-Dashboard** - Produktverwaltung, Benutzerverwaltung
- ✅ **Bildgalerie** - Produktbild-Karussell
- ✅ **Modernes UI** - Material-UI-Komponenten mit benutzerdefiniertem Styling

### Backend (PHP + PostgreSQL)

- ✅ **RESTful API** - Saubere API-Endpunkte
- ✅ **JWT-Authentifizierung** - Sichere token-basierte Authentifizierung
- ✅ **Admin-Panel** - Vollständige CRUD-Operationen
- ✅ **Bild-Upload** - Produktbildverwaltung
- ✅ **Datenbank** - PostgreSQL mit ordnungsgemäßen Beziehungen
- ✅ **CORS-Unterstützung** - Ordnungsgemäße Cross-Origin-Behandlung

## 🛠️ Tech Stack

### Frontend

- **React** 18 mit TypeScript
- **Material-UI** für Komponenten
- **Redux Toolkit** für Zustandsverwaltung
- **React Router** für Navigation
- **Axios** für API-Aufrufe
- **Swiper** für Produktslider
- **Vite** für Build-Tools

### Backend

- **PHP** 8.3 mit Apache
- **PostgreSQL** Datenbank
- **JWT** für Authentifizierung
- **Clean Architecture** mit DDD-Prinzipien
- **Docker** für Containerisierung

### Infrastruktur

- **Vercel** - Frontend-Hosting
- **Railway** - Backend-Hosting + PostgreSQL
- **Docker** - Containerisierung

## 📦 Installation & Einrichtung

### Voraussetzungen

- Node.js 18+ und npm
- Docker und Docker Compose (für lokale Entwicklung)
- Git

### Lokale Entwicklung

1. **Repository klonen:**

   ```bash
   git clone https://github.com/daniilbelik94/online-shop.git
   cd online-shop
   ```

2. **Frontend-Einrichtung:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend-Einrichtung (Docker):**

   ```bash
   # Vom Projektverzeichnis
   docker-compose up -d
   ```

4. **Umgebungsvariablen:**
   Erstellen Sie eine `.env`-Datei im Projektverzeichnis:

   ```bash
   # Datenbank
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ecommerce
   DB_USERNAME=postgres
   DB_PASSWORD=password

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRATION=3600

   # Frontend
   VITE_API_URL=http://localhost:8080/api
   ```

## 🚀 Produktive Bereitstellung

### Railway Backend-Einrichtung

**Umgebungsvariablen** (bereits konfiguriert):

```
APP_ENV=production
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c-very-long-random-secret-key-for-production-use
DATABASE_URL=postgresql://postgres:dUFmWnOWkvRdcjvczdrjghjijEnyWgvh@postgres.railway.internal:5432/railway
```

### Vercel Frontend-Einrichtung

**Umgebungsvariablen:**

```
VITE_API_URL=https://online-shop-production-9724.up.railway.app/api
```

## 📖 API-Dokumentation

### Authentifizierungs-Endpunkte

```
POST /api/auth/login
POST /api/auth/refresh
POST /api/users (Registrierung)
```

### Produkt-Endpunkte

```
GET /api/products
GET /api/products/{slug}
POST /api/admin/products (nur Admin)
PUT /api/admin/products/{id} (nur Admin)
DELETE /api/admin/products/{id} (nur Admin)
```

### Benutzer-Endpunkte

```
GET /api/user/me
PUT /api/user/me
GET /api/user/orders
```

### Admin-Endpunkte

```
GET /api/admin/users
PUT /api/admin/users/{id}
GET /api/admin/products/stats
```

## 🔐 Standard-Anmeldedaten

**Admin-Benutzer:**

- Email: `admin@example.com`
- Passwort: `password`

**Test-Benutzer:**

- Email: `test@example.com`
- Passwort: `password`

## 🗄️ Datenbank

**Ihre Datenbank enthält:**

- 📦 35+ Produkte mit Bildern von Unsplash
- 🏷️ 10 Produktkategorien
- 👤 Mehrere Testbenutzer
- 🛒 Funktionsfähiger Warenkorb und Bestellsystem

## 🔍 Überwachung

**Überprüfen Sie, ob alles funktioniert:**

1. **Backend API:** `https://online-shop-production-9724.up.railway.app/api/health`
2. **Produkte:** `https://online-shop-production-9724.up.railway.app/api/products`
3. **Frontend:** `https://online-shop-front-liard.vercel.app`

## 🛠️ Fehlerbehebung

**Häufige Probleme:**

1. **Datenbank verbindet sich nicht:**

   - Überprüfen Sie die Umgebungsvariablen
   - Stellen Sie sicher, dass PostgreSQL läuft

2. **Bilder laden nicht:**

   - Überprüfen Sie CORS-Einstellungen
   - Stellen Sie sicher, dass Unsplash verfügbar ist

3. **Frontend sieht API nicht:**
   - Überprüfen Sie `VITE_API_URL` in Umgebungsvariablen
   - Stellen Sie sicher, dass Backend verfügbar ist

## 📚 Demo-Features

**Was in Ihrem Portfolio-Projekt zu zeigen:**

✅ **Vollständiger Online-Shop**  
✅ **Microservices-Architektur (Backend + Frontend)**  
✅ **PostgreSQL mit echten Daten**  
✅ **Docker-Containerisierung**  
✅ **REST API mit Dokumentation**  
✅ **Responsive Design**  
✅ **Authentifizierung und Warenkorb**

---

**🎯 Fertig! Ihr Online-Shop ist bereitgestellt und bereit zur Demonstration!**

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
