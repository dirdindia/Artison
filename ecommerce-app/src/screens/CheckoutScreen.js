import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useApp } from "../context/AppContext";
import { COLORS, SIZES } from "../theme";
import api from "../api";

const CheckoutScreen = ({ navigation }) => {
  const { user, cart, clearCart } = useApp();

  // User Autofill
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [country, setCountry] = useState(user?.address?.country || "");
  const [stateCode, setStateCode] = useState(user?.address?.state || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "");

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [taxRate, setTaxRate] = useState(18);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data && data.taxRate !== undefined) {
          setTaxRate(data.taxRate);
        }
      } catch (err) {
        console.log("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  const subtotal = cart.reduce((s, c) => s + (c.product.salePrice || c.product.price) * c.qty, 0);
  const shipping = cart.reduce((s, c) => s + ((c.product.shippingCharge || 0) * c.qty), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const initialTotal = subtotal + shipping + taxAmount;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = initialTotal - discountAmount;

  const getFormattedCartItems = () => cart.map(item => ({
    name: item.product.name || item.product.title,
    qty: item.qty,
    image: item.product.image || (item.product.images && item.product.images[0]) || "",
    price: item.product.salePrice || item.product.price,
    product: item.product._id || item.product.id,
  }));

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const { data } = await api.post("/coupons/validate", {
        code: couponCode,
        cartTotal: initialTotal,
        cartItems: getFormattedCartItems()
      });
      if (data.success) {
        setAppliedCoupon(data.data);
        Toast.show({ type: 'success', text1: "Success", text2: "Coupon applied successfully!" });
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof document !== 'undefined') {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      } else {
        resolve(false);
      }
    });
  };

  const verifyPayment = async (response) => {
    try {
      const verifyRes = await api.post("/orders/verify", {
        paymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      });

      if (verifyRes.data.success) {
        if (clearCart) clearCart();
        navigation.replace("OrderSuccess", {
          order: {
            id: verifyRes.data.data._id,
            total: verifyRes.data.data.totalPrice
          }
        });
      }
    } catch (err) {
      console.log(err);
      Toast.show({ type: 'error', text1: "Error", text2: "Failed to verify payment" });
    }
  };

  const startPayment = async () => {
    if (!name.trim() || !phone.trim() || !street.trim() || !country.trim() || !stateCode.trim() || !city.trim() || !postalCode.trim()) {
      Toast.show({ type: 'error', text1: "Missing info", text2: "Please fill all delivery details." });
      return;
    }

    setIsProcessingPayment(true);
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setIsProcessingPayment(false);
      return Toast.show({ type: 'error', text1: "Error", text2: "Razorpay SDK failed to load. Are you online?" });
    }

    try {
      const orderPayload = {
        amount: initialTotal,
        orderItems: getFormattedCartItems(),
        shippingAddress: { street, city, state: stateCode, country, postalCode },
        paymentMethod: "Razorpay",
        couponCode: appliedCoupon ? appliedCoupon.code : null
      };

      if (!user) {
        orderPayload.guestEmail = email;
        orderPayload.guestName = name;
        orderPayload.guestPhone = phone;
      }

      const { data } = await api.post("/orders/razorpay", orderPayload);
      const { data: orderData, key_id } = data;

      const options = {
        key: key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Kalakosh",
        description: "Order Payment",
        order_id: orderData.id,
        handler: verifyPayment, 
        prefill: { name, contact: phone, email },
        theme: { color: "#c29b38" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setIsProcessingPayment(false);
        Toast.show({ type: 'error', text1: "Error", text2: response.error.description || "Payment failed" });
      });
      
      paymentObject.open();
      setIsProcessingPayment(false);
    } catch (err) {
      console.log(err);
      Toast.show({ type: 'error', text1: "Error", text2: "Failed to initialize payment" });
      setIsProcessingPayment(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: SIZES.padding }}>
      
      <Text style={styles.sectionTitle}>Contact Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Shipping Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Street Address"
        value={street}
        onChangeText={setStreet}
      />
      
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="State"
          value={stateCode}
          onChangeText={setStateCode}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Postal Code"
          value={postalCode}
          onChangeText={setPostalCode}
        />
      </View>

      <Text style={styles.sectionTitle}>Coupon Code</Text>
      <View style={styles.couponRow}>
        <TextInput
          style={styles.couponInput}
          placeholder="Enter coupon code"
          value={couponCode}
          onChangeText={setCouponCode}
          editable={!appliedCoupon && !applyingCoupon}
          autoCapitalize="characters"
        />
        {!appliedCoupon ? (
          <TouchableOpacity 
            style={[styles.applyBtn, (!couponCode || applyingCoupon) && { opacity: 0.5 }]} 
            onPress={handleApplyCoupon}
            disabled={!couponCode || applyingCoupon}
          >
            {applyingCoupon ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.applyBtnText}>Apply</Text>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.removeBtn} onPress={handleRemoveCoupon}>
            <Text style={styles.removeBtnText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
      {couponError ? <Text style={styles.errorText}>{couponError}</Text> : null}
      {appliedCoupon ? <Text style={styles.successText}>Coupon applied! ₹{appliedCoupon.discountAmount} off</Text> : null}

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>₹{shipping.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>GST ({taxRate}%)</Text>
          <Text style={styles.summaryValue}>₹{taxAmount.toFixed(2)}</Text>
        </View>
        {appliedCoupon && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount ({appliedCoupon.code})</Text>
            <Text style={styles.discountValue}>-₹{discountAmount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.placeOrderButton, isProcessingPayment && { opacity: 0.7 }]} 
        onPress={startPayment}
        disabled={isProcessingPayment}
      >
        {isProcessingPayment ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.placeOrderText}>Pay ₹{total.toFixed(2)}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  couponRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  couponInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: COLORS.text,
    marginRight: 8,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
  },
  applyBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  removeBtn: {
    backgroundColor: "#ef4444",
    height: 48,
    paddingHorizontal: 20,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
  },
  removeBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  successText: {
    color: "#16a34a",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "bold",
  },
  summaryBox: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    color: COLORS.textLight,
  },
  summaryValue: {
    color: COLORS.text,
  },
  discountValue: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 40,
  },
  placeOrderText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
