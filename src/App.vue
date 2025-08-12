<template>
  <div class="content-backdrop"></div>
  <NConfigProvider :theme="darkTheme">
    <div class="outer-container">
      <div class="app-container">
        <Sidebar /> <!-- 側邊欄組件 -->
        <div class="main-content">
          <router-view /> <!-- 這裡顯示路由頁面 -->
        </div>
      </div>
    </div>
  </NConfigProvider>
</template>

<script setup>
import { NConfigProvider } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import Sidebar from './components/Sidebar.vue'
</script>

<style>
@import './styles/theme.css';
/* Inter 英文字體 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
/* 思源黑體（正黑體替代方案） */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap');

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: auto;
  /* 讓 body 處理滾動 */
  font-family: 'Noto Sans TC', 'Inter', sans-serif;
}

.content-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(20, 20, 40, 0.5);
    border-radius: 12px;
    z-index: -1;
}

.outer-container {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  min-height: 100vh;
  /* 確保至少佔滿視窗高度 */
  background-color: var(--bg-color);
}

.app-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  /* 限制最大寬度 */
  min-height: 100vh;
  background-color: var(--bg-color);
}

.main-content {
  flex: 1;
  padding: 40px;
  margin-left: 1em;
  /* 為 Sidebar 留出空間，與 Sidebar 寬度一致 */
  background-color: var(--bg-color);
  transition: padding 0.3s ease;
}

.n-card {
  background-color: #13141bd3 !important;
  border-radius: 16px;
}
</style>