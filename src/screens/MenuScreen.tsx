import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

const BG = require('../assets/loabg.png');
const TOP_ICON = require('../assets/menu_top_icon.png');
const WORM_ICON = require('../assets/worm_icon.png');
const TOOLBOX_ICON = require('../assets/toolbox_icon.png');

const STORAGE_TOTAL_WORMS = 'river_total_worms';
const STORAGE_SELECTED_MOOD = 'river_selected_mood';

export default function MenuScreen({ navigation }: Props) {
  const [worms, setWorms] = useState(0);
  const [mood, setMood] = useState('Funny');

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(18)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(24)).current;
  const cardsOpacity = useRef(new Animated.Value(0)).current;
  const cardsTranslateY = useRef(new Animated.Value(32)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(38)).current;
  const heroScale = useRef(new Animated.Value(0.97)).current;
  const iconFloat = useRef(new Animated.Value(0)).current;

  const isSmall = height < 780;
  const isVerySmall = height < 700;
  const isTiny = height < 640;

  const contentWidth = useMemo(() => {
    if (isTiny) return Math.min(width - 24, 312);
    if (isVerySmall) return Math.min(width - 30, 328);
    return Math.min(width - 38, 348);
  }, [width, isTiny, isVerySmall]);

  const heroSize = isTiny ? 108 : isVerySmall ? 116 : isSmall ? 122 : 128;
  const statHeight = isTiny ? 52 : isVerySmall ? 54 : 58;
  const menuHeight = isTiny ? 56 : isVerySmall ? 60 : 64;
  const doubleHeight = isTiny ? 58 : isVerySmall ? 60 : 64;
  const sectionGap = isTiny ? 10 : 14;
  const toolboxSize = isTiny ? 24 : isVerySmall ? 27 : 30;

  const loadData = useCallback(async () => {
    try {
      const values = await AsyncStorage.multiGet([
        STORAGE_TOTAL_WORMS,
        STORAGE_SELECTED_MOOD,
      ]);

      const wormsRaw = values[0][1];
      const moodRaw = values[1][1];

      const wormsValue = wormsRaw ? Number(wormsRaw) : 0;

      setWorms(Number.isFinite(wormsValue) ? wormsValue : 0);
      setMood(moodRaw || 'Funny');
    } catch {
      setWorms(0);
      setMood('Funny');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    headerOpacity.setValue(0);
    headerTranslateY.setValue(18);
    heroOpacity.setValue(0);
    heroTranslateY.setValue(24);
    cardsOpacity.setValue(0);
    cardsTranslateY.setValue(32);
    footerOpacity.setValue(0);
    footerTranslateY.setValue(38);
    heroScale.setValue(0.97);
    iconFloat.setValue(0);

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
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 420,
        delay: 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration: 520,
        delay: 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heroScale, {
        toValue: 1,
        duration: 560,
        delay: 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardsOpacity, {
        toValue: 1,
        duration: 460,
        delay: 130,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardsTranslateY, {
        toValue: 0,
        duration: 620,
        delay: 130,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 500,
        delay: 210,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(footerTranslateY, {
        toValue: 0,
        duration: 680,
        delay: 210,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(iconFloat, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(iconFloat, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    floatLoop.start();

    return () => {
      floatLoop.stop();
    };
  }, [
    headerOpacity,
    headerTranslateY,
    heroOpacity,
    heroTranslateY,
    cardsOpacity,
    cardsTranslateY,
    footerOpacity,
    footerTranslateY,
    heroScale,
    iconFloat,
  ]);

  const iconFloatY = iconFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.root}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: insets.top + (isTiny ? 6 : 10),
                paddingBottom: Math.max(insets.bottom, 14) + (isTiny ? 8 : 16),
              },
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Animated.View
              style={[
                styles.headerWrap,
                {
                  width: contentWidth,
                  opacity: headerOpacity,
                  transform: [{ translateY: headerTranslateY }],
                },
              ]}
            >
              <View style={styles.headerBadge}>
                <Text style={[styles.headerTitle, isTiny && styles.headerTitleTiny]}>
                  RIVER MENU
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.heroCard,
                {
                  width: contentWidth,
                  marginTop: sectionGap,
                  opacity: heroOpacity,
                  transform: [{ translateY: heroTranslateY }, { scale: heroScale }],
                },
              ]}
            >
              <View style={styles.heroTopBar} />

              <View style={styles.heroRow}>
                <Animated.View
                  style={[
                    styles.heroIconWrap,
                    {
                      width: heroSize + 10,
                      height: heroSize + 10,
                      transform: [{ translateY: iconFloatY }],
                    },
                  ]}
                >
                  <Image
                    source={TOP_ICON}
                    style={{ width: heroSize, height: heroSize }}
                    resizeMode="cover"
                  />
                </Animated.View>

                <View style={styles.heroTextBlock}>
                  <Text style={[styles.heroEyebrow, isTiny && styles.heroEyebrowTiny]}>
                    TODAY IN THE RIVER
                  </Text>
                  <Text style={[styles.heroTitle, isTiny && styles.heroTitleTiny]}>
                    Choose a path and continue your story journey
                  </Text>
                </View>
              </View>

              <View style={[styles.statsRow, { marginTop: sectionGap }]}>
                <View style={[styles.statCard, { minHeight: statHeight }]}>
                  <Text style={styles.statLabel}>WORMS</Text>
                  <View style={styles.statValueRow}>
                    <Image
                      source={WORM_ICON}
                      style={[styles.wormIcon, isTiny && styles.wormIconTiny]}
                      resizeMode="contain"
                    />
                    <Text style={[styles.statValue, isTiny && styles.statValueTiny]}>
                      {worms}
                    </Text>
                  </View>
                </View>

                <View style={[styles.statCard, { minHeight: statHeight }]}>
                  <Text style={styles.statLabel}>MOOD</Text>
                  <Text
                    style={[styles.moodValue, isTiny && styles.moodValueTiny]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {mood}
                  </Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.menuWrap,
                {
                  width: contentWidth,
                  marginTop: sectionGap,
                  opacity: cardsOpacity,
                  transform: [{ translateY: cardsTranslateY }],
                },
              ]}
            >
              <Pressable
                style={[styles.primaryCard, { minHeight: menuHeight }]}
                onPress={() => navigation.navigate('AskRiver')}
              >
                <View style={styles.cardAccent} />
                <View style={styles.cardTextWrap}>
                  <Text style={[styles.primaryCardTitle, isTiny && styles.primaryCardTitleTiny]}>
                    Ask River
                  </Text>
                  <Text style={[styles.cardSubtitle, isTiny && styles.cardSubtitleTiny]}>
                    Receive a simple river answer
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={[styles.primaryCard, { minHeight: menuHeight, marginTop: sectionGap }]}
                onPress={() => navigation.navigate('Nickname')}
              >
                <View style={styles.cardAccent} />
                <View style={styles.cardTextWrap}>
                  <Text style={[styles.primaryCardTitle, isTiny && styles.primaryCardTitleTiny]}>
                    Nickname
                  </Text>
                  <Text style={[styles.cardSubtitle, isTiny && styles.cardSubtitleTiny]}>
                    Update your current name style
                  </Text>
                </View>
              </Pressable>

              <View style={[styles.doubleRow, { marginTop: sectionGap }]}>
                <Pressable
                  style={[styles.halfCard, { minHeight: doubleHeight }]}
                  onPress={() => navigation.navigate('Stories')}
                >
                  <Text style={[styles.halfTitle, isTiny && styles.halfTitleTiny]}>Stories</Text>
                  <Text style={[styles.halfSubtitle, isTiny && styles.halfSubtitleTiny]}>
                    Open story pages
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.halfCard, { minHeight: doubleHeight }]}
                  onPress={() => navigation.navigate('DailyQuiz')}
                >
                  <Text style={[styles.halfTitle, isTiny && styles.halfTitleTiny]}>Daily Quiz</Text>
                  <Text style={[styles.halfSubtitle, isTiny && styles.halfSubtitleTiny]}>
                    Continue level progress
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={[styles.primaryCard, { minHeight: menuHeight, marginTop: sectionGap }]}
                onPress={() => navigation.navigate('WormJar')}
              >
                <View style={styles.cardAccent} />
                <View style={styles.cardTextWrap}>
                  <Text style={[styles.primaryCardTitle, isTiny && styles.primaryCardTitleTiny]}>
                    Worm Jar
                  </Text>
                  <Text style={[styles.cardSubtitle, isTiny && styles.cardSubtitleTiny]}>
                    View your collected rewards
                  </Text>
                </View>
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                styles.footerWrap,
                {
                  width: contentWidth,
                  marginTop: sectionGap,
                  opacity: footerOpacity,
                  transform: [{ translateY: footerTranslateY }],
                },
              ]}
            >
              <Pressable
                style={[styles.settingsCard, { minHeight: menuHeight }]}
                onPress={() => navigation.navigate('Settings')}
              >
                <Image
                  source={TOOLBOX_ICON}
                  style={{ width: toolboxSize, height: toolboxSize }}
                  resizeMode="contain"
                />
                <View style={styles.settingsTextWrap}>
                  <Text style={[styles.settingsTitle, isTiny && styles.settingsTitleTiny]}>
                    Settings
                  </Text>
                  <Text style={[styles.settingsSubtitle, isTiny && styles.settingsSubtitleTiny]}>
                    Sound, vibration and app options
                  </Text>
                </View>
              </Pressable>
            </Animated.View>
          </ScrollView>
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
    width: '100%',
    alignItems: 'center',
  },

  headerWrap: {
    alignItems: 'center',
  },

  headerBadge: {
    width: '100%',
    minHeight: 42,
    backgroundColor: '#F5D68A',
    borderWidth: 2,
    borderColor: '#915109',
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

  heroCard: {
    backgroundColor: '#E9C166',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingBottom: 14,
    overflow: 'hidden',
  },

  heroTopBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#915109',
    marginBottom: 12,
  },

  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  heroIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  heroTextBlock: {
    flex: 1,
  },

  heroEyebrow: {
    color: '#6C4100',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 5,
  },

  heroEyebrowTiny: {
    fontSize: 9,
  },

  heroTitle: {
    color: '#111111',
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
  },

  heroTitleTiny: {
    fontSize: 15,
    lineHeight: 20,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  statCard: {
    width: '48.5%',
    backgroundColor: '#F4D585',
    borderWidth: 2,
    borderColor: '#915109',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  statLabel: {
    color: '#6C4100',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 5,
  },

  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  wormIcon: {
    width: 26,
    height: 26,
    marginRight: 6,
  },

  wormIconTiny: {
    width: 22,
    height: 22,
    marginRight: 5,
  },

  statValue: {
    color: '#111111',
    fontSize: 20,
    fontWeight: '900',
  },

  statValueTiny: {
    fontSize: 17,
  },

  moodValue: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },

  moodValueTiny: {
    fontSize: 14,
  },

  menuWrap: {
    alignItems: 'center',
  },

  primaryCard: {
    width: '100%',
    backgroundColor: '#1FE41B',
    borderWidth: 2,
    borderColor: '#0E610D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  cardAccent: {
    width: 10,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 10,
  },

  cardTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },

  primaryCardTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  primaryCardTitleTiny: {
    fontSize: 14,
  },

  cardSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },

  cardSubtitleTiny: {
    fontSize: 10,
  },

  doubleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfCard: {
    width: '48.5%',
    backgroundColor: '#1FE41B',
    borderWidth: 2,
    borderColor: '#0E610D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  halfTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },

  halfTitleTiny: {
    fontSize: 13,
  },

  halfSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 13,
  },

  halfSubtitleTiny: {
    fontSize: 9,
    lineHeight: 12,
  },

  footerWrap: {
    alignItems: 'center',
  },

  settingsCard: {
    width: '100%',
    backgroundColor: '#D78917',
    borderWidth: 2,
    borderColor: '#7A4300',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  settingsTextWrap: {
    flex: 1,
    marginLeft: 10,
  },

  settingsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  settingsTitleTiny: {
    fontSize: 14,
  },

  settingsSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },

  settingsSubtitleTiny: {
    fontSize: 10,
  },
});