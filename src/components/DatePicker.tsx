import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const DatePicker: React.FC<DatePickerProps> = ({
  visible,
  onClose,
  onDateSelect,
  selectedDate,
}) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(currentDate.getDate()); // Default to current date

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today (${day} ${monthNames[month]})`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow (${day} ${monthNames[month]})`;
    } else {
      return `${day} ${monthNames[month]} ${year}`;
    }
  };

  const handleDateSelect = (day: number) => {
    // Check if the selected date is in the past
    const selectedDateObj = new Date(selectedYear, selectedMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    
    if (selectedDateObj < today) {
      return; // Don't allow selection of past dates
    }
    
    setSelectedDay(day);
    const formattedDate = formatDate(day, selectedMonth, selectedYear);
    onDateSelect(formattedDate);
    onClose();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    if (direction === 'prev') {
      // Don't allow navigation to past months
      if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth <= currentMonth)) {
        return;
      }
      
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(selectedYear, selectedMonth, day);
      const isToday = day === currentDate.getDate() && 
                     selectedMonth === currentDate.getMonth() && 
                     selectedYear === currentDate.getFullYear();
      const isSelected = day === selectedDay;
      const isPast = dayDate < today;
      const hasSelectedFutureDate = selectedDay && selectedDay > currentDate.getDate() && 
                                   selectedMonth === currentDate.getMonth() && 
                                   selectedYear === currentDate.getFullYear();
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            isPast ? styles.pastDayButton : null,
            isSelected && !isPast ? styles.selectedDayButton : null,
            isToday && hasSelectedFutureDate ? styles.todayGreyButton : null,
            isToday && !hasSelectedFutureDate && !isSelected ? styles.todayButton : null,
          ]}
          onPress={() => handleDateSelect(day)}
          disabled={isPast}
        >
          <Text
            style={[
              styles.dayText,
              isPast ? styles.pastDayText : null,
              isSelected && !isPast ? styles.selectedDayText : null,
              isToday && hasSelectedFutureDate ? styles.todayGreyText : null,
              isToday && !hasSelectedFutureDate && !isSelected ? styles.todayText : null,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return days;
  };

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
          <Text style={styles.headerTitle}>Select Date</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Month Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity
              style={[
                styles.navButton,
                (selectedYear <= currentDate.getFullYear() && selectedMonth <= currentDate.getMonth()) ? styles.disabledNavButton : null
              ]}
              onPress={() => navigateMonth('prev')}
              disabled={selectedYear <= currentDate.getFullYear() && selectedMonth <= currentDate.getMonth()}
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={
                  (selectedYear <= currentDate.getFullYear() && selectedMonth <= currentDate.getMonth()) 
                    ? Colors.gray[400] 
                    : Colors.text.primary
                } 
              />
            </TouchableOpacity>
            
            <Text style={styles.monthYearText}>
              {monthNames[selectedMonth]} {selectedYear}
            </Text>
            
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigateMonth('next')}
            >
              <Ionicons name="chevron-forward" size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            {dayNames.map((day, index) => (
              <Text key={index} style={styles.dayHeaderText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {renderCalendar()}
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              if (selectedDay) {
                handleDateSelect(selectedDay);
              } else {
                handleDateSelect(currentDate.getDate()); // Default to today
              }
            }}
          >
            <Text style={styles.selectButtonText}>Select Date</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  navButton: {
    padding: Spacing.sm,
  },
  disabledNavButton: {
    opacity: 0.3,
  },
  monthYearText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  calendarHeader: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  dayHeaderText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    flex: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '14.28%', // 100% / 7 days = 14.28%
    height: 40,
    marginVertical: 2,
  },
  dayButton: {
    width: '14.28%', // 100% / 7 days = 14.28%
    height: 40,
    marginVertical: 2,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastDayButton: {
    backgroundColor: 'transparent',
  },
  todayButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  todayGreyButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.gray[400],
  },
  selectedDayButton: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  pastDayText: {
    color: Colors.gray[400],
  },
  todayText: {
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  todayGreyText: {
    fontWeight: FontWeights.semibold,
    color: Colors.gray[400],
  },
  selectedDayText: {
    color: Colors.white,
    fontWeight: FontWeights.semibold,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  selectButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
});
