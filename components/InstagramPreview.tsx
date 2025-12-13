import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface Props {
    imageUri: string;  // 選択した画像のURI
}

export default function InstagramPreview({ imageUri }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Instagram風プレビュー</Text>

            {/* 投稿部分 */}
            <View style={styles.post}>
                {/* ヘッダー（アイコン + ユーザー名） */}
                <View style={styles.header}>
                    <Image source={{ uri: imageUri }} style={styles.avatar} />
                    <Text style={styles.username}>your_username</Text>
                </View>

                {/* 投稿画像（ダミー） */}
                <View style={styles.postImage}>
                    <Text style={styles.dummyText}>投稿画像エリア</Text>
                </View>

                {/* いいね・コメント等（簡易版） */}
                <View style={styles.actions}>
                    <Text>❤️ 💬 ✈️</Text>
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
    post: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',  // 横並び
        alignItems: 'center',
        padding: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,  // 円形
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
    },
    postImage: {
        width: '100%',
        height: 300,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dummyText: {
        color: '#999',
    },
    actions: {
        padding: 10,
    },
});