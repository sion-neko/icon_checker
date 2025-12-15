import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface Props {
    imageUri: string;
    displayName: string;
    username: string;
}

export default function XPreview({ imageUri, displayName, username }: Props) {
    return (
        <View style={styles.container}>
            {/* プロフィール画面風 */}
            <View style={styles.profile}>
                <Text style={styles.sectionTitle}>プロフィール画面</Text>

                {/* ヘッダー画像 */}
                <View style={styles.profileHeader}>
                    <View style={styles.coverPhoto} />
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: imageUri }} style={styles.profileAvatar} />
                    </View>
                </View>

                {/* プロフィール情報 */}
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{displayName}</Text>
                    <Text style={styles.profileUsername}>@{username}</Text>
                    <Text style={styles.bio}>
                        プロフィール文がここに入ります。{'\n'}
                        趣味や仕事について書きます。
                    </Text>
                    <View style={styles.profileStats}>
                        <Text style={styles.stat}>
                            <Text style={styles.statNumber}>123</Text> Following
                        </Text>
                        <Text style={styles.stat}>
                            <Text style={styles.statNumber}>456</Text> Followers
                        </Text>
                    </View>
                </View>
            </View>

            {/* タイムライン投稿 */}
            <View style={styles.tweet}>
                <Image source={{ uri: imageUri }} style={styles.avatar} />

                <View style={styles.content}>
                    {/* ヘッダー */}
                    <View style={styles.header}>
                        <Text style={styles.displayName}>{displayName}</Text>
                        <Text style={styles.username}>@{username}</Text>
                        <Text style={styles.dot}>·</Text>
                        <Text style={styles.time}>2h</Text>
                        <View style={styles.spacer} />
                        <Text style={styles.moreIcon}>⋯</Text>
                    </View>

                    {/* ツイート本文 */}
                    <Text style={styles.tweetText}>
                        新しいプロフィール画像に変更しました！{'\n'}
                        どんな感じでしょうか？ 🎨
                    </Text>

                    {/* アクションボタン */}
                    <View style={styles.actions}>
                        <View style={styles.action}>
                            <Text style={styles.actionIcon}>💬</Text>
                            <Text style={styles.actionCount}>12</Text>
                        </View>
                        <View style={styles.action}>
                            <Text style={styles.actionIcon}>🔁</Text>
                            <Text style={styles.actionCount}>34</Text>
                        </View>
                        <View style={styles.action}>
                            <Text style={styles.actionIcon}>❤️</Text>
                            <Text style={styles.actionCount}>128</Text>
                        </View>
                        <View style={styles.action}>
                            <Text style={styles.actionIcon}>📊</Text>
                            <Text style={styles.actionCount}>1.2K</Text>
                        </View>
                        <View style={styles.action}>
                            <Text style={styles.actionIcon}>🔖</Text>
                        </View>
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
    },

    // ツイート部分
    tweet: {
        flexDirection: 'row',
        padding: 12,
        borderWidth: 1,
        borderColor: '#eff3f4',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    displayName: {
        fontWeight: 'bold',
        fontSize: 15,
        marginRight: 4,
    },
    username: {
        color: '#536471',
        fontSize: 15,
    },
    dot: {
        color: '#536471',
        marginHorizontal: 4,
    },
    time: {
        color: '#536471',
        fontSize: 15,
    },
    spacer: {
        flex: 1,
    },
    moreIcon: {
        fontSize: 18,
        color: '#536471',
    },
    tweetText: {
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxWidth: 425,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionIcon: {
        fontSize: 18,
        color: '#536471',
    },
    actionCount: {
        fontSize: 13,
        color: '#536471',
    },

    // プロフィール部分
    profile: {
        borderWidth: 1,
        borderColor: '#eff3f4',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#536471',
        padding: 12,
        backgroundColor: '#f7f9f9',
        textTransform: 'uppercase',
    },
    profileHeader: {
        position: 'relative',
    },
    coverPhoto: {
        width: '100%',
        height: 100,
        backgroundColor: '#cfd9de',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: -40,
        left: 16,
        borderWidth: 4,
        borderColor: '#fff',
        borderRadius: 68,
    },
    profileAvatar: {
        width: 68,
        height: 68,
        borderRadius: 34,
    },
    profileInfo: {
        padding: 16,
        paddingTop: 50,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileUsername: {
        fontSize: 15,
        color: '#536471',
        marginBottom: 12,
    },
    bio: {
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 12,
    },
    profileStats: {
        flexDirection: 'row',
        gap: 20,
    },
    stat: {
        fontSize: 14,
        color: '#536471',
    },
    statNumber: {
        fontWeight: 'bold',
        color: '#0f1419',
    },
});