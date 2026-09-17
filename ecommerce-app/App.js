import React from "react";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { AppProvider } from "./src/context/AppContext";
import AppNavigator from "./src/navigation/AppNavigator";

// Entry point of the app.
// AppProvider gives every screen access to user/cart/orders data.
// AppNavigator decides which screens to show (login flow vs main app).
export default function App() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <AppNavigator />
      <Toast />
    </AppProvider>
  );
}
