import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import CustomInput from "../components/CustomInput";
import { useContext, useState } from "react";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { BASE_API_URL } from "../utils";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../store/app-context";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

export default function AddReportScreen() {
  const [diseaseName, setDiseaseName] = useState("");
  const [description, setDescription] = useState("");
  const [clinicalHistory, setClinicalHistory] = useState("");
  const [findings, setFindings] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [recordType, setRecordType] = useState("");
  const [pdf, setPdf] = useState();
  const navigation = useNavigation();
  const { token } = useContext(AppContext);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.canceled) return;

      setPdf(result.assets[0]);
      Alert.alert("Success", "PDF selected successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const validateInputs = () => {
    if (!diseaseName.trim()) {
      Alert.alert("Validation Error", "Please enter disease name");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Validation Error", "Please enter description");
      return false;
    }
    if (!clinicalHistory.trim()) {
      Alert.alert("Validation Error", "Please enter clinical history");
      return false;
    }
    if (!findings.trim()) {
      Alert.alert("Validation Error", "Please enter findings");
      return false;
    }
    if (!doctorName.trim()) {
      Alert.alert("Validation Error", "Please enter doctor name");
      return false;
    }
    if (!recordType.trim()) {
      Alert.alert("Validation Error", "Please enter record type");
      return false;
    }

    return true;
  };

  const handleConfirm = async () => {
    const validationResult = validateInputs();
    if (!validationResult) return;
    const formData = new FormData();
    formData.append("disease", diseaseName);
    formData.append("description", description);
    formData.append("clinicalHistory", clinicalHistory);
    formData.append("findings", findings);
    formData.append("doctorName", doctorName);
    formData.append("recordType", recordType);
    formData.append("time", new Date().toISOString());

    if (pdf) {
      formData.append("reportUrl", {
        uri: pdf.uri,
        name: pdf.name,
        type: "application/pdf",
      });
    }

    try {
      await axios.post(BASE_API_URL + "/reports", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Report added successfully");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to add report");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Report</Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          placeholder={"Disease Name"}
          value={diseaseName}
          onChangeText={setDiseaseName}
          style={{ marginVertical: 8 }}
        />
        <CustomInput
          placeholder={"Description"}
          value={description}
          onChangeText={setDescription}
          multiline={true}
          style={{ maxHeight: 150, marginVertical: 8 }}
        />
        <CustomInput
          placeholder={"Clinical History"}
          value={clinicalHistory}
          onChangeText={setClinicalHistory}
          style={{ marginVertical: 8 }}
        />
        <CustomInput
          placeholder={"Findings"}
          value={findings}
          onChangeText={setFindings}
          style={{ marginVertical: 8 }}
        />
        <View style={styles.twoCol}>
          <CustomInput
            placeholder={"Doctor Name"}
            value={doctorName}
            onChangeText={setDoctorName}
            style={{ flex: 1, marginRight: 8, marginVertical: 8 }}
          />
          <CustomInput
            placeholder={"Record Type"}
            value={recordType}
            onChangeText={setRecordType}
            style={{ flex: 1, marginLeft: 8, marginVertical: 8 }}
          />
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Ionicons name="document" size={20} color="white" />
          <Text style={styles.uploadText}>{pdf ? pdf.name : "Select PDF"}</Text>
        </TouchableOpacity>

        <CustomButton onPress={handleConfirm} style={{ marginTop: 10 }}>
          Add Report
        </CustomButton>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2F7FF2",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginVertical: 20,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  form: {
    paddingHorizontal: 10,
  },
  twoCol: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2F7FF2",
    padding: 12,
    borderRadius: 6,
    justifyContent: "center",
    marginTop: 10,
  },
  uploadText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
});
