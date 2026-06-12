<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Dashboard</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="max-w-lg mx-auto pb-6">

        <!-- Metric cards -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="metric-card">
            <span class="metric-value" :class="todayCalories > store.settings.calorieGoal ? 'over' : 'ok'">
              {{ todayCalories.toLocaleString() }}
            </span>
            <span class="metric-label">Today's kcal</span>
            <span class="metric-sub">goal: {{ store.settings.calorieGoal.toLocaleString() }}</span>
          </div>
          <div class="metric-card">
            <span class="metric-value neutral">{{ store.weeklyCalories.toLocaleString() }}</span>
            <span class="metric-label">Week total kcal</span>
            <span class="metric-sub">{{ store.totalMealsThisWeek }} meals planned</span>
          </div>
          <div class="metric-card">
            <span class="metric-value purple">{{ store.weeklyProtein }}g</span>
            <span class="metric-label">Weekly protein</span>
            <span class="metric-sub">goal: {{ store.settings.proteinGoal }}g/day</span>
          </div>
          <div class="metric-card">
            <span class="metric-value neutral">{{ store.meals.length }}</span>
            <span class="metric-label">Saved meals</span>
            <span class="metric-sub">in your library</span>
          </div>
        </div>

        <!-- Today's calories -->
        <div class="dash-card mb-4">
          <p class="card-title">Today's intake</p>
          <MacroBar
            label="Calories"
            :value="todayCalories"
            :goal="store.settings.calorieGoal"
            unit="kcal"
            color="#22c55e"
            overColor="#ef4444"
          />
        </div>

        <!-- Weekly macros -->
        <div class="dash-card mb-4">
          <p class="card-title">Weekly macros</p>
          <MacroBar label="Protein" :value="store.weeklyProtein" :goal="store.settings.proteinGoal * 7" unit="g" color="#a855f7" overColor="#ef4444" />
          <MacroBar label="Carbs"   :value="store.weeklyCarbs"   :goal="store.settings.carbGoal * 7"    unit="g" color="#f97316" overColor="#ef4444" />
          <MacroBar label="Fat"     :value="store.weeklyFat"     :goal="store.settings.fatGoal * 7"     unit="g" color="#3b82f6" overColor="#ef4444" />
        </div>

        <!-- Weekly chart -->
        <div class="dash-card">
          <p class="card-title">This week at a glance</p>
          <div class="flex gap-2 items-end justify-between mt-2" style="height: 120px">
            <div
              v-for="day in days"
              :key="day"
              class="flex flex-col items-center flex-1 gap-1 h-full"
            >
              <span
                class="text-xs font-semibold leading-none mb-1"
                style="min-height: 14px"
                :class="dayCalories(day) > store.settings.calorieGoal ? 'text-red-400' : dayCalories(day) > 0 ? 'text-green-400' : 'text-transparent'"
              >
                {{ dayCalories(day) > 0 ? dayCalories(day) : '0' }}
              </span>
              <div class="w-full flex items-end flex-1">
                <div
                  class="w-full rounded transition-all duration-500"
                  :style="{
                    height: barHeight(day) + '%',
                    minHeight: dayCalories(day) > 0 ? '6px' : '2px',
                    background: dayCalories(day) > store.settings.calorieGoal ? '#ef4444'
                      : dayCalories(day) > 0 ? '#22c55e'
                      : '#2a2a2a'
                  }"
                ></div>
              </div>
              <span
                class="text-xs leading-none mt-1 font-semibold"
                :class="isToday(day) ? 'text-white' : 'text-gray-600'"
              >
                {{ day.slice(0, 1) }}
              </span>
            </div>
          </div>
          <div class="chart-footer">
            <span class="text-xs text-gray-600">Daily goal: {{ store.settings.calorieGoal.toLocaleString() }} kcal</span>
            <div class="flex items-center gap-3">
              <span class="legend-item">
                <span class="legend-dot" style="background:#22c55e"></span>
                On track
              </span>
              <span class="legend-item">
                <span class="legend-dot" style="background:#ef4444"></span>
                Over
              </span>
            </div>
          </div>
        </div>

      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
import { computed } from 'vue'
import { useMealStore } from '@/stores/useMealStore'
import MacroBar from '@/components/MacroBar.vue'

const store = useMealStore()
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function dayCalories(day: string): number {
  const ids = store.currentWeek[day] ?? []
  return ids.reduce((sum, id) => sum + (store.getMealById(id)?.calories ?? 0), 0)
}

function barHeight(day: string): number {
  const max = Math.max(...days.map(d => dayCalories(d)), store.settings.calorieGoal)
  return Math.round((dayCalories(day) / max) * 100)
}

function isToday(day: string): boolean {
  const dayIndex = new Date().getDay()
  return days[dayIndex === 0 ? 6 : dayIndex - 1] === day
}

const todayCalories = computed(() => {
  const dayIndex = new Date().getDay()
  const today = days[dayIndex === 0 ? 6 : dayIndex - 1]
  return dayCalories(today)
})
</script>

<style scoped>
.dash-card {
  background: #1e1e1e;
  border: 2px solid #333;
  border-radius: 16px;
  padding: 16px 18px;
}
.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 14px;
}
.metric-card {
  background: #1e1e1e;
  border: 2px solid #333;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.metric-value { font-size: 26px; font-weight: 700; line-height: 1.2; }
.metric-value.ok      { color: #22c55e; }
.metric-value.over    { color: #ef4444; }
.metric-value.neutral { color: #3b82f6; }
.metric-value.purple  { color: #a855f7; }
.metric-label { font-size: 12px; color: #666; margin-top: 4px; }
.metric-sub   { font-size: 11px; color: #444; margin-top: 2px; }
.chart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #2a2a2a;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #666;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
</style>