import React from 'react';
import { View, Image, Text, StyleSheet, ImageBackground } from 'react-native';

interface Props {
    imageUri: string;
    displayName: string;
    username: string;
}

export default function LinePreview({ imageUri, displayName, username }: Props) {
    return (
        <View style={styles.container}>
            {/* プロフィール画面 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>プロフィール</Text>
                <View style={styles.profileCard}>
                    <View style={styles.profileBanner}>
                        <View style={styles.bannerOverlay} />
                    </View>
                    <View style={styles.profileHeader}>
                        <View style={styles.lineAvatarContainer}>
                            <Image source={{ uri: imageUri }} style={styles.profileAvatar} />
                        </View>
                        <Text style={styles.profileName}>{displayName}</Text>
                        <Text style={styles.statusMessage}>ステータスメッセージを設定しましょう</Text>
                    </View>
                </View>
            </View>

            {/* トークリスト */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>トークリスト</Text>
                <View style={styles.chatList}>
                    {/* 友達1 */}
                    <View style={styles.chatItem}>
                        <Image source={{ uri: imageUri }} style={styles.avatar} />
                        <View style={styles.chatContent}>
                            <View style={styles.chatHeader}>
                                <Text style={styles.chatName}>{displayName}</Text>
                                <Text style={styles.time}>12:34</Text>
                            </View>
                            <Text style={styles.lastMessage} numberOfLines={1}>
                                最新のメッセージがここに表示されます
                            </Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>3</Text>
                        </View>
                    </View>

                    {/* 友達2（比較用） */}
                    <View style={styles.chatItem}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarPlaceholderText}>友</Text>
                        </View>
                        <View style={styles.chatContent}>
                            <View style={styles.chatHeader}>
                                <Text style={styles.chatName}>友達の名前</Text>
                                <Text style={styles.time}>昨日</Text>
                            </View>
                            <Text style={styles.lastMessage} numberOfLines={1}>
                                了解した！またね。
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* トーク画面 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>トーク画面</Text>
                <View style={styles.chatRoom}>
                    {/* 日付 */}
                    <View style={styles.dateSeparator}>
                        <Text style={styles.dateText}>2024年12月13日(金)</Text>
                    </View>

                    {/* 相手のメッセージ */}
                    <View style={styles.messageGroup}>
                        <Image source={{ uri: imageUri }} style={styles.messageAvatar} />
                        <View style={styles.messagesColumn}>
                            <Text style={styles.messageSenderName}>{displayName}</Text>
                            <View style={styles.messageRow}>
                                <View style={styles.messageBubbleOther}>
                                    <Text style={styles.messageText}>アイコン変えた？いい感じ！</Text>
                                </View>
                                <Text style={styles.messageTime}>12:30</Text>
                            </View>
                        </View>
                    </View>

                    {/* 自分のメッセージ */}
                    <View style={styles.messageGroupMe}>
                        <View style={styles.messagesColumnMe}>
                            <View style={styles.messageRowMe}>
                                <Text style={styles.messageReadMe}>既読</Text>
                                <Text style={styles.messageTimeMe}>12:34</Text>
                                <View style={styles.messageBubbleMe}>
                                    <Text style={styles.messageTextMe}>
                                        ありがとー！
                                    </Text>
                                </View>
                            </View>
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8e8e93',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // トークリスト
    chatList: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 12,
        overflow: 'hidden',
    },
    chatItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f8f8f8',
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 22, // LINE avatars are slightly less rounded than perfect circles in some views
        marginRight: 12,
    },
    avatarPlaceholder: {
        width: 54,
        height: 54,
        borderRadius: 22,
        marginRight: 12,
        backgroundColor: '#e2e2e2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatContent: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    chatName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#111',
        fontFamily: 'Inter_600SemiBold',
    },
    time: {
        color: '#a1a1a1',
        fontSize: 11,
    },
    lastMessage: {
        color: '#666',
        fontSize: 13,
    },
    badge: {
        backgroundColor: '#06c755',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },

    // トーク画面
    chatRoom: {
        backgroundColor: '#85a2b3',
        padding: 16,
        borderRadius: 12,
        minHeight: 320,
    },
    dateSeparator: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dateText: {
        backgroundColor: 'rgba(0,0,0,0.15)',
        color: '#fff',
        fontSize: 11,
        paddingHorizontal: 12,
        paddingVertical: 3,
        borderRadius: 10,
    },
    messageGroup: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    messageAvatar: {
        width: 40,
        height: 40,
        borderRadius: 16,
        marginRight: 8,
    },
    messagesColumn: {
        maxWidth: '75%',
    },
    messageSenderName: {
        fontSize: 12,
        color: '#fff',
        marginBottom: 4,
        marginLeft: 2,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    messageRowMe: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    messageBubbleOther: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 14,
        borderTopLeftRadius: 2,
    },
    messageText: {
        fontSize: 15,
        color: '#000',
        fontFamily: 'Inter_400Regular',
    },
    messageTime: {
        fontSize: 10,
        color: '#fff',
        marginLeft: 6,
        marginBottom: 2,
    },
    messageGroupMe: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 16,
    },
    messagesColumnMe: {
        maxWidth: '75%',
    },
    messageBubbleMe: {
        backgroundColor: '#62dc7c',
        padding: 10,
        borderRadius: 14,
        borderTopRightRadius: 2,
    },
    messageTextMe: {
        fontSize: 15,
        color: '#000',
        fontFamily: 'Inter_400Regular',
    },
    messageTimeMe: {
        fontSize: 10,
        color: '#fff',
        marginRight: 6,
        marginBottom: 2,
    },
    messageReadMe: {
        fontSize: 10,
        color: '#fff',
        marginRight: 4,
        marginBottom: 2,
    },

    // プロフィール
    profileCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 16,
        overflow: 'hidden',
    },
    profileBanner: {
        height: 120,
        backgroundColor: '#a0a0a0',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    profileHeader: {
        alignItems: 'center',
        paddingBottom: 24,
        marginTop: -40,
    },
    lineAvatarContainer: {
        padding: 3,
        backgroundColor: '#fff',
        borderRadius: 44,
        marginBottom: 12,
    },
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 36,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 6,
        fontFamily: 'Inter_700Bold',
    },
    statusMessage: {
        fontSize: 13,
        color: '#8e8e93',
        paddingHorizontal: 20,
        textAlign: 'center',
    },
});
