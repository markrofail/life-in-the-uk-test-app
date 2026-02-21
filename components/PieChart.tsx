import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface PieChartData {
    value: number;
    color: string;
    label: string;
}

interface PieChartProps {
    data: PieChartData[];
    totalValue?: number;
    radius?: number;
    strokeWidth?: number;
    centerLabel?: string | number;
    centerSubLabel?: string | number;
    showLegend?: boolean;
}

export const PieChart = memo(function PieChart({
    data,
    totalValue,
    radius = 60,
    strokeWidth = 14,
    centerLabel,
    centerSubLabel,
    showLegend = true,
}: PieChartProps) {
    const sum = data.reduce((acc, curr) => acc + curr.value, 0);
    const total = totalValue !== undefined ? totalValue : sum;

    const circumference = 2 * Math.PI * radius;
    const center = radius + strokeWidth;
    const size = center * 2;

    let currentRotation = -90; // Start at top

    return (
        <View style={styles.container}>
            <View style={styles.gaugeContainer}>
                <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
                    {data.map((item, index) => {
                        if (item.value === 0) return null; // don't render 0-length arcs

                        const length = (item.value / total) * circumference;
                        const dashArray = `${length} ${circumference}`;
                        const rotation = currentRotation;

                        // Advance rotation for the next slice
                        currentRotation += (item.value / total) * 360;

                        return (
                            <Circle
                                key={index}
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke={item.color}
                                strokeWidth={strokeWidth}
                                fill="transparent"
                                strokeDasharray={dashArray}
                                origin={`${center}, ${center}`}
                                rotation={rotation}
                            />
                        );
                    })}

                    {/* Center Text */}
                    {centerLabel !== undefined && (
                        <SvgText
                            x={center}
                            y={centerSubLabel !== undefined ? center - (radius * 0.15) : center}
                            textAnchor="middle"
                            alignmentBaseline="central"
                            fontSize={radius * 0.45}
                            fontWeight="bold"
                            fill="#E2E8F0"
                        >
                            {centerLabel}
                        </SvgText>
                    )}
                    {centerSubLabel !== undefined && (
                        <SvgText
                            x={center}
                            y={center + (radius * 0.35)}
                            textAnchor="middle"
                            alignmentBaseline="central"
                            fontSize={radius * 0.25}
                            fontWeight="bold"
                            fill="#A0AEC0"
                        >
                            {centerSubLabel}
                        </SvgText>
                    )}
                </Svg>
            </View>

            {/* Legend */}
            {showLegend && (
                <View style={styles.legendContainer}>
                    {data.map((item) => (
                        <View key={item.label} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText}>{item.label}: {item.value}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    gaugeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 8,
        flexWrap: 'wrap',
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        color: '#E2E8F0',
        fontSize: 14,
        fontWeight: '500',
    },
});
