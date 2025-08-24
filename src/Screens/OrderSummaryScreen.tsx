import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';

const { width } = Dimensions.get('window');

interface OrderSummaryScreenProps {
  onBack: () => void;
  workspaceName?: string;
  location?: string;
  bookingCredits?: number;
  originalAmount?: number;
  discountAmount?: number;
  netAmount?: number;
  gstAmount?: number;
  totalAmount?: number;
}

export const OrderSummaryScreen: React.FC<OrderSummaryScreenProps> = ({
  onBack,
  workspaceName = "awfis - Kirsh Cubical",
  location = "Thaltej, Ahmedabad",
  bookingCredits = 300,
  originalAmount = 450.00,
  discountAmount = 90.00,
  netAmount = 360.00,
  gstAmount = 64.80,
  totalAmount = 424.80,
}) => {
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleProceedToPay = () => {
    // Handle proceed to payment
    console.log('Proceed to pay pressed');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Summary</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Workspace Info */}
        <View style={styles.workspaceSection}>
          <View style={styles.workspaceInfo}>
            <Text style={styles.workspaceName}>{workspaceName}</Text>
            <Text style={styles.workspaceLocation}>{location}</Text>
          </View>
          <View style={styles.creditsContainer}>
            <Ionicons name="flash" size={16} color={Colors.primary} />
            <Text style={styles.creditsText}>{bookingCredits} credits</Text>
          </View>
        </View>

        {/* Coupon/Referral Section */}
        <TouchableOpacity 
          style={styles.couponSection}
          onPress={() => setShowCouponInput(!showCouponInput)}
        >
          <View style={styles.couponLeft}>
            <Ionicons name="pricetag" size={24} color={Colors.text.primary} />
            <View style={styles.couponContent}>
              <Text style={styles.couponTitle}>Apply Coupon/Referral Code</Text>
              <View style={styles.couponAvailable}>
                <Text style={styles.couponCount}>1 coupons available</Text>
                <Ionicons name="pricetag" size={16} color={Colors.success} />
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>

        {/* GST Details Section */}
        <TouchableOpacity style={styles.gstSection}>
          <View style={styles.gstLeft}>
            <Ionicons name="document-text" size={24} color={Colors.text.primary} />
            <Text style={styles.gstTitle}>Add GST Details</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>

        {/* Bill Details */}
        <View style={styles.billSection}>
          <Text style={styles.billTitle}>Bill Details</Text>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Booking Amount</Text>
            <View style={styles.billValueContainer}>
              <Ionicons name="flash" size={16} color={Colors.primary} />
              <Text style={styles.billValue}>{bookingCredits} credits</Text>
            </View>
          </View>

          <View style={styles.billRow}>
            <View style={styles.billLabelContainer}>
              <Text style={styles.billLabel}>Amount (in ₹)</Text>
              <Ionicons name="information-circle-outline" size={16} color={Colors.text.secondary} />
            </View>
            <Text style={styles.billValue}>₹{originalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discount (20%)</Text>
            <Text style={styles.billDiscount}>- ₹{discountAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Net Amount</Text>
            <Text style={styles.billValue}>₹{netAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Tax - 18% GST</Text>
            <Text style={styles.billValue}>₹{gstAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Assurance Section */}
        <View style={styles.assuranceSection}>
          <View style={styles.assuranceHeader}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            <Text style={styles.assuranceTitle}>GateMan Assurance</Text>
            <Ionicons name="information-circle-outline" size={16} color={Colors.text.secondary} />
          </View>
          
          <View style={styles.assuranceItems}>
            <View style={styles.assuranceItem}>
              <Ionicons name="pricetag" size={16} color={Colors.text.secondary} />
              <Text style={styles.assuranceText}>Lowest Price Guaranteed</Text>
            </View>
            <View style={styles.assuranceItem}>
              <Ionicons name="time" size={16} color={Colors.text.secondary} />
              <Text style={styles.assuranceText}>1-click Free Cancellation</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToPay}>
          <Text style={styles.proceedButtonText}>Proceed to pay ₹{totalAmount.toFixed(2)}</Text>
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
    marginLeft: Spacing.md,
  },
  headerSpacer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  workspaceSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workspaceInfo: {
    flex: 1,
  },
  workspaceName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  workspaceLocation: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  creditsText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  couponSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  couponContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  couponTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  couponAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponCount: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    marginRight: Spacing.xs,
  },
  gstSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gstLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gstTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    marginLeft: Spacing.md,
  },
  billSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  billTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  billLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  billValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billValue: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  billDiscount: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: FontWeights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  assuranceSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  assuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  assuranceTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  assuranceItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assuranceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assuranceText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  bottomSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  proceedButton: {
    backgroundColor: '#3B4CB8',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
});
