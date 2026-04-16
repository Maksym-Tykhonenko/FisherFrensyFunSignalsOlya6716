import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View, ImageBackground, Animated, Easing } from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

const BG = require('../assets/loabg.png');

export default function LoadingScreen({ navigation }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, scale]);

  {/** 
  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      if (active) {
        navigation.replace('Onboarding');
      }
    }, 4200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [navigation]);*/}

  const html = useMemo(
    () => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background: transparent;
              overflow: hidden;
            }

            body {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .scene {
              position: relative;
              width: 210px;
              height: 210px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .halo {
              position: absolute;
              width: 150px;
              height: 150px;
              border-radius: 999px;
              background: radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0) 72%);
              animation: breathe 2.8s ease-in-out infinite;
            }

            .halo.two {
              width: 186px;
              height: 186px;
              opacity: 0.72;
              animation-delay: 0.5s;
            }

            .spark {
              position: absolute;
              width: 8px;
              height: 8px;
              border-radius: 999px;
              background: rgba(255,255,255,0.92);
              box-shadow:
                0 0 8px rgba(255,255,255,0.95),
                0 0 18px rgba(255,255,255,0.65);
              animation: blink 1.8s ease-in-out infinite;
            }

            .s1 { top: 34px; left: 102px; animation-delay: 0.1s; }
            .s2 { top: 66px; right: 38px; animation-delay: 0.45s; }
            .s3 { bottom: 42px; right: 54px; animation-delay: 0.9s; }
            .s4 { bottom: 58px; left: 38px; animation-delay: 1.2s; }
            .s5 { top: 72px; left: 42px; animation-delay: 1.55s; }

            .star-shell {
              position: relative;
              width: 128px;
              height: 128px;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: floaty 3.4s ease-in-out infinite;
            }

            .star-glow {
              position: absolute;
              inset: 0;
              border-radius: 999px;
              background: radial-gradient(circle, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.12) 38%, rgba(255,255,255,0) 72%);
              filter: blur(6px);
            }

            .star {
              position: relative;
              width: 122px;
              height: 122px;
              background:
                radial-gradient(circle at 50% 45%, #fffdfd 0%, #f8f2f8 52%, #efe5ef 100%);
              clip-path: polygon(
                50% 0%,
                58% 14%,
                72% 6%,
                70% 22%,
                86% 18%,
                78% 32%,
                96% 36%,
                82% 46%,
                94% 58%,
                76% 58%,
                80% 76%,
                64% 68%,
                58% 88%,
                50% 74%,
                42% 88%,
                36% 68%,
                20% 76%,
                24% 58%,
                6% 58%,
                18% 46%,
                4% 36%,
                22% 32%,
                14% 18%,
                30% 22%,
                28% 6%,
                42% 14%
              );
              box-shadow:
                0 0 10px rgba(255,255,255,0.9),
                0 0 22px rgba(255,255,255,0.55);
              filter:
                drop-shadow(0 0 5px rgba(255,255,255,0.92))
                drop-shadow(0 0 14px rgba(255,255,255,0.65))
                drop-shadow(0 0 26px rgba(255,255,255,0.32));
              animation: spin 4.8s linear infinite;
            }

            .star::after {
              content: "";
              position: absolute;
              inset: 18px;
              border-radius: 999px;
              background: radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0) 100%);
              filter: blur(2px);
              pointer-events: none;
            }

            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            @keyframes breathe {
              0%   { transform: scale(0.92); opacity: 0.42; }
              50%  { transform: scale(1.08); opacity: 0.88; }
              100% { transform: scale(0.92); opacity: 0.42; }
            }

            @keyframes blink {
              0%, 100% { transform: scale(0.7); opacity: 0.35; }
              50% { transform: scale(1.15); opacity: 1; }
            }

            @keyframes floaty {
              0%   { transform: translateY(0px); }
              50%  { transform: translateY(-6px); }
              100% { transform: translateY(0px); }
            }
          </style>
        </head>
        <body>
          <div class="scene">
            <div class="halo"></div>
            <div class="halo two"></div>

            <div class="spark s1"></div>
            <div class="spark s2"></div>
            <div class="spark s3"></div>
            <div class="spark s4"></div>
            <div class="spark s5"></div>

            <div class="star-shell">
              <div class="star-glow"></div>
              <div class="star"></div>
            </div>
          </div>
        </body>
      </html>
    `,
    [],
  );

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.webWrap,
            {
              opacity: fade,
              transform: [{ scale }],
            },
          ]}
        >
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={styles.webview}
            scrollEnabled={false}
            bounces={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
            javaScriptEnabled
            domStorageEnabled
            androidLayerType="hardware"
            backgroundColor="transparent"
          />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  webWrap: {
    width: 230,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },

  webview: {
    width: 230,
    height: 230,
    backgroundColor: 'transparent',
  },
});