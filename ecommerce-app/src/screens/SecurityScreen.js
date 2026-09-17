import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../theme";
import api from "../api";
import { useApp } from "../context/AppContext";

const SecurityScreen = () => {
  const { user, setUser } = useApp();
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = async () => {
    if (user?.hasSetPassword !== false && !oldPassword) {
      Toast.show({ type: 'error', text1: "Error", text2: "Please enter your current password" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Toast.show({ type: 'error', text1: "Error", text2: "New password must be at least 6 characters long" });
      return;
    }

    setUpdatingPassword(true);
    try {
      const { data } = await api.put("/users/password", { 
        oldPassword: user?.hasSetPassword !== false ? oldPassword : undefined, 
        newPassword 
      });
      
      if (data.success) {
        Toast.show({ type: 'success', text1: "Success", text2: data.message || "Password updated successfully" });
        setOldPassword("");
        setNewPassword("");
        setUser({ ...user, hasSetPassword: true });
      }
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: "Error", text2: error.response?.data?.message || "Failed to change password" });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Ionicons name="shield-checkmark" size={60} color={COLORS.primary} style={styles.icon} />
          <Text style={styles.title}>Account Security</Text>
          <Text style={styles.subtitle}>Update your password to keep your account secure.</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Change Password</Text>

            {user?.hasSetPassword !== false && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Password</Text>
                <View style={styles.passwordField}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter current password"
                    secureTextEntry={!showOldPassword}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                  />
                  <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showOldPassword ? "eye-off" : "eye"} size={20} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordField}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password (min 6 chars)"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleChangePassword}
              disabled={updatingPassword}
            >
              {updatingPassword ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.padding,
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textLight,
    marginBottom: 6,
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    height: 46,
    color: COLORS.text,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SecurityScreen;
