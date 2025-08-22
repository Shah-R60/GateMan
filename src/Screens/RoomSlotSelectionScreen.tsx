import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { CreditsScreen } from './CreditsScreen';
import { CalendarScreen } from './CalendarScreen';
import { CancellationPolicyScreen } from './CancellationPolicyScreen';
import { ConfirmBookingScreen } from './ConfirmBookingScreen';

const { width } = Dimensions.get('window');

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  isSelected: boolean;
}

interface Room {
  id: string;
  name: string;
  floor: string;
  amenities: string[];
  isSelected: boolean;
  timeSlots: TimeSlot[];
}

interface RoomSlotSelectionScreenProps {
  onBack: () => void;
  workspaceName?: string;
  selectedDate?: string;
}

export const RoomSlotSelectionScreen: React.FC<RoomSlotSelectionScreenProps> = ({
  onBack,
  workspaceName = "Sspacia - Mercado",
  selectedDate = "Today, 21 Aug"
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('1');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [showCreditsScreen, setShowCreditsScreen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [showConfirmBookingScreen, setShowConfirmBookingScreen] = useState(false);
  const [currentSelectedDate, setCurrentSelectedDate] = useState<string>(selectedDate);
  
  // Dummy pricing data - will be fetched from API later
  const PRICE_PER_SLOT = 50; // 50 credits per hour slot

  // Mock data for rooms
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Meeting Room',
      floor: '6th Floor',
      amenities: ['Whiteboard', 'WiFi'],
      isSelected: true,
      timeSlots: [
        { id: '8am', time: '8am', isAvailable: false, isSelected: false },
        { id: '9am', time: '9am', isAvailable: false, isSelected: false },
        { id: '10am', time: '10am', isAvailable: true, isSelected: false },
        { id: '11am', time: '11am', isAvailable: true, isSelected: false },
        { id: '12pm', time: '12pm', isAvailable: true, isSelected: false },
        { id: '1pm', time: '1pm', isAvailable: true, isSelected: false },
        { id: '2pm', time: '2pm', isAvailable: true, isSelected: false },
        { id: '3pm', time: '3pm', isAvailable: true, isSelected: true },
        { id: '4pm', time: '4pm', isAvailable: true, isSelected: false },
        { id: '5pm', time: '5pm', isAvailable: true, isSelected: false },
      ]
    }
  ]);

  const handleSlotPress = (roomId: string, slotId: string) => {
    setRooms(prevRooms => 
      prevRooms.map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            timeSlots: room.timeSlots.map(slot => {
              if (slot.id === slotId && slot.isAvailable) {
                const isCurrentlySelected = slot.isSelected;
                
                // Update selectedSlots state
                if (isCurrentlySelected) {
                  setSelectedSlots(prev => prev.filter(id => id !== slotId));
                } else {
                  setSelectedSlots(prev => [...prev, slotId]);
                }
                
                return { ...slot, isSelected: !isCurrentlySelected };
              }
              return slot;
            })
          };
        }
        return room;
      })
    );
  };

  const getSlotStyle = (slot: TimeSlot) => {
    if (!slot.isAvailable) {
      return [styles.timeSlot, styles.unavailableSlot];
    }
    if (slot.isSelected) {
      return [styles.timeSlot, styles.selectedSlot];
    }
    return [styles.timeSlot, styles.availableSlot];
  };

  const getSelectedTimeRange = () => {
    if (selectedSlots.length === 0) return '';
    
    const selectedTimes = rooms[0]?.timeSlots
      .filter(slot => selectedSlots.includes(slot.id))
      .map(slot => slot.time)
      .sort((a, b) => {
        // Custom sort for time strings
        const timeToNumber = (time: string) => {
          const isPM = time.includes('pm');
          const hour = parseInt(time.replace(/[ap]m/, ''));
          return isPM && hour !== 12 ? hour + 12 : hour;
        };
        return timeToNumber(a) - timeToNumber(b);
      });
    
    if (selectedTimes.length === 1) {
      const startTime = selectedTimes[0];
      const startHour = parseInt(startTime.replace(/[ap]m/, ''));
      const isPM = startTime.includes('pm');
      let endHour = startHour + 1;
      let endPeriod = isPM ? 'PM' : 'AM';
      
      if (!isPM && endHour === 12) {
        endPeriod = 'PM';
      } else if (isPM && endHour === 13) {
        endHour = 1;
        endPeriod = 'PM';
      } else if (!isPM && endHour > 12) {
        endHour = endHour - 12;
        endPeriod = 'PM';
      }
      
      return `${startTime.toUpperCase()} - ${endHour}:00 ${endPeriod}`;
    }
    
    return `${selectedTimes[0].toUpperCase()} - ${selectedTimes[selectedTimes.length - 1].toUpperCase()}`;
  };

  // Calculate total price based on selected slots
  const calculateTotalPrice = () => {
    return selectedSlots.length * PRICE_PER_SLOT;
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: string) => {
    setCurrentSelectedDate(date);
    setShowCalendar(false);
    // Reset selected slots when date changes
    setSelectedSlots([]);
  };

  // Handle continue button press
  const handleContinue = () => {
    if (selectedSlots.length > 0) {
      setShowConfirmBookingScreen(true);
    }
  };

  const renderTimeSlot = (slot: TimeSlot, roomId: string) => (
    <TouchableOpacity
      key={slot.id}
      style={getSlotStyle(slot)}
      onPress={() => handleSlotPress(roomId, slot.id)}
      disabled={!slot.isAvailable}
    >
      <Text style={[
        styles.timeSlotText,
        !slot.isAvailable && styles.unavailableText,
        slot.isSelected && styles.selectedText
      ]}>
        {slot.time}
      </Text>
    </TouchableOpacity>
  );

  // Show CreditsScreen if active
  if (showCreditsScreen) {
    return (
      <CreditsScreen
        onBack={() => setShowCreditsScreen(false)}
      />
    );
  }

  // Show CalendarScreen if active
  if (showCalendar) {
    return (
      <CalendarScreen
        onBack={() => setShowCalendar(false)}
        onDateSelect={handleDateSelect}
        selectedDate={currentSelectedDate}
      />
    );
  }

  // Show CancellationPolicyScreen if active
  if (showCancellationPolicy) {
    return (
      <CancellationPolicyScreen
        onBack={() => setShowCancellationPolicy(false)}
        workspaceName={workspaceName}
      />
    );
  }

  // Show ConfirmBookingScreen if active
  if (showConfirmBookingScreen) {
    return (
      <ConfirmBookingScreen
        onBack={() => setShowConfirmBookingScreen(false)}
        workspace={{ 
          id: "1",
          name: workspaceName, 
          location: "Thaltej, Ahmedabad",
          distance: "2.5 km",
          hours: "9 AM - 9 PM",
          price: 50,
          currency: "credits",
          period: "hour",
          imageUrl: "",
        }}
        selectedDate={currentSelectedDate}
        selectedDateCount={1}
        selectedMembers={[]}
        selectedSeatingType="Meeting Room"
        totalPrice={calculateTotalPrice()}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Room & Slot</Text>
          <TouchableOpacity 
            style={styles.creditsContainer}
            onPress={() => setShowCreditsScreen(true)}
          >
            <Ionicons name="card" size={16} color={Colors.primary} />
            <Text style={styles.creditsText}>0 credits</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Pick a slot of 1 hr or more in one of the available rooms
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle" size={16} color={Colors.primary} />
            <Text style={styles.helpText}>How to select slots</Text>
          </TouchableOpacity>
        </View>

        {/* Instant Confirmation Badge */}
        <View style={styles.instantConfirmationBadge}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
          <Text style={styles.instantConfirmationText}>
            Book this meeting room with instant confirmation
          </Text>
        </View>

        {/* Booking Date Section */}
        <View style={styles.bookingSection}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingLabel}>Booking for</Text>
            <Text style={styles.totalRooms}>Total Rooms: 1</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.selectedDate}>{currentSelectedDate}</Text>
            <TouchableOpacity 
              style={styles.editDateButton}
              onPress={() => setShowCalendar(true)}
            >
              <Ionicons name="pencil" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSlot, styles.legendAvailable]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSlot, styles.legendSelected]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSlot, styles.legendUnavailable]} />
            <Text style={styles.legendText}>Unavailable</Text>
          </View>
        </View>

        {/* Room Selection */}
        {rooms.map((room) => (
          <View key={room.id} style={styles.roomContainer}>
            <View style={styles.roomHeader}>
              <View style={styles.roomInfo}>
                <Ionicons name="business" size={20} color={Colors.text.primary} />
                <View style={styles.roomDetails}>
                  <Text style={styles.roomName}>{room.name}</Text>
                  <Text style={styles.roomFloor}>{room.floor}</Text>
                </View>
              </View>
              {room.isSelected && (
                <View style={styles.selectedIcon}>
                  <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                </View>
              )}
            </View>

            {/* Amenities */}
            <View style={styles.amenitiesContainer}>
              {room.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Ionicons 
                    name={amenity === 'Whiteboard' ? 'clipboard' : 'wifi'} 
                    size={14} 
                    color={Colors.text.secondary} 
                  />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>

            {/* Time Slots */}
            <View style={styles.slotsSection}>
              <Text style={styles.slotsLabel}>Select the slots</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.slotsScrollContainer}
                contentContainerStyle={styles.slotsContainer}
              >
                {room.timeSlots.map((slot) => renderTimeSlot(slot, room.id))}
              </ScrollView>
            </View>
          </View>
        ))}

        {/* Workspace Info */}
        <View style={styles.workspaceInfoSection}>
          <Text style={styles.workspaceName}>{workspaceName}</Text>
          <View style={styles.capacityBadge}>
            <Ionicons name="people" size={14} color={Colors.success} />
            <Text style={styles.capacityText}>6 Seater</Text>
          </View>
          
          <View style={styles.workspaceDetails}>
            <View style={styles.workspaceDetailItem}>
              <Ionicons name="time" size={16} color={Colors.text.secondary} />
              <Text style={styles.workspaceDetailText}>8:00 am - 8:00 pm (Mon to Sat)</Text>
            </View>
            <View style={styles.workspaceDetailItem}>
              <Ionicons name="time" size={16} color={Colors.text.secondary} />
              <Text style={styles.workspaceDetailText}>Closed (Sun)</Text>
            </View>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.policySection}>
          <Text style={styles.policyTitle}>Cancellation Policy</Text>
          <View style={styles.policyItem}>
            <Ionicons name="alert-circle" size={16} color={Colors.warning} />
            <Text style={styles.policyText}>
              You can cancel your booking before 1 hour of workspace opening time.
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.readMoreButton}
            onPress={() => setShowCancellationPolicy(true)}
          >
            <Text style={styles.readMoreText}>Read More</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* GateMan Assurance */}
        <View style={styles.assuranceSection}>
          <View style={styles.assuranceHeader}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            <Text style={styles.assuranceTitle}>GateMan Assurance</Text>
            <TouchableOpacity>
              <Ionicons name="information-circle" size={16} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {selectedSlots.length > 0 ? (
          <>
            <View style={styles.selectedTimeInfo}>
              <View style={styles.selectedTimeDetails}>
                <Ionicons name="calendar" size={16} color={Colors.success} />
                <Text style={styles.selectedTimeText}>21 Aug 2025</Text>
              </View>
              <View style={styles.selectedTimeDetails}>
                <Ionicons name="time" size={16} color={Colors.success} />
                <Text style={styles.selectedTimeText}>
                  {getSelectedTimeRange()} ({selectedSlots.length} hr)
                </Text>
              </View>
            </View>
            
            <View style={styles.priceRow}>
              <View style={styles.priceInfo}>
                <Text style={styles.priceLabel}>Total Cost</Text>
                <Text style={styles.priceText}>{calculateTotalPrice()} credits</Text>
                {selectedSlots.length > 0 && (
                  <Text style={styles.priceBreakdown}>
                    {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} × {PRICE_PER_SLOT} credits/hr
                  </Text>
                )}
              </View>
              <TouchableOpacity>
                <Ionicons name="information-circle" size={16} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.noSelectionInfo}>
            <Ionicons name="information-circle" size={20} color={Colors.text.light} />
            <View style={styles.noSelectionTextContainer}>
              <Text style={styles.noSelectionText}>
                Select at least 1 hour to continue
              </Text>
              <Text style={styles.pricingHint}>
                {PRICE_PER_SLOT} credits per hour slot
              </Text>
            </View>
          </View>
        )}
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            selectedSlots.length === 0 && styles.disabledButton
          ]}
          disabled={selectedSlots.length === 0}
          onPress={handleContinue}
        >
          <Text style={[
            styles.continueButtonText,
            selectedSlots.length === 0 && styles.disabledButtonText
          ]}>
            {selectedSlots.length > 0 ? 'Continue' : 'Select Time Slots'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeAreaHeader: {
    backgroundColor: Colors.white,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  creditsText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: FontWeights.semibold,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  descriptionSection: {
    paddingVertical: Spacing.md,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    marginLeft: Spacing.xs,
    fontWeight: FontWeights.medium,
  },
  instantConfirmationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  instantConfirmationText: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  bookingSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  bookingLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    fontWeight: FontWeights.medium,
  },
  totalRooms: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedDate: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: FontWeights.semibold,
  },
  editDateButton: {
    padding: Spacing.xs,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSlot: {
    width: 24,
    height: 20,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    borderWidth: 1,
  },
  legendAvailable: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray[300],
  },
  legendSelected: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  legendUnavailable: {
    backgroundColor: Colors.gray[100],
    borderColor: Colors.gray[200],
  },
  legendText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    fontWeight: FontWeights.medium,
  },
  roomContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomDetails: {
    marginLeft: Spacing.sm,
  },
  roomName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  roomFloor: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  selectedIcon: {
    marginLeft: Spacing.sm,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  amenityText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  slotsSection: {
    marginTop: Spacing.sm,
  },
  slotsLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  slotsScrollContainer: {
    marginHorizontal: -Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  slotsContainer: {
    paddingHorizontal: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSlot: {
    minWidth: 64,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    borderWidth: 2,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  availableSlot: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray[300],
  },
  selectedSlot: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
    elevation: 3,
    shadowColor: Colors.success,
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  unavailableSlot: {
    backgroundColor: Colors.gray[100],
    borderColor: Colors.gray[200],
    elevation: 0,
    shadowOpacity: 0,
  },
  timeSlotText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  unavailableText: {
    color: Colors.text.light,
    fontWeight: FontWeights.medium,
  },
  selectedText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
  },
  workspaceInfoSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  workspaceName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  capacityText: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    marginLeft: 4,
    fontWeight: FontWeights.semibold,
  },
  workspaceDetails: {
    gap: Spacing.sm,
  },
  workspaceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workspaceDetailText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
  },
  policySection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  policyTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  policyText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.xs,
  },
  assuranceSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  assuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assuranceTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  bottomSection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedTimeInfo: {
    backgroundColor: Colors.success + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  selectedTimeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectedTimeText: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    marginLeft: Spacing.sm,
    fontWeight: FontWeights.semibold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  priceText: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  priceBreakdown: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  noSelectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  noSelectionText: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    fontStyle: 'italic',
  },
  noSelectionTextContainer: {
    marginLeft: Spacing.sm,
  },
  pricingHint: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: Colors.gray[300],
    elevation: 0,
    shadowOpacity: 0,
  },
  continueButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  disabledButtonText: {
    color: Colors.text.light,
  },
});
