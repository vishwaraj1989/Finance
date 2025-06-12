
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Platform, TouchableOpacity, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';

const { API_URL } = Constants.expoConfig.extra;

export default function DateReport() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    const formattedDate = selectedDate.toISOString().split('T')[0];

    try {
      const response = await axios.get(`${API_URL}/api/daily-report?date=${formattedDate}`);
      setReport(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the report.');
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const calculateTotal = () => {
    return report.reduce((sum, item) => sum + (parseInt(item.diarycollection) || 0), 0);
  };

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
      fetchReport();
    }
    setShowPicker(false);
  };

  const generateHTML = () => {
    const rows = report.map(
      item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.diaryNumber}</td>
          <td>${item.diarycollection}</td>
        </tr>`
    ).join('');

    return `
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
          }
          h2 {
            text-align: center;
            margin: 5px 0;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
            word-wrap: break-word;
          }
          th {
            background-color: #ddd;
            font-weight: bold;
          }
          tfoot td {
            font-weight: bold;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <h2>Daily Report</h2>
        <h2>${selectedDate.toISOString().split('T')[0]}</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Diary No</th>
              <th>Collection</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align:right;">Total:</td>
              <td>${calculateTotal()}</td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `;
  };

  const generatePDF = async () => {
    const html = generateHTML();
    try {
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false
      });
      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert('Error', 'Error generating PDF: ' + err.message);
    }
  };

  const handlePrint = async () => {
    const html = generateHTML();
    try {
      await Print.printAsync({
        html
      });
    } catch (err) {
      Alert.alert('Error', 'Error printing: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date for Report</Text>

      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => {
            const pickedDate = new Date(e.target.value);
            setSelectedDate(pickedDate);
            fetchReport();
          }}
          style={styles.webDateInput}
        />
      ) : (
        <>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.datePickerText}>Pick Date: {selectedDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showPicker}
            mode="date"
            date={selectedDate}
            onConfirm={handleDateChange}
            onCancel={() => setShowPicker(false)}
            maximumDate={new Date()}
          />
        </>
      )}

      {/* Buttons above report (fetch & generate PDF) */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.button, styles.fetchButton]} onPress={fetchReport} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Fetching...' : 'Fetch Report'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.pdfButton]} onPress={generatePDF} disabled={loading || report.length === 0}>
          <Text style={styles.buttonText}>Generate PDF</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />}

      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      {!loading && !error && (
        <>
          <Text style={styles.subtitle}>Report for {selectedDate.toISOString().split('T')[0]}</Text>

          {report.length > 0 ? (
            <>
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Diary No</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Collection</Text>
              </View>

              <FlatList
                data={report}
                keyExtractor={(item, index) => item._id || index.toString()}
                ListFooterComponent={
                  <View style={styles.totalRow}>
                    <Text style={{ flex: 2, fontWeight: 'bold', textAlign: 'right', fontSize: 16 }}>Total:</Text>
                    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16 }}>{calculateTotal()}</Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <View style={styles.row}>
                    <Text style={{ flex: 2, fontSize: 14, color: '#333' }}>{item.name}</Text>
                    <Text style={{ flex: 1, fontSize: 14, color: '#555' }}>{item.diaryNumber}</Text>
                    <Text style={{ flex: 1, fontSize: 14, color: '#555' }}>{item.diarycollection}</Text>
                  </View>
                )}
              />
            </>
          ) : (
            <Text style={styles.noDataText}>No report data available for this date.</Text>
          )}

          {/* Print button moved here, after report */}
          <View style={[styles.buttonGroup, { marginTop: 20 }]}>
            <TouchableOpacity style={[styles.button, styles.printButton]} onPress={handlePrint} disabled={loading || report.length === 0}>
              <Text style={styles.buttonText}>Print Report</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 16,
    color: '#334155',
    textAlign: 'center',
  },
  errorText: {
    color: '#dc2626',
    marginVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  headerRow: {
    backgroundColor: '#e0e7ff',
    borderBottomWidth: 2,
    borderColor: '#6366f1',
    shadowOpacity: 0,
    marginTop: 8,
  },
  headerCell: {
    fontWeight: '700',
    fontSize: 16,
    color: '#4338ca',
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderTopWidth: 2,
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
    borderRadius: 6,
    marginVertical: 10,
  },
  buttonGroup: {
    marginVertical: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  fetchButton: {
    backgroundColor: '#2563eb',
  },
  pdfButton: {
    backgroundColor: '#16a34a',
  },
  printButton: {
    backgroundColor: '#7c3aed',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  datePickerButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
  datePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  webDateInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 6,
    color: '#1e293b',
    marginBottom: 20,
    width: 180,
    alignSelf: 'center',
  },
});
