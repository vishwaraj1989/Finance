import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Logout() {
  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Remove token from AsyncStorage (or wherever you store it)
        await AsyncStorage.removeItem('token');

        // Optionally clear other user info too
        // await AsyncStorage.removeItem('user');

        // Redirect to login screen after logout
        router.replace('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    logoutUser();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4b6cb7" />
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#182848',
  },
  text: {
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
  },
});
