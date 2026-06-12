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
            <span class="metric-value">{{ todayCalories.toLocaleString() }}</span>
            <span class="metric-label">Today's kcal</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">{{ store.weeklyCalories.toLocaleString() }}</span>
            <span class="metric-label">Week total kcal</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">{{ store.totalMealsThisWeek }}</span>
            <span class="metric-label">Meals planned</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">{{ store.meals.length }}</span>
            <span class="metric-label">Saved meals</span>
          </div>
        </div>

        <!-- Today's calories -->
        <IonCard>
          <IonCardHeader>
            <IonCardTitle class="text-base">Today's intake</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <MacroBar
              label="Calories"
              :value="todayCalories"
              :goal="store.settings.calorieGoal"
              unit="kcal"
              color="#378ADD"
            />
          </IonCardContent>
        </IonCard>

        <!-- Weekly macros -->
        <IonCard>
          <IonCardHeader>
            <IonCardTitle class="text-base">Weekly macros</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <MacroBar label="Protein" :value="store.weeklyProtein" :goal="store.settings.proteinGoal" unit="g" color="#1D9E75" />
            <MacroBar label="Carbs" :value="store.weeklyCarbs" :goal="store.settings.carbGoal" unit="g" color="#BA7517" />
            <MacroBar label="Fat" :value="store.weeklyFat" :goal="store.settings.fatGoal" unit="g" color="#993556" />
          </IonCardContent>
        </IonCard>

        <!-- Weekly calorie chart -->
        <IonCard>
          <IonCardHeader>
            <IonCardTitle class="text-base">This week at a glance</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div class="flex gap-1 items-end justify-between" style="height: 96px">
              <div
                v-for="day in days"
                :key="day"
                class="flex flex-col items-center flex-1 gap-1 h-full"
              >
                <div class="w-full flex items-end flex-1">
                  <div
                    class="w-full rounded-sm transition-all duration-300"
                    :style="{
                      height: barHeight(day) + '%',
                      minHeight: dayCalories(day) > 0 ? '4px' : '0',
                      background: dayCalories(day) > store.settings.calorieGoal ? '#E24B4A' : '#378ADD'
                    }"
                  ></div>
                </div>
                <span class="text-xs text-gray-400 shrink-0">{{ day.slice(0, 1) }}</span>
              </div>
            </div>
            <!-- Full day labels below on wider screens -->
            <div class="hidden sm:flex justify-between mt-1">
              <span v-for="day in days" :key="day" class="text-xs text-gray-400 flex-1 text-center">{{ day }}</span>
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

const todayCalories = computed(() => {
  const dayIndex = new Date().getDay()
  const today = days[dayIndex === 0 ? 6 : dayIndex - 1]
  return dayCalories(today)
})
</script>

<style scoped>
.metric-card {
  background: var(--ion-color-step-50, #1e1e1e);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.metric-value {
  font-size: 24px;
  font-weight: 500;
}
.metric-label {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-top: 2px;
}
</style>