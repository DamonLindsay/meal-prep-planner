import type { Meal } from '@/types'

export const defaultMeals: Meal[] = [
  {
    id: '1',
    name: 'Chicken stir-fry',
    category: 'protein',
    calories: 480,
    protein: 42,
    carbs: 38,
    fat: 12,
    ingredients: ['200g chicken breast', '1 cup broccoli', 'bell pepper', 'soy sauce', 'garlic', 'ginger'],
    method: 'Stir-fry chicken until cooked, add vegetables and soy sauce, toss for 3 minutes.'
  },
  {
    id: '2',
    name: 'Salmon & sweet potato',
    category: 'protein',
    calories: 520,
    protein: 38,
    carbs: 45,
    fat: 18,
    ingredients: ['180g salmon fillet', '1 sweet potato', 'olive oil', 'lemon', 'dill'],
    method: 'Bake salmon at 200°C for 15 min. Roast sweet potato cubes alongside.'
  },
  {
    id: '3',
    name: 'Quinoa veggie bowl',
    category: 'veg',
    calories: 380,
    protein: 14,
    carbs: 58,
    fat: 9,
    ingredients: ['1 cup quinoa', 'cherry tomatoes', 'cucumber', 'chickpeas', 'tahini', 'lemon'],
    method: 'Cook quinoa, combine with vegetables and drizzle with tahini dressing.'
  },
  {
    id: '4',
    name: 'Pasta bolognese',
    category: 'carb',
    calories: 620,
    protein: 32,
    carbs: 78,
    fat: 16,
    ingredients: ['100g lean beef mince', '200g pasta', 'tomato passata', 'onion', 'garlic', 'mixed herbs'],
    method: 'Brown mince with onion and garlic, add passata and simmer 20 min. Toss with pasta.'
  },
  {
    id: '5',
    name: 'Greek yoghurt & berries',
    category: 'dairy',
    calories: 210,
    protein: 18,
    carbs: 22,
    fat: 4,
    ingredients: ['200g Greek yoghurt', 'mixed berries', 'honey', 'granola'],
    method: 'Layer yoghurt and berries, drizzle with honey, top with granola.'
  },
  {
    id: '6',
    name: 'Beef & veggie rice',
    category: 'protein',
    calories: 540,
    protein: 38,
    carbs: 52,
    fat: 14,
    ingredients: ['200g beef strips', '1 cup brown rice', 'zucchini', 'carrot', 'soy sauce'],
    method: 'Cook rice. Stir-fry beef and vegetables, season with soy sauce.'
  },
  {
    id: '7',
    name: 'Lentil soup',
    category: 'veg',
    calories: 340,
    protein: 18,
    carbs: 52,
    fat: 5,
    ingredients: ['200g red lentils', 'onion', 'carrot', 'celery', 'vegetable stock', 'cumin'],
    method: 'Sauté vegetables, add lentils and stock, simmer 25 minutes until soft.'
  }
]