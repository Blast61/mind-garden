import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import  ThreeSanity  from './app/screens/ThreeSanity'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <ThreeSanity />
    </GestureHandlerRootView>
  );
}