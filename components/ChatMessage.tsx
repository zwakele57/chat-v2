import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mic, Image as ImageIcon, Video } from 'lucide-react-native';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: string;
    hasAudio: boolean;
    hasImage: boolean;
    hasVideo: boolean;
    userCredits: number;
    messageColor: string;
  };
  isOwnMessage: boolean;
}

export default function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  const renderFlameEffect = (credits: number) => {
    if (credits >= 100) {
      return <Text style={styles.flameEffect}>🔥</Text>;
    }
    return null;
  };

  const renderMediaAttachment = () => {
    if (message.hasAudio) {
      return (
        <TouchableOpacity style={styles.mediaButton}>
          <Mic size={16} color="#8b5cf6" />
          <Text style={styles.mediaText}>Voice Note (30s)</Text>
        </TouchableOpacity>
      );
    }

    if (message.hasImage) {
      return (
        <TouchableOpacity style={styles.mediaButton}>
          <ImageIcon size={16} color="#3b82f6" />
          <Text style={styles.mediaText}>Image (2.1 MB)</Text>
        </TouchableOpacity>
      );
    }

    if (message.hasVideo) {
      return (
        <TouchableOpacity style={styles.mediaButton}>
          <Video size={16} color="#ef4444" />
          <Text style={styles.mediaText}>Video (4.8 MB)</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[
      styles.messageContainer,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.messageBubble,
        isOwnMessage ? styles.ownBubble : styles.otherBubble,
        { backgroundColor: message.messageColor || (isOwnMessage ? '#8b5cf6' : '#374151') }
      ]}>
        {!isOwnMessage && (
          <View style={styles.userInfo}>
            <Text style={styles.anonymousUser}>Anonymous</Text>
            {renderFlameEffect(message.userCredits)}
          </View>
        )}

        <Text style={styles.messageText}>{message.content}</Text>

        {renderMediaAttachment()}

        <Text style={styles.timestamp}>{message.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  anonymousUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  flameEffect: {
    marginLeft: 6,
    fontSize: 14,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  mediaText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'right',
  },
});