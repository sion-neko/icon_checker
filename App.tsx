import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, ScrollView, TextInput, Text, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import InstagramPreview from './components/InstagramPreview';
import XPreview from './components/XPreview';
import LinePreview from './components/LinePreview';
import Tab from './components/Tab';

export default function App() {
  // 複数の画像を配列で管理
  const [images, setImages] = useState<string[]>([]);
  // 現在選択中の画像のインデックス
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState(0);

  const [displayName, setDisplayName] = useState('あなたの名前');
  const [username, setUsername] = useState('your_username');

  // 画像を追加する関数
  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // 既存の配列に新しい画像を追加
      setImages([...images, result.assets[0].uri]);
      // 追加した画像を自動選択
      setSelectedImageIndex(images.length);
    }
  };

  // 画像を削除する関数
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    // 削除後の選択状態を調整
    if (selectedImageIndex >= newImages.length) {
      setSelectedImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const renderPreview = () => {
    // 画像が選択されていない場合
    if (images.length === 0) return null;

    const props = {
      imageUri: images[selectedImageIndex],
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
      <View style={styles.headerContainer}>
        <Button title="📷 画像を追加" onPress={addImage} />

        {/* 画像リスト表示 */}
        {images.length > 0 && (
          <View style={styles.imageListContainer}>
            <Text style={styles.sectionLabel}>選択した画像（{images.length}枚）</Text>
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
                  onPress={() => setSelectedImageIndex(index)}
                >
                  <Image source={{ uri: img }} style={styles.thumbnail} />
                  {/* 選択中の印 */}
                  {selectedImageIndex === index && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                  {/* 削除ボタン */}
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

        {/* ユーザー情報入力欄 */}
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

      {images.length > 0 && (
        <>
          <Tab
            tabs={['Instagram', 'X', 'LINE']}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {renderPreview()}
          </ScrollView>
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
  headerContainer: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },

  // 画像リスト
  imageListContainer: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },

  inputContainer: {
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
    fontSize: 16,
    color: '#666',
  },
  usernameField: {
    flex: 1,
    borderWidth: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
});