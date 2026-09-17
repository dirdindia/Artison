import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Image, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../theme";
import api from "../api";

const getStatusColor = (status) => {
  const styles = {
    'Processing': { bg: '#fef3c7', text: '#b45309' },
    'Shipped': { bg: '#dbeafe', text: '#1d4ed8' },
    'Out for Delivery': { bg: '#f3e8ff', text: '#7e22ce' },
    'Delivered': { bg: '#dcfce7', text: '#15803d' },
    'Cancelled': { bg: '#fee2e2', text: '#b91c1c' },
    'Refunded': { bg: '#f3f4f6', text: '#374151' },
  };
  return styles[status] || { bg: '#f3f4f6', text: '#374151' };
};

const formatPrice = (price) => {
  return `₹${price.toLocaleString()}`;
};

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (pageNum = 1) => {
    try {
      const { data } = await api.get(`/orders/myorders?page=${pageNum}&limit=5`);
      if (data.success) {
        setOrders(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
        }
      }
    } catch (error) {
      console.log("Failed to fetch orders", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders(page);
  }, [page]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(page);
  };

  const renderItem = ({ item }) => {
    const statusStyle = getStatusColor(item.orderStatus || 'Processing');
    const paymentStyle = item.isPaid 
      ? { bg: '#d1fae5', text: '#047857' } // Emerald
      : { bg: '#ffe4e6', text: '#e11d48' }; // Rose

    const subtotal = item.orderItems.reduce((sum, orderItem) => sum + (orderItem.price * orderItem.qty), 0);
    const additionalCharges = item.totalPrice - subtotal;

    return (
      <View style={styles.orderCard}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderIdText}>Order #{item._id.substring(18)}</Text>
            <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
          <View style={styles.badgesColumn}>
            <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.badgeText, { color: statusStyle.text }]}>{item.orderStatus || 'Processing'}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: paymentStyle.bg, marginTop: 4 }]}>
              <Text style={[styles.badgeText, { color: paymentStyle.text }]}>{item.isPaid ? 'Paid' : 'Payment Pending'}</Text>
            </View>
          </View>
        </View>

        {/* Address and Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Shipping Address:</Text>
            <Text style={styles.infoText}>{item.shippingAddress?.street}</Text>
            <Text style={styles.infoText}>{item.shippingAddress?.city}, {item.shippingAddress?.state} {item.shippingAddress?.postalCode}</Text>
            <Text style={styles.infoText}>{item.shippingAddress?.country}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Payment Method:</Text>
            <Text style={styles.infoText}>{item.paymentMethod}</Text>
            {item.razorpayOrderId && <Text style={styles.infoText}>Razorpay: {item.razorpayOrderId.substring(0, 10)}...</Text>}
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.itemsList}>
          {item.orderItems.map((product, idx) => (
            <View key={idx} style={styles.productRow}>
              <Image source={{ uri: product.image }} style={styles.productImg} />
              <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.productQty}>Qty: {product.qty}</Text>
              </View>
              <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
          </View>
          {additionalCharges > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping & Tax</Text>
              <Text style={styles.totalValue}>{formatPrice(additionalCharges)}</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total Amount</Text>
            <Text style={styles.grandTotalValue}>{formatPrice(item.totalPrice)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (totalPages <= 1) return null;
    return (
      <View style={styles.pagination}>
        <TouchableOpacity 
          style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
          disabled={page === 1}
          onPress={() => setPage(Math.max(1, page - 1))}
        >
          <Text style={styles.pageButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>Page {page} of {totalPages}</Text>
        <TouchableOpacity 
          style={[styles.pageButton, page === totalPages && styles.pageButtonDisabled]}
          disabled={page === totalPages}
          onPress={() => setPage(Math.min(totalPages, page + 1))}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="cube-outline" size={70} color={COLORS.textLight} />
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptySubtitle}>When you buy artwork, it will appear here.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: SIZES.padding }}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 15,
  },
  emptySubtitle: {
    color: COLORS.textLight,
    marginTop: 5,
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  orderIdText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginTop: 2,
  },
  badgesColumn: {
    alignItems: "flex-end",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoGrid: {
    flexDirection: "row",
    backgroundColor: "#f9fafb", // secondary/20
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: COLORS.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  itemsList: {
    paddingVertical: 8,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productImg: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  productDetails: {
    flex: 1,
    paddingHorizontal: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  productQty: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  totalsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  totalValue: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  grandTotalRow: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderTopColor: COLORS.border,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 8,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  pageText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default OrdersScreen;
