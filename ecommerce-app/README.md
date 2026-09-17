# ShopEasy - E-commerce App (React Native + Expo)

Simple, easy-to-edit e-commerce app (user side only) with dummy data.
No backend, no real database — sab kuch mock data se chal raha hai.

## Features
- Login / Signup (dummy — koi bhi email/password chal jayega)
- Product listing with Search + Category Filters
- Product Detail page
- Cart (add/remove/update quantity)
- Checkout (address + payment method) → Order placed
- Order History
- Logout (Account tab)

## How to run

1. Install dependencies:
   ```
   npm install
   ```

2. Start the project:
   ```
   npx expo start
   ```

3. Scan the QR code with the **Expo Go** app (Android/iOS) from your phone,
   or press `a` for Android emulator / `i` for iOS simulator.

If you see version mismatch warnings, run:
```
npx expo install --fix
```

## Folder Structure (easy to edit)

```
App.js                        -> app entry point
src/
  theme.js                    -> ALL colors & sizes (edit here to re-theme app)
  data/products.js            -> dummy product list (add/edit/remove products here)
  context/AppContext.js       -> app-wide state: user, cart, orders (plain useState)
  navigation/AppNavigator.js  -> screen navigation setup (tabs + stacks)
  components/
    ProductCard.js            -> single product card (grid item)
    SearchBar.js               -> search input box
    CategoryFilter.js          -> category chips row
  screens/
    LoginScreen.js
    SignupScreen.js
    HomeScreen.js              -> product listing + search + filter
    ProductDetailScreen.js
    CartScreen.js
    CheckoutScreen.js
    OrderSuccessScreen.js
    OrdersScreen.js
    AccountScreen.js           -> profile + logout
```

## How to make common changes

- **App name / colors** → edit `src/theme.js`
- **Add / edit products** → edit `src/data/products.js`
- **Add a new category** → add it to `CATEGORIES` array in `src/data/products.js`
- **Change app icon/name shown on phone** → edit `app.json`
- **Add a new screen** → create file in `src/screens/`, then register it in
  `src/navigation/AppNavigator.js`

## Notes
- All data (cart, orders, login) resets when you close/reload the app —
  this is expected since there's no backend/storage yet.
- To persist data later, you can add `AsyncStorage` (`expo install @react-native-async-storage/async-storage`)
  inside `AppContext.js`.
- To connect a real backend later, replace the dummy functions inside
  `AppContext.js` (`login`, `signup`, `placeOrder`) with real API calls.
