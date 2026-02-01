import React from 'react';
import { View, Image, Text, StyleSheet, ImageBackground } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';

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
                    <ImageBackground
                        source={{ uri: imageUri }}
                        style={styles.coverPhoto}
                        blurRadius={20}
                    >
                        <View style={styles.coverOverlay} />
                    </ImageBackground>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: imageUri }} style={styles.profileAvatar} />
                    </View>
                    <View style={styles.editButtonContainer}>
                        <View style={styles.editButton}>
                            <Text style={styles.editButtonText}>編集</Text>
                        </View>
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
                            <Text style={styles.statNumber}>123</Text> <Text style={styles.statLabel}>Following</Text>
                        </Text>
                        <Text style={styles.stat}>
                            <Text style={styles.statNumber}>456</Text> <Text style={styles.statLabel}>Followers</Text>
                        </Text>
                    </View>
                </View>
            </View>

            {/* タイムライン投稿 1 */}
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
                        <Feather name="more-horizontal" size={18} color="#536471" />
                    </View>

                    {/* ツイート本文 */}
                    <Text style={styles.tweetText}>
                        新しいプロフィール画像に変更しました！{'\n'}
                        どんな感じでしょうか？ 🎨
                    </Text>

                    {/* アクションボタン */}
                    <View style={styles.actions}>
                        <View style={styles.action}>
                            <Feather name="message-circle" size={18} color="#536471" />
                            <Text style={styles.actionCount}>12</Text>
                        </View>
                        <View style={styles.action}>
                            <FontAwesome6 name="retweet" size={16} color="#536471" />
                            <Text style={styles.actionCount}>34</Text>
                        </View>
                        <View style={styles.action}>
                            <Feather name="heart" size={18} color="#536471" />
                            <Text style={styles.actionCount}>128</Text>
                        </View>
                        <View style={styles.action}>
                            <Feather name="bar-chart-2" size={18} color="#536471" />
                            <Text style={styles.actionCount}>1.2K</Text>
                        </View>
                        <View style={styles.action}>
                            <Feather name="bookmark" size={18} color="#536471" />
                        </View>
                    </View>
                </View>
            </View>

            {/* 通知プレビュー */}
            <View style={styles.notificationSection}>
                <Text style={styles.sectionTitle}>通知</Text>

                <View style={styles.notification}>
                    <FontAwesome6 name="heart" size={24} color="#f91880" style={styles.notificationIcon} solid />
                    <View style={styles.notificationContent}>
                        <Image source={{ uri: imageUri }} style={styles.notificationAvatar} />
                        <Text style={styles.notificationText}>
                            <Text style={[styles.notificationBold, styles.username]}>@{username}</Text>さんがあなたの投稿をいいねしました
                        </Text>
                    </View>
                </View>

                <View style={styles.notification}>
                    <FontAwesome6 name="user-plus" size={18} color="#1d9bf0" style={styles.notificationIcon} />
                    <View style={styles.notificationContent}>
                        <Image source={{ uri: imageUri }} style={styles.notificationAvatar} />
                        <Text style={styles.notificationText}>
                            <Text style={[styles.notificationBold, styles.username]}>@{username}</Text>さんにフォローされました
                        </Text>
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
        borderBottomWidth: 1,
        borderBottomColor: '#eff3f4',
        backgroundColor: '#fff',
    },
    avatar: {
        width: 48, // Standard X avatar size in timeline
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    displayName: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#0f1419',
        marginRight: 4,
        fontFamily: 'Inter_700Bold',
    },
    username: {
        color: '#536471',
        fontSize: 15,
        fontFamily: 'Inter_400Regular',
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
        color: '#0f1419',
        marginBottom: 12,
        fontFamily: 'Inter_400Regular',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 40,
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
        borderBottomWidth: 1,
        borderBottomColor: '#eff3f4',
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#536471',
        padding: 12,
        backgroundColor: '#f7f9f9',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    profileHeader: {
        position: 'relative',
        height: 140,
    },
    coverPhoto: {
        width: '100%',
        height: 100,
        backgroundColor: '#cfd9de',
    },
    coverOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 16,
        borderWidth: 4,
        borderColor: '#fff',
        borderRadius: 44,
    },
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    editButtonContainer: {
        position: 'absolute',
        bottom: 8,
        right: 16,
    },
    editButton: {
        borderWidth: 1,
        borderColor: '#cfd9de',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0f1419',
    },
    profileInfo: {
        padding: 16,
        paddingTop: 12,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f1419',
        fontFamily: 'Inter_700Bold',
    },
    profileUsername: {
        fontSize: 15,
        color: '#536471',
        marginBottom: 12,
        fontFamily: 'Inter_400Regular',
    },
    bio: {
        fontSize: 15,
        lineHeight: 20,
        color: '#0f1419',
        marginBottom: 12,
    },
    profileStats: {
        flexDirection: 'row',
        gap: 20,
    },
    stat: {
        fontSize: 14,
    },
    statLabel: {
        color: '#536471',
    },
    statNumber: {
        fontWeight: 'bold',
        color: '#0f1419',
        fontFamily: 'Inter_700Bold',
    },

    // 通知セクション
    notificationSection: {
        backgroundColor: '#fff',
        marginTop: 0,
    },
    notification: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eff3f4',
        alignItems: 'flex-start',
    },
    notificationIcon: {
        marginRight: 12,
        width: 28,
        textAlign: 'center',
    },
    notificationContent: {
        flex: 1,
    },
    notificationAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginBottom: 8,
    },
    notificationText: {
        fontSize: 15,
        color: '#0f1419',
        fontFamily: 'Inter_400Regular',
        lineHeight: 20,
    },
    notificationBold: {
        fontWeight: 'bold',
        fontFamily: 'Inter_700Bold',
    },
});