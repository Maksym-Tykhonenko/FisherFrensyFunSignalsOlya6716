import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const BG = require('../assets/loabg.png');
const IMG_1 = require('../assets/onver_1.png');
const IMG_2 = require('../assets/onver_2.png');
const IMG_3 = require('../assets/onver_3.png');
const IMG_4 = require('../assets/onver_4.png');

const SLIDES = [
  {
    id: 0,
    image: IMG_1,
    eyebrow: 'RIVER WORLD',
    title: 'Step into a playful river atmosphere',
    text:
      'Meet the fisherman, the fish and the stork in a light world of daily reactions, mood moments and small discoveries waiting behind each screen.',
    button: 'CONTINUE',
  },
  {
    id: 1,
    image: IMG_2,
    eyebrow: 'DAILY SIGNALS',
    title: 'Ask questions and receive a river reply',
    text:
      'Open simple interactive screens to enter your name, ask for a signal and explore surprising answers shaped by the tone of the river.',
    button: 'NEXT',
  },
  {
    id: 2,
    image: IMG_3,
    eyebrow: 'COLLECT & OPEN',
    title: 'Gather worms and unlock more content',
    text:
      'Return every day to collect rewards, check your mood, open funny pieces of content and continue building your own path inside the app.',
    button: 'NEXT',
  },
  {
    id: 3,
    image: IMG_4,
    eyebrow: 'QUIZ PATH',
    title: 'Continue with stories, facts and short quizzes',
    text:
      'Move through small activities, discover themed pages and complete quick quiz steps to keep your progress active and your rewards growing.',
    button: 'START',
  },
] as const;

