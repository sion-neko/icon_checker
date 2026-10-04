import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
                <View style={styles.storiesRow}>
                    {/* 自分のストーリーズ */}
                    <View style={styles.storyItem}>
                        <LinearGradient
                            colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.storyRing}
                        >
                            <View style={styles.storyInnerRing}>
                                <Image source={{ uri: imageUri }} style={styles.storyAvatar} />
                            </View>
                        </LinearGradient>
                        <Text style={styles.storyName}>{displayName}</Text>
                    </View>

                    {/* 友達のストーリーズ */}
                    <View style={styles.storyItem}>
                        <LinearGradient
                            colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.storyRing}
                        >
                            <View style={styles.storyInnerRing}>
                                <View style={[styles.storyAvatar, styles.storyPlaceholder, { backgroundColor: '#d4a5e5' }]}>
                                    <Text style={styles.storyPlaceholderText}>友</Text>
                                </View>
                            </View>
                        </LinearGradient>
                        <Text style={styles.storyName}>友達</Text>
                    </View>

                    <View style={styles.storyItem}>
                        <LinearGradient
                            colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.storyRing}
                        >
                            <View style={styles.storyInnerRing}>
                                <View style={[styles.storyAvatar, styles.storyPlaceholder, { backgroundColor: '#a5d4e5' }]}>
                                    <Text style={styles.storyPlaceholderText}>友</Text>
                                </View>
                            </View>
                        </LinearGradient>
                        <Text style={styles.storyName}>友達2</Text>
                    </View>
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

            {/* 2番目の投稿 */}
            <View style={styles.post}>
                <View style={styles.header}>
                    <Image source={{ uri: imageUri }} style={styles.avatar} />
                    <View style={styles.headerText}>
                        <Text style={styles.username}>{username}</Text>
                        <Text style={styles.location}>Osaka, Japan</Text>
                    </View>
                    <Feather name="more-horizontal" size={24} color="black" />
                </View>

                <Image
                    source={{ uri: 'https://picsum.photos/seed/post2/400/400' }}
                    style={styles.postImage}
                />

                <View style={styles.actions}>
                    <View style={styles.leftActions}>
                        <Ionicons name="heart-outline" size={28} color="black" style={styles.actionIcon} />
                        <Ionicons name="chatbubble-outline" size={26} color="black" style={styles.actionIcon} />
                        <Ionicons name="paper-plane-outline" size={26} color="black" style={styles.actionIcon} />
                    </View>
                    <Ionicons name="bookmark-outline" size={26} color="black" />
                </View>

                <Text style={styles.likes}>891 likes</Text>

                <View style={styles.caption}>
                    <Text>
                        <Text style={styles.username}>{username} </Text>
                        <Text style={styles.captionText}>
                            週末のお菓子タイム 🍰☕ #weekend #snack
                        </Text>
                    </Text>
                </View>

                <Text style={styles.viewComments}>View all 18 comments</Text>
                <Text style={styles.timestamp}>5 HOURS AGO</Text>
            </View>

            {/* 3番目の投稿 */}
            <View style={styles.post}>
                <View style={styles.header}>
                    <Image source={{ uri: imageUri }} style={styles.avatar} />
                    <View style={styles.headerText}>
                        <Text style={styles.username}>{username}</Text>
                        <Text style={styles.location}>Shibuya, Tokyo</Text>
                    </View>
                    <Feather name="more-horizontal" size={24} color="black" />
                </View>

                <Image
                    source={{ uri: 'https://picsum.photos/seed/post3/400/400' }}
                    style={styles.postImage}
                />

                <View style={styles.actions}>
                    <View style={styles.leftActions}>
                        <Ionicons name="heart-outline" size={28} color="black" style={styles.actionIcon} />
                        <Ionicons name="chatbubble-outline" size={26} color="black" style={styles.actionIcon} />
                        <Ionicons name="paper-plane-outline" size={26} color="black" style={styles.actionIcon} />
                    </View>
                    <Ionicons name="bookmark-outline" size={26} color="black" />
                </View>

                <Text style={styles.likes}>2,105 likes</Text>

                <View style={styles.caption}>
                    <Text>
                        <Text style={styles.username}>{username} </Text>
                        <Text style={styles.captionText}>
                            新しい場所を発見した 📍 #explore #tokyo
                        </Text>
                    </Text>
                </View>

                <Text style={styles.viewComments}>View all 56 comments</Text>
                <Text style={styles.timestamp}>1 DAY AGO</Text>
            </View>
        </View>
    );
}

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
    storiesRow: {
        flexDirection: 'row',
        gap: 12,
    },
    storyItem: {
        alignItems: 'center',
        width: 80,
    },
    storyRing: {
        padding: 2, // Gradient width
        width: 72,
        height: 72,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 36,
    },
    storyInnerRing: {
        padding: 3, // White gap
        backgroundColor: '#fff',
        borderRadius: 34,
    },
    storyAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 0,
    },
    avatarPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    storyPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    storyPlaceholderText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    storyName: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
        fontFamily: 'Inter_400Regular',
    },
});
