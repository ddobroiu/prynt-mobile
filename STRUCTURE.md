# Prynt Mobile - Structură Aplicație

## ✅ IMPLEMENTAT (MVP)

### 🎨 UI/UX
- **Welcome Screen** - Logo circular, butoane moderne
- **Tab Navigation** - Home, Orders, Account
- **Modern Design** - Culori vibrante, shadows, rounded corners
- **Responsive** - Funcționează web, iOS, Android

### 🔐 Autentificare
- **Login/Register** screens complete
- **SecureStore** pentru tokens
- **API Integration** către www.prynt.ro/api
- **Session management**

### 🏠 Homepage
- **Lista configuratoare** cu iconițe
- **Cards interactive** cu hover effects
- **Info section** cu features
- **Hero header** colorat

### 📱 Navigație
- **Expo Router** (file-based routing)
- **Deep linking** support
- **Modal presentations** pentru auth
- **Back navigation** corect implementată

### ⚙️ Configuratoare
- **Afișe** - Structură completă cu dimensiuni/materiale/prețuri reale din web
- **Placeholder-e** pentru: Bannere, Flyere, Pliante, Autocolante, Canvas, Tapet

### 🛒 Orders Screen
- **Listă comenzi** conectată la API
- **Status badges** colorate
- **Pull to refresh**
- **Empty state** când nu există comenzi

### 👤 Account Screen
- **Profile info** din SecureStore
- **Menu items** pentru Settings, Addresses, Help
- **Logout** cu confirmare

## 🚧 DE IMPLEMENTAT

### Prioritate ÎNALTĂ
1. **Configuratoare Complete**
   - [ ] Banner (Frontlit) - logica din `BannerConfigurator.tsx`
   - [ ] Banner Verso (Blockout) - logica din `BannerVersoConfigurator.tsx`
   - [ ] Flyere - logica din `FlyerConfigurator.tsx`
   - [ ] Pliante - logica din `PlianteConfigurator.tsx`
   - [ ] Autocolante - logica din `AutocolanteConfigurator.tsx`
   - [ ] Canvas - logica din `CanvasConfigurator.tsx`
   - [ ] Tapet - logica din web

2. **Upload Artwork**
   - [ ] `expo-image-picker` pentru camera/gallery
   - [ ] Preview imagine selectată
   - [ ] Upload la `/api/upload`
   - [ ] Progress indicator

3. **Coș Cumpărături**
   - [ ] Tab "Cart" în navigație
   - [ ] Add/Remove items
   - [ ] Update quantity
   - [ ] Total calculation
   - [ ] Persist în AsyncStorage

4. **Checkout Flow**
   - [ ] Adresă livrare (selector județ/localitate din web)
   - [ ] Date facturare (opțional - firmă)
   - [ ] Transport calculator
   - [ ] Payment cu Stripe React Native SDK
   - [ ] Order confirmation screen

### Prioritate MEDIE
5. **Order Details**
   - [ ] Screen detaliat pentru fiecare comandă
   - [ ] Download factură PDF
   - [ ] Track AWB
   - [ ] Contact support

6. **Account Features**
   - [ ] Edit profile (nume, email, telefon)
   - [ ] Change password
   - [ ] Addresses manager (CRUD)
   - [ ] Invoice history

7. **Push Notifications**
   - [ ] `expo-notifications` setup
   - [ ] Order status updates
   - [ ] Promotions (optional)

### Prioritate SCĂZUTĂ
8. **Offline Support**
   - [ ] AsyncStorage cache pentru produse
   - [ ] Offline queue pentru comenzi
   - [ ] Sync când revine online

9. **Advanced Features**
   - [ ] Share orders cu prieteni
   - [ ] Favorite products
   - [ ] Recent orders quick reorder
   - [ ] Camera pentru scan QR (tracking)

10. **Analytics & Marketing**
    - [ ] Firebase Analytics
    - [ ] Amplitude events
    - [ ] A/B testing cu Optimizely

## 📁 Structură Fișiere

```
mobile/
├── app/
│   ├── index.tsx              # Welcome screen
│   ├── _layout.tsx            # Root layout cu Stack
│   ├── (auth)/
│   │   ├── login.tsx          # ✅ Login form
│   │   └── register.tsx       # ✅ Register form
│   ├── (tabs)/
│   │   ├── _layout.tsx        # ✅ Tab navigation
│   │   ├── home.tsx           # ✅ Homepage cu configuratoare
│   │   ├── orders.tsx         # ✅ Listă comenzi
│   │   └── account.tsx        # ✅ Profile & settings
│   └── config/
│       ├── afise.tsx          # ✅ Configurator Afișe (complet)
│       └── [id].tsx           # ⏳ Placeholder pentru restul
├── lib/
│   ├── api.ts                 # ✅ Axios client + interceptors
│   └── auth.ts                # ✅ SecureStore helpers
├── components/                # 📦 Pentru viitor (componente reusabile)
├── hooks/                     # 📦 Custom hooks
└── types/                     # 📦 TypeScript types shared

```

## 🔄 API Endpoints Folosite

### ✅ Implementate
- `POST /api/auth/login` - Autentificare
- `POST /api/auth/register` - Înregistrare
- `GET /api/orders` - Listă comenzi
- `GET /api/user/profile` - Profil utilizator

### 🚧 De implementat
- `POST /api/calc-price` - Calcul preț configurator
- `POST /api/upload` - Upload artwork
- `POST /api/order` - Creare comandă nouă
- `GET /api/products` - Listă produse
- `GET /api/invoices` - Facturi utilizator

## 🎯 Next Steps (În ordinea priorității)

1. **Finalizare configuratoare** - Copiază logica din web pentru fiecare produs
2. **Upload artwork** - Implementează `expo-image-picker`
3. **Coș cumpărături** - Context + AsyncStorage
4. **Checkout** - Adresă + Payment Stripe
5. **Order tracking** - Detalii comandă + AWB

## 📱 Deploy

### Development
```bash
cd mobile
npm start
# Apoi: 'w' pentru web, 'a' pentru Android, 'i' pentru iOS
```

### Production Build
```bash
# Android APK
eas build -p android --profile preview

# iOS IPA
eas build -p ios --profile preview

# App Store / Google Play
eas build -p all --profile production
eas submit
```

## 🔗 Links
- **Repo:** https://github.com/ddobroiu/prynt-mobile
- **Web API:** https://www.prynt.ro/api
- **Database:** Shared PostgreSQL cu web app
