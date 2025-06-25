# 🚀 Schnelle Bereitstellung auf Railway

## In 5 Minuten zur Live-Website!

**Strategie:** Backend auf Railway + Frontend auf Vercel (Empfohlen für Stabilität)

### 1. Repository vorbereiten

```bash
git add .
git commit -m "Bereit für Bereitstellung"
git push origin main
```

### 2. Bei Railway registrieren

1. Gehen Sie zu [railway.app](https://railway.app)
2. Melden Sie sich über GitHub an
3. Erteilen Sie die erforderlichen Berechtigungen

### 3. Projekt erstellen

1. Klicken Sie auf **"New Project"**
2. Wählen Sie **"Deploy from GitHub repo"**
3. Wählen Sie Ihr Repository `online-shop`

### 4. Datenbank hinzufügen

1. Klicken Sie im Projekt-Dashboard auf **"New"**
2. Wählen Sie **"Database"** → **"PostgreSQL"**
3. Warten Sie auf die Erstellung

### 5. Umgebungsvariablen konfigurieren

Fügen Sie in den Service-Einstellungen hinzu:

```
APP_ENV=production
JWT_SECRET=ihr-super-sicherer-jwt-schluessel-mindestens-32-zeichen-lang
```

**Wichtig:** Railway erstellt automatisch die Variable `DATABASE_URL` beim Verbinden mit PostgreSQL.

### 6. Fertig! 🎉

- Railway stellt Ihre Anwendung automatisch bei Push zu main bereit
- Sie erhalten eine URL wie: `https://ihr-app-name.railway.app`
- Die Datenbank wird automatisch initialisiert
- GitHub Actions überprüft den Code bei jedem Commit

## 📱 Testkonten

- **Admin:** `admin@example.com` / `password`
- **Benutzer:** `test@example.com` / `password`

## 🔗 Was Sie erhalten

✅ Vollständiger Online-Shop  
✅ 35+ Produkte mit Bildern  
✅ Registrierung und Authentifizierung  
✅ Warenkorb  
✅ Admin-Panel  
✅ Responsive Design

---

**Bereitstellungszeit: ~5 Minuten**  
**Kosten: Kostenlos (Railway Free Tier)**
