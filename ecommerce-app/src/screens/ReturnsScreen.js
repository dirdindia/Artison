import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { COLORS, SIZES } from "../theme";

const ReturnsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Returns & Refunds</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Return Policy</Text>
          <Text style={styles.paragraph}>
            We accept returns up to 14 days after delivery, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return. Custom-made or personalized artworks are generally non-refundable.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Damaged Items</Text>
          <Text style={styles.paragraph}>
            In the event that your order arrives damaged in any way, please email us as soon as possible with your order number and a photo of the item's condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Refund Process</Text>
          <Text style={styles.paragraph}>
            Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within a certain amount of days.
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

export default ReturnsScreen;
