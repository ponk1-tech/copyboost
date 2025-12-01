const iconEl = document.getElementById("icon");
const messageEl = document.getElementById("message");
const hintEl = document.getElementById("hint");
const btnLink = document.getElementById("btnLink");
const btnQuote = document.getElementById("btnQuote");
const btnScreenshot = document.getElementById("btnScreenshot");

// ラベル用の要素
const btnLinkLabelEl = document.getElementById("btnLinkLabel");
const btnLinkKbdEl = document.getElementById("btnLinkKbd");
const btnQuoteLabelEl = document.getElementById("btnQuoteLabel");
const btnQuoteKbdEl = document.getElementById("btnQuoteKbd");
const btnScreenshotLabelEl = document.getElementById("btnScreenshotLabel");
const btnScreenshotKbdEl = document.getElementById("btnScreenshotKbd");

function applyI18nStaticTexts() {
  const t = (key) => chrome.i18n.getMessage(key);

  if (messageEl) messageEl.textContent = t("ui_idle_message");
  if (hintEl) hintEl.textContent = t("ui_idle_hint");

  if (btnLinkLabelEl) btnLinkLabelEl.textContent = t("ui_btnLink_label");
  if (btnLinkKbdEl) btnLinkKbdEl.textContent = t("ui_btnLink_kbd");

  if (btnQuoteLabelEl) btnQuoteLabelEl.textContent = t("ui_btnQuote_label");
  if (btnQuoteKbdEl) btnQuoteKbdEl.textContent = t("ui_btnQuote_kbd");

  if (btnScreenshotLabelEl)
    btnScreenshotLabelEl.textContent = t("ui_btnShot_label");
  if (btnScreenshotKbdEl)
    btnScreenshotKbdEl.textContent = t("ui_btnShot_kbd");
}

function setStateIdle() {
  const t = (key) => chrome.i18n.getMessage(key);

  iconEl.className = "icon idle";
  iconEl.textContent = "✦";
  messageEl.textContent = t("ui_idle_message");
  hintEl.textContent = t("ui_idle_hint");
  btnLink.disabled = false;
  btnQuote.disabled = false;
  btnScreenshot.disabled = false;
}

function setStateLoading(messageKey, hintKey) {
  const t = (key, fallback) =>
    key ? chrome.i18n.getMessage(key) || fallback : fallback;

  iconEl.className = "icon loading";
  iconEl.textContent = "";

  messageEl.textContent = t(
    messageKey,
    chrome.i18n.getMessage("state_loading_generic")
  );
  hintEl.textContent = t(
    hintKey,
    chrome.i18n.getMessage("state_loading_generic_hint")
  );

  btnLink.disabled = true;
  btnQuote.disabled = true;
  btnScreenshot.disabled = true;
}

function setStateSuccess(messageKey, hintKey) {
  const t = (key, fallback) =>
    key ? chrome.i18n.getMessage(key) || fallback : fallback;

  iconEl.className = "icon success pop";
  iconEl.textContent = "✓";

  messageEl.textContent = t(
    messageKey,
    chrome.i18n.getMessage("state_success_generic")
  );
  hintEl.textContent = t(
    hintKey,
    chrome.i18n.getMessage("state_success_generic_hint")
  );
}

function setStateError(messageKey, hintKey) {
  const t = (key, fallback) =>
    key ? chrome.i18n.getMessage(key) || fallback : fallback;

  iconEl.className = "icon error pop";
  iconEl.textContent = "!";

  messageEl.textContent = t(
    messageKey,
    chrome.i18n.getMessage("state_error_generic")
  );
  hintEl.textContent = t(
    hintKey,
    chrome.i18n.getMessage("state_error_generic_hint")
  );

  btnLink.disabled = false;
  btnQuote.disabled = false;
  btnScreenshot.disabled = false;
}

// mode: "link" | "quote"
async function runCopy(mode) {
  try {
    if (mode === "link") {
      setStateLoading("state_loading_copy_link", "state_loading_copy_link_hint");
    } else {
      setStateLoading(
        "state_loading_copy_quote",
        "state_loading_copy_quote_hint"
      );
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      setStateError("state_error_no_tab", "state_error_no_tab_hint");
      return;
    }

    let selectedText = "";

    if (mode === "quote") {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      });

      selectedText = (result && result.result ? result.result : "").trim();

      if (!selectedText) {
        setStateError(
          "state_error_no_selection",
          "state_error_no_selection_hint"
        );
        return;
      }
    }

    const title = tab.title || "";
    const url = tab.url || "";

    let markdown = "";

    if (mode === "quote" && selectedText) {
      const lines = selectedText.split(/\r?\n/);

      const quoted = lines
        .map((line) => {
          const trimmed = line.trim();
          if (trimmed === "") return ">";
          return `> ${trimmed}`;
        })
        .join("\n");

      markdown += quoted + "\n\n";
    }

    markdown += `[${title}](${url})`;

    await navigator.clipboard.writeText(markdown);

    if (mode === "link") {
      setStateSuccess(
        "state_success_copy_link",
        "state_success_copy_link_hint"
      );
    } else {
      setStateSuccess(
        "state_success_copy_quote",
        "state_success_copy_quote_hint"
      );
    }

    setTimeout(() => {
      window.close();
    }, 1200);
  } catch (e) {
    console.error(e);
    setStateError("state_error_generic", "state_error_generic_hint");
  }
}

// スクリーンショット（表示中の範囲）を撮影して自動ダウンロード
async function runScreenshot() {
  try {
    setStateLoading(
      "state_loading_screenshot",
      "state_loading_screenshot_hint"
    );

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      setStateError("state_error_no_tab", "state_error_no_tab_hint");
      return;
    }

    chrome.tabs.captureVisibleTab(
      tab.windowId,
      { format: "png" },
      async (dataUrl) => {
        if (chrome.runtime.lastError || !dataUrl) {
          console.error(chrome.runtime.lastError);
          setStateError("state_error_capture", "state_error_capture_hint");
          return;
        }

        try {
          // ファイル名をそれっぽく生成
          const safeTitle = (tab.title || "screenshot")
            .replace(/[\\/:*?\"<>|]/g, "_")
            .slice(0, 40);

          const now = new Date();
          const stamp = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
            String(now.getHours()).padStart(2, "0"),
            String(now.getMinutes()).padStart(2, "0")
          ].join("");

          const filename = `${safeTitle}_${stamp}.png`;

          // ページ側コンテキストで <a download> を作ってクリックさせる
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [dataUrl, filename],
            func: (url, file) => {
              try {
                const a = document.createElement("a");
                a.href = url;
                a.download = file;
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  a.remove();
                }, 1000);
              } catch (err) {
                console.error("ダウンロードリンク実行中にエラー:", err);
              }
            }
          });

          setStateSuccess(
            "state_success_screenshot",
            "state_success_screenshot_hint"
          );

          setTimeout(() => {
            window.close();
          }, 1200);
        } catch (err) {
          console.error(err);
          setStateError("state_error_save", "state_error_save_hint");
        }
      }
    );
  } catch (e) {
    console.error(e);
    setStateError("state_error_generic", "state_error_generic_hint");
  }
}

// イベント登録
btnLink.addEventListener("click", () => runCopy("link"));
btnQuote.addEventListener("click", () => runCopy("quote"));
btnScreenshot.addEventListener("click", () => runScreenshot());

// 初期状態
applyI18nStaticTexts();
setStateIdle();
