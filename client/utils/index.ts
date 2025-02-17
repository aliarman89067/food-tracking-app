import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const widthPercentage = (percentage: number) => {
  return (screenWidth * percentage) / 100;
};

export const heightPercentage = (percentage: number) => {
  return (screenHeight * percentage) / 100;
};
