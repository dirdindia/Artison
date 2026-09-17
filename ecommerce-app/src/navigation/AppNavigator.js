import React from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import { COLORS } from "../theme";

// Screens
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SecurityScreen from "../screens/SecurityScreen";
import SupportTicketsScreen from "../screens/SupportTicketsScreen";
import ExploreScreen from "../screens/ExploreScreen";
import AboutScreen from "../screens/AboutScreen";
import ShippingScreen from "../screens/ShippingScreen";
import ReturnsScreen from "../screens/ReturnsScreen";
import ContactScreen from "../screens/ContactScreen";
import FeedbackScreen from "../screens/FeedbackScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// ----- Auth Stack: shown when user is NOT logged in -----
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// ----- Home Stack: Home -> Product Detail -----
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ title: "Product Details" }}
    />
  </Stack.Navigator>
);

// ----- Cart Stack: Cart -> Checkout -> Order Success -----
const CartStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CartMain" component={CartScreen} options={{ title: "My Cart" }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Checkout" }} />
    <Stack.Screen
      name="OrderSuccess"
      component={OrderSuccessScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// ----- Custom Drawer Content -----
const CustomDrawerContent = (props) => {
  const { user } = useApp();
  
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      <View style={styles.drawerHeader}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.drawerAvatar} />
        ) : (
          <Ionicons name="person-circle" size={70} color={COLORS.primary} style={{ marginLeft: -5 }} />
        )}
        <Text style={styles.drawerName}>{user?.name || "User"}</Text>
        <Text style={styles.drawerEmail}>{user?.email}</Text>
      </View>
      <View style={styles.drawerDivider} />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

// ----- Account Drawer: Replaces Account Tab -----
const AccountDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.white },
      headerTintColor: COLORS.text,
      drawerActiveTintColor: COLORS.primary,
      drawerInactiveTintColor: COLORS.text,
    }}
  >
    <Drawer.Screen 
      name="ProfileInfo" 
      component={ProfileScreen} 
      options={{ 
        title: "Profile Info",
        drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />
      }} 
    />
    <Drawer.Screen 
      name="MyOrders" 
      component={OrdersScreen} 
      options={{ 
        title: "My Orders",
        drawerIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />
      }} 
    />
    <Drawer.Screen 
      name="Security" 
      component={SecurityScreen} 
      options={{ 
        title: "Security",
        drawerIcon: ({ color, size }) => <Ionicons name="shield-checkmark-outline" size={size} color={color} />
      }} 
    />
    <Drawer.Screen 
      name="SupportTickets" 
      component={SupportTicketsScreen} 
      options={{ 
        title: "Support Tickets",
        drawerIcon: ({ color, size }) => <Ionicons name="help-buoy-outline" size={size} color={color} />
      }} 
    />
    <Drawer.Screen 
      name="Feedback" 
      component={FeedbackScreen} 
      options={{ 
        title: "Feedback",
        drawerIcon: ({ color, size }) => <Ionicons name="star-outline" size={size} color={color} />
      }} 
    />
    <Drawer.Screen 
      name="About" 
      component={AboutScreen} 
      options={{ 
        title: "About KalaKosh",
        drawerIcon: ({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} />
      }} 
    />
    <Drawer.Screen 
      name="Shipping" 
      component={ShippingScreen} 
      options={{ 
        title: "Shipping & Delivery",
        drawerIcon: ({ color, size }) => <Ionicons name="paper-plane-outline" size={size} color={color} />
      }} 
    />
    <Drawer.Screen 
      name="Returns" 
      component={ReturnsScreen} 
      options={{ 
        title: "Returns & Refunds",
        drawerIcon: ({ color, size }) => <Ionicons name="sync-outline" size={size} color={color} />
      }} 
    />
    <Drawer.Screen 
      name="Contact" 
      component={ContactScreen} 
      options={{ 
        title: "Contact Us",
        drawerIcon: ({ color, size }) => <Ionicons name="call-outline" size={size} color={color} />
      }} 
    />
  </Drawer.Navigator>
);

// Small red badge shown over the cart icon
const CartIcon = ({ color, size }) => {
  const { cartCount } = useApp();
  return (
    <View>
      <Ionicons name="cart-outline" size={size} color={color} />
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </View>
  );
};

// ----- Main Tabs: shown when user IS logged in -----
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Home: "home-outline",
          Explore: "compass-outline",
          Cart: "cart-outline",
          Orders: "receipt-outline",
          Account: "person-outline",
        };
        if (route.name === "Cart") {
          return <CartIcon color={color} size={size} />;
        }
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Explore" component={ExploreScreen} />
    <Tab.Screen name="Cart" component={CartStack} />
    <Tab.Screen name="Account" component={AccountDrawer} />
  </Tab.Navigator>
);

// ----- Root Navigator: decides Auth vs Main based on login state -----
const AppNavigator = () => {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white }}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={{ width: 200, height: 80, marginBottom: 20 }} 
          resizeMode="contain" 
        />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -8,
    top: -4,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.white,
  },
  drawerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 10,
    backgroundColor: COLORS.border,
  },
  drawerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  drawerEmail: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
});

export default AppNavigator;
