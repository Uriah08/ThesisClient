import { router, useLocalSearchParams } from "expo-router"
import { View, Text, ActivityIndicator, ScrollView, Pressable } from "react-native"
import { useGetNotificationQuery } from "@/store/notificationApi"
import { ChevronLeft, Trash2 } from "lucide-react-native"
import NotificationIcon from "@/components/containers/notifications/NotificationIcon"
import { useState } from "react"
import DeleteNotifications from "@/components/containers/dialogs/DeleteNotifications"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const Notification = () => {
  const { id } = useLocalSearchParams()
  const { data, isLoading } = useGetNotificationQuery(Number(id))
  const [showDelete, setShowDelete] = useState(false)

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <DeleteNotifications
        setVisible={setShowDelete}
        visible={showDelete}
        type="single"
        ids={data?.id ? [data.id] : []}
      />

      {/* Header */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 16,
      }}>
        <Pressable
          onPress={() => router.push("/(tabs)/notification")}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: "#f4f4f5",
            alignItems: "center", justifyContent: "center",
          }}>
          <ChevronLeft size={18} color="#18181b" />
        </Pressable>

        <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 15, color: "#18181b" }}>
          Notification
        </Text>

        <Pressable
          onPress={() => setShowDelete(true)}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: "#f4f4f5",
            alignItems: "center", justifyContent: "center",
          }}>
          <Trash2 size={16} color="#71717a" />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size={30} color="#155183" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, gap: 20 }}
          showsVerticalScrollIndicator={false}>

          {/* Icon + Meta */}
          <View style={{
            alignItems: "center", gap: 12, padding: 28,
            backgroundColor: "#f4f4f5", borderRadius: 20,
          }}>
            <NotificationIcon iconCode={data?.notification.type} size={64} />
            <View style={{ alignItems: "center", gap: 4 }}>
              <View style={{
                backgroundColor: "#E6F1FB", borderRadius: 20,
                paddingHorizontal: 12, paddingVertical: 3,
              }}>
                <Text style={{ fontFamily: "PoppinsMedium", fontSize: 11, color: "#185FA5" }}>
                  {data?.notification.type}
                </Text>
              </View>
              <Text style={{ fontFamily: "PoppinsRegular", fontSize: 12, color: "#71717a" }}>
                {dayjs(data?.notification.created_at).fromNow()}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 16, color: "#18181b", lineHeight: 24 }}>
            {data?.notification.title}
          </Text>

          {/* Divider */}
          <View style={{ height: 0.5, backgroundColor: "#e4e4e7" }} />

          {/* Body */}
          <Text style={{ fontFamily: "PoppinsRegular", fontSize: 13, color: "#52525b", lineHeight: 22 }}>
            {data?.notification.body}
          </Text>

        </ScrollView>
      )}
    </View>
  )
}

export default Notification