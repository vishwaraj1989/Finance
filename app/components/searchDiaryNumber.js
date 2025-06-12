import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';


const { API_URL } = Constants.expoConfig.extra; // fallback if not set

const SearchComponent = () => {
  const [name, setName] = useState('');
  const [diaryNumber, setDiaryNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (text) => {
    setName(text.toUpperCase());
  };

  const handleSearch = async () => {
    if (name.trim() === '') {
      Alert.alert('Validation', 'Please enter a name.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/consumer-number`, {
        params: { name }
      });

      if (response.status === 200 && response.data.diaryNumber !== undefined) {
        setDiaryNumber(response.data.diaryNumber);
      } else {
        setDiaryNumber('');
        Alert.alert('Not Found', response.data.message || 'Consumer not found.');
      }
    } catch (error) {
      setDiaryNumber('');
      if (error.response) {
        // Server responded with a status outside 2xx
        Alert.alert('Error', error.response.data.message || 'Server error.');
      } else if (error.request) {
        // No response received
        Alert.alert('Error', 'No response from server. Check your connection.');
      } else {
        // Something else went wrong
        Alert.alert('Error', 'An unexpected error occurred.');
      }
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Diary Number</Text>
      <Text style={styles.label}>Enter Consumer Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name..."
        value={name}
        onChangeText={handleInputChange}
        autoCapitalize="characters"
      />
      <View style={styles.buttonContainer}>
        <Button title="Search" onPress={handleSearch} disabled={loading} />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {diaryNumber !== '' && (
        <Text style={styles.result}>Diary Number: {diaryNumber}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    color: 'green',
  },
});

export default SearchComponent;
