import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GardenHome } from './app/screens/GardenHome';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GardenHome />
    </GestureHandlerRootView>
  );
}