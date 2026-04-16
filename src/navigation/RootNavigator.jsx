import React, { useState, useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import type { RootStackParamList } from './types';

import LoadingScreen from '../screens/LoadingScreen';
import OnboardingScreen from '../screens/OnboardingerfScreen';
import MoodScreen from '../screens/MooderfevScreen';
import MenuScreen from '../screens/MenuScreen';

import AskRiverScreen from '../screens/AskrScreen';
import NicknameScreen from '../screens/NicknamesfScreen';
import StoriesScreen from '../screens/StoriesesScreen';
import DailyQuizScreen from '../screens/QuizhvjhgScreen';
import WormJarScreen from '../screens/WormJarhgghScreen';
import SettingsScreen from '../screens/SettingsmScreen';

const Stack = createNativeStackNavigator();
// <Stack.Screen name="Loading" component={LoadingScreen} />
// libs
import ReactNativeIdfaAaid, {
  AdvertisingInfoResponse,
} from '@sparkfabrik/react-native-idfa-aaid';

export default function RootNavigator() {
  const [route, setRoute] = useState(false);
  console.log('route===>', route);
  const [isLoading, setIsLoading] = useState(false);
  const [aceptTransperency, setAceptTransperency] = useState(false);

  useEffect(() => {
    fetchIdfa();
  }, [])
  
  // IDFA / ATT status
  const fetchIdfa = async () => {
    try {
      const res = await ReactNativeIdfaAaid.getAdvertisingInfo();

      if (!res.isAdTrackingLimited) {
        setIdfa(res.id);

       // Settings.setAdvertiserTrackingEnabled(true);

        //setTimeout(() => {
          setAceptTransperency(true);
        //}, 1500);
        return true;
      } else {
        setIdfa('00000000-0000-0000-0000-000000000000');

       // Settings.setAdvertiserTrackingEnabled(false);

        //setTimeout(() => {
          setAceptTransperency(true);
        //}, 2500);
        console.log('НЕ ЗГОДА!!!!!!!!!');

        return false;
      }
    } catch (err) {
      setIdfa(null);

      //Settings.setAdvertiserTrackingEnabled(false);

      setAceptTransperency(true);
      console.log('Помилка отримання IDFA:', err);

      return false;

    }
  };

  ///////// Route
  const Route = ({ isFatch }) => {
    //if (!completeLink) {
    //  // Показуємо тільки лоудери, поки acceptTransparency і completeLink не true
    //  //return null;
    //  return <LoadingScreen />;
    //}

    if (isFatch) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            initialParams={{
              //responseToPushPermition,
              //product: finalLink,
              //timeStampUserId: timeStampUserId,
              //customUserAgent: customUserAgent,
              //uid: uid,
            }}
            name="ProductScreen"
            component={ProductScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      );
    }
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Mood" component={MoodScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="AskRiver" component={AskRiverScreen} />
      <Stack.Screen name="Nickname" component={NicknameScreen} />
      <Stack.Screen name="Stories" component={StoriesScreen} />
      <Stack.Screen name="DailyQuiz" component={DailyQuizScreen} />
      <Stack.Screen name="WormJar" component={WormJarScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 5000);
  }, []);

  return (
    <>
    {isLoading ? <Route isFatch={route} /> : <LoadingScreen />}
    </>
  );
}