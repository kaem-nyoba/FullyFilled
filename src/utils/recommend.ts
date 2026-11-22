import { RECIPES, type Recipe, type RecipeItem } from '@/data/recipes';

export type RecommendedItem = RecipeItem & { owned: boolean };

export type Recommendation = {
  recipe: Recipe;
  items: RecommendedItem[];
  ownedCount: number;
  total: number;
  allOwned: boolean;
  /** Alasan konkret yang tampil di kartu menu. */
  reason: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

/** 240 -> 250, 250 -> 300: kelipatan 50 terdekat di atas kalori. */
const kcalCeiling = (kcal: number) => Math.ceil((kcal + 1) / 50) * 50;

/**
 * Menyusun ide makan dari bahan yang dimiliki. Urutan: paling banyak bahan utama yang sudah ada,
 * seri diurutkan sesuai urutan katalog.
 */
export function recommendMeals(
  ownedIngredients: readonly string[],
  limit = 3,
  catalog: readonly Recipe[] = RECIPES,
): Recommendation[] {
  const owned = new Set(ownedIngredients.map(normalize));

  return catalog
    .map((recipe, index) => {
      const items = recipe.items.map((item) => ({
        ...item,
        owned: owned.has(normalize(item.name)),
      }));
      const ownedCount = items.filter((item) => item.owned).length;
      const total = items.length;
      const allOwned = ownedCount === total;

      const reason = allOwned
        ? 'Semua bahan utama sudah ada'
        : ownedCount > 0
          ? `Kamu punya ${ownedCount} dari ${total} bahan utama`
          : `Protein ${recipe.proteinG} g, tetap di bawah ${kcalCeiling(recipe.kcal)} kkal`;

      return { recommendation: { recipe, items, ownedCount, total, allOwned, reason }, index };
    })
    .sort((a, b) => b.recommendation.ownedCount - a.recommendation.ownedCount || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.recommendation);
}
