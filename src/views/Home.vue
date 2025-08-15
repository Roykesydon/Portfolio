<template>
    <div class="home">
        <n-card class="profile-card">
            <div class="introduction-content terminal-screen">
                <div v-for="(line, index) in displayedLines" :key="index" class="terminal-line">
                    {{ line }}
                </div>

                <div v-if="showCRTFlash" class="crt-white-flash"></div>

                <span class="cursor" v-if="isTyping">▍</span>

                <div v-if="showInput" class="input-line">
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
import { eggState } from '../store/egg'

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
const isDestroyed = ref(false) // 終端機毀掉後禁止輸入
const showCRTFlash = ref(false)

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

const typeLine = (text, callback) => {
    let charIndex = 0
    const typingSpeed = 10
    displayedLines.value.push('') // 先占位一行
    const currentLineIndex = displayedLines.value.length - 1
    isTyping.value = true
    showInput.value = false

    const type = () => {
        if (charIndex < text.length) {
            displayedLines.value[currentLineIndex] += text[charIndex]
            charIndex++
            setTimeout(type, typingSpeed)
        } else {
            isTyping.value = false
            showInput.value = true
            if (callback) callback()
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

function triggerRmRfEgg() {
    eggState.rmrfActive = true
    // 可以加一些延遲或動畫效果
}

const handleCommand = () => {
    if (isDestroyed.value) return // 如果終端機已毀，不處理任何指令

    const input = userInput.value.trim().toLowerCase()

    // 立刻顯示使用者輸入
    displayedLines.value.push(`$ ${input}`)
    // 清空輸入框
    userInput.value = ''

    // 檢查 rm -rf /
    if (input.includes('rm -rf /')) {
        triggerTerminalDestruction()
        return
    }

    // 如果輸入有 "rm "，給他一點彩蛋提示
    if (input.includes('rm ')) {
        typeLine(['⚠️ 警告：你正在使用 rm 命令！這可能會刪除重要資料。\n',
            '難道你看到終端機就會想輸入 rm -rf / 嗎？\n', "這甚至不在 help 指令裡"]);
        return
    }

    if (input === 'help') {
        const output = [
            'Available commands:',
            '- games: Show my favorite recent games',
            '- info: Show my introduction',
            '- paintings: Show my paintings',
            '- video: Open a special video',
            '- time: Show current time',
            '- ask <your question>: Ask me anything'
        ].join('\n')
        typeLine(output)

    } else if (input === 'games') {
        const output = [
            'Here are some of my recent favorite games:',
            '- PEAK: 爬山遊戲，單人也好玩',
            '- 雨世界 (Rain World): 近期最愛的遊戲，世界觀也很有意思'
        ].join('\n')
        typeLine(output)

    } else if (input === 'info') {
        fakeLoading(() => {
            router.push('/introduction')
        })

    } else if (input === 'paintings') {
        fakeLoading(() => {
            router.push('/illustrations')
        })

    } else if (input === 'video') {
        const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        window.open(url, '_blank')
        typeLine('Opening special video...')

    } else if (input === "time") {
        const now = new Date();
        const formatted = now.toLocaleString();
        typeLine(`Current time: ${formatted}`);
    } else if (input.startsWith("ask ")) {
        const query = input.slice(4).trim();
        if (query) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
            typeLine(`Please Google it yourself.`);
        } else {
            typeLine("Usage: ask <question>");
        }
    } else {
        typeLine('Command not found. Try "help".')
    }
}

const toggleInput = async () => {
    showInput.value = !showInput.value
    if (showInput.value) {
        await nextTick()
        const inputEl = document.querySelector('.terminal-input')
        if (inputEl) inputEl.focus()
    }
}

// 亂碼函數
const randomChar = () => {
    const chars = "!@#$%^&*()_+-={}[]<>?/|\\~";
    return chars[Math.floor(Math.random() * chars.length)];
};

// 顯示關電視星星動畫
const showShutdownStars = (callback) => {
    const terminal = document.querySelector('.introduction-content');
    const starCount = 30;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'shutdown-star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random()}s`;
        terminal.appendChild(star);
    }

    setTimeout(() => {
        // 移除星星
        document.querySelectorAll('.shutdown-star').forEach(s => s.remove());
        callback();
    }, 1500);
};

// 紅字亂碼顯示
const glitchRedText = (text) => {
    const terminal = document.querySelector('.introduction-content');
    terminal.innerHTML = '';

    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.marginTop = '50%';
    terminal.appendChild(container);

    const chars = "!@#$%^&*()_+-={}[]<>?/|\\~";
    const original = text.split('');

    // 每個字用 span 包起來並套紅光
    const spans = original.map(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.color = 'red';
        span.style.textShadow = "0 0 2px red, 0 0 5px red, 0 0 10px red";
        container.appendChild(span);
        return span;
    });

    const glitchOnce = () => {
        const length = spans.length;
        const glitchCount = Math.ceil(length / 3);
        const indices = new Set();
        while (indices.size < glitchCount) {
            indices.add(Math.floor(Math.random() * length));
        }

        // 每個選中字符快速亂跳
        indices.forEach(i => {
            const span = spans[i];
            const endTime = Date.now() + 300 + Math.random() * 200;

            const interval = setInterval(() => {
                if (Date.now() < endTime) {
                    span.textContent = chars[Math.floor(Math.random() * chars.length)];
                } else {
                    span.textContent = original[i];
                    clearInterval(interval);
                }
            }, 50 + Math.random() * 50); // 每個字速度略有不同
        });
    };

    // 每隔 1~3 秒隨機觸發一次
    setInterval(() => {
        if (Math.random() < 0.6) {
            glitchOnce();
        }
    }, 1000 + Math.random() * 2000);
};

