
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';

const { API_URL } = Constants.expoConfig.extra;

export default function ConsumerDetails() {
  const [diaryData, setDiaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState({});
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/consumer-list`)
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setDiaryData(data);
        } else {
          console.error('Unexpected response format:', data);
          setDiaryData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleEdit = (consumer) => {
    setSelectedConsumer(consumer);
    setFormData({ ...consumer });
    setShowModal(true);
  };

  const handleDelete = (entryId) => {

    console.log("buttom click")
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          axios
            .delete(`${API_URL}/api/delete-entry/${entryId}`)
            .then(() => {
              setDiaryData((prev) => prev.filter((entry) => entry._id !== entryId));
            })
            .catch((err) => {
              console.error(err);
              Alert.alert('Error', 'Failed to delete entry.');
            });
        }
      }
    ]);
  };

  const handleUpdate = () => {
    axios
      .put(`${API_URL}/api/update-consumer/${selectedConsumer._id}`, formData)
      .then(() => {
        const updatedData = diaryData.map((item) =>
          item._id === selectedConsumer._id ? { ...item, ...formData } : item
        );
        setDiaryData(updatedData);
        setShowModal(false);
      })
      .catch((err) => {
        console.error(err);
        Alert.alert('Error', 'Failed to update entry.');
      });
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalPages = Math.ceil(diaryData.length / itemsPerPage);
  const currentData = diaryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={currentData}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={() => (
          <View style={styles.headerRow}>
            {['Diary No', 'Name', 'Amount', 'Edit', 'Delete'].map((header) => (
              <Text key={header} style={styles.headerCell}>{header}</Text>
            ))}
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.diaryNumber}</Text>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.amount}</Text>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        {[...Array(totalPages)].map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setCurrentPage(i + 1)}
            style={[
              styles.pageButton,
              currentPage === i + 1 && styles.activePageButton
            ]}
          >
            <Text
              style={{
                color: currentPage === i + 1 ? 'white' : 'black'
              }}
            >
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.modalTitle}>Update Consumer</Text>
              {Object.keys(selectedConsumer).map((key) => (
                <View key={key} style={styles.inputGroup}>
                  <Text>{key}</Text>
                  <TextInput
                    value={formData[key] ? String(formData[key]) : ''}
                    onChangeText={(text) => handleInputChange(key, text)}
                    style={styles.input}
                  />
                </View>
              ))}
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  cell: {
    flex: 1,
    textAlign: 'center'
  },
  editButton: {
    backgroundColor: 'green',
    paddingHorizontal: 8,
    borderRadius: 4
  },
  deleteButton: {
    backgroundColor: '#f0ad4e',
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 5
  },
  buttonText: {
    color: 'white'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    flexWrap: 'wrap'
  },
  pageButton: {
    padding: 6,
    margin: 4,
    backgroundColor: '#ddd',
    borderRadius: 4
  },
  activePageButton: {
    backgroundColor: '#007bff'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 6,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  inputGroup: {
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 6,
    marginTop: 4
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15
  },
  closeButton: {
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8
  },
  updateButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4
  }
});
