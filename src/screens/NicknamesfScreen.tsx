import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Share,
  useWindowDimensions,
  Alert,
  Image,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Nickname'>;
type ScreenStep = 'form' | 'result';

const BG = require('../assets/loabg.png');
const BACK_ICON = require('../assets/back_arrow.png');
const CONTINUE_ICON = require('../assets/worm_icon.png');

const NICKNAMES = [
  'River Lantern',
  'Morning Ripple',
  'Silver Drift',
  'Quiet Current',
  'Stone Echo',
  'Hidden Reed',
  'Soft Horizon',
  'Northern Stream',
  'Golden Reflection',
  'Misty Shore',
  'Deep Lantern',
  'Calm Passage',
  'Wild Spark',
  'Silent Wake',
  'Far Bank',
  'Twilight Ripple',
  'Silver Path',
  'Moon Current',
  'Secret Harbor',
  'Warm Drift',
  'Echo Water',
  'Dawn Trace',
  'Blue Horizon',
  'Floating Ember',
  'Soft Voyager',
  'River Whisper',
  'Quiet Traveler',
  'Wild Reflection',
  'Still Water',
  'Golden Passage',
  'Night Ripple',
  'Stone Current',
  'Hidden Path',
  'Silver Harbor',
  'Far Reflection',
  'River Gleam',
  'Morning Harbor',
  'Northern Echo',
  'Soft Wake',
  'Blue Drift',
  'Golden Ripple',
  'Calm Voyager',
  'Silent Lantern',
  'Moonlit Shore',
  'Secret Current',
  'Wild Horizon',
  'Deep Reflection',
  'River Glow',
  'Quiet Ember',
  'Silver Voyager',
] as const;

