import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { FONTFAMILY } from "@/constants/fontFamily";
import { COLORS } from "@/constants/Colors";
import { router } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface FoodGridProps {
  data:
    | null
    | {
        _id: string;
        name: string;
        imageUrl: string;
        foods: string[];
      }[];
  isLoading: boolean;
}

const FoodGrid = ({ data, isLoading }: FoodGridProps) => {
  if (!isLoading && !data) {
    return (
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "80%",
        }}
      >
        <Text
          style={{
            fontFamily: FONTFAMILY.Medium,
            color: COLORS.black,
            fontSize: 20,
          }}
        >
          Nothing to show
        </Text>
      </View>
    );
  }

  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotate, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);
  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderBox}>
          <View style={[styles.loaderStroke]}></View>
          <FontAwesome5 name="pizza-slice" size={30} color={COLORS.black} />
        </View>
      </View>
    );
  }
  return (
    <FlatList
      data={data}
      numColumns={2}
      contentContainerStyle={{
        marginTop: 20,
        paddingHorizontal: 10,
        paddingBottom: 20,
      }}
      keyExtractor={(item) => item._id}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/screens/DishesScreen",
              params: { id: item._id },
            })
          }
          style={styles.cardContainer}
          activeOpacity={0.7}
        >
          <View style={styles.idBox}>
            <Text style={styles.idText}>{index + 1}</Text>
          </View>
          <ImageBackground
            source={{ uri: item.imageUrl }}
            style={styles.card}
            imageStyle={{ resizeMode: "cover" }}
          >
            <View style={styles.titleBox}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={[styles.title, { fontSize: 12 }]}>
                {item.foods.length} Foods
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: COLORS.black,
    marginHorizontal: 5,
    marginVertical: 7,
    position: "relative",
  },
  card: {
    flex: 1,
    height: 200,
    width: "100%",
    justifyContent: "flex-end",
    borderRadius: 10,
    overflow: "hidden",
  },
  titleBox: {
    backgroundColor: COLORS.black,
    width: "100%",
    paddingVertical: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  title: {
    fontFamily: FONTFAMILY.Regular,
    color: COLORS.white,
    fontSize: 15,
    textAlign: "center",
  },
  idBox: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 23,
    height: 23,
    borderRadius: "100%",
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  idText: {
    fontFamily: FONTFAMILY.Regular,
    color: COLORS.white,
    fontSize: 12,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  loaderBox: {
    width: 60,
    height: 60,
    position: "relative",
    transform: [{ translateY: -60 }],
    alignItems: "center",
    justifyContent: "center",
  },
  loaderStroke: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    backgroundColor: "red",
    borderWidth: 5,
    borderStyle: "solid",
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default FoodGrid;
