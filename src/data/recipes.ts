import recipePasta from "@/assets/recipe-pasta.jpg";
import recipeCurry from "@/assets/recipe-curry.jpg";
import recipeSalad from "@/assets/recipe-salad.jpg";
import recipePancakes from "@/assets/recipe-pancakes.jpg";
import recipeSalmon from "@/assets/recipe-salmon.jpg";
import recipeTacos from "@/assets/recipe-tacos.jpg";

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  available?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  cookingTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  servings: number;
  description: string;
  category: string;
  ingredients: Ingredient[];
  instructions: string[];
  videoUrl?: string;
}

export const recipes: Recipe[] = [
  {
    id: "1",
    name: "Classic Pasta Carbonara",
    image: recipePasta,
    cookingTime: 30,
    difficulty: "Medium",
    servings: 4,
    description: "Creamy Italian pasta with crispy pancetta, eggs, and parmesan cheese. A Roman classic that's rich and satisfying.",
    category: "Italian",
    ingredients: [
      { id: "1-1", name: "Spaghetti", quantity: 400, unit: "g" },
      { id: "1-2", name: "Pancetta", quantity: 200, unit: "g" },
      { id: "1-3", name: "Eggs", quantity: 4, unit: "pcs" },
      { id: "1-4", name: "Parmesan cheese", quantity: 100, unit: "g" },
      { id: "1-5", name: "Black pepper", quantity: 1, unit: "tsp" },
      { id: "1-6", name: "Salt", quantity: 1, unit: "tsp" },
      { id: "1-7", name: "Garlic cloves", quantity: 2, unit: "pcs" },
    ],
    instructions: [
      "Bring a large pot of salted water to boil. Cook spaghetti according to package directions until al dente.",
      "While pasta cooks, cut pancetta into small cubes. Mince garlic cloves.",
      "In a bowl, whisk together eggs, grated parmesan, and freshly ground black pepper.",
      "Cook pancetta in a large skillet over medium heat until crispy, about 5-7 minutes. Add garlic and cook for 1 minute.",
      "Reserve 1 cup of pasta water, then drain the spaghetti.",
      "Remove skillet from heat. Add hot pasta to the skillet with pancetta.",
      "Quickly pour egg mixture over pasta, tossing constantly to create a creamy sauce. Add pasta water as needed.",
      "Serve immediately with extra parmesan and black pepper on top."
    ],
    videoUrl: "https://www.youtube.com/embed/D_2DBLAt57c"
  },
  {
    id: "2",
    name: "Butter Chicken Curry",
    image: recipeCurry,
    cookingTime: 45,
    difficulty: "Medium",
    servings: 4,
    description: "Rich and creamy Indian butter chicken with aromatic spices served with warm naan bread.",
    category: "Indian",
    ingredients: [
      { id: "2-1", name: "Chicken breast", quantity: 600, unit: "g" },
      { id: "2-2", name: "Yogurt", quantity: 200, unit: "ml" },
      { id: "2-3", name: "Tomato puree", quantity: 400, unit: "g" },
      { id: "2-4", name: "Heavy cream", quantity: 200, unit: "ml" },
      { id: "2-5", name: "Butter", quantity: 60, unit: "g" },
      { id: "2-6", name: "Garam masala", quantity: 2, unit: "tbsp" },
      { id: "2-7", name: "Garlic cloves", quantity: 4, unit: "pcs" },
      { id: "2-8", name: "Ginger", quantity: 2, unit: "tbsp" },
      { id: "2-9", name: "Naan bread", quantity: 4, unit: "pcs" },
    ],
    instructions: [
      "Cut chicken into bite-sized pieces. Marinate in yogurt, garam masala, and salt for at least 30 minutes.",
      "Mince garlic and grate fresh ginger.",
      "Heat butter in a large pan. Cook marinated chicken until golden, about 8-10 minutes. Set aside.",
      "In the same pan, add more butter. Sauté garlic and ginger until fragrant.",
      "Add tomato puree and remaining spices. Simmer for 15 minutes.",
      "Stir in heavy cream and return chicken to the pan.",
      "Simmer for another 10 minutes until sauce thickens.",
      "Serve hot with warm naan bread and garnish with fresh cilantro."
    ],
    videoUrl: "https://www.youtube.com/embed/a03U45jFxOI"
  },
  {
    id: "3",
    name: "Caesar Salad with Grilled Chicken",
    image: recipeSalad,
    cookingTime: 20,
    difficulty: "Easy",
    servings: 2,
    description: "Fresh romaine lettuce with grilled chicken, homemade croutons, and classic Caesar dressing.",
    category: "Salads",
    ingredients: [
      { id: "3-1", name: "Romaine lettuce", quantity: 2, unit: "heads" },
      { id: "3-2", name: "Chicken breast", quantity: 300, unit: "g" },
      { id: "3-3", name: "Parmesan cheese", quantity: 50, unit: "g" },
      { id: "3-4", name: "Bread for croutons", quantity: 2, unit: "slices" },
      { id: "3-5", name: "Olive oil", quantity: 4, unit: "tbsp" },
      { id: "3-6", name: "Lemon juice", quantity: 2, unit: "tbsp" },
      { id: "3-7", name: "Garlic cloves", quantity: 2, unit: "pcs" },
      { id: "3-8", name: "Anchovy fillets", quantity: 2, unit: "pcs" },
    ],
    instructions: [
      "Season chicken breasts with salt, pepper, and olive oil. Grill for 6-7 minutes per side until cooked through. Let rest, then slice.",
      "Cut bread into cubes. Toss with olive oil and bake at 375°F for 10 minutes until golden and crispy.",
      "For dressing: blend garlic, anchovies, lemon juice, olive oil, and a little parmesan until smooth.",
      "Wash and chop romaine lettuce. Place in a large bowl.",
      "Add sliced grilled chicken and croutons to the lettuce.",
      "Drizzle with Caesar dressing and toss well.",
      "Top with shaved parmesan and freshly ground black pepper.",
      "Serve immediately while croutons are still crispy."
    ],
    videoUrl: "https://www.youtube.com/embed/qJV2dqYG_aQ"
  },
  {
    id: "4",
    name: "Fluffy Blueberry Pancakes",
    image: recipePancakes,
    cookingTime: 25,
    difficulty: "Easy",
    servings: 4,
    description: "Light and fluffy pancakes loaded with fresh blueberries, drizzled with maple syrup.",
    category: "Breakfast",
    ingredients: [
      { id: "4-1", name: "All-purpose flour", quantity: 200, unit: "g" },
      { id: "4-2", name: "Milk", quantity: 250, unit: "ml" },
      { id: "4-3", name: "Eggs", quantity: 2, unit: "pcs" },
      { id: "4-4", name: "Butter", quantity: 30, unit: "g" },
      { id: "4-5", name: "Fresh blueberries", quantity: 150, unit: "g" },
      { id: "4-6", name: "Maple syrup", quantity: 100, unit: "ml" },
      { id: "4-7", name: "Baking powder", quantity: 2, unit: "tsp" },
      { id: "4-8", name: "Sugar", quantity: 2, unit: "tbsp" },
    ],
    instructions: [
      "In a large bowl, whisk together flour, baking powder, sugar, and a pinch of salt.",
      "In another bowl, beat eggs, then add milk and melted butter.",
      "Pour wet ingredients into dry ingredients. Mix until just combined (lumps are okay).",
      "Gently fold in half of the blueberries.",
      "Heat a non-stick pan over medium heat. Lightly grease with butter.",
      "Pour 1/4 cup batter for each pancake. Cook until bubbles form on surface, about 2 minutes.",
      "Flip and cook for another 1-2 minutes until golden.",
      "Stack pancakes, top with remaining blueberries, and drizzle generously with maple syrup."
    ],
    videoUrl: "https://www.youtube.com/embed/uY-T5kRq0Ps"
  },
  {
    id: "5",
    name: "Grilled Salmon with Asparagus",
    image: recipeSalmon,
    cookingTime: 25,
    difficulty: "Easy",
    servings: 2,
    description: "Perfectly grilled salmon fillet with tender asparagus and a squeeze of fresh lemon.",
    category: "Seafood",
    ingredients: [
      { id: "5-1", name: "Salmon fillets", quantity: 2, unit: "pcs" },
      { id: "5-2", name: "Fresh asparagus", quantity: 300, unit: "g" },
      { id: "5-3", name: "Olive oil", quantity: 3, unit: "tbsp" },
      { id: "5-4", name: "Lemon", quantity: 1, unit: "pc" },
      { id: "5-5", name: "Garlic cloves", quantity: 2, unit: "pcs" },
      { id: "5-6", name: "Fresh dill", quantity: 2, unit: "tbsp" },
      { id: "5-7", name: "Salt", quantity: 1, unit: "tsp" },
      { id: "5-8", name: "Black pepper", quantity: 0.5, unit: "tsp" },
    ],
    instructions: [
      "Pat salmon fillets dry and season with salt, pepper, and minced garlic.",
      "Drizzle with olive oil and let marinate for 10 minutes.",
      "Trim woody ends from asparagus. Toss with olive oil, salt, and pepper.",
      "Preheat grill or grill pan to medium-high heat.",
      "Grill salmon skin-side down for 4-5 minutes. Flip and cook for another 3-4 minutes.",
      "Grill asparagus alongside salmon, turning occasionally, for about 5-6 minutes.",
      "Plate salmon with asparagus. Squeeze fresh lemon juice over the top.",
      "Garnish with fresh dill and serve immediately."
    ],
    videoUrl: "https://www.youtube.com/embed/4MV9uyFjm3A"
  },
  {
    id: "6",
    name: "Street-Style Beef Tacos",
    image: recipeTacos,
    cookingTime: 35,
    difficulty: "Medium",
    servings: 4,
    description: "Authentic Mexican street tacos with seasoned beef, fresh salsa, and zesty lime.",
    category: "Mexican",
    ingredients: [
      { id: "6-1", name: "Ground beef", quantity: 500, unit: "g" },
      { id: "6-2", name: "Corn tortillas", quantity: 8, unit: "pcs" },
      { id: "6-3", name: "Onion", quantity: 1, unit: "pc" },
      { id: "6-4", name: "Fresh cilantro", quantity: 1, unit: "bunch" },
      { id: "6-5", name: "Lime", quantity: 2, unit: "pcs" },
      { id: "6-6", name: "Tomatoes", quantity: 2, unit: "pcs" },
      { id: "6-7", name: "Jalapeño", quantity: 1, unit: "pc" },
      { id: "6-8", name: "Taco seasoning", quantity: 2, unit: "tbsp" },
      { id: "6-9", name: "Avocado", quantity: 1, unit: "pc" },
    ],
    instructions: [
      "Dice onion, tomatoes, and jalapeño. Chop fresh cilantro.",
      "For salsa: Mix half the diced tomatoes, onion, jalapeño, cilantro, and juice of one lime.",
      "Make guacamole by mashing avocado with lime juice, salt, and some diced onion.",
      "Brown ground beef in a skillet over medium-high heat, breaking it into small pieces.",
      "Add taco seasoning and a splash of water. Simmer for 5 minutes until seasoning coats the meat.",
      "Warm corn tortillas in a dry pan or directly over a gas flame for 15-20 seconds each side.",
      "Assemble tacos: Add beef to tortillas, top with fresh salsa and guacamole.",
      "Garnish with remaining cilantro and serve with lime wedges on the side."
    ],
    videoUrl: "https://www.youtube.com/embed/uxrg0LvCcXI"
  },
];

export const categories = [
  "All",
  "Italian",
  "Indian",
  "Mexican",
  "Seafood",
  "Salads",
  "Breakfast",
];
