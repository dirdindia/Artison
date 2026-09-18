import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { COLORS, SIZES } from "../theme";
import api from "../api";
import ProductCard from "../components/ProductCard";

const ExploreScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [artists, setArtists] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [maxPrice, setMaxPrice] = useState(50000); // Default max price for slider

  useEffect(() => {
    fetchCategories();
    // fetchSubCategories();
    // fetchArtists();
  }, []);

  useEffect(() => {
    // Reset and fetch when high-level filters change
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, true);
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data && res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await api.get('/subcategories');
      if (res.data && res.data.success) {
        setSubCategories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const fetchArtists = async () => {
    try {
      const res = await api.get('/users/public/artists');
      if (res.data && res.data.success) {
        setArtists(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching artists:", err);
    }
  };

  const fetchProducts = async (pageNumber = 1, shouldReset = false) => {
    if (loading || (loadingMore && !shouldReset)) return;
    
    if (shouldReset) setLoading(true);
    else setLoadingMore(true);

    try {
      let query = `/products?page=${pageNumber}&limit=10`;
      if (searchQuery) query += `&search=${searchQuery}`;
      if (selectedCategory) query += `&category=${selectedCategory}`;
      if (selectedSubCategory) query += `&subCategory=${selectedSubCategory}`;
      if (selectedArtist) query += `&artist=${selectedArtist}`;
      if (maxPrice && maxPrice < 50000) query += `&maxPrice=${maxPrice}`;

      const res = await api.get(query);
      if (res.data && res.data.success) {
        const fetchedProducts = res.data.data;
        if (shouldReset) {
          setProducts(fetchedProducts);
        } else {
          setProducts(prev => [...prev, ...fetchedProducts]);
        }
        
        if (fetchedProducts.length < 10) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const applyFilters = () => {
    setShowFilters(false);
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, true);
  };

  const clearFilters = () => {
    setSelectedSubCategory("");
    setSelectedArtist("");
    setMaxPrice(50000);
  };

  const renderFooter = () => {
    if (!hasMore && products.length > 0) return <Text style={styles.endText}>No more products</Text>;
    if (loadingMore) return <ActivityIndicator size="large" color={COLORS.primary} style={{ margin: 20 }} />;
    if (hasMore && products.length > 0) {
      return (
        <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore}>
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={COLORS.textLight} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search artworks, artists..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => { setPage(1); fetchProducts(1, true); }}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
          <MaterialIcons name="tune" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Horizontal Category Filters */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          <TouchableOpacity 
            style={[styles.catPill, !selectedCategory && styles.catPillActive]} 
            onPress={() => setSelectedCategory("")}
          >
            <Text style={[styles.catPillText, !selectedCategory && styles.catPillTextActive]}>All</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat._id}
              style={[styles.catPill, selectedCategory === cat._id && styles.catPillActive]} 
              onPress={() => setSelectedCategory(cat._id)}
            >
              <Text style={[styles.catPillText, selectedCategory === cat._id && styles.catPillTextActive]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && page === 1 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => item._id || index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              onPress={() => navigation.navigate("ProductDetail", { product: item })} 
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
          ListFooterComponent={renderFooter}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>More Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              {/* Subcategories */}
              {/* <Text style={styles.filterLabel}>Subcategory</Text> */}
              {/* <View style={styles.pillsContainer}>
                <TouchableOpacity 
                  style={[styles.smallPill, !selectedSubCategory && styles.catPillActive]} 
                  onPress={() => setSelectedSubCategory("")}
                >
                  <Text style={[styles.smallPillText, !selectedSubCategory && styles.catPillTextActive]}>Any</Text>
                </TouchableOpacity>
                {subCategories.map(sub => (
                  <TouchableOpacity 
                    key={sub._id}
                    style={[styles.smallPill, selectedSubCategory === sub._id && styles.catPillActive]} 
                    onPress={() => setSelectedSubCategory(sub._id)}
                  >
                    <Text style={[styles.smallPillText, selectedSubCategory === sub._id && styles.catPillTextActive]}>{sub.name}</Text>
                  </TouchableOpacity>
                ))}
              </View> */}

              {/* Artists */}
              {/* <Text style={styles.filterLabel}>Artist</Text>
              <View style={styles.pillsContainer}>
                <TouchableOpacity 
                  style={[styles.smallPill, !selectedArtist && styles.catPillActive]} 
                  onPress={() => setSelectedArtist("")}
                >
                  <Text style={[styles.smallPillText, !selectedArtist && styles.catPillTextActive]}>Any</Text>
                </TouchableOpacity>
                {artists.map(artist => (
                  <TouchableOpacity 
                    key={artist._id}
                    style={[styles.smallPill, selectedArtist === artist._id && styles.catPillActive]} 
                    onPress={() => setSelectedArtist(artist._id)}
                  >
                    <Text style={[styles.smallPillText, selectedArtist === artist._id && styles.catPillTextActive]}>{artist.name}</Text>
                  </TouchableOpacity>
                ))}
              </View> */}

              {/* Price Range Slider */}
              <View style={styles.priceHeaderRow}>
                <Text style={styles.filterLabel}>Max Price</Text>
                <Text style={styles.priceValue}>
                  {maxPrice >= 50000 ? '₹50,000+' : `₹${maxPrice.toLocaleString()}`}
                </Text>
              </View>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={50000}
                step={500}
                value={maxPrice}
                onValueChange={(val) => setMaxPrice(val)}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor={COLORS.primary}
              />
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
                <Text style={styles.applyBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border, alignItems: "center" },
  searchContainer: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#f0f0f0", borderRadius: 8, paddingHorizontal: 12, height: 40, marginRight: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: COLORS.text },
  filterBtn: { width: 40, height: 40, backgroundColor: "#f9efe7", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  
  categoriesWrapper: { backgroundColor: COLORS.white, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  catScroll: { paddingHorizontal: 16 },
  catPill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: "#f0f0f0", marginRight: 10 },
  catPillActive: { backgroundColor: COLORS.primary },
  catPillText: { fontSize: 12, color: COLORS.text },
  catPillTextActive: { color: COLORS.white, fontWeight: "bold" },
  
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { padding: 16 },
  row: { justifyContent: "space-between", marginBottom: 16 },
  emptyText: { textAlign: "center", color: COLORS.textLight, marginTop: 40 },
  endText: { textAlign: "center", color: COLORS.textLight, marginVertical: 20 },
  
  loadMoreBtn: { alignSelf: "center", backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginVertical: 15 },
  loadMoreText: { color: COLORS.white, fontWeight: "bold", fontSize: 14 },
  
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  
  filterLabel: { fontSize: 14, fontWeight: "bold", color: COLORS.text, marginBottom: 10, marginTop: 15 },
  pillsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  smallPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: "#f0f0f0", marginRight: 8, marginBottom: 8 },
  smallPillText: { fontSize: 12, color: COLORS.text },
  
  priceHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 },
  priceValue: { fontSize: 14, fontWeight: "bold", color: COLORS.primary },
  
  modalBtnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  clearBtn: { flex: 1, backgroundColor: "#f0f0f0", paddingVertical: 14, borderRadius: 8, alignItems: "center", marginRight: 10 },
  clearBtnText: { color: COLORS.text, fontSize: 16, fontWeight: "bold" },
  applyBtn: { flex: 2, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  applyBtnText: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
});

export default ExploreScreen;
