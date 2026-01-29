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
      {/* ボタン */}
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.actionButton} onPress={addSingleImage}>
            <Feather name="camera" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>カメラ</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.actionButton} onPress={addLibraryImage}>
            <Feather name="image" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>ライブラリ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 画像リスト */}
      {images.length > 0 && (
        <View style={styles.imageListContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageList}
          >
            {images.map((img, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.imageItem,
                  selectedImageIndex === index && styles.imageItemSelected
                ]}
                onPress={() => selectImage(index)}
              >
                <Image source={{ uri: img }} style={styles.thumbnail} />
                {selectedImageIndex === index && (
                  <View style={styles.selectedBadge}>
                    <Feather name="check" size={12} color="#fff" />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeImage(index)}
                >
                  <Feather name="x" size={14} color="#fff" />
                </TouchableOpacity>
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
            placeholder="表示名を入力"
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

  return (
    <View style={styles.container}>
      {/* 画像がない場合は設定のみ表示 */}
      {images.length === 0 && (
        <ScrollView style={styles.noImageContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Icon Checker</Text>
          </View>
          {renderSettings()}
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

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Inter_700Bold',
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

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
  },

  imageListContainer: {
    marginBottom: 16,
  },
  imageList: {
    marginBottom: 8,
  },
  imageItem: {
    marginRight: 12,
    position: 'relative',
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageItemSelected: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    fontFamily: 'Inter_400Regular',
  },
  usernameInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
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
