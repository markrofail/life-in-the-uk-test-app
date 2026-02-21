import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface BankMasteryGaugeProps {
    correctCount: number;
    incorrectCount: number;
    totalQuestions: number;
}

export function BankMasteryGauge({
    correctCount,
    incorrectCount,
    totalQuestions,
}: BankMasteryGaugeProps) {
    const unansweredCount = totalQuestions - correctCount - incorrectCount;

    // SVG Gauge Variables
    const radius = 60;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;

    const correctLength = (correctCount / totalQuestions) * circumference;
    const incorrectLength = (incorrectCount / totalQuestions) * circumference;
    const unansweredLength = (unansweredCount / totalQuestions) * circumference;

    const correctRotation = -90;
    const incorrectRotation = correctRotation + (correctCount / totalQuestions) * 360;
    const unansweredRotation = incorrectRotation + (incorrectCount / totalQuestions) * 360;

    return (
        <View style={styles.container}>
            <View style={styles.gaugeContainer}>
                <Svg height="160" width="160" viewBox="0 0 160 160">
                    {/* Correct Circle */}
                    <Circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="#68D391"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={`${correctLength} ${circumference}`}
                        origin="80, 80"
                        rotation={correctRotation}
                    />
                    {/* Incorrect Circle */}
                    <Circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="#FC8181"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={`${incorrectLength} ${circumference}`}
                        origin="80, 80"
                        rotation={incorrectRotation}
                    />
                    {/* Unanswered Circle */}
                    <Circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="#333333"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={`${unansweredLength} ${circumference}`}
                        origin="80, 80"
                        rotation={unansweredRotation}
                    />
                    {/* Center Text */}
                    <SvgText
                        x="80"
                        y="80"
                        textAnchor="middle"
                        alignmentBaseline="central"
                        fontSize="24"
                        fontWeight="bold"
                        fill="#E2E8F0"
                    >
                        {correctCount}
                    </SvgText>
                    <SvgText
                        x="80"
                        y="100"
                        textAnchor="middle"
                        alignmentBaseline="central"
                        fontSize="12"
                        fill="#A0AEC0"
                    >
                        Mastered
                    </SvgText>
                </Svg>
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#68D391' }]} />
                    <Text style={styles.legendText}>Correct: {correctCount}</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#FC8181' }]} />
                    <Text style={styles.legendText}>Incorrect: {incorrectCount}</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#333333' }]} />
                    <Text style={styles.legendText}>Unseen: {unansweredCount}</Text>
                </View>
            </View>
        </View>
    );
}

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
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    legendText: {
        color: '#E2E8F0',
        fontSize: 12,
    },
});
