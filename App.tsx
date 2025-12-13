import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import InstagramPreview from './components/InstagramPreview';
import XPreview from './components/XPreview';
import LinePreview from './components/LinePreview';
import Tab from './components/Tab';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);  // アクティブなタブ（0=Instagram, 1=X, 2=LINE）

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

  // アクティブなタブに応じてプレビューを切り替え
  const renderPreview = () => {
    if (!selectedImage) return null;

    switch (activeTab) {
      case 0:
        return <InstagramPreview imageUri={selectedImage} />;
      case 1:
        return <XPreview imageUri={selectedImage} />;
      case 2:
        return <LinePreview imageUri={selectedImage} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="画像を選択" onPress={pickImage} />
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
  buttonContainer: {
    padding: 20,
    paddingTop: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
});