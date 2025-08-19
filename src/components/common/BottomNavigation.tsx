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
import { TabNavigationType } from '../../types';

interface TabItem {
  key: TabNavigationType;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface BottomNavigationProps {
  activeTab: TabNavigationType;
  onTabPress: (tab: TabNavigationType) => void;
}

const tabs: TabItem[] = [
  { key: 'Home', title: 'Home', icon: 'home' },
  { key: 'Desks', title: 'Desks', icon: 'desktop' },
  { key: 'Meeting Rooms', title: 'Meeting Rooms', icon: 'people' },
  { key: 'Bookings', title: 'Bookings', icon: 'checkmark-circle' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.icon : `${tab.icon}-outline` as any}
                size={24}
                color={isActive ? Colors.primary : Colors.text.secondary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? Colors.primary : Colors.text.secondary },
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  tabText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginTop: 4,
    textAlign: 'center',
  },
});
