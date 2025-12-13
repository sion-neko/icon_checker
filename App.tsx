import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, ScrollView, TextInput, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import InstagramPreview from './components/InstagramPreview';
import XPreview from './components/XPreview';
import LinePreview from './components/LinePreview';
import Tab from './components/Tab';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState(0);

  const [displayName, setDisplayName] = useState('あなたの名前');
  const [username, setUsername] = useState('your_username');

  // ヘッダーの開閉状態
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  const addSingleImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
      setSelectedImageIndex(images.length);
    }
  };

  const addMultipleImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImageUris = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImageUris]);
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

  return (
    <View style={styles.container}>
      {/* コンパクトヘッダー */}
      <View style={styles.compactHeader}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsHeaderExpanded(!isHeaderExpanded)}
        >
          <Text style={styles.toggleIcon}>
            {isHeaderExpanded ? '▼' : '▶'}
          </Text>
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
              <Button title="📷 1枚追加" onPress={addSingleImage} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="📷 複数追加" onPress={addMultipleImages} />
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
                        <Text style={styles.selectedBadgeText}>✓</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.deleteButtonText}>×</Text>
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
      )}

      {/* タブとプレビュー */}
      {images.length > 0 && (
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
    borderBottomColor: '#e5e5e5',
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
  },
  imageCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  // 展開ヘッダー
  expandedHeader: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  buttonWrapper: {
    flex: 1,
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
    borderRadius: 12,
  },
  imageItemSelected: {
    borderColor: '#007AFF',
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
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