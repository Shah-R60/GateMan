import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { Workspace, Property } from '../types';
import { apiService } from '../services/apiService';

const { width } = Dimensions.get('window');

interface WorkspaceDetailsScreenProps {
  workspace: Workspace;
  propertyId: string;
  onBack: () => void;
  onBookNow: (propertyId: string) => void;
}

interface Review {
  id: string;
  rating: number;
  userName: string;
  date: string;
  passType: string;
  workspaceName: string;
  comment: string;
  highlights?: string[];
}

interface Amenity {
  id: string;
  name: string;
  icon: string;
  isPaid?: boolean;
  isPremier?: boolean;
  description?: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    rating: 5,
    userName: 'Ali Asgar',
    date: '31 May, 2025',
    passType: 'Day Pass',
    workspaceName: 'Oyo Workflo - Bizness Square',
    comment: "place is good but lot of people are here (so much crowd), if you're the one who like silence and perfect vibe for work. then something else will be better.",
  },
  {
    id: '2',
    rating: 5,
    userName: 'VINEETH DANIEL',
    date: '01 May, 2024',
    passType: 'Day Pass',
    workspaceName: 'Oyo Workflo - Bizness Square',
    comment: 'Great Location, Easily Accessible, Hospitable Staff, Excellent Service, Great Workspace Ambience, Great Amenities & Facilities',
    highlights: ['Great Location', 'Easily Accessible', 'Hospitable Staff', 'Excellent Service', 'Great Workspace Ambience', 'Great Amenities & Facilities'],
  },
  {
    id: '3',
    rating: 5,
    userName: 'Rajasekhar Akkinapalli',
    date: '10 Jul, 2024',
    passType: 'Day Pass',
    workspaceName: 'Oyo Workflo - Bizness Square',
    comment: 'Hospitable Staff',
    highlights: ['Hospitable Staff'],
  },
];

const amenitiesList: Amenity[] = [
  { id: '1', name: '2 wheeler parking', icon: 'bicycle', isPaid: true },
  { id: '2', name: '4 wheeler parking', icon: 'car', isPaid: true },
  { id: '3', name: 'Wifi', icon: 'wifi' },
  { id: '4', name: 'Printer', icon: 'print', isPaid: true },
  { id: '5', name: 'Tea', icon: 'cafe' },
  { id: '6', name: 'Coffee', icon: 'cafe' },
  { id: '7', name: 'Water', icon: 'water' },
  { id: '8', name: 'Chairs & Desks', icon: 'desktop' },
  { id: '9', name: 'Separate Washroom', icon: 'man' },
  { id: '10', name: 'Pantry Area', icon: 'restaurant' },
  { id: '11', name: 'Meeting Rooms', icon: 'people', isPaid: true },
  { id: '12', name: 'Air Conditioners', icon: 'snow' },
  { id: '13', name: 'Charging', icon: 'battery-charging' },
  { id: '14', name: 'Power Backup', icon: 'flash' },
  { id: '15', name: 'Fire Extinguisher', icon: 'flame' },
  { id: '16', name: 'Security Personnel', icon: 'shield' },
  { id: '17', name: 'First Aid Kit', icon: 'medical' },
];

