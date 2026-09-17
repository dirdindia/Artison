import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { COLORS, SIZES } from "../theme";

const ShippingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Shipping & Delivery</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Processing Time</Text>
          <Text style={styles.paragraph}>
            All orders are processed within 1 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Domestic Shipping Rates and Estimates</Text>
          <Text style={styles.paragraph}>
            Shipping charges for your order will be calculated and displayed at checkout. We offer standard and expedited shipping options.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>International Shipping</Text>
          <Text style={styles.paragraph}>
            We offer international shipping to select countries. Shipping charges and delivery times vary by destination. Please note that your order may be subject to import duties and taxes, which are incurred once a shipment reaches your destination country.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How do I check the status of my order?</Text>
          <Text style={styles.paragraph}>
            When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 22,
  },
});

export default ShippingScreen;
