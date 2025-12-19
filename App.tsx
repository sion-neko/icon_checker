import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, ScrollView, TextInput, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
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

  // ヘッダーの開閉状態
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);

  const flatListRef = useRef<FlatList>(null);

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
    flatListRef.current?.scrollToIndex({ index, animated: true });
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

  const renderPreviewItem = (imageUri: string) => {
    const props = {
      imageUri,
      displayName,
      username,
    };

    switch (activeTab) {
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

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* コンパクトヘッダー */}
      <View style={styles.compactHeader}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsHeaderExpanded(!isHeaderExpanded)}
        >
          <Feather
            name={isHeaderExpanded ? 'chevron-down' : 'chevron-right'}
            size={20}
            color="#007AFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.toggleText}>
            {isHeaderExpanded ? '設定を閉じる' : '設定を開く'}
          </Text>
        </TouchableOpacity>

        {/* 画像数表示 */}
        {images.length > 0 && (
          <Text style={styles.imageCount}>
            {selectedImageIndex + 1}/{images.length}
          </Text>
        )}
      </View>

      {/* 展開可能なヘッダー */}
      {isHeaderExpanded && (
        <View style={styles.expandedHeader}>
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
      )
      }

      {/* タブとプレビュー */}
      {
        images.length > 0 && (
          <>
            <Tab
              tabs={['Instagram', 'X', 'LINE']}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                setSelectedImageIndex(index);
              }}
              renderItem={({ item }) => (
                <View style={styles.previewContainer}>
                  <ScrollView contentContainerStyle={styles.scrollContent}>
                    {renderPreviewItem(item)}
                  </ScrollView>
                </View>
              )}
              getItemLayout={(data, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
            />
          </>
        )
      }

      <StatusBar style="auto" />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // コンパクトヘッダー
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 100,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  toggleIcon: {
    fontSize: 14,
    marginRight: 8,
    color: '#007AFF',
  },
  toggleText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  imageCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Inter_600SemiBold',
  },

  // 展開ヘッダー
  expandedHeader: {
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
    backgroundColor: '#007AFF', // iOS Blue
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
    right: -6, // Checkmark on top-right is more common for selection
    left: 'auto',
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
  selectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: '#FF3B30', // Red for delete
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  },
  scrollContent: {
    padding: 20,
  },
});