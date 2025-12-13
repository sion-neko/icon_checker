import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface Props {
    imageUri: string;
    displayName: string;
    username: string;
}

export default function LinePreview({ imageUri, displayName, username }: Props) {
    return (
        <View style={styles.container}>
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
                                了解！
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
                        <Text style={styles.dateText}>2024年12月13日</Text>
                    </View>

                    {/* 相手のメッセージ */}
                    <View style={styles.messageGroup}>
                        <Image source={{ uri: imageUri }} style={styles.messageAvatar} />
                        <View style={styles.messagesColumn}>
                            <View style={styles.messageBubbleOther}>
                                <Text style={styles.messageText}>こんにちは！</Text>
                            </View>
                            <View style={styles.messageBubbleOther}>
                                <Text style={styles.messageText}>
                                    アイコン変えたんだね✨{'\n'}
                                    いい感じ！
                                </Text>
                            </View>
                            <Text style={styles.messageTime}>12:30</Text>
                        </View>
                    </View>

                    {/* 自分のメッセージ */}
                    <View style={styles.messageGroupMe}>
                        <View style={styles.messagesColumnMe}>
                            <View style={styles.messageBubbleMe}>
                                <Text style={styles.messageTextMe}>ありがとう！</Text>
                            </View>
                            <View style={styles.messageBubbleMe}>
                                <Text style={styles.messageTextMe}>
                                    どう見えるか気になってたんだ
                                </Text>
                            </View>
                            <Text style={styles.messageTimeMe}>12:34</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* プロフィール画面 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>プロフィール</Text>
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <Image source={{ uri: imageUri }} style={styles.profileAvatar} />
                        <Text style={styles.profileName}>{displayName}</Text>
                        <Text style={styles.statusMessage}>ステータスメッセージ</Text>
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
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        marginBottom: 8,
        textTransform: 'uppercase',
    },

    // トークリスト
    chatList: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 8,
    },
    chatItem: {
        flexDirection: 'row',
        padding: 14,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#b4b4b4',
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
        marginBottom: 4,
    },
    chatName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    time: {
        color: '#999',
        fontSize: 12,
    },
    lastMessage: {
        color: '#666',
        fontSize: 14,
    },
    badge: {
        backgroundColor: '#06c755',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // トーク画面
    chatRoom: {
        backgroundColor: '#7da3af',
        padding: 16,
        borderRadius: 8,
        minHeight: 300,
    },
    dateSeparator: {
        alignItems: 'center',
        marginBottom: 16,
    },
    dateText: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        color: '#fff',
        fontSize: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    messageGroup: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    messageAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    messagesColumn: {
        maxWidth: '70%',
    },
    messageBubbleOther: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 12,
        marginBottom: 4,
        borderBottomLeftRadius: 0,
    },
    messageText: {
        fontSize: 15,
        color: '#000',
    },
    messageTime: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    messageGroupMe: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 16,
    },
    messagesColumnMe: {
        maxWidth: '70%',
        alignItems: 'flex-end',
    },
    messageBubbleMe: {
        backgroundColor: '#06c755',
        padding: 10,
        borderRadius: 12,
        marginBottom: 4,
        borderBottomRightRadius: 0,
    },
    messageTextMe: {
        fontSize: 15,
        color: '#fff',
    },
    messageTimeMe: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },

    // プロフィール
    profileCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 8,
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
    },
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statusMessage: {
        fontSize: 14,
        color: '#666',
    },
});