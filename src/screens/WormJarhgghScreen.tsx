import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'WormJar'>;
type ScreenStep = 'menu' | 'detail';
type UnlockType = 'fact' | 'tip';

type UnlockItem = {
  id: number;
  title: string;
  text: string;
  type: UnlockType;
};

const BG = require('../assets/loabg.png');
const BACK_ICON = require('../assets/back_arrow.png');
const WORM_ICON = require('../assets/worm_icon.png');

const STORAGE_TOTAL_WORMS = 'river_total_worms';

const FACT_COST = 20;
const TIP_COST = 40;

const FISHING_FACTS: string[] = [
  'Fish can remember safe feeding places for long periods.',
  'Many fish become more active near sunrise and sunset.',
  'Fish react to vibrations in water even when visibility is low.',
  'Water temperature often changes fish activity.',
  'Fish frequently return to familiar hiding places.',
  'Larger fish usually remain deeper than smaller ones.',
  'Sudden shadows over the water can scare fish away.',
  'Pressure changes may influence fish behavior.',
  'Calm water can make fish more careful.',
  'Murky water makes vibration more important than sight.',
  'Some fish feed more actively before rain.',
  'Disturbance on the bank can affect fish movement.',
  'Certain species become more active later in the day.',
  'Fish often stay close to underwater cover.',
  'Oxygen levels in water affect movement and feeding.',
  'Fish can learn to avoid repeated danger.',
  'Many fish move along familiar routes.',
  'Bright sun can push fish toward deeper or shaded areas.',
  'Weather stability often improves feeding activity.',
  'Edges between shade and light can attract fish.',
];

const FISHING_TIPS: string[] = [
  'Move calmly near the bank to avoid disturbing the water.',
  'Early morning is often a productive time to fish.',
  'Try casting near rocks, plants, or fallen branches.',
  'Keep your shadow away from the surface when possible.',
  'Make bait movement look natural and unhurried.',
  'Stay patient and avoid constant unnecessary casting.',
  'Test different depths if the bite is weak.',
  'Observe surface ripples for signs of activity.',
  'Use smooth and controlled movements.',
  'Change bait or position if nothing happens for a while.',
  'Look for cooler or shaded areas during warm hours.',
  'Cast along the shoreline as well as toward deeper spots.',
  'Fish often face into the current in moving water.',
  'Let the area settle if you made too much noise.',
  'Watch the environment before changing tactics too quickly.',
  'Simple adjustments often work better than constant changes.',
  'Quiet observation can improve results.',
  'Stable weather may help fish feed more consistently.',
  'Natural presentation matters as much as bait choice.',
  'Confidence and patience usually improve the overall experience.',
];

function buildItems(): UnlockItem[] {
  const facts = FISHING_FACTS.map((text, index) => ({
    id: index + 1,
    title: `RIVER FACT #${index + 1}`,
    text,
    type: 'fact' as const,
  }));

  const tips = FISHING_TIPS.map((text, index) => ({
    id: index + 1,
    title: `RIVER TIP #${index + 1}`,
    text,
    type: 'tip' as const,
  }));

  return [...facts, ...tips];
}

const ALL_ITEMS = buildItems();

