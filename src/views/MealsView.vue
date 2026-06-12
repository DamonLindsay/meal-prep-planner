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
      <div class="max-w-lg mx-auto pb-6">

        <div v-if="store.meals.length === 0" class="empty-state">
          <IonIcon :icon="restaurant" style="font-size: 48px; opacity: 0.3" />
          <p class="mt-3 text-gray-400">No meals yet. Tap + to add your first.</p>
        </div>

        <div v-for="meal in store.meals" :key="meal.id" class="meal-card mb-4">

          <!-- Top row: name + actions -->
          <div class="flex justify-between items-start gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="meal-name">{{ meal.name }}</span>
              <span class="cat-tag" :class="'cat-' + meal.category">{{ catLabel(meal.category) }}</span>
            </div>
            <div class="flex gap-1 shrink-0">
              <button class="icon-btn" @click="openModal(meal.id)">
                <IonIcon :icon="pencil" />
              </button>
              <button class="icon-btn danger" @click="confirmDelete(meal.id)">
                <IonIcon :icon="trash" />
              </button>
            </div>
          </div>

          <!-- Macro pills -->
          <div class="flex gap-2 flex-wrap mt-2">
            <span class="macro-pill kcal">{{ meal.calories }} kcal</span>
            <span class="macro-pill pro">{{ meal.protein }}g protein</span>
            <span class="macro-pill carb">{{ meal.carbs }}g carbs</span>
            <span class="macro-pill fat">{{ meal.fat }}g fat</span>
          </div>

          <!-- Expand toggle -->
          <button class="expand-btn mt-2" @click="toggleExpand(meal.id)">
            <IonIcon :icon="expanded.has(meal.id) ? chevronUp : chevronDown" />
            <span>{{ expanded.has(meal.id) ? 'Less' : 'Ingredients & method' }}</span>
          </button>

          <!-- Expanded content -->
          <div v-if="expanded.has(meal.id)" class="expand-content mt-2">
            <div class="flex flex-wrap gap-1 mb-2">
              <span v-for="ing in meal.ingredients" :key="ing" class="ingr-chip">{{ ing }}</span>
            </div>
            <p v-if="meal.method" class="text-xs text-gray-400 leading-relaxed">{{ meal.method }}</p>
          </div>

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
  IonButton, IonButtons, IonIcon, IonModal, IonItem,
  IonLabel, IonInput, IonSelect, IonSelectOption,
  IonTextarea, alertController
} from '@ionic/vue'
import { ref, reactive } from 'vue'
import { add, pencil, trash, restaurant, chevronDown, chevronUp } from 'ionicons/icons'
import { useMealStore } from '@/stores/useMealStore'
import type { Meal, MealCategory } from '@/types'

const store = useMealStore()
const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const newIngredient = ref('')
const expanded = ref<Set<string>>(new Set())

function toggleExpand(id: string) {
  if (expanded.value.has(id)) {
    expanded.value.delete(id)
  } else {
    expanded.value.add(id)
  }
}

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
  editingId.value ? store.updateMeal(meal) : store.addMeal(meal)
  closeModal()
}

async function confirmDelete(id: string) {
  const alert = await alertController.create({
    header: 'Delete meal',
    message: 'Are you sure?',
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
</script>

<style scoped>
.meal-card {
  background: #1e1e1e;
  border: 2px solid #333;
  border-radius: 16px;
  padding: 16px;
  transition: border-color 0.2s;
}
.meal-card:hover {
  border-color: #555;
}
.meal-name {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}
.icon-btn {
  background: #2a2a2a;
  border: 1px solid #333;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #888;
  font-size: 16px;
  display: flex;
  align-items: center;
}
.icon-btn:hover { background: #333; color: #fff; }
.icon-btn.danger { color: #ef4444; }
.icon-btn.danger:hover { background: #ef444420; }
.macro-pill {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 600;
  border: 1.5px solid;
}
.macro-pill.kcal { border-color: #22c55e; color: #22c55e; }
.macro-pill.pro  { border-color: #a855f7; color: #a855f7; }
.macro-pill.carb { border-color: #f97316; color: #f97316; }
.macro-pill.fat  { border-color: #3b82f6; color: #3b82f6; }
.expand-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #555;
  font-size: 12px;
  padding: 0;
  margin-top: 8px;
}
.expand-btn:hover { color: #888; }
.expand-content {
  border-top: 1px solid #2a2a2a;
  padding-top: 10px;
  margin-top: 8px;
}
.ingr-chip {
  font-size: 12px;
  background: #2a2a2a;
  border: 1px solid #333;
  padding: 3px 10px;
  border-radius: 8px;
  color: #aaa;
}
.cat-tag {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 999px;
  font-weight: 600;
  border: 1.5px solid;
}
.cat-protein { border-color: #1D9E75; color: #1D9E75; }
.cat-carb    { border-color: #BA7517; color: #BA7517; }
.cat-veg     { border-color: #639922; color: #639922; }
.cat-dairy   { border-color: #378ADD; color: #378ADD; }
.cat-other   { border-color: #888780; color: #888780; }
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}
</style>