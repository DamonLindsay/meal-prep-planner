<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Planner</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="store.autoFill()">
            <IonIcon :icon="sparkles" slot="start" />
            Auto-fill
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="max-w-lg mx-auto pb-6">

        <div v-if="lastWeekMealCount > 0" class="info-banner mb-4">
          <IonIcon :icon="informationCircle" />
          <span>Auto-fill avoids meals you had last week.</span>
        </div>

        <!-- Day cards -->
        <div v-for="day in days" :key="day" class="day-card mb-4">

          <!-- Day header -->
          <div class="day-header">
            <div class="flex items-center gap-2">
              <span class="day-label" :class="isToday(day) ? 'today' : ''">{{ day }}</span>
              <span v-if="isToday(day)" class="today-badge">Today</span>
            </div>
            <span class="day-kcal" v-if="dayCalories(day) > 0">
              {{ dayCalories(day).toLocaleString() }} kcal
            </span>
          </div>

          <!-- Planned meals -->
          <div class="meals-area">
            <div
              v-for="mealId in store.currentWeek[day] ?? []"
              :key="mealId"
              class="planned-meal"
            >
              <div class="flex-1">
                <p class="planned-meal-name">{{ store.getMealById(mealId)?.name }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="planned-pill">{{ store.getMealById(mealId)?.calories }} kcal</span>
                  <span class="planned-pill">{{ store.getMealById(mealId)?.protein }}g protein</span>
                </div>
              </div>
              <button class="remove-btn" @click="store.removeMealFromDay(day, mealId)">
                <IonIcon :icon="closeCircle" />
              </button>
            </div>

            <div v-if="!store.currentWeek[day]?.length" class="empty-day">
              No meals planned yet
            </div>
          </div>

          <!-- Add meal select -->
          <div class="add-row">
            <IonSelect
              placeholder="＋ Add a meal"
              interface="action-sheet"
              class="add-select"
              :value="null"
              @ionChange="(e: CustomEvent) => addToDay(day, e.detail.value)"
            >
              <IonSelectOption
                v-for="meal in store.meals"
                :key="meal.id"
                :value="meal.id"
              >
                {{ meal.name }} — {{ meal.calories }} kcal
              </IonSelectOption>
            </IonSelect>
          </div>

        </div>

        <!-- Week actions -->
        <div class="flex gap-3 mt-2">
          <button class="action-btn warning flex-1" @click="confirmArchive">
            <IonIcon :icon="archive" />
            Archive week
          </button>
          <button class="action-btn danger flex-1" @click="confirmClear">
            <IonIcon :icon="trash" />
            Clear week
          </button>
        </div>

      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon, IonSelect, IonSelectOption,
  alertController
} from '@ionic/vue'
import { computed } from 'vue'
import { closeCircle, trash, archive, informationCircle, sparkles } from 'ionicons/icons'
import { useMealStore } from '@/stores/useMealStore'

const store = useMealStore()
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function dayCalories(day: string): number {
  const ids = store.currentWeek[day] ?? []
  return ids.reduce((sum, id) => sum + (store.getMealById(id)?.calories ?? 0), 0)
}

function isToday(day: string): boolean {
  const dayIndex = new Date().getDay()
  return days[dayIndex === 0 ? 6 : dayIndex - 1] === day
}

function addToDay(day: string, mealId: string) {
  if (mealId) store.addMealToDay(day, mealId)
}

const lastWeekMealCount = computed(() =>
  Object.values(store.lastWeek).flat().length
)

async function confirmClear() {
  const alert = await alertController.create({
    header: 'Clear week',
    message: 'Remove all meals from this week?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Clear', role: 'destructive', handler: () => store.clearWeek() }
    ]
  })
  await alert.present()
}

async function confirmArchive() {
  const alert = await alertController.create({
    header: 'Archive week',
    message: 'Saves this week as last week and clears the planner.',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Archive', handler: () => store.archiveWeek() }
    ]
  })
  await alert.present()
}
</script>

<style scoped>
.day-card {
  background: #1e1e1e;
  border: 2px solid #333;
  border-radius: 16px;
  overflow: hidden;
}
.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #2a2a2a;
  background: #252525;
}
.day-label {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}
.day-label.today { color: #22c55e; }
.today-badge {
  font-size: 10px;
  font-weight: 600;
  background: #22c55e20;
  color: #22c55e;
  border: 1px solid #22c55e;
  padding: 1px 7px;
  border-radius: 999px;
}
.day-kcal {
  font-size: 13px;
  font-weight: 600;
  color: #888;
}
.meals-area {
  padding: 10px 16px;
}
.planned-meal {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.planned-meal-name {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}
.planned-pill {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #333;
  color: #aaa;
  border: 1px solid #444;
}
.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ef4444;
  font-size: 20px;
  display: flex;
  align-items: center;
  padding: 0;
  opacity: 0.7;
}
.remove-btn:hover { opacity: 1; }
.empty-day {
  font-size: 13px;
  color: #555;
  font-style: italic;
  padding: 6px 0 4px;
}
.add-row {
  padding: 0 16px 12px;
  border-top: 1px solid #2a2a2a;
}
.add-select {
  font-size: 13px;
  color: #666;
  margin-top: 8px;
}
.info-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 10px 14px;
  background: #1a2a3a;
  border: 1.5px solid #1e4a7a;
  border-radius: 10px;
  color: #60a5fa;
}
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid;
  background: transparent;
  transition: background 0.15s;
}
.action-btn.warning { border-color: #f97316; color: #f97316; }
.action-btn.warning:hover { background: #f9731615; }
.action-btn.danger  { border-color: #ef4444; color: #ef4444; }
.action-btn.danger:hover  { background: #ef444415; }
</style>