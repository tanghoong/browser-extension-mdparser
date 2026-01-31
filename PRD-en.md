# Product Requirements Document (PRD)

## Product Name

browser-extension-mdparser

## Product Vision

讓使用者在瀏覽器中「零操作」直接觀看 Markdown（MD）內容。不論來源是 http(s) 網頁或本機 file:// 路徑，只要偵測到內容或連結為 Markdown，即自動解析並以高可讀性的格式渲染，包括標題層級、字體大小、顏色，以及 Mermaid 圖表。

核心價值：自動（Automatic）、即時（Instant）、無侵入（Non‑intrusive）。

---

## Problem Statement

目前在瀏覽器中查看 Markdown 常見痛點：

* 瀏覽器預設僅顯示純文字，閱讀體驗差
* file:// 開頭的本機 Markdown 無法一致渲染
* 需要額外開啟編輯器或第三方網站
* Mermaid 區塊無法直接視覺化

對技術人員、產品經理、內容創作者而言，這是高頻但低價值的重複摩擦。

---

## Target Users

* Software Engineer / AI Engineer
* Product Manager
* Technical Writer / Documentation Maintainer
* 開源專案貢獻者
* 習慣直接開 md 檔閱讀規格、README、設計文件的使用者

---

## Goals & Non‑Goals

### Goals

* 自動偵測 Markdown 內容或連結
* 支援 http(s) 與 file://
* 零設定、零點擊即可觀看
* 正確渲染 Markdown 標準語法
* 支援 Mermaid 圖表渲染

### Non‑Goals

* 不提供 Markdown 編輯功能
* 不提供同步、儲存、匯出功能
* 不處理非 Markdown 格式（如 AsciiDoc、RST）

---

## Core Features

### 1. Markdown 偵測（Detection）

觸發條件（任一成立即啟用渲染）：

* URL 副檔名為 .md
* HTTP Response Header：Content-Type 包含 text/markdown
* 內容第一行符合 Markdown 特徵（如 #、---、```）
* file:// 路徑指向 .md 檔案

> 偵測需在不影響非 md 網頁的情況下進行。

---

### 2. 自動渲染（Auto Rendering）

行為：

* 偵測成功後，自動替換原始內容顯示層
* 不需使用者點擊或手動切換

渲染要求：

* 標題（H1–H6）有明顯字級差異
* 文字顏色、背景色符合閱讀友善設計
* Code block 有語法高亮（可選 v1.1）

---

### 3. Mermaid 支援

* 偵測 ```mermaid code block
* 使用 Mermaid.js 進行即時渲染
* 支援常見圖表：

  * flowchart
  * sequenceDiagram
  * classDiagram
  * stateDiagram

失敗處理：

* 若 Mermaid 語法錯誤，顯示原始 code block 並提示錯誤

---

### 4. file:// 本機檔案支援

* Extension 必須支援 file:// 權限
* 可直接拖曳 md 檔至瀏覽器觀看
* 渲染效果與 http(s) 一致

---

## User Experience (UX)

* 預設啟用，不顯示設定 UI（v1）
* 不彈窗、不打斷使用流程
* 頁面右上角可顯示極小「MD」標示（可選）

---

## Technical Requirements

### Architecture

* Browser Extension（Manifest V3）
* Content Script：

  * 偵測頁面內容
  * 注入渲染容器
* Renderer Layer：

  * Markdown Parser（如 marked / markdown-it）
  * Mermaid.js

---

### Permissions

* "activeTab"
* "scripting"
* "file://*/*"（需使用者手動允許）

---

### Performance

* 首次渲染 < 200ms（一般 README.md）
* 不影響非 Markdown 網頁效能
* Mermaid 僅在偵測到時載入

---

## Edge Cases

* 大型 Markdown（>1MB）
* 混合 HTML + Markdown
* 內嵌相對路徑圖片（需使用原 URL resolve）
* CSP 限制頁面（需 fallback 為 sandbox iframe）

---

## Success Metrics

* 使用者打開 md 連結後即自動顯示（無操作）
* Markdown 顯示正確率 > 95%
* Mermaid 成功渲染率 > 90%

---

## Future Enhancements (v1.1+)

* 主題切換（Light / Dark）
* 字體大小調整
* TOC（Table of Contents）自動生成
* Copy Mermaid as Image / SVG
* Per‑site enable / disable

---

## MVP Definition

v1 必須完成：

* 自動偵測 md（http + file）
* 基本 Markdown 渲染
* Mermaid 渲染
* 無設定、即裝即用

---

## Product Positioning

browser-extension-mdparser 是一個「Invisible Utility」。

不學習、不設定、不干擾，只在你需要閱讀 Markdown 的那一刻，自動出現。

適合：工程師的日常、PRD 的即時檢視、README 的快速理解。
