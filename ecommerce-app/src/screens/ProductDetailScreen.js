import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { COLORS, SIZES } from "../theme";
import api from "../api";

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params; // product passed from HomeScreen
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);

  // Gallery array
  const gallery = [product.image, ...(product.gallery || [])].filter(Boolean);

  // Reviews state
  const [reviews, setReviews] = useState(product.reviews || []);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    // Refresh product details to get latest reviews
    const fetchLatestProduct = async () => {
      try {
        const res = await api.get(`/products/${product._id}`);
        if (res.data && res.data.success) {
          setReviews(res.data.data.reviews || []);
        }
      } catch (err) {
        console.log("Failed to refresh product", err);
      }
    };
    fetchLatestProduct();
  }, [product._id]);

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      Toast.show({ type: "error", text1: "Comment required" });
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      if (res.data && res.data.success) {
        Toast.show({ type: "success", text1: "Review submitted successfully", text2: "It will be visible once verified." });
        setReviewComment("");
      }
    } catch (err) {
      Toast.show({ 
        type: "error", 
        text1: "Error", 
        text2: err.response?.data?.message || "Failed to submit review" 
      });
    } finally {
      setSubmittingReview(false);
    }
  };

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
        <Image source={{ uri: mainImage }} style={styles.image} />
        
        {gallery.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
            {gallery.map((img, idx) => (
              <TouchableOpacity key={idx} onPress={() => setMainImage(img)}>
                <Image 
                  source={{ uri: img }} 
                  style={[styles.thumbnail, mainImage === img && styles.activeThumbnail]} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

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

          {/* Reviews Section */}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Reviews ({reviews.filter(r => r.isVerified).length})</Text>
          
          {reviews.filter(r => r.isVerified).map((rev, idx) => (
            <View key={idx} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{rev.user?.name || 'User'}</Text>
                <Text style={styles.reviewRating}>{"⭐".repeat(rev.rating)}</Text>
              </View>
              <Text style={styles.reviewComment}>{rev.comment}</Text>
            </View>
          ))}
          
          {reviews.filter(r => r.isVerified).length === 0 && (
            <Text style={styles.noReviews}>No reviews yet.</Text>
          )}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Write a Review</Text>
          <View style={styles.ratingSelect}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                <MaterialIcons 
                  name={star <= reviewRating ? "star" : "star-border"} 
                  size={28} 
                  color={COLORS.primary} 
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.reviewInput}
            placeholder="Write your review here..."
            multiline
            numberOfLines={3}
            value={reviewComment}
            onChangeText={setReviewComment}
          />
          <TouchableOpacity 
            style={styles.submitReviewBtn} 
            onPress={handleSubmitReview}
            disabled={submittingReview}
          >
            {submittingReview ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitReviewBtnText}>Submit Review</Text>
            )}
          </TouchableOpacity>
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
  galleryScroll: {
    paddingHorizontal: SIZES.padding,
    marginTop: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewUser: {
    fontWeight: "bold",
    color: COLORS.text,
  },
  reviewRating: {
    fontSize: 12,
  },
  reviewComment: {
    color: COLORS.textLight,
    fontSize: 13,
  },
  noReviews: {
    color: COLORS.textLight,
    fontStyle: "italic",
    marginVertical: 10,
  },
  ratingSelect: {
    flexDirection: "row",
    marginBottom: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    color: COLORS.text,
    marginBottom: 12,
    minHeight: 80,
  },
  submitReviewBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitReviewBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
