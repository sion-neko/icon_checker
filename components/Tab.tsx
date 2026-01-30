import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TabProps {
    tabs: string[];
    activeTab: number;
    onTabChange: (index: number) => void;
}

export default function Tab({ tabs, activeTab, onTabChange }: TabProps) {
    const tabWidth = SCREEN_WIDTH / tabs.length;
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: activeTab * tabWidth,
            useNativeDriver: true,
            bounciness: 4,
        }).start();
    }, [activeTab, tabWidth]);

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.tab}
                        onPress={() => onTabChange(index)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === index && styles.activeTabText
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Animated.View
                style={[
                    styles.indicator,
                    {
                        width: tabWidth,
                        transform: [{ translateX }]
                    }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    container: {
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        height: 3,
        backgroundColor: '#007AFF',
        position: 'absolute',
        bottom: 0,
        borderRadius: 3,
    },
    tabText: {
        fontSize: 15,
        color: '#8e8e93',
        fontFamily: 'Inter_600SemiBold',
    },
    activeTabText: {
        color: '#000',
        fontFamily: 'Inter_700Bold',
    },
});