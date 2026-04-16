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

type Props = NativeStackScreenProps<RootStackParamList, 'AskRiver'>;

const BG = require('../assets/ask_river_bg.png');
const BACK_ICON = require('../assets/back_arrow.png');

type AskStep = 'form' | 'loader' | 'result';
type RiverAnswer = 'YES' | 'NO';

const ANSWERS: RiverAnswer[] = ['YES', 'NO'];

const KEY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export default function AskRiverScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [question, setQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const [step, setStep] = useState<AskStep>('form');
  const [answer, setAnswer] = useState<RiverAnswer>('YES');

  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(24)).current;
  const cardScale = useRef(new Animated.Value(0.97)).current;

  const loaderPulseA = useRef(new Animated.Value(0.4)).current;
  const loaderPulseB = useRef(new Animated.Value(0.25)).current;
  const loaderRotate = useRef(new Animated.Value(0)).current;

  const answerPop = useRef(new Animated.Value(0.85)).current;
  const answerGlow = useRef(new Animated.Value(0)).current;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSmall = height < 780;
  const isVerySmall = height < 700;
  const isTiny = height < 640;

  const panelWidth = useMemo(() => {
    if (isTiny) return Math.min(width - 28, 318);
    if (isVerySmall) return Math.min(width - 30, 336);
    return Math.min(width - 34, 360);
  }, [width, isTiny, isVerySmall]);

  const keySize = isTiny ? 24 : isVerySmall ? 26 : 28;
  const keyFont = isTiny ? 10 : 12;
  const actionButtonHeight = isTiny ? 50 : isVerySmall ? 54 : 56;
  const actionButtonWidth = isTiny ? 162 : 176;

  useEffect(() => {
    cardFade.setValue(0);
    cardSlide.setValue(24);
    cardScale.setValue(0.97);

    Animated.parallel([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardSlide, {
        toValue: 0,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    if (step === 'loader') {
      loaderPulseA.setValue(0.35);
      loaderPulseB.setValue(0.2);
      loaderRotate.setValue(0);

      const pulseA = Animated.loop(
        Animated.sequence([
          Animated.timing(loaderPulseA, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(loaderPulseA, {
            toValue: 0.35,
            duration: 900,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

      const pulseB = Animated.loop(
        Animated.sequence([
          Animated.timing(loaderPulseB, {
            toValue: 0.9,
            duration: 1100,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(loaderPulseB, {
            toValue: 0.2,
            duration: 1100,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

      const rotate = Animated.loop(
        Animated.timing(loaderRotate, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      pulseA.start();
      pulseB.start();
      rotate.start();

      return () => {
        pulseA.stop();
        pulseB.stop();
        rotate.stop();
      };
    }

    if (step === 'result') {
      answerPop.setValue(0.85);
      answerGlow.setValue(0);

      Animated.parallel([
        Animated.spring(answerPop, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(answerGlow, {
            toValue: 1,
            duration: 240,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(answerGlow, {
            toValue: 0.6,
            duration: 500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [
    step,
    cardFade,
    cardSlide,
    cardScale,
    loaderPulseA,
    loaderPulseB,
    loaderRotate,
    answerPop,
    answerGlow,
  ]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const appendKey = (key: string) => {
    if (question.length >= 56) return;
    setQuestion(prev => prev + key);
  };

  const addSpace = () => {
    if (!question.length || question.endsWith(' ') || question.length >= 56) return;
    setQuestion(prev => prev + ' ');
  };

  const removeLast = () => {
    setQuestion(prev => prev.slice(0, -1));
  };

  const clearCurrent = () => {
    setQuestion('');
  };

  const handleStart = () => {
    const trimmed = question.trim();

    if (!trimmed) {
      Alert.alert('Question required', 'Write a short question before asking the river.');
      return;
    }

    setSubmittedQuestion(trimmed);
    setStep('loader');

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const picked = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
      setAnswer(picked);
      setStep('result');
    }, 1900);
  };

  const handleBack = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    navigation.replace('Menu');
  };

  const handleAskAgain = () => {
    setQuestion('');
    setSubmittedQuestion('');
    setStep('form');
  };

  const handleShare = async () => {
    const tone =
      answer === 'YES'
        ? 'The river leans toward a positive direction.'
        : 'The river suggests pause, patience, or another path.';

    try {
      await Share.share({
        message: `Ask River\nQuestion: ${submittedQuestion}\nAnswer: ${answer}\n${tone}`,
      });
    } catch {}
  };

  const answerTitle = answer === 'YES' ? 'The current opens forward' : 'The current asks for patience';

  const answerDescription =
    answer === 'YES'
      ? 'This answer supports movement, action, or confidence in the next step.'
      : 'This answer points to delay, rethinking, or waiting for a clearer moment.';

  const loaderRotation = loaderRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.root}>
          <Animated.View
            style={[
              styles.headerWrap,
              {
                width: panelWidth,
                marginTop: insets.top + 4,
                opacity: cardFade,
                transform: [{ translateY: cardSlide }],
              },
            ]}
          >
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Image source={BACK_ICON} style={styles.backIcon} resizeMode="contain" />
            </Pressable>

            <View style={styles.titleBadge}>
              <Text style={[styles.headerTitle, isVerySmall && styles.headerTitleSmall]}>
                ASK RIVER
              </Text>
            </View>
          </Animated.View>

          {step === 'form' && (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: isTiny ? 18 : 28 },
              ]}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Animated.View
                style={[
                  styles.card,
                  {
                    width: panelWidth,
                    marginTop: isTiny ? 16 : isVerySmall ? 22 : 28,
                    opacity: cardFade,
                    transform: [{ translateY: cardSlide }, { scale: cardScale }],
                  },
                ]}
              >
                <View style={styles.topAccent} />

                <Text style={[styles.sectionEyebrow, isTiny && styles.sectionEyebrowTiny]}>
                  RIVER QUESTION
                </Text>

                <Text style={[styles.mainTitle, isVerySmall && styles.mainTitleSmall]}>
                  Ask a short question and let the flow reveal a direction.
                </Text>

                <View style={[styles.previewBox, isTiny && styles.previewBoxTiny]}>
                  <View style={styles.previewHeader}>
                    <Text style={styles.previewLabel}>Question preview</Text>
                    <Text style={styles.previewCount}>{question.length}/56</Text>
                  </View>

                  <Text
                    style={[
                      styles.previewText,
                      isTiny && styles.previewTextTiny,
                      !question && styles.previewPlaceholder,
                    ]}
                  >
                    {question || 'SHOULD I TAKE THIS NEXT STEP'}
                  </Text>
                </View>

                <View style={styles.keyboardShell}>
                  <Text style={styles.keyboardHeading}>TYPE WITH THE RIVER KEYS</Text>

                  {KEY_ROWS.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.keyRow}>
                      {row.map(key => (
                        <Pressable
                          key={key}
                          onPress={() => appendKey(key)}
                          style={[
                            styles.keyButton,
                            {
                              width: keySize,
                              height: keySize + 2,
                              marginHorizontal: isTiny ? 1 : 1.5,
                            },
                          ]}
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

                <View style={styles.helperRow}>
                  <Text style={styles.helperText}>
                    Keep it direct. One question works best.
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.actionButton,
                    styles.primaryButton,
                    {
                      width: actionButtonWidth,
                      height: actionButtonHeight,
                    },
                  ]}
                  onPress={handleStart}
                >
                  <Text style={styles.actionText}>READ THE CURRENT</Text>
                </Pressable>
              </Animated.View>
            </ScrollView>
          )}

          {step === 'loader' && (
            <Animated.View
              style={[
                styles.loaderStage,
                {
                  width: panelWidth,
                  marginTop: isTiny ? 58 : isVerySmall ? 80 : 110,
                  opacity: cardFade,
                  transform: [{ translateY: cardSlide }, { scale: cardScale }],
                },
              ]}
            >
              <View style={styles.loaderArea}>
                <Animated.View
                  style={[
                    styles.loaderRingLarge,
                    {
                      opacity: loaderPulseA,
                      transform: [{ scale: loaderPulseA }],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.loaderRingSmall,
                    {
                      opacity: loaderPulseB,
                      transform: [{ scale: loaderPulseB }],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.loaderCore,
                    {
                      transform: [{ rotate: loaderRotation }],
                    },
                  ]}
                />
              </View>

              <Text style={[styles.loaderTitle, isVerySmall && styles.loaderTitleSmall]}>
                Listening to the river...
              </Text>

              <Text style={[styles.loaderSubtitle, isVerySmall && styles.loaderSubtitleSmall]}>
                The current is settling around your question.
              </Text>
            </Animated.View>
          )}

          {step === 'result' && (
            <Animated.View
              style={[
                styles.resultCard,
                {
                  width: panelWidth,
                  marginTop: isTiny ? 16 : isVerySmall ? 24 : 34,
                  opacity: cardFade,
                  transform: [{ translateY: cardSlide }, { scale: cardScale }],
                },
              ]}
            >
              <View style={styles.resultTopAccent} />

              <View style={styles.resultQuestionBox}>
                <Text style={styles.resultQuestionLabel}>YOUR QUESTION</Text>
                <Text
                  style={[styles.resultQuestionText, isVerySmall && styles.resultQuestionTextSmall]}
                  numberOfLines={3}
                  adjustsFontSizeToFit
                >
                  {submittedQuestion}
                </Text>
              </View>

              <Animated.View
                style={[
                  styles.answerBadge,
                  answer === 'YES' ? styles.answerBadgeYes : styles.answerBadgeNo,
                  {
                    transform: [{ scale: answerPop }],
                    opacity: answerGlow.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1],
                    }),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.answerText,
                    answer === 'YES' ? styles.answerTextYes : styles.answerTextNo,
                    isVerySmall && styles.answerTextSmall,
                  ]}
                >
                  {answer}
                </Text>
              </Animated.View>

              <Text style={[styles.answerTitle, isVerySmall && styles.answerTitleSmall]}>
                {answerTitle}
              </Text>

              <Text style={[styles.answerDescription, isVerySmall && styles.answerDescriptionSmall]}>
                {answerDescription}
              </Text>

              <View style={styles.resultButtons}>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.primaryButton,
                    {
                      width: actionButtonWidth,
                      height: actionButtonHeight,
                    },
                  ]}
                  onPress={handleAskAgain}
                >
                  <Text style={styles.actionText}>ASK AGAIN</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton,
                    styles.secondaryButton,
                    {
                      width: actionButtonWidth,
                      height: actionButtonHeight,
                    },
                  ]}
                  onPress={handleShare}
                >
                  <Text style={styles.actionText}>SHARE</Text>
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

  safe: {
    flex: 1,
  },

  root: {
    flex: 1,
    alignItems: 'center',
  },

  scroll: {
    width: '100%',
  },

  scrollContent: {
    alignItems: 'center',
  },

  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#25E11C',
    borderWidth: 2,
    borderColor: '#115E0E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.26,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  backIcon: {
    width: 18,
    height: 18,
  },

  titleBadge: {
    flex: 1,
    minHeight: 40,
    backgroundColor: 'rgba(244, 208, 111, 0.95)',
    borderWidth: 2,
    borderColor: '#8C4B00',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  headerTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  headerTitleSmall: {
    fontSize: 16,
  },

  card: {
    backgroundColor: 'rgba(233, 193, 102, 0.96)',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingHorizontal: 14,
    paddingTop: 0,
    paddingBottom: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },

  topAccent: {
    width: '100%',
    height: 10,
    backgroundColor: '#93540A',
    marginBottom: 12,
  },

  sectionEyebrow: {
    color: '#704400',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  sectionEyebrowTiny: {
    fontSize: 10,
  },

  mainTitle: {
    color: '#101010',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },

  mainTitleSmall: {
    fontSize: 18,
    lineHeight: 23,
  },

  previewBox: {
    width: '100%',
    minHeight: 78,
    borderWidth: 2,
    borderColor: '#8C4B00',
    backgroundColor: '#F7D57E',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 12,
  },

  previewBoxTiny: {
    minHeight: 70,
    marginBottom: 10,
  },

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  previewLabel: {
    color: '#6E4707',
    fontSize: 11,
    fontWeight: '900',
  },

  previewCount: {
    color: '#6E4707',
    fontSize: 11,
    fontWeight: '800',
  },

  previewText: {
    color: '#111111',
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
  },

  previewTextTiny: {
    fontSize: 13,
    lineHeight: 17,
  },

  previewPlaceholder: {
    color: '#B88831',
  },

  keyboardShell: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1.5,
    borderColor: '#8C4B00',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 10,
  },

  keyboardHeading: {
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },

  shortKey: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },

  spaceKey: {
    width: '46%',
    backgroundColor: '#25E11C',
    borderColor: '#115E0E',
  },

  clearKey: {
    width: '24%',
    backgroundColor: '#D78917',
    borderColor: '#7A4300',
  },

  deleteKey: {
    width: '24%',
    backgroundColor: '#D78917',
    borderColor: '#7A4300',
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

  helperRow: {
    width: '100%',
    marginTop: 10,
    marginBottom: 2,
    alignItems: 'center',
  },

  helperText: {
    color: '#593300',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  actionButton: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButton: {
    marginTop: 12,
    backgroundColor: '#23E51B',
    borderColor: '#11680D',
  },

  secondaryButton: {
    marginTop: 12,
    backgroundColor: '#D78917',
    borderColor: '#7A4300',
  },

  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.45,
    textAlign: 'center',
  },

  loaderStage: {
    alignItems: 'center',
  },

  loaderArea: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  loaderRingLarge: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
  },

  loaderRingSmall: {
    position: 'absolute',
    width: 102,
    height: 102,
    borderRadius: 51,
    borderWidth: 2,
    borderColor: 'rgba(233,193,102,0.7)',
  },

  loaderCore: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E9C166',
    borderWidth: 2,
    borderColor: '#8C4B00',
  },

  loaderTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },

  loaderTitleSmall: {
    fontSize: 21,
  },

  loaderSubtitle: {
    color: '#F4E7C1',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 18,
  },

  loaderSubtitleSmall: {
    fontSize: 13,
    lineHeight: 18,
  },

  resultCard: {
    backgroundColor: 'rgba(233, 193, 102, 0.96)',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingTop: 0,
    paddingBottom: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    overflow: 'hidden',
  },

  resultTopAccent: {
    width: '100%',
    height: 10,
    backgroundColor: '#93540A',
    marginBottom: 14,
  },

  resultQuestionBox: {
    width: '100%',
    backgroundColor: '#F7D57E',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultQuestionLabel: {
    color: '#6E4707',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: 0.8,
  },

  resultQuestionText: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 23,
  },

  resultQuestionTextSmall: {
    fontSize: 16,
    lineHeight: 20,
  },

  answerBadge: {
    minWidth: 176,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  answerBadgeYes: {
    backgroundColor: '#EFFFF0',
    borderColor: '#11880D',
  },

  answerBadgeNo: {
    backgroundColor: '#FFF0F0',
    borderColor: '#A41111',
  },

  answerText: {
    fontSize: 60,
    lineHeight: 64,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1.4,
  },

  answerTextSmall: {
    fontSize: 52,
    lineHeight: 56,
  },

  answerTextYes: {
    color: '#1EC61A',
  },

  answerTextNo: {
    color: '#E32626',
  },

  answerTitle: {
    marginTop: 14,
    color: '#111111',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    textAlign: 'center',
  },

  answerTitleSmall: {
    fontSize: 18,
    lineHeight: 22,
  },

  answerDescription: {
    marginTop: 8,
    color: '#3B2500',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 4,
  },

  answerDescriptionSmall: {
    fontSize: 13,
    lineHeight: 18,
  },

  resultButtons: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
});