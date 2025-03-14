import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/app-context";
import {
  Alert,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { BASE_API_URL } from "../utils";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ReportCard from "../components/ReportCard"; // Reuse the ReportCard component
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function HomeScreen() {
  const { user, token, logout } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [recentReports, setRecentReports] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        const response = await axios.get(BASE_API_URL + "/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRecentReports(
          response.data.reports
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 3) // Show only the 3 most recent reports
        );
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "An error occurred while fetching recent reports");
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) fetchRecentReports();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        style={styles.header}
        colors={["#2F7FF2", "#2f7ff2", "#702ff2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View>
          <Text style={styles.headerTitle}>Welcome, {user.username}</Text>
          <Text style={styles.headerSubtitle}>{user.hospitalName}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="exit-outline" size={20} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Recent Reports Section */}
      <Text style={styles.sectionTitle}>Recent Reports</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2F7FF2" style={styles.loader} />
      ) : (
        <ScrollView
          contentContainerStyle={
            recentReports.length === 0 ? styles.emptyContainer : null
          }
          style={styles.reportsList}
        >
          {recentReports.length > 0 ? (
            recentReports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                style={{ marginHorizontal: 16 }}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No reports found.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
  reportsList: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    marginHorizontal: 16,
  },
  headerSubtitle: {
    color: "#d9d9d9",
  },
  logoutButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});
