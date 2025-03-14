import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BASE_API_URL } from "../utils";
import {
  Alert,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { AppContext } from "../store/app-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import ReportCard from "../components/ReportCard";

export default function ReportsScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AppContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(BASE_API_URL + "/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedReports = response.data.reports.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        setReports(sortedReports);
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching reports");
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) fetchReports();
  }, [isFocused]);

  const filteredReports = reports.filter((report) =>
    report.disease.toLowerCase().includes(search.toLowerCase())
  );

  const groupedReports = filteredReports.reduce((acc, report) => {
    const year = format(new Date(report.time), "yyyy");
    const formattedDate = format(new Date(report.time), "MMM do");

    if (!acc[year]) acc[year] = {};
    if (!acc[year][formattedDate]) acc[year][formattedDate] = [];
    acc[year][formattedDate].push(report);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Ionicons name="qr-code-outline" size={20} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by disease..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
      </View>

      <ScrollView style={styles.reportsList}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2F7FF2"
            style={styles.loader}
          />
        ) : (
          Object.keys(groupedReports).map((year) => (
            <View key={year} style={styles.yearGroup}>
              <View style={styles.yearCircle}>
                <Text style={styles.yearText}>{year}</Text>
              </View>

              {Object.keys(groupedReports[year]).map((date) => (
                <View key={date} style={styles.reportSection}>
                  <View style={styles.timeline} />

                  <View style={styles.reportContent}>
                    <Text style={styles.dateText}>{date}</Text>
                    {groupedReports[year][date].map((report) => (
                      <ReportCard key={report._id} report={report} />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate("AddReportScreen")}
        style={styles.addButton}
      >
        <Ionicons name="add" size={28} color={"white"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", paddingTop: 50 },
  header: {
    marginVertical: 20,
    paddingLeft: 10,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 8,
  },
  reportsList: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  yearGroup: {
    marginBottom: 20,
  },
  yearCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2F7FF2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  yearText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  reportSection: {
    flexDirection: "row",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  timeline: {
    width: 3,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
  },
  reportContent: {
    flex: 1,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  addButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2F7FF2",
    position: "absolute",
    bottom: 30,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
});
