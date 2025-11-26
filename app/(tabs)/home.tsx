import { 
  BackHandler, 
  View, 
  Text, 
  ActivityIndicator, 
  ScrollView, 
  Pressable, 
  RefreshControl,
  Image
} from 'react-native'
import { 
  useCallback, 
  useEffect, 
  useRef, 
  useState 
} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useGetWeatherForecastQuery } from '@/store/weatherApi';
import { useRegisterDeviceTokenMutation } from '@/store/notificationApi';
import WeatherIcon from '@/components/containers/weather/WeatherIcon';
import { MapPinCheckInsideIcon } from 'lucide-react-native';
import WeatherDashboardBoxes from '@/components/containers/weather/WeatherDashboardBoxes';
import WeatherAlert from '@/components/containers/weather/WeatherAlert';
import BottomDrawer, { BottomDrawerRef } from '@/components/containers/BottomDrawer';
import { ForecastItem } from '@/utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthRedirect from '@/components/hooks/useAuthRedirect';
import AreaChartComponent from '@/components/containers/charts/AreaChart';

const Home = () => {
  const { data, isLoading, refetch } = useGetWeatherForecastQuery();
  const drawerRef = useRef<BottomDrawerRef>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ForecastItem | null>(null);
  const [chartKey, setChartKey] = useState(0);
  const [registerDeviceToken] = useRegisterDeviceTokenMutation();
  
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    await refetch();
    setRefreshing(true);
    setChartKey(prev => prev + 1);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const rainData = data?.future_forecast.map((item: any) => ({
    value: item.pop * 100,
  }))

  const cloudData = data?.future_forecast.map((item: any) => ({
    value: Math.min(item.clouds, 100),
  }))

  const { user } = useAuthRedirect()


  useEffect(() => {
    const registerToken = async () => {
      const expoToken = await AsyncStorage.getItem('expoPushToken');
      try {
        if (expoToken) {
          await registerDeviceToken({ token: expoToken }).unwrap();
        }
      } catch (error) {
        console.log('Error registering device token:', error);
      }
    }
    registerToken();
  },[registerDeviceToken])
  
    const handlePress = (item: ForecastItem) => {
      setSelectedItem(item);
      if (isDrawerOpen) {
        drawerRef.current?.close();
      } else {
        drawerRef.current?.open();
      }
    }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        backHandler.remove();
      };
    }, [])
  );
  
    const formatToPHT = (utcDateString: string) => {
      const date = new Date(utcDateString);
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        hour12: true,
        timeZone: 'Asia/Manila',
      };
      return new Intl.DateTimeFormat('en-PH', options).format(date);
    };
  
    const rainPercent = (selectedItem?.pop ?? 0) * 100;
    const cloud = selectedItem?.clouds ?? 0;

    let message = "";
    let alertLabel = "";
    let alertColor = "";
    
    // Descriptions
    const getRainDescription = (rainPercent: number) => {
      if (rainPercent === 0) return "no expected rain";
      if (rainPercent < 50) return `a moderate ${rainPercent}% chance of rain`;
      if (rainPercent < 90) return `a high ${rainPercent}% chance of rain`;
      return `a very high ${rainPercent}% chance of rain`;
    };
    
    const getCloudDescription = (cloud: number) => {
      if (cloud < 30) return "mostly clear skies";
      if (cloud < 50) return "partly cloudy skies";
      if (cloud < 100) return "noticeable cloud cover";
      return "overcast skies";
    };
    
    const rainDesc = getRainDescription(rainPercent);
    const cloudDesc = getCloudDescription(cloud);
    
    // ----------------------------
    // APPLY NEW RULES
    // ----------------------------
    
    if (rainPercent === 0 && cloud < 50) {
      alertLabel = "Excellent";
      alertColor = "#22c55e";
      message = `Ideal conditions for drying fish: ${cloudDesc}, and ${rainDesc}.`;
    }
    
    else if (rainPercent === 0 && cloud <= 100) {
      alertLabel = "Good";
      alertColor = "#3b82f6";
      message = `Good weather for drying fish with ${cloudDesc}, and ${rainDesc}.`;
    }
    
    else if (rainPercent <= 80 && rainPercent > 0 && cloud <= 100) {
      alertLabel = "Caution";
      alertColor = "#eab308";
      message = `Be cautious: ${cloudDesc}, and ${rainDesc}. Drying may be slow or risky.`;
    }
    
    else if (rainPercent > 80 && rainPercent < 99) {
      alertLabel = "Warning";
      alertColor = "#f97316";
      message = `Drying fish is not recommended due to ${cloudDesc}, and ${rainDesc}.`;
    }
    
    else {
      alertLabel = "Danger";
      alertColor = "#ef4444";
      message = `Avoid drying fish. Extreme conditions: ${cloudDesc}, and ${rainDesc}.`;
    }


  if (isLoading) return (
    <View className='flex-1 items-center justify-center bg-white'>
      <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    </View>
  );
  
  return (
    <View className='flex-1 bg-white'>
          <View className='flex-row justify-between items-center mt-14 p-5'>
            <Image source={require('@/assets/images/main-icon.png')} style={{ width: 120, height: 63 }} resizeMode='cover'/>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            overflow: 'hidden',
          }}
        >
          <Pressable
            android_ripple={{ color: '#d1d5db' }}
            delayLongPress={100}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => data?.first_item && handlePress(data.first_item)}
          >
        <View className='flex-col flex justify-center'>
          <WeatherIcon iconCode={data?.first_item.icon} style={{ width: 25, height: 25}}/>
          <Text style={{ fontFamily: 'PoppinsMedium' }} className='text-base text-primary'>{Math.round(data?.first_item.temperature ?? 0)}<Text className='text-xs' style={{ fontFamily: 'PoppinsRegular' }}>
          °C</Text></Text>
        </View>
        </Pressable>
        </View>

        </View>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl style={{ zIndex: -1}} colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />
          }>
        <WeatherAlert rain={data?.first_item.pop} wind={data?.first_item.wind_speed} cloud={data?.first_item.clouds}/>
        <View className='flex flex-col px-5 pt-6'>
          <Text className='text-2xl' style={{
          fontFamily: 'PoppinsSemiBold'
        }}>Hello <Text className='text-primary'>{user?.username && user.username[0].toUpperCase() + user.username.slice(1)}!</Text></Text>
          <Text className="mt-1 text-md text-gray-600" style={{ fontFamily: 'PoppinsRegular'}}>
            Let’s make your SunDried Fish Farm thrive!
          </Text>
        </View>
        <WeatherDashboardBoxes pop={data?.first_item.pop} wind_speed={data?.first_item.wind_speed} clouds={data?.first_item.clouds}/>
        <View className='flex-row items-center justify-end px-5 mt-5'>
            <MapPinCheckInsideIcon size={15} color={'#6b7280'}/>
            <Text className='text-sm text-gray-500 ml-1' style={{ fontFamily: 'PoppinsRegular'}}>Lives in {data?.city.name}, {data?.city.country}</Text>
          </View>

        <View style={{ paddingTop: 18, paddingBottom: 10, paddingRight: 18, paddingLeft: 10}}>
          <AreaChartComponent chartKey={chartKey} title={'Rain Forecast Graph'} description={'Next 48 Hours'} sideLabel data={rainData} data2={cloudData}/>
        </View>

        {/* ########################################       WEATHER FORECAST      ######################################## */}

        <View style={{ 
        marginBottom: 10,   
        }} className="gap-3 bg-white">
        <Text className="text-lg px-5" style={{ fontFamily: 'PoppinsSemiBold' }}>
          Weather Forecast
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {data?.first_item &&  (
              <Pressable onPress={() => handlePress(data.first_item)}>
                <View
                  style={{ 
                    borderRadius: 16, 
                    borderColor: '#d4d4d8', 
                    width: 75, 
                    height:120, 
                    padding: 8,
                    marginLeft: 18, 
                    marginRight: 1 }}
                  className={`p-1 border border-zinc-300 flex items-center w-20 h-32`}
                >
                  <Text className="text-black text-xs">
                    {new Date(data.first_item.datetime).toLocaleDateString('en-US', {
                      weekday: 'long',
                    })}
                  </Text>
                  <Text
                    className="text-xs text-zinc-500"
                    style={{ fontFamily: 'PoppinsMedium' }}
                  >
                    {formatToPHT(data.first_item.datetime)}
                  </Text>
                  <WeatherIcon iconCode={data.first_item.icon} style={{ width: 35, height: 35, marginTop: 8 }} />
                  <Text style={{ fontFamily: 'PoppinsMedium' }} className="mt-3 text-base text-primary">
                    {Math.round(data.first_item.temperature ?? 0)}
                    <Text className="text-xs" style={{ fontFamily: 'PoppinsRegular' }}>
                      °C
                    </Text>
                  </Text>
                </View>
              </Pressable>
            )}
            {data?.future_forecast.map((item, index) => (
              <Pressable key={index} onPress={() => handlePress(item)}>
                <View
                  style={{ 
                    borderRadius: 16, 
                    borderColor: '#d4d4d8', 
                    width: 75, 
                    height:120, 
                    padding: 8, 
                    marginRight: index === data.future_forecast.length - 1 ? 18 : 0 }}
                  className={`p-1 border border-zinc-300 flex items-center w-20 h-32  ${index === data.future_forecast.length - 1 ? 'mr-5' : ''}`}
                >
                  <Text className="text-black text-xs">
                    {new Date(item.datetime).toLocaleDateString('en-US', {
                      weekday: 'long',
                    })}
                  </Text>
                  <Text
                    className="text-xs text-zinc-500"
                    style={{ fontFamily: 'PoppinsMedium' }}
                  >
                    {formatToPHT(item.datetime)}
                  </Text>
                  <WeatherIcon iconCode={item.icon} style={{ width: 35, height: 35, marginTop: 8 }} />
                  <Text style={{ fontFamily: 'PoppinsMedium' }} className="mt-3 text-base text-primary">
                    {Math.round(item.temperature ?? 0)}
                    <Text className="text-xs" style={{ fontFamily: 'PoppinsRegular' }}>
                      °C
                    </Text>
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
      {/* <Lesson/> */}
      <View style={{ marginBottom: 20}}/>
      </ScrollView>
      <BottomDrawer ref={drawerRef} onChange={(open) => setIsDrawerOpen(open)} type='none'>
        {selectedItem ? (
          <View style={{ alignItems: 'center', padding: 16, zIndex: 99999, marginBottom: 18 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {new Date(selectedItem.datetime).toLocaleDateString('en-US', { weekday: 'long' })}
            </Text>
            <Text style={{ color: '#6b7280' }}>{formatToPHT(selectedItem.datetime)}</Text>
            <WeatherIcon iconCode={selectedItem.icon} style={{ width: 50, height: 50, marginVertical: 12 }} />
            <View>
            <View className=" rounded-xl relative">
              <View style={{ gap: 5 }} className="flex-row justify-center items-center">
                <Text
                  style={{
                    fontFamily: 'PoppinsSemiBold',
                    color: alertColor,
                    fontSize: 16,
                  }}
                >
                  {alertLabel}
                </Text>
              </View>
      
              <Text
                style={{ fontFamily: 'PoppinsRegular' }}
                className="text-zinc-500 mt-2 text-center text-sm"
              >
                {message}
              </Text>
            </View>
          </View>
          </View>
        ) : (
          <Text>No selection</Text>
        )}
      </BottomDrawer>
    </View>
  );
}

export default Home