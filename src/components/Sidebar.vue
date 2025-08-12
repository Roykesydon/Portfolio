<template>
    <nav class="sidebar">
        <div class="sidebar-header">
            <img class="avatar" :src="avatar" alt="Roykesydon" />
            <span class="glitch-wrapper">
                <span class="sidebar-title glitch-bg" data-text="Roykesydon"></span>
                <span class="sidebar-title glitch-text">Roykesydon</span>
            </span>
            <!-- <h2 class="sidebar-title glitch" data-text="Roykesydon">Roykesydon</h2> -->
            <div class="neon-glow"></div>
        </div>
        <div class="social-icons">
            <button class="social-btn" @click="openLink('https://x.com/Roykesydon')" aria-label="X (Twitter)">
                <font-awesome-icon :icon="['fab', 'twitter']" />
            </button>
            <button class="social-btn" @click="openLink('https://www.linkedin.com/in/chia-chang-tsou-79514b28a/')"
                aria-label="LinkedIn">
                <font-awesome-icon :icon="['fab', 'linkedin']" />
            </button>
            <button class="social-btn" @click="openLink('https://www.pixiv.net/users/18855729')" aria-label="Pixiv">
                <font-awesome-icon :icon="['fab', 'pixiv']" />
            </button>
        </div>
        <ul class="menu-list">
            <li v-for="option in menuOptions" :key="option.key" class="menu-item"
                :class="{ active: currentRoute === option.key }" @click="handleMenuClick(option.key)">
                <div class="icon-wrapper">
                    <component :is="option.icon" class="menu-icon" />
                </div>
                <span class="menu-label">{{ option.label }}</span>
                <div class="hover-effect"></div>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faCode, faPaintBrush } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faLinkedin, faPixiv } from '@fortawesome/free-brands-svg-icons'

import '../styles/glitch.scss'
import avatar from '../assets/avatar.jpg'

library.add(faUser, faCode, faPaintBrush, faTwitter, faLinkedin, faPixiv)

const router = useRouter()
const route = useRoute()

const menuOptions = [
    {
        label: 'Introduction',
        key: 'introduction',
        icon: () => h(FontAwesomeIcon, { icon: faUser })
    },
    {
        label: 'Side Projects',
        key: 'projects',
        icon: () => h(FontAwesomeIcon, { icon: faCode })
    },
    {
        label: 'Illustrations',
        key: 'illustrations',
        icon: () => h(FontAwesomeIcon, { icon: faPaintBrush })
    }
]

const currentRoute = computed(() => {
    if (route.path === '/') return 'introduction'
    return route.path.slice(1)
})

const handleMenuClick = (key) => {
    if (key === 'introduction') router.push('/')
    else if (key === 'projects') router.push('/projects')
    else if (key === 'illustrations') router.push('/illustrations')
    else router.push(`/${key}`)
}

const openLink = (url) => {
    window.open(url, '_blank', 'noopener')
}
</script>

<style scoped>
.sidebar {
    position: sticky;
    top: 0;
    width: 250px;
    color: var(--text-color);
    /* 使用主題文字顏色 */
    height: 100vh;
    overflow-y: auto;
    transition: width 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 0 12px 12px 0;
    z-index: 10;
}

.sidebar-header {
    text-align: center;
    /* margin-bottom: 40px; */
    position: relative;
    z-index: 2;
}

.avatar {
    width: 60%;
    /* height: 90%; */
    border-radius: 50%;
    margin-bottom: 10px;
    border: 2px solid var(--accent-color);
    /* 使用主題 accent 顏色 */
    box-shadow: 0 0 15px var(--accent-color), 0 0 30px color-mix(in srgb, var(--accent-color) 50%, transparent);
    /* 適配透明度 */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px var(--secondary-accent), 0 0 40px color-mix(in srgb, var(--secondary-accent) 70%, transparent);
    /* 使用 secondary accent */
}

.sidebar-title {
    font-size: 1.5rem;
    letter-spacing: 2px;
    text-shadow: 0 0 8px var(--accent-color), 0 0 16px color-mix(in srgb, var(--accent-color) 50%, transparent);
}

.neon-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, color-mix(in srgb, var(--accent-color) 15%, transparent) 0%, transparent 70%);
    opacity: 0.4;
    animation: pulse 3s infinite alternate;
    z-index: 1;
}

.menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    z-index: 2;
    width: 100%;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    cursor: pointer;
    position: relative;
    background: color-mix(in srgb, var(--accent-color) 5%, transparent);
    /* 背景透明度 */
    margin: 5px 10px;
    border-radius: 8px;
    transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    overflow: hidden;
}

.menu-item:hover {
    background: color-mix(in srgb, var(--secondary-accent) 15%, transparent);
    /* hover 使用 secondary accent */
    transform: translateX(5px);
    box-shadow: 0 0 15px color-mix(in srgb, var(--secondary-accent) 30%, transparent);
}

.menu-item.active {
    background: linear-gradient(90deg, color-mix(in srgb, var(--accent-color) 25%, transparent) 0%, transparent 100%);
    border-left: 4px solid var(--accent-color);
    box-shadow: 0 0 15px color-mix(in srgb, var(--accent-color) 40%, transparent);
}

.icon-wrapper {
    margin-right: 15px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-icon {
    color: var(--accent-color);
    /* 圖標使用 accent 顏色 */
    filter: drop-shadow(0 0 4px var(--accent-color));
    transition: transform 0.3s ease;
}

.menu-item:hover .menu-icon {
    transform: scale(1.2);
    color: var(--secondary-accent);
    /* hover 時圖標變色 */
}

.menu-label {
    /* font-family: 'Roboto Mono', monospace; */
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--text-color);
    text-shadow: 0 0 4px color-mix(in srgb, var(--accent-color) 50%, transparent);
}

.hover-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--secondary-accent) 30%, transparent), transparent);
    transition: left 0.5s ease;
}

.menu-item:hover .hover-effect {
    left: 100%;
}

@keyframes pulse {
    0% {
        opacity: 0.4;
    }

    100% {
        opacity: 0.2;
    }
}

.social-icons {
    display: flex;
    justify-content: center;
    margin-top: 1em;
    margin-bottom: 1em;
}

.social-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.5rem;
    transition: color 0.3s ease, transform 0.3s ease,
        filter 0.3s ease;
    filter: drop-shadow(0 0 4px var(--accent-color));
    display: flex;
    align-items: center;
    justify-content: center;
    /* padding: 6px; */
    border-radius: 50%;
}

.social-btn:hover {
    color: var(--accent-color);
    transform: scale(1.2);
    filter: drop-shadow(0 0 10px var(--accent-color))
}
</style>