# File Storage API - Dokumentation für Excel Add-in

## 1. Signup & Authentifizierung

### Signup (mit Account-Erstellung)

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://your-project.supabase.co",
  "YOUR_PUBLIC_KEY"
);

async function signupWithAccount() {
  const { data, error } = await supabase.auth.signUp({
    email: "user@example.com",
    password: "SecurePassword123",
    options: {
      data: {
        account_name: "Mein Unternehmen", // Wird als Account-Name verwendet
      },
    },
  });

  if (error) {
    console.error("Signup failed:", error.message);
    return;
  }

  const accessToken = data.session?.access_token;
  console.log("Signup erfolgreich, Token:", accessToken);

  return accessToken;
}
```

**Benötigte Daten:**
- `email`: Eindeutige E-Mail
- `password`: Mindestens 6 Zeichen
- `options.data.account_name`: Name des Unternehmens/Accounts (wird verwendet, um Ordnerstruktur zu erstellen)

---

### Token abrufen (nach Anmeldung)

```typescript
async function getAccessToken(): Promise<string | null> {
  // Existierende Session prüfen
  const { data } = await supabase.auth.getSession();

  if (data.session?.access_token) {
    return data.session.access_token;
  }

  // Oder neu anmelden
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: "user@example.com",
    password: "SecurePassword123",
  });

  if (error) {
    console.error("Login failed:", error.message);
    return null;
  }

  return authData.session?.access_token || null;
}
```

---

## 2. API-Endpoint: Init

Nach erfolgreicher Anmeldung: **Kompletter Baum laden (Ordner + Dateien)**

```http
GET /api/file-storage/init
Authorization: Bearer {accessToken}
```

**TypeScript:**
```typescript
async function initFileStorage(token: string) {
  const response = await fetch(
    "https://your-api.com/api/file-storage/init",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error(`[${response.status}] ${error.error}`);
    return null;
  }

  const data = await response.json();
  return data; // { folders, files }
}
```

**Antwort (200):**
```json
{
  "folders": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Meine Templates",
      "parent_id": null,
      "is_root": true,
      "user_id": "user-uuid"
    }
  ],
  "files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "folder_id": "550e8400-e29b-41d4-a716-446655440000",
      "original_filename": "template.xltx",
      "file_size": 2048,
      "created_at": "2026-02-16T10:00:00Z"
    }
  ]
}
```

---

## 3. Workflow für Excel Add-in

```typescript
// 1. App-Start
async function initializeApp() {
  // a) Signup (falls neu)
  let token = await signupWithAccount();

  // b) Oder existierende Session laden
  if (!token) {
    token = await getAccessToken();
  }

  if (!token) {
    console.error("Keine Authentifizierung möglich");
    return;
  }

  // c) Dateibaum laden
  const data = await initFileStorage(token);

  if (data) {
    console.log("Ordner:", data.folders);
    console.log("Dateien:", data.files);
    // UI aufbauen...
  }
}

// App starten
initializeApp();
```

---

## 4. Error-Handling

```typescript
try {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    console.error(`API Error [${res.status}]:`, error.error);
    return null;
  }

  return await res.json();
} catch (err) {
  console.error("Network error:", err);
  return null;
}
```

**Status-Codes:**
- `200` - OK
- `400` - Bad Request (Validierungsfehler)
- `401` - Unauthorized (Token invalid/expired)
- `403` - Forbidden (keine Berechtigung)
- `500` - Server Error

---

## 5. Token-Management

```typescript
let cachedToken: string | null = null;

async function ensureToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;

  cachedToken = await getAccessToken();
  return cachedToken;
}
```

---

**Base URL:** `https://your-api.com` (anpassen!)
