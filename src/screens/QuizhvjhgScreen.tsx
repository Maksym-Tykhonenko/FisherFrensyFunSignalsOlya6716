import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  Share,
  useWindowDimensions,
  Animated,
  Easing,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { STORY_QUIZ_LEVELS, type QuizLevel } from '../data/storyQuizLevels';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyQuiz'>;
type ScreenStep = 'loading' | 'quiz' | 'levelComplete';
type OptionId = 'A' | 'B' | 'C';

type SavedQuizProgress = {
  levelIndex: number;
  questionIndex: number;
  totalCorrectAnswers: number;
  totalWormsEarned: number;
  completedLevels: number[];
};

const BG = require('../assets/ask_river_bg.png');
const BACK_ICON = require('../assets/back_arrow.png');
const WORM_ICON = require('../assets/worm_icon.png');

const STORAGE_TOTAL_WORMS = 'river_total_worms';
const STORAGE_LEVEL_QUIZ_PROGRESS = 'river_level_quiz_progress_v3';

export default function DailyQuizScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [step, setStep] = useState<ScreenStep>('loading');
  const [levelIndex, setLevelIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<OptionId | null>(null);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [totalWormsEarned, setTotalWormsEarned] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [lastLevelReward, setLastLevelReward] = useState(0);
  const [saving, setSaving] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(16)).current;

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(26)).current;
  const contentScale = useRef(new Animated.Value(0.985)).current;

  const loaderFade = useRef(new Animated.Value(0)).current;
  const loaderScale = useRef(new Animated.Value(0.92)).current;
  const loaderSpin = useRef(new Animated.Value(0)).current;
  const loaderPulse = useRef(new Animated.Value(0.65)).current;

  const resultBadgeScale = useRef(new Animated.Value(0.86)).current;
  const answerDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isVerySmall = height < 690;
  const isTiny = height < 635;

  const panelWidth = useMemo(() => {
    if (isTiny) return Math.min(width - 22, 310);
    if (isVerySmall) return Math.min(width - 28, 330);
    return Math.min(width - 34, 352);
  }, [width, isTiny, isVerySmall]);

  const currentLevel: QuizLevel = STORY_QUIZ_LEVELS[levelIndex];
  const currentQuestion = currentLevel.questions[questionIndex];
  const questionProgress = `${questionIndex + 1}/${currentLevel.questions.length}`;
  const levelProgress = `${levelIndex + 1}/${STORY_QUIZ_LEVELS.length}`;
  const hasNextLevel = levelIndex < STORY_QUIZ_LEVELS.length - 1;
  const answeredCount = completedLevels.length;
  const completionPercent = Math.round(((questionIndex + 1) / currentLevel.questions.length) * 100);

  useEffect(() => {
    headerOpacity.setValue(0);
    headerTranslateY.setValue(16);

    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerOpacity, headerTranslateY]);

  useEffect(() => {
    if (step === 'loading') {
      loaderFade.setValue(0);
      loaderScale.setValue(0.92);
      loaderSpin.setValue(0);
      loaderPulse.setValue(0.65);

      Animated.parallel([
        Animated.timing(loaderFade, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(loaderScale, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      const spinLoop = Animated.loop(
        Animated.timing(loaderSpin, {
          toValue: 1,
          duration: 2200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(loaderPulse, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(loaderPulse, {
            toValue: 0.65,
            duration: 700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

      spinLoop.start();
      pulseLoop.start();

      return () => {
        spinLoop.stop();
        pulseLoop.stop();
      };
    }
  }, [step, loaderFade, loaderScale, loaderSpin, loaderPulse]);

  useEffect(() => {
    if (step === 'quiz' || step === 'levelComplete') {
      contentOpacity.setValue(0);
      contentTranslateY.setValue(26);
      contentScale.setValue(0.985);

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
    }

    if (step === 'levelComplete') {
      resultBadgeScale.setValue(0.86);
      Animated.spring(resultBadgeScale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }).start();
    }
  }, [
    step,
    levelIndex,
    questionIndex,
    contentOpacity,
    contentTranslateY,
    contentScale,
    resultBadgeScale,
  ]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_LEVEL_QUIZ_PROGRESS);

        if (!raw) {
          setStep('quiz');
          return;
        }

        const saved: SavedQuizProgress = JSON.parse(raw);

        const validLevel =
          typeof saved.levelIndex === 'number' &&
          saved.levelIndex >= 0 &&
          saved.levelIndex < STORY_QUIZ_LEVELS.length;

        const validQuestion =
          validLevel &&
          typeof saved.questionIndex === 'number' &&
          saved.questionIndex >= 0 &&
          saved.questionIndex < STORY_QUIZ_LEVELS[saved.levelIndex].questions.length;

        const validCorrect = typeof saved.totalCorrectAnswers === 'number';
        const validWorms = typeof saved.totalWormsEarned === 'number';
        const validCompleted = Array.isArray(saved.completedLevels);

        if (validLevel && validQuestion && validCorrect && validWorms && validCompleted) {
          setLevelIndex(saved.levelIndex);
          setQuestionIndex(saved.questionIndex);
          setTotalCorrectAnswers(saved.totalCorrectAnswers);
          setTotalWormsEarned(saved.totalWormsEarned);
          setCompletedLevels(saved.completedLevels);
        }

        setStep('quiz');
      } catch {
        setStep('quiz');
      }
    };

    loadProgress();

    return () => {
      if (answerDelayRef.current) {
        clearTimeout(answerDelayRef.current);
      }
    };
  }, []);

  const persistProgress = async (
    nextLevelIndex: number,
    nextQuestionIndex: number,
    nextTotalCorrectAnswers: number,
    nextTotalWormsEarned: number,
    nextCompletedLevels: number[],
  ) => {
    const payload: SavedQuizProgress = {
      levelIndex: nextLevelIndex,
      questionIndex: nextQuestionIndex,
      totalCorrectAnswers: nextTotalCorrectAnswers,
      totalWormsEarned: nextTotalWormsEarned,
      completedLevels: nextCompletedLevels,
    };

    await AsyncStorage.setItem(STORAGE_LEVEL_QUIZ_PROGRESS, JSON.stringify(payload));
  };

  const removeProgress = async () => {
    await AsyncStorage.removeItem(STORAGE_LEVEL_QUIZ_PROGRESS);
  };

  const addWormsToStorage = async (amount: number) => {
    const raw = await AsyncStorage.getItem(STORAGE_TOTAL_WORMS);
    const current = raw ? Number(raw) || 0 : 0;
    const next = current + amount;
    await AsyncStorage.setItem(STORAGE_TOTAL_WORMS, String(next));
  };

  const handleBack = () => {
    if (saving || step === 'loading') return;
    navigation.replace('Menu');
  };

  const handleAnswer = (optionId: OptionId) => {
    if (saving || selectedOption || step !== 'quiz') return;

    setSelectedOption(optionId);

    const isCorrect = optionId === currentQuestion.correct;
    const nextTotalCorrectAnswers = isCorrect ? totalCorrectAnswers + 1 : totalCorrectAnswers;
    const isLastQuestionInLevel = questionIndex === currentLevel.questions.length - 1;

    setSaving(true);

    answerDelayRef.current = setTimeout(async () => {
      try {
        if (!isLastQuestionInLevel) {
          const nextQuestionIndex = questionIndex + 1;

          await persistProgress(
            levelIndex,
            nextQuestionIndex,
            nextTotalCorrectAnswers,
            totalWormsEarned,
            completedLevels,
          );

          setTotalCorrectAnswers(nextTotalCorrectAnswers);
          setQuestionIndex(nextQuestionIndex);
          setSelectedOption(null);
          setSaving(false);
          return;
        }

        const rewardForLevel = currentLevel.reward;
        const nextTotalWormsEarned = totalWormsEarned + rewardForLevel;
        const nextCompletedLevels = completedLevels.includes(currentLevel.id)
          ? completedLevels
          : [...completedLevels, currentLevel.id];

        await addWormsToStorage(rewardForLevel);

        if (hasNextLevel) {
          await persistProgress(
            levelIndex + 1,
            0,
            nextTotalCorrectAnswers,
            nextTotalWormsEarned,
            nextCompletedLevels,
          );
        } else {
          await removeProgress();
        }

        setTotalCorrectAnswers(nextTotalCorrectAnswers);
        setTotalWormsEarned(nextTotalWormsEarned);
        setCompletedLevels(nextCompletedLevels);
        setLastLevelReward(rewardForLevel);
        setSelectedOption(null);
        setSaving(false);
        setStep('levelComplete');
      } catch {
        setSaving(false);
        setSelectedOption(null);
        Alert.alert('Save error', 'Quiz progress could not be updated.');
      }
    }, 340);
  };

  const handleNextLevel = () => {
    if (!hasNextLevel) {
      navigation.replace('Menu');
      return;
    }

    setLevelIndex(prev => prev + 1);
    setQuestionIndex(0);
    setStep('quiz');
  };

  const handleExit = () => {
    navigation.replace('Menu');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Story Quiz\nLevels completed: ${completedLevels.length}/${STORY_QUIZ_LEVELS.length}\nCorrect answers: ${totalCorrectAnswers}\nWorms collected: ${totalWormsEarned}`,
      });
    } catch {}
  };

  const getOptionStyle = (optionId: OptionId) => {
    if (!selectedOption) return styles.optionButton;

    if (optionId === currentQuestion.correct) {
      return [styles.optionButton, styles.optionCorrect];
    }

    if (optionId === selectedOption && optionId !== currentQuestion.correct) {
      return [styles.optionButton, styles.optionWrong];
    }

    return [styles.optionButton, styles.optionMuted];
  };

  const loaderRotate = loaderSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (step === 'loading') {
    return (
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.root}>
            <Animated.View
              style={[
                styles.loaderWrap,
                {
                  width: panelWidth,
                  opacity: loaderFade,
                  transform: [{ scale: loaderScale }],
                },
              ]}
            >
              <View style={styles.loaderOrbArea}>
                <Animated.View
                  style={[
                    styles.loaderRingOuter,
                    {
                      opacity: loaderPulse,
                      transform: [{ scale: loaderPulse }],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.loaderRingInner,
                    {
                      transform: [{ rotate: loaderRotate }],
                    },
                  ]}
                />
                <View style={styles.loaderCenterDot} />
              </View>

              <Text style={[styles.loaderTitle, isVerySmall && styles.loaderTitleSmall]}>
                Preparing your quiz...
              </Text>
              <Text style={[styles.loaderText, isVerySmall && styles.loaderTextSmall]}>
                Restoring your progress and story path.
              </Text>
            </Animated.View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      {step === 'levelComplete' && <View style={styles.overlay} />}

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.root}>
          <Animated.View
            style={[
              styles.header,
              {
                width: panelWidth,
                marginTop: insets.top + 4,
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
                STORY QUIZ
              </Text>
            </View>
          </Animated.View>

          {step === 'quiz' && (
            <ScrollView
              style={styles.full}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: Math.max(insets.bottom, 16) + 12 },
              ]}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Animated.View
                style={[
                  styles.card,
                  {
                    width: panelWidth,
                    marginTop: isTiny ? 14 : isVerySmall ? 18 : 24,
                    opacity: contentOpacity,
                    transform: [{ translateY: contentTranslateY }, { scale: contentScale }],
                    paddingHorizontal: isTiny ? 12 : 14,
                    paddingTop: isTiny ? 14 : 16,
                    paddingBottom: isTiny ? 14 : 18,
                  },
                ]}
              >
                <View style={styles.topBar} />

                <Text style={[styles.eyebrow, isTiny && styles.eyebrowTiny]}>
                  DAILY STORY ROUTE
                </Text>

                <Text style={[styles.mainTitle, isTiny && styles.mainTitleTiny]}>Keep going through the chapters</Text>

                <View style={styles.statusGrid}>
                  <View style={styles.statusCell}>
                    <Text style={styles.statusLabel}>LEVEL</Text>
                    <Text style={[styles.statusValue, isTiny && styles.statusValueTiny]}>
                      {levelProgress}
                    </Text>
                  </View>

                  <View style={styles.statusCell}>
                    <Text style={styles.statusLabel}>QUESTION</Text>
                    <Text style={[styles.statusValue, isTiny && styles.statusValueTiny]}>
                      {questionProgress}
                    </Text>
                  </View>

                  <View style={styles.statusCell}>
                    <Text style={styles.statusLabel}>DONE</Text>
                    <Text style={[styles.statusValue, isTiny && styles.statusValueTiny]}>
                      {answeredCount}/{STORY_QUIZ_LEVELS.length}
                    </Text>
                  </View>
                </View>

                <View style={styles.chapterBox}>
                  <Text style={styles.chapterLabel}>CURRENT STORY SET</Text>
                  <Text style={[styles.chapterTitle, isTiny && styles.chapterTitleTiny]}>
                    {currentLevel.title}
                  </Text>
                </View>

                <View style={styles.questionPanel}>
                  <Text style={styles.questionLabel}>QUESTION</Text>
                  <Text
                    style={[
                      styles.questionText,
                      isTiny && styles.questionTextTiny,
                      isVerySmall && !isTiny && styles.questionTextSmall,
                    ]}
                  >
                    {currentQuestion.question}
                  </Text>

                  <View style={styles.infoBand}>
                    <View style={styles.infoBandTextWrap}>
                      <Text style={[styles.infoBandText, isTiny && styles.infoBandTextTiny]}>
                        Finish this level to receive +{currentLevel.reward} worms.
                      </Text>
                      <Text style={[styles.infoBandSubText, isTiny && styles.infoBandSubTextTiny]}>
                        Progress in current level: {completionPercent}%
                      </Text>
                    </View>

                    <Image
                      source={WORM_ICON}
                      style={[styles.infoBandIcon, isTiny && styles.infoBandIconTiny]}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                <View style={[styles.optionsWrap, { marginTop: isTiny ? 12 : 16 }]}>
                  {currentQuestion.options.map(option => (
                    <Pressable
                      key={option.id}
                      style={[
                        getOptionStyle(option.id),
                        {
                          minHeight: isTiny ? 52 : isVerySmall ? 58 : 64,
                          marginBottom: isTiny ? 8 : 10,
                          paddingHorizontal: isTiny ? 10 : 12,
                          paddingVertical: isTiny ? 9 : 10,
                        },
                      ]}
                      onPress={() => handleAnswer(option.id)}
                    >
                      <Text style={[styles.optionPrefix, isTiny && styles.optionPrefixTiny]}>
                        {option.id}
                      </Text>
                      <Text style={[styles.optionText, isTiny && styles.optionTextTiny]}>
                        {option.text}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>
            </ScrollView>
          )}

          {step === 'levelComplete' && (
            <ScrollView
              style={styles.full}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: Math.max(insets.bottom, 16) + 12 },
              ]}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Animated.View
                style={[
                  styles.completeCard,
                  {
                    width: panelWidth,
                    marginTop: isTiny ? 14 : isVerySmall ? 18 : 24,
                    opacity: contentOpacity,
                    transform: [{ translateY: contentTranslateY }, { scale: contentScale }],
                  },
                ]}
              >
                <View style={styles.completeTopBar} />

                <Text style={[styles.completeEyebrow, isTiny && styles.completeEyebrowTiny]}>
                  STORY MILESTONE
                </Text>

                <Text style={[styles.completeTitle, isTiny && styles.completeTitleTiny]}>
                  Level Complete
                </Text>

                <Text style={[styles.completeSubtitle, isTiny && styles.completeSubtitleTiny]}>
                  {currentLevel.title}
                </Text>

                <Animated.View
                  style={[
                    styles.rewardBadge,
                    {
                      transform: [{ scale: resultBadgeScale }],
                    },
                  ]}
                >
                  <Image
                    source={WORM_ICON}
                    style={[styles.rewardIconBig, isTiny && styles.rewardIconBigTiny]}
                    resizeMode="contain"
                  />
                  <View style={styles.rewardTextWrap}>
                    <Text style={[styles.rewardValue, isTiny && styles.rewardValueTiny]}>
                      +{lastLevelReward}
                    </Text>
                    <Text style={[styles.rewardLabel, isTiny && styles.rewardLabelTiny]}>
                      WORMS ADDED
                    </Text>
                  </View>
                </Animated.View>

                <View style={styles.summaryBox}>
                  <Text style={styles.summaryLabel}>RESULT SUMMARY</Text>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryKey}>Correct answers</Text>
                    <Text style={styles.summaryVal}>{totalCorrectAnswers}</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryKey}>Collected worms</Text>
                    <Text style={styles.summaryVal}>{totalWormsEarned}</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryKey}>Completed levels</Text>
                    <Text style={styles.summaryVal}>
                      {completedLevels.length}/{STORY_QUIZ_LEVELS.length}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.completeNote, isTiny && styles.completeNoteTiny]}>
                  Your progress has been updated and the next chapter is ready.
                </Text>

                <Pressable
                  style={[
                    styles.primaryAction,
                    {
                      width: '100%',
                      height: isTiny ? 52 : isVerySmall ? 56 : 60,
                      marginTop: isTiny ? 12 : 16,
                    },
                  ]}
                  onPress={hasNextLevel ? handleNextLevel : handleExit}
                >
                  <Text style={[styles.actionLabel, isTiny && styles.actionLabelTiny]}>
                    {hasNextLevel ? 'OPEN NEXT LEVEL' : 'FINISH QUIZ'}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.secondaryAction,
                    {
                      width: '100%',
                      height: isTiny ? 52 : isVerySmall ? 56 : 60,
                      marginTop: 10,
                    },
                  ]}
                  onPress={handleExit}
                >
                  <Text style={[styles.actionLabel, isTiny && styles.actionLabelTiny]}>
                    EXIT TO MENU
                  </Text>
                </Pressable>

                <Pressable style={styles.shareLink} onPress={handleShare}>
                  <Text style={[styles.shareLinkText, isTiny && styles.shareLinkTextTiny]}>
                    Share progress
                  </Text>
                </Pressable>
              </Animated.View>
            </ScrollView>
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

  full: {
    width: '100%',
  },

  scrollContent: {
    width: '100%',
    alignItems: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#26E41D',
    borderWidth: 2,
    borderColor: '#11660D',
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
    backgroundColor: '#F1D38A',
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

  loaderWrap: {
    marginTop: 120,
    alignItems: 'center',
  },

  loaderOrbArea: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  loaderRingOuter: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
  },

  loaderRingInner: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#E9C166',
  },

  loaderCenterDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#23E51B',
    borderWidth: 2,
    borderColor: '#11680D',
  },

  loaderTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },

  loaderTitleSmall: {
    fontSize: 19,
  },

  loaderText: {
    marginTop: 10,
    color: '#F5E4B0',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  loaderTextSmall: {
    fontSize: 13,
    lineHeight: 18,
  },

  card: {
    backgroundColor: '#E9C166',
    borderWidth: 2,
    borderColor: '#8C4B00',
    alignItems: 'center',
    overflow: 'hidden',
  },

  topBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#92540A',
    marginBottom: 12,
  },

  eyebrow: {
    color: '#6D4300',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  eyebrowTiny: {
    fontSize: 10,
  },

  mainTitle: {
    color: '#111111',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },

  mainTitleTiny: {
    fontSize: 17,
  },

  statusGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  statusCell: {
    flex: 1,
    backgroundColor: '#DDB75A',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginHorizontal: 3,
  },

  statusLabel: {
    color: '#6B4100',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },

  statusValue: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },

  statusValueTiny: {
    fontSize: 11,
  },

  chapterBox: {
    width: '100%',
    backgroundColor: '#F2CF7A',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 12,
  },

  chapterLabel: {
    color: '#6B4100',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.8,
  },

  chapterTitle: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 20,
  },

  chapterTitleTiny: {
    fontSize: 13,
    lineHeight: 18,
  },

  questionPanel: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#8C4B00',
    backgroundColor: '#F5D98E',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  questionLabel: {
    color: '#6B4100',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: 0.8,
  },

  questionText: {
    color: '#111111',
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '900',
  },

  questionTextSmall: {
    fontSize: 15,
    lineHeight: 21,
  },

  questionTextTiny: {
    fontSize: 14,
    lineHeight: 19,
  },

  infoBand: {
    marginTop: 12,
    backgroundColor: '#E2BE65',
    borderWidth: 2,
    borderColor: '#111111',
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoBandTextWrap: {
    flex: 1,
    paddingRight: 8,
  },

  infoBandText: {
    color: '#111111',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
  },

  infoBandTextTiny: {
    fontSize: 11,
    lineHeight: 15,
  },

  infoBandSubText: {
    color: '#6B4100',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
    marginTop: 4,
  },

  infoBandSubTextTiny: {
    fontSize: 10,
    lineHeight: 13,
  },

  infoBandIcon: {
    width: 36,
    height: 36,
  },

  infoBandIconTiny: {
    width: 28,
    height: 28,
  },

  optionsWrap: {
    width: '100%',
  },

  optionButton: {
    width: '100%',
    backgroundColor: '#18E11A',
    borderWidth: 2,
    borderColor: '#0D680D',
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionCorrect: {
    backgroundColor: '#18E11A',
    borderColor: '#0D680D',
  },

  optionWrong: {
    backgroundColor: '#E22626',
    borderColor: '#7C0A0A',
  },

  optionMuted: {
    opacity: 0.52,
  },

  optionPrefix: {
    width: 34,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },

  optionPrefixTiny: {
    width: 28,
    fontSize: 13,
  },

  optionText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
    textAlign: 'left',
  },

  optionTextTiny: {
    fontSize: 12,
    lineHeight: 16,
  },

  completeCard: {
    backgroundColor: '#E9C166',
    borderWidth: 2,
    borderColor: '#8C4B00',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 18,
    overflow: 'hidden',
  },

  completeTopBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#92540A',
    marginBottom: 12,
  },

  completeEyebrow: {
    color: '#6D4300',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  completeEyebrowTiny: {
    fontSize: 10,
  },

  completeTitle: {
    color: '#111111',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },

  completeTitleTiny: {
    fontSize: 20,
  },

  completeSubtitle: {
    marginTop: 10,
    color: '#5A3500',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  completeSubtitleTiny: {
    fontSize: 13,
    lineHeight: 18,
  },

  rewardBadge: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#F4D88B',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rewardIconBig: {
    width: 76,
    height: 96,
    marginRight: 8,
  },

  rewardIconBigTiny: {
    width: 62,
    height: 82,
    marginRight: 6,
  },

  rewardTextWrap: {
    alignItems: 'flex-start',
  },

  rewardValue: {
    color: '#111111',
    fontSize: 34,
    fontWeight: '900',
  },

  rewardValueTiny: {
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

  summaryBox: {
    width: '100%',
    marginTop: 14,
    backgroundColor: '#F7E2A9',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  summaryLabel: {
    color: '#6B4100',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.8,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },

  summaryKey: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '800',
  },

  summaryVal: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '900',
  },

  completeNote: {
    marginTop: 12,
    color: '#4A2D00',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  completeNoteTiny: {
    fontSize: 12,
    lineHeight: 16,
  },

  primaryAction: {
    backgroundColor: '#D78917',
    borderWidth: 2,
    borderColor: '#7A4300',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryAction: {
    backgroundColor: '#18E11A',
    borderWidth: 2,
    borderColor: '#0D680D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  actionLabelTiny: {
    fontSize: 12,
  },

  shareLink: {
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  shareLinkText: {
    color: '#4B2E00',
    fontSize: 14,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  shareLinkTextTiny: {
    fontSize: 12,
  },
});