import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights } from '../../constants/theme';
import { Location } from '../../types';

interface HeaderProps {
  selectedLocation: Location;
  selectedSubLocation?: string;
  onLocationPress: () => void;
  onProfilePress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLocation,
  selectedSubLocation = 'All Locations',
  onLocationPress,
  onProfilePress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.locationContainer} onPress={onLocationPress}>
          <Ionicons
            name="location-outline"
            size={20}
            color={Colors.text.secondary}
          />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationText}>{selectedLocation.city}</Text>
            <Text style={styles.subLocationText}>{selectedSubLocation}</Text>
          </View>
          <Ionicons
            name="chevron-down"
            size={16}
            color={Colors.text.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
          <Ionicons
            name="person-circle-outline"
            size={28}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.white,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTextContainer: {
    marginLeft: Spacing.sm,
    marginRight: Spacing.xs,
  },
  locationText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  subLocationText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  profileButton: {
    padding: Spacing.xs,
  },
});
