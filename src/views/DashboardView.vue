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
        <div class="dash-card mb-3">
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

        <!-- Weekly macros — compared against daily goal × 7 -->
        <div class="dash-card mb-3">
          <p class="card-title">Weekly macros</p>
          <MacroBar label="Protein" :value="store.weeklyProtein" :goal="store.settings.proteinGoal * 7" unit="g" color="#a855f7" overColor="#ef4444" />
          <MacroBar label="Carbs" :value="store.weeklyCarbs" :goal="store.settings.carbGoal * 7" unit="g" color="#f97316" overColor="#ef4444" />
          <MacroBar label="Fat" :value="store.weeklyFat" :goal="store.settings.fatGoal * 7" unit="g" color="#3b82f6" overColor="#ef4444" />
        </div>

        <!-- Weekly calorie chart -->
        <div class="dash-card">
          <p class="card-title">This week at a glance</p>
          <div class="flex gap-2 items-end justify-between mt-2" style="height: 120px">
            <div
              v-for="day in days"
              :key="day"
              class="flex flex-col items-center flex-1 gap-1 h-full"
            >
              <span class="text-xs font-medium leading-none mb-1" style="min-height: 14px"
                :class="dayCalories(day) > store.settings.calorieGoal ? 'text-red-400' : dayCalories(day) > 0 ? 'text-green-400' : 'text-transparent'">
                {{ dayCalories(day) > 0 ? dayCalories(day) : '0' }}
              </span>
              <div class="w-full flex items-end flex-1">
                <div
                  class="w-full rounded transition-all duration-500"
                  :style="{
                    height: barHeight(day) + '%',
                    minHeight: dayCalories(day) > 0 ? '6px' : '2px',
                    background: dayCalories(day) > store.settings.calorieGoal
                      ? '#ef4444'
                      : dayCalories(day) > 0
                      ? '#22c55e'
                      : 'var(--ion-color-step-100)'
                  }"
                ></div>
              </div>
              <span class="text-xs leading-none mt-1"
                :class="isToday(day) ? 'text-white font-semibold' : 'text-gray-500'">
                {{ day.slice(0,1) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-3 pt-3" style="border-top: 0.5px solid var(--ion-color-step-150)">
            <span class="text-xs text-gray-500">Daily goal: {{ store.settings.calorieGoal.toLocaleString() }} kcal</span>
            <div class="flex items-center gap-1 ml-auto">
              <span class="legend-dot" style="background:#22c55e"></span>
              <span class="text-xs text-gray-500">On track</span>
              <span class="legend-dot ml-2" style="background:#ef4444"></span>
              <span class="text-xs text-gray-500">Over</span>
            </div>
          </div>
        </div>

      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent
} from '@ionic/vue'
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
  background: var(--ion-card-background);
  border: 1.5px solid var(--ion-color-step-300);
  border-radius: 12px;
  padding: 1rem 1.25rem;
}
.card-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--ion-text-color);
}
.metric-card {
  background: var(--ion-card-background);
  border: 1.5px solid var(--ion-color-step-300);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.metric-value {
  font-size: 26px;
  font-weight: 600;
  line-height: 1.2;
}
.metric-value.ok     { color: #22c55e; }
.metric-value.over   { color: #ef4444; }
.metric-value.neutral{ color: #3b82f6; }
.metric-value.purple { color: #a855f7; }
.metric-label {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-top: 3px;
}
.metric-sub {
  font-size: 11px;
  color: var(--ion-color-step-400);
  margin-top: 2px;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
</style>