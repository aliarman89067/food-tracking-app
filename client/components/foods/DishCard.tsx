import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { heightPercentage } from "@/utils";
import { FONTFAMILY } from "@/constants/fontFamily";
import { COLORS } from "@/constants/Colors";
import { useAddStore } from "@/context/store";
import asyncStorage from "@react-native-async-storage/async-storage";

interface DishCardProps {
  label: string;
  data: { _id: string; name: string; imageUrl: string }[];
  savedFoodIds?: string[] | null;
  setSavedFoodIds?: Dispatch<SetStateAction<string[] | null>>;
  cuisineName?: string | undefined;
}

const DishCard = ({
  label,
  data,
  setSavedFoodIds,
  savedFoodIds,
  cuisineName,
}: DishCardProps) => {
  const { setIsAdd } = useAddStore();
  const handleAdd = async ({
    _id,
    name,
    imageUrl,
    cuisineName,
  }: {
    _id: string;
    name: string;
    imageUrl: string;
    cuisineName: string;
  }) => {
    setIsAdd(false);
    setTimeout(() => {
      setIsAdd(true);
    }, 5);
    if (setSavedFoodIds) {
      setSavedFoodIds([...(savedFoodIds || []), _id]);
    }
    const prevData = await asyncStorage.getItem("food-tracking-data");
    if (prevData) {
      await asyncStorage.setItem(
        "food-tracking-data",
        JSON.stringify([
          { _id, name, imageUrl, cuisineName, type: label },
          ...JSON.parse(prevData),
        ])
      );
    } else {
      await asyncStorage.setItem(
        "food-tracking-data",
        JSON.stringify([{ _id, name, imageUrl, cuisineName, type: label }])
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>
        ({data.length}) {label}
      </Text>
      <View style={styles.mapContainer}>
        {data.map((item) => (
          <View key={item._id} style={[styles.card]}>
            <Image
              style={[
                styles.image,
                { opacity: savedFoodIds?.includes(item._id) ? 0.4 : 1 },
              ]}
              source={{ uri: item.imageUrl }}
              alt={`${item.name} cuisine image`}
              resizeMode="cover"
            />
            {savedFoodIds && savedFoodIds.includes(item._id) && (
              <Text style={styles.alreadyText}>Added</Text>
            )}

            <TouchableOpacity
              onPress={() =>
                handleAdd({
                  _id: item._id,
                  name: item.name,
                  imageUrl: item.imageUrl,
                  cuisineName: cuisineName!,
                })
              }
              disabled={savedFoodIds?.includes(item._id)}
              style={[
                styles.addButtonBox,
                { opacity: savedFoodIds?.includes(item._id) ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.addButtonText}>Add</Text>
              <Text
                style={[styles.addButtonText, { fontFamily: FONTFAMILY.Bold }]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 20,
    width: "100%",
  },
  labelText: {
    fontFamily: FONTFAMILY.Medium,
    color: COLORS.black,
    fontSize: 20,
  },
  card: {
    position: "relative",
    width: "48%",
    marginBottom: 16,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: heightPercentage(22),
    borderRadius: 10,
  },
  name: {
    fontFamily: FONTFAMILY.Regular,
    fontSize: 14,
    color: COLORS.black,
    marginTop: 5,
  },
  addButtonBox: {
    width: "100%",
    height: 55,
    borderRadius: 6,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 3,
  },
  addButtonText: {
    color: COLORS.white,
    fontFamily: FONTFAMILY.Regular,
    fontSize: 12,
  },
  alreadyText: {
    position: "absolute",
    top: "36%",
    fontFamily: FONTFAMILY.Black,
    fontSize: 30,
    color: COLORS.black,
    transform: [{ rotate: "-45deg" }],
  },
  mapContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});

export default DishCard;
