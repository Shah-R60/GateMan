import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';

interface FilterOption {
  id: string;
  label: string;
  description?: string;
}

interface FilterState {
  sortBy: string;
  spaceType: string;
  brands: string[];
  timings: string[];
  parking: boolean;
  metroConnectivity: boolean;
  priceRange: {
    min: number;
    max: number;
  };
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const sortOptions: FilterOption[] = [
  { id: 'popularity', label: 'Popularity' },
  { id: 'price-low', label: 'Price (L-H)' },
  { id: 'price-high', label: 'Price (H-L)' },
  { id: 'distance', label: 'Distance (from city center)' },
];

const spaceTypeOptions: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'coworking', label: 'Coworking Space' },
  { id: 'work-cafe', label: 'Work Cafe' },
];

const brandOptions: FilterOption[] = [
  { id: 'awfis', label: 'Awfis' },
  { id: 'workflow-oyo', label: 'Workflow by OYO' },
  { id: 'angel-coworking', label: 'Angel Coworking' },
  { id: 'devx', label: 'Devx' },
  { id: 'karyaco', label: 'Karyaco' },
  { id: 'mybranch', label: 'MyBranch' },
];

const timingOptions: FilterOption[] = [
  { id: 'open-now', label: 'Open Now' },
  { id: 'opens-early', label: 'Opens Early', description: '(Opens before 9 am)' },
  { id: 'closes-late', label: 'Closes Late', description: '(Closes after 7 pm)' },
];

const defaultFilters: FilterState = {
  sortBy: 'popularity',
  spaceType: 'all',
  brands: [],
  timings: [],
  parking: false,
  metroConnectivity: false,
  priceRange: {
    min: 250,
    max: 800,
  },
};

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  initialFilters = defaultFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleSortByChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const handleSpaceTypeChange = (spaceType: string) => {
    setFilters(prev => ({ ...prev, spaceType }));
  };

  const handleBrandToggle = (brandId: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter(id => id !== brandId)
        : [...prev.brands, brandId],
    }));
  };

  const handleTimingToggle = (timingId: string) => {
    setFilters(prev => ({
      ...prev,
      timings: prev.timings.includes(timingId)
        ? prev.timings.filter(id => id !== timingId)
        : [...prev.timings, timingId],
    }));
  };

  const handleParkingToggle = () => {
    setFilters(prev => ({ ...prev, parking: !prev.parking }));
  };

  const handleMetroToggle = () => {
    setFilters(prev => ({ ...prev, metroConnectivity: !prev.metroConnectivity }));
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: value,
      },
    }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const renderRadioOption = (
    options: FilterOption[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.optionsContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.radioOption}
          onPress={() => onSelect(option.id)}
        >
          <View style={styles.radioButton}>
            {selectedValue === option.id && <View style={styles.radioButtonSelected} />}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioText}>{option.label}</Text>
            {option.description && (
              <Text style={styles.radioDescription}>{option.description}</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCheckboxOption = (
    options: FilterOption[],
    selectedValues: string[],
    onToggle: (value: string) => void
  ) => (
    <View style={styles.optionsContainer}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.id);
        return (
          <TouchableOpacity
            key={option.id}
            style={styles.checkboxOption}
            onPress={() => onToggle(option.id)}
          >
            <View style={[
              styles.checkbox,
              isSelected && styles.checkboxSelected
            ]}>
              {isSelected && (
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              )}
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxText}>{option.label}</Text>
              {option.description && (
                <Text style={styles.checkboxDescription}>{option.description}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderSingleCheckbox = (
    label: string,
    value: boolean,
    onToggle: () => void
  ) => (
    <View style={styles.optionsContainer}>
      <TouchableOpacity style={styles.checkboxOption} onPress={onToggle}>
        <View style={[
          styles.checkbox,
          value && styles.checkboxSelected
        ]}>
          {value && <Ionicons name="checkmark" size={16} color={Colors.white} />}
        </View>
        <Text style={styles.checkboxText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={styles.resetText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Sort By Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            {renderRadioOption(sortOptions, filters.sortBy, handleSortByChange)}
          </View>

          {/* Space Type Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Space Type</Text>
            {renderRadioOption(spaceTypeOptions, filters.spaceType, handleSpaceTypeChange)}
          </View>

          {/* Brands Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brands</Text>
            {renderCheckboxOption(brandOptions, filters.brands, handleBrandToggle)}
          </View>

          {/* Timings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timings</Text>
            {renderCheckboxOption(timingOptions, filters.timings, handleTimingToggle)}
          </View>

          {/* Parking Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parking</Text>
            {renderSingleCheckbox('Spaces with parking', filters.parking, handleParkingToggle)}
          </View>

          {/* Metro Connectivity Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metro Connectivity</Text>
            {renderSingleCheckbox(
              'Spaces with metro connectivity',
              filters.metroConnectivity,
              handleMetroToggle
            )}
          </View>

          {/* Price per day Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price per day</Text>
            <View style={styles.priceRangeContainer}>
              {/* Custom Price Slider */}
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View style={styles.sliderActiveTrack} />
                  <View style={[styles.sliderThumb, { left: '20%' }]} />
                  <View style={[styles.sliderThumb, { right: '20%' }]} />
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>{filters.priceRange.min}</Text>
                  <Text style={styles.sliderLabel}>{filters.priceRange.max}</Text>
                </View>
              </View>
              
              <View style={styles.priceInputsContainer}>
                <View style={styles.priceInputGroup}>
                  <Text style={styles.priceInputLabel}>Minimum</Text>
                  <View style={styles.priceInputContainer}>
                    <TextInput
                      style={styles.priceInput}
                      value={filters.priceRange.min.toString()}
                      onChangeText={(text) => 
                        handlePriceRangeChange('min', parseInt(text) || 250)
                      }
                      keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.priceEditButton}>
                      <Ionicons name="create" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.priceInputGroup}>
                  <Text style={styles.priceInputLabel}>Maximum</Text>
                  <View style={styles.priceInputContainer}>
                    <TextInput
                      style={styles.priceInput}
                      value={filters.priceRange.max.toString()}
                      onChangeText={(text) => 
                        handlePriceRangeChange('max', parseInt(text) || 800)
                      }
                      keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.priceEditButton}>
                      <Ionicons name="create" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.applyButtonContainer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>Apply filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  resetText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  optionsContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioTextContainer: {
    flex: 1,
  },
  radioText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  radioDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  checkboxDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  priceRangeContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  sliderContainer: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    position: 'relative',
    marginVertical: Spacing.md,
  },
  sliderActiveTrack: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    shadowColor: Colors.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  sliderLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
  },
  priceInputsContainer: {
    gap: Spacing.md,
  },
  priceInputGroup: {
    marginBottom: Spacing.sm,
  },
  priceInputLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.white,
  },
  priceInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  priceEditButton: {
    padding: Spacing.xs,
  },
  bottomSpacing: {
    height: 100,
  },
  applyButtonContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
});
