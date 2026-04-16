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
  Share,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const BG = require('../assets/loabg.png');
const BACK_ICON = require('../assets/back_arrow.png');

const STORAGE_NOTIFICATIONS = 'river_notifications_enabled';

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(18)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(26)).current;
  const contentScale = useRef(new Animated.Value(0.98)).current;
  const toggleScale = useRef(new Animated.Value(1)).current;

  const isSmall = height < 760;
  const isVerySmall = height < 690;
  const isTiny = height < 640;

  const contentWidth = useMemo(() => {
    if (isTiny) return Math.min(width - 22, 308);
    if (isVerySmall) return Math.min(width - 30, 324);
    return Math.min(width - 36, 344);
  }, [width, isTiny, isVerySmall]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_NOTIFICATIONS);

        if (raw === null) {
          setNotificationsEnabled(true);
          return;
        }

        setNotificationsEnabled(raw === '1');
      } catch {
        setNotificationsEnabled(true);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    headerOpacity.setValue(0);
    headerTranslateY.setValue(18);
    contentOpacity.setValue(0);
    contentTranslateY.setValue(26);
    contentScale.setValue(0.98);

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
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 380,
        delay: 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 560,
        delay: 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 1,
        duration: 560,
        delay: 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerOpacity, headerTranslateY, contentOpacity, contentTranslateY, contentScale]);

  const animateToggle = () => {
    toggleScale.setValue(0.96);

    Animated.spring(toggleScale, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handleToggleNotifications = async () => {
    try {
      const nextValue = !notificationsEnabled;
      setNotificationsEnabled(nextValue);
      animateToggle();
      await AsyncStorage.setItem(STORAGE_NOTIFICATIONS, nextValue ? '1' : '0');
    } catch {}
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          `Fishing: Fun Fun Signals is a light entertainment app with playful river-themed interactions. ` +
          `Explore mood choices, name-based titles, short quiz activities, daily rewards and themed content inside a calm visual world. ` +
          `The app is designed for simple local use on your device without account registration.`,
      });
    } catch {}
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
                width: contentWidth,
                marginTop: insets.top + 6,
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslateY }],
              },
            ]}
          >
            <Pressable style={styles.backButton} onPress={() => navigation.replace('Menu')}>
              <Image source={BACK_ICON} style={styles.backIcon} resizeMode="contain" />
            </Pressable>

            <View style={styles.headerBadge}>
              <Text style={[styles.headerTitle, isTiny && styles.headerTitleTiny]}>
                SETTINGS
              </Text>
            </View>
          </Animated.View>

          <ScrollView
            style={styles.flexFull}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: Math.max(insets.bottom, 16) + 14,
              },
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Animated.View
              style={[
                styles.mainWrap,
                {
                  width: contentWidth,
                  marginTop: isTiny ? 14 : isVerySmall ? 18 : 24,
                  opacity: contentOpacity,
                  transform: [{ translateY: contentTranslateY }, { scale: contentScale }],
                },
              ]}
            >
              <View style={styles.card}>
                <View style={styles.cardTopBar} />

                <Text style={[styles.sectionEyebrow, isTiny && styles.sectionEyebrowTiny]}>
                  APP PREFERENCES
                </Text>

                <Text style={[styles.sectionTitle, isTiny && styles.sectionTitleTiny]}>
                  Manage your local experience
                </Text>

                <Animated.View
                  style={[
                    styles.preferenceRow,
                    {
                      minHeight: isTiny ? 84 : isVerySmall ? 92 : 100,
                      transform: [{ scale: toggleScale }],
                    },
                  ]}
                >
                  <View style={styles.preferenceTextWrap}>
                    <Text style={[styles.preferenceTitle, isTiny && styles.preferenceTitleTiny]}>
                      Notifications
                    </Text>
                    <Text
                      style={[styles.preferenceDescription, isTiny && styles.preferenceDescriptionTiny]}
                    >
                      Enable or disable reminder signals inside the app.
                    </Text>
                  </View>

                  <Pressable
                    style={[
                      styles.toggleButton,
                      notificationsEnabled ? styles.toggleOn : styles.toggleOff,
                      {
                        width: isTiny ? 96 : isVerySmall ? 112 : 126,
                        height: isTiny ? 46 : isVerySmall ? 50 : 56,
                      },
                    ]}
                    onPress={handleToggleNotifications}
                  >
                    <Text style={[styles.toggleButtonText, isTiny && styles.toggleButtonTextTiny]}>
                      {notificationsEnabled ? 'ENABLED' : 'DISABLED'}
                    </Text>
                  </Pressable>
                </Animated.View>

                <View
                  style={[
                    styles.infoBlock,
                    {
                      marginTop: isTiny ? 12 : 14,
                      paddingHorizontal: isTiny ? 10 : 14,
                      paddingTop: isTiny ? 12 : 14,
                      paddingBottom: isTiny ? 14 : 16,
                    },
                  ]}
                >
                  <Text style={[styles.infoBlockTitle, isTiny && styles.infoBlockTitleTiny]}>
                    ABOUT THIS APP
                  </Text>

                  <Text style={[styles.infoText, isTiny && styles.infoTextTiny]}>
                    Is a light themed app built around short playful
                    interactions. You can open mood screens, generate river-style names, collect
                    daily worms, move through quiz steps and explore simple content designed for a
                    calm and entertaining experience.
                  </Text>

                  <Text style={[styles.infoText, isTiny && styles.infoTextTiny]}>
                    The app is intended for casual local use, with settings and progress stored on
                    the device. It focuses on small interactions, visual atmosphere and quick daily
                    engagement.
                  </Text>

                  <Pressable
                    style={[
                      styles.shareButton,
                      {
                        width: '100%',
                        height: isTiny ? 50 : isVerySmall ? 56 : 60,
                        marginTop: isTiny ? 14 : 18,
                      },
                    ]}
                    onPress={handleShare}
                  >
                    <Text style={[styles.shareButtonText, isTiny && styles.shareButtonTextTiny]}>
                      SHARE APP
                    </Text>
                  </Pressable>
                </View>
              </View>
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
    backgroundColor: 'rgba(0,0,0,0.16)',
  },

  safe: {
    flex: 1,
  },

  root: {
    flex: 1,
    alignItems: 'center',
  },

  flexFull: {
    width: '100%',
  },

  scrollContent: {
    width: '100%',
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

  headerTitleTiny: {
    fontSize: 16,
  },

  mainWrap: {
    alignItems: 'center',
  },

  card: {
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

  sectionEyebrow: {
    color: '#6C4100',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 12,
  },

  sectionEyebrowTiny: {
    fontSize: 9,
  },

  sectionTitle: {
    color: '#111111',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  sectionTitleTiny: {
    fontSize: 17,
    marginBottom: 12,
  },

  preferenceRow: {
    width: '100%',
    backgroundColor: '#F1D07A',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#8C4B00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  preferenceTextWrap: {
    flex: 1,
    paddingRight: 10,
  },

  preferenceTitle: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '900',
  },

  preferenceTitleTiny: {
    fontSize: 14,
  },

  preferenceDescription: {
    marginTop: 4,
    color: '#5A3500',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },

  preferenceDescriptionTiny: {
    fontSize: 11,
    lineHeight: 15,
  },

  toggleButton: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  toggleOn: {
    backgroundColor: '#18E61B',
    borderColor: '#11680D',
  },

  toggleOff: {
    backgroundColor: '#F01818',
    borderColor: '#7F0B0B',
  },

  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },

  toggleButtonTextTiny: {
    fontSize: 11,
  },

  infoBlock: {
    width: '100%',
  },

  infoBlockTitle: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '900',
  },

  infoBlockTitleTiny: {
    fontSize: 14,
  },

  infoText: {
    marginTop: 10,
    color: '#111111',
    fontSize: 13.5,
    lineHeight: 21,
    fontWeight: '500',
  },

  infoTextTiny: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
  },

  shareButton: {
    alignSelf: 'stretch',
    backgroundColor: '#D78917',
    borderWidth: 2,
    borderColor: '#7A4300',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  shareButtonTextTiny: {
    fontSize: 13,
  },
});