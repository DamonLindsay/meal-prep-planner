import type { Meal } from '@/types'

export const defaultMeals: Meal[] = [
  {
    id: '1',
    name: 'KFC Zinger Stacker Box + Mountain Dew',
    category: 'takeout',
    calories: 1480,
    protein: 62,
    carbs: 118,
    fat: 68,
    ingredients: [
      'Zinger Stacker Burger',
      '3x Wicked Wings',
      'Regular chips',
      'Potato & gravy',
      'Mountain Dew'
    ],
    method: 'KFC takeout — Damon\'s usual order'
  },
  {
    id: '2',
    name: 'Maccas Philly Cheese Stack Meal + Coffee Frappe',
    category: 'takeout',
    calories: 1165,
    protein: 47,
    carbs: 111,
    fat: 57,
    ingredients: [
      'Philly Cheese Stack burger',
      'Medium fries',
      'Coffee Frappe medium'
    ],
    method: 'McDonald\'s takeout — Damon\'s usual order'
  },
  {
    id: '3',
    name: 'GYG Caesar Cali Burrito + Spicy Queso Fries',
    category: 'takeout',
    calories: 1420,
    protein: 58,
    carbs: 148,
    fat: 62,
    ingredients: [
      'Large Caesar Cali Burrito',
      'Chicken tenders',
      'Extra guacamole',
      'Extra caesar sauce',
      'Large spicy queso fries',
      'Extra queso'
    ],
    method: 'GYG takeout — Damon\'s usual order'
  }
]