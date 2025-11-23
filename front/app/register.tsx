import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const logo = require("@/assets/images/logo.png");

export default function RegisterScreen() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const { register } = useAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleRegister = async () => {
    if (!username || !email || !birthDate || !gender || !password) {
      Alert.alert(t("errors.required"), t("errors.fillAllFields"));
      return;
    }

    if (!email.includes("@")) {
      Alert.alert(t("errors.invalid"), t("errors.invalidEmail"));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t("errors.invalid"), t("errors.passwordTooShort"));
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        username,
        email: email.toLowerCase().trim(),
        password,
        birthdate: birthDate.toISOString().split("T")[0],
        profilePictureUrl:
          "https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png",
        gender,
      };
      await register(
        payload.email,
        payload.username,
        payload.password,
        payload.birthdate,
        payload.profilePictureUrl,
        payload.gender
      );
    } catch {
      Alert.alert(t("errors.registerFailed"), t("errors.tryAgain"));
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
        <View style={styles.logoSection}>
          <Text style={styles.appName}>{t("appName")}</Text>
          <Image source={logo} style={styles.logo} />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>{t("register.title")}</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={24}
              color="#F23728"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder={t("register.namePlaceholder")}
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={24}
              color="#F23728"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder={t("register.emailPlaceholder")}
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={openDatePicker}
            disabled={isLoading}
          >
            <MaterialIcons
              name="calendar-today"
              size={24}
              color="#F23728"
              style={styles.icon}
            />
            <Text
              style={[styles.input, { color: birthDate ? "#333" : "#999" }]}
            >
              {birthDate
                ? birthDate.toLocaleDateString("es-ES")
                : t("register.birthDatePlaceholder")}
            </Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="wc"
              size={24}
              color="#F23728"
              style={styles.icon}
            />
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "male" && styles.genderButtonActive,
                ]}
                onPress={() => setGender("male")}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "male" && styles.genderButtonTextActive,
                  ]}
                >
                  {t("register.male")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "female" && styles.genderButtonActive,
                ]}
                onPress={() => setGender("female")}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "female" && styles.genderButtonTextActive,
                  ]}
                >
                  {t("register.female")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={24}
              color="#F23728"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder={t("register.passwordPlaceholder")}
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

          <TouchableOpacity
            style={[
              styles.registerButton,
              isLoading && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>
                {t("register.registerButton")}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.loginSection}>
          <Text style={styles.loginText}>{t("register.haveAccount")}</Text>
          <TouchableOpacity
            disabled={isLoading}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginLink}>{t("register.loginHere")}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={birthDate || new Date(Date.now())}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date(Date.now())}
          />
        )}
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
  },
  logoSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  appName: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#F23728",
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  formSection: {
    flex: 2,
    justifyContent: "flex-start",
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
  },
  genderContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#F23728",
  },
  genderButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  genderButtonTextActive: {
    color: "#fff",
  },
  registerButton: {
    backgroundColor: "#F23728",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 24,
    alignItems: "center",
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#F23728",
    fontSize: 14,
    fontWeight: "600",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
