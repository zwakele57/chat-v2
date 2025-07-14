import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface AnimatedFlameProps {
  credits: number;
}

export default function AnimatedFlame({ credits }: AnimatedFlameProps) {
  const flame1Anim = useRef(new Animated.Value(0)).current;
  const flame2Anim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (credits >= 100) {
      // Create flickering animation
      const createFlickerAnimation = (animValue: Animated.Value) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 300 + Math.random() * 200,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 300 + Math.random() * 200,
              useNativeDriver: true,
            }),
          ])
        );
      };

      // Scale animation for pulsing effect
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      createFlickerAnimation(flame1Anim).start();
      createFlickerAnimation(flame2Anim).start();
      scaleAnimation.start();
    }
  }, [credits]);

  if (credits < 100) {
    return null;
  }

  return (
    <View style={styles.flameContainer}>
      <Animated.Text
        style={[
          styles.flame,
          {
            transform: [
              { rotate: '-10deg' },
              { scale: scaleAnim },
              {
                translateY: flame1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -2],
                }),
              },
            ],
            opacity: flame1Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.7, 1],
            }),
          },
        ]}
      >
        🔥
      </Animated.Text>
      <Animated.Text
        style={[
          styles.flame,
          {
            transform: [
              { rotate: '10deg' },
              { scale: scaleAnim },
              {
                translateY: flame2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -3],
                }),
              },
            ],
            opacity: flame2Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
        ]}
      >
        🔥
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flameContainer: {
    flexDirection: 'row',
    marginLeft: 6,
  },
  flame: {
    fontSize: 16,
    marginLeft: -8,
  },
});