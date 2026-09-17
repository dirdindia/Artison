import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput, ActivityIndicator, Image } from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useApp } from "../context/AppContext";
import { COLORS, SIZES } from "../theme";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const { user, setUser, logout } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [street, setStreet] = useState(user?.address?.street || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [stateCode, setStateCode] = useState(user?.address?.state || "");
  const [country, setCountry] = useState(user?.address?.country || "");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Sorry, we need camera roll permissions to make this work!' });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (file) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });

      const { data } = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        setAvatar(data.data.url);
      }
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: "Upload Failed", text2: "Could not upload image. Make sure the backend is running and connected." });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name,
        phone,
        avatar,
        address: {
          street,
          city,
          state: stateCode,
          country,
          postalCode,
        }
      };
      
      const { data } = await api.put("/users/profile", payload);
      
      if (data.success) {
        const updatedUser = { ...user, ...data.data };
        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        Toast.show({ type: 'success', text1: "Success", text2: "Profile updated successfully!" });
      }
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: "Error", text2: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setAvatar(user?.avatar || "");
    setStreet(user?.address?.street || "");
    setCity(user?.address?.city || "");
    setStateCode(user?.address?.state || "");
    setCountry(user?.address?.country || "");
    setPostalCode(user?.address?.postalCode || "");
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: SIZES.padding }}>
        <View style={styles.headerRow}>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Ionicons name="pencil" size={16} color={COLORS.primary} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
             <View style={{flexDirection: "row"}}>
               <TouchableOpacity style={[styles.editButton, {backgroundColor: COLORS.border, marginRight: 10}]} onPress={handleCancel}>
                 <Text style={[styles.editButtonText, {color: COLORS.text}]}>Cancel</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.editButton, {backgroundColor: COLORS.primary}]} onPress={handleSave} disabled={isSaving || uploadingAvatar}>
                 {isSaving ? <ActivityIndicator size="small" color={COLORS.white} /> : <Text style={[styles.editButtonText, {color: COLORS.white}]}>Save</Text>}
               </TouchableOpacity>
             </View>
          )}
        </View>

        <View style={styles.profileBox}>
          <TouchableOpacity 
            onPress={isEditing ? pickImage : null} 
            disabled={!isEditing || uploadingAvatar} 
            style={styles.avatarContainer}
            activeOpacity={0.7}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-circle" size={80} color={COLORS.primary} style={{ marginTop: -5 }} />
            )}
            
            {isEditing && (
              <View style={styles.editIconOverlay}>
                <Ionicons name="camera" size={14} color={COLORS.white} />
              </View>
            )}
            
            {uploadingAvatar && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color={COLORS.white} />
              </View>
            )}
          </TouchableOpacity>
          
          {isEditing ? (
             <TextInput style={styles.inputTitle} value={name} onChangeText={setName} placeholder="Your Name" />
          ) : (
             <Text style={styles.name}>{user?.name}</Text>
          )}
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Phone</Text>
            {isEditing ? (
               <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone Number" keyboardType="phone-pad" />
            ) : (
               <Text style={styles.fieldValue}>{user?.phone || "Not set"}</Text>
            )}
          </View>
          <View style={styles.divider} />
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Address</Text>
            {isEditing ? (
              <View>
                <TextInput style={styles.input} value={street} onChangeText={setStreet} placeholder="Street Address" />
                <View style={styles.row}>
                  <TextInput style={[styles.input, styles.halfInput]} value={city} onChangeText={setCity} placeholder="City" />
                  <TextInput style={[styles.input, styles.halfInput]} value={stateCode} onChangeText={setStateCode} placeholder="State" />
                </View>
                <View style={styles.row}>
                  <TextInput style={[styles.input, styles.halfInput]} value={country} onChangeText={setCountry} placeholder="Country" />
                  <TextInput style={[styles.input, styles.halfInput]} value={postalCode} onChangeText={setPostalCode} placeholder="Postal Code" />
                </View>
              </View>
            ) : (
              <Text style={styles.fieldValue}>
                {user?.address?.street ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.country} - ${user.address.postalCode}` : "Not set"}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 14,
  },
  profileBox: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.border,
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 10,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    minWidth: 150,
    textAlign: "center",
  },
  email: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  fieldRow: {
    marginVertical: 8,
  },
  fieldLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
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
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.danger,
    height: 50,
    borderRadius: SIZES.radius,
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileScreen;
