import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS, SIZES } from "../theme";

// Row of category chips: "All", "Electronics", "Fashion", etc.
// selected = currently active category ID, onSelect = function to change it
const CategoryFilter = ({ categories = [], selected, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ paddingHorizontal: SIZES.padding, paddingVertical: 10 }}
    >
      {categories.map((category) => {
        const isActive = category._id === selected;
        return (
          <TouchableOpacity
            key={category._id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(category._id)}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{category.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    flexGrow: 0,
    minHeight: 55,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.text,
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default CategoryFilter;
