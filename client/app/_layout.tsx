import React, { useEffect, useState } from "react";
import { Redirect, Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [loaded, error] = useFonts({
    "opensans-bold": require("@/assets/fonts/OpenSans-Bold.ttf"),
    "opensans-extrabold": require("@/assets/fonts/OpenSans-ExtraBold.ttf"),
    "opensans-light": require("@/assets/fonts/OpenSans-Light.ttf"),
    "opensans-medium": require("@/assets/fonts/OpenSans-Medium.ttf"),
    "opensans-regular": require("@/assets/fonts/OpenSans-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded || error) return;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="intro" />
    </Stack>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Layout;
