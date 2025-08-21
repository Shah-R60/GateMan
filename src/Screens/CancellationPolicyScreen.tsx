import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';

interface CancellationPolicyScreenProps {
  onBack: () => void;
  workspaceName?: string;
}

export const CancellationPolicyScreen: React.FC<CancellationPolicyScreenProps> = ({
  onBack,
  workspaceName = 'awfis',
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cancellation Policy</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.introText}>
            These are the cancellation policies for {workspaceName}. Other workspaces may have different cancellation policies
          </Text>
        </View>

        {/* When can I cancel the booking? */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When can I cancel the booking?</Text>
          <Text style={styles.sectionContent}>
            You can cancel your booking until 23:59PM before the visit date.
          </Text>
        </View>

        {/* Cancelling on the day of the visit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cancelling on the day of the visit</Text>
          <Text style={styles.sectionContent}>
            Your visits and credits will be refunded only if you cancel before the deadline
          </Text>
        </View>

        {/* How can I cancel the booking? */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How can I cancel the booking ?</Text>
          
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>
              After you have booked a workspace, you will be able to see the booking on "Bookings" tab on the app.
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>
              Go to "Upcoming" Bookings, and select the Booking you want to cancel. (Note: If you have booked a workspace for multiple dates, it will show as separate bookings)
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>
              Cancel the booking (Note: Please note that you can cancel your booking only if you comply with the cancellation policy of the workspace)
            </Text>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <View style={styles.supportHeader}>
            <View style={styles.supportIcon}>
              <Text style={styles.questionMark}>?</Text>
            </View>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Still have doubts?</Text>
              <Text style={styles.supportSubtitle}>
                Got questions about booking {workspaceName} - RE11?
              </Text>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect with GateMan experts</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
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
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  introText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  sectionContent: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.sm,
    minWidth: 20,
  },
  stepText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    flex: 1,
  },
  supportSection: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  supportIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  questionMark: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.light,
    marginBottom: Spacing.xs,
  },
  supportSubtitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.xs,
  },
});