export default function WormJarScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [worms, setWorms] = useState(0);
  const [step, setStep] = useState<ScreenStep>('menu');
  const [selectedItem, setSelectedItem] = useState<UnlockItem | null>(null);
  const [selectedType, setSelectedType] = useState<UnlockType>('fact');
  const [saving, setSaving] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(18)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(26)).current;
  const contentScale = useRef(new Animated.Value(0.985)).current;
  const badgeScale = useRef(new Animated.Value(0.9)).current;
  const wormFloat = useRef(new Animated.Value(0)).current;

  const isSmall = height < 760;
  const isVerySmall = height < 680;
  const isTiny = height < 630;

  const panelWidth = useMemo(() => {
    if (isTiny) return Math.min(width - 24, 310);
    if (isVerySmall) return Math.min(width - 28, 326);
    if (isSmall) return Math.min(width - 32, 338);
    return Math.min(width - 36, 350);
  }, [width, isTiny, isVerySmall, isSmall]);

  const topBadgeWidth = isTiny ? 146 : isVerySmall ? 156 : 168;
  const topBadgeHeight = isTiny ? 52 : isVerySmall ? 56 : 60;
  const topWormIconSize = isTiny ? 28 : isVerySmall ? 30 : 34;

  const cardGap = isTiny ? 10 : isVerySmall ? 12 : 14;
  const menuCardHeight = isTiny ? 158 : isVerySmall ? 168 : 180;
  const menuActionWidth = isTiny ? 132 : isVerySmall ? 140 : 154;
  const menuActionHeight = isTiny ? 48 : isVerySmall ? 54 : 60;

  const detailButtonWidth = isTiny ? 170 : isVerySmall ? 184 : 198;
  const detailButtonHeight = isTiny ? 50 : isVerySmall ? 56 : 62;

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadWorms = async () => {
        try {
          const wormsRaw = await AsyncStorage.getItem(STORAGE_TOTAL_WORMS);
          const totalWorms = wormsRaw ? Number(wormsRaw) : 0;

          if (!active) return;

          setWorms(Number.isFinite(totalWorms) ? totalWorms : 0);
        } catch {
          if (!active) return;
          setWorms(0);
        }
      };

      loadWorms();

      return () => {
        active = false;
      };
    }, []),
  );

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

    if (step === 'detail') {
      badgeScale.setValue(0.9);
      wormFloat.setValue(0);

      Animated.spring(badgeScale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }).start();

      const floatLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(wormFloat, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(wormFloat, {
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
    }
  }, [step, selectedItem, contentOpacity, contentTranslateY, contentScale, badgeScale, wormFloat]);

  const handleBack = () => {
    if (step === 'detail') {
      setStep('menu');
      return;
    }

    navigation.replace('Menu');
  };

  const getRandomItem = (type: UnlockType): UnlockItem => {
    const filtered = ALL_ITEMS.filter(item => item.type === type);
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  };

  const unlockItem = async (type: UnlockType) => {
    if (saving) return;

    const cost = type === 'fact' ? FACT_COST : TIP_COST;

    if (worms < cost) {
      Alert.alert('Not enough worms', `You need ${cost} worms to open this item.`);
      return;
    }

    try {
      setSaving(true);

      const updatedWorms = worms - cost;
      const randomItem = getRandomItem(type);

      await AsyncStorage.setItem(STORAGE_TOTAL_WORMS, String(updatedWorms));

      setWorms(updatedWorms);
      setSelectedItem(randomItem);
      setSelectedType(type);
      setStep('detail');
    } catch {
      Alert.alert('Error', 'Failed to open item.');
    } finally {
      setSaving(false);
    }
  };

  const unlockNewFromSameType = async () => {
    await unlockItem(selectedType);
  };

  const handleShare = async () => {
    if (!selectedItem) return;

    try {
      await Share.share({
        message: `${selectedItem.title}\n\n${selectedItem.text}`,
      });
    } catch {}
  };

  const wormTranslateY = wormFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

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
                WORM JAR
              </Text>
            </View>
          </Animated.View>

          <ScrollView
            style={styles.flexFull}
            contentContainerStyle={{
              alignItems: 'center',
              paddingBottom: Math.max(insets.bottom, 18) + 18,
            }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Animated.View
              style={[
                step === 'menu' ? styles.menuWrap : styles.detailWrap,
                {
                  width: panelWidth,
                  marginTop: isTiny ? 14 : isVerySmall ? 18 : 22,
                  opacity: contentOpacity,
                  transform: [{ translateY: contentTranslateY }, { scale: contentScale }],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.topWormBox,
                  {
                    width: topBadgeWidth,
                    minHeight: topBadgeHeight,
                    transform: [{ scale: step === 'detail' ? badgeScale : 1 }],
                  },
                ]}
              >
                <Image
                  source={WORM_ICON}
                  style={{ width: topWormIconSize, height: topWormIconSize }}
                  resizeMode="contain"
                />
                <Text style={[styles.topWormValue, isTiny && styles.topWormValueTiny]}>
                  {worms}
                </Text>
              </Animated.View>

              {step === 'menu' && (
                <>
                  <View
                    style={[
                      styles.introCard,
                      {
                        marginTop: isTiny ? 14 : 18,
                        paddingHorizontal: isTiny ? 12 : 14,
                        paddingVertical: isTiny ? 12 : 14,
                      },
                    ]}
                  >
                    <View style={styles.cardTopBar} />
                    <Text style={[styles.introEyebrow, isTiny && styles.introEyebrowTiny]}>
                      REWARD LIBRARY
                    </Text>
                    <Text style={[styles.introTitle, isTiny && styles.introTitleTiny]}>
                      Spend worms to unlock a random entry
                    </Text>
                    <Text style={[styles.introText, isTiny && styles.introTextTiny]}>
                      Open one short fact or one practical tip using the worms you collected.
                    </Text>
                  </View>

                  <Pressable
                    style={[
                      styles.menuItem,
                      {
                        minHeight: menuCardHeight,
                        marginTop: cardGap,
                        paddingHorizontal: isTiny ? 12 : 14,
                        paddingVertical: isTiny ? 12 : 14,
                      },
                    ]}
                    onPress={() => unlockItem('fact')}
                  >
                    <View style={styles.cardTopBar} />
                    <Text style={[styles.menuType, isTiny && styles.menuTypeTiny]}>
                      RANDOM ENTRY
                    </Text>

                    <Text style={[styles.menuItemTitle, isTiny && styles.menuItemTitleTiny]}>
                      River Fact
                    </Text>

                    <Text style={[styles.menuItemText, isTiny && styles.menuItemTextTiny]}>
                      Open one short fact related to fishing behavior, water conditions and timing.
                    </Text>

                    <View
                      style={[
                        styles.priceButton,
                        {
                          width: menuActionWidth,
                          height: menuActionHeight,
                          marginTop: isTiny ? 12 : 14,
                        },
                      ]}
                    >
                      <Image
                        source={WORM_ICON}
                        style={[styles.priceWormIcon, isTiny && styles.priceWormIconTiny]}
                        resizeMode="contain"
                      />
                      <Text style={[styles.priceValue, isTiny && styles.priceValueTiny]}>
                        {FACT_COST}
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.menuItem,
                      {
                        minHeight: menuCardHeight,
                        marginTop: cardGap,
                        paddingHorizontal: isTiny ? 12 : 14,
                        paddingVertical: isTiny ? 12 : 14,
                      },
                    ]}
                    onPress={() => unlockItem('tip')}
                  >
                    <View style={styles.cardTopBar} />
                    <Text style={[styles.menuType, isTiny && styles.menuTypeTiny]}>
                      RANDOM ENTRY
                    </Text>

                    <Text style={[styles.menuItemTitle, isTiny && styles.menuItemTitleTiny]}>
                      River Tip
                    </Text>

                    <Text style={[styles.menuItemText, isTiny && styles.menuItemTextTiny]}>
                      Open one practical tip focused on calm movement, observation and technique.
                    </Text>

                    <View
                      style={[
                        styles.priceButton,
                        {
                          width: menuActionWidth,
                          height: menuActionHeight,
                          marginTop: isTiny ? 12 : 14,
                        },
                      ]}
                    >
                      <Image
                        source={WORM_ICON}
                        style={[styles.priceWormIcon, isTiny && styles.priceWormIconTiny]}
                        resizeMode="contain"
                      />
                      <Text style={[styles.priceValue, isTiny && styles.priceValueTiny]}>
                        {TIP_COST}
                      </Text>
                    </View>
                  </Pressable>
                </>
              )}

              {step === 'detail' && selectedItem && (
                <View
                  style={[
                    styles.detailCard,
                    {
                      marginTop: isTiny ? 16 : 22,
                      paddingHorizontal: isTiny ? 14 : 16,
                      paddingTop: 0,
                      paddingBottom: isTiny ? 18 : 20,
                    },
                  ]}
                >
                  <View style={styles.cardTopBar} />

                  <Text style={[styles.detailEyebrow, isTiny && styles.detailEyebrowTiny]}>
                    UNLOCKED ENTRY
                  </Text>

                  <Text style={[styles.detailTitle, isTiny && styles.detailTitleTiny]}>
                    {selectedItem.title}
                  </Text>

                  <Animated.View
                    style={{
                      transform: [{ translateY: wormTranslateY }],
                      marginTop: isTiny ? 10 : 12,
                    }}
                  >
                    <Image
                      source={WORM_ICON}
                      style={[
                        styles.detailWorm,
                        isTiny && styles.detailWormTiny,
                      ]}
                      resizeMode="contain"
                    />
                  </Animated.View>

                  <View style={styles.detailTextBox}>
                    <Text style={[styles.detailText, isTiny && styles.detailTextTiny]}>
                      {selectedItem.text}
                    </Text>
                  </View>

                  <Pressable
                    style={[
                      styles.primaryButton,
                      {
                        width: detailButtonWidth,
                        height: detailButtonHeight,
                        marginTop: isTiny ? 18 : 22,
                      },
                    ]}
                    onPress={unlockNewFromSameType}
                  >
                    <Text
                      style={[
                        styles.primaryButtonText,
                        isTiny && styles.primaryButtonTextTiny,
                      ]}
                    >
                      {selectedType === 'fact' ? 'OPEN NEW FACT' : 'OPEN NEW TIP'}
                    </Text>
                  </Pressable>

                  <View style={styles.costRow}>
                    <Image
                      source={WORM_ICON}
                      style={[styles.inlineWormIcon, isTiny && styles.inlineWormIconTiny]}
                      resizeMode="contain"
                    />
                    <Text style={[styles.costText, isTiny && styles.costTextTiny]}>
                      Cost: {selectedType === 'fact' ? FACT_COST : TIP_COST}
                    </Text>
                  </View>

                  <Pressable
                    style={[
                      styles.secondaryButton,
                      {
                        width: detailButtonWidth,
                        height: isTiny ? 48 : isVerySmall ? 54 : 58,
                        marginTop: isTiny ? 10 : 12,
                      },
                    ]}
                    onPress={handleShare}
                  >
                    <Text
                      style={[
                        styles.secondaryButtonText,
                        isTiny && styles.secondaryButtonTextTiny,
                      ]}
                    >
                      SHARE
                    </Text>
                  </Pressable>
                </View>
              )}
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

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  flexFull: {
    width: '100%',
  },

  safe: {
    flex: 1,
  },

  root: {
    flex: 1,
    alignItems: 'center',
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

  menuWrap: {
    alignItems: 'center',
  },

  detailWrap: {
    alignItems: 'center',
  },

  topWormBox: {
    backgroundColor: '#F4C861',
    borderWidth: 2,
    borderColor: '#9A5B00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  topWormValue: {
    marginLeft: 10,
    color: '#000000',
    fontSize: 21,
    fontWeight: '900',
  },

  topWormValueTiny: {
    fontSize: 18,
    marginLeft: 8,
  },

  introCard: {
    width: '100%',
    backgroundColor: '#E9C166',
    borderWidth: 2,
    borderColor: '#8C4B00',
    overflow: 'hidden',
  },

  cardTopBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#92540A',
    marginBottom: 12,
  },

  introEyebrow: {
    color: '#6B4100',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textAlign: 'center',
    marginBottom: 8,
  },

  introEyebrowTiny: {
    fontSize: 9,
  },

  introTitle: {
    color: '#111111',
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 24,
  },

  introTitleTiny: {
    fontSize: 16,
    lineHeight: 20,
  },

  introText: {
    marginTop: 8,
    color: '#2A1B0E',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    textAlign: 'center',
  },

  introTextTiny: {
    fontSize: 12,
    lineHeight: 16,
  },

  menuItem: {
    width: '100%',
    backgroundColor: '#E9C166',
    borderWidth: 2,
    borderColor: '#8C4B00',
    alignItems: 'center',
    overflow: 'hidden',
  },

  menuType: {
    color: '#6B4100',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },

  menuTypeTiny: {
    fontSize: 9,
  },

  menuItemTitle: {
    color: '#111111',
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '900',
    textAlign: 'center',
  },

  menuItemTitleTiny: {
    fontSize: 17,
    lineHeight: 22,
  },

  menuItemText: {
    marginTop: 8,
    color: '#2A1B0E',
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '500',
    textAlign: 'center',
  },

  menuItemTextTiny: {
    fontSize: 12,
    lineHeight: 17,
  },

  priceButton: {
    backgroundColor: '#18E61B',
    borderWidth: 2,
    borderColor: '#11680D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  priceWormIcon: {
    width: 34,
    height: 34,
    marginRight: 10,
  },

  priceWormIconTiny: {
    width: 26,
    height: 26,
    marginRight: 6,
  },

  priceValue: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },

  priceValueTiny: {
    fontSize: 16,
  },

  detailCard: {
    width: '100%',
    backgroundColor: '#E9C166',
    borderWidth: 2,
    borderColor: '#8C4B00',
    alignItems: 'center',
    overflow: 'hidden',
  },

  detailEyebrow: {
    color: '#6B4100',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  detailEyebrowTiny: {
    fontSize: 9,
  },

  detailTitle: {
    color: '#111111',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    textAlign: 'center',
  },

  detailTitleTiny: {
    fontSize: 17,
    lineHeight: 22,
  },

  detailWorm: {
    width: 78,
    height: 78,
  },

  detailWormTiny: {
    width: 62,
    height: 62,
  },

  detailTextBox: {
    width: '100%',
    marginTop: 12,
    backgroundColor: '#F3D688',
    borderWidth: 2,
    borderColor: '#8C4B00',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  detailText: {
    color: '#111111',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'center',
  },

  detailTextTiny: {
    fontSize: 14,
    lineHeight: 20,
  },

  primaryButton: {
    backgroundColor: '#18E61B',
    borderWidth: 2,
    borderColor: '#11680D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  primaryButtonTextTiny: {
    fontSize: 12,
  },

  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  inlineWormIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },

  inlineWormIconTiny: {
    width: 18,
    height: 18,
    marginRight: 5,
  },

  costText: {
    color: '#5A3500',
    fontSize: 13,
    fontWeight: '800',
  },

  costTextTiny: {
    fontSize: 12,
  },

  secondaryButton: {
    backgroundColor: '#D78917',
    borderWidth: 2,
    borderColor: '#7A4300',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  secondaryButtonTextTiny: {
    fontSize: 12,
  },
});