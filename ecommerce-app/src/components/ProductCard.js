import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../theme";
import { useApp } from "../context/AppContext";

// Shows one product in a grid card. Tapping it opens the product detail screen.
const ProductCard = ({ product, onPress }) => {
  const { addToCart } = useApp();

  const currentPrice = product.salePrice ? product.salePrice : product.price;
  const originalPrice = product.salePrice ? product.price : null;
  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: product.image || 'https://dummyimage.com/150x150/cccccc/000000.png&text=No+Image' }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.name || product.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          By {product.artist?.name || (typeof product.artist === 'string' ? product.artist : 'Unknown Artist')}
        </Text>
        {/* <Text style={styles.rating}>⭐ {product.rating || "4.5"}</Text> */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 4 }}>
          <View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{currentPrice}</Text>
              {originalPrice && <Text style={styles.originalPrice}>₹{originalPrice}</Text>}
            </View>
            {discountPercent > 0 && <Text style={styles.discount}>{discountPercent}% off</Text>}
          </View>
          
          <TouchableOpacity 
            style={styles.iconCartBtn}
            onPress={() => addToCart(product)}
          >
            <MaterialIcons name="shopping-cart" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    // marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: "100%",
    height: 140,
  },
  info: {
    padding: 8,
  },
  title: {
    fontSize: 13,
    color: COLORS.text,
    height: 34,
  },
  artist: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    color: COLORS.success,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 2,
  },
  iconCartBtn: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2, // Slight adjustment to align with text visually
  }
});

export default ProductCard;
