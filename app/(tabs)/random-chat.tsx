import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shuffle, MessageCircle, X, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RandomChatScreen() {
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userCredits, setUserCredits] = useState(85);
  const [matchedUser, setMatchedUser] = useState<any>(null);

  const startRandomChat = () => {
    if (userCredits < 10) {
      Alert.alert(
        'Insufficient Credits',
        'You need at least 10 credits to start a random chat. Watch an ad to earn credits!',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSearching(true);
    setUserCredits(prev => prev - 10);

    // Simulate finding a match
    setTimeout(() => {
      setIsSearching(false);
      setIsConnected(true);
      setMatchedUser({
        id: 'random-user',
        avatar: '👤',
        isOnline: true,
      });
    }, 3000);
  };

  const endChat = () => {
    setIsConnected(false);
    setMatchedUser(null);
  };

  const skipUser = () => {
    if (userCredits < 5) {
      Alert.alert(
        'Insufficient Credits',
        'You need 5 credits to skip to next user.',
        [{ text: 'OK' }]
      );
      return;
    }

    setUserCredits(prev => prev - 5);
    // Simulate finding new match
    startRandomChat();
  };

  if (isSearching) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.searchingContainer}>
          <View style={styles.searchingContent}>
            <View style={styles.loadingSpinner}>
              <Text style={styles.loadingEmoji}>🔍</Text>
            </View>
            <Text style={styles.searchingText}>Finding someone for you...</Text>
            <Text style={styles.searchingSubtext}>This might take a moment</Text>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsSearching(false);
                setUserCredits(prev => prev + 10); // Refund credits
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (isConnected && matchedUser) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <View style={styles.userInfo}>
              <Text style={styles.userAvatar}>{matchedUser.avatar}</Text>
              <View>
                <Text style={styles.userName}>Anonymous User</Text>
                <View style={styles.onlineIndicator}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.endChatButton} onPress={endChat}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.chatContent}>
            <Text style={styles.connectedText}>🎉 You're now connected!</Text>
            <Text style={styles.connectedSubtext}>Start your anonymous conversation</Text>
          </View>

          <View style={styles.chatActions}>
            <TouchableOpacity style={styles.skipButton} onPress={skipUser}>
              <Shuffle size={20} color="white" />
              <Text style={styles.skipButtonText}>Skip (5 credits)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.likeButton}>
              <Heart size={20} color="white" />
              <Text style={styles.likeButtonText}>Like</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <Text style={styles.headerTitle}>Random Chat</Text>
        <View style={styles.creditsContainer}>
          <Text style={styles.creditsText}>Credits: {userCredits}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Connect with Random People</Text>
          <Text style={styles.cardDescription}>
            Meet new people from around the world anonymously. Each session costs 10 credits.
          </Text>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌍</Text>
              <Text style={styles.featureText}>Global connections</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureText}>100% anonymous</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureText}>Real-time chat</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.startButton, userCredits < 10 && styles.disabledButton]}
            onPress={startRandomChat}
            disabled={userCredits < 10}
          >
            <MessageCircle size={24} color="white" />
            <Text style={styles.startButtonText}>
              Start Random Chat (10 credits)
            </Text>
          </TouchableOpacity>

          {userCredits < 10 && (
            <TouchableOpacity style={styles.earnCreditsButton}>
              <Text style={styles.earnCreditsText}>Watch Ad to Earn Credits</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>🚨 Safety Rules</Text>
          <Text style={styles.ruleText}>• No illegal content or activities</Text>
          <Text style={styles.ruleText}>• Be respectful to others</Text>
          <Text style={styles.ruleText}>• Report inappropriate behavior</Text>
          <Text style={styles.ruleText}>• Must be 18+ to use this feature</Text>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  mainCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  startButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#374151',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  earnCreditsButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  earnCreditsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  rulesCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  ruleText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 8,
    lineHeight: 20,
  },
  searchingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingContent: {
    alignItems: 'center',
  },
  loadingSpinner: {
    marginBottom: 24,
  },
  loadingEmoji: {
    fontSize: 48,
  },
  searchingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  searchingSubtext: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 32,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    fontSize: 32,
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: '#22c55e',
  },
  endChatButton: {
    backgroundColor: '#ef4444',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  connectedSubtext: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  chatActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  skipButton: {
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  skipButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  likeButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  likeButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});