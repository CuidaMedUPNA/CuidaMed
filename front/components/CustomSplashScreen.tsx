import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// Configuración de las burbujas flotantes
const BUBBLES = [
  { size: 80, startX: -40, startY: height * 0.2, duration: 8000, delay: 0 },
  {
    size: 60,
    startX: width - 30,
    startY: height * 0.4,
    duration: 10000,
    delay: 500,
  },
  {
    size: 100,
    startX: width * 0.3,
    startY: height + 50,
    duration: 12000,
    delay: 1000,
  },
  {
    size: 50,
    startX: width * 0.7,
    startY: height * 0.6,
    duration: 9000,
    delay: 300,
  },
  { size: 70, startX: -20, startY: height * 0.7, duration: 11000, delay: 800 },
  {
    size: 40,
    startX: width * 0.5,
    startY: height * 0.1,
    duration: 7000,
    delay: 200,
  },
  {
    size: 90,
    startX: width - 60,
    startY: height * 0.8,
    duration: 13000,
    delay: 600,
  },
  {
    size: 55,
    startX: width * 0.2,
    startY: height * 0.5,
    duration: 8500,
    delay: 400,
  },
];

interface CustomSplashScreenProps {
  progress: number; // 0 a 1
  message?: string;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  progress,
  message = "Cargando...",
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animaciones para las burbujas
  const bubbleAnims = useRef(
    BUBBLES.map(() => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Animación de las burbujas flotantes
  useEffect(() => {
    bubbleAnims.forEach((anim, index) => {
      const bubble = BUBBLES[index];

      // Aparecer con delay
      setTimeout(() => {
        // Fade in y scale
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();

        // Movimiento flotante continuo
        Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(anim.translateY, {
                toValue: -30 - Math.random() * 20,
                duration: bubble.duration / 2,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateY, {
                toValue: 30 + Math.random() * 20,
                duration: bubble.duration / 2,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(anim.translateX, {
                toValue: 20 + Math.random() * 15,
                duration: bubble.duration / 2 + 500,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateX, {
                toValue: -20 - Math.random() * 15,
                duration: bubble.duration / 2 + 500,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      }, bubble.delay);
    });
  }, [bubbleAnims]);

  // Animación del logo al inicio
  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de pulso sutil
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [logoScale, logoOpacity, pulseAnim]);

  // Animación suave del progreso
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 80],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      <LinearGradient
        colors={["#FF6B6B", "#FF8E53", "#FFA07A"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Burbujas flotantes de fondo */}
        {BUBBLES.map((bubble, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bubble,
              {
                width: bubble.size,
                height: bubble.size,
                borderRadius: bubble.size / 2,
                left: bubble.startX,
                top: bubble.startY,
                opacity: bubbleAnims[index].opacity,
                transform: [
                  { translateX: bubbleAnims[index].translateX },
                  { translateY: bubbleAnims[index].translateY },
                  { scale: bubbleAnims[index].scale },
                ],
              },
            ]}
          />
        ))}

        {/* Contenido principal */}
        <View style={styles.content}>
          {/* Logo con animación */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }, { scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.logoCircle}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* Nombre de la app */}
          <Animated.Text style={[styles.appName, { opacity: logoOpacity }]}>
            CuidaMed
          </Animated.Text>

          {/* Tagline */}
          <Animated.Text style={[styles.tagline, { opacity: logoOpacity }]}>
            Tu salud, bajo control
          </Animated.Text>
        </View>

        {/* Barra de progreso en la parte inferior */}
        <View style={styles.bottomSection}>
          <Text style={styles.loadingMessage}>{message}</Text>

          {/* Contenedor de la barra de progreso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[styles.progressBar, { width: progressWidth }]}
              >
                <LinearGradient
                  colors={["#FFFFFF", "#FFE0E0"]}
                  style={styles.progressGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>

            {/* Porcentaje */}
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>
          </View>

          {/* Versión */}
          <Text style={styles.version}>v1.0.0</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 8,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingMessage: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 16,
    fontWeight: "500",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressGradient: {
    flex: 1,
  },
  progressText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 10,
    fontWeight: "700",
  },
  version: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 24,
    fontWeight: "500",
  },
  bubble: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
});
