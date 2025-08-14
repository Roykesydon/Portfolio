<template>
  <div class="content-backdrop" :class="{ active: eggState.rmrfActive }"></div>

  <NConfigProvider :theme="darkTheme" :theme-overrides="myThemeOverrides">
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
import { watchEffect } from 'vue'
import { NConfigProvider } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { eggState } from './store/egg'
import Sidebar from './components/Sidebar.vue'

const myThemeOverrides = {
  common: {
    primaryColor: '#51b1ff',          // 自訂主色
    primaryColorHover: '#3a8ee6',      // 主色懸停
    primaryColorPressed: '#2a6bbf',     // 主色按下
    primaryColorSuppl: '#1a4a99',       // 主色輔助
  }
}

watchEffect(() => {
  if (eggState.rmrfActive) {
    document.documentElement.style.setProperty('--background-color', '#0a0a0a')
    document.documentElement.style.setProperty('--accent-color', '#ff0000')
  }
})
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

/* scroll bar*/
/* custom scrollbar */
::-webkit-scrollbar {
  width: 20px;
  background-color: transparent;
}

::-webkit-scrollbar-track {
  background-color: #1c1f2c;
}

::-webkit-scrollbar-thumb {
  /* background-color: #d6dee1; */
  background: linear-gradient(-45deg, #23a6d5, #23d5ab);
  border-radius: 20px;
  border: 6px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a8bbbf;
}

.content-backdrop.active {
  background: rgba(0, 0, 0, 0.7);
  /* 更暗 */
  transition: background 0.5s ease;
}

/* 紅光閃爍效果 */
.content-backdrop.active::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 70%);
  animation: red-alert 5s infinite alternate; 
  pointer-events: none;
  z-index: 0;
}

@keyframes red-alert {
  0% {
    opacity: 0.1;
  }

  25% {
    opacity: 0.7;
  }

  50% {
    opacity: 0.2;
  }

  75% {
    opacity: 0.6;
  }

  100% {
    opacity: 0.25;
  }
}
</style>