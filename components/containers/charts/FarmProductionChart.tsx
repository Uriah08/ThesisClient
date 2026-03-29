import React from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { ProductionDay } from '@/utils/types'

interface Props {
  data: ProductionDay[]
  chartKey: number
}

const FarmProductionChart = ({ data, chartKey }: Props) => {
  const QUANTITY_COLOR = '#155183'
  const { width } = useWindowDimensions()

  const getDayLabel = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const barData = data.map((item) => ({
    value: item.quantity,
    label: getDayLabel(item.day),
    labelWidth: 36,
    frontColor: QUANTITY_COLOR,
  }))

  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.quantity)) : 0

  return (
    <View style={{ paddingTop: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginLeft: 10 }}>
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15 }}>Production</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ height: 8, width: 8, borderRadius: 99, backgroundColor: QUANTITY_COLOR, marginBottom: 2 }} />
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#555' }}>Quantity (kg)</Text>
        </View>
      </View>

      {data.length === 0 ? (
        <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#a1a1aa' }}>No production data</Text>
        </View>
      ) : (
        <BarChart
          key={chartKey}
          width={width - 32}
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
          yAxisTextStyle={{ color: 'gray', fontSize: 10, fontFamily: 'PoppinsRegular' }}
          xAxisLabelTextStyle={{ color: '#a1a1aa', fontSize: 9, fontFamily: 'PoppinsRegular', textAlign: 'left' }}
          noOfSections={3}
          maxValue={maxValue}
        />
      )}
    </View>
  )
}

export default FarmProductionChart