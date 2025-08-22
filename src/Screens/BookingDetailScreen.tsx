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

interface BookingDetailScreenProps {
  onNavigateToWorkspaceSearch?: () => void;
  onBack?: () => void;
}

export const BookingDetailScreen: React.FC<BookingDetailScreenProps> = ({
  onNavigateToWorkspaceSearch,
  onBack
}) => {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'others'>('upcoming');
  const [selectedFilters, setSelectedFilters] = useState({
    desk: true,
    meetingRoom: true,
  });

  const toggleFilter = (filter: 'desk' | 'meetingRoom') => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleBookWorkspace = () => {
    // Navigate to workspace search/booking flow
    if (onNavigateToWorkspaceSearch) {
      onNavigateToWorkspaceSearch();
    }
    console.log('Navigate to workspace booking');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bookings</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'upcoming' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'upcoming' && styles.activeTabText
            ]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'others' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('others')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'others' && styles.activeTabText
            ]}>
              Others
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => toggleFilter('desk')}
          >
            <View style={[
              styles.checkbox,
              selectedFilters.desk && styles.checkedCheckbox
            ]}>
              {selectedFilters.desk && (
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              )}
            </View>
            <Text style={styles.filterText}>Desk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => toggleFilter('meetingRoom')}
          >
            <View style={[
              styles.checkbox,
              selectedFilters.meetingRoom && styles.checkedCheckbox
            ]}>
              {selectedFilters.meetingRoom && (
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              )}
            </View>
            <Text style={styles.filterText}>Meeting Room</Text>
          </TouchableOpacity>
        </View>

        {/* No Bookings State */}
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateContent}>
            <Text style={styles.emptyStateTitle}>No Bookings</Text>
            <Text style={styles.emptyStateMessage}>
              You don't have any bookings. Try booking a workspace near you.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Book Workspace Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookWorkspace}>
          <Text style={styles.bookButtonText}>Book a workspace near you</Text>
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
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B4CB8',
  },
  tabText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    fontWeight: FontWeights.medium,
  },
  activeTabText: {
    color: '#3B4CB8',
    fontWeight: FontWeights.semibold,
  },
  filtersContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#3B4CB8',
    borderRadius: 4,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#3B4CB8',
  },
  filterText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl * 3,
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyStateMessage: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  bookButton: {
    backgroundColor: '#3B4CB8',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
});
