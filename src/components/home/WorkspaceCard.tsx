import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../../constants/theme';
import { Workspace } from '../../types';
import { ImageCarousel } from '../common/ImageCarousel';

interface WorkspaceCardProps {
  workspace: Workspace;
  onPress: (workspace: Workspace) => void;
  onBookPress: (workspace: Workspace) => void;
  onFavoritePress?: (workspace: Workspace) => void;
  onSharePress?: (workspace: Workspace) => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  onPress,
  onBookPress,
  onFavoritePress,
  onSharePress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(workspace)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <ImageCarousel
          images={workspace.images || [workspace.imageUrl]}
          height={250}
          showIndicators={true}
          showNavigation={true}
          borderRadius={BorderRadius.lg}
        />
        {workspace.isPopular && (
          <View style={styles.popularBadge}>
            <Ionicons name="star" size={12} color={Colors.white} />
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => onSharePress?.(workspace)}
          activeOpacity={0.8}
        >
          <Ionicons name="share-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onFavoritePress?.(workspace)}
          activeOpacity={0.8}
        >
          <Ionicons name="heart-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {workspace.name}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {workspace.location} • {workspace.distance}
        </Text>
        
        <View style={styles.timeContainer}>
          <Ionicons
            name="time-outline"
            size={16}
            color={Colors.text.secondary}
          />
          <Text style={styles.timeText}>{workspace.hours}</Text>
        </View>

        {workspace.seatingTypes && (
          <View style={styles.seatingContainer}>
            {workspace.seatingTypes.map((seating, index) => (
              <View key={index} style={styles.seatingType}>
                <View
                  style={[
                    styles.seatingIndicator,
                    {
                      backgroundColor: seating.available
                        ? Colors.success
                        : Colors.error,
                    },
                  ]}
                />
                <Text style={styles.seatingText}>• {seating.type}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {workspace.currency}{workspace.price?.toLocaleString('en-IN') || '0'}
              </Text>
              <Text style={styles.period}>/{workspace.period}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => onBookPress(workspace)}
            activeOpacity={0.8}
          >
            <Text style={styles.bookButtonText}>Book Desk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  popularText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginLeft: 4,
  },
  shareButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md + 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  content: {
    padding: Spacing.md,
  },
  name: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  timeText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  seatingContainer: {
    marginBottom: Spacing.md,
  },
  seatingType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  seatingIndicator: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
  },
  seatingText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  period: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: 2,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
});
