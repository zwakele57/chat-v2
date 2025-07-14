import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Heart, MessageSquare, Flag, Plus, Filter, Calendar, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import AnimatedFlame from '@/components/AnimatedFlame';

interface Confession {
  id: string;
  user_id: string;
  username: string;
  content: string;
  category: string;
  has_audio: boolean;
  audio_url?: string;
  likes: number;
  dislikes: number;
  comments: number;
  created_at: string;
  user_credits: number;
  user_verified: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
}

export default function ConfessionsScreen() {
  const { user } = useAuth();
  const [confessions, setConfessions] = useState<Confession[]>([
    // Sample data for testing
    {
      id: '1',
      user_id: 'sample-user',
      username: 'TestUser123',
      content: 'This is a sample confession to test the app functionality. It shows how confessions will look in the app.',
      category: 'work',
      has_audio: false,
      audio_url: null,
      likes: 15,
      dislikes: 2,
      comments: 8,
      created_at: new Date().toISOString(),
      user_credits: 120,
      user_verified: true,
    },
    {
      id: '2',
      user_id: 'sample-user-2',
      username: 'AnotherUser456',
      content: 'Another sample confession with different content to show variety in the feed.',
      category: 'relationships',
      has_audio: true,
      audio_url: null,
      likes: 8,
      dislikes: 1,
      comments: 3,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user_credits: 85,
      user_verified: false,
    }
  ]);
  
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All', description: 'All confessions', icon: '📝', color: '#8b5cf6', is_active: true },
    { id: 'work', name: 'Work', description: 'Work-related confessions', icon: '💼', color: '#3b82f6', is_active: true },
    { id: 'relationships', name: 'Relationships', description: 'Love and relationships', icon: '❤️', color: '#ef4444', is_active: true },
    { id: 'family', name: 'Family', description: 'Family matters', icon: '👨‍👩‍👧‍👦', color: '#22c55e', is_active: true },
    { id: 'questions', name: 'Questions', description: 'Ask anything', icon: '❓', color: '#f59e0b', is_active: true },
    { id: 'secrets', name: 'Secrets', description: 'Deep secrets', icon: '🤫', color: '#6366f1', is_active: true },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newConfession, setNewConfession] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPostCategory, setSelectedPostCategory] = useState('work');
  const [userCredits, setUserCredits] = useState(85);

  const handleCreateConfession = () => {
    if (newConfession.trim()) {
      const newConf: Confession = {
        id: Date.now().toString(),
        user_id: user?.id || 'anonymous',
        username: 'You',
        content: newConfession,
        category: selectedPostCategory,
        has_audio: false,
        likes: 0,
        dislikes: 0,
        comments: 0,
        created_at: new Date().toISOString(),
        user_credits: userCredits,
        user_verified: false,
      };
      
      setConfessions(prev => [newConf, ...prev]);
      setNewConfession('');
      setShowCreateModal(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#8b5cf6';
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '📝';
  };

  const filteredConfessions = selectedCategory === 'all' 
    ? confessions 
    : confessions.filter(c => c.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <Text style={styles.headerTitle}>Anonymous Confessions</Text>
        <View style={styles.creditsContainer}>
          <Text style={styles.creditsText}>Credits: {userCredits}</Text>
        </View>
      </LinearGradient>

      {/* Categories Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.selectedCategoryChip,
                { borderColor: category.color }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#8b5cf6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredConfessions.map((confession) => (
          <View key={confession.id} style={styles.confessionCard}>
            <View style={styles.confessionHeader}>
              <View style={styles.userInfo}>
                <Text style={[styles.categoryBadge, { backgroundColor: getCategoryColor(confession.category) }]}>
                  {getCategoryIcon(confession.category)}
                </Text>
                <View style={styles.userDetails}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.username}>{confession.username}</Text>
                    {confession.user_verified && <Text style={styles.verifiedBadge}>✓</Text>}
                    <AnimatedFlame credits={confession.user_credits} />
                  </View>
                  <Text style={styles.categoryName}>{categories.find(c => c.id === confession.category)?.name}</Text>
                </View>
              </View>
              <View style={styles.timeInfo}>
                <View style={styles.timeRow}>
                  <Clock size={12} color="#6b7280" />
                  <Text style={styles.timestamp}>{formatDateTime(confession.created_at)}</Text>
                </View>
                <View style={styles.timeRow}>
                  <Calendar size={12} color="#6b7280" />
                  <Text style={styles.fullDate}>{new Date(confession.created_at).toLocaleDateString()}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.confessionContent}>{confession.content}</Text>

            {confession.has_audio && (
              <TouchableOpacity style={styles.audioButton}>
                <Mic size={16} color="#8b5cf6" />
                <Text style={styles.audioText}>Voice Note</Text>
              </TouchableOpacity>
            )}

            <View style={styles.actionBar}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart size={18} color="#ef4444" />
                <Text style={styles.actionText}>{confession.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MessageSquare size={18} color="#3b82f6" />
                <Text style={styles.actionText}>{confession.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Flag size={18} color="#f59e0b" />
                <Text style={styles.actionText}>Report</Text>
              </TouchableOpacity>
            </View>
          </View>
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
            <Text style={styles.modalTitle}>Share Your Confession</Text>

            {/* Category Selection */}
            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalCategoriesScroll}>
              {categories.filter(c => c.id !== 'all').map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.modalCategoryChip,
                    selectedPostCategory === category.id && styles.selectedModalCategoryChip,
                    { borderColor: category.color }
                  ]}
                  onPress={() => setSelectedPostCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.modalCategoryText,
                    selectedPostCategory === category.id && styles.selectedModalCategoryText
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput
              style={styles.confessionInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#6b7280"
              multiline
              value={newConfession}
              onChangeText={setNewConfession}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.postButton]}
                onPress={handleCreateConfession}
              >
                <Text style={styles.postButtonText}>Post</Text>
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
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
  },
  categoriesScroll: {
    flex: 1,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCategoryChip: {
    backgroundColor: '#8b5cf6',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  confessionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
  },
  confessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 16,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedBadge: {
    color: '#22c55e',
    fontSize: 12,
    marginLeft: 4,
  },
  categoryName: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  timestamp: {
    color: '#6b7280',
    fontSize: 12,
    marginLeft: 4,
  },
  fullDate: {
    color: '#6b7280',
    fontSize: 10,
    marginLeft: 4,
  },
  confessionContent: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  audioText: {
    color: '#8b5cf6',
    marginLeft: 8,
    fontSize: 14,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#9ca3af',
    marginLeft: 6,
    fontSize: 14,
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
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalCategoriesScroll: {
    marginBottom: 16,
  },
  modalCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  selectedModalCategoryChip: {
    backgroundColor: '#8b5cf6',
  },
  modalCategoryText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  selectedModalCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
  confessionInput: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
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
  postButton: {
    backgroundColor: '#8b5cf6',
  },
  cancelButtonText: {
    color: '#9ca3af',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});