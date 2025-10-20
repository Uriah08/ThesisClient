import { View, Text } from 'react-native'
import React from 'react'
import { PieChart } from 'react-native-gifted-charts';

const PieChart2 = () => {
    const pieData = [
        {
            value: 47,
            color: '#00b000',
            gradientCenterColor: '#00b000',
            focused: true,
        },
        {
            value: 40, 
            color: '#d9ce00', 
            gradientCenterColor: '#d9ce00'
        },
        {
            value: 16, 
            color: '#d18c0f', 
            gradientCenterColor: '#d18c0f'
        },
        {
            value: 3, 
            color: '#0e3db3', 
            gradientCenterColor: '#0e3db3'
        },
        {
            value: 3, 
            color: '#b30e0e', 
            gradientCenterColor: '#b30e0e'
        },
    ];

  return (
    <View
        style={{
        flex: 1,
        }}>
        <View
        style={{
            marginTop: 12,
            borderRadius: 20,
        }}>
        <View style={{padding: 20, alignItems: 'center'}}>
            <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            centerLabelComponent={() => {
                return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                    style={{fontSize: 22, fontFamily: 'PoppinsExtraBold', color: 'black'}}>
                    47%
                    </Text>
                    <Text style={{fontSize: 14, color: 'black', fontFamily: 'PoppinsRegular'}}>Fully Dry</Text>
                </View>
                );
            }}
            />
        </View>
        </View>
    </View>
  )
}

export default PieChart2