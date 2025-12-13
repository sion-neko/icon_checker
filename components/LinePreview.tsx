import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface Props {
    imageUri: string;
}

export default function LinePreview({ imageUri }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>LINE風プレビュー</Text>

            {/* トークリスト画面風 */}
            <View style={styles.chatList}>
                <View style={styles.chatItem}>
                    <Image source={{ uri: imageUri }} style={styles.avatar} />
                    <View style={styles.chatInfo}>
                        <Text style={styles.chatName}>あなたの名前</Text>
                        <Text style={styles.lastMessage}>最新のメッセージがここに表示されます</Text>
                    </View>
                    <Text style={styles.time}>12:34</Text>
                </View>
            </View>

            {/* トーク画面風 */}
            <View style={styles.chatRoom}>
                <Text style={styles.subtitle}>トーク画面</Text>

                {/* 相手のメッセージ */}
                <View style={styles.messageRowOther}>
                    <Image source={{ uri: imageUri }} style={styles.avatarSmall} />
                    <View style={styles.messageBubbleOther}>
                        <Text style={styles.messageText}>こんにちは！</Text>
                    </View>
                </View>

                {/* 自分のメッセージ（アイコンなし） */}
                <View style={styles.messageRowMe}>
                    <View style={styles.messageBubbleMe}>
                        <Text style={styles.messageText}>アイコンどう見える？</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#666',
    },

    // トークリスト
    chatList: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    chatItem: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    lastMessage: {
        color: '#666',
        fontSize: 14,
    },
    time: {
        color: '#999',
        fontSize: 12,
    },

    // トーク画面
    chatRoom: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    messageRowOther: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    messageRowMe: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 12,
    },
    avatarSmall: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
    },
    messageBubbleOther: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 12,
        maxWidth: '70%',
    },
    messageBubbleMe: {
        backgroundColor: '#06c755', // LINE緑
        padding: 10,
        borderRadius: 12,
        maxWidth: '70%',
    },
    messageText: {
        fontSize: 14,
    },
});