import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { Property } from '../types';

interface DateSelectionScreenProps {
  propertyData: Property;
  onBack: () => void;
  onDateSelect: (dates: string, count: number) => void;
  selectedDate?: string;
}

interface DateOption {
  date: string;
  day: string;
  dayName: string;
  isToday?: boolean;
  isTomorrow?: boolean;
  isAvailable: boolean;
  isClosed?: boolean;
}

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const DateSelectionScreen: React.FC<DateSelectionScreenProps> = ({
  propertyData,
  onBack,
  onDateSelect,
  selectedDate,
}) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // Generate date options for the next 2 weeks based on current date
  const generateDateOptions = (): DateOption[] => {
    const options: DateOption[] = [];
    const currentDate = new Date(); // August 21, 2025
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      
      const day = date.getDate();
      const month = date.getMonth();
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Determine status based on day and dummy data
      const isSunday = dayOfWeek === 0;
      let isAvailable = true;
      let isClosed = false;
      
      if (isSunday) {
        // All Sundays are closed
        isAvailable = false;
        isClosed = true;
      } else {
        // Dummy API data - randomly mark some dates as unavailable (but not closed)
        // You can replace this with actual API data
        const randomFactor = (day + month) % 7; // Deterministic "random" for demo
        if (randomFactor === 3 || randomFactor === 5) {
          isAvailable = false;
          isClosed = false; // Unavailable but not closed
        }
      }
      
      options.push({
        date: `${day} ${monthNames[month]}`,
        day: day.toString(),
        dayName,
        isToday: i === 0,
        isTomorrow: i === 1,
        isAvailable,
        isClosed,
      });
    }
    
    return options;
  };

  const dateOptions = generateDateOptions();

  const handleDateToggle = (dateStr: string, isAvailable: boolean) => {
    // Only allow selection of available dates
    if (!isAvailable) {
      return;
    }
    
    if (selectedDates.includes(dateStr)) {
      // Unselect the date
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      // Select the date
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const handleConfirm = () => {
    if (selectedDates.length > 0) {
      // Format the dates to match BookingScreen expectations
      // For multiple dates, we'll format them as a comma-separated string
      // For single date, we'll use the proper format with Today/Tomorrow labels
      
      if (selectedDates.length === 1) {
        const firstSelectedDate = selectedDates[0];
        const selectedOption = dateOptions.find(option => option.date === firstSelectedDate);
        let formattedDate = firstSelectedDate;
        
        if (selectedOption) {
          if (selectedOption.isToday) {
            formattedDate = `${firstSelectedDate} (Today)`;
          } else if (selectedOption.isTomorrow) {
            formattedDate = `${firstSelectedDate} (Tomorrow)`;
          } else {
            formattedDate = `${firstSelectedDate} (${selectedOption.dayName})`;
          }
        }
        onDateSelect(formattedDate, 1);
      } else {
        // Multiple dates selected - create a summary
        const sortedDates = [...selectedDates].sort((a, b) => {
          const dateA = dateOptions.find(opt => opt.date === a);
          const dateB = dateOptions.find(opt => opt.date === b);
          return (dateA?.day || '0').localeCompare(dateB?.day || '0');
        });
        
        const formattedDates = `${sortedDates.slice(0, 2).join(', ')}${sortedDates.length > 2 ? '...' : ''}`;
        onDateSelect(formattedDates, selectedDates.length);
      }
    }
    onBack();
  };

  const getDateDisplayText = (option: DateOption): string => {
    if (option.isToday) {
      return `${option.date}, Today`;
    } else if (option.isTomorrow) {
      return `${option.date}, Tomorrow`;
    } else {
      return `${option.date}, ${option.dayName}`;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Dates</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <Text style={styles.subtitle}>You can select multiple date(s)</Text>

        {/* Date List */}
        <View style={styles.dateList}>
          {dateOptions.map((option, index) => {
            const isSelected = selectedDates.includes(option.date);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateRow,
                  isSelected && styles.selectedDateRow,
                  !option.isAvailable && styles.disabledDateRow
                ]}
                onPress={() => handleDateToggle(option.date, option.isAvailable)}
                disabled={!option.isAvailable}
              >
                <View style={styles.dateContent}>
                  <Text style={[
                    styles.dateText,
                    !option.isAvailable && styles.disabledDateText
                  ]}>
                    {getDateDisplayText(option)}
                  </Text>
                  <View style={styles.statusContainer}>
                    {option.isClosed && (
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Closed</Text>
                      </View>
                    )}
                    {!option.isAvailable && !option.isClosed && (
                      <View style={[styles.statusBadge, styles.unavailableBadge]}>
                        <Text style={styles.statusText}>Unavailable</Text>
                      </View>
                    )}
                    {option.isAvailable && (
                      <View style={[styles.statusBadge, styles.availableBadge]}>
                        <Text style={[styles.statusText, styles.availableStatusText]}>Available</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.gray[300] }]} />
            <Text style={styles.legendText}>Unavailable</Text>
          </View>
        </View>

        {/* Workspace Info */}
        <View style={styles.workspaceInfo}>
          <Text style={styles.workspaceName}>{propertyData.name}</Text>
          <View style={styles.workspaceDetails}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.workspaceTime}>9:00 am - 6:00 pm (Mon to Sat)</Text>
          </View>
          <View style={styles.workspaceDetails}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.workspaceTime}>Closed (Sun)</Text>
          </View>
        </View>

        {/* Offers Section */}
        <View style={styles.offersSection}>
          <Text style={styles.offersTitle}>Offers at this workspace</Text>
          <View style={styles.offerCard}>
            <View style={styles.offerIcon}>
              <Text style={styles.offerPercentage}>%</Text>
            </View>
            <Text style={styles.offerText}>
              Get <Text style={styles.offerHighlight}>20% off</Text> on Premium Desk Booking using coupon{' '}
              <Text style={styles.offerCode}>TRYPD20</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.selectionText}>
          {selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''} <Text style={styles.selectedLabel}>selected</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            selectedDates.length === 0 && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={selectedDates.length === 0}
        >
          <Text style={[
            styles.confirmButtonText,
            selectedDates.length === 0 && styles.disabledButtonText
          ]}>
            Confirm
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  dateList: {
    paddingHorizontal: Spacing.md,
  },
  dateRow: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  selectedDateRow: {
    backgroundColor: '#E8F5E8', // Light green for selected dates
    borderColor: Colors.success,
  },
  disabledDateRow: {
    backgroundColor: Colors.gray[100],
    borderColor: Colors.gray[200],
  },
  dateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    flex: 1,
  },
  disabledDateText: {
    color: Colors.text.light,
  },
  statusContainer: {
    marginLeft: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray[200],
  },
  availableBadge: {
    backgroundColor: Colors.primary + '20',
  },
  unavailableBadge: {
    backgroundColor: Colors.gray[200],
  },
  statusText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.secondary,
  },
  availableStatusText: {
    color: Colors.primary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.xs,
  },
  legendText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  workspaceInfo: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  workspaceName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  workspaceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  workspaceTime: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  offersSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  offersTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.success,
    marginBottom: Spacing.sm,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  offerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  offerPercentage: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  offerText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
  },
  offerHighlight: {
    fontWeight: FontWeights.bold,
    color: Colors.success,
  },
  offerCode: {
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectionText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  selectedLabel: {
    color: Colors.text.secondary,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  disabledButton: {
    backgroundColor: Colors.gray[300],
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  disabledButtonText: {
    color: Colors.text.light,
  },
});
