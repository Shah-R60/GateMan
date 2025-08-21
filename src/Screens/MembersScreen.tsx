import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '../constants/theme';
import { NewGuestScreen } from './NewGuestScreen';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  isSelected: boolean;
}

interface MembersScreenProps {
  onBack: () => void;
  onConfirm: (members: Guest[]) => void;
  initialMembers?: Guest[];
}

export const MembersScreen: React.FC<MembersScreenProps> = ({
  onBack,
  onConfirm,
  initialMembers = [],
}) => {
  // Initialize with main user (self) and any existing guests
  const [members, setMembers] = useState<Guest[]>([
    {
      id: 'self',
      name: 'Shah Saurabh',
      email: 'shahrahul3600@gmail.com',
      phone: '7283881124',
      isSelected: true, // Self is always selected
    },
    ...initialMembers,
  ]);
  
  const [showNewGuestForm, setShowNewGuestForm] = useState(false);

  const toggleMemberSelection = (id: string) => {
    if (id === 'self') return; // Can't unselect self
    
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id
          ? { ...member, isSelected: !member.isSelected }
          : member
      )
    );
  };

  const removeMember = (id: string) => {
    if (id === 'self') return; // Can't remove self
    
    setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
  };

  const addNewGuest = (guestData: { name: string; email: string; phone: string }) => {
    const newGuest: Guest = {
      id: Date.now().toString(), // Simple ID generation
      name: guestData.name,
      email: guestData.email,
      phone: guestData.phone,
      isSelected: true, // New guests are selected by default
    };
    
    setMembers(prevMembers => [...prevMembers, newGuest]);
    setShowNewGuestForm(false);
  };

  const handleConfirm = () => {
    const selectedMembers = members.filter(member => member.isSelected);
    onConfirm(selectedMembers);
  };

  const selectedCount = members.filter(member => member.isSelected).length;

  if (showNewGuestForm) {
    return (
      <NewGuestScreen
        onBack={() => setShowNewGuestForm(false)}
        onSave={addNewGuest}
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
          <Text style={styles.headerTitle}>Members</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <Text style={styles.subtitle}>You can add multiple members in this booking</Text>

        {/* New Guest Button */}
        <TouchableOpacity
          style={styles.newGuestButton}
          onPress={() => setShowNewGuestForm(true)}
        >
          <Ionicons name="add" size={24} color={Colors.primary} />
          <Text style={styles.newGuestButtonText}>New Guest</Text>
        </TouchableOpacity>

        {/* Members List */}
        <View style={styles.membersList}>
          {members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <TouchableOpacity
                style={styles.memberContent}
                onPress={() => toggleMemberSelection(member.id)}
              >
                <View style={styles.checkboxContainer}>
                  <View style={[
                    styles.checkbox,
                    member.isSelected && styles.checkedBox
                  ]}>
                    {member.isSelected && (
                      <Ionicons name="checkmark" size={16} color={Colors.white} />
                    )}
                  </View>
                </View>
                
                <View style={styles.memberInfo}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {member.id === 'self' && (
                      <Text style={styles.selfLabel}>Self</Text>
                    )}
                  </View>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                  <Text style={styles.memberPhone}>{member.phone}</Text>
                </View>
              </TouchableOpacity>
              
              {member.id !== 'self' && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeMember(member.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.memberCountContainer}>
          <Text style={styles.memberCount}>
            {selectedCount} member{selectedCount !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.memberCountSubtext}>in this booking</Text>
        </View>
        <View style={styles.viewToggle}>
          <Text style={styles.viewText}>View</Text>
          <Ionicons name="chevron-up" size={16} color={Colors.text.secondary} />
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
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
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  newGuestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  newGuestButtonText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  membersList: {
    gap: Spacing.md,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxContainer: {
    marginRight: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  memberName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    flex: 1,
  },
  selfLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  memberEmail: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  memberPhone: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  memberCountContainer: {
    flex: 1,
  },
  memberCount: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  memberCountSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  viewText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  confirmButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
});
