import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Easing } from 'react-native-reanimated';

const PieChartComponent = ({ value }: { value: number }) => {
  const [progress, setProgress] = useState(55);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [animatedValue, value]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setProgress(Math.round(value));
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [animatedValue]);

  const pieData = [
    { value: progress, color: '#155183' },
    { value: 100 - progress, color: 'white' },
  ];

  return (
    <View>
      <PieChart
        donut
        radius={40}
        innerRadius={25}
        data={pieData}
        centerLabelComponent={() => (
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'PoppinsExtraBold',
            }}
          >
            {progress}%
          </Text>
        )}
      />
    </View>
  );
};

export default PieChartComponent;
