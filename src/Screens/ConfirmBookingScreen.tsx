import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { Property } from '../types';
import { CreditsScreen } from './CreditsScreen';
import { BookingScreen } from './BookingScreen';
import { PaymentScreen } from './PaymentScreen';

const { width } = Dimensions.get('window');

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  isSelected: boolean;
}

interface ConfirmBookingScreenProps {
  onBack: () => void;
  propertyData: Property;
  selectedDate: string;
  selectedDateCount: number;
  selectedMembers: Guest[];
  selectedSeatingType: string;
  totalPrice: number;
}

export const ConfirmBookingScreen: React.FC<ConfirmBookingScreenProps> = ({
  onBack,
  propertyData,
  selectedDate,
  selectedDateCount,
  selectedMembers,
  selectedSeatingType,
  totalPrice,
}) => {
  const selectedMemberCount = selectedMembers.filter(member => member.isSelected).length;

  // Navigation state
  const [showCreditsScreen, setShowCreditsScreen] = React.useState(false);
  const [showBookingScreen, setShowBookingScreen] = React.useState(false);
  const [showPaymentScreen, setShowPaymentScreen] = React.useState(false);

  const formatDate = () => {
    if (selectedDateCount === 1) {
      return selectedDate;
    }
    return `${selectedDateCount} days selected`;
  };

  const handleProceed = () => {
    // Navigate to payment screen
    setShowPaymentScreen(true);
  };

  // Conditional rendering for CreditsScreen
  if (showCreditsScreen) {
    // Replace with your actual CreditsScreen import/component
    return <CreditsScreen onBack={() => setShowCreditsScreen(false)} />;
  }

  // Conditional rendering for BookingScreen
  if (showBookingScreen) {
    // Replace with your actual BookingScreen import/component
    return <BookingScreen propertyId={propertyData._id} onBack={() => setShowBookingScreen(false)} />;
  }

  // Conditional rendering for PaymentScreen
  if (showPaymentScreen) {
    return (
      <PaymentScreen
        onBack={() => setShowPaymentScreen(false)}
        bookingAmount={300}
        totalPrice={totalPrice}
      />
    );
  }  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Booking</Text>
          <TouchableOpacity style={styles.creditsContainer} onPress={() => setShowCreditsScreen(true)}>
            <Ionicons name="card" size={16} color={Colors.primary} />
            <Text style={styles.creditsText}>0 credits</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Booking Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          <View style={styles.detailsCard}>
            {/* Workspace Header */}
            <View style={styles.workspaceHeader}>
              <View style={styles.workspaceIcon}>
                <Ionicons name="business" size={24} color={Colors.primary} />
              </View>
              <View style={styles.workspaceDetails}>
                <Text style={styles.workspaceName}>{propertyData.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color={Colors.text.secondary} />
                  <Text style={styles.workspaceLocation}>Thaltej, Ahmedabad</Text>
                </View>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color={Colors.warning} />
                <Text style={styles.ratingText}>4.5</Text>
              </View>
            </View>

            {/* Price Section */}
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Price per member/day</Text>
              <View style={styles.priceContainer}>
                <View style={styles.originalPriceContainer}>
                  <Text style={styles.originalPrice}>₹400</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>25% OFF</Text>
                  </View>
                </View>
                <View style={styles.discountedPriceContainer}>
                  <Ionicons name="flash" size={18} color={Colors.primary} />
                  <Text style={styles.discountedPrice}>₹300</Text>
                </View>
              </View>
            </View>

            {/* Booking Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="calendar" size={20} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Days</Text>
                  <Text style={styles.detailValue}>{selectedDateCount}</Text>
                  <Text style={styles.detailSubtext}>22 Aug (Tomorrow)</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="people" size={20} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Members</Text>
                  <Text style={styles.detailValue}>{selectedMemberCount}</Text>
                  <Text style={styles.detailSubtext}>Self</Text>
                </View>
              </View>
            </View>

            {/* Total Section */}
            <View style={styles.totalSection}>
              <View style={styles.totalHeader}>
                <Text style={styles.totalLabel}>Required for this booking</Text>
                <TouchableOpacity style={styles.infoButton}>
                  <Ionicons name="information-circle-outline" size={16} color={Colors.text.secondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.totalPriceRow}>
                <View style={styles.totalPriceContainer}>
                  <Ionicons name="flash" size={20} color={Colors.primary} />
                  <Text style={styles.totalPrice}>₹300</Text>
                </View>
                <Text style={styles.totalPriceLabel}>Total</Text>
              </View>
              
              <Text style={styles.calculationText}>
                ₹300 × {selectedDateCount} day(s) × {selectedMemberCount} member(s)
              </Text>
            </View>

            {/* Cancellation Info */}
            <View style={styles.cancellationInfo}>
              <View style={styles.cancellationIconContainer}>
                <Ionicons name="shield-checkmark" size={18} color={Colors.success} />
              </View>
              <View style={styles.cancellationContent}>
                <Text style={styles.cancellationTitle}>Free Cancellation</Text>
                <Text style={styles.cancellationText}>
                  Cancel before 22 Aug, 12:00 AM for full refund
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Workspace Offers Section */}
        <TouchableOpacity style={styles.offersSection}>
          <View style={styles.offersContent}>
            <View style={styles.offersIcon}>
              <Ionicons name="gift" size={20} color={Colors.primary} />
            </View>
            <View style={styles.offersTextContainer}>
              <Text style={styles.offersTitle}>Workspace Offers</Text>
              <Text style={styles.offersSubtitle}>View available discounts & deals</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>

        {/* GateMan Assurance Section */}
        <View style={styles.assuranceSection}>
          <View style={styles.assuranceHeader}>
            <View style={styles.assuranceIconContainer}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.assuranceTitle}>GateMan Assurance</Text>
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.assuranceItems}>
            <View style={styles.assuranceItem}>
              <View style={styles.assuranceItemIcon}>
                <Ionicons name="pricetag" size={16} color={Colors.success} />
              </View>
              <Text style={styles.assuranceText}>Lowest Price Guaranteed</Text>
            </View>
            <View style={styles.assuranceItem}>
              <View style={styles.assuranceItemIcon}>
                <Ionicons name="hand-left" size={16} color={Colors.success} />
              </View>
              <Text style={styles.assuranceText}>1-click Free Cancellation</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date(s) & Member(s)</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => setShowBookingScreen(true)}>
              <Ionicons name="pencil" size={14} color={Colors.primary} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.summaryDetails}>
            <View style={styles.summaryItem}>
              <Ionicons name="calendar" size={16} color={Colors.text.secondary} />
              <Text style={styles.summaryValue}>{selectedDateCount} day(s)</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="people" size={16} color={Colors.text.secondary} />
              <Text style={styles.summaryValue}>{selectedMemberCount} member(s)</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.totalRow}>
          <View style={styles.totalInfo}>
            <Text style={styles.totalBottomLabel}>Total Amount</Text>
            <Text style={styles.totalBottomPrice}>₹{totalPrice}</Text>
          </View>
          <View style={styles.savingsInfo}>
            <Text style={styles.savingsText}>You save ₹100</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
          <View style={styles.proceedButtonContent}>
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeAreaHeader: {
    backgroundColor: Colors.white,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 1000,
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
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  creditsText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: FontWeights.semibold,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.gray[100] + '50',
  },
  detailsCard: {
    backgroundColor: 'transparent',
    padding: Spacing.md,
  },
  workspaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  workspaceIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workspaceDetails: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  workspaceName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workspaceLocation: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  ratingText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.warning,
    marginLeft: 2,
  },
  priceSection: {
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  priceLabel: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  originalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    textDecorationLine: 'line-through',
    marginRight: Spacing.xs,
  },
  discountBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 1,
    borderRadius: 3,
  },
  discountText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: FontWeights.bold,
  },
  discountedPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountedPrice: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  detailItem: {
    flex: 1,
    backgroundColor: Colors.gray[100],
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  detailContent: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginBottom: 2,
    fontWeight: FontWeights.medium,
  },
  detailValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  detailSubtext: {
    fontSize: 10,
    color: Colors.text.light,
    textAlign: 'center',
  },
  totalSection: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  totalLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
  },
  infoButton: {
    padding: Spacing.xs,
  },
  totalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  totalPriceLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.secondary,
  },
  calculationText: {
    fontSize: FontSizes.xs,
    color: Colors.text.light,
    marginBottom: Spacing.md,
    textAlign: 'left',
  },
  cancellationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.success + '10',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  cancellationIconContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  cancellationContent: {
    flex: 1,
  },
  cancellationTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.success,
    marginBottom: 2,
  },
  cancellationText: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    lineHeight: 16,
  },
  offersSection: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  offersContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  offersIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  offersTextContainer: {
    flex: 1,
  },
  offersTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  offersSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  assuranceSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  assuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  assuranceIconContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  assuranceTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    flex: 1,
  },
  assuranceItems: {
    gap: Spacing.sm,
  },
  assuranceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  assuranceItemIcon: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  assuranceText: {
    fontSize: FontSizes.xs,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
    flex: 1,
  },
  bottomSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryCard: {
    backgroundColor: Colors.gray[100],
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  editText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginLeft: 2,
  },
  summaryDetails: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: FontSizes.xs,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  totalInfo: {
    flex: 1,
  },
  totalBottomLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  totalBottomPrice: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  savingsInfo: {
    alignItems: 'flex-end',
  },
  savingsText: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    fontWeight: FontWeights.medium,
    backgroundColor: Colors.success + '15',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  proceedButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  proceedButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
    marginRight: Spacing.xs,
  },
});
