# 🚀 CopyBoost

Boost your browser workflow with simple, fast, and powerful copy tools.
Copy page titles, URLs, selected text (as Markdown), take screenshots, and more — all from one clean popup UI.

CopyBoost is designed to make web research, documentation writing, and note-taking dramatically faster.


---

## ✨ Features

### ✅ Copy Tools

#### • Copy Title + URL
Copies the current page title and URL in Markdown link format.

#### • Copy Selected Text + Title + URL
Formats selected text into a Markdown quote block and appends the page link.

Sample :

```
> Selected text line 1  
> Selected text line 2  

[Page Title](https://example.com)
```

---

### 🖼️ Screenshot Tools

#### • Capture Visible Area (PNG)
Takes a screenshot of the currently visible area of the page and saves it as PNG.

- Chrome: auto-download works normally  
- Brave: behavior depends on download settings  
  - If auto-download fails, the screenshot may open in a new tab so the user can save it manually

---

## 🌍 Multi-language Support

CopyBoost automatically matches your browser UI language.

Supported:

- English (default)
- 日本語 (Japanese)

More languages may be added in the future.

---

## 🛠️ Installation (Developer Mode)

Install from source in Chrome / Brave:

1. Clone the repository:

   ```
   git clone https://github.com/yourname/copyboost.git
   ```

2. Open the extensions page:

   ```
   chrome://extensions/
   ```

3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `copyboost` folder

---

## 📁 Folder Structure

```
copyboost/
  manifest.json
  popup.html
  popup.js
  icons/
    icon16.png
    icon32.png
    icon48.png
    icon128.png
  _locales/
    en/
      messages.json
    ja/
      messages.json
  assets/
    banner.png
```

---

## 🔧 Permissions Used

| Permission       | Description                          |
| ---------------- | ------------------------------------ |
| `tabs`           | Read page title and URL             |
| `scripting`      | Execute scripts on the active tab   |
| `clipboardWrite` | Write text to the clipboard         |
| `activeTab`      | Operate only on the frontmost tab   |
| `downloads`      | Save screenshot files (PNG)         |

Only minimal permissions required for the described features are requested.

---

## 🔒 Privacy

CopyBoost **does not collect, store, or transmit any user data**.

- All processing is done locally in your browser  
- No external servers  
- No tracking or analytics

---

## 🚀 Roadmap (Planned / Ideas)

- Copy page metadata (description, OG tags)
- Switch output format: plain text / Markdown / HTML
- Custom Markdown templates
- Full-page (scrolling) screenshots
- “Print to PDF” helper
- Options page for behavior customization
- Keyboard shortcuts
- Additional languages (e.g. Korean, French, German)

Feature requests are welcome via GitHub Issues.

---

## 🇯🇵 日本語まとめ

CopyBoost は、ブラウザでの **コピー作業やスクリーンショット取得を効率化する拡張機能** です。

### 主な機能（現時点）

- タイトル + URL を Markdown リンクとしてコピー  
- 選択した本文 + タイトル + URL を Markdown の引用形式でコピー  
- 表示中の範囲を PNG スクリーンショットとして保存  
- ブラウザの言語に応じて **英語 / 日本語** 表示を自動切り替え  

### こんな人におすすめ

- Notion / Obsidian / Scrapbox などでメモを取る人  
- Markdown で情報整理するエンジニア・ライター  
- 調査メモや技術ドキュメントを書く機会が多い人  

今後、フルページキャプチャやPDF関連の補助機能、テンプレート機能なども検討しています。

---

## 🤝 Contributing

Pull Requests, Issues, and Feature Requests are all welcome.

1. Fork the repository  
2. Create a feature branch  
3. Submit a PR with a clear description

---

## 📄 License

CopyBoost is released under the **MIT License**.
