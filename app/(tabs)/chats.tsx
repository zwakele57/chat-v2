import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MessageCircle, VolumeX, MoreVertical } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PrivateChat {
  id: string;
  otherUser: {
    id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isMuted: boolean;
  isTyping: boolean;
}

export default function ChatsScreen() {
  const [chats, setChats] = useState<PrivateChat[]>([
    {
      id: '1',
      otherUser: {
        id: 'user1',
        username: 'TestUser123',
        avatar: '😎',
        isOnline: true,
      },
      lastMessage: 'Hey, thanks for the advice earlier!',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      isMuted: false,
      isTyping: false,
    },
    {
      id: '2',
      otherUser: {
        id: 'user2',
        username: 'FriendlyUser456',
        avatar: '🤗',
        isOnline: false,
      },
      lastMessage: 'That confession really resonated with me',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      isMuted: true,
      isTyping: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [userCredits, setUserCredits] = useState(85);

  const filteredChats = chats.filter(chat =>
    chat.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMute = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
      )
    );
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const renderChatItem = ({ item }: { item: PrivateChat }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.otherUser.avatar}</Text>
        {item.otherUser.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.username}>{item.otherUser.username}</Text>
          <View style={styles.chatMeta}>
            {item.isMuted && <VolumeX size={14} color="#6b7280" />}
            <Text style={styles.timestamp}>{formatTime(item.lastMessageTime)}</Text>
          </View>
        </View>

        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.isTyping ? 'Typing...' : item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.muteButton}
        onPress={() => toggleMute(item.id)}
      >
        <MoreVertical size={20} color="#6b7280" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.creditsContainer}>
          <Text style={styles.creditsText}>Credits: {userCredits}</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {filteredChats.length === 0 ? (
        <View style={styles.emptyState}>
          <MessageCircle size={64} color="#6b7280" />
          <Text style={styles.emptyTitle}>No Chats Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start conversations by connecting with people in confessions or random chat
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          style={styles.chatsList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  chatsList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 32,
    width: 48,
    height: 48,
    textAlign: 'center',
    lineHeight: 48,
    backgroundColor: '#374151',
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#9ca3af',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#8b5cf6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  muteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
  },
});