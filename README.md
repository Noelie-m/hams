# HAMS (Home Appliance Management System)

家中の家電を管理するためのアプリケーションです。

## 構成
- **Backend:** Ruby on Rails 7.1 (API Mode)
- **Frontend:** Next.js 14+ (App Router, Tailwind CSS)
- **Database:** MySQL 8.0
- **Infrastructure:** Docker Compose

## 起動方法
以下のコマンドで全てのコンテナを起動します。

```bash
docker-compose up --build
```

起動後、以下のURLにアクセスできます：
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)

## 初回セットアップ
データベースの作成とマイグレーションが必要です（コンテナ起動後）。

```bash
docker-compose exec backend rails db:create db:migrate
```

## ロジックの変更
- バックエンドのロジックは `backend/app` 配下にあります。
- フロントエンドの画面構成は `frontend/src/app` 配下にあります。
