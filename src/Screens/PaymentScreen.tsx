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
import { CreditsScreen } from './CreditsScreen';
import { OrderSummaryScreen } from './OrderSummaryScreen';

const { width } = Dimensions.get('window');

interface PaymentScreenProps {
  onBack: () => void;
  bookingAmount: number;
  totalPrice: number;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  onBack,
  bookingAmount = 300,
  totalPrice = 360,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'wallet' | 'preferred'>('wallet');
  const [userCredits] = useState(0);
  const [showCreditsScreen, setShowCreditsScreen] = useState(false);
  const [showOrderSummaryScreen, setShowOrderSummaryScreen] = useState(false);
  
  const originalPrice = 450;
  const discountPercent = 20;
  
  const handleAddCredits = () => {
    // Handle add credits logic
    console.log('Add credits pressed');
  };

  const handlePayForBooking = () => {
    // Navigate to order summary screen for preferred payment method
    setShowOrderSummaryScreen(true);
  };

  // Conditional rendering for CreditsScreen
  if (showCreditsScreen) {
    return <CreditsScreen onBack={() => setShowCreditsScreen(false)} />;
  }

  // Conditional rendering for OrderSummaryScreen
  if (showOrderSummaryScreen) {
    return (
      <OrderSummaryScreen 
        onBack={() => setShowOrderSummaryScreen(false)}
        bookingCredits={bookingAmount}
        originalAmount={450}
        discountAmount={90}
        netAmount={totalPrice}
        gstAmount={64.8}
        totalAmount={424.8}
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
          <View style={styles.headerSpacer} />
          <TouchableOpacity style={styles.creditsContainer} onPress={() => setShowCreditsScreen(true)}>
            <Ionicons name="card" size={16} color={Colors.primary} />
            <Text style={styles.creditsText}>{userCredits} credits</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Booking Amount Section */}
        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Booking Amount</Text>
            <View style={styles.amountContainer}>
              <Ionicons name="flash" size={16} color={Colors.primary} />
              <Text style={styles.amountValue}>{bookingAmount} credits</Text>
            </View>
          </View>
          
          <View style={styles.equivalentRow}>
            <View style={styles.equivalentLeft}>
              <Text style={styles.equivalentLabel}>Equivalent (in ₹)</Text>
              <Ionicons name="information-circle-outline" size={16} color={Colors.text.secondary} />
            </View>
            <View style={styles.equivalentRight}>
              <View style={styles.discountContainer}>
                <Ionicons name="pricetag" size={14} color={Colors.text.secondary} />
                <Text style={styles.discountText}>{discountPercent}% OFF</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>₹{originalPrice}</Text>
                <Text style={styles.finalPrice}>₹{totalPrice}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>How would you like to pay</Text>
          
          {/* Recommended - GateMan Wallet */}
          <View style={styles.paymentOption}>
            <View style={styles.recommendedBadge}>
              <Ionicons name="star" size={12} color={Colors.white} />
              <Text style={styles.recommendedText}>Recommended</Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.paymentMethodContainer,
                selectedPaymentMethod === 'wallet' && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod('wallet')}
            >
              <View style={styles.radioButton}>
                {selectedPaymentMethod === 'wallet' && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              
              <View style={styles.paymentMethodContent}>
                <View style={styles.paymentMethodHeader}>
                  <Text style={styles.paymentMethodTitle}>Pay with GateMan Wallet</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>Get additional discount</Text>
                  </View>
                </View>
                
                <Text style={styles.paymentMethodDescription}>
                  Add credits in your wallet and pay for this booking at a discount
                </Text>
                
                <View style={styles.walletInfo}>
                  <View style={styles.creditsInfo}>
                    <Ionicons name="card" size={16} color={Colors.primary} />
                    <Text style={styles.creditsAmount}>{userCredits} credits</Text>
                  </View>
                  <View style={styles.balanceWarning}>
                    <Ionicons name="warning" size={14} color={Colors.warning} />
                    <Text style={styles.balanceWarningText}>Insufficient Balance</Text>
                  </View>
                </View>
                
                <View style={styles.benefits}>
                  <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.benefitText}>Book workspaces hassle free with 1-click</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.benefitText}>Get additional discount on adding credits in GateMan Wallet</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Preferred Payment Method */}
          <TouchableOpacity
            style={[
              styles.paymentMethodContainer,
              styles.preferredPaymentMethod,
              selectedPaymentMethod === 'preferred' && styles.selectedPaymentMethod
            ]}
            onPress={() => setSelectedPaymentMethod('preferred')}
          >
            <View style={styles.radioButton}>
              {selectedPaymentMethod === 'preferred' && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
            
            <View style={styles.paymentMethodContent}>
              <Text style={styles.paymentMethodTitle}>Pay with preferred payment method</Text>
              <Text style={styles.paymentMethodDescription}>
                Pay for this booking directly in INR
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <Text style={styles.additionalInfo}>*Additional GST may apply</Text>

        {/* GateMan Assurance */}
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
        <TouchableOpacity 
          style={styles.addCreditsButton} 
          onPress={selectedPaymentMethod === 'wallet' ? handleAddCredits : handlePayForBooking}
        >
          <Text style={styles.addCreditsButtonText}>
            {selectedPaymentMethod === 'wallet' 
              ? 'Add Credits in Next Step' 
              : 'Pay for this Booking'
            }
          </Text>
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
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    flex: 1,
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
  },
  amountSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  amountLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
    marginLeft: 4,
  },
  equivalentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  equivalentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equivalentLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginRight: 4,
  },
  equivalentRight: {
    alignItems: 'flex-end',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  discountText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  finalPrice: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  paymentSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  paymentOption: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: Colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  recommendedText: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    marginLeft: 2,
    fontWeight: FontWeights.medium,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    backgroundColor: Colors.gray[100],
  },
  selectedPaymentMethod: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  preferredPaymentMethod: {
    backgroundColor: Colors.white,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  paymentMethodContent: {
    flex: 1,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  paymentMethodTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  discountBadge: {
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountBadgeText: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    fontWeight: FontWeights.medium,
  },
  paymentMethodDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  walletInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  creditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsAmount: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: FontWeights.medium,
  },
  balanceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceWarningText: {
    fontSize: FontSizes.xs,
    color: Colors.warning,
    marginLeft: 4,
    fontWeight: FontWeights.medium,
  },
  benefits: {
    gap: Spacing.xs,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  additionalInfo: {
    fontSize: FontSizes.xs,
    color: Colors.text.light,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  assuranceSection: {
    backgroundColor: Colors.primary + '08',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  assuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  assuranceTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginLeft: 6,
    flex: 1,
  },
  assuranceItems: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  assuranceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assuranceText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginLeft: 4,
    fontWeight: FontWeights.medium,
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
  addCreditsButton: {
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
  addCreditsButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
});
