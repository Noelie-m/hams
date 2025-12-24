# HAMS (Home Appliance Management System)

家中の家電を管理するためのシンプルなWebアプリケーションです。

## 特徴

- **完全クライアントサイド**: サーバー不要、ブラウザだけで動作
- **JSONファイル管理**: データはJSONファイルとして保存・読み込み
- **File System Access API**: ブラウザから直接ファイルを読み書き
- **シンプル構成**: HTML + CSS + JavaScriptのみ

## 構成

```
hams/
├── index.html     # メインUI
├── app.js         # アプリケーションロジック
└── style.css      # スタイル
```

## 必要な環境

- **ブラウザ**: Chrome、Edge、Opera (File System Access API対応)
- **サーバー**: 不要（静的HTMLとして開くだけ）

## 使い方

### 1. ファイルを開く

ブラウザで `index.html` を開きます。

```bash
# Chromeで開く例
open index.html
# または
google-chrome index.html
```

### 2. データファイルを用意

初回は「新規作成」ボタンをクリックして、`data.json` を作成します。

または、既存の `data.json` を「JSONファイルを開く」で読み込みます。

### データ構造

`data.json` の形式：

```json
{
  "appliances": [
    {
      "id": 1,
      "name": "冷蔵庫",
      "modelNumber": "ABC-123",
      "purchasedDate": "2023-01-15",
      "disposedDate": null,
      "price": 80000,
      "memo": "省エネタイプ",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "nextId": 2
}
```

## 機能

- ✅ 家電の追加・編集・削除
- ✅ JSONファイルの読み込み・保存
- ✅ 名称、型番、購入日、破棄日、参考価格、メモの管理
- ✅ レスポンシブデザイン

## 開発の経緯

当初はRails + Next.js + MySQL + Dockerという本格的な構成でしたが、機能の規模に対して過剰だったため、完全にシンプル化しました。

**Before**: Rails API + Next.js + MySQL + Docker Compose
**After**: HTML + CSS + JavaScript (File System Access API)

## メリット

1. **セットアップ不要**: ファイルを開くだけで動作
2. **依存関係ゼロ**: npm install、Docker、データベース不要
3. **軽量**: 合計数百行のコード
4. **データ移植性**: JSONファイルで簡単にバックアップ・共有可能
5. **カスタマイズ容易**: 純粋なJavaScriptなので改造が簡単

## 注意点

- File System Access APIはChrome系ブラウザのみ対応（Safari未対応）
- データは選択したJSONファイルに保存されます
- 複数人での同時編集には非対応
