import React, { useState, useEffect } from 'react';
import {
  FlatList,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';

const { API_URL } = Constants.expoConfig.extra;

const ConsumerPayment = () => {
  const [consumerPayments, setConsumerPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [installment, setInstallment] = useState('');
  const [days, setDays] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/payment`);
      const data = await response.json();
      setConsumerPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching payment data');
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setError('Please enter a diary number');
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/consumer-name?diaryNumber=${searchTerm}`
      );
      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.error || 'Consumer not found');
      }

      setName(data.name);
      setAmount(data.amount);
      setInstallment(data.installment);
      setDays(data.days);

      const filtered = consumerPayments.filter(
        (payment) =>
          payment.diaryNumber?.toString() === searchTerm.toString()
      );

      setFilteredPayments(filtered);
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Consumer not found');
      setName('');
      setAmount('');
      setInstallment('');
      setDays('');
      setFilteredPayments([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Consumer Payments Statement</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search by Diary Number"
          value={searchTerm}
          onChangeText={setSearchTerm}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {name ? (
        <View style={styles.successBox}>
          <Text>
            Diary Number: {searchTerm} | Name: {name}
          </Text>
          <Text>
            Days: {days} | Amount: ₹{amount} | Installment: ₹{installment}
          </Text>
        </View>
      ) : null}

      {error && (
        <View style={styles.errorBox}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredPayments}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>S/N</Text>
            <Text style={styles.listHeaderText}>Amount</Text>
            <Text style={styles.listHeaderText}>Payment Date</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <View style={styles.listRow}>
            <Text style={styles.listCell}>{index + 1}</Text>
            <Text style={styles.listCell}>₹{item.diarycollection}</Text>
            <Text style={styles.listCell}>{formatDate(item.createdAt)}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 10 }}>
            No payment records found for this diary number.
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successBox: {
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  listHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#333',
    paddingVertical: 8,
    backgroundColor: '#e6e6e6',
  },
  listHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  listCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ConsumerPayment;
