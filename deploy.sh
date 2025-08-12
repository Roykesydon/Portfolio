#!/bin/bash

echo "確定要上傳到 github 嗎？請輸入 yes 或 no"
read answer

if [ "$answer" != "yes" ]; then
  echo "腳本執行已中斷"
  exit 1
fi

echo "繼續上傳..."

# 建置 Vue + Vite 項目，輸出在 dist
npm run build

# 直接用 subtree push，讓 dist 資料夾推送到 gh-pages
git subtree push --prefix=dist origin gh-pages
