import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Meal, WeekPlan, Settings } from '@/types'
import { defaultMeals } from '@/data/meals'

const STORAGE_KEY = 'meal-prep-planner'

function getWeekKey(date: Date): string {
  const d = new Date(date)
  const day = d.getDay() === 0 ? 6 : d.getDay() - 1
  d.setDate(d.getDate() - day)
  return d.toISOString().slice(0, 10)
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToStorage(data: object) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useMealStore = defineStore('meals', () => {
  const saved = loadFromStorage()

  const meals = ref<Meal[]>(saved?.meals ?? defaultMeals)
  const currentWeek = ref<WeekPlan>(saved?.currentWeek ?? {})
  const lastWeek = ref<WeekPlan>(saved?.lastWeek ?? {})
  const weekHistory = ref<Record<string, WeekPlan>>(saved?.weekHistory ?? {})
  const settings = ref<Settings>(saved?.settings ?? {
    calorieGoal: 2000,
    proteinGoal: 150,
    carbGoal: 200,
    fatGoal: 65
  })
  const lastKnownWeekKey = ref<string>(saved?.lastKnownWeekKey ?? getWeekKey(new Date()))

  function persist() {
    saveToStorage({
      meals: meals.value,
      currentWeek: currentWeek.value,
      lastWeek: lastWeek.value,
      weekHistory: weekHistory.value,
      settings: settings.value,
      lastKnownWeekKey: lastKnownWeekKey.value
    })
  }

  // Auto roll over if week has changed
  function checkWeekRollover() {
    const currentKey = getWeekKey(new Date())
    if (currentKey !== lastKnownWeekKey.value) {
      // Archive current week into history
      if (Object.keys(currentWeek.value).length > 0) {
        weekHistory.value[lastKnownWeekKey.value] = JSON.parse(JSON.stringify(currentWeek.value))
        lastWeek.value = JSON.parse(JSON.stringify(currentWeek.value))
      }
      currentWeek.value = {}
      lastKnownWeekKey.value = currentKey
      persist()
    }
  }

  // Run rollover check on store init
  checkWeekRollover()

  // Meals
  function addMeal(meal: Meal) {
    meals.value.push(meal)
    persist()
  }

  function updateMeal(updated: Meal) {
    const index = meals.value.findIndex(m => m.id === updated.id)
    if (index !== -1) meals.value[index] = updated
    persist()
  }

  function deleteMeal(id: string) {
    meals.value = meals.value.filter(m => m.id !== id)
    Object.keys(currentWeek.value).forEach(day => {
      currentWeek.value[day] = currentWeek.value[day].filter(mId => mId !== id)
    })
    persist()
  }

  function getMealById(id: string) {
    return meals.value.find(m => m.id === id)
  }

  // Planner - current week
  function addMealToDay(day: string, mealId: string) {
    if (!currentWeek.value[day]) currentWeek.value[day] = []
    if (!currentWeek.value[day].includes(mealId)) {
      currentWeek.value[day].push(mealId)
    }
    persist()
  }

  function removeMealFromDay(day: string, mealId: string) {
    if (!currentWeek.value[day]) return
    currentWeek.value[day] = currentWeek.value[day].filter(id => id !== mealId)
    persist()
  }

  // Planner - last week
  function addMealToLastWeek(day: string, mealId: string) {
    if (!lastWeek.value[day]) lastWeek.value[day] = []
    if (!lastWeek.value[day].includes(mealId)) {
      lastWeek.value[day].push(mealId)
    }
    persist()
  }

  function removeMealFromLastWeek(day: string, mealId: string) {
    if (!lastWeek.value[day]) return
    lastWeek.value[day] = lastWeek.value[day].filter(id => id !== mealId)
    persist()
  }

  function clearWeek() {
    currentWeek.value = {}
    persist()
  }

  function archiveWeek() {
    const key = getWeekKey(new Date())
    if (Object.keys(currentWeek.value).length > 0) {
      weekHistory.value[key] = JSON.parse(JSON.stringify(currentWeek.value))
    }
    lastWeek.value = JSON.parse(JSON.stringify(currentWeek.value))
    currentWeek.value = {}
    persist()
  }

  function autoFill() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const lastIds = Object.values(lastWeek.value).flat()
    const fresh = meals.value.filter(m => !lastIds.includes(m.id))
    const pool = fresh.length >= 4 ? fresh : meals.value
    const cats = ['protein', 'carb', 'veg', 'dairy', 'other']

    days.forEach((day, i) => {
      if (currentWeek.value[day]?.length) return
      const cat = cats[i % 3]
      const byCat = pool.filter(m => m.category === cat)
      const chosen = byCat.length ? byCat[i % byCat.length] : pool[i % pool.length]
      currentWeek.value[day] = [chosen.id]
    })
    persist()
  }

  // Settings
  function updateSettings(updated: Settings) {
    settings.value = updated
    persist()
  }

  // Computed
  const totalMealsThisWeek = computed(() =>
    Object.values(currentWeek.value).flat().length
  )

  const weeklyCalories = computed(() =>
    Object.values(currentWeek.value).flat().reduce((sum, id) => {
      return sum + (getMealById(id)?.calories ?? 0)
    }, 0)
  )

  const weeklyProtein = computed(() =>
    Object.values(currentWeek.value).flat().reduce((sum, id) => {
      return sum + (getMealById(id)?.protein ?? 0)
    }, 0)
  )

  const weeklyCarbs = computed(() =>
    Object.values(currentWeek.value).flat().reduce((sum, id) => {
      return sum + (getMealById(id)?.carbs ?? 0)
    }, 0)
  )

  const weeklyFat = computed(() =>
    Object.values(currentWeek.value).flat().reduce((sum, id) => {
      return sum + (getMealById(id)?.fat ?? 0)
    }, 0)
  )

  return {
    meals, currentWeek, lastWeek, weekHistory, settings,
    addMeal, updateMeal, deleteMeal, getMealById,
    addMealToDay, removeMealFromDay,
    addMealToLastWeek, removeMealFromLastWeek,
    clearWeek, archiveWeek, autoFill,
    updateSettings,
    totalMealsThisWeek, weeklyCalories, weeklyProtein, weeklyCarbs, weeklyFat
  }
})