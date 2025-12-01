import { Detected } from '@/utils/types';
import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface Props {
  data: Detected[];
  chartKey: number
}

const FarmDashboardBarChart = ({ data, chartKey }: Props) => {
  const BLUE = '#155183';
  const RED = '#aaaaaa';

  const getDayLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Last 7 days
  const last7Data = data.slice(-7);

  const barData = last7Data.flatMap((item) => {
    const label = getDayLabel(item.day);

    return [
      {
        value: item.detected,
        label,
        spacing: 2,
        labelWidth: 30,
        frontColor: BLUE,
      },
      {
        value: item.rejects,
        spacing: 18,
        labelWidth: 30,
        frontColor: RED,
      },
    ];
  });

  const flatValues = data.flatMap((d) => [d.detected, d.rejects]);
  const maxValue = flatValues.length > 0 ? Math.max(...flatValues) : 0;

  return (
    <View style={{ paddingTop: 20 }}>

      {/* Legend */}
      <View className='flex-row justify-between items-center' style={{ marginBottom: 10, marginLeft: 10 }}>
        <Text className="text-lg" style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15 }}>Fish Detected</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ height: 8, width: 8, borderRadius: 99, backgroundColor: BLUE, marginBottom: 2 }} />
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#555' }}>Good</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ height: 8, width: 8, borderRadius: 99, backgroundColor: RED, marginBottom: 2 }} />
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#555' }}>Reject</Text>
          </View>
        </View>
      </View>

      <BarChart
        key={chartKey}
        isAnimated
        scrollAnimation
        barBorderRadius={3}
        data={barData}
        barWidth={10}
        spacing={18}
        hideRules
        height={150}
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{
          color: 'gray',
          fontSize: 10,
          fontFamily: 'PoppinsRegular',
        }}
        xAxisLabelTextStyle={{
          color: '#a1a1aa',
          fontSize: 9,
          fontFamily: 'PoppinsRegular',
          textAlign: 'left',
        }}
        noOfSections={3}

        // FIXED ✓ (No NaN on Y-axis)
        maxValue={maxValue}
        
      />
    </View>
  );
};

export default FarmDashboardBarChart;
