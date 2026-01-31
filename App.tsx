import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, TextInput, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InstagramPreview from './components/InstagramPreview';
import XPreview from './components/XPreview';
import LinePreview from './components/LinePreview';
import Tab from './components/Tab';

import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ActivityIndicator } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['Instagram', 'X', 'LINE'];

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState(0);

  const [displayName, setDisplayName] = useState('あなたの名前');
  const [username, setUsername] = useState('your_username');

  const tabFlatListRef = useRef<FlatList>(null);

  // AsyncStorageから保存データを読み込み
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedDisplayName = await AsyncStorage.getItem('displayName');
        const savedUsername = await AsyncStorage.getItem('username');

        if (savedDisplayName !== null) {
          setDisplayName(savedDisplayName);
        }
        if (savedUsername !== null) {
          setUsername(savedUsername);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  const addSingleImage = async () => {
    try {
      // カメラの権限をリクエスト（必要な場合）
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("カメラへのアクセス許可が必要です。");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImages([...images, result.assets[0].uri]);
        setSelectedImageIndex(images.length);
      }
    } catch (error) {
      console.log('Error launching camera:', error);
    }
  };

  const addLibraryImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
      setSelectedImageIndex(images.length);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    if (selectedImageIndex >= newImages.length) {
      setSelectedImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const selectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    tabFlatListRef.current?.scrollToIndex({ index, animated: true });
  };

  // displayNameが変更されたら自動保存
  useEffect(() => {
    const saveDisplayName = async () => {
      try {
        await AsyncStorage.setItem('displayName', displayName);
      } catch (error) {
        console.error('Failed to save display name:', error);
      }
    };

    saveDisplayName();
  }, [displayName]);

  // usernameが変更されたら自動保存
  useEffect(() => {
    const saveUsername = async () => {
      try {
        await AsyncStorage.setItem('username', username);
      } catch (error) {
        console.error('Failed to save username:', error);
      }
    };

    saveUsername();
  }, [username]);

  const renderPreviewItemByTab = (imageUri: string, tabIndex: number) => {
    const props = {
      imageUri,
      displayName,
      username,
    };

    switch (tabIndex) {
      case 0:
        return <InstagramPreview {...props} />;
      case 1:
        return <XPreview {...props} />;
      case 2:
        return <LinePreview {...props} />;
      default:
        return null;
    }
  };

  // 設定コンポーネント（再利用）
  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <Text style={styles.settingsTitle}>プレビュー作成</Text>

      {/* ボタン */}
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.actionButton} onPress={addSingleImage}>
            <View style={styles.iconCircle}>
              <Feather name="camera" size={18} color="#007AFF" />
            </View>
            <Text style={styles.actionButtonText}>カメラ</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.actionButton} onPress={addLibraryImage}>
            <View style={styles.iconCircle}>
              <Feather name="image" size={18} color="#007AFF" />
            </View>
            <Text style={styles.actionButtonText}>ライブラリ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 画像リスト */}
      {images.length > 0 && (
        <View style={styles.imageListContainer}>
          <Text style={styles.label}>選択中の画像</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageList}
            contentContainerStyle={styles.imageListContent}
          >
            {images.map((img, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.imageItem,
                  selectedImageIndex === index && styles.imageItemSelectedActive
                ]}
                onPress={() => selectImage(index)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: img }} style={styles.thumbnail} />
                {selectedImageIndex === index ? (
                  <View style={styles.selectedIndicator}>
                    <Feather name="check" size={14} color="#fff" />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.deleteButtonSmall}
                    onPress={() => removeImage(index)}
                  >
                    <Feather name="x" size={12} color="#fff" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ユーザー情報入力 */}
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>表示名</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="あなたの名前を表示"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ユーザーID</Text>
          <View style={styles.usernameInput}>
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              style={[styles.input, styles.usernameField]}
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>
    </View>
  );

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 空状態のイラスト
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      {/* イラスト部分 */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationBg}>
          <View style={styles.mockPhone}>
            <View style={styles.mockPhoneScreen}>
              {/* SNSアイコンのモック */}
              <View style={styles.mockProfileRow}>
                <View style={styles.mockAvatar}>
                  <Feather name="user" size={24} color="#c0c0c0" />
                </View>
                <View style={styles.mockLines}>
                  <View style={styles.mockLine} />
                  <View style={[styles.mockLine, styles.mockLineShort]} />
                </View>
              </View>
              <View style={styles.mockPost} />
            </View>
          </View>
          {/* 装飾アイコン */}
          <View style={[styles.floatingIcon, styles.floatingIconInstagram]}>
            <Feather name="instagram" size={20} color="#E1306C" />
          </View>
          <View style={[styles.floatingIcon, styles.floatingIconX]}>
            <Feather name="twitter" size={20} color="#000" />
          </View>
          <View style={[styles.floatingIcon, styles.floatingIconLine]}>
            <Feather name="message-circle" size={20} color="#06C755" />
          </View>
        </View>
      </View>

      {/* テキスト */}
      <Text style={styles.emptyStateTitle}>SNSアイコンをチェック</Text>
      <Text style={styles.emptyStateDescription}>
        プロフィール画像がSNSでどう見えるか{'\n'}
        投稿前に確認できます
      </Text>

      {/* ボタン */}
      <View style={styles.emptyStateButtons}>
        <TouchableOpacity style={styles.primaryButton} onPress={addLibraryImage}>
          <Feather name="image" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>画像を選択</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={addSingleImage}>
          <Feather name="camera" size={20} color="#007AFF" />
          <Text style={styles.secondaryButtonText}>カメラで撮影</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 画像がない場合は空状態UI */}
      {images.length === 0 && (
        <ScrollView
          style={styles.noImageContainer}
          contentContainerStyle={styles.noImageContent}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Icon Checker</Text>
          </View>
          {renderEmptyState()}

          {/* ユーザー情報入力（折りたたみ風） */}
          <View style={styles.userInfoSection}>
            <Text style={styles.userInfoSectionTitle}>プロフィール設定</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>表示名</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="あなたの名前を表示"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ユーザーID</Text>
                <View style={styles.usernameInput}>
                  <Text style={styles.atSymbol}>@</Text>
                  <TextInput
                    style={[styles.input, styles.usernameField]}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="username"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* 画像がある場合はタブ + プレビュー */}
      {images.length > 0 && (
        <View style={styles.previewContainer}>
          {/* 縦スクロールで設定が自然に消える、タブは固定 */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[1]}
          >
            {/* 設定（スクロールで消える） */}
            {renderSettings()}

            {/* SNSタブ（スクロール時に上部に固定） */}
            <View style={styles.tabContainer}>
              <Tab
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </View>

            {/* プレビュー - 横スワイプでタブ切り替え */}
            <FlatList
              ref={tabFlatListRef}
              data={TABS}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                setActiveTab(index);
              }}
              renderItem={({ index: tabIndex }) => (
                <View style={styles.previewPage}>
                  <View style={styles.previewWrapper}>
                    {renderPreviewItemByTab(images[selectedImageIndex], tabIndex)}
                  </View>
                </View>
              )}
              getItemLayout={(_, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
            />
          </ScrollView>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // 画像がある時のメインコンテナ
  mainContainer: {
    flex: 1,
    paddingTop: 50,
  },

  // 画像がない時のコンテナ
  noImageContainer: {
    flex: 1,
    paddingTop: 50,
  },
  noImageContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // 空状態UI
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 32,
  },
  illustrationContainer: {
    marginBottom: 24,
  },
  illustrationBg: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mockPhone: {
    width: 100,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  mockPhoneScreen: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 8,
  },
  mockProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mockAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  mockLines: {
    flex: 1,
  },
  mockLine: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 4,
  },
  mockLineShort: {
    width: '60%',
  },
  mockPost: {
    flex: 1,
    backgroundColor: '#e8e8e8',
    borderRadius: 6,
  },
  floatingIcon: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingIconInstagram: {
    top: 20,
    right: 10,
  },
  floatingIconX: {
    bottom: 30,
    right: 0,
  },
  floatingIconLine: {
    bottom: 20,
    left: 10,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    fontFamily: 'Inter_400Regular',
  },
  emptyStateButtons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  userInfoSection: {
    marginTop: 8,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 16,
  },
  userInfoSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },

  // タブコンテナ（スクロール時に上部固定）
  tabContainer: {
    backgroundColor: '#fff',
    zIndex: 100,
  },

  // 設定コンテナ
  settingsContainer: {
    padding: 16,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },

  settingsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    marginBottom: 20,
    fontFamily: 'Inter_700Bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  buttonWrapper: {
    flex: 1,
  },
  actionButton: {
    flexDirection: 'column', // Stack icon and text
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // White buttons
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter_600SemiBold',
  },

  imageListContainer: {
    marginBottom: 24,
  },
  imageList: {
    marginTop: 12,
  },
  imageListContent: {
    paddingRight: 20,
  },
  imageItem: {
    marginRight: 16,
    position: 'relative',
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 3,
  },
  imageItemSelectedActive: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  deleteButtonSmall: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  inputContainer: {
    gap: 12,
  },
  inputGroup: {
    marginBottom: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    borderWidth: 0, // No border
    borderRadius: 12, // More rounded
    padding: 14, // More padding
    fontSize: 16,
    backgroundColor: '#f5f5f5', // Light gray background
    fontFamily: 'Inter_400Regular',
    color: '#1a1a1a',
  },
  usernameInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0, // No border
    borderRadius: 12,
    backgroundColor: '#f5f5f5', // Light gray background
    paddingHorizontal: 4,
  },
  atSymbol: {
    paddingLeft: 12,
    fontSize: 15,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  usernameField: {
    flex: 1,
    borderWidth: 0,
  },

  // プレビュー部分
  previewContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingTop: 50,
  },
  scrollContent: {
    flexGrow: 1,
  },
  previewScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  previewWrapper: {
    padding: 20,
  },
  previewPage: {
    width: SCREEN_WIDTH,
  },
});
