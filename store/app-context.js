import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { BASE_API_URL } from "../utils";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setToken(token);

        if (token) {
          const response = await axios.get(BASE_API_URL + "/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(response.data.user);
        }
      } catch (error) {
        Alert.alert("Error", "Error fetching user details");
      } finally {
        setIsLoggingIn(false);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggingIn]);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{ user, loading, setIsLoggingIn, token, logout }}
    >
      {children}
    </AppContext.Provider>
  );
}
