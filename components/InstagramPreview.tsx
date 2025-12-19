import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

interface Props {
    imageUri: string;
    displayName: string;
    username: string;
}

export default function InstagramPreview({ imageUri, displayName, username }: Props) {
    return (
        <View style={styles.container}>
            {/* ストーリーズプレビュー */}
            <View style={styles.stories}>
                <Text style={styles.sectionTitle}>ストーリーズ</Text>
                <View style={styles.storyItem}>
                    <View style={styles.storyRing}>
                        <Image source={{ uri: imageUri }} style={styles.storyAvatar} />
                    </View>
                    <Text style={styles.storyName}>{displayName}</Text>
                </View>
            </View>

            {/* フィード投稿 */}
            <View style={styles.post}>
                {/* ヘッダー */}
                <View style={styles.header}>
                    <Image source={{ uri: imageUri }} style={styles.avatar} />
                    <View style={styles.headerText}>
                        <Text style={styles.username}>{username}</Text>
                        <Text style={styles.location}>Tokyo, Japan</Text>
                    </View>
                    <Feather name="more-horizontal" size={24} color="black" />
                </View>

                {/* 投稿画像 */}
                <Image
                    source={{ uri: 'https://picsum.photos/400/400' }}
                    style={styles.postImage}
                />

                {/* アクションボタン */}
                <View style={styles.actions}>
                    <View style={styles.leftActions}>
                        <Ionicons name="heart-outline" size={28} color="black" style={styles.actionIcon} />
                        <Ionicons name="chatbubble-outline" size={26} color="black" style={styles.actionIcon} />
                        <Ionicons name="paper-plane-outline" size={26} color="black" style={styles.actionIcon} />
                    </View>
                    <Ionicons name="bookmark-outline" size={26} color="black" />
                </View>

                {/* いいね数 */}
                <Text style={styles.likes}>1,234 likes</Text>

                {/* キャプション */}
                <View style={styles.caption}>
                    <Text>
                        <Text style={styles.username}>{username} </Text>
                        <Text style={styles.captionText}>
                            新しいアイコンに変えてみました！どうですか？ #newicon #profile
                        </Text>
                    </Text>
                </View>

                {/* コメント */}
                <Text style={styles.viewComments}>View all 42 comments</Text>
                <Text style={styles.timestamp}>2 HOURS AGO</Text>
            </View>


        </View>
    );
}

// styles は前回と同じ
const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
    },

    // 投稿部分
    post: {
        backgroundColor: '#fff',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#efefef',
        borderRadius: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
    },
    headerText: {
        flex: 1,
    },
    username: {
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
    location: {
        fontSize: 11,
        color: '#262626',
    },
    moreIcon: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    postImage: {
        width: '100%',
        height: 400,
        backgroundColor: '#f0f0f0',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    leftActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionIcon: {
        fontSize: 24,
    },
    likes: {
        fontWeight: '600',
        paddingHorizontal: 12,
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
    caption: {
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    captionText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    viewComments: {
        paddingHorizontal: 12,
        paddingTop: 8,
        color: '#8e8e8e',
        fontSize: 14,
    },
    timestamp: {
        paddingHorizontal: 12,
        paddingTop: 4,
        paddingBottom: 12,
        color: '#8e8e8e',
        fontSize: 10,
        letterSpacing: 0.5,
    },

    // ストーリーズ部分
    stories: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#efefef',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8e8e8e',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    storyItem: {
        alignItems: 'center',
        width: 80,
    },
    storyRing: {
        padding: 3,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#c13584',
    },
    storyAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#fff',
    },
    storyName: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
        fontFamily: 'Inter_400Regular',
    },
});