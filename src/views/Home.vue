<template>
    <div class="home">
        <n-card class="profile-card" hoverable>
            <div class="introduction-content terminal-screen" @click="toggleInput">
                <div v-for="(line, index) in displayedLines" :key="index" class="terminal-line">
                    {{ line }}
                </div>
                <span class="cursor" v-if="isTyping">▍</span>

                <div v-if="showInput" class="input-line" >
                    <span class="prompt">$</span>
                    <input v-model="userInput" @keyup.enter="handleCommand" class="terminal-input"
                        placeholder="Type command..." autofocus />
                </div>
            </div>
        </n-card>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { NCard } from 'naive-ui'

const router = useRouter()

const introductionLines = [
    "$ whoami",
    "用戶: Roykesydon",
    "興趣: 寫程式、畫畫、玩電腦",
    "遊戲偏好: Steam 遊戲，比較偏好單機策略類型",
    "Type 'help' for more commands..."
]

const displayedLines = ref([])
const isTyping = ref(true)
const showInput = ref(false)
const userInput = ref('')
const commandOutput = ref('')

// 打字效果呈現 introduction
const typeIntroduction = () => {
    let lineIndex = 0
    let charIndex = 0
    const typingSpeed = 10

    const type = () => {
        if (lineIndex < introductionLines.length) {
            if (!displayedLines.value[lineIndex]) displayedLines.value[lineIndex] = ''
            if (charIndex < introductionLines[lineIndex].length) {
                displayedLines.value[lineIndex] += introductionLines[lineIndex][charIndex]
                charIndex++
                setTimeout(type, typingSpeed)
            } else {
                charIndex = 0
                lineIndex++
                displayedLines.value.push('')
                setTimeout(type, typingSpeed * 2)
            }
        } else {
            isTyping.value = false
            showInput.value = true
        }
    }
    type()
}

// 模擬載入效果，載入結束後執行 callback
const fakeLoading = (callback) => {
    displayedLines.value.push('Loading...')
    isTyping.value = true
    showInput.value = false
    setTimeout(() => {
        displayedLines.value.push('Done.')
        isTyping.value = false
        callback()
        showInput.value = true
    }, 1500) // 1.5秒模擬載入
}

const handleCommand = () => {
    const input = userInput.value.trim().toLowerCase()

    displayedLines.value.push(`$ ${input}`)

    if (input === 'help') {
        commandOutput.value = [
            'Available commands:',
            '- steam_games: Show my favorite recent games',
            '- info: Show my introduction',
            '- paintings: Show my paintings',
            '- get_video: Open a special video'
        ].join('\n')
        displayedLines.value.push(commandOutput.value)
    } else if (input === 'steam_games') {
        commandOutput.value = [
            'Here are some of my recent favorite games:',
            '- PEAK: 爬山遊戲，單人也好玩',
            '- 雨世界 (Rain World): 近期最愛的遊戲，世界觀也很有意思'
        ].join('\n')
        displayedLines.value.push(commandOutput.value)
    } else if (input === 'info') {
        // 假裝加載後跳轉 /introduction
        fakeLoading(() => {
            router.push('/introduction')
        })
    } else if (input === 'paintings') {
        // 假裝加載後跳轉 /illustrations
        fakeLoading(() => {
            router.push('/illustrations')
        })
    } else if (input === 'get_video') {
        const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        window.open(url, '_blank')
        commandOutput.value = 'Opening special video...'
        displayedLines.value.push(commandOutput.value)
    } else {
        commandOutput.value = 'Command not found. Try "help".'
        displayedLines.value.push(commandOutput.value)
    }

    userInput.value = ''
}

const toggleInput = async () => {
    showInput.value = !showInput.value
    if (showInput.value) {
        await nextTick()
        const inputEl = document.querySelector('.terminal-input')
        if (inputEl) inputEl.focus()
    }
}

onMounted(() => {
    typeIntroduction()
})
</script>

<style scoped>
/* 你的 CSS 保持不變 */
.home {
    max-width: 600px;
    margin: 0 auto;
    /* 讓它水平置中 */

    /* 新增這幾行讓子元素垂直＋水平置中 */
    display: flex;
    justify-content: center;
    /* 水平置中 */
    align-items: center;
    /* 垂直置中 */

    /* 讓 .home 高度撐滿視窗高度 */
    height: 90vh;
}

.profile-card {
    background-color: #000;
    border: 1px solid #55aaff;
    box-shadow: 0 0 10px #55aaff;
    padding: 1em;

    /* 新增：讓 profile-card 變成 flex 容器，並置中內容 */
    display: flex;
    flex-direction: column;
    /* 讓內容垂直排列 */
    justify-content: center;
    /* 垂直置中 */
    align-items: center;
    /* 水平置中（如果需要） */

    /* 固定高度或至少高度 */
    height: 80vh;
    /* 可根據需求調整 */
}

.introduction-content {
    font-size: 1.1rem;
    line-height: 1.4;
    color: #85d8ff;
    background: #000;
    padding: 16px;
    border-radius: 4px;
    white-space: pre-wrap;
    cursor: pointer;

    background-image: repeating-linear-gradient(to bottom,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 2px,
            transparent 4px);
    animation: crt-flicker 2s infinite steps(20), crt-glow 1.5s infinite alternate;
    height: 70vh;
    width: 27em;
    overflow: auto;
}

.introduction-content::-webkit-scrollbar-track {
    background: transparent;
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
    color: #85d8ff;
    font-family: inherit;
    width: 100%;
    outline: none;
    /* margin-top: 8px; */
}

.terminal-output {
    color: #ffff00;
    margin-top: 8px;
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
        text-shadow: 0 0 5px #55aaff, 0 0 10px #55aaff, 0 0 20px #55aaff;
    }

    to {
        text-shadow: 0 0 10px #55aaff, 0 0 20px #55aaff, 0 0 40px #55aaff;
    }
}

.input-line {
    display: flex;
    align-items: center;
}

.prompt {
    /* color: #55aaff; */
    margin-right: 6px;
    user-select: none;
    /* 讓 $ 不會被選取 */
    font-size: 1.1rem;
}
</style>
