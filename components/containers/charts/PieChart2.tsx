import { View, Text } from 'react-native';
import React from 'react';
import { PieChart } from 'react-native-gifted-charts';
import { TriangleAlert, CheckCircle2 } from 'lucide-react-native';

type Props = {
    v1?: number;
    v2?: number;
};

const PieChart2 = ({ v1 = 0, v2 = 0 }: Props) => {
    const percentage = (v1 / (v1 + v2)) * 100 
    const rejectPercentage = Math.abs((Number(percentage.toFixed(0)) - 100))

    const pieData = [
        {
            value: v2,
            color: '#aaaaaa',
            gradientCenterColor: '#aaaaaa',
            focused: true,
        },
        {
            value: v1,
            color: '#155183',
            gradientCenterColor: '#155183',
        },
    ];

    let title = '';
    let description = '';
    let IconComponent: React.ElementType;

    if (rejectPercentage >= 30) {
        title = 'High Reject Rate';
        description = 'Rejects are critically high; immediate action is recommended.';
        IconComponent = TriangleAlert;
    } else if (rejectPercentage >= 10) {
        title = 'Moderate Reject Rate';
        description = 'Rejects are above normal; monitor production carefully.';
        IconComponent = TriangleAlert;
    } else {
        title = 'Rejects Under Control';
        description = 'Rejects are low and within acceptable limits.';
        IconComponent = CheckCircle2;
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ borderRadius: 20 }}>
                <View className="flex-row items-center">
                    <PieChart
                        data={pieData}
                        donut
                        showGradient
                        sectionAutoFocus
                        radius={40}
                        innerRadius={28}
                        centerLabelComponent={() => (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontFamily: 'PoppinsExtraBold',
                                        color: 'black',
                                    }}
                                >
                                    {rejectPercentage}%
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color: 'black',
                                        fontFamily: 'PoppinsRegular',
                                        marginTop: -8,
                                    }}
                                >
                                    Reject
                                </Text>
                            </View>
                        )}
                    />

                    <View
                        className="flex-1"
                        style={{
                            borderWidth: 1,
                            borderColor: '#d4d4d8',
                            borderRadius: 12,
                            padding: 12,
                            marginHorizontal: 17,
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <View className="flex-row gap-3 items-center">
                            <View
                                style={{
                                    borderRadius: 999,
                                    backgroundColor: pieData[1].color,
                                    padding: 6
                                }}
                            >
                                <IconComponent color="#ffffff" size={11} />
                            </View>
                            <Text
                                className="text-zinc-600"
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: 12,
                                    color: '#111111',
                                }}
                            >
                                {title}
                            </Text>
                        </View>
                        <Text
                            className="text-zinc-500"
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: 12,
                                marginTop: 6,
                                lineHeight: 16,
                            }}
                        >
                            {description}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PieChart2;
