import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { COLORS, SIZES } from "../theme";

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>About Kalakosh</Text>
        
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Art has always been the language of civilizations. It preserves memories, reflects identities, sparks conversations, and transcends generations. At Kalakosh, we believe that every creation—whether born from centuries-old traditions or contemporary imagination—has the power to inspire, connect, and endure.
          </Text>
          <Text style={styles.paragraph}>
            Founded with a vision to celebrate India's extraordinary artistic heritage, Kalakosh is dedicated to bringing the country's local and indigenous art forms to the world. Behind every handcrafted masterpiece lies the quiet devotion of an artisan, years of inherited wisdom, and a story waiting to be discovered. Through our platform, we strive to ensure that these remarkable traditions continue to thrive, while empowering the artists whose craftsmanship keeps them alive.
          </Text>
          <Text style={styles.paragraph}>
            Yet, our vision extends beyond preserving the past. We celebrate art in all its expressions—from the timeless beauty of traditional paintings and handcrafted works to contemporary canvases, striking 3D artworks, and thoughtfully sculpted forms. By curating both heritage and modern creativity under one roof, we create a space where tradition and innovation exist in harmony, each enriching the other.
          </Text>
          <Text style={styles.paragraph}>
            Kalakosh is more than a destination for collecting art; it is a movement to honour creativity in all its forms. Every piece you discover here is a testament to imagination, dedication, and the enduring value of human craftsmanship.
          </Text>

          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              Because art is not merely something we admire—it is something we inherit, preserve, and pass forward. And through Kalakosh, every creation finds not only a home, but a story that continues to be told.
            </Text>
          </View>

          <View style={styles.artistSection}>
            <Text style={styles.subtitle}>Your Art. Your Story. Your KalaKosh.</Text>
            <Text style={styles.paragraph}>
              Every artist has a story, and every creation carries a little piece of the person who made it. At KalaKosh, we believe these stories deserve to be seen, cherished, and celebrated.
            </Text>
            <Text style={styles.paragraph}>
              If you're an artist, come be a part of the KalaKosh family. Showcase your artwork on our website, connect with people who appreciate the beauty of handmade art, and give your creations a space where they can be discovered and loved.
            </Text>
            <Text style={styles.paragraph}>
              Whether you paint, sculpt, craft, or create in your own unique way, there's a place for your art here.
            </Text>
            <Text style={[styles.paragraph, styles.boldItalic]}>
              Create with heart. Share your story. Let KalaKosh help your art find its way home.
            </Text>
          </View>
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
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 15,
  },
  content: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paragraph: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  quoteBox: {
    padding: 20,
    backgroundColor: COLORS.primary + "1A", // 10% opacity
    borderRadius: SIZES.radius,
    marginVertical: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: COLORS.primary,
    textAlign: "center",
    lineHeight: 24,
  },
  artistSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  boldItalic: {
    fontWeight: "bold",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
    color: COLORS.primary,
  }
});

export default AboutScreen;
