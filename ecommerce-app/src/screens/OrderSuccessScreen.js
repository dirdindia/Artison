import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../theme";

const OrderSuccessScreen = ({ route, navigation }) => {
  const { order } = route.params;

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={90} color={COLORS.success} />
      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.subtitle}>Your order #{order.id.slice(-6)} has been placed.</Text>
      <Text style={styles.total}>Total: ₹{order.total}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        }
      >
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
        <Text style={styles.link}>View My Orders</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: "center",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 15,
  },
  link: {
    color: COLORS.secondary,
    fontWeight: "bold",
  },
});

export default OrderSuccessScreen;
