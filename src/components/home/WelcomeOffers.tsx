import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../../constants/theme';
import { Offer } from '../../types';

interface WelcomeOffersProps {
  offers: Offer[];
  onOfferPress?: (offer: Offer) => void;
}

export const WelcomeOffers: React.FC<WelcomeOffersProps> = ({
  offers,
  onOfferPress,
}) => {
  if (!offers.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.offersContainer}>
        {offers.map((offer, index) => (
          <TouchableOpacity
            key={offer.id}
            style={[
              styles.offerCard,
              {
                backgroundColor: offer.backgroundColor,
                flex: index === 0 ? 1.2 : 1,
                marginRight: index === 0 ? Spacing.sm : 0,
              },
            ]}
            onPress={() => onOfferPress?.(offer)}
            activeOpacity={0.8}
          >
            <View style={styles.offerContent}>
              <Text
                style={[
                  styles.offerTitle,
                  { color: offer.textColor },
                ]}
              >
                {offer.title}
              </Text>
              <Text
                style={[
                  styles.discountText,
                  { color: offer.textColor },
                ]}
              >
                {offer.discount}
              </Text>
              <Text
                style={[
                  styles.descriptionText,
                  { color: offer.textColor },
                ]}
              >
                {offer.description}
              </Text>
              <View
                style={[
                  styles.codeContainer,
                  {
                    backgroundColor:
                      offer.backgroundColor === Colors.secondary
                        ? 'rgba(255, 255, 255, 0.2)'
                        : offer.backgroundColor,
                    borderWidth: offer.backgroundColor !== Colors.secondary ? 1 : 0,
                    borderColor: offer.textColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.codeText,
                    { color: offer.textColor },
                  ]}
                >
                  Use code {offer.code}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  offersContainer: {
    flexDirection: 'row',
  },
  offerCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 120,
  },
  offerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  offerTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  discountText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.sm,
  },
  codeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  codeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
});
