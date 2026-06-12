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

        <div v-for="day in days" :key="day" class="day-card mb-4">

          <div class="day-header">
            <div class="flex items-center gap-2">
              <span class="day-label" :class="isToday(day) ? 'today' : ''">{{ day }}</span>
              <span v-if="isToday(day)" class="today-badge">Today</span>
            </div>
            <span class="day-kcal" v-if="dayCalories(day) > 0">
              {{ dayCalories(day).toLocaleString() }} kcal
            </span>
          </div>

          <div class="meals-area">
            <div
              v-for="mealId in store.currentWeek[day] ?? []"
              :key="mealId"
              class="planned-meal"
              @click="openPicker(day, mealId)"
            >
              <div class="flex-1">
                <div class="flex justify-between items-center mb-2">
                  <p class="planned-meal-name">{{ store.getMealById(mealId)?.name }}</p>
                  <span class="kcal-badge">{{ store.getMealById(mealId)?.calories }} kcal</span>
                </div>
                <div class="macro-bars">
                  <div class="macro-bar-row">
                    <span class="macro-bar-label">Protein</span>
                    <div class="macro-bar-track">
                      <div class="macro-bar-fill protein" :style="{ width: macroPct(mealId, 'protein', store.settings.proteinGoal) + '%' }"></div>
                    </div>
                    <span class="macro-bar-val protein-text">{{ store.getMealById(mealId)?.protein }}g</span>
                  </div>
                  <div class="macro-bar-row">
                    <span class="macro-bar-label">Carbs</span>
                    <div class="macro-bar-track">
                      <div class="macro-bar-fill carbs" :style="{ width: macroPct(mealId, 'carbs', store.settings.carbGoal) + '%' }"></div>
                    </div>
                    <span class="macro-bar-val carbs-text">{{ store.getMealById(mealId)?.carbs }}g</span>
                  </div>
                  <div class="macro-bar-row">
                    <span class="macro-bar-label">Fat</span>
                    <div class="macro-bar-track">
                      <div class="macro-bar-fill fat" :style="{ width: macroPct(mealId, 'fat', store.settings.fatGoal) + '%' }"></div>
                    </div>
                    <span class="macro-bar-val fat-text">{{ store.getMealById(mealId)?.fat }}g</span>
                  </div>
                </div>
              </div>
              <button class="remove-btn" @click.stop="store.removeMealFromDay(day, mealId)">
                <IonIcon :icon="closeCircle" />
              </button>
            </div>

            <div v-if="!store.currentWeek[day]?.length" class="empty-day">
              No meals planned yet
            </div>
          </div>

          <div class="add-row" v-if="!store.currentWeek[day]?.length">
            <button class="add-meal-btn" @click="openPicker(day, null)">
              <IonIcon :icon="addCircleOutline" /> Add a meal
            </button>
          </div>

        </div>

        <div class="flex gap-3 mt-2">
          <button class="action-btn warning flex-1" @click="confirmArchive">
            <IonIcon :icon="archive" /> Archive week
          </button>
          <button class="action-btn danger flex-1" @click="confirmClear">
            <IonIcon :icon="trash" /> Clear week
          </button>
        </div>

      </div>
    </IonContent>

    <IonActionSheet
      :is-open="pickerOpen"
      :header="pickerReplacingId ? 'Swap meal' : 'Add meal'"
      :buttons="pickerButtons"
      @did-dismiss="pickerOpen = false"
    />

  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon, IonActionSheet,
  alertController
} from '@ionic/vue'
import { ref, computed } from 'vue'
import { closeCircle, trash, archive, informationCircle, sparkles, addCircleOutline } from 'ionicons/icons'
import { useMealStore } from '@/stores/useMealStore'

const store = useMealStore()
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const pickerOpen = ref(false)
const pickerDay = ref('')
const pickerReplacingId = ref<string | null>(null)

function dayCalories(day: string): number {
  const ids = store.currentWeek[day] ?? []
  return ids.reduce((sum, id) => sum + (store.getMealById(id)?.calories ?? 0), 0)
}

function isToday(day: string): boolean {
  const dayIndex = new Date().getDay()
  return days[dayIndex === 0 ? 6 : dayIndex - 1] === day
}

