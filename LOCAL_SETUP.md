# 🏠 Lokale Entwicklung mit Railway Datenbank

## Lokale Entwicklungsumgebung einrichten

Ihre Anwendung ist jetzt für die lokale Arbeit mit der Railway-Datenbank konfiguriert!

### 🚀 Schnellstart

1. **Backend API starten:**

   ```bash
   cd backend/public
   php -S localhost:8000
   ```

2. **Frontend starten:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **API testen:**
   Öffnen Sie im Browser: `http://localhost:8000/test-local-api.html`

### 🗄️ Datenbankkonfiguration

Die Railway-DB-Einstellungen befinden sich in der Datei `backend/config/local.php`:

```php
'database' => [
    'host' => 'interchange.proxy.rlwy.net',
    'port' => '45401',
    'name' => 'railway',
    'username' => 'postgres',
    'password' => 'BOreDfeaiQUZeSJCtAUELdcwDISAwkfA'
]
```

### 🔗 URLs für die Entwicklung

- **Backend API:** http://localhost:8000/api
- **Frontend:** http://localhost:5173
- **API-Test:** http://localhost:8000/test-local-api.html

### ✅ Funktionsprüfung

1. **API-Gesundheit:**

   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Produkte:**

   ```bash
   curl http://localhost:8000/api/products
   ```

3. **Kategorien:**
   ```bash
   curl http://localhost:8000/api/categories
   ```

### 📊 Daten in der Datenbank

Die Datenbank enthält bereits Testdaten:

- 35+ Produkte mit Bildern von Unsplash
- 10 Kategorien (Electronics, Clothing, Books, etc.)
- Admin-Benutzer (email: admin@example.com, passwort: password)
- Test-Benutzer (email: test@example.com, passwort: password)

### 🛠️ Nützliche Befehle

**PHP-Server stoppen:**

```bash
# Prozess finden
lsof -i :8000
# Prozess beenden
kill -9 <PID>
```

**Mit Cache-Löschung neu starten:**

```bash
cd backend/public
php -S localhost:8000 -t .
```

### 🐛 Problemlösung

1. **Datenbankverbindungsfehler:**

   - Überprüfen Sie die Internetverbindung
   - Stellen Sie sicher, dass die Railway-DB verfügbar ist

2. **CORS-Fehler:**

   - Stellen Sie sicher, dass der PHP-Server auf Port 8000 läuft
   - Überprüfen Sie die Einstellungen in `backend/public/index.php`

3. **Frontend sieht keine Produkte:**
   - Überprüfen Sie die API-URL in `frontend/src/lib/api.ts`
   - Sollte sein: `http://localhost:8000/api`

### 🎯 Fertig!

Jetzt können Sie lokal entwickeln und dabei Daten aus der Railway-Datenbank verwenden!
