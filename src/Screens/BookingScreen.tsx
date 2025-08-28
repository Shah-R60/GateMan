import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { Workspace, Property } from '../types';
import { apiService } from '../services/apiService';
import { DateSelectionScreen } from './DateSelectionScreen';
import { MembersScreen } from './MembersScreen';
import { CancellationPolicyScreen } from './CancellationPolicyScreen';
import { CreditsScreen } from './CreditsScreen';
import { ConfirmBookingScreen } from './ConfirmBookingScreen';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  isSelected: boolean;
}

interface BookingScreenProps {
  propertyId: string;
  onBack: () => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  propertyId,
  onBack,
}) => {
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDateCount, setSelectedDateCount] = useState<number>(0);
  const [selectedMembers, setSelectedMembers] = useState<Guest[]>([
    {
      id: 'self',
      name: 'Shah Saurabh',
      email: 'shahrahul3600@gmail.com',
      phone: '7283881124',
      isSelected: true,
    }
  ]);
  const [selectedSeatingType, setSelectedSeatingType] = useState('Open Desk');
  const [showMembersPicker, setShowMembersPicker] = useState(false);
  const [showSeatingPicker, setShowSeatingPicker] = useState(false);

  // Fetch property details using propertyId
  useEffect(() => {
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
        console.log('BookingScreen - Fetched property details:', property);
      } catch (err) {
        console.error('Failed to fetch property details:', err);
        setError('Failed to load property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const [showDateSelection, setShowDateSelection] = useState(false);
  const [showMembersScreen, setShowMembersScreen] = useState(false);
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [showCreditsScreen, setShowCreditsScreen] = useState(false);
  const [showConfirmBooking, setShowConfirmBooking] = useState(false);

  const memberOptions = [1, 2, 3, 4, 5, 6, 7];
  const seatingOptions = ['Open Desk', 'Private Desk', 'Meeting Room'];

  const getSelectedMemberCount = () => {
    return selectedMembers.filter(member => member.isSelected).length;
  };

  const getWorkspaceType = () => {
    // Determine if this is a desk or meeting room based on property data
    if (!propertyData) return 'Desk';
    
    if (propertyData.name.toLowerCase().includes('meeting') || 
        propertyData.type === 'Meeting Room') {
      return 'Meeting Room';
    }
    return 'Desk';
  };

  const workspaceType = getWorkspaceType();
  
  const calculatePrice = () => {
    if (!propertyData) return 0;
    
    let basePrice = propertyData.totalCostPerSeat;
    if (selectedSeatingType === 'Private Desk') {
      basePrice = basePrice * 1.5;
    } else if (selectedSeatingType === 'Meeting Room') {
      basePrice = basePrice * 2;
    }
    const totalDateCount = selectedDateCount || 0;
    const memberCount = getSelectedMemberCount();
    return Math.round(basePrice * memberCount * totalDateCount);
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading property details...</Text>
      </View>
    );
  }

  // Error state
  if (error || !propertyData) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error || 'Property not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onBack}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleContinue = () => {
    if (selectedDateCount === 0) {
      Alert.alert('No dates selected', 'Please select at least one date to continue.');
      return;
    }
    
    setShowConfirmBooking(true);
  };

  const handleDateSelection = (dates: string, count: number) => {
    setSelectedDate(dates);
    setSelectedDateCount(count);
    setShowDateSelection(false);
  };

  const handleMembersUpdate = (members: Guest[]) => {
    setSelectedMembers(members);
    setShowMembersScreen(false);
  };

  // Show ConfirmBookingScreen if active
  if (showConfirmBooking) {
    return (
      <ConfirmBookingScreen
        onBack={() => setShowConfirmBooking(false)}
        propertyData={propertyData}
        selectedDate={selectedDate}
        selectedDateCount={selectedDateCount}
        selectedMembers={selectedMembers}
        selectedSeatingType={selectedSeatingType}
        totalPrice={calculatePrice()}
      />
    );
  }

  // Show CreditsScreen if active
  if (showCreditsScreen) {
    return (
      <CreditsScreen
        onBack={() => setShowCreditsScreen(false)}
      />
    );
  }

  // Show CancellationPolicyScreen if active
  if (showCancellationPolicy) {
    return (
      <CancellationPolicyScreen
        onBack={() => setShowCancellationPolicy(false)}
        workspaceName={propertyData.name}
      />
    );
  }

  // Show MembersScreen if active
  if (showMembersScreen) {
    return (
      <MembersScreen
        onBack={() => setShowMembersScreen(false)}
        onConfirm={handleMembersUpdate}
        initialMembers={selectedMembers.filter(member => member.id !== 'self')}
      />
    );
  }

  // Show DateSelectionScreen if active
  if (showDateSelection) {
    return (
      <DateSelectionScreen
        propertyData={propertyData}
        onBack={() => setShowDateSelection(false)}
        onDateSelect={handleDateSelection}
        selectedDate={selectedDate}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Dates & Members</Text>
          <TouchableOpacity 
            style={styles.creditsContainer}
            onPress={() => setShowCreditsScreen(true)}
          >
            <Ionicons name="card" size={16} color={Colors.primary} />
            <Text style={styles.creditsText}>0 credits</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Offers Section */}
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>Offers at this workspace</Text>
          <View style={styles.offerCard}>
            <View style={styles.offerIcon}>
              <Ionicons name="pricetag" size={20} color={Colors.success} />
            </View>
            <View style={styles.offerContent}>
              <Text style={styles.offerText}>
                Get <Text style={styles.offerHighlight}>20% off</Text> on Premium {workspaceType} Booking using coupon{' '}
                <Text style={styles.offerCode}>TRYPD20</Text>
              </Text>
            </View>
            <View style={styles.offerRating}>
              <Text style={styles.ratingText}>4/5</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4].map((star) => (
                  <Ionicons key={star} name="star" size={12} color={Colors.warning} />
                ))}
                <Ionicons name="star-outline" size={12} color={Colors.text.light} />
              </View>
            </View>
          </View>
        </View>

        {/* Select Date Section */}
        <TouchableOpacity 
          style={styles.sectionCard}
          onPress={() => setShowDateSelection(true)}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={24} color={Colors.primary} />
            <View style={styles.sectionContent}>
              <Text style={styles.sectionLabel}>Select Date(s)</Text>
              <Text style={styles.sectionSubtext}>You can select multiple dates</Text>
              <Text style={styles.sectionValue}>
                Date(s) | {selectedDate || 'No dates selected'}
                {selectedDateCount > 0 && ` (${selectedDateCount} date${selectedDateCount > 1 ? 's' : ''})`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </View>
        </TouchableOpacity>

        {/* Add Members Section */}
        <TouchableOpacity 
          style={styles.sectionCard}
          onPress={() => setShowMembersScreen(true)}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color={Colors.primary} />
            <View style={styles.sectionContent}>
              <Text style={styles.sectionLabel}>Add Members</Text>
              <Text style={styles.sectionSubtext}>You can add upto 7 members</Text>
              <Text style={styles.sectionValue}>
                Members | {getSelectedMemberCount()} {getSelectedMemberCount() === 1 ? '(Self)' : 'selected'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </View>
        </TouchableOpacity>

        {/* Seating Type Section */}
        <TouchableOpacity 
          style={styles.sectionCard}
          onPress={() => setShowSeatingPicker(!showSeatingPicker)}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="desktop" size={24} color={Colors.primary} />
            <View style={styles.sectionContent}>
              <Text style={styles.sectionLabel}>Seating Type</Text>
              <Text style={styles.sectionSubtext}>Only 1 seating type available at this workspace</Text>
              <Text style={styles.sectionValue}>Seating Type | {selectedSeatingType}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </View>
        </TouchableOpacity>

        {showSeatingPicker && (
          <View style={styles.pickerContainer}>
            {seatingOptions.map((seating) => (
              <TouchableOpacity
                key={seating}
                style={[
                  styles.pickerOption,
                  selectedSeatingType === seating && styles.selectedPickerOption,
                ]}
                onPress={() => {
                  setSelectedSeatingType(seating);
                  setShowSeatingPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    selectedSeatingType === seating && styles.selectedPickerText,
                  ]}
                >
                  {seating}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Workspace Info */}
        <View style={styles.workspaceInfo}>
          <Text style={styles.workspaceName}>{propertyData.name}</Text>
          <View style={styles.workspaceDetails}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.workspaceDetailText}>9:00 am - 9:00 pm (Mon to Sat)</Text>
          </View>
          <View style={styles.workspaceDetails}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.workspaceDetailText}>Closed (Sun)</Text>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.policySection}>
          <Text style={styles.policyTitle}>Cancellation Policy</Text>
          <View style={styles.policyContent}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.policyText}>
              You can cancel your booking before 1 hour of workspace opening time.
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.readMoreButton}
            onPress={() => setShowCancellationPolicy(true)}
          >
            <Text style={styles.readMoreText}>Read More</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Date(s), Member(s)</Text>
            <View style={styles.priceIcons}>
              <Ionicons name="calendar" size={16} color={Colors.text.secondary} />
              <Text style={styles.priceValue}>{selectedDateCount || 0}</Text>
              <Ionicons name="people" size={16} color={Colors.text.secondary} />
              <Text style={styles.priceValue}>{getSelectedMemberCount()}</Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabelLarge}>Price (credits/day/₹)</Text>
            <Text style={styles.priceAmount}>{calculatePrice()}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  creditsText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: FontWeights.medium,
  },
  scrollContainer: {
    flex: 1,
  },
  offersSection: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: Colors.success + '10',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  offerIcon: {
    marginRight: Spacing.sm,
  },
  offerContent: {
    flex: 1,
  },
  offerText: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  offerHighlight: {
    fontWeight: FontWeights.bold,
    color: Colors.success,
  },
  offerCode: {
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  offerRating: {
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  sectionCard: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
    marginBottom: 2,
  },
  sectionSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  sectionValue: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  pickerOption: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedPickerOption: {
    backgroundColor: Colors.primary + '10',
  },
  pickerOptionText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  selectedPickerText: {
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  workspaceInfo: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  workspaceName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  workspaceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  workspaceDetailText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  policySection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  policyTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  policyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  policyText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
    flex: 1,
    lineHeight: 20,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginRight: 4,
  },
  bottomSection: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  priceSection: {
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  priceLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  priceLabelLarge: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  priceIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: 4,
    marginRight: Spacing.sm,
  },
  priceAmount: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: FontSizes.md,
    color: Colors.error,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
});
