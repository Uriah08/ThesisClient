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

const colorMap: Record<string, string> = {
  REJECT: '#961515',
  UNDRIED: '#c47f00',
  DRY: '#127312',
};

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data: counts }) => {
  const allLabels = ['REJECT', 'UNDRIED', 'DRY'];
  const { width } = useWindowDimensions();

  const total = allLabels.reduce((sum, l) => sum + (counts?.[l] || 0), 0);

  const chartData = allLabels.map((label) => {
    const value = counts?.[label] || 0;
    return {
      value,
      label: labelMap[label],
      frontColor: colorMap[label],
      topLabelComponent: () =>
        value > 0 ? (
          <Text style={{
            color: '#52525b',
            fontSize: 11,
            marginBottom: 4,
            fontFamily: 'PoppinsBold',
          }}>
            {value}
          </Text>
        ) : null,
    };
  });

  return (
    <View style={{
      backgroundColor: '#ffffff',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#f1f1f1',
      paddingVertical: 18,
      paddingHorizontal: 16,
      gap: 16,
    }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>
          Dryness Chart
        </Text>
        <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa' }}>
          {total} fish total
        </Text>
      </View>

      {/* Bar chart */}
      <BarChart
        width={width - 100}
        data={chartData}
        yAxisColor="transparent"
        xAxisColor="#f4f4f5"
        rulesColor="#f4f4f5"
        yAxisIndicesColor="transparent"
        noOfSections={3}
        barBorderRadius={6}
        barWidth={58}
        spacing={24}
        initialSpacing={20}
        yAxisTextStyle={{
          color: '#d4d4d8',
          fontSize: 10,
          fontFamily: 'PoppinsRegular',
        }}
        xAxisLabelTextStyle={{
          color: '#71717a',
          fontSize: 10,
          fontFamily: 'PoppinsMedium',
        }}
      />

      {/* Summary pills */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {allLabels.map((label) => {
          const value = counts?.[label] || 0;
          const pct = total > 0 ? ((value / total) * 100).toFixed(0) : '0';
          return (
            <View key={label} style={{
              flex: 1,
              backgroundColor: `${colorMap[label]}10`,
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 6,
              alignItems: 'center',
              gap: 2,
              borderWidth: 1,
              borderColor: `${colorMap[label]}22`,
            }}>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 14, color: colorMap[label] }}>
                {pct}%
              </Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#71717a' }}>
                {labelMap[label]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default BarChartComponent;