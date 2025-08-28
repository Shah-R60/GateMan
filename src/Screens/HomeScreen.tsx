import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  Header,
  SearchBar,
  BottomNavigation,
  ServiceTypeSelector,
  WorkspaceList,
} from '../components';
import { LocationSearchScreen } from './LocationSearchScreen';
import { DeskScreen } from './DeskScreen';
import { MeetingRoomScreen } from './MeetingRoomScreen';
import { WorkspaceSearchScreen } from './WorkspaceSearchScreen';
import { WorkspaceDetailsScreen } from './WorkspaceDetailsScreen';
import { BookingScreen } from './BookingScreen';
import { BookingDetailScreen } from './BookingDetailScreen';
import { ProfileScreen } from './ProfileScreen';
import { apiService } from '../services/apiService';
import { Colors } from '../constants/theme';
import { Location, Workspace, ServiceType, TabNavigationType, Property } from '../types';
import { useCity } from '../context/CityContext';
import {
  mockServiceTypes,
  mockWorkspaces,
} from '../data/mockData';

export const HomeScreen: React.FC = () => {
  // City context
  const { state: cityState, setLocation } = useCity();
  const { selectedLocation } = cityState;

  // State management
  const [selectedSubLocation, setSelectedSubLocation] = useState('All Locations');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabNavigationType>('Home');
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showWorkspaceSearch, setShowWorkspaceSearch] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [bookingWorkspace, setBookingWorkspace] = useState<Workspace | null>(null);
  const [bookingPropertyId, setBookingPropertyId] = useState<string | null>(null);
  const [showDeskScreen, setShowDeskScreen] = useState(false);
  const [showMeetingRoomScreen, setShowMeetingRoomScreen] = useState(false);
  const [showProfileScreen, setShowProfileScreen] = useState(false);
  const [showBookingDetailScreen, setShowBookingDetailScreen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [loading, setLoading] = useState(false);

  // Function to convert Property to Workspace format
  const convertPropertyToWorkspace = (property: Property): Workspace => {
    return {
      id: property._id,
      name: property.name,
      location: `${property.address}, ${property.city}`,
      distance: '1.2 km', // This could be calculated based on user location
      hours: property.isSaturdayOpened && property.isSundayOpened 
        ? '24/7' 
        : property.isSaturdayOpened 
          ? 'Mon-Sat 9:00 AM - 6:00 PM' 
          : 'Mon-Fri 9:00 AM - 6:00 PM',
      price: property.totalCostPerSeat,
      currency: '₹',
      period: 'seat/day',
      imageUrl: property.propertyImages?.[0] || 'https://via.placeholder.com/300x200',
      images: property.propertyImages && property.propertyImages.length > 0 
        ? property.propertyImages 
        : ['https://via.placeholder.com/300x200'],
      amenities: property.amenities,
      rating: 4.5, // Default rating since it's not in the API response
    };
  };

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        console.log(selectedLocation.city);
        const response = await apiService.getPropertiesByCity(selectedLocation.city, 1, 10);
        if (response.success && response.allProperties) {
          console.log('hii')
          console.log('Fetched properties:', response.allProperties);
          const convertedWorkspaces = response.allProperties.map(convertPropertyToWorkspace);
          setWorkspaces(convertedWorkspaces);
        } else {
          // No properties found for this city
          setWorkspaces([]);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        // Set empty array instead of using mock data
        setWorkspaces([]);
        Alert.alert('Notice', 'Unable to load workspaces. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [selectedLocation.city]); // Re-fetch when city changes

  // Event handlers
  const handleLocationPress = () => {
    setShowLocationSearch(true);
  };

  const handleProfilePress = () => {
    setShowProfileScreen(true);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    // In a real app, this would trigger API search or filter local data
  };

  const handleSearchPress = () => {
    setShowWorkspaceSearch(true);
  };

  const handleWorkspaceSelect = (workspace: Workspace) => {
    console.log('Selected workspace from home:', workspace);
    // Handle workspace selection - could navigate to workspace details
    setShowWorkspaceSearch(false);
  };

  const handleServicePress = (service: ServiceType) => {
    if (service.name === 'Desk') {
      setActiveTab('Desks');
      setShowDeskScreen(true);
      setShowMeetingRoomScreen(false);
    } else if (service.name === 'Meeting Room') {
      setActiveTab('Meeting Rooms');
      setShowMeetingRoomScreen(true);
      setShowDeskScreen(false);
    } else {
      Alert.alert(
        'Service Selected',
        `You selected ${service.name}. This would navigate to the ${service.name.toLowerCase()} listing screen.`
      );
    }
  };

  const handleWorkspacePress = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
  };

  const handleBookPress = (workspace: Workspace) => {
    setBookingPropertyId(workspace.id);
  };

  const handleFavoritePress = (workspace: Workspace) => {
    Alert.alert('Favorite', `${workspace.name} added to favorites`);
  };

  const handleSharePress = async (workspace: Workspace) => {
    try {
      const shareMessage = `Hey, I found this amazing Coworking desk that can be booked for a day. No monthly commitment required!\n\n${workspace.name}\n${workspace.location}\nPrice: ${workspace.currency}${workspace.price}${workspace.period}\n\nCheck it out and book your workspace today!`;
      
      const result = await Share.share({
        message: shareMessage,
        title: `Check out ${workspace.name}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared via specific activity
          console.log('Shared via:', result.activityType);
        } else {
          // Shared
          console.log('Workspace shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share workspace');
      console.error('Share error:', error);
    }
  };

  const handleViewAllPress = () => {
    Alert.alert('View All', 'This would navigate to the full workspace listing');
  };

  const handleTabPress = (tab: TabNavigationType) => {
    setActiveTab(tab);
    if (tab === 'Desks') {
      setShowDeskScreen(true);
      setShowMeetingRoomScreen(false);
      setShowBookingDetailScreen(false);
    } else if (tab === 'Meeting Rooms') {
      setShowMeetingRoomScreen(true);
      setShowDeskScreen(false);
      setShowBookingDetailScreen(false);
    } else if (tab === 'Bookings') {
      setShowBookingDetailScreen(true);
      setShowDeskScreen(false);
      setShowMeetingRoomScreen(false);
    } else if (tab === 'Home') {
      setShowDeskScreen(false);
      setShowMeetingRoomScreen(false);
      setShowBookingDetailScreen(false);
    } else {
      Alert.alert('Navigation', `Navigate to ${tab} screen`);
    }
  };

  const handleLocationSelect = (location: Location) => {
    // Check if this is a city change or sub-location change
    if (location.city !== selectedLocation.city) {
      // City has changed - update the main location and reset sub-location
      setLocation({
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
  const filteredWorkspaces = workspaces.filter(workspace =>
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

  // Show workspace search screen if state is true
  if (showWorkspaceSearch) {
    return (
      <WorkspaceSearchScreen
        currentCity={selectedLocation.city}
        onWorkspaceSelect={handleWorkspaceSelect}
        onBack={() => setShowWorkspaceSearch(false)}
        onWorkspacePress={handleWorkspacePress}
      />
    );
  }

  // Show workspace details screen if workspace is selected
  if (selectedWorkspace) {
    return (
      <WorkspaceDetailsScreen
        workspace={selectedWorkspace}
        propertyId={selectedWorkspace.id}
        onBack={() => setSelectedWorkspace(null)}
        onBookNow={(propertyId) => {
          setSelectedWorkspace(null);
          setBookingPropertyId(propertyId);
        }}
      />
    );
  }

  // Show booking screen if booking property is selected
  if (bookingPropertyId) {
    return (
      <BookingScreen
        propertyId={bookingPropertyId}
        onBack={() => setBookingPropertyId(null)}
      />
    );
  }

  // Show profile screen if profile is selected
  if (showProfileScreen) {
    return (
      <ProfileScreen
        onBack={() => setShowProfileScreen(false)}
      />
    );
  }

  // Show desk screen if Desks tab is active or showDeskScreen is true
  if (activeTab === 'Desks' || showDeskScreen) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={Colors.white} />
        
        <DeskScreen
          selectedSubLocation={selectedSubLocation}
          onBack={() => {
            setActiveTab('Home');
            setShowDeskScreen(false);
          }}
          onWorkspacePress={handleWorkspacePress}
          onBookPress={handleBookPress}
        />

        <BottomNavigation
          activeTab="Desks"
          onTabPress={handleTabPress}
        />
      </View>
    );
  }

  // Show meeting room screen if Meeting Rooms tab is active or showMeetingRoomScreen is true
  if (activeTab === 'Meeting Rooms' || showMeetingRoomScreen) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={Colors.white} />
        
        <MeetingRoomScreen
          selectedSubLocation={selectedSubLocation}
          onBack={() => {
            setActiveTab('Home');
            setShowMeetingRoomScreen(false);
          }}
          onWorkspacePress={handleWorkspacePress}
        />

        <BottomNavigation
          activeTab="Meeting Rooms"
          onTabPress={handleTabPress}
        />
      </View>
    );
  }

  // Show booking detail screen if Bookings tab is active or showBookingDetailScreen is true
  if (activeTab === 'Bookings' || showBookingDetailScreen) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={Colors.white} />
        
        <BookingDetailScreen
          onBack={() => {
            setActiveTab('Home');
            setShowBookingDetailScreen(false);
          }}
          onNavigateToWorkspaceSearch={() => {
            setActiveTab('Home');
            setShowBookingDetailScreen(false);
            setShowWorkspaceSearch(true);
          }}
        />

        <BottomNavigation
          activeTab="Bookings"
          onTabPress={handleTabPress}
        />
      </View>
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
          onSearchPress={handleSearchPress}
          onPress={handleSearchPress}
          editable={false}
        />

        <ServiceTypeSelector
          serviceTypes={mockServiceTypes}
          onServicePress={handleServicePress}
        />

        {filteredWorkspaces.length > 0 ? (
          <WorkspaceList
            workspaces={filteredWorkspaces}
            selectedLocation={selectedSubLocation === 'All Locations' ? selectedLocation.city : selectedSubLocation}
            onWorkspacePress={handleWorkspacePress}
            onBookPress={handleBookPress}
            onFavoritePress={handleFavoritePress}
            onSharePress={handleSharePress}
            onViewAllPress={handleViewAllPress}
          />
        ) : !loading && (
          <View style={styles.emptyStateContainer}>
            <Ionicons 
              name="business-outline" 
              size={60} 
              color={Colors.text.light} 
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateTitle}>
              No WorkSpace in this Area
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              We are working on to bring WorkSpace here
            </Text>
          </View>
        )}
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
    minHeight: 300,
  },
  emptyStateIcon: {
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