function macroPct(mealId: string, key: 'protein' | 'carbs' | 'fat', goal: number): number {
  const meal = store.getMealById(mealId)
  if (!meal) return 0
  return Math.min(100, Math.round((meal[key] / goal) * 100))
}

function openPicker(day: string, replacingId: string | null) {
  pickerDay.value = day
  pickerReplacingId.value = replacingId
  pickerOpen.value = true
}

const lastWeekMealCount = computed(() =>
  Object.values(store.lastWeek).flat().length
)

const pickerButtons = computed(() => [
  ...store.meals.map(meal => ({
    text: `${meal.name} — ${meal.calories} kcal`,
    handler: () => {
      if (pickerReplacingId.value) {
        store.removeMealFromDay(pickerDay.value, pickerReplacingId.value)
      }
      store.addMealToDay(pickerDay.value, meal.id)
    }
  })),
  { text: 'Cancel', role: 'cancel' }
])

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
.day-label { font-size: 15px; font-weight: 600; color: #fff; }
.day-label.today { color: #22c55e; }
.today-badge {
  font-size: 10px; font-weight: 600;
  background: #22c55e20; color: #22c55e;
  border: 1px solid #22c55e;
  padding: 1px 7px; border-radius: 999px;
}
.day-kcal { font-size: 13px; font-weight: 600; color: #888; }
.meals-area { padding: 10px 16px; }
.planned-meal {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.planned-meal:hover { border-color: #555; }
.planned-meal-name { font-size: 14px; font-weight: 500; color: #fff; }
.remove-btn {
  background: transparent; border: none; cursor: pointer;
  color: #ef4444; font-size: 20px;
  display: flex; align-items: center;
  padding: 0; opacity: 0.7; flex-shrink: 0;
}
.remove-btn:hover { opacity: 1; }
.empty-day { font-size: 13px; color: #555; font-style: italic; padding: 6px 0 4px; }
.add-row { padding: 8px 16px 12px; border-top: 1px solid #2a2a2a; }
.add-meal-btn {
  display: flex; align-items: center; justify-content: center;
  gap: 6px; background: transparent;
  border: 1.5px dashed #333; border-radius: 10px;
  padding: 8px 14px; color: #555; font-size: 13px;
  cursor: pointer; width: 100%; transition: all 0.15s;
}
.add-meal-btn:hover { border-color: #555; color: #888; }
.info-banner {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; padding: 10px 14px;
  background: #1a2a3a; border: 1.5px solid #1e4a7a;
  border-radius: 10px; color: #60a5fa;
}
.action-btn {
  display: flex; align-items: center; justify-content: center;
  gap: 8px; padding: 12px; border-radius: 12px;
  font-size: 14px; font-weight: 600; cursor: pointer;
  border: 2px solid; background: transparent; transition: background 0.15s;
}
.action-btn.warning { border-color: #f97316; color: #f97316; }
.action-btn.warning:hover { background: #f9731615; }
.action-btn.danger { border-color: #ef4444; color: #ef4444; }
.action-btn.danger:hover { background: #ef444415; }
.kcal-badge {
  font-size: 12px; font-weight: 600; color: #22c55e;
  background: #22c55e15; border: 1px solid #22c55e40;
  padding: 2px 10px; border-radius: 999px;
}
.macro-bars { display: flex; flex-direction: column; gap: 5px; }
.macro-bar-row { display: flex; align-items: center; gap: 8px; }
.macro-bar-label { font-size: 11px; color: #666; width: 44px; flex-shrink: 0; }
.macro-bar-track {
  flex: 1; height: 6px; background: #222;
  border-radius: 999px; overflow: hidden; border: 1px solid #333;
}
.macro-bar-fill { height: 100%; border-radius: 999px; transition: width 0.4s; }
.macro-bar-fill.protein { background: #a855f7; }
.macro-bar-fill.carbs   { background: #f97316; }
.macro-bar-fill.fat     { background: #3b82f6; }
.macro-bar-val { font-size: 11px; font-weight: 600; width: 32px; text-align: right; flex-shrink: 0; }
.protein-text { color: #a855f7; }
.carbs-text   { color: #f97316; }
.fat-text     { color: #3b82f6; }
</style>