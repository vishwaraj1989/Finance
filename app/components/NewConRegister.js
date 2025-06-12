import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants'; // Import expo-constants to access API_URL

const { API_URL } = Constants.expoConfig.extra; // Get the API_URL from the constants

const Register = () => {
  const [diaryNumber, setDiaryNumber] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [consumerAddress, setConsumerAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [days, setDays] = useState('');
  const [installment, setInstallment] = useState('');
  const [percentage, setPercentage] = useState(0);

  // Calculate percentage on amount, days and installment input changes
  const calculatePercentage = () => {
    const amt = parseFloat(amount);
    const d = parseInt(days);
    const inst = parseFloat(installment);

    if (!isNaN(amt) && !isNaN(d) && !isNaN(inst) && d > 0) {
      const total = inst * d - amt;
      const perc = (30 * ((total * 100) / amt)) / d;
      setPercentage(parseFloat(perc.toFixed(2)));
    } else {
      setPercentage(0);
    }
  };

  useEffect(() => {
    calculatePercentage();
  }, [amount, days, installment]);

  // Handle form submission
  const handleSubmit = () => {
    if (!diaryNumber || !consumerName || !consumerAddress || !amount || !days || !installment) {
      Alert.alert('Validation Error', 'All fields are compulsory. Please fill in all required fields.');
      return;
    }

    const registerObj = {
      diaryNumber: diaryNumber,
      name: consumerName.toUpperCase(),
      address: consumerAddress.toUpperCase(),
      mobileNumber: mobileNumber,
      reference: reference.toUpperCase(),
      amount: parseFloat(amount),
      days: parseInt(days),
      installment: parseFloat(installment),
      percentage: percentage,
    };

    axios.post(`${API_URL}/api/new-consumer`, registerObj) // Use dynamic API_URL
      .then(() => {
        Alert.alert('Success', 'Consumer Added');
        // Reset form
        setConsumerName('');
        setConsumerAddress('');
        setMobileNumber('');
        setReference('');
        setAmount('');
        setDays('');
        setInstallment('');
        setPercentage(0);
        setDiaryNumber((prev) => (parseInt(prev) + 1).toString());
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'An error occurred while adding the consumer.');
      });
  };

  // Fetch latest diary number
  useEffect(() => {
    axios.get(`${API_URL}/api/consumer-list`) // Use dynamic API_URL
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const lastConsumer = response.data[response.data.length - 1];
          setDiaryNumber((lastConsumer.diaryNumber + 1).toString());
        } else {
          setDiaryNumber('1');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Enter Diary Number</Text>
      <TextInput
        style={styles.input}
        value={diaryNumber}
        keyboardType="numeric"
        editable={false}
      />

      <Text style={styles.label}>Consumer Name</Text>
      <TextInput
        style={styles.input}
        value={consumerName}
        onChangeText={setConsumerName}
      />

      <Text style={styles.label}>Consumer Address</Text>
      <TextInput
        style={styles.input}
        value={consumerAddress}
        onChangeText={setConsumerAddress}
      />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Reference</Text>
      <TextInput
        style={styles.input}
        value={reference}
        onChangeText={setReference}
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Days</Text>
      <TextInput
        style={styles.input}
        value={days}
        onChangeText={setDays}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Installment</Text>
      <TextInput
        style={styles.input}
        value={installment}
        onChangeText={setInstallment}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Percentage Per Month</Text>
      <TextInput
        style={styles.input}
        value={percentage.toString()}
        editable={false}
      />

      <View style={styles.buttonContainer}>
        <Button title="Submit Form" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 4,
    borderRadius: 6,
  },
  buttonContainer: {
    marginTop: 24,
  },
});

export default Register;
