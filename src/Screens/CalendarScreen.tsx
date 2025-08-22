import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';

const { width } = Dimensions.get('window');

interface CalendarScreenProps {
  onBack: () => void;
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  onBack,
  onDateSelect,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7)); // August 2025 (month is 0-indexed)
  const [selectedDay, setSelectedDay] = useState(23); // Default to 23rd as shown in image

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    const monthName = monthNames[currentMonth.getMonth()];
    const year = currentMonth.getFullYear();
    
    // Format as "Tomorrow (23 Aug)" for next day, or just "23 Aug 2025" for other dates
    const today = new Date();
    const selectedDate = new Date(year, currentMonth.getMonth(), day);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    let formattedDate;
    if (selectedDate.toDateString() === today.toDateString()) {
      formattedDate = `Today, ${day} ${monthName}`;
    } else if (selectedDate.toDateString() === tomorrow.toDateString()) {
      formattedDate = `Tomorrow (${day} ${monthName})`;
    } else {
      formattedDate = `${day} ${monthName} ${year}`;
    }
    
    onDateSelect(formattedDate);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Date</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <View style={styles.calendarContainer}>
        {/* Month Navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePreviousMonth}>
            <Ionicons name="chevron-back" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Day Headers */}
        <View style={styles.dayHeadersContainer}>
          {dayNames.map((dayName, index) => (
            <View key={index} style={styles.dayHeader}>
              <Text style={styles.dayHeaderText}>{dayName}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => {
            const today = new Date();
            const isToday = day && 
              currentMonth.getMonth() === today.getMonth() && 
              currentMonth.getFullYear() === today.getFullYear() && 
              day === today.getDate();
            
            const isSelected = day === selectedDay;
            
            let cellStyle: ViewStyle[] = [styles.dayCell];
            let textStyle: TextStyle[] = [styles.dayText];
            
            if (isSelected) {
              cellStyle.push(styles.selectedDayCell);
              textStyle.push(styles.selectedDayText);
            } else if (isToday) {
              cellStyle.push(styles.todayCell);
              textStyle.push(styles.todayText);
            }
            
            return (
              <TouchableOpacity
                key={index}
                style={cellStyle}
                onPress={() => day && handleDayPress(day)}
                disabled={!day}
              >
                {day && (
                  <Text style={textStyle}>
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
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
    backgroundColor: Colors.background,
    elevation: 0,
    shadowColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  monthText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  dayHeadersContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dayHeaderText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (width - Spacing.md * 2) / 7,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  selectedDayCell: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
  },
  todayCell: {
    backgroundColor: Colors.gray[200],
    borderRadius: 24,
  },
  dayText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
  },
  selectedDayText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
  },
  todayText: {
    color: Colors.primary,
    fontWeight: FontWeights.bold,
  },
});
