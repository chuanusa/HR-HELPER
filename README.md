# HR 小幫手 (HR Helper)

HR Helper 是一個現代化的工具，旨在協助處理人力資源任務，包括幸運抽獎和自動分組管理。

## 專案設定

### 前置需求

- Node.js (建議使用第 20 版或更高版本)
- npm (Node 套件管理器)

### 安裝步驟

1. 複製 (Clone) 此專案：
   ```sh
   git clone <repository-url>
   cd HR-HELPER
   ```

2. 安裝依賴套件：
   ```sh
   npm install
   ```

## 使用說明

### 開發模式

啟動本地開發伺服器：

```sh
npm run dev
```

應用程式將在 `http://localhost:3000` (或類似網址) 上可用。

### 生產環境建置 (Build)

若要建置生產環境版本的應用程式：

```sh
npm run build
```

建置產物將位於 `dist/` 目錄中。

### 預覽生產環境

若要在本地預覽生產環境版本：

```sh
npm run preview
```

## 部署

本專案已設定使用 GitHub Actions 自動部署至 GitHub Pages。

- **觸發條件**: 推送 (Push) 至 `main` 分支。
- **工作流程檔案**: `.github/workflows/deploy.yml`

在第一次部署成功後，請確保在您的 GitHub Repository 設定中，將 GitHub Pages 的來源設定為 `gh-pages` 分支。

## 使用技術

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
