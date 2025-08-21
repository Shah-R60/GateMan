import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';

interface NewGuestScreenProps {
  onBack: () => void;
  onSave: (guestData: { name: string; email: string; phone: string }) => void;
}

export const NewGuestScreen: React.FC<NewGuestScreenProps> = ({
  onBack,
  onSave,
}) => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [showContactsModal, setShowContactsModal] = useState(false);

  const validateForm = () => {
    if (!guestName.trim()) {
      Alert.alert('Error', 'Please enter guest name');
      return false;
    }
    if (!guestEmail.trim()) {
      Alert.alert('Error', 'Please enter guest email');
      return false;
    }
    if (!guestPhone.trim()) {
      Alert.alert('Error', 'Please enter guest mobile number');
      return false;
    }
    if (guestPhone.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name: guestName.trim(),
        email: guestEmail.trim(),
        phone: guestPhone.trim(),
      });
    }
  };

  const handleContactsPress = () => {
    setShowContactsModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Guest</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onBack}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Important Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            <Text style={styles.importantText}>IMPORTANT:</Text> Please enter correct mobile number of the guest, as it will be verified during check-in
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Guest Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Guest Name"
              placeholderTextColor={Colors.text.light}
              value={guestName}
              onChangeText={setGuestName}
              autoCapitalize="words"
            />
          </View>

          {/* Guest Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Guest Email"
              placeholderTextColor={Colors.text.light}
              value={guestEmail}
              onChangeText={setGuestEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Guest Mobile Input */}
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter Guest Mobile No."
              placeholderTextColor={Colors.text.light}
              value={guestPhone}
              onChangeText={setGuestPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <TouchableOpacity
              style={styles.contactsButton}
              onPress={handleContactsPress}
            >
              <Ionicons name="book-outline" size={20} color={Colors.primary} />
              <Text style={styles.contactsButtonText}>Contacts</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Guest</Text>
        </TouchableOpacity>
      </View>

      {/* Contacts Modal */}
      <Modal
        visible={showContactsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowContactsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select from Contacts</Text>
              <TouchableOpacity onPress={() => setShowContactsModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                This feature would integrate with your device contacts. For now, please enter the details manually.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowContactsModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  closeButton: {
    padding: Spacing.xs,
  },
  scrollContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  noticeContainer: {
    backgroundColor: '#FFF3CD',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  noticeText: {
    fontSize: FontSizes.sm,
    color: '#856404',
    lineHeight: 20,
  },
  importantText: {
    fontWeight: FontWeights.bold,
    color: '#856404',
  },
  formContainer: {
    gap: Spacing.lg,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  textInput: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 50,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  countryCode: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  countryCodeText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: FontWeights.medium,
  },
  phoneInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 50,
  },
  contactsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
  },
  contactsButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    margin: Spacing.md,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  modalBody: {
    padding: Spacing.md,
  },
  modalMessage: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalCloseButton: {
    margin: Spacing.md,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.white,
  },
});
