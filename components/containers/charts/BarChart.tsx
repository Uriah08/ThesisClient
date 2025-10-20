import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface BarChartComponentProps {
  data: Record<string, number> | undefined;
}

const labelMap: Record<string, string> = {
  WET: 'Wet',
  PARTIALLY_DRY: 'Partially',
  ALMOST_DRY: 'Almost',
  FULLY_DRY: 'Fully',
  REJECT: 'Reject',
};


const BarChartComponent: React.FC<BarChartComponentProps> = ({ data: counts }) => {
  const allLabels = ['WET', 'PARTIALLY_DRY', 'ALMOST_DRY', 'FULLY_DRY', 'REJECT'];

  const chartData = allLabels.map((label) => {
    const value = counts?.[label] || 0;
    return {
      value,
      label: labelMap[label],
      frontColor:
        label === 'REJECT'
          ? '#961515'
          : label === 'WET'
          ? '#155183'
          : label === 'PARTIALLY_DRY'
          ? '#c47f00'
          : label === 'ALMOST_DRY'
          ? '#bab32f'
          : '#127312',
      topLabelComponent: () => (
        <Text
          style={{
            color: '#71717a',
            fontSize: 12,
            marginBottom: 3,
            fontFamily: 'PoppinsBold',
          }}
        >
          {value}
        </Text>
      ),
    };
  });


  return (
    <View className="mt-5" style={{ paddingHorizontal: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
      <Text
        className={`text-start text-zinc-800 py-3`}
        style={{ marginLeft: 6, fontFamily: 'PoppinsSemiBold' }}
      >
        Dryness Chart
      </Text>
      <BarChart
        width={260}
        data={chartData}
        yAxisColor="#ffffff"
        xAxisColor="#ffffff"
        yAxisIndicesColor="#a1a1aa"
        noOfSections={3}
        barBorderRadius={5}
        yAxisTextStyle={{
          color: '#a1a1aa',
          fontSize: 10,
          fontFamily: 'PoppinsMedium',
        }}
        xAxisLabelTextStyle={{
          color: '#a1a1aa',
          fontSize: 10,
          fontFamily: 'PoppinsMedium',
        }}
      />
    </View>
  );
};

export default BarChartComponent;
