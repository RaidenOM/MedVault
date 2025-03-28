import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../store/app-context";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { BASE_API_URL } from "../utils";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggingIn } = useContext(AppContext);
  const [loginLoading, setLoginLoading] = useState(false);

  const validateInputs = () => {
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required.");
      return false;
    }
    if (username.includes(" ")) {
      Alert.alert("Validation Error", "Username cannot have spaces");
      return false;
    }
    if (username.length < 3) {
      Alert.alert(
        "Validation Error",
        "Username must be at least 3 characters long."
      );
      return false;
    }
    if (!password) {
      Alert.alert("Validation Error", "Password is required.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 6 characters long."
      );
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoginLoading(true);

    const trimmedUsername = username.trim();
    try {
      const response = await axios.post(BASE_API_URL + "/login", {
        username: trimmedUsername,
        password: password,
      });

      const { token } = response.data;
      await AsyncStorage.setItem("token", token);
      setIsLoggingIn(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      Alert.alert("Login Error", errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <Text style={[styles.title, { color: "#2c3e50" }]}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to your account</Text>
      <CustomInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <CustomInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
        autoCapitalize="none"
      />
      <CustomButton
        onPress={handleLogin}
        disabled={loginLoading}
        style={{ marginBottom: 15 }}
      >
        {loginLoading ? <ActivityIndicator color="#fff" /> : "Login"}
      </CustomButton>
      <CustomButton
        onPress={() => navigation.navigate("RegisterScreen")}
        type="secondary"
      >
        New User? Register
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#7f8c8d",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    width: "100%",
  },
});
