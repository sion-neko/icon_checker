import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, ScrollView, TextInput, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import InstagramPreview from './components/InstagramPreview';
import XPreview from './components/XPreview';
import LinePreview from './components/LinePreview';
import Tab from './components/Tab';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // ユーザー情報の状態管理
  const [displayName, setDisplayName] = useState('あなたの名前');
  const [username, setUsername] = useState('your_username');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const renderPreview = () => {
    if (!selectedImage) return null;

    // 各プレビューにユーザー情報を渡す
    const props = {
      imageUri: selectedImage,
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
        <Button title="画像を選択" onPress={pickImage} />

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

      {selectedImage && (
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