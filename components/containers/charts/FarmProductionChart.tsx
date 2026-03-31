import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ProductionDay } from '@/utils/types';

const PRIMARY = '#155183';

interface Props {
  data: ProductionDay[];
  chartKey: number;
}

const FarmProductionChart = ({ data, chartKey }: Props) => {
  const { width } = useWindowDimensions();

  const getDayLabel = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const barData = data.map((item) => ({
    value: item.quantity,
    label: getDayLabel(item.day),
    labelWidth: 36,
    frontColor: PRIMARY,
  }));

  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.quantity)) : 0;

  return (
    <View style={{
      backgroundColor: '#fafafa',
      borderRadius: 16, borderWidth: 0.5, borderColor: '#f4f4f5',
      padding: 16, overflow: 'hidden',
    }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>
          Production
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: PRIMARY }} />
          <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#71717a' }}>
            Quantity (kg)
          </Text>
        </View>
      </View>

      {data.length === 0 ? (
        <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#a1a1aa' }}>
            No production data
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
          barWidth={16}
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

export default FarmProductionChart;