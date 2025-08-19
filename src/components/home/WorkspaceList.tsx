import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '../../constants/theme';
import { Workspace } from '../../types';
import { WorkspaceCard } from './WorkspaceCard';

interface WorkspaceListProps {
  workspaces: Workspace[];
  selectedLocation: string;
  onWorkspacePress: (workspace: Workspace) => void;
  onBookPress: (workspace: Workspace) => void;
  onFavoritePress?: (workspace: Workspace) => void;
  onViewAllPress: () => void;
}

export const WorkspaceList: React.FC<WorkspaceListProps> = ({
  workspaces,
  selectedLocation,
  onWorkspacePress,
  onBookPress,
  onFavoritePress,
  onViewAllPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Workspaces in {selectedLocation}
        </Text>
        <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            onPress={onWorkspacePress}
            onBookPress={onBookPress}
            onFavoritePress={onFavoritePress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  viewAllText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  listContainer: {
    paddingBottom: Spacing.xl,
  },
});
