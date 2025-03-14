import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { BASE_API_URL } from "../utils";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const validateInputs = () => {
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required.");
      return false;
    }
    if (username.includes(" ")) {
      Alert.alert("Validation Error", "Username cannot have spaces.");
      return false;
    }
    if (username.length < 3) {
      Alert.alert(
        "Validation Error",
        "Username must be at least 3 characters long."
      );
      return false;
    }

    if (!hospitalName.trim()) {
      Alert.alert("Validation Error", "Hospital name is required");
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
    if (password && confirmPassword && password !== confirmPassword) {
      Alert.alert("Validation Error", "Password must be same.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setRegisterLoading(true);
    const trimmedUsername = username.trim();
    try {
      const response = await axios.post(BASE_API_URL + "/register", {
        username: trimmedUsername,
        password,
        hospitalName,
      });

      Alert.alert("Success", "Registration successful!");
      navigation.goBack();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      Alert.alert("Registration Error", errorMessage);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <Text style={[styles.title, { color: "#2c3e50" }]}>
        Create an Account
      </Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <CustomInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      <CustomInput
        placeholder="Hospital Name"
        value={hospitalName}
        onChangeText={setHospitalName}
        style={styles.input}
      />

      <CustomInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
        autoCapitalize="none"
      />
      <CustomInput
        placeholder="Confirm password"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
        style={styles.input}
        autoCapitalize="none"
      />
      <CustomButton
        onPress={handleRegister}
        disabled={registerLoading}
        style={{ marginBottom: 15 }}
      >
        {registerLoading ? <ActivityIndicator color="#fff" /> : "Register"}
      </CustomButton>
      <CustomButton onPress={() => navigation.goBack()} type="secondary">
        Already have an account? Login
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
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  dropdown: {
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    marginBottom: 0,
  },
});
