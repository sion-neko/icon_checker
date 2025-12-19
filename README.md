# IconChecker

SNSアイコンのプレビューを確認できるReact Nativeアプリケーションです。Instagram、X（旧Twitter）、LINEなど複数のSNSでアイコンがどのように表示されるかを確認できます。

## 機能

- 複数の画像を選択してプレビュー
- Instagram、X、LINEのアイコン表示をシミュレート
- 表示名とユーザーIDのカスタマイズ
- スワイプで画像を切り替え
- 設定パネルの開閉機能

## セットアップ手順

### 前提条件

以下のツールがインストールされている必要があります：

- [Node.js](https://nodejs.org/)（推奨バージョン: 18.x以上）
- npm（Node.jsに同梱）

### モバイル実機またはエミュレータの準備

#### iOS（macOSのみ）
- Xcode をインストール
- iOS Simulator を起動可能にする

#### Android
- [Android Studio](https://developer.android.com/studio) をインストール
- Android エミュレータを設定、または実機をUSB接続

#### Expo Goアプリ（推奨）
実機で簡単に動作確認するには、以下のアプリをインストール：
- iOS: [App Store](https://apps.apple.com/jp/app/expo-go/id982107779)からExpo Goをインストール
- Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)からExpo Goをインストール

### インストール手順

1. **リポジトリをクローン**（または既存のプロジェクトディレクトリに移動）

```bash
cd icon-checker
```

2. **依存パッケージをインストール**

```bash
npm install
```

3. **開発サーバーを起動**

```bash
npm start
```

または、特定のプラットフォーム向けに起動：

```bash
# Android向け
npm run android

# iOS向け（macOSのみ）
npm run ios

# Web向け
npm run web
```

4. **アプリを実機で起動**

`npm start` を実行すると、ターミナルにQRコードが表示されます。

- **iOS**: カメラアプリでQRコードをスキャン
- **Android**: Expo Goアプリ内のスキャナーでQRコードをスキャン

エミュレータを使用する場合は、開発サーバー起動後に表示されるメニューから以下を選択：
- `a` - Android エミュレータで開く
- `i` - iOS シミュレータで開く

## 使い方

1. **画像を追加**
   - 「📷 1枚追加」ボタン: 1枚の画像を編集して追加
   - 「📷 複数追加」ボタン: 複数の画像をまとめて追加

2. **プレビューを確認**
   - タブを切り替えてInstagram、X、LINEでの表示を確認
   - スワイプで別の画像に切り替え
   - サムネイルをタップして画像を選択

3. **表示名とユーザーIDを変更**
   - 設定パネルで表示名とユーザーIDを入力
   - プレビューにリアルタイムで反映

4. **設定パネルの開閉**
   - 「設定を閉じる/開く」ボタンでパネルを折りたたみ可能

## プロジェクト構成

```
icon-checker/
├── App.tsx              # メインアプリケーション
├── components/          # コンポーネント
│   ├── InstagramPreview.tsx
│   ├── XPreview.tsx
│   ├── LinePreview.tsx
│   └── Tab.tsx
├── assets/              # アイコンや画像
├── app.json            # Expo設定
├── package.json        # 依存関係
└── tsconfig.json       # TypeScript設定
```

## 技術スタック

- **フレームワーク**: Expo SDK 54
- **UI**: React Native
- **言語**: TypeScript
- **画像選択**: expo-image-picker

## トラブルシューティング

### ポートが使用中のエラー
別のプロセスがポートを使用している場合、開発サーバーが起動しないことがあります。その場合は以下を実行：

```bash
npx expo start --clear
```

### キャッシュをクリア

```bash
npx expo start -c
```

### node_modulesを再インストール

```bash
rm -rf node_modules package-lock.json
npm install
```

## ライセンス

Private
