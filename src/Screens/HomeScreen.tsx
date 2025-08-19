import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Header,
  SearchBar,
  BottomNavigation,
  WelcomeOffers,
  ServiceTypeSelector,
  WorkspaceList,
} from '../components';
import { LocationSearchScreen } from './LocationSearchScreen';
import { Colors } from '../constants/theme';
import { Location, Workspace, ServiceType, TabNavigationType } from '../types';
import {
  mockLocations,
  mockOffers,
  mockServiceTypes,
  mockWorkspaces,
} from '../data/mockData';

export const HomeScreen: React.FC = () => {
  // State management
  const [selectedLocation, setSelectedLocation] = useState<Location>(
    mockLocations.find(loc => loc.name === 'Ahmedabad') || mockLocations[0]
  );
  const [selectedSubLocation, setSelectedSubLocation] = useState('All Locations');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabNavigationType>('Home');
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  // Event handlers
  const handleLocationPress = () => {
    setShowLocationSearch(true);
  };

  const handleProfilePress = () => {
    Alert.alert('Profile', 'Profile screen would open here');
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    // In a real app, this would trigger API search or filter local data
  };

  const handleOfferPress = (offer: any) => {
    Alert.alert(
      'Offer Details',
      `${offer.title}: ${offer.discount} ${offer.description}\nCode: ${offer.code}`,
      [{ text: 'Copy Code', onPress: () => console.log('Code copied') }]
    );
  };

  const handleServicePress = (service: ServiceType) => {
    Alert.alert(
      'Service Selected',
      `You selected ${service.name}. This would navigate to the ${service.name.toLowerCase()} listing screen.`
    );
  };

  const handleWorkspacePress = (workspace: Workspace) => {
    Alert.alert(
      'Workspace Details',
      `${workspace.name} - ${workspace.location}\nPrice: ${workspace.currency}${workspace.price}${workspace.period}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => console.log('View details') },
      ]
    );
  };

  const handleBookPress = (workspace: Workspace) => {
    Alert.alert(
      'Book Workspace',
      `Book a desk at ${workspace.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => console.log('Booking initiated') },
      ]
    );
  };

  const handleFavoritePress = (workspace: Workspace) => {
    Alert.alert('Favorite', `${workspace.name} added to favorites`);
  };

  const handleViewAllPress = () => {
    Alert.alert('View All', 'This would navigate to the full workspace listing');
  };

  const handleTabPress = (tab: TabNavigationType) => {
    setActiveTab(tab);
    if (tab !== 'Home') {
      Alert.alert('Navigation', `Navigate to ${tab} screen`);
    }
  };

  const handleLocationSelect = (location: Location) => {
    // Check if this is a city change or sub-location change
    if (location.city !== selectedLocation.city) {
      // City has changed - update the main location and reset sub-location
      setSelectedLocation({
        id: location.id,
        name: location.city,
        city: location.city,
      });
      setSelectedSubLocation('All Locations');
    } else {
      // Only sub-location changed
      setSelectedSubLocation(location.name);
    }
    
    setShowLocationSearch(false);
  };

  const handleLocationSearchBack = () => {
    setShowLocationSearch(false);
  };

  // Filter workspaces based on search query (simple implementation)
  const filteredWorkspaces = mockWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show location search screen if state is true
  if (showLocationSearch) {
    return (
      <LocationSearchScreen
        currentLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
        onBack={handleLocationSearchBack}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.white} />
      
      <Header
        selectedLocation={selectedLocation}
        selectedSubLocation={selectedSubLocation}
        onLocationPress={handleLocationPress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SearchBar
          placeholder={`Try: Oyo Workflo - ${selectedLocation.name} Building`}
          value={searchQuery}
          onChangeText={handleSearchChange}
        />

        <WelcomeOffers
          offers={mockOffers}
          onOfferPress={handleOfferPress}
        />

        <ServiceTypeSelector
          serviceTypes={mockServiceTypes}
          onServicePress={handleServicePress}
        />

        <WorkspaceList
          workspaces={filteredWorkspaces}
          selectedLocation={selectedSubLocation === 'All Locations' ? selectedLocation.city : selectedSubLocation}
          onWorkspacePress={handleWorkspacePress}
          onBookPress={handleBookPress}
          onFavoritePress={handleFavoritePress}
          onViewAllPress={handleViewAllPress}
        />
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
