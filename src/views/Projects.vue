<template>
    <div class="projects">
        <n-card v-for="project in projects" :key="project.title" hoverable class="project-card">
            <!-- 標題與描述 -->
            <div class="project-header">
                <h2 class="project-title">{{ project.title }}</h2>
                <p class="project-description">{{ project.description }}</p>
            </div>

            <!-- 查看專案按鈕 -->
            <div class="project-actions" v-if="project.link">
                <n-button class="project-link" type="primary" text tag="a" :href="project.link" target="_blank">
                    專案連結
                </n-button>
            </div>

            <!-- 圖片區，根據圖片數量加不同 class -->
            <div class="project-images"
                :class="{ 'single-image': project.images.length === 1, 'multi-image': project.images.length > 1 }"
                :data-count="project.images.length">
                <n-image-group>
                    <n-image v-for="(img, index) in project.images" :key="index" :src="img" object-fit="contain"
                        class="project-image" />
                </n-image-group>
            </div>
        </n-card>
    </div>
</template>

<script setup>
import { NCard, NButton, NImage, NImageGroup } from 'naive-ui'
import { sideProjectsData } from '../data/projects'

const projects = sideProjectsData
</script>

<style scoped>
.projects {
    max-width: 1200px;
    margin: auto;
    padding: 2em;
    display: grid;
    gap: 24px;
}

.project-card {
    border-radius: 16px;
    border: 1px solid var(--border-color);
    padding: 1.5em;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    background-color: var(--card-bg);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.project-header {
    margin-bottom: 1em;
}

.project-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
}

.project-description {
    color: var(--text-secondary);
    margin-top: 0.5em;
    font-size: 0.95rem;
    line-height: 1.5;
}

.project-actions {
    margin-bottom: 1em;
}

.project-link {
    color: var(--accent-color);
}

.project-images.multi-image {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 16px;
    padding: 8px;
}

/* 針對三張圖片，強制三欄 */
.project-images.multi-image[data-count="3"] {
    grid-template-columns: repeat(3, 1fr);
}


/* 單張圖片置中 */
.project-images.single-image {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    padding: 8px;
}

/* 單張圖片的大小限制，避免太寬 */
.project-images.single-image .project-image {
    max-width: 600px;
    /* 你可調整 */
    width: 100%;
    height: 250px;
}

/* 多張圖片共用樣式 */
.project-image {
    width: 100%;
    height: 250px;
    object-fit: contain;
    border-radius: 12px;
    transition: transform 0.25s ease;
    background-color: #202020;
    border: 1px solid var(--border-color);
    padding: 8px;
    box-sizing: border-box;
    overflow: hidden;
}

.project-image :deep(img) {
    max-width: 100% !important;
    max-height: 100% !important;
    width: auto !important;
    height: auto !important;
    object-fit: contain !important;
    display: block !important;
    margin: 0 auto !important;
}

.project-image :deep(.n-image) {
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.project-image:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 響應式 */
@media (max-width: 768px) {
    .project-images.multi-image {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .project-image {
        height: 220px;
    }
}

@media (max-width: 1024px) and (min-width: 769px) {
    .project-images.multi-image {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }

    .project-image {
        height: 230px;
    }
}
</style>
