import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';

const { API_URL } = Constants.expoConfig.extra;

const DailyAmountList = () => {
  const [dailyAmounts, setDailyAmounts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchData = async () => {
    try {
      const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
      const url = dateString
        ? `${API_URL}/api/delete-installment?date=${dateString}`
        : `${API_URL}/api/delete-installment`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        Alert.alert('Error', data.error);
        setDailyAmounts([]);
        return;
      }

      if (Array.isArray(data)) {
        setDailyAmounts(data);
      } else {
        Alert.alert('Error', 'Unexpected data format from server.');
        setDailyAmounts([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data.');
      setDailyAmounts([]);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchData();
    } else {
      setDailyAmounts([]); // Clear data if no date selected
    }
  }, [selectedDate]);

  const handleDelete = async (id) => {
    if (!id) {
      Alert.alert('Error', 'Invalid entry ID.');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/delete-installment/${id}`, {
                method: 'DELETE',
              });

              let responseBody = null;
              try {
                responseBody = await response.json();
              } catch {
                // No JSON body in error response
              }

              if (response.ok) {
                setDailyAmounts((prev) => prev.filter((item) => item._id !== id));
                Alert.alert('Success', responseBody?.message || 'Entry deleted successfully.');
              } else {
                const errorMsg =
                  responseBody?.message ||
                  `Failed to delete. Server responded with ${response.status}: ${response.statusText}`;
                Alert.alert('Error', errorMsg);
              }
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete due to network error.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onChangeDate = (event, selected) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) {
      setSelectedDate(selected);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Diary Number: {item.diaryNumber}</Text>
      <Text style={styles.itemText}>Diary Collection: ₹{item.diarycollection}</Text>
      <Text style={styles.itemText}>
        Created At: {new Date(item.createdAt).toLocaleString()}
      </Text>
      <View style={styles.deleteButton}>
        <Button
          title="Delete"
          color="#dc3545"
          onPress={() => handleDelete(item._id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Amounts</Text>

      <Button
        title={selectedDate ? selectedDate.toDateString() : 'Select Date'}
        onPress={() => setShowDatePicker(true)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {dailyAmounts.length > 0 ? (
        <FlatList
          data={dailyAmounts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noDataText}>No data found for selected date.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  itemContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  itemText: { fontSize: 16, marginBottom: 5 },
  deleteButton: { marginTop: 10 },
  noDataText: { marginTop: 20, fontSize: 16, textAlign: 'center', color: '#888' },
});

export default DailyAmountList;
