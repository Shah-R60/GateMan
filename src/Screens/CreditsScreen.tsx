import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';

interface CreditPackage {
  id: string;
  credits: number;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  isMaxSaver?: boolean;
}

interface CreditsScreenProps {
  onBack: () => void;
}

export const CreditsScreen: React.FC<CreditsScreenProps> = ({ onBack }) => {
  const [currentBalance] = useState(0);
  const [showCustomAmount, setShowCustomAmount] = useState(false);

  const creditPackages: CreditPackage[] = [
    {
      id: '1',
      credits: 5000,
      originalPrice: 7500,
      discountPrice: 4725,
      discountPercentage: 30,
      isMaxSaver: true,
    },
    {
      id: '2',
      credits: 3000,
      originalPrice: 4500,
      discountPrice: 2970,
      discountPercentage: 26.67,
    },
    {
      id: '3',
      credits: 1000,
      originalPrice: 1500,
      discountPrice: 1080,
      discountPercentage: 20,
    },
  ];

  const renderCreditPackage = (pkg: CreditPackage) => (
    <View key={pkg.id} style={styles.packageCard}>
      {pkg.isMaxSaver && (
        <View style={styles.maxSaverBadge}>
          <Text style={styles.maxSaverText}>MAX SAVER</Text>
        </View>
      )}
      
      <View style={styles.packageHeader}>
        <Text style={styles.getLabel}>Get</Text>
        <View style={styles.creditsContainer}>
          <Ionicons name="flash" size={20} color={Colors.primary} />
          <Text style={styles.creditsAmount}>{pkg.credits.toLocaleString()}</Text>
          <Text style={styles.creditsLabel}>credits</Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.atLabel}>at</Text>
        <Text style={styles.originalPrice}>₹{pkg.originalPrice.toLocaleString()}</Text>
        <Text style={styles.discountPrice}>₹{pkg.originalPrice.toLocaleString()}</Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{pkg.discountPercentage}% OFF</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.offerButton}>
        <Ionicons name="pricetag" size={16} color={Colors.white} />
        <Text style={styles.offerButtonText}>
          Offer Price ₹{pkg.discountPrice.toLocaleString()}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <View style={styles.heroIllustration}>
            {/* Placeholder for workspace illustration */}
            <View style={styles.illustrationPlaceholder}>
              <Ionicons name="business" size={120} color={Colors.primary} opacity={0.3} />
            </View>
          </View>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceHeader}>
            <Ionicons name="wallet" size={24} color={Colors.text.primary} />
            <Text style={styles.balanceTitle}>Balance</Text>
          </View>
          <View style={styles.balanceContent}>
            <View style={styles.balanceAmount}>
              <Ionicons name="flash" size={24} color={Colors.primary} />
              <Text style={styles.balanceNumber}>0</Text>
              <Text style={styles.balanceLabel}>credits</Text>
            </View>
            <TouchableOpacity style={styles.passBookButton}>
              <Text style={styles.passBookText}>View Passbook</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Credits Section */}
        <View style={styles.addCreditsSection}>
          <View style={styles.addCreditsHeader}>
            <Text style={styles.addCreditsTitle}>Add Credits</Text>
            <View style={styles.creditRateInfo}>
              <Ionicons name="flash" size={16} color={Colors.primary} />
              <Text style={styles.creditRateText}>1 credit = ₹1.5</Text>
            </View>
          </View>
          
          <Text style={styles.addCreditsSubtitle}>
            Choose from our most purchased plans
          </Text>

          {/* Credit Packages */}
          <View style={styles.packagesContainer}>
            {creditPackages.map(renderCreditPackage)}
          </View>

          {/* Custom Amount Section */}
          <TouchableOpacity
            style={styles.customAmountButton}
            onPress={() => setShowCustomAmount(!showCustomAmount)}
          >
            <Text style={styles.customAmountText}>
              Or, enter any custom credit amount
            </Text>
            <Ionicons
              name={showCustomAmount ? "chevron-up" : "chevron-down"}
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>

          {/* Credits Info */}
          <View style={styles.creditsInfoCard}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} />
            <View style={styles.creditsInfoContent}>
              <Text style={styles.creditsInfoText}>
                These credits* will be added in your wallet, which can be used to book desks and meeting rooms pan-India
              </Text>
              <Text style={styles.creditsValidityText}>
                *Credits validity is 1 year from the date of purchase
              </Text>
            </View>
          </View>

          {/* What Are Credits */}
          <TouchableOpacity style={styles.whatAreCreditsButton}>
            <Ionicons name="help-circle" size={20} color={Colors.primary} />
            <Text style={styles.whatAreCreditsText}>What Are Credits</Text>
          </TouchableOpacity>
        </View>

        {/* Gift Voucher Section */}
        <View style={styles.giftVoucherSection}>
          <View style={styles.giftVoucherContent}>
            <View style={styles.giftIcon}>
              <Ionicons name="gift" size={24} color={Colors.primary} />
            </View>
            <View style={styles.giftTextContent}>
              <Text style={styles.giftTitle}>Have a gift voucher?</Text>
              <Text style={styles.giftSubtitle}>
                Redeem to add credits to your wallet now!
              </Text>
              <TouchableOpacity style={styles.redeemButton}>
                <Text style={styles.redeemButtonText}>Redeem Gift Voucher</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <View style={styles.faqContent}>
            <Ionicons name="help-circle" size={24} color={Colors.primary} />
            <View style={styles.faqTextContent}>
              <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
              <Text style={styles.faqSubtitle}>
                Get help to understand all about GateMan's products
              </Text>
              <TouchableOpacity style={styles.faqButton}>
                <Text style={styles.faqButtonText}>Go to FAQs</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer Stats */}
        <View style={styles.footerStats}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>GateMan</Text>
              <Text style={styles.logoSubtext}>- by Resesvar</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.statItem}>1 Platform</Text>
            <Text style={styles.statItem}>15 Cities</Text>
            <Text style={styles.statItem}>500+ Workspaces</Text>
            <Text style={styles.statItem}>20k+ Paid Users</Text>
          </View>
        </View>
      </ScrollView>
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
  headerSpacer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  heroContainer: {
    backgroundColor: '#E8F4F8',
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  heroIllustration: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  balanceTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.error,
    marginLeft: Spacing.xs,
  },
  balanceLabel: {
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  passBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passBookText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.xs,
  },
  addCreditsSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
  },
  addCreditsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  addCreditsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  creditRateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  creditRateText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  addCreditsSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  packagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  packageCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    position: 'relative',
  },
  maxSaverBadge: {
    position: 'absolute',
    top: -1,
    left: -1,
    backgroundColor: Colors.text.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderTopLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  maxSaverText: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    fontWeight: FontWeights.bold,
  },
  packageHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  getLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsAmount: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  creditsLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  atLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  originalPrice: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    textDecorationLine: 'line-through',
    marginBottom: Spacing.xs,
  },
  discountPrice: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    marginBottom: Spacing.xs,
  },
  discountBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  discountText: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    fontWeight: FontWeights.bold,
  },
  offerButton: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  offerButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.white,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  customAmountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  customAmountText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  creditsInfoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[100],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  creditsInfoContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  creditsInfoText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  creditsValidityText: {
    fontSize: FontSizes.xs,
    color: Colors.text.light,
    fontStyle: 'italic',
  },
  whatAreCreditsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  whatAreCreditsText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.sm,
  },
  giftVoucherSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  giftVoucherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary + '20',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  giftTextContent: {
    flex: 1,
  },
  giftTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  giftSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redeemButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.xs,
  },
  faqSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
  },
  faqContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqTextContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  faqTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  faqSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  faqButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.xs,
  },
  footerStats: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Spacing.md,
  },
  logoPlaceholder: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  logoSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statItem: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    marginBottom: Spacing.xs,
  },
});
