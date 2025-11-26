import { router, useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useGetNotificationQuery } from "@/store/notificationApi";
import { ChevronLeft, Trash } from "lucide-react-native";
import NotificationIcon from "@/components/containers/notifications/NotificationIcon";
import { useState } from "react";
import DeleteNotifications from "@/components/containers/dialogs/DeleteNotifications";

const Notification = () => {
    const { id } = useLocalSearchParams();
    const { data, isLoading } = useGetNotificationQuery(Number(id));
    const [showDelete, setShowDelete] = useState(false)

    console.log(data);
    
    
  return (
    <View className="flex-1 bg-white relative">
        <DeleteNotifications setVisible={setShowDelete} visible={showDelete} type="single" ids={data?.id ? [data.id] : []}/>
        <ChevronLeft onPress={() => router.push('/(tabs)/notification')} style={{ position: 'absolute', top: 50, left: 20}} color="black" size={32} /> 
            {isLoading ? (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
                </View>
            ) : (
                <View className="p-5 mt-24">
                    <Trash onPress={() => setShowDelete(true)} style={{ position: 'absolute', top: -28, right: 20 }} color={'#71717a'} size={20} />
                    <View className="flex-col gap-3 items-center">
                        <NotificationIcon iconCode={data?.notification.type} size={70}/>
                        <Text className='text-xl text-center' style={{
                        fontFamily: 'PoppinsSemiBold'
                        }}>{data?.notification.title}</Text>
                        <Text className="mt-5 text-zinc-700" style={{ fontFamily: 'PoppinsRegular'}}>{data?.notification.body}</Text>
                    </View>
                </View>
            )}   
    </View>
  )
}

export default Notification