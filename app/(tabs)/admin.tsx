import React, { useState } from 'react';
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
import { Shield, TriangleAlert as AlertTriangle, Users, DollarSign, Eye, Ban, CircleCheck as CheckCircle, Gift } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Report {
  id: string;
  type: 'post' | 'user' | 'group';
  reportedBy: string;
  content: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

interface BanAction {
  id: string;
  userId: string;
  reason: string;
  reportedBy: string;
  timestamp: string;
}

export default function AdminScreen() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      type: 'post',
      reportedBy: 'user_123',
      content: 'Inappropriate confession about illegal activities...',
      reason: 'Illegal content',
      timestamp: '2 hours ago',
      status: 'pending',
    },
    {
      id: '2',
      type: 'user',
      reportedBy: 'user_456',
      content: 'User sending harassing messages in chat',
      reason: 'Harassment',
      timestamp: '1 hour ago',
      status: 'pending',
    },
  ]);

  const [stats, setStats] = useState({
    totalUsers: 124567,
    onlineUsers: 3420,
    totalReports: 45,
    pendingReports: 12,
    totalRevenue: 15670,
    dailyActiveUsers: 28456,
  });

  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [creditAmount, setCreditAmount] = useState('');

  const [recentBans, setRecentBans] = useState<BanAction[]>([]);

  const handleResolveReport = (reportId: string, action: 'ban' | 'dismiss') => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    if (action === 'ban') {
      Alert.alert(
        'Confirm Ban',
        `Are you sure you want to ban this user for: ${report.reason}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Ban User',
            style: 'destructive',
            onPress: () => {
              // Ban the user
              const banAction: BanAction = {
                id: Date.now().toString(),
                userId: 'banned_user_' + reportId,
                reason: report.reason,
                reportedBy: report.reportedBy,
                timestamp: 'Just now',
              };
              setRecentBans(prev => [banAction, ...prev]);

              // Update report status
              setReports(prev =>
                prev.map(r =>
                  r.id === reportId ? { ...r, status: 'resolved' } : r
                )
              );

              // Notify the reporter
              Alert.alert(
                'User Banned',
                `The reported user has been banned. The reporter (${report.reportedBy}) will be notified.`
              );
            },
          },
        ]
      );
    } else {
      setReports(prev =>
        prev.map(r =>
          r.id === reportId ? { ...r, status: 'dismissed' } : r
        )
      );
    }
  };

  const handleGiveCredits = () => {
    if (!selectedUserId || !creditAmount) {
      Alert.alert('Error', 'Please enter both User ID and credit amount');
      return;
    }

    const amount = parseInt(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid credit amount');
      return;
    }

    Alert.alert(
      'Credits Given',
      `Successfully gave ${amount} credits to user ${selectedUserId}`
    );

    setSelectedUserId('');
    setCreditAmount('');
    setShowCreditModal(false);
  };

  const renderStatCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    color: string
  ) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        {icon}
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value.toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <Shield size={24} color="#8b5cf6" />
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Statistics Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'Total Users',
              stats.totalUsers,
              <Users size={20} color="#3b82f6" />,
              '#3b82f6'
            )}
            {renderStatCard(
              'Online Now',
              stats.onlineUsers,
              <Eye size={20} color="#22c55e" />,
              '#22c55e'
            )}
            {renderStatCard(
              'Pending Reports',
              stats.pendingReports,
              <AlertTriangle size={20} color="#f59e0b" />,
              '#f59e0b'
            )}
            {renderStatCard(
              'Revenue ($)',
              stats.totalRevenue,
              <DollarSign size={20} color="#8b5cf6" />,
              '#8b5cf6'
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}
              onPress={() => setShowCreditModal(true)}
            >
              <Gift size={20} color="white" />
              <Text style={styles.actionButtonText}>Give Credits</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
            >
              <Users size={20} color="white" />
              <Text style={styles.actionButtonText}>User Management</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reports Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          {reports
            .filter(report => report.status === 'pending')
            .map(report => (
              <View key={report.id} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <View style={styles.reportType}>
                    <AlertTriangle size={16} color="#f59e0b" />
                    <Text style={styles.reportTypeText}>
                      {report.type.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.reportTime}>{report.timestamp}</Text>
                </View>

                <Text style={styles.reportReason}>Reason: {report.reason}</Text>
                <Text style={styles.reportContent}>{report.content}</Text>
                <Text style={styles.reportedBy}>
                  Reported by: {report.reportedBy}
                </Text>

                <View style={styles.reportActions}>
                  <TouchableOpacity
                    style={[styles.reportActionButton, styles.banButton]}
                    onPress={() => handleResolveReport(report.id, 'ban')}
                  >
                    <Ban size={16} color="white" />
                    <Text style={styles.reportActionText}>Ban User</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.reportActionButton, styles.dismissButton]}
                    onPress={() => handleResolveReport(report.id, 'dismiss')}
                  >
                    <CheckCircle size={16} color="white" />
                    <Text style={styles.reportActionText}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>

        {/* Recent Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Ban Actions</Text>
          {recentBans.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent ban actions</Text>
            </View>
          ) : (
            recentBans.map(ban => (
              <View key={ban.id} style={styles.banCard}>
                <View style={styles.banHeader}>
                  <Ban size={16} color="#ef4444" />
                  <Text style={styles.banTitle}>User Banned</Text>
                  <Text style={styles.banTime}>{ban.timestamp}</Text>
                </View>
                <Text style={styles.banReason}>Reason: {ban.reason}</Text>
                <Text style={styles.banReporter}>
                  Reported by: {ban.reportedBy}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Give Credits Modal */}
      <Modal visible={showCreditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Give Credits to User</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="User ID"
              placeholderTextColor="#6b7280"
              value={selectedUserId}
              onChangeText={setSelectedUserId}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Credit Amount"
              placeholderTextColor="#6b7280"
              value={creditAmount}
              onChangeText={setCreditAmount}
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.giveButton]}
                onPress={handleGiveCredits}
              >
                <Text style={styles.giveButtonText}>Give Credits</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  reportCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportTypeText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  reportTime: {
    color: '#6b7280',
    fontSize: 12,
  },
  reportReason: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  reportContent: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  reportedBy: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 16,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  banButton: {
    backgroundColor: '#ef4444',
  },
  dismissButton: {
    backgroundColor: '#22c55e',
  },
  reportActionText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 16,
  },
  banCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  banHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  banTitle: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  banTime: {
    color: '#6b7280',
    fontSize: 12,
  },
  banReason: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 4,
  },
  banReporter: {
    color: '#9ca3af',
    fontSize: 12,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
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
  giveButton: {
    backgroundColor: '#8b5cf6',
  },
  cancelButtonText: {
    color: '#9ca3af',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  giveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});