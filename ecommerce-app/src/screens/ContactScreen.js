import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { COLORS, SIZES } from "../theme";
import api from "../api";

const ContactScreen = () => {
  const [settings, setSettings] = useState({
    supportEmail: 'support@kalakosh.com',
    contactPhone: '+91 123 456 7890',
    businessAddress: 'New Delhi, India'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) {
          setSettings({
            supportEmail: data.supportEmail || 'support@kalakosh.com',
            contactPhone: data.contactPhone || '+91 123 456 7890',
            businessAddress: data.businessAddress || 'New Delhi, India'
          });
        }
      } catch (error) {
        console.log('Failed to load settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      Toast.show({ type: 'error', text1: "Error", text2: "Please fill all required fields." });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/contacts', formData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your message has been sent successfully!'
      });
      setFormData({ name: '', email: '', mobile: '', message: '' });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Contact Us</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.subtitle}>Get in Touch</Text>
          <Text style={styles.paragraph}>
            Have questions about an artwork, your order, or just want to say hello? We'd love to hear from you.
          </Text>

          <View style={styles.contactRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.contactText}>{settings.supportEmail}</Text>
          </View>
          <View style={styles.contactRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="call" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.contactText}>{settings.contactPhone}</Text>
          </View>
          <View style={styles.contactRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.contactText}>{settings.businessAddress}</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Send a Message</Text>
          
          <Text style={styles.label}>Name *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Your name" 
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="your@email.com" 
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />

          <Text style={styles.label}>Mobile No.</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Your mobile number" 
            keyboardType="phone-pad"
            value={formData.mobile}
            onChangeText={(text) => handleChange("mobile", text)}
          />

          <Text style={styles.label}>Message *</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="How can we help you?" 
            multiline
            numberOfLines={4}
            value={formData.message}
            onChangeText={(text) => handleChange("message", text)}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Send Message</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 20,
    lineHeight: 22,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "1A", // 10% opacity
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  formCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.textLight,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ContactScreen;
