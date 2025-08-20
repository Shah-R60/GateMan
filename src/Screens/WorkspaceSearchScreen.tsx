import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { Workspace } from '../types';

interface WorkspaceSearchScreenProps {
  currentCity: string;
  onWorkspaceSelect: (workspace: Workspace) => void;
  onBack: () => void;
  onWorkspacePress?: (workspace: Workspace) => void;
}

// Mock workspace data based on the UI design
const popularWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'Oyo Workflo - Mayuransh Elanza',
    location: 'Satellite, Ahmedabad',
    distance: '2.5 km',
    rating: 4.5,
    price: 299,
    currency: '₹',
    period: '/day',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
    hours: 'Open 24 hours',
    amenities: ['WiFi', 'AC', 'Parking'],
  },
  {
    id: '2',
    name: 'awfis - Kirsh Cubical',
    location: 'Thaltej, Ahmedabad',
    distance: '3.2 km',
    rating: 4.3,
    price: 399,
    currency: '₹',
    period: '/day',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
    hours: 'Open 24 hours',
    amenities: ['WiFi', 'AC', 'Meeting Rooms'],
  },
  {
    id: '3',
    name: 'awfis - RE11',
    location: 'Ambli, Ahmedabad',
    distance: '4.1 km',
    rating: 4.4,
    price: 349,
    currency: '₹',
    period: '/day',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
    hours: 'Open 24 hours',
    amenities: ['WiFi', 'AC', 'Cafeteria'],
  },
  {
    id: '4',
    name: 'DevX - Binori',
    location: 'Bodakdev, Ahmedabad',
    distance: '1.8 km',
    rating: 4.2,
    price: 299,
    currency: '₹',
    period: '/day',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
    hours: 'Open 24 hours',
    amenities: ['WiFi', 'AC', 'Parking'],
  },
  {
    id: '5',
    name: 'MyBranch - Ellis bridge Corner',
    location: 'Ashram Road, Ahmedabad',
    distance: '5.3 km',
    rating: 4.1,
    price: 279,
    currency: '₹',
    period: '/day',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
    hours: 'Open 24 hours',
    amenities: ['WiFi', 'AC', 'Meeting Rooms'],
  },
  {
    id: '6',
    name: 'DevX - Vastrapur',
    location: 'Vastrapur, Ahmedabad',
    distance: '3.7 km',
    rating: 4.3,
    price: 329,
    currency: '₹',
    period: '/day',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
    hours: 'Open 24 hours',
    amenities: ['WiFi', 'AC', 'Parking'],
  },
];

export const WorkspaceSearchScreen: React.FC<WorkspaceSearchScreenProps> = ({
  currentCity,
  onWorkspaceSelect,
  onBack,
  onWorkspacePress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNearMe, setShowNearMe] = useState(false);

  const filteredWorkspaces = popularWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWorkspacePress = (workspace: Workspace) => {
    if (onWorkspacePress) {
      onWorkspacePress(workspace);
    } else {
      onWorkspaceSelect(workspace);
      onBack();
    }
  };

  const handleShowNearMe = () => {
    setShowNearMe(true);
    // In a real app, this would trigger location-based filtering
    console.log('Show workspaces near me');
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Search workspaces in {currentCity}</Text>
            <TouchableOpacity style={styles.cityButton}>
              <Text style={styles.cityButtonText}>{currentCity}</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

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
              placeholder="Try : Oyo Workflo - Mayuransh Elanza"
              placeholderTextColor={Colors.text.light}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        </View>

        {/* Show Near Me Button */}
        <TouchableOpacity style={styles.nearMeButton} onPress={handleShowNearMe}>
          <Ionicons name="location" size={20} color={Colors.primary} />
          <Text style={styles.nearMeText}>Show workspaces near me</Text>
        </TouchableOpacity>

        {/* Popular Workspaces Section */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Popular workspaces in {currentCity}</Text>
            
            <View style={styles.workspacesList}>
              {filteredWorkspaces.map((workspace) => (
                <TouchableOpacity
                  key={workspace.id}
                  style={styles.workspaceItem}
                  onPress={() => handleWorkspacePress(workspace)}
                  activeOpacity={0.7}
                >
                  <View style={styles.workspaceIcon}>
                    <Ionicons name="business" size={18} color={Colors.text.secondary} />
                  </View>
                  <View style={styles.workspaceContent}>
                    <Text style={styles.workspaceName}>{workspace.name}</Text>
                    <Text style={styles.workspaceLocation}>{workspace.location}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {filteredWorkspaces.length === 0 && searchQuery.length > 0 && (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={48} color={Colors.text.light} />
                <Text style={styles.noResultsText}>No workspaces found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching with different keywords
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginRight: 4,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    paddingVertical: Spacing.xs,
  },
  nearMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  nearMeText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.sm,
  },
  scrollContainer: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  workspacesList: {
    paddingBottom: Spacing.xl,
  },
  workspaceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  workspaceIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  workspaceContent: {
    flex: 1,
  },
  workspaceName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  workspaceLocation: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.md,
  },
  noResultsText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  noResultsSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    textAlign: 'center',
  },
});
