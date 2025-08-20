import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearchPress?: () => void;
  onPress?: () => void;
  editable?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search workspaces...',
  value,
  onChangeText,
  onSearchPress,
  onPress,
  editable = true,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  if (onPress && !editable) {
    // Render as clickable, non-editable
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.searchContainer} onPress={handlePress}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.text.secondary}
            style={styles.searchIcon}
          />
          <Text style={styles.placeholderText}>
            {placeholder}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchContainer} onPress={handlePress} disabled={!onPress}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.light}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={onSearchPress}
          editable={editable}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  placeholderText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.light,
    paddingVertical: Spacing.xs,
  },
});
