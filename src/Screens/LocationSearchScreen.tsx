import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { Location } from '../types';
import { CitySearchScreen } from './CitySearchScreen';

interface LocationSearchScreenProps {
  currentLocation: Location;
  onLocationSelect: (location: Location) => void;
  onBack: () => void;
}

const popularLocations = [
  'All Locations',
  'Ellisbridge',
  'Sarkhej - Gandhinagar Highway',
  'Bodakdev',
  'Vastrapur',
  'Hebatpur',
  'Satellite',
  'Navrangpura',
];

export const LocationSearchScreen: React.FC<LocationSearchScreenProps> = ({
  currentLocation,
  onLocationSelect,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNearMe, setShowNearMe] = useState(false);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [selectedCity, setSelectedCity] = useState(currentLocation.city);

  const filteredLocations = popularLocations.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationPress = (locationName: string) => {
    // Use the currently selected city and update the sub-location
    const newLocation: Location = {
      id: locationName.toLowerCase().replace(/\s+/g, '-'),
      name: locationName === 'All Locations' ? selectedCity : locationName,
      city: selectedCity, // Use the selected city
    };
    onLocationSelect(newLocation);
    onBack();
  };

  const toggleNearMe = () => {
    setShowNearMe(!showNearMe);
  };

  const handleCityPress = () => {
    setShowCitySearch(true);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCitySearch(false);
    
    // Immediately update the location with the new city
    const newLocation: Location = {
      id: city.toLowerCase().replace(/\s+/g, '-'),
      name: city,
      city: city,
    };
    onLocationSelect(newLocation);
    onBack(); // Go back to HomeScreen after city selection
  };

  const handleCitySearchClose = () => {
    setShowCitySearch(false);
  };

  // Show city search screen if state is true
  if (showCitySearch) {
    return (
      <CitySearchScreen
        selectedCity={selectedCity}
        onCitySelect={handleCitySelect}
        onClose={handleCitySearchClose}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity style={styles.cityContainer} onPress={handleCityPress}>
          <Text style={styles.cityText}>{selectedCity}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Search locations in {selectedCity}</Text>
      </View>

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
            placeholder={`Search for locations in ${selectedCity}`}
            placeholderTextColor={Colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />
        </View>
      </View>

      {/* Show workspaces near me */}
      <TouchableOpacity style={styles.nearMeContainer} onPress={toggleNearMe}>
        <View style={styles.nearMeContent}>
          <Ionicons
            name="location"
            size={20}
            color={Colors.primary}
            style={styles.nearMeIcon}
          />
          <Text style={styles.nearMeText}>Show workspaces near me</Text>
        </View>
        <Ionicons
          name={showNearMe ? "radio-button-on" : "radio-button-off"}
          size={20}
          color={Colors.primary}
        />
      </TouchableOpacity>

      {/* Popular Locations */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.locationsContainer}>
          <Text style={styles.sectionTitle}>Popular locations in {currentLocation.city}</Text>
          <View style={styles.locationGrid}>
            {filteredLocations.map((location) => (
              <TouchableOpacity
                key={location}
                style={[
                  styles.locationChip,
                  location === currentLocation.name && styles.selectedLocationChip,
                ]}
                onPress={() => handleLocationPress(location)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={location === currentLocation.name ? Colors.primary : Colors.text.secondary}
                  style={styles.locationIcon}
                />
                <Text
                  style={[
                    styles.locationText,
                    location === currentLocation.name && styles.selectedLocationText,
                  ]}
                >
                  {location}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  backButton: {
    padding: Spacing.xs,
  },
  headerSpacer: {
    flex: 1,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginRight: Spacing.xs,
  },
  titleContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
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
  nearMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  nearMeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearMeIcon: {
    marginRight: Spacing.sm,
  },
  nearMeText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  locationsContainer: {
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  locationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  selectedLocationChip: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  locationIcon: {
    marginRight: Spacing.xs,
  },
  locationText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
  },
  selectedLocationText: {
    color: Colors.primary,
  },
});
