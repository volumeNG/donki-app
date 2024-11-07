import Colors from "@/constants/Colors";
import { ColorContext } from "@/context/DonkiColorProvider";
import {
  LucideMessageCircleWarning,
  ShieldAlert,
  Info,
} from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";

interface MaintainerData {
  description: string;
  status: "warning" | "error" | "info";
}

const borderColors = {
  warning: "#facc15",
  error: "#ff3333",
  info: "#1F75FE",
};

const maintainerIcon = {
  warning: <LucideMessageCircleWarning size={20} color={"#facc15"} />,
  error: <ShieldAlert size={20} color={"#ff3333"} />,
  info: <Info size={20} color={"#1F75FE"} />,
  default: <Info size={20} color={"#1F75FE"} />,
};
function MaintainerUpdate() {
  const colorContext = useContext(ColorContext);

  const [maintainerData, setMaintainerData] = useState<MaintainerData | null>(
    null
  );

  const getMaintainerMessage = async () => {
    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/info/1`;
    const response = await fetch(url);
    const result = await response.json();
    if (response) {
      if (result.data) {
        setMaintainerData({
          description: result.data.description!,
          status: result.data.status!,
        });
      }
    }
  };

  useEffect(() => {
    getMaintainerMessage();
  }, []);
  return (
    <View
      style={{
        backgroundColor: "transparent",
        // alignSelf: "center",
        padding: 10,
        flex: 1,
        borderColor: borderColors[maintainerData?.status!] ?? "transparent",
        borderWidth: 1,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
      }}
    >
      {maintainerData?.status && maintainerIcon[maintainerData?.status!]}
      <Text
        style={{
          // textAlign: "center",
          color: Colors[colorContext?.colorScheme ?? "light"].text,
        }}
      >
        {maintainerData?.description && maintainerData?.description}
      </Text>
    </View>
  );
}

export default MaintainerUpdate;
