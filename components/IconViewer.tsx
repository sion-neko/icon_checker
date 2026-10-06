import React from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
    visible: boolean;
    imageUri: string;
    // SNSごとの拡大表示の形（丸 or 四角）
    shape: 'circle' | 'square';
    onClose: () => void;
}

// SNSのプロフィール画面でアイコンをタップした時のような拡大表示
export default function IconViewer({ visible, imageUri, shape, onClose }: Props) {
    const { width } = useWindowDimensions();
    const size = width;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <Image
                    source={{ uri: imageUri }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: shape === 'circle' ? size / 2 : 0,
                    }}
                />
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    <Feather name="x" size={28} color="#fff" />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 56,
        right: 20,
    },
});
