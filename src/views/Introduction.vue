<template>
    <div class="introduction">
        <!-- 個人簡介 -->
        <!-- <n-card class="profile-card" hoverable>
            <div class="introduction-content terminal-screen" @click="toggleInput">
                <div v-for="(line, index) in displayedLines" :key="index" class="terminal-line">
                    {{ line }}
                </div>
                <span class="cursor" v-if="isTyping">█</span>

                <input v-if="showInput" v-model="userInput" @keyup.enter="handleCommand" class="terminal-input"
                    placeholder="Type command..." autofocus />
                <div v-if="commandOutput" class="terminal-output">{{ commandOutput }}</div>
            </div>
        </n-card> -->

        <!-- 教育背景 -->
        <n-card title="Education" hoverable class="section-card">
            <n-timeline>
                <n-timeline-item v-for="item in data.education" :key="item.degree" type="info" :title="item.degree"
                    :time="item.year">
                    <div class="education-details">
                        <n-descriptions :column="1">
                            <n-descriptions-item label="">{{ item.school }}</n-descriptions-item>
                        </n-descriptions>
                    </div>
                </n-timeline-item>
            </n-timeline>
        </n-card>

        <!-- 獎項與考試 -->
        <n-card title="Awards and Examinations" hoverable class="section-card">
            <n-list bordered>
                <n-list-item v-for="item in data.awards" :key="item.title + item.year">
                    <div class="award-item">
                        <div class="award-info">
                            <div class="award-title">{{ item.title }}</div>
                            <div class="award-event">{{ item.event }}</div>
                        </div>
                        <div class="award-meta">
                            <n-tag v-if="item.ranking" type="info" round>
                                Rank: {{ item.ranking }}
                            </n-tag>
                            <span class="award-year">{{ item.year }}</span>
                        </div>
                    </div>
                </n-list-item>
            </n-list>
        </n-card>

        <!-- 技能（按類別分頁） -->
        <n-card title="Skills" hoverable class="section-card">
            <n-tabs type="line" animated default-value="Language">
                <n-tab-pane v-for="(skillList, category) in data.skills" :key="category" :name="category"
                    :tab="category" class="skills-tab">
                    <div class="skills-container">
                        <n-tag v-for="skill in skillList" :key="skill" type="info" round style="margin: 4px;">
                            {{ skill }}
                        </n-tag>
                    </div>
                </n-tab-pane>
            </n-tabs>
        </n-card>

        <!-- 時間軸：角色 -->
        <n-card title="Roles Timeline" hoverable class="section-card">
            <n-timeline>
                <n-timeline-item v-for="item in roleTimeline" :key="item.title" type="info" :title="item.title"
                    :time="item.time">
                </n-timeline-item>
            </n-timeline>
        </n-card>

        <!-- 時間軸：項目 -->
        <n-card title="Working Experience Timeline" hoverable class="section-card">
            <n-timeline>
                <n-timeline-item v-for="item in workingExperienceTimeline" :key="item.title" type="info"
                    :title="item.title" :time="item.time">
                    <n-collapse>
                        <n-collapse-item title="Details">
                            <div>{{ item.content }}</div>
                        </n-collapse-item>
                    </n-collapse>
                </n-timeline-item>
            </n-timeline>
        </n-card>

        <n-card title="Yearly Timeline" hoverable class="section-card">
            <TimelineDialog />
        </n-card>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { NCard, NList, NListItem, NDescriptions, NDescriptionsItem, NTag, NAvatar, NTabs, NTabPane, NTimeline, NTimelineItem, NCollapse, NCollapseItem, NIcon } from 'naive-ui'
import { Trophy } from '@vicons/ionicons5'
import { introductionData } from '../data/introduction'
import TimelineDialog from '../components/TimelineDialog.vue'


const displayedLines = ref([])
const isTyping = ref(true)
const showInput = ref(false)
const userInput = ref('')
const commandOutput = ref('')

// 打字動畫
const typeIntroduction = () => {
    const lines = data.value.about.introduction
    let lineIndex = 0
    let charIndex = 0
    const typingSpeed = 50 // 毫秒/字元

    const type = () => {
        if (lineIndex < lines.length) {
            if (charIndex < lines[lineIndex].length) {
                if (!displayedLines.value[lineIndex]) displayedLines.value[lineIndex] = ''
                displayedLines.value[lineIndex] += lines[lineIndex][charIndex]
                charIndex++
                setTimeout(type, typingSpeed)
            } else {
                charIndex = 0
                lineIndex++
                displayedLines.value.push('') // 新行
                setTimeout(type, typingSpeed * 2) // 行間延遲
            }
        } else {
            isTyping.value = false
        }
    }
    type()
}

// 彩蛋：處理命令
const handleCommand = () => {
    const input = userInput.value.trim().toLowerCase()
    if (input === 'help') {
        commandOutput.value = 'Available commands: steam (show favorite games), exit (close input)'
    } else if (input === 'steam') {
        commandOutput.value = 'Favorite Steam games: Civilization VI, Stellaris, Factorio. Easter egg unlocked! 🎉'
    } else if (input === 'exit') {
        showInput.value = false
        commandOutput.value = ''
    } else {
        commandOutput.value = 'Command not found. Try "help".'
    }
    userInput.value = ''
    displayedLines.value.push(`$ ${input}`)
    displayedLines.value.push(commandOutput.value)
}

// 點擊螢幕顯示輸入框（彩蛋觸發）
const toggleInput = () => {
    showInput.value = !showInput.value
}

