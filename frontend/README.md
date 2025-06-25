# Frontend - Online Shop

React TypeScript Frontend für das Online-Shop-Projekt.

## Schnelle Bereitstellung auf Vercel

1. **Mit Vercel verbinden:**

   - Gehen Sie zu [vercel.com](https://vercel.com)
   - Importieren Sie dieses Repository
   - Setzen Sie das Stammverzeichnis auf `frontend`

2. **Umgebungsvariablen:**

   ```
   VITE_API_URL=https://ihr-backend-domain.railway.app/api
   ```

3. **Build-Einstellungen:**
   - Framework: Vite
   - Build-Befehl: `npm run build`
   - Ausgabeverzeichnis: `dist`

## Entwicklung

```bash
npm install
npm run dev
```

## Backend API

Dieses Frontend verbindet sich mit einer PHP Backend API. Stellen Sie sicher, dass Sie zuerst das Backend bereitstellen und die korrekte `VITE_API_URL` setzen.

## Umgebungsvariablen

- `VITE_API_URL` - Backend API URL (erforderlich für Produktion)

## Funktionen

- 🛒 **Vollständiger E-Commerce-Shop**
- 📱 **Responsive Design** für alle Geräte
- 🔐 **Benutzerauthentifizierung** mit JWT
- 🛍️ **Warenkorb-Funktionalität**
- 👑 **Admin-Panel** für Produktverwaltung
- 🔍 **Produktsuche und -filter**
- 🖼️ **Bildgalerien** mit Swiper

## Tech Stack

- **React 18** mit TypeScript
- **Material-UI** für UI-Komponenten
- **Redux Toolkit** für Zustandsverwaltung
- **React Router** für Routing
- **Axios** für HTTP-Anfragen
- **Vite** als Build-Tool
