import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Heart,
  ThumbsDown,
  MessageSquare,
  Users,
  Star,
  Gift,
  Play,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedFlame from '@/components/AnimatedFlame';

export default function ProfileScreen() {
  const [userStats, setUserStats] = useState({
    credits: 85,
    totalLikes: 234,
    totalDislikes: 12,
    totalComments: 89,
    followers: 45,
    following: 67,
    confessions: 23,
    groupsJoined: 8,
    isVerified: false,
    daysWithoutReport: 45,
    allowRandomMedia: false,
  });

  const [selectedAvatar, setSelectedAvatar] = useState('😊');

  const avatars = ['😊', '😎', '🤔', '😴', '🤗', '😜', '🥸', '🤖', '👻', '🦄', '🔥', '⭐'];

  const watchAd = () => {
    Alert.alert(
      'Watch Ad',
      'Watch a 30-second ad to earn 5 credits?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Watch',
          onPress: () => {
            // Simulate ad watching
            setTimeout(() => {
              setUserStats(prev => ({ ...prev, credits: prev.credits + 5 }));
              Alert.alert('Success!', 'You earned 5 credits!');
            }, 2000);
          },
        },
      ]
    );
  };

  const checkVerification = () => {
    if (userStats.daysWithoutReport >= 30 && userStats.totalLikes > 100) {
      Alert.alert(
        'Verification Available!',
        'You qualify for verification. This will give you special privileges and 50 bonus credits.',
        [
          { text: 'Not now', style: 'cancel' },
          {
            text: 'Get Verified',
            onPress: () => {
              setUserStats(prev => ({
                ...prev,
                isVerified: true,
                credits: prev.credits + 50,
              }));
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Verification Requirements',
        'To get verified, you need:\n• 30+ days without reports\n• 100+ total likes\n\nKeep being a positive community member!'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.creditsContainer}>
          <Text style={styles.creditsText}>Credits: {userStats.credits}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <Text style={styles.currentAvatar}>{selectedAvatar}</Text>
            {userStats.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
            <AnimatedFlame credits={userStats.credits} />
          </View>

          <Text style={styles.anonymousTitle}>Anonymous User</Text>
          <Text style={styles.memberSince}>Member since January 2024</Text>

          <TouchableOpacity style={styles.verifyButton} onPress={checkVerification}>
            <Star size={16} color="#fbbf24" />
            <Text style={styles.verifyButtonText}>
              {userStats.isVerified ? 'Verified User' : 'Get Verified'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Avatar Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Choose Avatar</Text>
          <View style={styles.avatarGrid}>
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarOption,
                  selectedAvatar === avatar && styles.selectedAvatar,
                ]}
                onPress={() => setSelectedAvatar(avatar)}
              >
                <Text style={styles.avatarText}>{avatar}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Heart size={24} color="#ef4444" />
              <Text style={styles.statNumber}>{userStats.totalLikes}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>

            <View style={styles.statItem}>
              <ThumbsDown size={24} color="#6b7280" />
              <Text style={styles.statNumber}>{userStats.totalDislikes}</Text>
              <Text style={styles.statLabel}>Dislikes</Text>
            </View>

            <View style={styles.statItem}>
              <MessageSquare size={24} color="#3b82f6" />
              <Text style={styles.statNumber}>{userStats.totalComments}</Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View>

            <View style={styles.statItem}>
              <Users size={24} color="#8b5cf6" />
              <Text style={styles.statNumber}>{userStats.followers}</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
          </View>
        </View>

        {/* Credits Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎁 Earn Credits</Text>
          <View style={styles.creditsSection}>
            <View style={styles.creditInfo}>
              <Gift size={24} color="#22c55e" />
              <View style={styles.creditDetails}>
                <Text style={styles.creditTitle}>Watch Ads</Text>
                <Text style={styles.creditSubtitle}>Earn 5 credits per ad</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.watchAdButton} onPress={watchAd}>
              <Play size={16} color="white" />
              <Text style={styles.watchAdText}>Watch Ad</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.creditTips}>
            <Text style={styles.tipsTitle}>Other ways to earn credits:</Text>
            <Text style={styles.tipText}>• Daily login bonus: 2 credits</Text>
            <Text style={styles.tipText}>• Share confessions: 1 credit</Text>
            <Text style={styles.tipText}>• Invite friends: 10 credits</Text>
            <Text style={styles.tipText}>• Good behavior: 5 credits/week</Text>
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Allow random users to send media</Text>
            <TouchableOpacity
              style={[styles.toggle, userStats.allowRandomMedia && styles.toggleActive]}
              onPress={() => setUserStats(prev => ({ ...prev, allowRandomMedia: !prev.allowRandomMedia }))}
            >
              <View style={[styles.toggleThumb, userStats.allowRandomMedia && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
          <Text style={styles.settingDescription}>
            When enabled, random users can send you images, videos, and voice messages
          </Text>
        </View>

        {/* Activity Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Activity Summary</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>Confessions Posted</Text>
              <Text style={styles.activityValue}>{userStats.confessions}</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>Groups Joined</Text>
              <Text style={styles.activityValue}>{userStats.groupsJoined}</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>Days Without Reports</Text>
              <Text style={styles.activityValue}>{userStats.daysWithoutReport}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarSection: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentAvatar: {
    fontSize: 48,
  },
  verifiedBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  anonymousTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  verifyButtonText: {
    color: '#fbbf24',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 25,
    marginBottom: 12,
  },
  selectedAvatar: {
    backgroundColor: '#8b5cf6',
  },
  avatarText: {
    fontSize: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  creditsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  creditInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  creditDetails: {
    marginLeft: 12,
  },
  creditTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  creditSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  watchAdButton: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  watchAdText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  creditTips: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: 'white',
    flex: 1,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#8b5cf6',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  settingDescription: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 16,
  },
  activityList: {
    space: 12,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  activityLabel: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  activityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b5cf6',
  },
});