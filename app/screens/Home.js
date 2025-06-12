
// import React from 'react';
// import {
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Text,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { router } from 'expo-router';

// export default function ConsumerNavbar() {
//   const iconMenu = [
//     { name: 'bank', label: 'Other', route: 'components/OtherDetails', color: '#FF6347' },          // tomato red
//     { name: 'user-plus', label: 'New Registration', route: 'components/NewConRegister', color: '#1E90FF' }, // dodger blue
//     { name: 'book', label: 'Diary', route: 'components/ConsumerDiary', color: '#32CD32' },          // lime green
//     { name: 'users', label: 'Consumers', route: 'components/ConsumerDetails', color: '#FFD700' },   // gold
//     { name: 'sign-out', label: 'Logout', route: 'logout', color: '#8B0000' },                       // dark red
//   ];

//   const handleNavigation = (route) => {
//     router.push(`/${route}`);
//   };

//   return (
//     <View style={styles.navContainer}>
//       {iconMenu.map((item, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.iconButton}
//           activeOpacity={0.7}
//           onPress={() => handleNavigation(item.route)}
//         >
//           <View style={styles.iconCircle}>
//             <Icon name={item.name} size={22} color="#fff" />
//           </View>
//           <Text style={[styles.label, { color: item.color }]}>{item.label}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   navContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#182848', // solid background since linear-gradient not supported here
//     paddingVertical: 14,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//   },
//   iconButton: {
//     alignItems: 'center',
//   },
//   iconCircle: {
//     backgroundColor: '#4b6cb7',
//     padding: 10,
//     borderRadius: 30,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     marginBottom: 4,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
// });


// import React from 'react';
// import {
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Text,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { router } from 'expo-router';

// export default function ConsumerNavbar() {
//   const iconMenu = [
//     { name: 'bank', label: 'Other', route: 'components/OtherDetails', color: '#FF6347' },          // tomato red
//     { name: 'user-plus', label: 'New Registration', route: 'components/NewConRegister', color: '#1E90FF' }, // dodger blue
//     { name: 'book', label: 'Diary', route: 'components/ConsumerDiary', color: '#32CD32' },          // lime green
//     { name: 'users', label: 'Consumers', route: 'components/ConsumerDetails', color: '#FFD700' },   // gold
//     { name: 'sign-out', label: 'Logout', route: 'logout', color: '#8B0000' },                       // dark red
//   ];

//   const handleNavigation = (route) => {
//     router.push(`/${route}`);
//   };

//   return (
//     <View style={styles.navContainer}>
//       {iconMenu.map((item, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.iconButton}
//           activeOpacity={0.7}
//           onPress={() => handleNavigation(item.route)}
//         >
//           <View style={styles.iconCircle}>
//             <Icon name={item.name} size={22} color="#fff" />
//           </View>
//           <Text style={[styles.label, { color: item.color }]}>{item.label}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   navContainer: {
//     flexDirection: 'column',  // Changed from 'row' to 'column' for vertical layout
//     justifyContent: 'flex-start',  // Align items from top
//     backgroundColor: '#182848',
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//   },
//   iconButton: {
//     alignItems: 'center',
//     marginVertical: 10,  // Vertical spacing between icons
//   },
//   iconCircle: {
//     backgroundColor: '#4b6cb7',
//     padding: 10,
//     borderRadius: 30,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     marginBottom: 6,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
// });


import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ConsumerNavbar() {
  // Increase icon size for larger screens (width > 600)
  const iconSize = width > 600 ? 48 : 32;
  const paddingSize = width > 600 ? 20 : 12;
  const labelFontSize = width > 600 ? 18 : 14;

  const iconMenu = [
    { name: 'bank', label: 'Other', route: 'components/OtherDetails', color: '#FF6347' },          // tomato red
    { name: 'user-plus', label: 'New Registration', route: 'components/NewConRegister', color: '#1E90FF' }, // dodger blue
    { name: 'book', label: 'Diary', route: 'components/ConsumerDiary', color: '#32CD32' },          // lime green
    { name: 'users', label: 'Consumers', route: 'components/ConsumerDetails', color: '#FFD700' },   // gold
    { name: 'sign-out', label: 'Logout', route: 'screens/logout', color: '#8B0000' },                       // dark red
  ];

  const handleNavigation = (route) => {
    router.push(`/${route}`);
  };

  return (
    <View style={styles.navContainer}>
      {iconMenu.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.iconButton, { marginVertical: width > 600 ? 20 : 12 }]}
          activeOpacity={0.7}
          onPress={() => handleNavigation(item.route)}
        >
          <View style={[styles.iconCircle, { padding: paddingSize }]}>
            <Icon name={item.name} size={iconSize} color="#fff" />
          </View>
          <Text style={[styles.label, { color: item.color, fontSize: labelFontSize }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#1c2746',
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderRadius: 20,
    width: 200,
    alignSelf: 'center',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#4b6cb7',
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    marginBottom: 8,
  },
  label: {
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
