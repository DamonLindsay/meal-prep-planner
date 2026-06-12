<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Meals</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="openModal()">
            <IonIcon :icon="add" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="max-w-lg mx-auto">

        <div v-if="store.meals.length === 0" class="empty-state">
          <IonIcon :icon="restaurant" class="text-5xl opacity-30 mb-3" />
          <p>No meals yet. Tap + to add your first meal.</p>
        </div>

        <div v-for="meal in store.meals" :key="meal.id">
          <IonCard>
            <IonCardContent>
              <div class="flex justify-between items-start gap-2">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-medium text-base">{{ meal.name }}</h3>
                    <span class="cat-tag" :class="catClass(meal.category)">{{ catLabel(meal.category) }}</span>
                  </div>
                  <p class="text-sm text-gray-400 mb-2">
                    {{ meal.calories }} kcal &nbsp;·&nbsp;
                    {{ meal.protein }}g protein &nbsp;·&nbsp;
                    {{ meal.carbs }}g carbs &nbsp;·&nbsp;
                    {{ meal.fat }}g fat
                  </p>
                  <div class="flex flex-wrap gap-1 mb-2">
                    <span v-for="ing in meal.ingredients" :key="ing" class="ingr-chip">{{ ing }}</span>
                  </div>
                  <p v-if="meal.method" class="text-xs text-gray-500">{{ meal.method }}</p>
                </div>
                <div class="flex flex-col gap-2 shrink-0">
                  <IonButton fill="clear" size="small" @click="openModal(meal.id)">
                    <IonIcon :icon="pencil" />
                  </IonButton>
                  <IonButton fill="clear" size="small" color="danger" @click="confirmDelete(meal.id)">
                    <IonIcon :icon="trash" />
                  </IonButton>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

      </div>
    </IonContent>

    <!-- Add/Edit Modal -->
    <IonModal :is-open="modalOpen" @did-dismiss="closeModal">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{{ editingId ? 'Edit meal' : 'Add meal' }}</IonTitle>
          <IonButtons slot="end">
            <IonButton @click="closeModal">Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <div class="max-w-lg mx-auto">

          <IonItem>
            <IonLabel position="stacked">Meal name</IonLabel>
            <IonInput v-model="form.name" placeholder="e.g. Chicken stir-fry" />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Category</IonLabel>
            <IonSelect v-model="form.category">
              <IonSelectOption value="protein">Protein-based</IonSelectOption>
              <IonSelectOption value="carb">Carb-based</IonSelectOption>
              <IonSelectOption value="veg">Vegetable-heavy</IonSelectOption>
              <IonSelectOption value="dairy">Dairy</IonSelectOption>
              <IonSelectOption value="other">Other</IonSelectOption>
            </IonSelect>
          </IonItem>

          <div class="grid grid-cols-2 gap-2 mt-2">
            <IonItem>
              <IonLabel position="stacked">Calories</IonLabel>
              <IonInput v-model.number="form.calories" type="number" placeholder="450" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Protein (g)</IonLabel>
              <IonInput v-model.number="form.protein" type="number" placeholder="35" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Carbs (g)</IonLabel>
              <IonInput v-model.number="form.carbs" type="number" placeholder="60" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Fat (g)</IonLabel>
              <IonInput v-model.number="form.fat" type="number" placeholder="12" />
            </IonItem>
          </div>

          <div class="mt-4">
            <p class="text-sm text-gray-400 mb-2">Ingredients</p>
            <div class="flex gap-2 mb-2">
              <IonInput
                v-model="newIngredient"
                placeholder="e.g. 200g chicken breast"
                class="flex-1"
                @keyup.enter="addIngredient"
              />
              <IonButton @click="addIngredient">Add</IonButton>
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(ing, i) in form.ingredients"
                :key="i"
                class="ingr-chip cursor-pointer"
                @click="removeIngredient(i)"
              >
                {{ ing }} ×
              </span>
            </div>
          </div>

          <IonItem class="mt-2">
            <IonLabel position="stacked">Method</IonLabel>
            <IonTextarea v-model="form.method" :rows="3" placeholder="How to prepare this meal..." />
          </IonItem>

          <IonButton expand="block" class="mt-4" @click="saveMeal">
            {{ editingId ? 'Save changes' : 'Add meal' }}
          </IonButton>

        </div>
      </IonContent>
    </IonModal>

  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonButton, IonButtons, IonIcon,
  IonModal, IonItem, IonLabel, IonInput, IonSelect,
  IonSelectOption, IonTextarea, alertController
} from '@ionic/vue'
import { ref, reactive } from 'vue'
import { add, pencil, trash, restaurant } from 'ionicons/icons'
import { useMealStore } from '@/stores/useMealStore'
import type { Meal, MealCategory } from '@/types'

const store = useMealStore()

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const newIngredient = ref('')

const form = reactive({
  name: '',
  category: 'protein' as MealCategory,
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  ingredients: [] as string[],
  method: ''
})

function resetForm() {
  form.name = ''
  form.category = 'protein'
  form.calories = 0
  form.protein = 0
  form.carbs = 0
  form.fat = 0
  form.ingredients = []
  form.method = ''
  newIngredient.value = ''
}

function openModal(id?: string) {
  resetForm()
  editingId.value = id ?? null
  if (id) {
    const meal = store.getMealById(id)
    if (meal) {
      form.name = meal.name
      form.category = meal.category
      form.calories = meal.calories
      form.protein = meal.protein
      form.carbs = meal.carbs
      form.fat = meal.fat
      form.ingredients = [...meal.ingredients]
      form.method = meal.method
    }
  }
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingId.value = null
}

function addIngredient() {
  const val = newIngredient.value.trim()
  if (val) {
    form.ingredients.push(val)
    newIngredient.value = ''
  }
}

function removeIngredient(index: number) {
  form.ingredients.splice(index, 1)
}

function saveMeal() {
  if (!form.name.trim()) return
  const meal: Meal = {
    id: editingId.value ?? Date.now().toString(),
    name: form.name.trim(),
    category: form.category,
    calories: form.calories,
    protein: form.protein,
    carbs: form.carbs,
    fat: form.fat,
    ingredients: [...form.ingredients],
    method: form.method.trim()
  }
  if (editingId.value) {
    store.updateMeal(meal)
  } else {
    store.addMeal(meal)
  }
  closeModal()
}

async function confirmDelete(id: string) {
  const alert = await alertController.create({
    header: 'Delete meal',
    message: 'Are you sure you want to delete this meal?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Delete', role: 'destructive', handler: () => store.deleteMeal(id) }
    ]
  })
  await alert.present()
}

function catLabel(cat: string) {
  const labels: Record<string, string> = {
    protein: 'Protein', carb: 'Carb', veg: 'Veg', dairy: 'Dairy', other: 'Other'
  }
  return labels[cat] ?? cat
}

function catClass(cat: string) {
  return `cat-${cat}`
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--ion-color-medium);
}
.ingr-chip {
  font-size: 12px;
  background: var(--ion-color-step-100);
  padding: 2px 8px;
  border-radius: 8px;
}
.cat-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 500;
}
.cat-protein { background: #0f6e5620; color: #1D9E75; }
.cat-carb    { background: #ba751720; color: #BA7517; }
.cat-veg     { background: #3b6d1120; color: #639922; }
.cat-dairy   { background: #185fa520; color: #378ADD; }
.cat-other   { background: #5f5e5a20; color: #888780; }
</style>