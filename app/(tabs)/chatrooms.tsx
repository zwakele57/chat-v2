import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Lock, Star, Plus, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  isStarred: boolean;
  onlineCount: number;
  lastActivity: string;
}

export default function ChatRoomsScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: '1',
      name: 'General Chat',
      description: 'Open discussion for everyone',
      memberCount: 1247,
      isPrivate: false,
      isStarred: true,
      onlineCount: 89,
      lastActivity: '2 min ago',
    },
    {
      id: '2',
      name: 'Midnight Thoughts',
      description: 'Late night conversations',
      memberCount: 567,
      isPrivate: false,
      isStarred: false,
      onlineCount: 23,
      lastActivity: '5 min ago',
    },
    {
      id: '3',
      name: 'VIP Lounge',
      description: 'Premium members only',
      memberCount: 89,
      isPrivate: true,
      isStarred: true,
      onlineCount: 12,
      lastActivity: '1 min ago',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userCredits, setUserCredits] = useState(85);

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStar = (roomId: string) => {
    setChatRooms(rooms =>
      rooms.map(room =>
        room.id === roomId ? { ...room, isStarred: !room.isStarred } : room
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <Text style={styles.headerTitle}>Chat Rooms</Text>
        <View style={styles.creditsContainer}>
          <Text style={styles.creditsText}>Credits: {userCredits}</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chat rooms..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filteredRooms.map((room) => (
          <TouchableOpacity key={room.id} style={styles.roomCard}>
            <View style={styles.roomHeader}>
              <View style={styles.roomInfo}>
                <View style={styles.roomNameContainer}>
                  <Text style={styles.roomName}>{room.name}</Text>
                  {room.isPrivate && (
                    <Lock size={16} color="#f59e0b" style={styles.lockIcon} />
                  )}
                </View>
                <TouchableOpacity onPress={() => toggleStar(room.id)}>
                  <Star
                    size={20}
                    color={room.isStarred ? '#fbbf24' : '#6b7280'}
                    fill={room.isStarred ? '#fbbf24' : 'none'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.roomDescription}>{room.description}</Text>

            <View style={styles.roomStats}>
              <View style={styles.statItem}>
                <Users size={16} color="#8b5cf6" />
                <Text style={styles.statText}>{room.memberCount} members</Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.onlineIndicator} />
                <Text style={styles.statText}>{room.onlineCount} online</Text>
              </View>

              <Text style={styles.lastActivity}>{room.lastActivity}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Private Room</Text>
            <Text style={styles.modalSubtitle}>Cost: 50 Credits</Text>

            <TextInput
              style={styles.input}
              placeholder="Room name"
              placeholderTextColor="#6b7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Room description"
              placeholderTextColor="#6b7280"
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                disabled={userCredits < 50}
              >
                <Text style={[
                  styles.createButtonText,
                  userCredits < 50 && styles.disabledText
                ]}>
                  Create Room
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  creditsContainer: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  creditsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: 'white',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  roomCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
  },
  roomHeader: {
    marginBottom: 8,
  },
  roomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  lockIcon: {
    marginLeft: 8,
  },
  roomDescription: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 12,
  },
  roomStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#9ca3af',
    fontSize: 12,
    marginLeft: 6,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  lastActivity: {
    color: '#6b7280',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8b5cf6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8b5cf6',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  createButton: {
    backgroundColor: '#8b5cf6',
  },
  cancelButtonText: {
    color: '#9ca3af',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#6b7280',
  },
});