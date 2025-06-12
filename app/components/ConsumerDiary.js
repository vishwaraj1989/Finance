import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const { API_URL } = Constants.expoConfig.extra;

const ConsumerDiary = () => {
  const [diaryNumber, setDiaryNumber] = useState('');
  const [diaryCollection, setDiaryCollection] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [lastPaymentDate, setLastPaymentDate] = useState('');
  const [installment, setInstallment] = useState('');
  const [totalDiaryCollection, setTotalDiaryCollection] = useState('');
  const [days, setDays] = useState('');
  const [divisionResult, setDivisionResult] = useState('');
  const [error, setError] = useState(null);

  const diaryNumberInputRef = useRef(null);

  useEffect(() => {
    diaryNumberInputRef.current?.focus();
  }, []);

  // Clear error when inputs change
  const handleDiaryNumberChange = (val) => {
    setDiaryNumber(val);
    if (error) setError(null);
  };

  const handleInstallmentChange = (val) => {
    setInstallment(val);
    if (error) setError(null);
  };

  const handleDaysChange = (val) => {
    setDays(val);
    if (error) setError(null);
  };

  const handleDiaryCollectionChange = (val) => {
    setDiaryCollection(val);
    if (error) setError(null);
  };

  const formatDate = (inputDate) => {
    if (!inputDate) return '';
    const dateObj = new Date(inputDate);
    if (isNaN(dateObj)) return inputDate;
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSearch = async () => {
    if (!diaryNumber) {
      setError('Please enter Diary Number to search.');
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/consumer-details?diaryNumber=${diaryNumber}&diarycollection=${diaryCollection}`
      );
      const data = response.data || {};

      setConsumerName(data.name || '');
      setAmount(data.amount?.toString() || '');
      setInstallment(data.installment?.toString() || '');
      setDate(data.createdAt || '');
      setError(null);

      await getTotalDiaryCollection();
    } catch (err) {
      console.error('Error fetching consumer details:', err);
      setError('Error fetching consumer details.');
      setConsumerName('');
      setAmount('');
      setInstallment('');
      setDate('');
      setTotalDiaryCollection('');
      setLastPaymentDate('');
      setDivisionResult('');
    }
  };

  const getTotalDiaryCollection = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/getTotalDiaryCollection?diaryNumber=${diaryNumber}`
      );
      const total = response?.data;

      if (total && typeof total.total === 'number') {
        setTotalDiaryCollection(total.total.toString());
        setLastPaymentDate(total.lastPaymentDate || '');
        setError(null);
      } else {
        setTotalDiaryCollection('');
        setLastPaymentDate('');
        setError('No diary collection data found.');
      }
    } catch (err) {
      console.error('Error fetching total diary collection:', err);
      setError('Error fetching total diary collection');
      setTotalDiaryCollection('');
      setLastPaymentDate('');
    }
  };

  useEffect(() => {
    if (
      totalDiaryCollection &&
      installment &&
      parseInt(installment, 10) !== 0 &&
      !isNaN(parseInt(totalDiaryCollection, 10))
    ) {
      const result = parseInt(totalDiaryCollection, 10) / parseInt(installment, 10);
      setDivisionResult(result.toString());
    } else {
      setDivisionResult('');
    }
  }, [totalDiaryCollection, installment]);

  const handleMultiply = () => {
    if (installment && days) {
      const multResult = parseInt(installment, 10) * parseInt(days, 10);
      if (!isNaN(multResult)) {
        setDiaryCollection(multResult.toString());
      }
    }
  };

  const handleCalculate = () => {
    handleMultiply();
  };

  const handleSubmit = async () => {
    if (!diaryNumber || !diaryCollection) {
      setError('Diary Number and Total Amount are compulsory.');
      return;
    }
    const diaryObj = { diaryNumber, diarycollection: diaryCollection };
    try {
      await axios.post(`${API_URL}/api/diary-amount`, diaryObj);
      Alert.alert('Success', 'Amount Added');
      resetForm();
    } catch (err) {
      console.error(err);
      setError('Error submitting diary amount');
    }
  };

  const resetForm = () => {
    setDiaryNumber('');
    setDiaryCollection('');
    setConsumerName('');
    setAmount('');
    setDate('');
    setInstallment('');
    setDays('');
    setTotalDiaryCollection('');
    setDivisionResult('');
    setLastPaymentDate('');
    setError(null);
    diaryNumberInputRef.current?.focus();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Consumer Diary</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Enter Diary Number</Text>
        <View style={styles.row}>
          <TextInput
            ref={diaryNumberInputRef}
            style={styles.input}
            value={diaryNumber}
            onChangeText={handleDiaryNumberChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            keyboardType="default"
            placeholder="Diary Number"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Consumer Information</Text>

        {consumerName ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Consumer Name:</Text>
            <Text style={styles.infoValue}>{consumerName}</Text>
          </View>
        ) : null}

        {amount ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Consumer Amount:</Text>
            <Text style={styles.infoValue}>{amount}</Text>
          </View>
        ) : null}

        {installment ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Installment:</Text>
            <Text style={styles.infoValue}>{installment}</Text>
          </View>
        ) : null}

        {date ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Consumer Date:</Text>
            <Text style={styles.infoValue}>{formatDate(date)}</Text>
          </View>
        ) : null}

        {totalDiaryCollection ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Diary Collection:</Text>
            <Text style={styles.infoValue}>{totalDiaryCollection}</Text>
          </View>
        ) : null}

        {divisionResult ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Payment Days:</Text>
            <Text style={styles.infoValue}>{divisionResult}</Text>
          </View>
        ) : null}

        {lastPaymentDate ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Payment Date:</Text>
            <Text style={styles.infoValue}>{formatDate(lastPaymentDate)}</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.infoRow}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Enter Installment</Text>
        <TextInput
          style={styles.input}
          value={installment}
          onChangeText={handleInstallmentChange}
          keyboardType="numeric"
          placeholder="Installment"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Enter Days</Text>
        <TextInput
          style={styles.input}
          value={days}
          onChangeText={handleDaysChange}
          keyboardType="numeric"
          placeholder="Days"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Total Amount</Text>
        <TextInput
          style={styles.input}
          value={diaryCollection}
          onChangeText={handleDiaryCollectionChange}
          keyboardType="numeric"
          placeholder="Total Amount"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCalculate} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={handleSubmit} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f6f8',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#222',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    color: '#222',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: '600',
    width: 160,
    color: '#555',
  },
  infoValue: {
    fontWeight: '400',
    color: '#111',
  },
  errorText: {
    color: 'red',
    fontWeight: '700',
  },
});

export default ConsumerDiary;