const KEY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export default function NicknameScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [resultNickname, setResultNickname] = useState('');
  const [step, setStep] = useState<ScreenStep>('form');

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(18)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(24)).current;
  const contentScale = useRef(new Animated.Value(0.98)).current;
  const badgeScale = useRef(new Animated.Value(0.88)).current;

  const isSmall = height < 760;
  const isVerySmall = height < 680;
  const isTiny = height < 630;

  const panelWidth = useMemo(() => {
    if (isTiny) return Math.min(width - 24, 314);
    if (isVerySmall) return Math.min(width - 30, 332);
    return Math.min(width - 36, 348);
  }, [width, isTiny, isVerySmall]);

  const keySize = isTiny ? 24 : isVerySmall ? 26 : 28;
  const keyFont = isTiny ? 10 : 12;
  const actionButtonWidth = isTiny ? 176 : 188;
  const actionButtonHeight = isTiny ? 50 : isVerySmall ? 52 : 56;

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
    contentOpacity.setValue(0);
    contentTranslateY.setValue(24);
    contentScale.setValue(0.98);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    if (step === 'result') {
      badgeScale.setValue(0.88);

      Animated.spring(badgeScale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }).start();
    }
  }, [step, contentOpacity, contentTranslateY, contentScale, badgeScale]);

  const appendKey = (key: string) => {
    if (name.length >= 18) return;
    setName(prev => prev + key);
  };

  const addSpace = () => {
    if (!name.length || name.endsWith(' ') || name.length >= 18) return;
    setName(prev => prev + ' ');
  };

  const removeLast = () => {
    setName(prev => prev.slice(0, -1));
  };

  const clearCurrent = () => {
    setName('');
  };

  const generateNickname = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Empty name', 'Please enter your name.');
      return;
    }

    const normalized = trimmedName.toUpperCase();
    const hash = normalized.split('').reduce((sum, ch, index) => {
      return sum + ch.charCodeAt(0) * (index + 1);
    }, 0);

    const index = hash % NICKNAMES.length;

    setSubmittedName(trimmedName);
    setResultNickname(NICKNAMES[index]);
    setStep('result');
  };

  const handleNewNickname = () => {
    setName('');
    setSubmittedName('');
    setResultNickname('');
    setStep('form');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `River Name\nName: ${submittedName}\nNickname: ${resultNickname}`,
      });
    } catch {}
  };

  const handleBack = () => {
    navigation.replace('Menu');
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.root}>
          <Animated.View
            style={[
              styles.header,
              {
                width: panelWidth,
                marginTop: insets.top + 6,
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslateY }],
              },
            ]}
          >
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Image source={BACK_ICON} style={styles.backIcon} resizeMode="contain" />
            </Pressable>

            <View style={styles.headerBadge}>
              <Text style={[styles.headerTitle, isVerySmall && styles.headerTitleSmall]}>
                RIVER NAME
              </Text>
            </View>
          </Animated.View>

          {step === 'form' && (
            <ScrollView
              style={styles.fullWidth}
              contentContainerStyle={styles.formScroll}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Animated.View
                style={[
                  styles.formCard,
                  {
                    width: panelWidth,
                    marginTop: isTiny ? 18 : isVerySmall ? 22 : 28,
                    paddingVertical: isTiny ? 14 : 18,
                    opacity: contentOpacity,
                    transform: [{ translateY: contentTranslateY }, { scale: contentScale }],
                  },
                ]}
              >
                <View style={styles.topBar} />

                <Text style={[styles.formEyebrow, isTiny && styles.formEyebrowTiny]}>
                  PERSONAL NAME STYLE
                </Text>

                <Text style={[styles.formTitle, isVerySmall && styles.formTitleSmall]}>
                  Enter your name and receive a unique river-style title
                </Text>

                <Text style={[styles.formSubtitle, isTiny && styles.formSubtitleTiny]}>
                  The result is generated from the letters of your name.
                </Text>

                <View style={[styles.inputBox, isTiny && styles.inputBoxTiny]}>
                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Your name</Text>
                    <Text style={styles.inputCounter}>{name.length}/18</Text>
                  </View>

                  <Text
                    style={[
                      styles.inputValue,
                      isTiny && styles.inputValueTiny,
                      !name && styles.placeholderText,
                    ]}
                    numberOfLines={1}
                  >
                    {name || 'Enter name'}
                  </Text>
                </View>

                <View style={styles.keyboardWrap}>
                  <Text style={styles.keyboardTitle}>LETTER BOARD</Text>

                  {KEY_ROWS.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.keyRow}>
                      {row.map(key => (
                        <Pressable
                          key={key}
                          style={[
                            styles.keyButton,
                            {
                              width: keySize,
                              height: keySize + 2,
                              marginHorizontal: isTiny ? 1 : 1.5,
                            },
                          ]}
                          onPress={() => appendKey(key)}
                        >
                          <Text style={[styles.keyText, { fontSize: keyFont }]}>{key}</Text>
                        </Pressable>
                      ))}
                    </View>
                  ))}

                  <View style={[styles.bottomKeyRow, isTiny && styles.bottomKeyRowTiny]}>
                    <Pressable style={[styles.longKey, styles.spaceKey]} onPress={addSpace}>
                      <Text style={[styles.longKeyText, isTiny && styles.longKeyTextTiny]}>
                        SPACE
                      </Text>
                    </Pressable>

                    <Pressable style={[styles.shortKey, styles.clearKey]} onPress={clearCurrent}>
                      <Text style={[styles.longKeyText, isTiny && styles.longKeyTextTiny]}>
                        CLEAR
                      </Text>
                    </Pressable>

                    <Pressable style={[styles.shortKey, styles.deleteKey]} onPress={removeLast}>
                      <Text style={[styles.longKeyText, isTiny && styles.longKeyTextTiny]}>
                        ⌫
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  style={[
                    styles.actionButton,
                    styles.primaryButton,
                    { width: actionButtonWidth, height: actionButtonHeight },
                  ]}
                  onPress={generateNickname}
                >
                  <Image source={CONTINUE_ICON} style={styles.continueIcon} resizeMode="contain" />
                  <Text style={styles.actionButtonText}>GENERATE</Text>
                </Pressable>
              </Animated.View>
            </ScrollView>
          )}

          {step === 'result' && (
            <Animated.View
              style={[
                styles.resultWrap,
                {
                  width: panelWidth,
                  marginTop: isVerySmall ? 26 : 34,
                  opacity: contentOpacity,
                  transform: [{ translateY: contentTranslateY }, { scale: contentScale }],
                },
              ]}
            >
              <View style={styles.resultCard}>
                <View style={styles.topBar} />

                <Text style={[styles.resultEyebrow, isTiny && styles.resultEyebrowTiny]}>
                  GENERATED TITLE
                </Text>

                <Text style={[styles.resultHeader, isVerySmall && styles.resultHeaderSmall]}>
                  Your river nickname
                </Text>

                <Text style={[styles.resultForText, isTiny && styles.resultForTextTiny]}>
                  For: {submittedName}
                </Text>

                <Animated.View
                  style={[
                    styles.resultNameBox,
                    {
                      transform: [{ scale: badgeScale }],
                    },
                  ]}
                >
                  <Text
                    style={[styles.resultNameText, isVerySmall && styles.resultNameTextSmall]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {resultNickname}
                  </Text>
                </Animated.View>

                <Text style={[styles.resultSubText, isVerySmall && styles.resultSubTextSmall]}>
                  A calm title shaped by your entered name.
                </Text>

                <Pressable
                  style={[
                    styles.actionButton,
                    styles.primaryButton,
                    {
                      width: actionButtonWidth,
                      height: actionButtonHeight,
                      marginTop: 16,
                    },
                  ]}
                  onPress={handleNewNickname}
                >
                  <Text style={styles.actionButtonText}>TRY ANOTHER</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton,
                    styles.secondaryButton,
                    {
                      width: actionButtonWidth,
                      height: actionButtonHeight,
                      marginTop: 12,
                    },
                  ]}
                  onPress={handleShare}
                >
                  <Text style={styles.actionButtonText}>SHARE</Text>
                </Pressable>
              </View>
            </Animated.View>
          )}
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
    backgroundColor: 'rgba(0,0,0,0.28)',
  },

  safe: {
    flex: 1,
  },

  root: {
    flex: 1,
    alignItems: 'center',
  },

  fullWidth: {
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#27E51E',
    borderWidth: 2,
    borderColor: '#11680D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  backIcon: {
    width: 18,
    height: 18,
  },

  headerBadge: {
    flex: 1,
    minHeight: 40,
    backgroundColor: '#F3D688',
    borderWidth: 2,
    borderColor: '#8C4B00',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  headerTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  headerTitleSmall: {
    fontSize: 16,
  },

  formScroll: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 24,
  },

  formCard: {
    backgroundColor: '#E9C166',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingHorizontal: 14,
    alignItems: 'center',
    overflow: 'hidden',
  },

  topBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#93540A',
    marginBottom: 12,
  },

  formEyebrow: {
    color: '#6B4100',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  formEyebrowTiny: {
    fontSize: 9,
  },

  formTitle: {
    color: '#111111',
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 8,
  },

  formTitleSmall: {
    fontSize: 17,
    lineHeight: 22,
  },

  formSubtitle: {
    color: '#5A3500',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },

  formSubtitleTiny: {
    fontSize: 11,
    lineHeight: 15,
  },

  inputBox: {
    width: '100%',
    minHeight: 60,
    borderWidth: 2,
    borderColor: '#8C4B00',
    backgroundColor: '#F0C869',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    justifyContent: 'center',
  },

  inputBoxTiny: {
    minHeight: 54,
    marginBottom: 8,
  },

  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  inputLabel: {
    color: '#6B4100',
    fontSize: 11,
    fontWeight: '900',
  },

  inputCounter: {
    color: '#6B4100',
    fontSize: 11,
    fontWeight: '800',
  },

  inputValue: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },

  inputValueTiny: {
    fontSize: 13,
  },

  placeholderText: {
    color: '#B88831',
  },

  keyboardWrap: {
    width: '100%',
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: '#8C4B00',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 10,
  },

  keyboardTitle: {
    color: '#5A3500',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.8,
  },

  keyRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    marginBottom: 6,
  },

  keyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#8C4B00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  keyText: {
    color: '#111111',
    fontWeight: '900',
  },

  bottomKeyRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  bottomKeyRowTiny: {
    marginTop: 2,
  },

  longKey: {
    height: 34,
    backgroundColor: '#27E51E',
    borderWidth: 2,
    borderColor: '#11680D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shortKey: {
    height: 34,
    backgroundColor: '#D78917',
    borderWidth: 2,
    borderColor: '#7A4300',
    alignItems: 'center',
    justifyContent: 'center',
  },

  spaceKey: {
    width: '46%',
  },

  clearKey: {
    width: '24%',
  },

  deleteKey: {
    width: '24%',
  },

  longKeyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  longKeyTextTiny: {
    fontSize: 10,
  },

  actionButton: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  primaryButton: {
    backgroundColor: '#23E51B',
    borderColor: '#11680D',
  },

  secondaryButton: {
    backgroundColor: '#D78917',
    borderColor: '#7A4300',
  },

  continueIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  resultWrap: {
    alignItems: 'center',
  },

  resultCard: {
    width: '100%',
    backgroundColor: '#E9C166',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingHorizontal: 14,
    paddingBottom: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },

  resultEyebrow: {
    color: '#6B4100',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  resultEyebrowTiny: {
    fontSize: 9,
  },

  resultHeader: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },

  resultHeaderSmall: {
    fontSize: 19,
  },

  resultForText: {
    color: '#5A3500',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },

  resultForTextTiny: {
    fontSize: 12,
  },

  resultNameBox: {
    width: '100%',
    minHeight: 74,
    backgroundColor: '#F0C869',
    borderWidth: 2,
    borderColor: '#8C4B00',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 14,
  },

  resultNameText: {
    color: '#111111',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  resultNameTextSmall: {
    fontSize: 17,
  },

  resultSubText: {
    color: '#5A3500',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 6,
  },

  resultSubTextSmall: {
    fontSize: 13,
    lineHeight: 17,
  },
});