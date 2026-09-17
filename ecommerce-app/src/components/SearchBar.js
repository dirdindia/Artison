import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../theme";

// Simple search input. Parent screen (Home) keeps the actual search text in its own state.
const SearchBar = ({ value, onChangeText, placeholder = "Search products..." }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={COLORS.textLight} style={{ marginRight: 8 }} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    height: 42,
    marginHorizontal: SIZES.padding,
    marginTop: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
});

export default SearchBar;
