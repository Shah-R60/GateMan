import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../../constants/theme';
import { ServiceType } from '../../types';

interface ServiceTypeSelectorProps {
  serviceTypes: ServiceType[];
  onServicePress: (service: ServiceType) => void;
}

export const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  serviceTypes,
  onServicePress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you looking for?</Text>
      <View style={styles.servicesContainer}>
        {serviceTypes.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={() => onServicePress(service)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: service.imageUrl }}
              style={styles.serviceImage}
              resizeMode="cover"
            />
            <View style={styles.serviceOverlay}>
              <Text style={styles.serviceName}>{service.name}</Text>
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
    paddingVertical: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceCard: {
    flex: 1,
    height: 120,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceName: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },
});
