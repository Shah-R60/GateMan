import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { Location, Workspace } from '../types';
import { FilterModal, DatePicker } from '../components';
import { WorkspaceSearchScreen } from './WorkspaceSearchScreen';
import { RoomSlotSelectionScreen } from './RoomSlotSelectionScreen';

interface MeetingRoomScreenProps {
  selectedLocation: Location;
  selectedSubLocation: string;
  onBack: () => void;
  onWorkspacePress?: (workspace: Workspace) => void;
}

export const MeetingRoomScreen: React.FC<MeetingRoomScreenProps> = ({
  selectedLocation,
  selectedSubLocation,
  onBack,
  onWorkspacePress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('Tomorrow (21 Aug)');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showWorkspaceSearch, setShowWorkspaceSearch] = useState(false);
  const [showRoomSlotSelection, setShowRoomSlotSelection] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: 'popularity',
    spaceType: 'all',
    brands: [] as string[],
    timings: [] as string[],
    parking: false,
    metroConnectivity: false,
    priceRange: {
      min: 500,
      max: 2000,
    },
  });

  // Mock data for meeting room workspaces
  const meetingRoomWorkspaces: Workspace[] = [
    {
      id: '1',
      name: 'awfis - Executive Meeting Room',
      location: 'Thaltej, Ahmedabad',
      distance: '7.06 kms away',
      hours: '09:00 am - 06:00 pm (Tue)',
      price: 800,
      currency: '₹',
      period: '/hr',
      imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600',
      isPopular: true,
      rating: 4.34,
      seatingTypes: [
        { type: 'Meeting Room', available: true },
      ],
    },
    {
      id: '2',
      name: 'WeWork Conference Room',
      location: 'Bandra Kurla Complex, Mumbai',
      distance: '12.5 kms away',
      hours: '24/7 Access',
      price: 1200,
      currency: '₹',
      period: '/hr',
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600',
      isPopular: true,
      rating: 4.7,
      seatingTypes: [
        { type: 'Meeting Room', available: true },
      ],
    },
  ];

  const handleFiltersPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setShowFilterModal(false);
  };

  const handleMapPress = () => {
    // Open map view
    console.log('Map pressed');
  };

  const handleSearchPress = () => {
    setShowWorkspaceSearch(true);
  };

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setShowWorkspaceSearch(false);
    if (onWorkspacePress) {
      onWorkspacePress(workspace);
    }
  };

  const handleWorkspacePress = (workspace: Workspace) => {
    if (onWorkspacePress) {
      onWorkspacePress(workspace);
    }
  };

  const handleBookPress = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setShowRoomSlotSelection(true);
  };

  const handleSharePress = async (workspace: Workspace) => {
    try {
      const shareMessage = `Check out this amazing meeting room: ${workspace.name} at ${workspace.location}. Price: ${workspace.currency}${workspace.price}${workspace.period}`;
      
      const result = await Share.share({
        message: shareMessage,
        title: `Check out ${workspace.name}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared via:', result.activityType);
        } else {
          console.log('Meeting room shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share meeting room');
      console.error('Share error:', error);
    }
  };

  // Show workspace search screen if active
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

  // Show room slot selection screen if active
  if (showRoomSlotSelection && selectedWorkspace) {
    return (
      <RoomSlotSelectionScreen
        onBack={() => setShowRoomSlotSelection(false)}
        workspaceName={selectedWorkspace.name}
        selectedDate={selectedDate}
      />
    );
  }

  const handleViewMeetingRooms = () => {
    // Handle view meeting rooms action
    console.log('View meeting rooms pressed');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.locationInfo}>
            <Text style={styles.cityText}>{selectedLocation.city}</Text>
            <Text style={styles.subLocationText}>{selectedSubLocation}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchInputContainer} onPress={handleSearchPress}>
            <Ionicons
              name="search"
              size={20}
              color={Colors.text.light}
              style={styles.searchIcon}
            />
            <Text style={styles.searchPlaceholder}>
              Try: India Accelerator - Westgate Business Bay
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter and Booking Date Row */}
        <View style={styles.filterSortContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {/* Booking Date Selector */}
            <TouchableOpacity 
              style={styles.bookingDateButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={12} color={Colors.text.primary} />
              <View style={styles.bookingDateContent}>
                <Text style={styles.bookingDateText}>Booking Date</Text>
                <Text style={styles.bookingDateValue}>{selectedDate}</Text>
              </View>
              <Ionicons name="chevron-down" size={12} color={Colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterButton} onPress={handleFiltersPress}>
              <Ionicons name="filter" size={14} color={Colors.text.primary} />
              <Text style={styles.filterText}>Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
              <Ionicons name="map-outline" size={14} color={Colors.text.primary} />
              <Text style={styles.mapText}>Map</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Offer Banner */}
        <View style={styles.offerBanner}>
          <Ionicons name="pricetag" size={16} color={Colors.success} />
          <Text style={styles.offerText}>
            Get flat <Text style={styles.offerHighlight}>10% off</Text> using WELCOME on your first purchase
          </Text>
        </View>

        {/* Results Count */}
        <Text style={styles.resultsText}>
          Showing 14 result(s) for meeting rooms in {selectedLocation.city} for {selectedDate}
        </Text>

        {/* Credits Info */}
        <TouchableOpacity style={styles.creditsInfo}>
          <Ionicons name="help-circle" size={16} color={Colors.primary} />
          <Text style={styles.creditsText}>What Are Credits</Text>
        </TouchableOpacity>

        {/* Meeting Room List */}
        <View style={styles.workspaceList}>
          {meetingRoomWorkspaces.map((workspace) => (
            <TouchableOpacity
              key={workspace.id}
              style={styles.workspaceCard}
              onPress={() => handleWorkspacePress(workspace)}
            >
              <View style={styles.workspaceImageContainer}>
                <Image
                  source={{ uri: workspace.imageUrl }}
                  style={styles.workspaceImage}
                  resizeMode="cover"
                />
                {workspace.isPopular && (
                  <View style={styles.popularBadge}>
                    <Ionicons name="star" size={12} color={Colors.white} />
                    <Text style={styles.popularText}>Popular</Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.shareButton}
                  onPress={() => handleSharePress(workspace)}
                >
                  <Ionicons name="share-outline" size={20} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Ionicons name="heart-outline" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>

              <View style={styles.workspaceInfo}>
                {workspace.seatingTypes && workspace.seatingTypes[0].available && (
                  <View style={styles.availabilityBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                    <Text style={styles.availabilityText}>1 offer available at this workspace</Text>
                  </View>
                )}

                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color={Colors.warning} />
                  <Text style={styles.ratingText}>
                    {workspace.rating} (1,649 Brand Reviews)
                  </Text>
                </View>

                <Text style={styles.workspaceName}>{workspace.name}</Text>
                <Text style={styles.workspaceCategory}>MEETING ROOM | {workspace.location}</Text>
                
                <View style={styles.timeContainer}>
                  <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
                  <Text style={styles.timeText}>{workspace.hours}</Text>
                </View>

                <View style={styles.workspaceFooter}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                      {workspace.currency}{workspace.price}
                    </Text>
                    <Text style={styles.period}>{workspace.period}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => handleBookPress(workspace)}
                  >
                    <Text style={styles.bookButtonText}>Book Room</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <DatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={(date: string) => {
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
        selectedDate={selectedDate}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeAreaHeader: {
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  locationInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  cityText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  subLocationText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.light,
    paddingVertical: Spacing.xs,
  },
  filterSortContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  horizontalScrollContent: {
    alignItems: 'center',
    paddingRight: Spacing.md,
    flexDirection: 'row',
  },
  bookingDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    width: 120,
    height: 44,
  },
  bookingDateText: {
    fontSize: 9,
    color: Colors.text.secondary,
    marginBottom: 1,
  },
  bookingDateContent: {
    flex: 1,
    marginLeft: Spacing.xs,
  },
  bookingDateValue: {
    fontSize: 10,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    height: 44,
  },
  filterText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    height: 44,
  },
  mapText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
  },
  bookingCard: {
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    height: 200,
  },
  bookingCardImage: {
    width: '100%',
    height: '100%',
  },
  bookingCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingCardContent: {
    alignItems: 'center',
  },
  bookingDateLabel: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.sm,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  dateText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginRight: Spacing.sm,
  },
  viewWorkspacesButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  viewWorkspacesText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '20',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  offerText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
  },
  offerHighlight: {
    fontWeight: FontWeights.bold,
    color: Colors.success,
  },
  resultsText: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  creditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  creditsText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  workspaceList: {
    paddingBottom: Spacing.xl,
  },
  workspaceCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workspaceImageContainer: {
    height: 200,
    position: 'relative',
  },
  workspaceImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  popularBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  popularText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginLeft: 4,
  },
  shareButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md + 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  workspaceInfo: {
    padding: Spacing.md,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.xs,
    color: Colors.success,
    fontWeight: FontWeights.medium,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ratingText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  workspaceName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  workspaceCategory: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  timeText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  workspaceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  period: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: 2,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
});
