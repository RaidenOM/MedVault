import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ReportCard = ({ report, style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{report.disease}</Text>
      </View>

      <Text numberOfLines={2} style={styles.description}>
        {report.description}
      </Text>

      <Text style={styles.sectionTitle}>Clinical History:</Text>
      <Text numberOfLines={2} style={styles.sectionText}>
        {report.clinicalHistory}
      </Text>

      <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Findings:</Text>
      <Text numberOfLines={2} style={styles.sectionText}>
        {report.findings}
      </Text>

      <View style={styles.footer}>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorText}>👨‍⚕️ {report.doctorName}</Text>
        </View>
        {report.reportUrl && (
          <TouchableOpacity
            style={[styles.viewButton]}
            onPress={() => {
              Linking.openURL(report.reportUrl);
            }}
          >
            <Text style={styles.viewButtonText}>View Report</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  recordType: {
    fontWeight: "bold",
  },
  description: {
    color: "#555",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  sectionText: {
    color: "#777",
    fontSize: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  reportImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 10,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  viewButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 5,
    backgroundColor: "black",
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReportCard;
