import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, TextInput, Text, TouchableOpacity, FlatList, Dimensions, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { Animated as RNAnimated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import InstagramPreview from './components/InstagramPreview';
import XPreview from './components/XPreview';
import LinePreview from './components/LinePreview';
import Tab from './components/Tab';
import ReorderableImageList from './components/ReorderableImageList';

import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ActivityIndicator } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['Instagram', 'X', 'LINE'];

// 選んだ画像の保存先。ImagePickerの返すファイルはキャッシュでOSに消されうるので、ここにコピーして残す
const ICON_DIR = new Directory(Paths.document, 'icons');

// アプリ更新でドキュメントディレクトリの絶対パスが変わることがあるため、保存するのはファイル名だけ
const saveImageNames = async (uris: string[]) => {
  const names = uris.map((uri) => new File(uri).name);
  await AsyncStorage.setItem('imageNames', JSON.stringify(names));
};

const loadImageUris = async (): Promise<string[]> => {
  const saved = await AsyncStorage.getItem('imageNames');
  if (saved === null) return [];
  const names: string[] = JSON.parse(saved);
  return names
    .map((name) => new File(ICON_DIR, name))
    .filter((file) => file.exists)
    .map((file) => file.uri);
};

const copyToIconDir = async (uri: string): Promise<string> => {
  ICON_DIR.create({ idempotent: true, intermediates: true });
  const source = new File(uri);
  const destination = new File(ICON_DIR, `${Date.now()}${source.extension}`);
  await source.copy(destination);
  return destination.uri;
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState(0);
  // 各タブのプレビューの実際の高さ（横並びの行が一番高いページに揃うのを防ぐため）
  const [pageHeights, setPageHeights] = useState<number[]>([]);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const [displayName, setDisplayName] = useState('あなたの名前');
  const [username, setUsername] = useState('your_username');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isNameEditorOpen, setIsNameEditorOpen] = useState(false);

  const tabFlatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new RNAnimated.Value(0)).current;

  // AsyncStorageから保存データを読み込み
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedDisplayName = await AsyncStorage.getItem('displayName');
        const savedUsername = await AsyncStorage.getItem('username');
        const savedImages = await loadImageUris();
        const savedSelectedIndex = await AsyncStorage.getItem('selectedImageIndex');

        if (savedDisplayName !== null) {
          setDisplayName(savedDisplayName);
        }
        if (savedUsername !== null) {
          setUsername(savedUsername);
        }
        setImages(savedImages);
        if (savedSelectedIndex !== null) {
          setSelectedImageIndex(
            Math.min(Number(savedSelectedIndex), Math.max(0, savedImages.length - 1))
          );
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        // 読み込み完了後にフラグを立てる（エラー時も含む）
        setIsDataLoaded(true);
      }
    };

    loadUserData();
  }, []);

  const addLibraryImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      let uri = result.assets[0].uri;
      try {
        uri = await copyToIconDir(uri);
      } catch (error) {
        // 保存に失敗しても今回のプレビューはできるよう、元の画像のまま使う
        console.error('Failed to save image:', error);
      }
      setImages([...images, uri]);
      setSelectedImageIndex(images.length);
    }
  };

  const removeImage = (index: number) => {
    try {
      const file = new File(images[index]);
      if (file.uri.startsWith(ICON_DIR.uri) && file.exists) {
        file.delete();
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }

    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    if (selectedImageIndex >= newImages.length) {
      setSelectedImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const selectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  // 並べ替えても選択中の画像が変わらないよう、選択位置も追従させる
  const reorderImages = (from: number, to: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(from, 1);
    newImages.splice(to, 0, moved);
    setImages(newImages);

    setSelectedImageIndex((selected) => {
      if (selected === from) return to;
      if (from < selected && selected <= to) return selected - 1;
      if (to <= selected && selected < from) return selected + 1;
      return selected;
    });
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    tabFlatListRef.current?.scrollToIndex({ index, animated: true });
  };

  // displayNameが変更されたら自動保存（読み込み完了後のみ）
  useEffect(() => {
    if (!isDataLoaded) return; // 読み込み完了前は保存しない

    const saveDisplayName = async () => {
      try {
        await AsyncStorage.setItem('displayName', displayName);
      } catch (error) {
        console.error('Failed to save display name:', error);
      }
    };

    saveDisplayName();
  }, [displayName, isDataLoaded]);

  // usernameが変更されたら自動保存（読み込み完了後のみ）
  useEffect(() => {
    if (!isDataLoaded) return; // 読み込み完了前は保存しない

    const saveUsername = async () => {
      try {
        await AsyncStorage.setItem('username', username);
      } catch (error) {
        console.error('Failed to save username:', error);
      }
    };

    saveUsername();
  }, [username, isDataLoaded]);

  // 画像リストと選択位置も保存し、次回起動時に前回の状態から始める
  useEffect(() => {
    if (!isDataLoaded) return;
    saveImageNames(images).catch((error) => console.error('Failed to save images:', error));
  }, [images, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    AsyncStorage.setItem('selectedImageIndex', String(selectedImageIndex)).catch((error) =>
      console.error('Failed to save selected image:', error)
    );
  }, [selectedImageIndex, isDataLoaded]);

  const renderPreviewItemByTab = (imageUri: string | null, tabIndex: number) => {
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

  const handlePageLayout = (tabIndex: number, height: number) => {
    setPageHeights((prev) => {
      if (prev[tabIndex] === height) return prev;
      const next = [...prev];
      next[tabIndex] = height;
      return next;
    });
  };

  // スワイプ中は一番高いページに合わせ、止まったら表示中タブの高さにする
  const previewHeight = isSwiping
    ? Math.max(0, ...pageHeights.filter(Boolean))
    : pageHeights[activeTab];

  // 表示名・ユーザーIDの入力欄（名前編集シートの中身）
  const renderNameInputs = () => (
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
  );

  // 設定コンポーネント（再利用）
  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>IconChecker</Text>
        <TouchableOpacity
          style={styles.nameChip}
          onPress={() => setIsNameEditorOpen(true)}
          accessibilityLabel="表示名とユーザーIDを編集"
        >
          <View style={styles.nameChipText}>
            <Text style={styles.nameChipName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.nameChipId} numberOfLines={1}>@{username}</Text>
          </View>
          <View style={styles.nameChipIcon}>
            <Feather name="edit-2" size={13} color="#3f3f46" />
          </View>
        </TouchableOpacity>
      </View>

      {/* 画像リスト */}
      <ReorderableImageList
        images={images}
        selectedIndex={selectedImageIndex}
        onSelect={selectImage}
        onRemove={removeImage}
        onAdd={addLibraryImage}
        onReorder={reorderImages}
        onDraggingChange={setIsDraggingImage}
      />
    </View>
  );

  // 保存データの読み込み前に空の状態がチラつかないよう、読み込み完了まで待つ
  if (!fontsLoaded || !isDataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* タブ + プレビュー（画像未選択でもプレースホルダーのアイコンで表示する） */}
      <View style={styles.previewContainer}>
        {/* 縦スクロールで設定が自然に消える、タブは固定 */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          scrollEnabled={!isDraggingImage}
        >
          {/* 設定（スクロールで消える） */}
          {renderSettings()}

          {/* SNSタブ（スクロール時に上部に固定） */}
          <View style={styles.tabContainer}>
            <Tab
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              scrollX={scrollX}
            />
          </View>

          {/* プレビュー - 横スワイプでタブ切り替え */}
          <RNAnimated.FlatList
            ref={tabFlatListRef}
            data={TABS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            style={previewHeight ? { height: previewHeight } : undefined}
            scrollEventThrottle={16}
            onScroll={RNAnimated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            onScrollBeginDrag={() => setIsSwiping(true)}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setActiveTab(index);
              setIsSwiping(false);
            }}
            renderItem={({ index: tabIndex }) => (
              <View style={styles.previewPage}>
                {/* ページ自体は行の高さ(一番高いページ)に引き伸ばされるので、中身側で測る */}
                <View
                  style={styles.previewWrapper}
                  onLayout={(e) => handlePageLayout(tabIndex, e.nativeEvent.layout.height)}
                >
                  {renderPreviewItemByTab(images[selectedImageIndex] ?? null, tabIndex)}
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

      {/* 表示名・ユーザーIDの編集シート */}
      <Modal
        visible={isNameEditorOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsNameEditorOpen(false)}
      >
        <View style={styles.nameEditor}>
          <View style={styles.nameEditorHeader}>
            <Text style={styles.nameEditorTitle}>名前とID</Text>
            <TouchableOpacity onPress={() => setIsNameEditorOpen(false)} hitSlop={12}>
              <Text style={styles.nameEditorDone}>完了</Text>
            </TouchableOpacity>
          </View>
          {renderNameInputs()}
        </View>
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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

  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    fontFamily: 'Inter_700Bold',
  },
  nameChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    minHeight: 44,
    paddingVertical: 4,
    paddingLeft: 14,
    paddingRight: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    backgroundColor: '#fff',
  },
  nameChipText: {
    flexShrink: 1,
  },
  nameChipName: {
    fontSize: 13,
    color: '#111',
    fontFamily: 'Inter_700Bold',
  },
  nameChipId: {
    fontSize: 11,
    color: '#52525b',
    fontFamily: 'Inter_400Regular',
  },
  nameChipIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f4f4f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameEditor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  nameEditorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  nameEditorTitle: {
    fontSize: 17,
    color: '#111',
    fontFamily: 'Inter_700Bold',
  },
  nameEditorDone: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Inter_600SemiBold',
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
  previewWrapper: {
    padding: 20,
  },
  previewPage: {
    width: SCREEN_WIDTH,
  },
});
