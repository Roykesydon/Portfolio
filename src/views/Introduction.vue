<template>
    <div class="introduction">
        <!-- 個人簡介 -->
        <n-card class="profile-card" hoverable>
            <!-- <div class="profile-header">
                <n-avatar size="large" src="/src/assets/avatar.jpg" />
                <h2>個人簡介</h2>
            </div> -->
            <div class="introduction-content">
                <p>{{ data.about.introduction }}</p>
            </div>
        </n-card>

        <!-- 教育背景 -->
        <n-card title="Education" hoverable class="section-card">
            <n-timeline>
                <n-timeline-item v-for="item in data.education" :key="item.degree" type="default" :title="item.degree"
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
                            <n-tag v-if="item.ranking" type="success" round>
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
                        <n-tag v-for="skill in skillList" :key="skill" type="success" round style="margin: 4px;">
                            {{ skill }}
                        </n-tag>
                    </div>
                </n-tab-pane>
            </n-tabs>
        </n-card>

        <!-- 時間軸：角色 -->
        <n-card title="Roles Timeline" hoverable class="section-card">
            <n-timeline>
                <n-timeline-item v-for="item in roleTimeline" :key="item.title" type="success" :title="item.title"
                    :time="item.time">
                </n-timeline-item>
            </n-timeline>
        </n-card>

        <!-- 時間軸：項目 -->
        <n-card title="Working Experience Timeline" hoverable class="section-card">
            <n-timeline>
                <n-timeline-item v-for="item in workingExperienceTimeline" :key="item.title" type="success" :title="item.title"
                    :time="item.time">
                    <n-collapse>
                        <n-collapse-item title="Details">
                            <div>{{ item.content }}</div>
                        </n-collapse-item>
                    </n-collapse>
                </n-timeline-item>
            </n-timeline>
        </n-card>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { NCard, NList, NListItem, NDescriptions, NDescriptionsItem, NTag, NAvatar, NTabs, NTabPane, NTimeline, NTimelineItem, NCollapse, NCollapseItem, NIcon } from 'naive-ui'
import { Trophy } from '@vicons/ionicons5'
import { introductionData } from '../data/introduction'

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
    padding: 24px;
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
    font-size: 1.1rem;
    line-height: 1.6;
    color: #e0e0ff;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
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