import React, { useState } from "react";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { useApp } from "../context/AppContext";
import { COLORS, SIZES } from "../theme";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const { setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: "Missing info", text2: "Please enter both email and password." });
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/auth/login-user', { email, password });
      
      if (response.data && response.data.data && response.data.data.token) {
        await AsyncStorage.setItem('token', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
      } else {
        Toast.show({ type: 'error', text1: "Login Failed", text2: "Invalid response from server." });
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Something went wrong";
      Toast.show({ type: 'error', text1: "Login Error", text2: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.helpBtn}>
              {/* <MaterialIcons name="help-outline" size={16} color={COLORS.textLight} /> */}
              {/* <Text style={styles.helpText}>Need Assistance?</Text> */}
            </TouchableOpacity>
          </View>

          {/* Insignia & Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.insigniaContainer}>
              <Image source={require('../../assets/logo.png')} style={{ width: 80, height: 80 }} resizeMode="contain" />
            </View>
            <Text style={styles.brandTitle}>KALA KOSH</Text>
            <View style={styles.taglineContainer}>
              <View style={styles.line} />
              <Text style={styles.taglineText}>CURATORS OF TIMELESS INDIAN CRAFT</Text>
              <View style={styles.line} />
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>
              Sign in to access your artisanal vault, curated orders & exclusive craft drops.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Identifier */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number or Email</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.prefixContainer}>
                  <Text style={styles.prefixText}>+91</Text>
                  <MaterialIcons name="expand-more" size={16} color={COLORS.textLight} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="98765 43210 or name@domain.in"
                  placeholderTextColor="#a89990"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Vault Key / Password</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.textInput, { paddingLeft: 12 }]}
                  placeholder="Enter your confidential password"
                  placeholderTextColor="#a89990"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#9b857a" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
              <Text style={styles.primaryBtnText}>{loading ? "Verifying..." : "Sign In to Kala Kosh"}</Text>
              {!loading && <MaterialIcons name="arrow-forward" size={18} color={COLORS.white} />}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>• OR CONTINUE WITH •</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
                <Text style={styles.socialBtnText}>WhatsApp OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-google" size={16} color="#4285F4" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
            </View>

            {/* Trust Badges */}
            <View style={styles.trustBadges}>
              <MaterialIcons name="verified-user" size={14} color={COLORS.secondary} />
              <Text style={styles.trustText}>Direct Kalakosh Network • 256-Bit Encrypted Vault</Text>
            </View>

            {/* Sign Up Switcher */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New to Kala Kosh? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.signupLink}>Create an User Account</Text>
                <MaterialIcons name="north-east" size={14} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding * 1.2,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#8c6b4d',
    fontWeight: '500',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  insigniaContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f6eee7',
    borderWidth: 1,
    borderColor: '#e6d8ce',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#3e1b07',
    marginBottom: 4,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  line: {
    height: 1,
    width: 24,
    backgroundColor: '#d9c4b5',
  },
  taglineText: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#916b50',
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2a1306',
    marginTop: 24,
  },
  subtitleText: {
    fontSize: 12,
    color: '#725e54',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4e3a30',
    marginBottom: 6,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#a0683a',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    height: 50,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf4ef',
    paddingHorizontal: 12,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    gap: 4,
  },
  prefixText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4e3a30',
  },
  textInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#2d1102',
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1,
    color: '#9b857a',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  socialBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b2d26',
  },
  trustBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  trustText: {
    fontSize: 11,
    color: '#857064',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#f7efe999',
    padding: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  signupText: {
    fontSize: 12,
    color: '#523d32',
  },
  signupLink: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 2,
  },
});

export default LoginScreen;