// onMounted(() => {
//     typeIntroduction()
// })

// 安全解析 ranking（兼容多種字串格式）
const parseRankingFromName = (name = '') => {
    if (!name) return null
    const r1 = name.match(/Rank:\s*([\d\/]+)/)?.[1]
    const r2 = name.match(/(\d+(?:st|nd|rd|th)\s+place)/)?.[1]
    const r3 = name.match(/Silver Medal/)?.[0]
    return r1 || r2 || r3 || null
}

// 把 awards 正規化成固定結構：{ title, event, ranking, year }
const normalizeAwards = (awards = []) => {
    return awards.map(a => {
        // 已經是結構化的物件（我們優先使用這些欄位）
        if (a.title || a.event) {
            return {
                title: a.title || (a.name ? a.name.replace(/\(Rank:.*?\)/, '').trim() : ''),
                event: a.event || a.event || (a.name || ''),
                ranking: a.ranking ?? parseRankingFromName(a.name),
                year: a.year || a.time || ''
            }
        }
        // 傳統的 name 欄位（字串）
        return {
            title: a.name ? a.name.replace(/\(Rank:.*?\)/, '').trim() : '',
            event: '',
            ranking: parseRankingFromName(a.name),
            year: a.year || ''
        }
    })
}

const data = computed(() => {
    return {
        ...introductionData,
        awards: normalizeAwards(introductionData.awards)
    }
})

// 解析時間並提取排序用的年份（保持原本功能）
const parseTimeForSort = (time) => {
    const parts = String(time).split('-')
    if (parts.length === 2) {
        return parseInt(parts[1]) || parseInt(parts[0])
    }
    return parseInt(time) || 0
}

// 角色時間軸（experience）
const roleTimeline = computed(() => {
    return (data.value.experience || [])
        .map(item => ({
            type: 'success',
            title: `${item.role} @ ${item.company}`,
            content: `Role: ${item.role}, Company: ${item.company}`,
            time: item.duration
        }))
        .sort((a, b) => parseTimeForSort(b.time) - parseTimeForSort(a.time))
})

// 項目時間軸（workingExperience）
const workingExperienceTimeline = computed(() => {
    return (data.value.workingExperience || [])
        .map(item => ({
            type: 'success',
            title: item.job,
            content: item.details,
            time: item.duration
        }))
        .sort((a, b) => parseTimeForSort(b.time) - parseTimeForSort(a.time))
})
</script>

<style scoped>
.introduction {
    max-width: 100%;
    margin: 0 auto;
    position: relative;
    padding: 2em;
}

.profile-card {
    margin-bottom: 24px;
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    padding: 5px;
}

.profile-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px var(--accent-color);
}

.profile-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
}

.introduction-content {
    font-family: 'Courier New', monospace;
    /* 等寬字體 */
    font-size: 1.1rem;
    line-height: 1.4;
    color: #85d8ff;
    /* 綠色 */
    background: #000;
    /* 黑底 */
    padding: 16px;
    border-radius: 4px;
    white-space: pre;
    /* 保留空白 */
    overflow: hidden;
    height: 200px;
    /* 固定高度，像終端機視窗 */
    border: 1px solid #85d8ff;
    box-shadow: 0 0 10px #85d8ff;
    cursor: pointer;
    /* 鼠標形狀提示可點擊 */

    /* CRT 螢幕掃描線效果 */
    background-image: repeating-linear-gradient(to bottom,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 2px,
            transparent 4px);
    animation: crt-flicker 2s infinite steps(20), crt-glow 1.5s infinite alternate;
}

.terminal-line {
    margin-bottom: 4px;
}

.cursor {
    display: inline-block;
    animation: blink 0.8s infinite;
}

@keyframes blink {

    0%,
    50% {
        opacity: 1;
    }

    51%,
    100% {
        opacity: 0;
    }
}

.terminal-input {
    background: transparent;
    border: none;
    color: #00ff00;
    font-family: inherit;
    width: 100%;
    outline: none;
}

.terminal-output {
    color: #ffff00;
    /* 黃色輸出區分 */
}

/* 輕微亮度閃爍 */
@keyframes crt-flicker {
    0% {
        opacity: 0.98;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.97;
    }
}

/* 發光脈動 */
@keyframes crt-glow {
    from {
        text-shadow: 0 0 5px var(--accent-color),
            0 0 10px var(--accent-color),
            0 0 20px var(--accent-color);
    }

    to {
        text-shadow: 0 0 10px var(--accent-color),
            0 0 20px var(--accent-color),
            0 0 40px var(--accent-color);
    }
}

.section-card {
    margin-bottom: 24px;
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.section-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px var(--accent-color);
}

.skills-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 8px;
}

.n-tag {
    /* background-color: var(--accent-color); */
    border-color: var(--accent-color);
    color: var(--accent-color);
    font-size: 1rem;
}

.n-timeline {
    padding: 16px 0;
}

.n-timeline-item {
    transition: all 0.3s ease;
}

.n-timeline-item:hover {
    transform: translateX(5px);
}

.n-collapse {
    margin-top: 8px;
}

/* Awards 樣式 */
.award-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.award-info {
    display: flex;
    flex-direction: column;
}

.award-title {
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--accent-color);
}

.award-event {
    font-size: 0.95rem;
    color: #ddd;
}

.award-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: #ccc;
}

.education-details {
    padding: 8px 0;
}
</style>