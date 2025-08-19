import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { Location, Workspace } from '../types';
import { FilterModal } from '../components/FilterModal';

interface DeskScreenProps {
  selectedLocation: Location;
  selectedSubLocation: string;
  onBack: () => void;
}

const sortOptions = [
  'Popularity',
  'Price: Low to High',
  'Price: High to Low',
  'Distance',
  'Rating',
];

export const DeskScreen: React.FC<DeskScreenProps> = ({
  selectedLocation,
  selectedSubLocation,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('Popularity');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today (19 Aug)');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: 'popularity',
    spaceType: 'all',
    brands: [] as string[],
    timings: [] as string[],
    parking: false,
    metroConnectivity: false,
    priceRange: {
      min: 250,
      max: 800,
    },
  });

  // Mock data for desk workspaces
  const deskWorkspaces: Workspace[] = [
    {
      id: '1',
      name: 'awfis - Kirsh Cubical',
      location: 'Thaltej, Ahmedabad',
      distance: '7.06 kms away',
      hours: '09:00 am - 06:00 pm (Tue)',
      price: 300,
      currency: '₹',
      period: '/day',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
      isPopular: true,
      rating: 4.34,
      seatingTypes: [
        { type: 'Open Desk', available: true },
      ],
    },
    {
      id: '2',
      name: 'WeWork BKC',
      location: 'Bandra Kurla Complex, Mumbai',
      distance: '12.5 kms away',
      hours: '24/7 Access',
      price: 450,
      currency: '₹',
      period: '/day',
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600',
      isPopular: true,
      rating: 4.7,
      seatingTypes: [
        { type: 'Private Desk', available: true },
      ],
    },
  ];

  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
    setShowSortOptions(false);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleWorkspacePress = (workspace: Workspace) => {
    // Navigate to workspace details
    console.log('Workspace pressed:', workspace.name);
  };

  const handleBookPress = (workspace: Workspace) => {
    // Navigate to booking screen
    console.log('Book pressed for:', workspace.name);
  };

  const handleFiltersPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    // Apply filters to workspace list here
    console.log('Applied filters:', filters);
  };

  const handleMapPress = () => {
    // Open map view
    console.log('Map pressed');
  };

  const handleViewWorkspaces = () => {
    // Handle view workspaces action
    console.log('View workspaces pressed');
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
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color={Colors.text.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for workspaces in Ahmedabad"
              placeholderTextColor={Colors.text.light}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filter and Sort Row */}
        <View style={styles.filterSortContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={handleFiltersPress}>
            <Ionicons name="filter" size={16} color={Colors.text.primary} />
            <Text style={styles.filterText}>Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sortButton} 
            onPress={() => setShowSortOptions(!showSortOptions)}
          >
            <Ionicons name="swap-vertical" size={16} color={Colors.text.primary} />
            <Text style={styles.sortText}>Sort</Text>
            <Text style={styles.sortOption}>{selectedSort}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
            <Ionicons name="map" size={16} color={Colors.text.primary} />
            <Text style={styles.mapText}>Map</Text>
          </TouchableOpacity>
        </View>

        {/* Sort Options Dropdown */}
        {showSortOptions && (
          <View style={styles.sortDropdown}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => handleSortSelect(option)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    selectedSort === option && styles.selectedSortText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Booking Card */}
        <View style={styles.bookingCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600' }}
            style={styles.bookingCardImage}
            resizeMode="cover"
          />
          <View style={styles.bookingCardOverlay}>
            <View style={styles.bookingCardContent}>
              <Text style={styles.bookingDateLabel}>Booking Date</Text>
              <TouchableOpacity 
                style={styles.dateSelector}
                onPress={() => setShowDatePicker(!showDatePicker)}
              >
                <Text style={styles.dateText}>{selectedDate}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.white} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.viewWorkspacesButton} onPress={handleViewWorkspaces}>
                <Text style={styles.viewWorkspacesText}>View Workspaces</Text>
              </TouchableOpacity>
            </View>
          </View>
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
          Showing 7 result(s) for desks in {selectedLocation.city} for {selectedDate}
        </Text>

        {/* Credits Info */}
        <TouchableOpacity style={styles.creditsInfo}>
          <Ionicons name="help-circle" size={16} color={Colors.primary} />
          <Text style={styles.creditsText}>What Are Credits</Text>
        </TouchableOpacity>

        {/* Workspace List */}
        <View style={styles.workspaceList}>
          {deskWorkspaces.map((workspace) => (
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
                <TouchableOpacity style={styles.shareButton}>
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
                <Text style={styles.workspaceCategory}>COWORKING | {workspace.location}</Text>
                
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
                    <Text style={styles.bookButtonText}>Book Desk</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  filterSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  },
  filterText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    flex: 1,
  },
  sortText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
  },
  sortOption: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
  },
  mapText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
  },
  sortDropdown: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  sortOptionText: {
    padding: Spacing.md,
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
  },
  selectedSortText: {
    color: Colors.primary,
    fontWeight: FontWeights.medium,
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