// 顯示 CRT 白光動畫
const triggerCRTFlash = (callback) => {
    showCRTFlash.value = true
    setTimeout(() => {
        showCRTFlash.value = false
        if (callback) callback()
    }, 600)
}

// 終端毀壞紅字
const triggerTerminalDestruction = () => {
    isDestroyed.value = true;
    showInput.value = false;

    setTimeout(() => {
        displayedLines.value.push("⚠️ WARNING: Critical system command detected!");
        setTimeout(() => displayedLines.value.push("Initializing system wipe..."), 500);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 20) + 10;
            if (progress >= 100) progress = 100;

            displayedLines.value.push(`deleting ${['/etc/passwd', '/boot/kernel.img', '/usr/bin/bash', '/var/log/syslog', '/system32/config/SAM'][Math.floor(Math.random() * 5)]}...`);
            displayedLines.value.push(`[${"#".repeat(progress / 10)}${" ".repeat(10 - progress / 10)}] ${progress}%`);

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    triggerCRTFlash(() => {
                        glitchRedText("SYSTEM SHUTDOWN. ALL DATA LOST.")
                        triggerRmRfEgg()
                    })
                }, 900)
            }
        }, 900)
    }, 1000);

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
    border: 1px solid var(--accent-color);
    box-shadow: 0 0 10px var(--accent-color);
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
    position: relative;
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

/* 著火動畫 */
@keyframes fire {
    0% {
        text-shadow: 0 0 5px orange, 0 0 10px red;
    }

    50% {
        text-shadow: 0 0 20px yellow, 0 0 40px red;
    }

    100% {
        text-shadow: 0 0 5px orange, 0 0 15px red;
    }
}

.terminal-destroyed {
    animation: fire 0.5s infinite;
    background-color: black !important;
    /* border: 2px solid red !important; */
    color: red !important;
}

.flame {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 10px;
    height: 30px;
    background: orange;
    border-radius: 50%;
    animation: flicker 0.2s infinite, rise 1s infinite;
    box-shadow:
        0 0 20px 5px orange,
        0 -10px 30px 10px red;
}

@keyframes flicker {

    0%,
    100% {
        transform: scale(1) rotate(0deg);
        background: orange;
    }

    50% {
        transform: scale(1.2) rotate(5deg);
        background: yellow;
    }
}

@keyframes rise {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }

    100% {
        transform: translateY(-50px) scale(0.5);
        opacity: 0;
    }
}

/* 關電視星星效果 */
.shutdown-star {
    position: absolute;
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
    opacity: 1;
    animation: star-fade 1.5s forwards, star-shrink 1.5s forwards;
}

@keyframes star-fade {
    to {
        opacity: 0;
    }
}

@keyframes star-shrink {
    to {
        transform: scale(0);
    }
}

.glitch-text {
    color: red;
    /* 文字紅色 */
    text-shadow:
        0 0 2px red,
        0 0 5px red,
        0 0 10px red;
}

.crt-white-flash {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
    overflow: hidden;
}

.crt-white-flash::before,
.crt-white-flash::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: black;
    opacity: 0;
    pointer-events: none;
}

.crt-white-flash::before {
    animation: crt-flash-lines 0.6s forwards;
}

.crt-white-flash::after {
    animation: crt-flash-flicker 0.6s forwards;
}

@keyframes crt-flash-lines {
    0% {
        opacity: 0.5;
        background: repeating-linear-gradient(to bottom,
                rgba(255, 0, 0, 0.4) 0px,
                rgba(255, 0, 0, 0.4) 1px,
                transparent 2px,
                transparent 4px);
    }

    50% {
        opacity: 1;
        background-position: 0 50%;
    }

    100% {
        opacity: 0;
        background-position: 0 100%;
    }
}

@keyframes crt-flash-flicker {
    0% {
        opacity: 0.8;
    }

    20% {
        opacity: 1;
    }

    40% {
        opacity: 0.6;
    }

    60% {
        opacity: 1;
    }

    80% {
        opacity: 0.5;
    }

    100% {
        opacity: 0;
    }
}

.introduction-content {
    position: relative;
}
</style>