export const WorkspaceDetailsScreen: React.FC<WorkspaceDetailsScreenProps> = ({
  workspace,
  propertyId,
  onBack,
  onBookNow,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [activeTab, setActiveTab] = useState<'nearby' | 'ahmedabad'>('nearby');
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log the propertyId for debugging
  console.log('WorkspaceDetailsScreen - Received propertyId:', propertyId);

  // Fetch property details using propertyId
  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    if (!propertyId) {
      setError('Property ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const property = await apiService.getPropertyById(propertyId);
      setPropertyData(property);
      console.log('Fetched property details:', property);
    } catch (err) {
      console.error('Failed to fetch property details:', err);
      setError('Failed to load property details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Use property data if available, otherwise fallback to workspace prop
  const displayData = propertyData || workspace;
  const images = propertyData 
    ? propertyData.propertyImages.length > 0 
      ? propertyData.propertyImages 
      : [workspace.imageUrl]
    : [
        workspace.imageUrl,
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=500',
      ];

  // Create amenities list from property data or use default
  const getAmenitiesList = (): Amenity[] => {
    if (propertyData && propertyData.amenities) {
      return propertyData.amenities.map((amenity, index) => ({
        id: `${index + 1}`,
        name: amenity,
        icon: getAmenityIcon(amenity),
        isPaid: false, // You can set this based on your business logic
      }));
    }
    return amenitiesList;
  };

  // Map amenity names to icons
  const getAmenityIcon = (amenityName: string): string => {
    const iconMap: { [key: string]: string } = {
      'Custom Branding': 'star',
      'Private Gym': 'fitness',
      'Full-Service Cafeteria': 'restaurant',
      'IT Support': 'laptop',
      'Wifi': 'wifi',
      'Parking': 'car',
      'Printer': 'print',
      'Tea': 'cafe',
      'Coffee': 'cafe',
      'Water': 'water',
      'Chairs & Desks': 'desktop',
      'Washroom': 'man',
      'Meeting Rooms': 'people',
      'Air Conditioner': 'snow',
      'Charging': 'battery-charging',
      'Power Backup': 'flash',
      'Security': 'shield',
      'First Aid': 'medical',
    };
    
    // Try to find a partial match
    for (const [key, icon] of Object.entries(iconMap)) {
      if (amenityName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(amenityName.toLowerCase())) {
        return icon;
      }
    }
    
    return 'checkmark-circle'; // Default icon
  };

  const dynamicAmenitiesList = getAmenitiesList();
  const visibleAmenities = showAllAmenities ? dynamicAmenitiesList : dynamicAmenitiesList.slice(0, 10);

  const renderStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name="star"
        size={16}
        color={index < rating ? Colors.warning : Colors.border}
      />
    ));
  };

  const renderAmenityIcon = (iconName: string) => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      bicycle: 'bicycle',
      car: 'car',
      wifi: 'wifi',
      print: 'print',
      cafe: 'cafe',
      water: 'water',
      desktop: 'desktop',
      man: 'man',
      restaurant: 'restaurant',
      people: 'people',
      snow: 'snow',
      'battery-charging': 'battery-charging',
      flash: 'flash',
      flame: 'flame',
      shield: 'shield',
      medical: 'medical',
    };
    
    return iconMap[iconName] || 'checkmark-circle';
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar style="dark" backgroundColor={Colors.white} />
      
      {/* Loading State */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading property details...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              fetchPropertyDetails();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!loading && !error && (
      <View style={styles.container}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: images[currentImageIndex] }} style={styles.heroImage} />
          
          {/* Header Overlay */}
          <View style={styles.headerOverlay}>
            <View style={styles.headerSafeArea}>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton} onPress={onBack}>
                  <Ionicons name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <View style={styles.headerRightActions}>
                  <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="share-outline" size={24} color={Colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="heart-outline" size={24} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Image Navigation */}
          <View style={styles.imageNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
              disabled={currentImageIndex === 0}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
              disabled={currentImageIndex === images.length - 1}
            >
              <Ionicons name="chevron-forward" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Image Counter */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>{currentImageIndex + 1} / {images.length}</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Workspace Info */}
          <View style={styles.workspaceInfo}>
            <Text style={styles.workspaceName}>
              {propertyData ? propertyData.name : workspace.name}
            </Text>
            <Text style={styles.workspaceType}>
              {propertyData ? propertyData.type.toUpperCase() : 'COWORKING'}
            </Text>
            <Text style={styles.workspaceLocation}>
              {propertyData 
                ? `${propertyData.address}, ${propertyData.city}, ${propertyData.state}`
                : workspace.location
              }
            </Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.ratingStars}>
                <Ionicons name="star" size={16} color={Colors.warning} />
                <Text style={styles.ratingText}>3.96 (111 Brand Reviews)</Text>
              </View>
            </View>

            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={16} color={Colors.text.secondary} />
                <Text style={styles.badgeText}>Assured Security</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="car" size={16} color={Colors.text.secondary} />
                <Text style={styles.badgeText}>Parking Available</Text>
              </View>
            </View>
          </View>

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Workspace Timings</Text>
              <View style={styles.timingItem}>
                <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
                <Text style={styles.timingText}>
                  {propertyData 
                    ? propertyData.isSaturdayOpened 
                      ? "9:00 am - 9:00 pm (Mon to Sat)"
                      : "9:00 am - 9:00 pm (Mon to Fri)"
                    : "9:00 am - 9:00 pm (Mon to Sat)"
                  }
                </Text>
              </View>
              <View style={styles.timingItem}>
                <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
                <Text style={styles.timingText}>
                  {propertyData 
                    ? propertyData.isSundayOpened 
                      ? "9:00 am - 9:00 pm (Sun)"
                      : "Closed (Sun)"
                    : "Closed (Sun)"
                  }
                </Text>
              </View>
            </View>

            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Top amenities</Text>
              <View style={styles.topAmenities}>
                {dynamicAmenitiesList.slice(0, 4).map((amenity) => (
                  <View key={amenity.id} style={styles.amenityItem}>
                    <Ionicons 
                      name={renderAmenityIcon(amenity.icon)} 
                      size={16} 
                      color={Colors.text.secondary} 
                    />
                    <Text style={styles.amenityText}>{amenity.name}</Text>
                    {amenity.isPaid && (
                      <Ionicons name="flash" size={12} color={Colors.warning} />
                    )}
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>F&B Offers</Text>
              <View style={styles.fnbOffer}>
                <Ionicons name="cafe" size={16} color={Colors.primary} />
                <Text style={styles.fnbText}>Unlimited Free Tea/Coffee</Text>
              </View>
            </View>

            {propertyData && (
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Property Details</Text>
                <View style={styles.propertyDetails}>
                  <View style={styles.propertyDetailItem}>
                    <Ionicons name="people" size={16} color={Colors.text.secondary} />
                    <Text style={styles.propertyDetailText}>
                      Seating Capacity: {propertyData.seatingCapacity}
                    </Text>
                  </View>
                  <View style={styles.propertyDetailItem}>
                    <Ionicons name="resize" size={16} color={Colors.text.secondary} />
                    <Text style={styles.propertyDetailText}>
                      Total Area: {propertyData.totalArea} sq ft
                    </Text>
                  </View>
                  <View style={styles.propertyDetailItem}>
                    <Ionicons name="layers" size={16} color={Colors.text.secondary} />
                    <Text style={styles.propertyDetailText}>
                      Floor Size: {propertyData.floorSize} sq ft
                    </Text>
                  </View>
                  <View style={styles.propertyDetailItem}>
                    <Ionicons name="star" size={16} color={Colors.text.secondary} />
                    <Text style={styles.propertyDetailText}>
                      Furnishing: {propertyData.furnishingLevel.replace('-', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Address</Text>
              <View style={styles.addressContainer}>
                <Ionicons name="location" size={16} color={Colors.text.secondary} />
                <Text style={styles.addressText}>
                  {propertyData 
                    ? `${propertyData.address}, ${propertyData.city}, ${propertyData.state} - ${propertyData.pincode}`
                    : "001 Mayuransh Elanza, Nr. Parekh's Hospital, Shyamal Crossroad, 132 Feet Ring Rd, Satellite, Ahmedabad, Gujarat"
                  }
                </Text>
              </View>
              <TouchableOpacity style={styles.mapButton}>
                <Text style={styles.mapButtonText}>View location on map</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amenities & Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Amenities & details</Text>
              <View style={styles.amenityTags}>
                <View style={styles.amenityTag}>
                  <Ionicons name="flash" size={12} color={Colors.warning} />
                  <Text style={styles.amenityTagText}>Paid Amenity</Text>
                </View>
                <View style={[styles.amenityTag, styles.premierTag]}>
                  <Text style={styles.premierTagText}>Premier</Text>
                </View>
              </View>
            </View>

            <View style={styles.availabilitySection}>
              <View style={styles.availabilityHeader}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.availabilityText}>Available</Text>
              </View>
              <Text style={styles.availabilityNote}>
                * Amenities like parking, phone booths are limited and subject to availability at the workspace
              </Text>
            </View>

            <View style={styles.amenitiesGrid}>
              {visibleAmenities.map((amenity) => (
                <View key={amenity.id} style={styles.amenityGridItem}>
                  <View style={styles.amenityIconContainer}>
                    <Ionicons 
                      name={renderAmenityIcon(amenity.icon)} 
                      size={20} 
                      color={Colors.primary} 
                    />
                    {amenity.isPaid && (
                      <Ionicons 
                        name="flash" 
                        size={12} 
                        color={Colors.warning} 
                        style={styles.amenityBadge} 
                      />
                    )}
                  </View>
                  <Text style={styles.amenityGridText}>{amenity.name}</Text>
                </View>
              ))}
            </View>

            {!showAllAmenities && dynamicAmenitiesList.length > 10 && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => setShowAllAmenities(true)}
              >
                <Text style={styles.viewAllText}>View all amenities</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Expert Help */}
          <View style={styles.expertSection}>
            <View style={styles.expertIcon}>
              <Text style={styles.expertQuestionMark}>?</Text>
            </View>
            <View style={styles.expertContent}>
              <Text style={styles.expertTitle}>Still have doubts?</Text>
              <TouchableOpacity>
                <Text style={styles.expertLink}>Connect with GateMan experts →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* More About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              More about {propertyData ? propertyData.name : workspace.name}
            </Text>
            <Text style={styles.description}>
              {propertyData 
                ? propertyData.description 
                : "Workflo Mayuransh Elanza, Ahmedabad is a beautifully crafted smart coworking & office space for rent with over 140 seats. From meeting rooms to private offices for rent to the green integrated spaces."
              }
            </Text>
            <TouchableOpacity>
              <Text style={styles.readMoreText}>Read more...</Text>
            </TouchableOpacity>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
            
            <View style={styles.overallRating}>
              <Text style={styles.ratingNumber}>3.96</Text>
              <Text style={styles.ratingCount}>(111 Brand Reviews)</Text>
            </View>
            <Text style={styles.ratingDescription}>
              Average rating for all workspaces of Workflow by OYO
            </Text>

            {/* Rating Bars */}
            <View style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((rating, index) => {
                const percentages = [51, 20, 13, 6, 10];
                return (
                  <View key={rating} style={styles.ratingBar}>
                    <View style={styles.ratingStars}>
                      <Ionicons name="star" size={14} color={Colors.warning} />
                      <Text style={styles.ratingBarNumber}>{rating}</Text>
                    </View>
                    <View style={styles.ratingBarTrack}>
                      <View 
                        style={[
                          styles.ratingBarFill, 
                          { width: `${percentages[index]}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.ratingPercentage}>{percentages[index]}%</Text>
                  </View>
                );
              })}
            </View>

            <Text style={styles.reviewsTitle}>Reviews for Workflow by OYO</Text>

            {/* Individual Reviews */}
            {mockReviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewStars}>
                    {renderStarRating(review.rating)}
                    <Text style={styles.reviewRating}>{review.rating}</Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewUserName}>{review.userName}</Text>
                    <Text style={styles.reviewDate}>{review.date} | {review.passType}</Text>
                  </View>
                </View>
                <Text style={styles.reviewWorkspace}>{review.workspaceName}</Text>
                {review.highlights && (
                  <View style={styles.reviewHighlights}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.reviewHighlightText}>
                      {review.highlights.join(', ')}
                    </Text>
                  </View>
                )}
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.readAllReviews}>
              <Text style={styles.readAllReviewsText}>Read all reviews →</Text>
            </TouchableOpacity>
          </View>

          {/* Similar Spaces */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar spaces</Text>
            
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'nearby' && styles.activeTab]}
                onPress={() => setActiveTab('nearby')}
              >
                <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTabText]}>
                  Spaces Nearby
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'ahmedabad' && styles.activeTab]}
                onPress={() => setActiveTab('ahmedabad')}
              >
                <Text style={[styles.tabText, activeTab === 'ahmedabad' && styles.activeTabText]}>
                  Spaces in Ahmedabad
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.similarSpacesGrid}>
              <View style={styles.similarSpaceCard}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300' }}
                  style={styles.similarSpaceImage}
                />
                <View style={styles.similarSpaceInfo}>
                  <Text style={styles.similarSpaceName}>DevX - Vastrapur</Text>
                  <Text style={styles.similarSpaceLocation}>Vastrapur, Ahmedabad</Text>
                  <View style={styles.similarSpaceTiming}>
                    <Ionicons name="time-outline" size={14} color={Colors.text.secondary} />
                    <Text style={styles.similarSpaceTime}>10:00 am - 07:00 pm (Tue)</Text>
                  </View>
                  <View style={styles.similarSpacePrice}>
                    <Text style={styles.similarSpaceOldPrice}>₹1,000</Text>
                    <Text style={styles.similarSpaceNewPrice}>800</Text>
                  </View>
                </View>
              </View>

              <View style={styles.similarSpaceCard}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300' }}
                  style={styles.similarSpaceImage}
                />
                <View style={styles.similarSpaceInfo}>
                  <Text style={styles.similarSpaceName}>awfis - RE11</Text>
                  <Text style={styles.similarSpaceLocation}>Ambli, Ahmedabad</Text>
                  <View style={styles.similarSpaceTiming}>
                    <Ionicons name="time-outline" size={14} color={Colors.text.secondary} />
                    <Text style={styles.similarSpaceTime}>09:00 am - 06:00 pm (Tue)</Text>
                  </View>
                  <View style={styles.similarSpacePrice}>
                    <Text style={styles.similarSpaceOldPrice}>₹400</Text>
                    <Text style={styles.similarSpaceNewPrice}>300</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.exploreMoreSection}>
              <Text style={styles.exploreMoreTitle}>Explore More Spaces In Nearby Areas</Text>
              
              <TouchableOpacity style={styles.exploreMoreItem}>
                <Text style={styles.exploreMoreText}>View Spaces in Ellisbridge</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.exploreMoreItem}>
                <Text style={styles.exploreMoreText}>View Spaces in Sarkhej - Gandhinagar Highway</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.exploreMoreItem}>
                <Text style={styles.exploreMoreText}>View Spaces in Bodakdev</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom spacing for fixed button */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.bookingSection}>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>
                Price (₹{propertyData ? 'cost/seat' : 'credits'}/day/⚡)
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.oldPrice}>
                  ₹{propertyData ? Math.round(propertyData.totalCostPerSeat * 1.2) : '500'}
                </Text>
                <Text style={styles.currentPrice}>
                  {propertyData ? propertyData.totalCostPerSeat : '350'}
                </Text>
                <View style={styles.bestPriceTag}>
                  <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                  <Text style={styles.bestPriceText}>
                    {propertyData?.isPriceNegotiable ? 'Negotiable' : 'Best Price'}
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => onBookNow(propertyId)}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerSafeArea: {
    paddingTop: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  imageNavigation: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    transform: [{ translateY: -20 }],
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCounter: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  imageCounterText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  scrollContainer: {
    flex: 1,
  },
  workspaceInfo: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  workspaceName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  workspaceType: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  workspaceLocation: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    marginBottom: Spacing.sm,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  section: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  overviewItem: {
    marginBottom: Spacing.md,
  },
  overviewLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  timingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: Spacing.xs,
  },
  timingText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  topAmenities: {
    gap: Spacing.xs,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  amenityText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    flex: 1,
  },
  fnbOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  fnbText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  addressText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  mapButton: {
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  amenityTags: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  amenityTagText: {
    fontSize: FontSizes.xs,
    color: Colors.warning,
  },
  premierTag: {
    backgroundColor: Colors.primary + '20',
  },
  premierTagText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  availabilitySection: {
    marginBottom: Spacing.md,
  },
  availabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  availabilityText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  availabilityNote: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    fontStyle: 'italic',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  amenityGridItem: {
    width: (width - Spacing.md * 3) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  amenityIconContainer: {
    position: 'relative',
  },
  amenityBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  amenityGridText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    flex: 1,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  viewAllText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  expertSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  expertIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expertQuestionMark: {
    fontSize: FontSizes.xl,
    color: Colors.white,
    fontWeight: FontWeights.bold,
  },
  expertContent: {
    flex: 1,
  },
  expertTitle: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  expertLink: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  readMoreText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  ratingNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  ratingCount: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  ratingDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  ratingBars: {
    marginBottom: Spacing.md,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  ratingBarNumber: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  ratingBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  ratingPercentage: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    minWidth: 30,
    textAlign: 'right',
  },
  reviewsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  reviewCard: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  reviewStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewRating: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  reviewMeta: {
    alignItems: 'flex-end',
  },
  reviewUserName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
  },
  reviewDate: {
    fontSize: FontSizes.xs,
    color: Colors.text.light,
  },
  reviewWorkspace: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  reviewHighlights: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  reviewHighlightText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    flex: 1,
  },
  reviewComment: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  readAllReviews: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  readAllReviewsText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  similarSpacesGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  similarSpaceCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  similarSpaceImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  similarSpaceInfo: {
    padding: Spacing.sm,
  },
  similarSpaceName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  similarSpaceLocation: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  similarSpaceTiming: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  similarSpaceTime: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  similarSpacePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  similarSpaceOldPrice: {
    fontSize: FontSizes.xs,
    color: Colors.text.light,
    textDecorationLine: 'line-through',
  },
  similarSpaceNewPrice: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  exploreMoreSection: {
    marginTop: Spacing.md,
  },
  exploreMoreTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  exploreMoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exploreMoreText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  bottomSpacing: {
    height: 120,
  },
  bottomSection: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bookingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: FontSizes.xs,
    color: Colors.text.light,
    marginBottom: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  oldPrice: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  bestPriceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  bestPriceText: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    fontWeight: FontWeights.medium,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  bookButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: FontSizes.md,
    color: Colors.error,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  retryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  backButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
  },
  propertyDetails: {
    gap: Spacing.sm,
  },
  propertyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  propertyDetailText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    flex: 1,
  },
});
