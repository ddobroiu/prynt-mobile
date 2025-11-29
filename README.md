# Prynt Mobile App

Aplicația mobilă pentru www.prynt.ro - tipărire profesională la îndemâna ta.

## Stack Tehnic

- **Expo SDK 52** - Framework React Native
- **Expo Router** - Navigație file-based (ca Next.js)
- **TypeScript** - Type safety
- **NativeWind** - Tailwind CSS pentru React Native
- **Axios** - HTTP client pentru API calls
- **Expo SecureStore** - Stocare secură pentru tokens

## Arhitectură

Aplicația mobilă folosește **același backend** ca website-ul:
- **API:** www.prynt.ro/api/*
- **Database:** PostgreSQL partajată
- **Auth:** NextAuth tokens
- **Stripe:** Plăți integrate

## Instalare

```bash
cd mobile
npm install
```

## Configurare

1. Copiază `.env.example` în `.env`:
```bash
cp .env.example .env
```

2. Pentru dezvoltare locală, modifică în `.env`:
```
API_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000/api
```

3. Pentru producție (deploy):
```
API_URL=https://www.prynt.ro
API_BASE_URL=https://www.prynt.ro/api
```

## Rulare

```bash
# Development server
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android

# Web (pentru testare)
npm run web
```

## Structură Fișiere

```
mobile/
├── app/                    # Screens (Expo Router)
│   ├── (auth)/            # Auth screens (login, register)
│   ├── (tabs)/            # Main app tabs (home, orders, account)
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Welcome screen
├── lib/                   # Utilities
│   ├── api.ts            # API client (axios + interceptors)
│   └── auth.ts           # Auth helpers (tokens, user data)
├── components/            # Reusable components
├── types/                 # TypeScript types (shared with web)
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tailwind.config.js    # Tailwind configuration
```

## API Integration

Toate request-urile folosesc același API ca website-ul:

```typescript
import { apiClient } from '../lib/api';

// Get orders
const orders = await apiClient.getOrders();

// Get single order
const order = await apiClient.getOrder(orderId);

// Calculate price
const price = await apiClient.calculatePrice(config);
```

## Autentificare

Folosește NextAuth tokens stocate securizat:

```typescript
import { saveToken, getToken, logout } from '../lib/auth';

// After login
await saveToken(response.token);

// Check auth
const token = await getToken();

// Logout
await logout();
```

## Build pentru Producție

### Android (APK/AAB)

```bash
# Build APK pentru testare
eas build -p android --profile preview

# Build AAB pentru Google Play
eas build -p android --profile production
```

### iOS (IPA)

```bash
# Build pentru testare
eas build -p ios --profile preview

# Build pentru App Store
eas build -p ios --profile production
```

## Funcționalități Implementate

✅ **Autentificare** - Login/Register cu NextAuth API
✅ **Comenzi** - Listă comenzi cu status și detalii
✅ **Profil** - Informații utilizator
✅ **Navigation** - Tabs cu Home, Orders, Account
✅ **API Client** - Axios cu interceptors pentru auth
✅ **Secure Storage** - Tokens criptați cu SecureStore

## Next Steps (TODO)

- [ ] Configuratoare produse (Afișe, Bannere, etc.)
- [ ] Upload imagini pentru artwork
- [ ] Preview produse
- [ ] Coș de cumpărături
- [ ] Checkout și plăți Stripe
- [ ] Notificări push pentru statusuri comenzi
- [ ] Offline support cu AsyncStorage
- [ ] Share comenzi
- [ ] Camera pentru capturi artwork

## Costuri Deploy

- **Expo:** Gratis (EAS Build: 30 builds/lună gratis)
- **Apple Developer:** $99/an
- **Google Play:** $25 one-time
- **Backend:** $0 (refolosim www.prynt.ro)

## Support

Pentru probleme tehnice, verifică:
1. Logs: `npx expo start` → apasă `j` pentru logs
2. Network: Verifică că API_URL e corect în `.env`
3. Auth: Verifică tokens în SecureStore
