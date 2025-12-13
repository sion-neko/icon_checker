import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface Props {
    imageUri: string;
}

export default function XPreview({ imageUri }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>X (Twitter) 風プレビュー</Text>

            <View style={styles.tweet}>
                {/* ツイートヘッダー */}
                <View style={styles.header}>
                    <Image source={{ uri: imageUri }} style={styles.avatar} />
                    <View style={styles.userInfo}>
                        <Text style={styles.displayName}>あなたの名前</Text>
                        <Text style={styles.username}>@your_username</Text>
                    </View>
                </View>

                {/* ツイート本文 */}
                <View style={styles.content}>
                    <Text style={styles.tweetText}>
                        これはツイート本文のサンプルです。{'\n'}
                        アイコンがどう見えるかチェックできます。
                    </Text>
                </View>

                {/* アクション（リプライ、リツイート等） */}
                <View style={styles.actions}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionIcon}>🔁</Text>
                    <Text style={styles.actionIcon}>❤️</Text>
                    <Text style={styles.actionIcon}>📊</Text>
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
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    tweet: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    displayName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    username: {
        color: '#657786',
        fontSize: 14,
    },
    content: {
        marginTop: 4,
        marginLeft: 60, // アイコン分インデント
    },
    tweetText: {
        fontSize: 15,
        lineHeight: 20,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        marginLeft: 60,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    actionIcon: {
        fontSize: 16,
    },
});