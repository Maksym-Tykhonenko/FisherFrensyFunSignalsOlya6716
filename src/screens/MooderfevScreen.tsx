import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  Alert,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Mood'>;

const BG = require('../assets/loabg.png');
const WORM_ICON = require('../assets/worm_icon.png');

const STORAGE_TOTAL_WORMS = 'river_total_worms';
const STORAGE_SELECTED_MOOD = 'river_selected_mood';
const STORAGE_MOOD_REWARD_PREFIX = 'river_mood_reward_claimed_';

type MoodType = 'Funny' | 'Neutral' | 'Sad';
type StepType = 'pick' | 'reward';

const MOOD_META: Record<
  MoodType,
  { reward: number; title: string; note: string; color: string; border: string }
> = {
  Funny: {
    reward: 20,
    title: 'Funny',
    note: 'A playful mood for a light story path.',
    color: '#1FE11B',
    border: '#0F630D',
  },
  Neutral: {
    reward: 20,
    title: 'Neutral',
    note: 'A balanced mood for a calm reading flow.',
    color: '#D78917',
    border: '#7A4300',
  },
  Sad: {
    reward: 20,
    title: 'Sad',
    note: 'A quiet mood for a softer story atmosphere.',
    color: '#D93A3A',
    border: '#7F1111',
  },
};

function getTodayRewardKey() {
  const today = new Date().toISOString().slice(0, 10);
  return `${STORAGE_MOOD_REWARD_PREFIX}${today}`;
}

