import { Detected } from '@/utils/types';
import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const PRIMARY = '#155183';
const GREY = '#aaaaaa';

interface Props {
  data: Detected[];
  chartKey: number;
}

const FarmDashboardBarChart = ({ data, chartKey }: Props) => {
  const { width } = useWindowDimensions();

  const getDayLabel = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const last7Data = data.slice(-7);

  const barData = last7Data.flatMap((item) => {
    const label = getDayLabel(item.day);
    return [
      { value: item.detected, label, spacing: 2, labelWidth: 30, frontColor: PRIMARY },
      { value: item.rejects, spacing: 18, labelWidth: 30, frontColor: GREY },
    ];
  });

  const flatValues = data.flatMap((d) => [d.detected, d.rejects]);
  const maxValue = flatValues.length > 0 ? Math.max(...flatValues) : 0;

  return (
    <View style={{
      backgroundColor: '#fafafa',
      borderRadius: 16, borderWidth: 0.5, borderColor: '#f4f4f5',
      padding: 16, overflow: 'hidden',
    }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>
          Fish Detected
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: PRIMARY }} />
            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#71717a' }}>Good</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: GREY }} />
            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#71717a' }}>Reject</Text>
          </View>
        </View>
      </View>

      {data.length === 0 ? (
        <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#a1a1aa' }}>
            No detection data
          </Text>
        </View>
      ) : (
        <BarChart
          key={chartKey}
          width={width - 96}
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
          yAxisTextStyle={{ color: '#a1a1aa', fontSize: 9, fontFamily: 'PoppinsRegular' }}
          xAxisLabelTextStyle={{ color: '#a1a1aa', fontSize: 9, fontFamily: 'PoppinsRegular', textAlign: 'left' }}
          noOfSections={3}
          maxValue={maxValue}
        />
      )}
    </View>
  );
};

export default FarmDashboardBarChart;