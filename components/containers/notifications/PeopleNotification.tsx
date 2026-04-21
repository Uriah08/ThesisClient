import { View, Image, Text } from "react-native";
import { Notification } from "@/utils/types";

export function PeopleNotificationBody({ notification }: { notification: Notification }) {
  const { data } = notification;

  return (
    <View style={{ gap: 16 }}>

      {/* User card */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: "#f4f4f5",
        borderRadius: 14,
        padding: 16,
      }}>
        <Image
            source={data?.profile_picture
              ? { uri: data.profile_picture }
              : require('@/assets/images/default-profile.png')}
            style={{ width: 52, height: 52, borderRadius: 26 }}
          />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 14, color: "#18181b" }}>
            {data.username}
          </Text>
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 6,
            backgroundColor: "#EAF3DE", borderRadius: 20,
            paddingHorizontal: 10, paddingVertical: 3,
            alignSelf: "flex-start",
          }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#639922" }} />
            <Text style={{ fontFamily: "PoppinsMedium", fontSize: 11, color: "#3B6D11" }}>
              New member
            </Text>
          </View>
        </View>
      </View>

      {/* Farm info */}
      <View style={{
        borderWidth: 0.5, borderColor: "#e4e4e7",
        borderRadius: 14, padding: 16, gap: 10,
      }}>
        <Text style={{ fontFamily: "PoppinsMedium", fontSize: 11, color: "#71717a" }}>
          JOINED FARM
        </Text>
        <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 15, color: "#18181b" }}>
          {data.farm_name}
        </Text>
        <View style={{ height: 0.5, backgroundColor: "#e4e4e7" }} />
        <View style={{ gap: 8 }}>
        {notification.body.split("\n\n").map((line, i) => (
            <Text
            key={i}
            style={{
                fontFamily: i === 0 ? "PoppinsMedium" : "PoppinsRegular",
                fontSize: i === 0 ? 14 : 13,
                color: i === 0 ? "#18181b" : "#71717a",
                lineHeight: 22,
            }}
            >
            {line}
            </Text>
        ))}
        </View>
      </View>

    </View>
  );
}