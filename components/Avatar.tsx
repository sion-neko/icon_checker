import React from 'react';
import { View, Image, StyleSheet, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
    uri: string | null;
    style: StyleProp<ImageStyle>;
}

// 画像が未選択のときは、同じ大きさ・形のグレーの人型アイコンを出す
export default function Avatar({ uri, style }: Props) {
    if (uri) {
        return <Image source={{ uri }} style={style} />;
    }

    const { width } = StyleSheet.flatten(style) ?? {};
    const size = typeof width === 'number' ? width : 40;

    return (
        <View style={[style as StyleProp<ViewStyle>, styles.placeholder]}>
            <Feather name="user" size={Math.round(size * 0.5)} color="#a1a1aa" />
        </View>
    );
}

const styles = StyleSheet.create({
    placeholder: {
        backgroundColor: '#e4e4e7',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
