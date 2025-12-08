import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CustomSplashScreenProps {
  onFinish: () => void;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  onFinish,
}) => {
  const [progress] = useState(new Animated.Value(0));
  const [logoScale] = useState(new Animated.Value(0));
  const [logoOpacity] = useState(new Animated.Value(0));
  const [logoRotate] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [circleScale] = useState(new Animated.Value(0.8));
  const [titleSlide] = useState(new Animated.Value(50));
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Animación del círculo de fondo
    Animated.timing(circleScale, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Animación simple del logo
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación del título
    Animated.timing(titleSlide, {
      toValue: 0,
      duration: 600,
      delay: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Listener para actualizar el porcentaje
    const progressListener = progress.addListener(({ value }) => {
      setPercentage(Math.round(value * 100));
    });

    // Animación de la barra de progreso con aceleración realista
    Animated.timing(progress, {
      toValue: 1,
      duration: 2500,
      delay: 400,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        onFinish();
      }, 200);
    });

    return () => {
      progress.removeListener(progressListener);
    };
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <LinearGradient
      colors={["#FF6B6B", "#FF8E53", "#FFA07A"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Círculos decorativos animados */}
      <Animated.View
        style={[
          styles.decorCircle1,
          {
            transform: [{ scale: circleScale }],
            opacity: logoOpacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.decorCircle2,
          {
            transform: [{ scale: circleScale }],
            opacity: logoOpacity,
          },
        ]}
      />

      <View style={styles.content}>
        {/* Logo Animado */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
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

        {/* Nombre de la App */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ translateY: titleSlide }],
          }}
        >
          <Text style={styles.appName}>CuidaMed</Text>
          <Text style={styles.appTagline}>Tu salud, bajo control</Text>
        </Animated.View>

        {/* Barra de Progreso */}
        <View style={styles.progressContainer}>
          <View style={styles.percentageContainer}>
            <Animated.Text
              style={[
                styles.percentageText,
                {
                  opacity: progress.interpolate({
                    inputRange: [0, 0.1, 1],
                    outputRange: [0, 1, 1],
                  }),
                  transform: [
                    {
                      scale: progress.interpolate({
                        inputRange: [0, 0.1, 1],
                        outputRange: [0.5, 1, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {percentage}%
            </Animated.Text>
          </View>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth,
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradient}
              />
            </Animated.View>
          </View>
          <Animated.View
            style={{
              opacity: progress.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: [0, 1, 1],
              }),
            }}
          >
            <Text style={styles.loadingText}>Cargando tu información...</Text>
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    zIndex: 10,
  },
  decorCircle1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -150,
    right: -100,
  },
  decorCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    bottom: -100,
    left: -80,
  },
  logoContainer: {
    marginBottom: 50,
  },
  logoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 15,
    padding: 25,
  },
  logoGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#FFF",
  },
  logo: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  appName: {
    fontSize: 52,
    fontWeight: "900",
    color: "#FFF",
    textAlign: "center",
    letterSpacing: -2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 17,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  progressContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  percentageContainer: {
    marginBottom: 16,
  },
  percentageText: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    letterSpacing: -1,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  progressFill: {
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  progressGradient: {
    flex: 1,
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.95)",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
