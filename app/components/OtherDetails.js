import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DailyReport() {
  const Button = ({ href, gradientColors, iconName, children }) => {
    if (Platform.OS === 'web') {
      return (
        <Link href={href} style={{ width: '100%' }}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Icon name={iconName} size={28} color="#fff" />
            <Text style={styles.buttonText}>{children}</Text>
          </LinearGradient>
        </Link>
      );
    } else {
      return (
        <Link href={href} asChild>
          <Pressable
            style={({ pressed }) => [
              { width: '100%' },
              pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
            ]}
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Icon name={iconName} size={28} color="#fff" />
              <Text style={styles.buttonText}>{children}</Text>
            </LinearGradient>
          </Pressable>
        </Link>
      );
    }
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#ffffff']}
      style={styles.outerContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.buttonWrapper}>
          <Button
            href="components/daily-report"
            gradientColors={['#e74c3c', '#c0392b']}
            iconName="document-text-outline"
          >
            Daily Report
          </Button>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            href="components/delete-installment"
            gradientColors={['#f39c12', '#e67e22']}
            iconName="trash-outline"
          >
            Delete Installment
          </Button>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            href="components/searchDiaryNumber"
            gradientColors={['#3498db', '#2980b9']}
            iconName="search-outline"
          >
            Search Diary Number
          </Button>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            href="components/ConsumerPayment"
            gradientColors={['#2ecc71', '#27ae60']}
            iconName="card-outline"
          >
            Consumer Payments Detail
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#34495e',
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    marginVertical: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 14,
  },
});
