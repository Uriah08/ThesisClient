import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface BarChartComponentProps {
  data: Record<string, number> | undefined;
}

const labelMap: Record<string, string> = {
  REJECT: 'Reject',
  UNDRIED: 'Undried',
  DRY: 'Dry',
};


const BarChartComponent: React.FC<BarChartComponentProps> = ({ data: counts }) => {
  const allLabels = ['REJECT', 'UNDRIED', 'DRY'];

  const { width } = useWindowDimensions()
  const HORIZONTAL_PADDING = 32

  const chartData = allLabels.map((label) => {
    const value = counts?.[label] || 0;
    return {
      value,
      label: labelMap[label],
      frontColor:
        label === 'REJECT'
          ? '#961515'
          : label === 'UNDRIED'
          ? '#c47f00'
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
        width={width - HORIZONTAL_PADDING}
        data={chartData}
        yAxisColor="#ffffff"
        xAxisColor="#ffffff"
        yAxisIndicesColor="#a1a1aa"
        noOfSections={3}
        barBorderRadius={5}
        barWidth={65}
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
