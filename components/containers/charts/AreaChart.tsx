import { LinearGradient } from 'expo-linear-gradient'
import { View, Text } from 'react-native'
import { LineChart } from "react-native-gifted-charts"

type ChartProps = {
  title: string
  description?: string
  sideLabel?: boolean
  data?: { value: number }[]
  data2?: { value: number }[]
  chartKey: number
}

const AreaChartComponent = ({ title, description, sideLabel, data, data2, chartKey }: ChartProps) => {
  const lineData = data || [{ value: 0 }]
  const lineData2 = data2 || [{ value: 0 }]

  return (
    <View className="flex flex-col" style={{  }}>
      <Text
        className={`${sideLabel ? '' : 'text-center'} text-xl text-zinc-800`}
        style={{ marginLeft: sideLabel ? 6 : 0, fontFamily: 'PoppinsSemiBold' }}
      >
        {title}
      </Text>
      <View className='flex flex-row justify-between'>
        <Text
          className={`${sideLabel ? '' : 'text-center'} text-zinc-400`}
          style={{ marginLeft: sideLabel ? 6 : 0, fontFamily: 'PoppinsRegular', fontSize: 12, marginBottom: 5 }}
        >
          {description}
        </Text>
        <View className='flex-row gap-3'>
          <View className='flex-row gap-2 items-center flex'>
          <View className='bg-primary' style={{ height: 8, width: 8, borderRadius: 99}}/>
          <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Rain</Text>
        </View>
        <View className='flex-row gap-2 items-center flex'>
          <View className='bg-[#aaaaaa]' style={{ height: 8, width: 8, borderRadius: 99, backgroundColor: '#aaaaaa'}}/>
          <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Cloud</Text>
        </View>
        </View>
      </View>
      <View style={{ marginBottom: 5, overflow: 'hidden' }}>
        <LineChart
        key={chartKey}
          maxValue={100}
          disableScroll
          areaChart
          curved
          data={lineData2}
          data2={lineData}
          height={150}
          showVerticalLines
          spacing={44}
          initialSpacing={0}
          color1="lightgray"
          color2="#155183"
          hideDataPoints
          startFillColor1="lightgray"
          startFillColor2="#155183"
          startOpacity={0.8}
          endOpacity={0.3}
          isAnimated
          yAxisColor={'#ffffff'}
          xAxisColor={'#ffffff'}
          yAxisIndicesColor={'#a1a1aa'}
          animateOnDataChange
          animationDuration={1500}
          noOfSections={2}
          yAxisTextStyle={{
            color: '#a1a1aa',
            fontSize: 10,
            fontFamily: 'PoppinsMedium',
          }}
          yAxisLabelTexts={['0%', '50%', '100%']}
          verticalLinesColor={'#f4f4f5'}
        />
        <LinearGradient
          colors={['#ffffff', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            left: 35,
            top: 0,
            bottom: 0,
            width: 25,
            zIndex: 10,
          }}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['transparent', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 25,
            zIndex: 10,
          }}
          pointerEvents="none"
        />
      </View>
    </View>
  )
}

export default AreaChartComponent
