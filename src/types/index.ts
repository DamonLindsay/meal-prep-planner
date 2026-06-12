export interface Ingredient {
  name: string
}

export type MealCategory = 'protein' | 'carb' | 'veg' | 'dairy' | 'other'

export interface Meal {
  id: string
  name: string
  category: MealCategory
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  method: string
}

export interface DayPlan {
  day: string
  mealIds: string[]
}

export interface WeekPlan {
  [day: string]: string[]
}

export interface Settings {
  calorieGoal: number
  proteinGoal: number
  carbGoal: number
  fatGoal: number
}