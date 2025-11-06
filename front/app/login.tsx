import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t("errors.required"), t("errors.fillAllFields"));
      return;
    }

    if (!email.includes("@")) {
      Alert.alert(t("errors.invalid"), t("errors.invalidEmail"));
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
    } catch {
      Alert.alert(t("errors.loginFailed"), t("errors.checkCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <MaterialIcons name="medication" size={80} color="#F23728" />
          <Text style={styles.appName}>CuidaMed</Text>
          <Text style={styles.tagline}>Tu salud, bajo control</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formSection}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={24}
              color="#F23728"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={24}
              color="#F23728"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Register Section */}
        <View style={styles.registerSection}>
          <Text style={styles.registerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity disabled={isLoading}>
            <Text style={styles.registerLink}>Crear una ahora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "space-between",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#F23728",
    marginTop: 16,
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  formSection: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    height: 50,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
  },
  loginButton: {
    backgroundColor: "#F23728",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 24,
    alignItems: "center",
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    color: "#F23728",
    fontSize: 14,
    fontWeight: "500",
  },
  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#F23728",
    fontSize: 14,
    fontWeight: "600",
  },
});