export default function MoodScreen({ navigation }: Props) {
  const [step, setStep] = useState<StepType>('pick');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [saving, setSaving] = useState(false);

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(18)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(28)).current;
  const cardScale = useRef(new Animated.Value(0.97)).current;
  const rewardScale = useRef(new Animated.Value(0.86)).current;
  const wormFloat = useRef(new Animated.Value(0)).current;

  const isSmall = height < 760;
  const isVerySmall = height < 680;
  const isTiny = height < 630;

  const cardWidth = useMemo(() => {
    if (isTiny) return Math.min(width - 26, 312);
    if (isVerySmall) return Math.min(width - 34, 326);
    return Math.min(width - 42, 340);
  }, [width, isTiny, isVerySmall]);

  const reward = selectedMood ? MOOD_META[selectedMood].reward : 20;

  useEffect(() => {
    headerOpacity.setValue(0);
    headerTranslateY.setValue(18);

    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 430,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerOpacity, headerTranslateY]);

  useEffect(() => {
    cardOpacity.setValue(0);
    cardTranslateY.setValue(28);
    cardScale.setValue(0.97);

    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    if (step === 'reward') {
      rewardScale.setValue(0.86);

      Animated.spring(rewardScale, {
        toValue: 1,
        friction: 5,
        tension: 95,
        useNativeDriver: true,
      }).start();

      wormFloat.setValue(0);

      const floatLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(wormFloat, {
            toValue: 1,
            duration: 1700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(wormFloat, {
            toValue: 0,
            duration: 1700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );

      floatLoop.start();

      return () => {
        floatLoop.stop();
      };
    }
  }, [step, cardOpacity, cardTranslateY, cardScale, rewardScale, wormFloat]);

  const handleSelectMood = (mood: MoodType) => {
    if (saving) return;
    setSelectedMood(mood);
    setStep('reward');
  };

  const handleClaimReward = async () => {
    if (!selectedMood || saving) {
      return;
    }

    try {
      setSaving(true);

      const rewardKey = getTodayRewardKey();
      const alreadyClaimed = await AsyncStorage.getItem(rewardKey);

      await AsyncStorage.setItem(STORAGE_SELECTED_MOOD, selectedMood);

      if (!alreadyClaimed) {
        const wormsRaw = await AsyncStorage.getItem(STORAGE_TOTAL_WORMS);
        const currentWorms = wormsRaw ? Number(wormsRaw) || 0 : 0;
        const nextWorms = currentWorms + reward;

        await AsyncStorage.multiSet([
          [STORAGE_TOTAL_WORMS, String(nextWorms)],
          [rewardKey, '1'],
        ]);
      }

      navigation.replace('Menu');
    } catch {
      Alert.alert('Error', 'Failed to save your mood reward.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    navigation.replace('Menu');
  };

  const handleBackToPick = () => {
    if (saving) return;
    setStep('pick');
    setSelectedMood(null);
  };

  const wormTranslateY = wormFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const selectedMeta = selectedMood ? MOOD_META[selectedMood] : null;

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.root}>
          <Animated.View
            style={[
              styles.headerWrap,
              {
                width: cardWidth,
                marginTop: insets.top + 6,
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslateY }],
              },
            ]}
          >
            <View style={styles.headerBadge}>
              <Text style={[styles.headerTitle, isTiny && styles.headerTitleTiny]}>
                DAILY MOOD
              </Text>
            </View>
          </Animated.View>

          {step === 'pick' ? (
            <Animated.View
              style={[
                styles.pickCard,
                {
                  width: cardWidth,
                  marginTop: isTiny ? 18 : isVerySmall ? 24 : 32,
                  marginBottom: Math.max(insets.bottom, 16) + 28,
                  paddingVertical: isVerySmall ? 18 : 22,
                  opacity: cardOpacity,
                  transform: [{ translateY: cardTranslateY }, { scale: cardScale }],
                },
              ]}
            >
              <View style={styles.cardTopBar} />

              <Text style={[styles.cardEyebrow, isTiny && styles.cardEyebrowTiny]}>
                STORY ATMOSPHERE
              </Text>

              <Text style={[styles.cardTitle, isSmall && styles.cardTitleSmall]}>
                Choose the mood that matches your day
              </Text>

              <Text style={[styles.cardSubtitle, isTiny && styles.cardSubtitleTiny]}>
                Your selection personalizes the tone and also unlocks today’s reward.
              </Text>

              <Pressable
                style={[
                  styles.moodButton,
                  {
                    backgroundColor: MOOD_META.Funny.color,
                    borderColor: MOOD_META.Funny.border,
                    marginTop: 16,
                  },
                ]}
                onPress={() => handleSelectMood('Funny')}
              >
                <Text style={styles.moodButtonTitle}>Funny</Text>
                <Text style={styles.moodButtonNote}>{MOOD_META.Funny.note}</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.moodButton,
                  {
                    backgroundColor: MOOD_META.Neutral.color,
                    borderColor: MOOD_META.Neutral.border,
                  },
                ]}
                onPress={() => handleSelectMood('Neutral')}
              >
                <Text style={styles.moodButtonTitle}>Neutral</Text>
                <Text style={styles.moodButtonNote}>{MOOD_META.Neutral.note}</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.moodButton,
                  {
                    backgroundColor: MOOD_META.Sad.color,
                    borderColor: MOOD_META.Sad.border,
                  },
                ]}
                onPress={() => handleSelectMood('Sad')}
              >
                <Text style={styles.moodButtonTitle}>Sad</Text>
                <Text style={styles.moodButtonNote}>{MOOD_META.Sad.note}</Text>
              </Pressable>
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                styles.rewardCard,
                {
                  width: cardWidth,
                  marginTop: isTiny ? 18 : isVerySmall ? 24 : 32,
                  marginBottom: Math.max(insets.bottom, 16) + 28,
                  opacity: cardOpacity,
                  transform: [{ translateY: cardTranslateY }, { scale: cardScale }],
                },
              ]}
            >
              <View style={styles.cardTopBar} />

              <Text style={[styles.cardEyebrow, isTiny && styles.cardEyebrowTiny]}>
                TODAY'S REWARD
              </Text>

              <Text style={[styles.rewardTitle, isSmall && styles.rewardTitleSmall]}>
                Mood saved successfully
              </Text>

              <Text style={[styles.rewardMoodText, isTiny && styles.rewardMoodTextTiny]}>
                {selectedMeta?.title}
              </Text>

              <Text style={[styles.rewardDescription, isTiny && styles.rewardDescriptionTiny]}>
                Your selected mood is now active for the current day.
              </Text>

              <Animated.View
                style={[
                  styles.rewardBadge,
                  {
                    transform: [{ scale: rewardScale }],
                  },
                ]}
              >
                <Animated.View
                  style={{
                    transform: [{ translateY: wormTranslateY }],
                  }}
                >
                  <Image
                    source={WORM_ICON}
                    style={[styles.wormImage, isVerySmall && styles.wormImageVerySmall]}
                    resizeMode="contain"
                  />
                </Animated.View>

                <View style={styles.rewardInfo}>
                  <Text style={[styles.rewardCount, isVerySmall && styles.rewardCountSmall]}>
                    +{reward}
                  </Text>
                  <Text style={[styles.rewardLabel, isTiny && styles.rewardLabelTiny]}>
                    WORMS
                  </Text>
                </View>
              </Animated.View>

              <Pressable
                style={[styles.claimButton, saving && styles.claimButtonDisabled]}
                onPress={handleClaimReward}
                disabled={saving}
              >
                <Text style={styles.claimButtonText}>
                  {saving ? 'SAVING...' : 'COLLECT REWARD'}
                </Text>
              </Pressable>

              <Pressable style={styles.secondaryLink} onPress={handleBackToPick}>
                <Text style={[styles.secondaryLinkText, isTiny && styles.secondaryLinkTextTiny]}>
                  Choose another mood
                </Text>
              </Pressable>
            </Animated.View>
          )}

          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={[styles.closeText, isTiny && styles.closeTextTiny]}>Close</Text>
          </Pressable>
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
    backgroundColor: 'rgba(0,0,0,0.38)',
  },

  safe: {
    flex: 1,
  },

  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 18,
  },

  headerWrap: {
    alignItems: 'center',
  },

  headerBadge: {
    width: '100%',
    minHeight: 42,
    backgroundColor: '#F4D68A',
    borderWidth: 2,
    borderColor: '#8D4F09',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  headerTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  headerTitleTiny: {
    fontSize: 16,
  },

  pickCard: {
    backgroundColor: '#E8C36B',
    borderWidth: 2,
    borderColor: '#6D3A00',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },

  rewardCard: {
    backgroundColor: '#E8C36B',
    borderWidth: 2,
    borderColor: '#6D3A00',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    overflow: 'hidden',
  },

  cardTopBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#8D4F09',
    marginBottom: 12,
  },

  cardEyebrow: {
    color: '#6B4100',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  cardEyebrowTiny: {
    fontSize: 9,
  },

  cardTitle: {
    color: '#111111',
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    textAlign: 'center',
  },

  cardTitleSmall: {
    fontSize: 19,
    lineHeight: 24,
  },

  cardSubtitle: {
    marginTop: 10,
    color: '#5A3500',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 4,
  },

  cardSubtitleTiny: {
    fontSize: 12,
    lineHeight: 16,
  },

  moodButton: {
    width: '100%',
    minHeight: 72,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
  },

  moodButtonTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  moodButtonNote: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },

  rewardTitle: {
    color: '#111111',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 2,
  },

  rewardTitleSmall: {
    fontSize: 20,
  },

  rewardMoodText: {
    marginTop: 10,
    color: '#5A3500',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },

  rewardMoodTextTiny: {
    fontSize: 16,
  },

  rewardDescription: {
    marginTop: 8,
    color: '#5A3500',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 6,
  },

  rewardDescriptionTiny: {
    fontSize: 12,
    lineHeight: 16,
  },

  rewardBadge: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#F6D98F',
    borderWidth: 2,
    borderColor: '#8D4F09',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  wormImage: {
    width: 94,
    height: 118,
    marginRight: 8,
  },

  wormImageVerySmall: {
    width: 78,
    height: 100,
    marginRight: 6,
  },

  rewardInfo: {
    alignItems: 'flex-start',
  },

  rewardCount: {
    color: '#111111',
    fontSize: 34,
    fontWeight: '900',
  },

  rewardCountSmall: {
    fontSize: 28,
  },

  rewardLabel: {
    color: '#6B4100',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  rewardLabelTiny: {
    fontSize: 10,
  },

  claimButton: {
    width: '100%',
    height: 58,
    backgroundColor: '#D78917',
    borderWidth: 2,
    borderColor: '#6D3A00',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  claimButtonDisabled: {
    opacity: 0.72,
  },

  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  secondaryLink: {
    marginTop: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  secondaryLinkText: {
    color: '#5A3500',
    fontSize: 14,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  secondaryLinkTextTiny: {
    fontSize: 12,
  },

  closeButton: {
    position: 'absolute',
    bottom: 22,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  closeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  closeTextTiny: {
    fontSize: 13,
  },
});