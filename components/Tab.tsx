import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabProps {
    tabs: string[];  // タブのラベル配列
    activeTab: number;  // 現在アクティブなタブのインデックス
    onTabChange: (index: number) => void;  // タブ切り替え時のコールバック
}

export default function Tab({ tabs, activeTab, onTabChange }: TabProps) {
    return (
        <View style={styles.container}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.tab,
                        activeTab === index && styles.activeTab  // アクティブタブのスタイル
                    ]}
                    onPress={() => onTabChange(index)}
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
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#007AFF',  // iOS風の青
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});