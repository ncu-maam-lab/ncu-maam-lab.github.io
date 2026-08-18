# 多物理分析與應用力學實驗室網站

## 最簡單的內容更新方式

1. 用 Chrome 或 Edge 開啟網站的 `manage.html`。
2. 按「選擇網站資料夾」，選擇含有 `index.html` 的網站資料夾。
3. 從左側選擇老師、聯絡資訊、成員、校友、榮譽、計畫、期刊或活動。
4. 修改表單；可以新增、刪除及調整資料順序。
5. 按「儲存並預覽」。
6. 確認網站內容後，將修改推送至 GitHub；GitHub Pages 即會發布。

活動及老師照片可直接從維護表單選取，系統會複製到正確的圖片資料夾並填入路徑。若瀏覽器不支援直接儲存，可按「下載資料檔」，再以下載的 `site-data.js` 覆蓋 `assets/data/site-data.js`。

所有常用內容集中在 `assets/data/site-data.js`。校友論文會同時出現在成員頁與研究成果頁，活動會同時出現在首頁幻燈片與活動花絮頁，因此不需要重複維護。

## 本機預覽

在網站資料夾開啟 PowerShell，執行：

```powershell
python -m http.server 8000
```

正式網站：<https://ncu-maam-lab.github.io/>

正式維護入口：<https://ncu-maam-lab.github.io/manage.html>

本機預覽網站：<http://localhost:8000/>

本機維護入口：<http://localhost:8000/manage.html>
