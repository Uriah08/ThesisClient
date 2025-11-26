import { LinearGradient } from 'expo-linear-gradient';
import { View, Text } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

const TrayChart = () => {
  // Sample static data
  const lineData2 = [
    { value: 10, label: 'Mon' },
    { value: 40, label: 'Tue' },
    { value: 20, label: 'Wed' },
    { value: 80, label: 'Thu' },
    { value: 60, label: 'Fri' },
    { value: 90, label: 'Sat' },
    { value: 50, label: 'Sun' }
  ];

  const lineData = [
    { value: 5 },
    { value: 12 },
    { value: 10 },
    { value: 6 },
    { value: 7 },
    { value: 10 },
    { value: 8 },
  ];

  // Extract dynamic X-axis labels from first dataset
  const xLabels = lineData2.map(point => point.label);

  return (
    <View style={{ padding: 10 }}>
      {/* <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10, fontFamily: 'PoppinsSemiBold' }}>
        Sample Area Chart
      </Text> */}

      {/* Legend */}
      <View className='flex justify-between items-center'>
        <Text>Fish Detected</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ height: 8, width: 8, borderRadius: 99, backgroundColor: '#155183' }} />
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#555' }}>Rejects</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ height: 8, width: 8, borderRadius: 99, backgroundColor: '#aaaaaa' }} />
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#555' }}>Detected</Text>
          </View>
        </View>
      </View>
      {/* Line Chart */}
      <View style={{ height: 150, marginBottom: 5 }}>
        <LineChart
          data={lineData2}
          data2={lineData}
          height={150}
          spacing={44}
          initialSpacing={0}
          maxValue={100}
          areaChart
          curved
          isAnimated
          animateOnDataChange
          animationDuration={1500}
          color1="lightgray"
          color2="#155183"
          hideDataPoints
          startFillColor1="lightgray"
          startFillColor2="#155183"
          startOpacity={0.8}
          endOpacity={0.3}
          yAxisLabelTexts={['0%', '50%', '100%']}
          yAxisTextStyle={{ color: '#a1a1aa', fontSize: 10, fontFamily: 'PoppinsMedium' }}
          verticalLinesColor={'#f4f4f5'}
          yAxisColor={'#ffffff'}
          xAxisColor={'#ffffff'}
          xAxisLabelTexts={xLabels}
          xAxisLabelTextStyle={{ color: '#a1a1aa', fontSize: 10, fontFamily: 'PoppinsRegular', textAlign: 'right', }}
          xAxisIndicesColor={'#ffffff'}
          showXAxisIndices={true} 
          yAxisIndicesColor={'#a1a1aa'}
          noOfSections={2}
        />

        {/* Gradient overlays */}
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
  );
};

export default TrayChart;
