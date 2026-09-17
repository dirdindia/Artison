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
} from "react-native";
import { useApp } from "../context/AppContext";
import { COLORS, SIZES } from "../theme";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const SignupScreen = ({ navigation }) => {
  const { setUser } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [optIn, setOptIn] = useState(true);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "Vault Security: None", color: "#e2d5cb" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score += 1;
    
    if (score === 0) score = 1;
    const labels = ["Vault Security: None", "Vault Security: Weak", "Vault Security: Medium", "Vault Security: Strong", "Vault Security: Max"];
    const colors = ["#e2d5cb", "#ef4444", "#f59e0b", "#10b981", "#059669"];
    return { score, label: labels[score], color: colors[score] };
  };

  const strength = getPasswordStrength(password);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !mobile.trim()) {
      Toast.show({ type: 'error', text1: "Missing info", text2: "Please fill all the required fields." });
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', { name, email, phone: mobile, password });
      
      if (response.data && response.data.data && response.data.data.token) {
        await AsyncStorage.setItem('token', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
      } else {
        Toast.show({ type: 'error', text1: "Signup Failed", text2: "Invalid response from server." });
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Something went wrong";
      Toast.show({ type: 'error', text1: "Signup Error", text2: message });
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
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.brandTitleSmall}>KALA KOSH</Text>
              <Text style={styles.registryText}>PATRON REGISTRY</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.langBtn}>
                <MaterialIcons name="language" size={14} color="#916b50" />
                <Text style={styles.langText}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.supportBtn}>
                <MaterialIcons name="support-agent" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Atelier Access & Header */}
          <View style={styles.titleContainer}>
            <View style={styles.atelierBadge}>
              <MaterialIcons name="stars" size={12} color={COLORS.secondary} />
              <Text style={styles.atelierText}>ATELIER ACCESS</Text>
              <View style={styles.atelierLine} />
            </View>
            <Text style={styles.mainTitle}>Join the Kala Kosh Circle</Text>
            <Text style={styles.subTitle}>
              Become a patron of authentic Indian crafts and unlock collector privileges.
            </Text>
          </View>

          {/* Patron Privileges */}
          <View style={styles.privilegesBox}>
            <View style={styles.privilegeItem}>
              <View style={styles.privilegeIconWrapper}>
                <MaterialIcons name="local-mall" size={16} color="#8b5a2b" />
              </View>
              <Text style={styles.privilegeTitle}>FIRST ORDER</Text>
              <Text style={styles.privilegeSub}>15% Off</Text>
            </View>

            <View style={[styles.privilegeItem, styles.privilegeBorder]}>
              <View style={styles.privilegeIconWrapper}>
                <MaterialIcons name="auto-awesome" size={16} color="#8b5a2b" />
              </View>
              <Text style={styles.privilegeTitle}>EARLY ARTISAN</Text>
              <Text style={styles.privilegeSubText}>Drop Access</Text>
            </View>

            <View style={styles.privilegeItem}>
              <View style={styles.privilegeIconWrapper}>
                <MaterialIcons name="workspace-premium" size={16} color="#8b5a2b" />
              </View>
              <Text style={styles.privilegeTitle}>CERTIFICATE</Text>
              <Text style={styles.privilegeSubText}>Of Authenticity</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.prefixContainer}>
                  <Text style={styles.prefixText}>Mr.</Text>
                  <MaterialIcons name="arrow-drop-down" size={16} color={COLORS.textLight} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Maharani Devika Rathore"
                  placeholderTextColor="#ab9c93"
                  value={name}
                  onChangeText={setName}
                />
                <MaterialIcons name="person" size={18} color="#a08b80" style={{ paddingRight: 12 }} />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Email Address</Text>
                <Text style={styles.labelTextInfo}>For user certificates & invoices</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.textInput, { paddingLeft: 12 }]}
                  placeholder="patron@collection.in"
                  placeholderTextColor="#ab9c93"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <MaterialIcons name="mail" size={18} color="#a08b80" style={{ paddingRight: 12 }} />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.inputGroup}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Mobile Number</Text>
                <View style={styles.vipTag}>
                  <Text style={styles.vipTagText}>VIP SMS Concierge</Text>
                </View>
              </View>
              <View style={styles.inputWrapper}>
                <View style={styles.prefixContainer}>
                  <Text style={styles.prefixTextSmall}>IN +91</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="98765 43210"
                  placeholderTextColor="#ab9c93"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                />
                <MaterialIcons name="verified" size={18} color="#a08b80" style={{ paddingRight: 12 }} />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Create Password</Text>
                <Text style={styles.labelTextInfo}>Min. 8 characters</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.textInput, { paddingLeft: 12 }]}
                  placeholder="Create password"
                  placeholderTextColor="#ab9c93"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingRight: 12 }}>
                  <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#a08b80" />
                </TouchableOpacity>
              </View>
              {/* Vault Security Indicator */}
              <View style={styles.securityMeterContainer}>
                <View style={styles.meterBars}>
                  <View style={[styles.meterBar, strength.score >= 1 && { backgroundColor: strength.color }]} />
                  <View style={[styles.meterBar, strength.score >= 2 && { backgroundColor: strength.color }]} />
                  <View style={[styles.meterBar, strength.score >= 3 && { backgroundColor: strength.color }]} />
                  <View style={[styles.meterBar, strength.score >= 4 && { backgroundColor: strength.color }]} />
                </View>
                <Text style={styles.securityText}>{strength.label}</Text>
              </View>
            </View>

            {/* Communique Opt-in */}
            <TouchableOpacity 
              style={styles.optInContainer} 
              activeOpacity={0.8}
              onPress={() => setOptIn(!optIn)}
            >
              <MaterialIcons 
                name={optIn ? "check-box" : "check-box-outline-blank"} 
                size={20} 
                color={COLORS.primary} 
              />
              <View style={styles.optInTextWrapper}>
                <Text style={styles.optInTitle}>Subscribe to Notifications</Text>
                <Text style={styles.optInDesc}>
                  Receive updates, exclusive offers, and the latest news via email and SMS.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup} disabled={loading}>
              <Text style={styles.primaryBtnText}>{loading ? "CREATING..." : "CREATE USER ACCOUNT"}</Text>
              {!loading && <MaterialIcons name="arrow-forward" size={18} color={COLORS.white} />}
            </TouchableOpacity>

            {/* Legal */}
            <Text style={styles.legalText}>
              By creating an account, you agree to Kala Kosh Heritage <Text style={styles.legalLink}>Terms of Service</Text> & <Text style={styles.legalLink}>Privacy Policy</Text>. All acquisitions include verified GI-Provenance certification.
            </Text>

            {/* Already a Patron Switcher */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already a registered patron? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.loginLink}>Sign In</Text>
                <MaterialIcons name="lock" size={12} color={COLORS.primary} style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
        {/* Footer */}
        <View style={styles.footer}>
          <MaterialIcons name="account-balance" size={12} color={COLORS.secondary} />
          <Text style={styles.footerText}>Direct-From-Atelier Registry • India</Text>
        </View>
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
    padding: SIZES.padding,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  brandTitleSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 3,
    color: '#3e1b07',
  },
  registryText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#916b50',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(255,255,255,0.7)',
    gap: 4,
  },
  langText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4e3a30',
  },
  supportBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  atelierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6eee7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8ded5',
    marginBottom: 12,
    gap: 6,
  },
  atelierText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: '#8b5a2b',
  },
  atelierLine: {
    width: 12,
    height: 1,
    backgroundColor: COLORS.secondary,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2a1306',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 12,
    color: '#725e54',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  privilegesBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(250,244,239,0.9)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 20,
  },
  privilegeItem: {
    flex: 1,
    alignItems: 'center',
  },
  privilegeBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ead8cc',
    paddingHorizontal: 4,
  },
  privilegeIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0e4da',
    borderWidth: 1,
    borderColor: '#dfcebf',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  privilegeTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#3e1b07',
    textAlign: 'center',
  },
  privilegeSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#a0683a',
    marginTop: 2,
  },
  privilegeSubText: {
    fontSize: 9,
    color: '#725e54',
    marginTop: 2,
  },
  formContainer: {
    gap: 14,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4e3a30',
    marginBottom: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelTextInfo: {
    fontSize: 10,
    color: '#8c7468',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    height: 48,
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
    fontWeight: '600',
    color: '#4e3a30',
  },
  prefixTextSmall: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4e3a30',
  },
  textInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#2d1102',
  },
  vipTag: {
    backgroundColor: '#f9efe7',
    borderWidth: 1,
    borderColor: '#ebd8cc',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  vipTagText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#8b5a2b',
  },
  securityMeterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  meterBars: {
    flexDirection: 'row',
    gap: 6,
  },
  meterBar: {
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2d5cb',
  },
  meterBarActive: {
    backgroundColor: COLORS.secondary,
  },
  securityText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#78645a',
  },
  optInContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#faf5f0',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 12,
    gap: 12,
  },
  optInTextWrapper: {
    flex: 1,
  },
  optInTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3b271b',
  },
  optInDesc: {
    fontSize: 10,
    color: '#796459',
    marginTop: 4,
    lineHeight: 14,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  legalText: {
    fontSize: 10,
    color: '#867064',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  legalLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 11,
    color: '#5a463b',
  },
  loginLink: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(236,220,214,0.6)',
    gap: 6,
  },
  footerText: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1,
    color: '#8a7265',
  },
});

export default SignupScreen;
