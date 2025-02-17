import { Image, Text, View } from "react-native";
import { Redirect, router, Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { burger, history, house, profile } from "@/constants/Images";
import { COLORS } from "@/constants/Colors";
import asyncStorage from "@react-native-async-storage/async-storage";
import { useAddStore } from "@/context/store";
import LottieView from "lottie-react-native";
import bucketAnimation from "@/assets/animations/bucket.json";

interface TabBarIconProps {
  focused: boolean;
  icon: HTMLImageElement;
  label?: string;
}

const TabBarIcon = ({ focused, icon, label }: TabBarIconProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  const { isAdd, setIsAdd } = useAddStore();

  useEffect(() => {
    if (!isAdd && label === "Profile") {
      console.log("Off animation");
      setShowAnimation(false);
    }
    if (isAdd && label === "Profile") {
      console.log("run animation");
      setShowAnimation(true);
    }
  }, [isAdd]);

  return (
    <View
      style={[
        styles.tabBarIconContainer,
        { backgroundColor: focused ? "#fff" : "transparent" },
      ]}
    >
      {showAnimation && (
        <View
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
          }}
        >
          <LottieView
            source={bucketAnimation}
            autoPlay
            loop={false}
            style={{ width: 44, height: 44 }}
            onAnimationFinish={() => {
              setShowAnimation(false);
              setIsAdd(false);
            }}
          />
        </View>
      )}
      <Image
        source={icon}
        tintColor={focused ? COLORS.orange : COLORS.white}
        resizeMode="contain"
        style={{ width: 30, height: 30 }}
      />
    </View>
  );
};

const RootLayout = () => {
  const [isIntroSeen, setIsIntroSeen] = useState(true);
  const [add, setAdd] = useState(0);

  useEffect(() => {
    const handleIntroSeen = async () => {
      const value = await asyncStorage.getItem("is-intro-seen");
      setIsIntroSeen(value === "true");
    };
    handleIntroSeen();
  }, []);

  if (!isIntroSeen) {
    return <Redirect href="/intro" />;
  }

  return (
    <Tabs
      key={1}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarContainer,
      }}
    >
      <Tabs.Screen
        key={2}
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={house} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        key={3}
        name="foods"
        options={{
          tabBarLabel: "Foods",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={burger} label="Foods" />
          ),
        }}
      />
      <Tabs.Screen
        key={4}
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={profile} label="Profile" />
          ),
        }}
      />
      <Tabs.Screen
        key={5}
        name="history"
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={history} label="History" />
          ),
        }}
      />
      <Tabs.Screen
        key={7}
        name="food"
        options={{
          tabBarLabel: "Food",
          href: null,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: COLORS.orange,
    width: "90%",
    height: 70,
    marginHorizontal: "auto",
    marginBottom: 10,
    borderRadius: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  tabBarIconContainer: {
    position: "relative",
    width: 55,
    height: 55,
    borderRadius: "50%",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RootLayout;
