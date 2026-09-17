import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, TextInput, ActivityIndicator, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../api";
import { COLORS } from "../theme";
import { useApp } from "../context/AppContext";
import Toast from "react-native-toast-message";

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [featuredWorks, setFeaturedWorks] = useState([]);
  const [trendingWorks, setTrendingWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { addToCart } = useApp();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/categories');
        if (catRes.data && catRes.data.success) {
          setCategories(catRes.data.data);
        }

        const prodRes = await api.get('/products?page=1&limit=30');
        if (prodRes.data && prodRes.data.success) {
          const prods = prodRes.data.data;
          
          const featured = prods.filter(p => p.tags && (p.tags.includes('Featured') || p.tags.includes('Hand-picked')));
          const trending = prods.filter(p => p.tags && p.tags.includes('Trending'));
          
          // Fallback to slice if no products have these tags in db yet
          setFeaturedWorks(featured.length > 0 ? featured : prods.slice(0, 5));
          setTrendingWorks(trending.length > 0 ? trending : prods.slice(5, 10));
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderProductCard = (item) => (
    <TouchableOpacity
      key={item._id}
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        <View style={styles.productCategoryBadge}>
          <Text style={styles.productCategoryText}>{item.category?.name || "ART"}</Text>
        </View>
        <TouchableOpacity style={styles.productFavButton}>
          <MaterialIcons name="favorite-border" size={14} color="#451a03" />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productSubtitle}>Independent Artist</Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          <TouchableOpacity style={styles.cartBtn} onPress={() => addToCart(item)}>
            <MaterialIcons name="shopping-cart" size={14} color="#8b5a2b" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleSubscribe = async () => {
    if (!subscribeEmail.trim()) {
      Toast.show({ type: 'error', text1: 'Missing Email', text2: 'Please enter your email address.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscribeEmail)) {
      Toast.show({ type: 'error', text1: 'Invalid Email', text2: 'Please enter a valid email address.' });
      return;
    }

    setIsSubscribing(true);
    try {
      const response = await api.post('/subscribers/subscribe', { email: subscribeEmail });
      Toast.show({ type: 'success', text1: 'Success', text2: 'You have been subscribed successfully!' });
      setSubscribeEmail("");
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.response?.data?.message || 'Failed to subscribe.' });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KALA KOSH</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c29b38" />
          </View>
        ) : (
          <>
            {/* Hero Banner */}
            <View style={styles.heroBanner}>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1512354734346-64155abf9b93?q=80&w=800&auto=format&fit=crop" }} 
                style={styles.heroImage} 
                resizeMode="cover" 
              />
              <View style={styles.heroOverlay}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>Welcome to Kala Kosh</Text>
                </View>
                <Text style={styles.heroTitle}>Preserving Artisanal Heritage</Text>
                <Text style={styles.heroDesc}>
                  Discover authentic, handcrafted masterpieces sourced directly from India's most skilled master guilds and rural artisans.
                </Text>
                <TouchableOpacity style={styles.heroBtn}>
                  <Text style={styles.heroBtnText}>Explore Collection</Text>
                  <MaterialIcons name="arrow-forward" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Categories Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionSubtitle}>SHOP BY</Text>
                  <Text style={styles.sectionTitle}>Categories</Text>
                </View>
                <TouchableOpacity style={styles.viewAllRow}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <MaterialIcons name="arrow-forward" size={12} color="#a0683a" />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
                {categories.map((cat, idx) => (
                  <TouchableOpacity key={cat._id || idx} style={styles.categoryItem}>
                    <View style={styles.categoryIconCircle}>
                      <Image 
                        source={{ uri: cat.image || "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=200&auto=format&fit=crop" }} 
                        style={styles.fullImage} 
                      />
                    </View>
                    <Text style={styles.categoryItemText} numberOfLines={1}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Featured Works */}
            <View style={styles.sectionNoTopPad}>
              <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
                <View>
                  <Text style={styles.sectionTitle}>Featured works</Text>
                  <Text style={styles.sectionSubtitle}>Hand picked this week</Text>
                </View>
                <TouchableOpacity style={styles.viewAllRow}>
                  <Text style={styles.viewAllText}>View all featured</Text>
                  <MaterialIcons name="arrow-forward" size={12} color="#a0683a" />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
                {featuredWorks.map(renderProductCard)}
              </ScrollView>
            </View>

            {/* Active Offers */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Active Offers</Text>
                  <Text style={styles.sectionSubtitle}>Exclusive discounts just for you</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.offerCard}>
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop" }} 
                  style={styles.offerImage} 
                  resizeMode="cover" 
                />
                <View style={styles.offerContent}>
                  <View style={styles.offerDiscountCircle}>
                    <Text style={styles.offerDiscountNumber}>20%</Text>
                    <Text style={styles.offerDiscountText}>Off</Text>
                  </View>
                  <View style={styles.offerTextContent}>
                    <View style={styles.offerTag}>
                      <MaterialIcons name="local-offer" size={10} color="#c29b38" />
                      <Text style={styles.offerTagText}>Festival Offer</Text>
                    </View>
                    <Text style={styles.offerMainText}>Get 20% off on all products site-wide!</Text>
                    <View style={styles.offerCodeRow}>
                      <View style={styles.offerCodeBox}>
                        <Text style={styles.offerCodeText}>WELCOME20</Text>
                      </View>
                      <TouchableOpacity style={styles.offerCopyBtn}>
                        <Text style={styles.offerCopyText}>Copy code</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Trending Now */}
            <View style={styles.sectionNoTopPad}>
              <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
                <Text style={styles.sectionTitle}>Trending now</Text>
                <TouchableOpacity style={styles.viewAllRow}>
                  <Text style={styles.viewAllText}>View all trending</Text>
                  <MaterialIcons name="arrow-forward" size={12} color="#a0683a" />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
                {trendingWorks.map(renderProductCard)}
              </ScrollView>
            </View>

            {/* Trust Badges */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesContainer}>
              <View style={styles.badgeCard}>
                <View style={styles.badgeIconBox}>
                  <MaterialIcons name="workspace-premium" size={20} color="#c29b38" />
                </View>
                <Text style={styles.badgeTitle}>Curated weekly</Text>
                <Text style={styles.badgeDesc}>We curate items that match your particular taste.</Text>
              </View>
              <View style={styles.badgeCard}>
                <View style={styles.badgeIconBox}>
                  <MaterialIcons name="local-shipping" size={20} color="#c29b38" />
                </View>
                <Text style={styles.badgeTitle}>Worldwide shipping</Text>
                <Text style={styles.badgeDesc}>Fast and reliable delivery, from our store to your door.</Text>
              </View>
              <View style={styles.badgeCard}>
                <View style={styles.badgeIconBox}>
                  <MaterialIcons name="verified-user" size={20} color="#c29b38" />
                </View>
                <Text style={styles.badgeTitle}>Authenticity guaranteed</Text>
                <Text style={styles.badgeDesc}>Every purchase includes a verified GI-Provenance certificate.</Text>
              </View>
            </ScrollView>

            {/* Newsletter */}
            <View style={styles.newsletterContainer}>
              <Text style={styles.newsletterSub}>Join the inner circle</Text>
              <Text style={styles.newsletterTitle}>Get new artworks in your inbox.</Text>
              <Text style={styles.newsletterDesc}>Be the first to see curated drops every Friday. No spam — just art.</Text>
              <View style={styles.newsletterInputRow}>
                <TextInput 
                  placeholder="Email address" 
                  placeholderTextColor="#78645a"
                  style={styles.newsletterInput}
                  value={subscribeEmail}
                  onChangeText={setSubscribeEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.newsletterBtn} onPress={handleSubscribe} disabled={isSubscribing}>
                  {isSubscribing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.newsletterBtnText}>Subscribe</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerBrand}>KALA KOSH</Text>
              <Text style={styles.footerDesc}>Preserving living craft heritages through sovereign curatorial standards.</Text>
              <Text style={styles.footerCopyright}>Registered Guild Entity © 2026 Kala Kosh.</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fcf8f6" },
  header: { alignItems: "center", justifyContent: "center", paddingHorizontal: 16, paddingVertical: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#ecdcd6" },
  headerTitle: { color: "#3e1b07", fontSize: 20, fontWeight: "bold", letterSpacing: 2 },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  scrollContent: { paddingBottom: 40 },
  loadingContainer: { height: 250, justifyContent: "center", alignItems: "center" },
  
  heroBanner: { width: "100%", height: 350, backgroundColor: "#111", position: "relative", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: "hidden" },
  heroImage: { width: "100%", height: "100%", opacity: 0.5, position: "absolute" },
  heroOverlay: { flex: 1, justifyContent: "flex-end", padding: 24, paddingBottom: 40 },
  heroBadge: { backgroundColor: "rgba(255,255,255,0.2)", alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.4)" },
  heroBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 },
  heroTitle: { color: "#fff", fontSize: 32, fontWeight: "bold", fontStyle: "italic", marginBottom: 12, lineHeight: 36 },
  heroDesc: { color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 18, maxWidth: 280, marginBottom: 16 },
  heroBtn: { backgroundColor: "#c29b38", alignSelf: "flex-start", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, flexDirection: "row", alignItems: "center" },
  heroBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", marginRight: 6 },
  
  searchContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff" },
  searchInputBox: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#f9efe7", borderRadius: 8, paddingHorizontal: 12, height: 44, marginRight: 12 },
  searchInput: { flex: 1, marginLeft: 8, color: "#3e1b07", fontSize: 14 },
  filterBtn: { width: 44, height: 44, backgroundColor: "#f9efe7", borderRadius: 8, alignItems: "center", justifyContent: "center" },

  section: { paddingVertical: 20, paddingHorizontal: 16 },
  sectionNoTopPad: { paddingBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 },
  sectionTitle: { fontSize: 24, fontWeight: "bold", color: "#451a03", marginBottom: 2, fontStyle: "italic", fontFamily: "serif" },
  sectionSubtitle: { fontSize: 10, color: "#c29b38", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: "bold", marginBottom: 4 },
  viewAllRow: { flexDirection: "row", alignItems: "center", paddingBottom: 6 },
  viewAllText: { color: "#a0683a", fontSize: 12, fontWeight: "600", marginRight: 4 },
  
  categoriesList: { paddingLeft: 16, paddingRight: 8, paddingBottom: 8 },
  categoryItem: { alignItems: "center", width: 70, marginRight: 16 },
  categoryIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#ecdcd6", marginBottom: 8, overflow: "hidden", borderWidth: 2, borderColor: "#c29b38" },
  categoryItemText: { color: "#3e1b07", fontSize: 11, fontWeight: "600", textAlign: "center" },
  fullImage: { width: "100%", height: "100%", resizeMode: "cover" },
  
  productCard: { width: 180, backgroundColor: "#fcf8f6", borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#ecdcd6", marginRight: 16, marginBottom: 4 },
  productImageContainer: { height: 150, backgroundColor: "#eee" },
  productImage: { width: "100%", height: "100%" },
  productCategoryBadge: { position: "absolute", top: 8, left: 8, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  productCategoryText: { color: "#fff", fontSize: 9, fontWeight: "bold", letterSpacing: 1 },
  productFavButton: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(255,255,255,0.8)", width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  productInfo: { padding: 12 },
  productTitle: { color: "#3e1b07", fontWeight: "bold", fontSize: 14, marginBottom: 4 },
  productSubtitle: { color: "#725e54", fontSize: 10, marginBottom: 8 },
  productPriceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  productPrice: { color: "#2a1306", fontWeight: "bold", fontSize: 16 },
  cartBtn: { width: 28, height: 28, backgroundColor: "#f6eee7", borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#ecdcd6" },

  offerCard: { width: "100%", height: 160, backgroundColor: "#451a03", borderRadius: 12, overflow: "hidden", flexDirection: "row", alignItems: "center" },
  offerImage: { position: "absolute", width: "100%", height: "100%", opacity: 0.4 },
  offerContent: { flexDirection: "row", alignItems: "center", padding: 16, zIndex: 10, flex: 1 },
  offerDiscountCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(0,0,0,0.6)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  offerDiscountNumber: { color: "#c29b38", fontWeight: "bold", fontSize: 22 },
  offerDiscountText: { color: "#fff", fontSize: 9, textTransform: "uppercase", letterSpacing: 1 },
  offerTextContent: { marginLeft: 16, flex: 1 },
  offerTag: { backgroundColor: "rgba(255,255,255,0.2)", alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", flexDirection: "row", alignItems: "center", marginBottom: 8 },
  offerTagText: { color: "#fff", fontSize: 9, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginLeft: 4 },
  offerMainText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  offerCodeRow: { flexDirection: "row", alignItems: "center" },
  offerCodeBox: { borderWidth: 1, borderColor: "#fff", borderStyle: "dashed", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.3)", marginRight: 8 },
  offerCodeText: { color: "#c29b38", fontWeight: "bold", fontSize: 12, letterSpacing: 1 },
  offerCopyBtn: { backgroundColor: "#c29b38", paddingHorizontal: 16, paddingVertical: 7, borderRadius: 4 },
  offerCopyText: { color: "#451a03", fontWeight: "bold", fontSize: 12 },

  badgesContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  badgeCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ecdcd6", borderRadius: 12, padding: 16, width: 150, alignItems: "center", marginRight: 12 },
  badgeIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#f9efe7", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  badgeTitle: { color: "#2a1306", fontWeight: "bold", fontSize: 12, marginBottom: 4, textAlign: "center" },
  badgeDesc: { color: "#8c7468", fontSize: 9, textAlign: "center", lineHeight: 14 },

  newsletterContainer: { marginHorizontal: 16, marginBottom: 32, backgroundColor: "#2d1102", borderRadius: 16, padding: 24 },
  newsletterSub: { color: "#c29b38", fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 },
  newsletterTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  newsletterDesc: { color: "#a89990", fontSize: 12, marginBottom: 24, maxWidth: 250 },
  newsletterInputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#5c3a21", backgroundColor: "#1a0a01", borderRadius: 8, padding: 4, height: 48 },
  newsletterInput: { flex: 1, color: "#fff", fontSize: 14, paddingHorizontal: 12 },
  newsletterBtn: { backgroundColor: "#a0683a", height: "100%", paddingHorizontal: 16, borderRadius: 6, justifyContent: "center" },
  newsletterBtnText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

  footer: { alignItems: "center", paddingVertical: 16, borderTopWidth: 1, borderTopColor: "#ecdcd6", paddingHorizontal: 24, backgroundColor: "#fff" },
  footerBrand: { color: "#3e1b07", fontWeight: "bold", letterSpacing: 3, marginBottom: 8, fontSize: 14 },
  footerDesc: { color: "#725e54", fontSize: 9, textAlign: "center", lineHeight: 14, marginBottom: 8 },
  footerCopyright: { color: "#a89990", fontSize: 8, textTransform: "uppercase", letterSpacing: 1 }
});

export default HomeScreen;
