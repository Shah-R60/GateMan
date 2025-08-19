import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as LocationService from 'expo-location';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { Location } from '../types';

interface CitySearchScreenProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
  onClose: () => void;
}

const cities = [
  { id: '1', name: 'Ahmedabad', icon: 'business' },
  { id: '2', name: 'Bangalore', icon: 'business' },
  { id: '3', name: 'Chennai', icon: 'business' },
  { id: '4', name: 'Delhi', icon: 'business' },
  { id: '5', name: 'Gurgaon', icon: 'business' },
  { id: '6', name: 'Hyderabad', icon: 'business' },
  { id: '7', name: 'Mumbai', icon: 'business' },
  { id: '8', name: 'Noida', icon: 'business' },
  { id: '9', name: 'Pune', icon: 'business' },
];

export const CitySearchScreen: React.FC<CitySearchScreenProps> = ({
  selectedCity,
  onCitySelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedCity, setTempSelectedCity] = useState(selectedCity);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCityPress = (cityName: string) => {
    setTempSelectedCity(cityName);
  };

  const handleSelectCity = () => {
    onCitySelect(tempSelectedCity);
    onClose();
  };

  const handleAutoDetect = async () => {
    setIsDetectingLocation(true);
    
    try {
      // Check if location services are enabled
      const servicesEnabled = await LocationService.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to use this feature.',
          [{ text: 'OK' }]
        );
        setIsDetectingLocation(false);
        return;
      }

      // Request location permission
      const { status } = await LocationService.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        // Permission granted, get current location
        try {
          const location = await LocationService.getCurrentPositionAsync({
            accuracy: LocationService.Accuracy.Balanced,
          });
          
          // Reverse geocode to get city name
          const reverseGeocode = await LocationService.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          
          if (reverseGeocode.length > 0) {
            const address = reverseGeocode[0];
            const detectedCity = address.city || address.district || address.region;
            
            if (detectedCity) {
              // Check if the detected city is in our list
              const cityMatch = cities.find(city => 
                city.name.toLowerCase() === detectedCity.toLowerCase()
              );
              
              if (cityMatch) {
                setTempSelectedCity(cityMatch.name);
                Alert.alert(
                  'Location Detected',
                  `Your current location is detected as ${cityMatch.name}`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'City Not Available',
                  `Your current location (${detectedCity}) is not available in our service area. Please select a city manually.`,
                  [{ text: 'OK' }]
                );
              }
            } else {
              Alert.alert(
                'Location Detection Failed',
                'Unable to determine your city. Please select a city manually.',
                [{ text: 'OK' }]
              );
            }
          }
        } catch (locationError) {
          console.error('Location error:', locationError);
          Alert.alert(
            'Location Error',
            'Unable to get your current location. Please try again or select a city manually.',
            [{ text: 'OK' }]
          );
        }
      } else if (status === 'denied') {
        // Permission denied, show the custom permission dialog
        Alert.alert(
          'Allow myHQ to access this device\'s approximate location?',
          '',
          [
            {
              text: 'Don\'t allow',
              style: 'cancel',
            },
            {
              text: 'Only this time',
              onPress: () => {
                // Request permission again
                handleAutoDetect();
              },
            },
            {
              text: 'While using the app',
              onPress: () => {
                // Request permission again
                handleAutoDetect();
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert(
        'Error',
        'Unable to access location services. Please select a city manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsDetectingLocation(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select City</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Auto-detect Location Button */}
      <TouchableOpacity 
        style={[styles.autoDetectButton, isDetectingLocation && styles.autoDetectButtonDisabled]} 
        onPress={handleAutoDetect}
        disabled={isDetectingLocation}
      >
        {isDetectingLocation ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.autoDetectText}>Detecting Location...</Text>
          </View>
        ) : (
          <Text style={styles.autoDetectText}>Current Location</Text>
        )}
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search city"
            placeholderTextColor={Colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />
        </View>
      </View>

      {/* All Cities Section */}
      <View style={styles.citiesSection}>
        <Text style={styles.sectionTitle}>All cities</Text>
        
        <ScrollView style={styles.citiesList} showsVerticalScrollIndicator={false}>
          {filteredCities.map((city) => (
            <TouchableOpacity
              key={city.id}
              style={[
                styles.cityItem,
                tempSelectedCity === city.name && styles.selectedCityItem,
              ]}
              onPress={() => handleCityPress(city.name)}
              activeOpacity={0.7}
            >
              <View style={styles.cityContent}>
                <Ionicons
                  name={city.icon as any}
                  size={24}
                  color={Colors.text.secondary}
                  style={styles.cityIcon}
                />
                <Text
                  style={[
                    styles.cityText,
                    tempSelectedCity === city.name && styles.selectedCityText,
                  ]}
                >
                  {city.name}
                </Text>
              </View>
              {tempSelectedCity === city.name && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Select City Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.selectButton,
            !tempSelectedCity && styles.selectButtonDisabled,
          ]}
          onPress={handleSelectCity}
          disabled={!tempSelectedCity}
          activeOpacity={0.8}
        >
          <Text style={styles.selectButtonText}>Select City</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  autoDetectButton: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  autoDetectText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.primary,
  },
  autoDetectButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  citiesSection: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  citiesList: {
    flex: 1,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  selectedCityItem: {
    backgroundColor: Colors.primary + '10',
  },
  cityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cityIcon: {
    marginRight: Spacing.md,
  },
  cityText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
  },
  selectedCityText: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  selectButtonDisabled: {
    backgroundColor: Colors.gray[300],
  },
  selectButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
});
