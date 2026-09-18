import React, { useState } from "react";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  } from "react-native";
import { useApp } from "../context/AppContext";
import { COLORS, SIZES } from "../theme";

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params; // product passed from HomeScreen
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigation.navigate("Cart");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.details}>
          <Text style={styles.category}>{product.category?.name || product.category}</Text>
          <Text style={styles.title}>{product.name || product.title}</Text>
          <Text style={styles.rating}>⭐ {product.rating} rating</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            <Text style={styles.discount}>{discountPercent}% off</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Quantity selector */}
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{qty}</Text>
            <TouchableOpacity style={styles.qtyButton} onPress={() => setQty((q) => q + 1)}>
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  image: {
    width: "100%",
    height: 320,
  },
  details: {
    padding: SIZES.padding,
  },
  category: {
    color: COLORS.textLight,
    fontSize: 13,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    color: COLORS.success,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 15,
    color: COLORS.textLight,
    textDecorationLine: "line-through",
    marginRight: 10,
  },
  discount: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonText: {
    fontSize: 18,
    color: COLORS.text,
  },
  qtyValue: {
    marginHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  bottomBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  cartButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    height: 46,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cartButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  buyButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 46,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  buyButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
