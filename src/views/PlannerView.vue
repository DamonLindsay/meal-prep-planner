<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Planner</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="store.autoFill()">Auto-fill</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="max-w-lg mx-auto">

        <div v-if="lastWeekMealCount > 0" class="info-banner mb-4">
          <IonIcon :icon="informationCircle" />
          Auto-fill avoids meals you had last week.
        </div>

        <div v-for="day in days" :key="day" class="mb-3">
          <div class="day-header">
            <span class="font-medium">{{ day }}</span>
            <span class="text-sm text-gray-400">{{ dayCalories(day) > 0 ? dayCalories(day) + ' kcal' : '' }}</span>
          </div>

          <!-- Planned meals for this day -->
          <div
            v-for="mealId in store.currentWeek[day] ?? []"
            :key="mealId"
            class="meal-row"
          >
            <div class="flex-1">
              <p class="font-medium text-sm">{{ store.getMealById(mealId)?.name }}</p>
              <p class="text-xs text-gray-400">{{ store.getMealById(mealId)?.calories }} kcal</p>
            </div>
            <IonButton fill="clear" size="small" color="danger" @click="store.removeMealFromDay(day, mealId)">
              <IonIcon :icon="closeCircle" />
            </IonButton>
          </div>

          <!-- Empty state -->
          <div v-if="!store.currentWeek[day]?.length" class="empty-day">
            No meals planned
          </div>

          <!-- Add meal to day -->
          <IonSelect
            placeholder="+ Add meal"
            class="add-select"
            :value="null"
            @ionChange="(e: CustomEvent) => addToDay(day, e.detail.value)"
          >
            <IonSelectOption
              v-for="meal in store.meals"
              :key="meal.id"
              :value="meal.id"
            >
              {{ meal.name }} ({{ meal.calories }} kcal)
            </IonSelectOption>
          </IonSelect>
        </div>

        <!-- Week actions -->
        <div class="flex gap-3 mt-4 mb-6">
          <IonButton expand="block" fill="outline" color="warning" class="flex-1" @click="confirmArchive">
            <IonIcon :icon="archive" slot="start" />
            Archive week
          </IonButton>
          <IonButton expand="block" fill="outline" color="danger" class="flex-1" @click="confirmClear">
            <IonIcon :icon="trash" slot="start" />
            Clear week
          </IonButton>
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
import { closeCircle, trash, archive, informationCircle } from 'ionicons/icons'
import { useMealStore } from '@/stores/useMealStore'

const store = useMealStore()
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function dayCalories(day: string): number {
  const ids = store.currentWeek[day] ?? []
  return ids.reduce((sum, id) => sum + (store.getMealById(id)?.calories ?? 0), 0)
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
    message: 'This saves the current week as last week and clears the planner for a fresh start.',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Archive', handler: () => store.archiveWeek() }
    ]
  })
  await alert.present()
}
</script>

<style scoped>
.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 0.5px solid var(--ion-color-step-150);
  margin-bottom: 6px;
}
.meal-row {
  display: flex;
  align-items: center;
  background: var(--ion-color-step-50);
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 6px;
}
.empty-day {
  font-size: 13px;
  color: var(--ion-color-medium);
  padding: 6px 0;
  font-style: italic;
}
.add-select {
  font-size: 13px;
  margin-top: 4px;
}
.info-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 10px 12px;
  background: var(--ion-color-primary-tint);
  border-radius: 8px;
  color: var(--ion-color-primary);
}
</style>