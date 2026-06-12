<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Dashboard</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="max-w-lg mx-auto">

        <!-- Metric cards -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="metric-card">
            <span class="metric-value" :class="todayCalories > store.settings.calorieGoal ? 'text-red-400' : 'text-green-400'">
              {{ todayCalories.toLocaleString() }}
            </span>
            <span class="metric-label">Today's kcal</span>
            <span class="metric-sub">goal: {{ store.settings.calorieGoal.toLocaleString() }}</span>
          </div>
          <div class="metric-card">
            <span class="metric-value text-blue-400">{{ store.weeklyCalories.toLocaleString() }}</span>
            <span class="metric-label">Week total kcal</span>
            <span class="metric-sub">{{ store.totalMealsThisWeek }} meals planned</span>
          </div>
          <div class="metric-card">
            <span class="metric-value text-purple-400">{{ store.weeklyProtein }}g</span>
            <span class="metric-label">Weekly protein</span>
            <span class="metric-sub">goal: {{ store.settings.proteinGoal }}g</span>
          </div>
          <div class="metric-card">
            <span class="metric-value text-orange-400">{{ store.meals.length }}</span>
            <span class="metric-label">Saved meals</span>
            <span class="metric-sub">in your library</span>
          </div>
        </div>

        <!-- Today's intake -->
        <IonCard class="mb-3">
          <IonCardHeader>
            <IonCardTitle class="text-base">Today's intake</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <MacroBar label="Calories" :value="todayCalories" :goal="store.settings.calorieGoal" unit="kcal" color="#22c55e" overColor="#ef4444" />
          </IonCardContent>
        </IonCard>

        <!-- Weekly macros -->
        <IonCard class="mb-3">
          <IonCardHeader>
            <IonCardTitle class="text-base">Weekly macros</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <MacroBar label="Protein" :value="store.weeklyProtein" :goal="store.settings.proteinGoal" unit="g" color="#a855f7" overColor="#ef4444" />
            <MacroBar label="Carbs" :value="store.weeklyCarbs" :goal="store.settings.carbGoal" unit="g" color="#f97316" overColor="#ef4444" />
            <MacroBar label="Fat" :value="store.weeklyFat" :goal="store.settings.fatGoal" unit="g" color="#3b82f6" overColor="#ef4444" />
          </IonCardContent>
        </IonCard>

        <!-- Weekly calorie chart -->
        <IonCard>
          <IonCardHeader>
            <IonCardTitle class="text-base">This week at a glance</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div class="flex gap-2 items-end justify-between" style="height: 140px">
              <div
                v-for="day in days"
                :key="day"
                class="flex flex-col items-center flex-1 gap-1 h-full"
              >
                <!-- Calorie label on top of bar -->
                <span class="text-xs font-medium mb-1" :class="dayCalories(day) > store.settings.calorieGoal ? 'text-red-400' : dayCalories(day) > 0 ? 'text-green-400' : 'text-gray-600'">
                  {{ dayCalories(day) > 0 ? dayCalories(day) : '' }}
                </span>
                <div class="w-full flex items-end flex-1">
                  <div
                    class="w-full rounded transition-all duration-500"
                    :style="{
                      height: barHeight(day) + '%',
                      minHeight: dayCalories(day) > 0 ? '6px' : '0',
                      background: dayCalories(day) > store.settings.calorieGoal
                        ? 'linear-gradient(to top, #dc2626, #f87171)'
                        : dayCalories(day) > 0
                        ? 'linear-gradient(to top, #16a34a, #4ade80)'
                        : 'transparent'
                    }"
                  ></div>
                </div>
                <span class="text-xs font-medium" :class="isToday(day) ? 'text-white' : 'text-gray-500'">{{ day }}</span>
              </div>
            </div>
            <!-- Goal line label -->
            <div class="flex items-center gap-2 mt-3">
              <div class="h-px flex-1 border-t border-dashed border-gray-600"></div>
              <span class="text-xs text-gray-500">Daily goal: {{ store.settings.calorieGoal.toLocaleString() }} kcal</span>
              <div class="h-px flex-1 border-t border-dashed border-gray-600"></div>
            </div>
          </IonCardContent>
        </IonCard>

      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent
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
.metric-card {
  background: var(--ion-color-step-50, #1a1a1a);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 0.5px solid var(--ion-color-step-100);
}
.metric-value {
  font-size: 26px;
  font-weight: 600;
  line-height: 1.2;
}
.metric-label {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-top: 2px;
}
.metric-sub {
  font-size: 11px;
  color: var(--ion-color-step-400);
  margin-top: 2px;
}
</style>