import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../theme";
import api from "../api";
import { useApp } from "../context/AppContext";

const FeedbackScreen = () => {
  const { user } = useApp();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Toast.show({ type: 'error', text1: "Missing Rating", text2: "Please select a rating before submitting." });
      return;
    }
    if (!feedback.trim()) {
      Toast.show({ type: 'error', text1: "Missing Feedback", text2: "Please write your feedback before submitting." });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post("/feedbacks", {
        name: user?.name || "Guest",
        rating,
        comment: feedback
      });
      
      if (data.success) {
        Toast.show({ type: 'success', text1: "Thank You!", text2: "We appreciate your feedback and will use it to improve our services." });
        setRating(0);
        setFeedback("");
      }
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: "Error", text2: error.response?.data?.message || "Failed to submit feedback. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Send Feedback</Text>
        
        <View style={styles.card}>
          <Text style={styles.subtitle}>How was your experience?</Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={40} 
                  color={star <= rating ? "#f59e0b" : COLORS.textLight} 
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Tell us more</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="What did you like or dislike? How can we improve?" 
            multiline
            numberOfLines={5}
            value={feedback}
            onChangeText={setFeedback}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
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
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  star: {
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    color: COLORS.text,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FeedbackScreen;