export default function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(24)).current;
  const heroScale = useRef(new Animated.Value(0.96)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(28)).current;
  const cardScale = useRef(new Animated.Value(0.97)).current;
  const badgeScale = useRef(new Animated.Value(0.9)).current;

  const isSmallScreen = height <= 720;
  const isVerySmallScreen = height <= 645;

  const slide = SLIDES[index];

  useEffect(() => {
    overlayOpacity.setValue(0);
    heroOpacity.setValue(0);
    heroTranslateY.setValue(24);
    heroScale.setValue(0.96);
    cardOpacity.setValue(0);
    cardTranslateY.setValue(28);
    cardScale.setValue(0.97);
    badgeScale.setValue(0.9);

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heroScale, {
        toValue: 1,
        duration: 540,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 420,
        delay: 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 560,
        delay: 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 560,
        delay: 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(badgeScale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    index,
    overlayOpacity,
    heroOpacity,
    heroTranslateY,
    heroScale,
    cardOpacity,
    cardTranslateY,
    cardScale,
    badgeScale,
  ]);

  const imageSize = useMemo(() => {
    const maxWidth = isVerySmallScreen
      ? Math.min(width - 92, 276)
      : isSmallScreen
      ? Math.min(width - 88, 300)
      : Math.min(width - 82, 324);

    const maxHeight = isVerySmallScreen
      ? Math.min(height * 0.31, 246)
      : isSmallScreen
      ? Math.min(height * 0.35, 292)
      : Math.min(height * 0.39, 338);

    return {
      width: maxWidth,
      height: maxHeight,
    };
  }, [width, height, isSmallScreen, isVerySmallScreen]);

  const bottomMargin = Math.max(insets.bottom, 0) + (isVerySmallScreen ? 16 : 22);
  const topPadding = insets.top + (isVerySmallScreen ? 10 : 16);

  const handleNext = () => {
    if (index === SLIDES.length - 1) {
      navigation.replace('Mood');
      return;
    }

    setIndex(prev => prev + 1);
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.root}>
          <Animated.View
            style={[
              styles.heroArea,
              {
                paddingTop: topPadding,
                opacity: heroOpacity,
                transform: [{ translateY: heroTranslateY }, { scale: heroScale }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBadge,
                {
                  transform: [{ scale: badgeScale }],
                },
              ]}
            >
              <Text style={[styles.progressText, isVerySmallScreen && styles.progressTextSmall]}>
                {index + 1}/{SLIDES.length}
              </Text>
            </Animated.View>

            <View style={styles.heroFrame}>
              <Image
                source={slide.image}
                style={[styles.heroImage, imageSize]}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.bottomWrap,
              {
                marginBottom: bottomMargin,
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslateY }, { scale: cardScale }],
              },
            ]}
          >
            <View
              style={[
                styles.bottomCard,
                isSmallScreen && styles.bottomCardSmall,
                isVerySmallScreen && styles.bottomCardVerySmall,
              ]}
            >
              <View style={styles.cardTopBar} />

              <Text
                style={[
                  styles.eyebrow,
                  isSmallScreen && styles.eyebrowSmall,
                  isVerySmallScreen && styles.eyebrowVerySmall,
                ]}
              >
                {slide.eyebrow}
              </Text>

              <Text
                style={[
                  styles.title,
                  isSmallScreen && styles.titleSmall,
                  isVerySmallScreen && styles.titleVerySmall,
                ]}
              >
                {slide.title}
              </Text>

              <Text
                style={[
                  styles.text,
                  isSmallScreen && styles.textSmall,
                  isVerySmallScreen && styles.textVerySmall,
                ]}
              >
                {slide.text}
              </Text>

              <View style={styles.dotsRow}>
                {SLIDES.map((item, dotIndex) => (
                  <View
                    key={item.id}
                    style={[
                      styles.dot,
                      dotIndex === index ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>

              <Pressable
                style={[
                  styles.button,
                  isSmallScreen && styles.buttonSmall,
                  isVerySmallScreen && styles.buttonVerySmall,
                ]}
                onPress={handleNext}
              >
                <Text
                  style={[
                    styles.buttonText,
                    isVerySmallScreen && styles.buttonTextVerySmall,
                  ]}
                >
                  {slide.button}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },

  safe: {
    flex: 1,
  },

  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  heroArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  progressBadge: {
    minWidth: 64,
    height: 34,
    backgroundColor: '#F3D68A',
    borderWidth: 2,
    borderColor: '#8E520A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  progressText: {
    color: '#16110B',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  progressTextSmall: {
    fontSize: 12,
  },

  heroFrame: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  heroImage: {
    maxWidth: '100%',
  },

  bottomWrap: {
    width: '100%',
    alignItems: 'center',
  },

  bottomCard: {
    width: '100%',
    maxWidth: 348,
    backgroundColor: '#E7C168',
    borderWidth: 2,
    borderColor: '#2A1B0E',
    paddingHorizontal: 18,
    paddingBottom: 16,
    alignItems: 'center',
    overflow: 'visible',
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  bottomCardSmall: {
    maxWidth: 330,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  bottomCardVerySmall: {
    maxWidth: 314,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },

  cardTopBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#8F520A',
    marginBottom: 12,
  },

  eyebrow: {
    color: '#6A4100',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 8,
    textAlign: 'center',
  },

  eyebrowSmall: {
    fontSize: 9.5,
    marginBottom: 7,
  },

  eyebrowVerySmall: {
    fontSize: 9,
    marginBottom: 6,
  },

  title: {
    color: '#16110B',
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    textAlign: 'center',
  },

  titleSmall: {
    fontSize: 18,
    lineHeight: 23,
  },

  titleVerySmall: {
    fontSize: 16,
    lineHeight: 20,
  },

  text: {
    marginTop: 12,
    color: '#2A1B0E',
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '600',
    textAlign: 'center',
    minHeight: 86,
  },

  textSmall: {
    marginTop: 10,
    fontSize: 11.5,
    lineHeight: 16,
    minHeight: 76,
  },

  textVerySmall: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 15,
    minHeight: 66,
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
  },

  dot: {
    width: 10,
    height: 10,
    marginHorizontal: 4,
    borderWidth: 1.5,
  },

  dotActive: {
    backgroundColor: '#1FD81D',
    borderColor: '#165F12',
  },

  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderColor: '#8E520A',
  },

  button: {
    width: 152,
    height: 48,
    backgroundColor: '#26D221',
    borderWidth: 2,
    borderColor: '#165F12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },

  buttonSmall: {
    width: 142,
    height: 46,
    marginBottom: -50,
  },

  buttonVerySmall: {
    width: 132,
    height: 42,
    marginBottom: -50,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.45,
  },

  buttonTextVerySmall: {
    fontSize: 13,
  },
});
