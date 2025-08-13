// File 1: /src/components/TimelineDialog.vue

<template>
    <div class="timeline-dialog">
        <div class="timeline-scroll">
            <!-- 主線 -->
            <div class="timeline-line">
                <div v-for="(yearData, index) in timelineData" :key="yearData.year" class="timeline-point-wrapper">
                    <n-popover trigger="click" placement="top" :show-arrow="true">
                        <template #trigger>
                            <div class="timeline-point" :style="{ backgroundColor: getColor(index) }">
                                <div class="year-label">{{ yearData.year }}</div>
                            </div>
                        </template>
                        <div class="popover-content">
                            <div v-if="yearData.awards && yearData.awards.length > 0" class="category-section">
                                <h3>Awards</h3>
                                <n-collapse>
                                    <n-collapse-item v-for="(event, idx) in yearData.awards" :key="idx"
                                        :title="event.title">
                                        <div class="event-desc">{{ event.desc }}</div>
                                    </n-collapse-item>
                                </n-collapse>
                            </div>
                            <div v-if="yearData.experience && yearData.experience.length > 0" class="category-section">
                                <h3>Role</h3>
                                <n-collapse>
                                    <n-collapse-item v-for="(event, idx) in yearData.experience" :key="idx"
                                        :title="event.title">
                                        <div class="event-desc">{{ event.desc }}</div>
                                    </n-collapse-item>
                                </n-collapse>
                            </div>
                            <div v-if="yearData.workingExperience && yearData.workingExperience.length > 0"
                                class="category-section">
                                <h3>Working Experience</h3>
                                <n-collapse>
                                    <n-collapse-item v-for="(event, idx) in yearData.workingExperience" :key="idx"
                                        :title="event.title">
                                        <div class="event-desc">{{ event.desc }}</div>
                                    </n-collapse-item>
                                </n-collapse>
                            </div>
                        </div>
                    </n-popover>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NPopover } from 'naive-ui'
import { computed } from 'vue'
import { introductionData } from '../data/introduction'

// 藍綠交替
function getColor(index) {
    return index % 2 === 0 ? '#4CC3FF' : '#6BFFB8'
}

// 整理資料
function addEventForYears(map, startYear, endYear, category, event) {
    for (let y = startYear; y <= endYear; y++) {
        if (!map[y]) map[y] = { awards: [], experience: [], workingExperience: [] }
        map[y][category].push(event)
    }
}

const timelineData = computed(() => {
    const map = {}
    introductionData.awards.forEach(a => {
        const y = parseInt(a.year.slice(0, 4))
        addEventForYears(map, y, y, 'awards', { title: a.title, desc: a.event })
    })
    introductionData.experience.forEach(e => {
        const years = e.duration.split('-').map(Number)
        if (years.length === 1) years.push(years[0]) // 沒有區間時
        addEventForYears(map, years[0], years[1], 'experience', { title: e.role, desc: `@ ${e.company}` })
    })
    introductionData.workingExperience.forEach(w => {
        const years = w.duration.split('-').map(Number)
        if (years.length === 1) years.push(years[0])
        addEventForYears(map, years[0], years[1], 'workingExperience', { title: w.job, desc: w.details })
    })

    return Object.entries(map)
        .map(([year, categories]) => ({ year, ...categories }))
        .sort((a, b) => a.year - b.year)
})
</script>

<style scoped>
.timeline-dialog {
    padding: 20px;
}

/* 可橫向滾動容器 */
.timeline-scroll {
    overflow-x: auto;
    overflow-y: hidden;
    /* 防止因為 absolute 造成垂直 scrollbar */
    padding-bottom: 12px;
    white-space: nowrap;
    /* 保證子項不換行 */
}

.timeline-scroll::-webkit-scrollbar-track {
    background: transparent;
}

/* 主線條 */
.timeline-line {
    padding: 1em;
    display: flex;
    align-items: center;
    position: relative;
    height: 80px;
    width: max-content;
    /* 取代 min-width 避免額外空間 */
}

.timeline-line::after {
    content: "";
    position: absolute;
    top: 50%;
    right: -0.5em;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 14px solid #00eaff;
    /* 主色可改 */
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    filter: drop-shadow(0 0 6px #00eaff) drop-shadow(0 0 12px #00eaff);
    animation: arrow-glow 2s infinite ease-in-out, arrow-warp 4s infinite ease-in-out;
}

/* 主線條也發光 */
.timeline-line::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    height: 4px;
    width: 100%;
    background: linear-gradient(90deg,
            rgba(0, 234, 255, 0.3) 0%,
            rgba(0, 234, 255, 0.8) 50%,
            rgba(0, 234, 255, 0.3) 100%);
    transform: translateY(-50%);
    filter: drop-shadow(0 0 4px #00eaff);
    background-size: 200% 100%;
    animation: line-flow 3s linear infinite;
}

/* 箭頭脈動閃光 */
@keyframes arrow-glow {

    0%,
    100% {
        filter: drop-shadow(0 0 4px #00eaff) drop-shadow(0 0 12px #00eaff);
    }

    50% {
        filter: drop-shadow(0 0 10px #00eaff) drop-shadow(0 0 20px #00eaff);
    }
}

/* 漣漪扭曲效果（類似量子斷裂） */
@keyframes arrow-warp {

    0%,
    100% {
        transform: translateY(-50%) scaleX(1);
    }

    50% {
        transform: translateY(-50%) scaleX(1.2) skewX(8deg);
    }
}

/* 能量沿線流動 */
@keyframes line-flow {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}


/* 節點 */
.timeline-point {
    position: relative;
    z-index: 1;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-right: 80px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.timeline-point:hover {
    transform: scale(1.2);
}

/* 年份標籤 */
.year-label {
    display: inline-block;
    /* 避免直排 */
    white-space: nowrap;
    /* 年份不換行 */
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
}

/* Popover 內容 */
.popover-content {
    max-width: 300px;
    max-height: 250px;
    /* 限制高度 */
    overflow-y: auto;
    /* 滾動條 */
    padding: 8px;
}

.popover-content::-webkit-scrollbar {
    width: 8px;
}

.popover-content::-webkit-scrollbar-track {
    background: transparent;
}

.popover-content::-webkit-scrollbar-thumb {
    background: rgba(200, 200, 200, 0.5);
    border-radius: 4px;
}

.popover-content::-webkit-scrollbar-thumb:hover {
    background: rgba(150, 150, 150, 0.7);
}

.category-section {
    margin-bottom: 16px;
}

.category-section h3 {
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.9);
}

.event-desc {
    font-size: 0.85rem;
    opacity: 0.85;
    line-height: 1.4;
    white-space: normal;
}


.event-item {
    margin-bottom: 8px;
}

.event-title {
    font-weight: bold;
    font-size: 1rem;
}

.event-desc {
    font-size: 0.85rem;
    opacity: 0.85;
}
</style>