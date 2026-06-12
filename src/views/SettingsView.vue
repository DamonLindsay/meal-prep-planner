<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="max-w-lg mx-auto">

        <p class="section-label">Daily targets</p>

        <IonCard>
          <IonCardContent>
            <div class="grid grid-cols-2 gap-3">
              <div class="target-input">
                <label>Calories (kcal)</label>
                <IonInput v-model.number="form.calorieGoal" type="number" fill="outline" />
              </div>
              <div class="target-input">
                <label>Protein (g)</label>
                <IonInput v-model.number="form.proteinGoal" type="number" fill="outline" />
              </div>
              <div class="target-input">
                <label>Carbs (g)</label>
                <IonInput v-model.number="form.carbGoal" type="number" fill="outline" />
              </div>
              <div class="target-input">
                <label>Fat (g)</label>
                <IonInput v-model.number="form.fatGoal" type="number" fill="outline" />
              </div>
            </div>
            <IonButton expand="block" class="mt-4" @click="saveSettings">
              Save targets
            </IonButton>
          </IonCardContent>
        </IonCard>

        <p class="section-label mt-4">Week management</p>

        <IonCard>
          <IonCardContent>
            <p class="text-sm text-gray-400 mb-3">
              Archive this week's plan before starting a new one.
              Auto-fill will avoid meals from last week.
            </p>
            <IonButton expand="block" fill="outline" color="warning" @click="confirmArchive">
              <IonIcon :icon="archive" slot="start" />
              Archive this week
            </IonButton>
          </IonCardContent>
        </IonCard>

        <p class="section-label mt-4">About</p>

        <IonCard>
          <IonCardContent>
            <div class="flex justify-between text-sm py-1">
              <span class="text-gray-400">App</span>
              <span>Meal Prep Planner</span>
            </div>
            <div class="flex justify-between text-sm py-1">
              <span class="text-gray-400">Meals saved</span>
              <span>{{ store.meals.length }}</span>
            </div>
            <div class="flex justify-between text-sm py-1">
              <span class="text-gray-400">Meals this week</span>
              <span>{{ store.totalMealsThisWeek }}</span>
            </div>
          </IonCardContent>
        </IonCard>

      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonButton, IonIcon, IonInput,
  alertController, toastController
} from '@ionic/vue'
import { reactive } from 'vue'
import { archive } from 'ionicons/icons'
import { useMealStore } from '@/stores/useMealStore'

const store = useMealStore()

const form = reactive({
  calorieGoal: store.settings.calorieGoal,
  proteinGoal: store.settings.proteinGoal,
  carbGoal: store.settings.carbGoal,
  fatGoal: store.settings.fatGoal
})

async function saveSettings() {
  store.updateSettings({ ...form })
  const toast = await toastController.create({
    message: 'Targets saved',
    duration: 1500,
    position: 'bottom',
    color: 'success'
  })
  await toast.present()
}

async function confirmArchive() {
  const alert = await alertController.create({
    header: 'Archive week',
    message: 'This saves the current week as last week and clears the planner for a fresh start.',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Archive',
        handler: async () => {
          store.archiveWeek()
          const toast = await toastController.create({
            message: 'Week archived. Planner cleared.',
            duration: 2000,
            position: 'bottom',
            color: 'warning'
          })
          await toast.present()
        }
      }
    ]
  })
  await alert.present()
}
</script>

<style scoped>
.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ion-color-medium);
  margin-bottom: 8px;
}
.target-input label {
  font-size: 13px;
  color: var(--ion-color-medium);
  display: block;
  margin-bottom: 4px;
}
</style>