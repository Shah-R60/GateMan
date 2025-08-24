import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';

interface ProfileScreenProps {
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const handleUpdatePress = () => {
    Alert.alert('Update', 'App update functionality would be implemented here');
  };

  const handleViewProfilePress = () => {
    Alert.alert('View Profile', 'View profile functionality would be implemented here');
  };

  const handleMenuItemPress = (item: string) => {
    Alert.alert(item, `${item} functionality would be implemented here`);
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          Alert.alert('Logged Out', 'You have been logged out');
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SS</Text>
            </View>
          </View>
          <Text style={styles.userName}>Shah Saurabh</Text>
          <TouchableOpacity style={styles.viewProfileButton} onPress={handleViewProfilePress}>
            <Text style={styles.viewProfileText}>View profile</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Email Update Notice */}
        <View style={styles.noticeContainer}>
          <Ionicons name="information-circle" size={20} color={Colors.gray[400]} />
          <Text style={styles.noticeText}>Please update the email address in profile</Text>
        </View>

        {/* App Update Section */}
        {/* <View style={styles.updateSection}>
          <View style={styles.updateIconContainer}>
            <Ionicons name="phone-portrait-outline" size={24} color={Colors.gray[400]} />
          </View>
          <View style={styles.updateContent}>
            <Text style={styles.updateVersion}>Version 3.4.5</Text>
            <Text style={styles.updateText}>App Update Available</Text>
          </View>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePress}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View> */}

        {/* Flexi Pass Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Flexi Pass</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('My Wallet')}>
            <Ionicons name="wallet-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>My Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('My Shortlisted Workspaces')}>
            <Ionicons name="heart-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>My Shortlisted Workspaces</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('My Guests')}>
            <Ionicons name="people-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>My Guests</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('My Payments')}>
            <Ionicons name="card-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>My Payments</Text>
          </TouchableOpacity>
        </View>

        {/* Team Flexi Pass Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Team Flexi Pass</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('Explore Team Flexi Pass')}>
            <Ionicons name="calendar-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>Explore Team Flexi Pass</Text>
          </TouchableOpacity>
        </View>

        {/* GateMan Community Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>GateMan Community</Text>
            <Text style={styles.communityIcon}>⚡</Text>
          </View>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('Community Feed')}>
            <Ionicons name="globe-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>Community Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('Community Benefits')}>
            <Ionicons name="flash-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>Community Benefits</Text>
          </TouchableOpacity>
        </View>

        {/* Other Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Other</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('Refer & Earn')}>
            <Ionicons name="gift-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>Refer & Earn</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('Other Office Solutions')}>
            <Ionicons name="business-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>Other Office Solutions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('Help & Support')}>
            <Ionicons name="help-circle-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('Preferences')}>
            <Ionicons name="options-outline" size={20} color={Colors.gray[400]} />
            <Text style={styles.menuItemText}>Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogoutPress}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={[styles.menuItemText, { color: Colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    marginRight: 4,
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  noticeText: {
    fontSize: FontSizes.sm,
    color: Colors.gray[400],
    marginLeft: Spacing.sm,
  },
  updateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  updateIconContainer: {
    marginRight: Spacing.md,
  },
  updateContent: {
    flex: 1,
  },
  updateVersion: {
    fontSize: FontSizes.sm,
    color: Colors.gray[400],
    marginBottom: 2,
  },
  updateText: {
    fontSize: FontSizes.md,
    color: Colors.black,
    fontWeight: FontWeights.medium,
  },
  updateButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  updateButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  sectionContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  communityIcon: {
    fontSize: 16,
    marginLeft: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  menuItemText: {
    fontSize: FontSizes.md,
    color: Colors.black,
    marginLeft: Spacing.md,
  },
  bottomSpacing: {
    height: 100,
  },
});
