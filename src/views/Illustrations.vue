<template>
    <div class="illustrations">
        <n-card v-for="(item, idx) in illustrations" :key="idx" hoverable class="illustration-card">
            <!-- 圖片 -->
            <div class="illustration-image-wrapper">
                <n-image :src="item.images[0]" object-fit="contain" width="100%" 
                    class="illustration-image" />
            </div>

            <!-- 作品資訊 -->
            <div class="illustration-info">
                <h2>{{ item.title }}</h2>
                <p class="date">{{ formatDate(item.date) }}</p>

                <div v-if="item.links?.length" class="links">
                    <n-button v-for="(link, i) in item.links" :key="i" text tag="a" :href="link.url" target="_blank"
                        class="link-btn">
                        {{ link.text }}
                    </n-button>
                </div>
            </div>
        </n-card>
    </div>
</template>

<script setup>
import { NCard, NButton, NImage } from 'naive-ui'
import { illustrationsData } from '../data/illustrations'

const illustrations = illustrationsData

// 日期格式化
const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>

<style scoped>
.illustrations {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 24px;
    padding: 2em;
}

.illustration-card {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0;
    /* 移除 NCard 預設內距，讓圖片頂到卡片邊 */
}

.illustration-image-wrapper {
    /* 加大顯示區域 */
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--img-bg, #1a1a1a);
}

.illustration-image {
    height: 100%;
    transition: transform 0.3s ease;
}

.illustration-image:hover {
    transform: scale(1.05);
}

.illustration-info {
    padding: 16px;
    text-align: center;
}

.illustration-info h2 {
    margin: 0 0 6px;
    font-size: 1.3em;
    font-weight: 600;
}

.date {
    font-size: 0.9em;
    color: var(--text-secondary);
    margin-bottom: 12px;
}

.links {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
}

.link-btn {
    font-size: 0.9em;
    color: var(--accent-color);
}

.link-btn:hover {
    text-decoration: underline;
}
</style>
