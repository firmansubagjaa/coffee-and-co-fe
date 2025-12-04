import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calculator, AlertCircle } from "lucide-react";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { MOCK_INVENTORY, InventoryItem } from "../../../data/mockInventory";
import { CURRENCY } from "../../../utils/constants";
import { useLanguage } from "../../../contexts/LanguageContext";

interface Ingredient {
  inventoryId: string;
  quantity: number;
}

interface Recipe {
  variant: string;
  ingredients: Ingredient[];
}

interface RecipeManagerProps {
  variants: string[]; // e.g. ['S', 'M', 'L']
  onUpdate?: (recipes: Recipe[]) => void;
}

export const RecipeManager: React.FC<RecipeManagerProps> = ({
  variants,
  onUpdate,
}) => {
  const { t } = useLanguage();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    variants[0] || ""
  );

  // Initialize recipes when variants change
  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }

    setRecipes((prev) => {
      // Keep existing recipes, add new ones for new variants
      const newRecipes = [...prev];
      variants.forEach((v) => {
        if (!newRecipes.find((r) => r.variant === v)) {
          newRecipes.push({ variant: v, ingredients: [] });
        }
      });
      return newRecipes.filter((r) => variants.includes(r.variant));
    });
  }, [variants]);

  const currentRecipe = recipes.find((r) => r.variant === selectedVariant);

  const addIngredient = () => {
    if (!currentRecipe) return;
    const updatedRecipes = recipes.map((r) => {
      if (r.variant === selectedVariant) {
        return {
          ...r,
          ingredients: [...r.ingredients, { inventoryId: "", quantity: 0 }],
        };
      }
      return r;
    });
    setRecipes(updatedRecipes);
    onUpdate?.(updatedRecipes);
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: any
  ) => {
    const updatedRecipes = recipes.map((r) => {
      if (r.variant === selectedVariant) {
        const newIngredients = [...r.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        return { ...r, ingredients: newIngredients };
      }
      return r;
    });
    setRecipes(updatedRecipes);
    onUpdate?.(updatedRecipes);
  };

  const removeIngredient = (index: number) => {
    const updatedRecipes = recipes.map((r) => {
      if (r.variant === selectedVariant) {
        const newIngredients = r.ingredients.filter((_, i) => i !== index);
        return { ...r, ingredients: newIngredients };
      }
      return r;
    });
    setRecipes(updatedRecipes);
    onUpdate?.(updatedRecipes);
  };

  const calculateCost = (recipe: Recipe) => {
    return recipe.ingredients.reduce((total, ing) => {
      const item = MOCK_INVENTORY.find((i) => i.id === ing.inventoryId);
      if (!item) return total;
      // Simple calculation: unitCost * quantity
      // In real app, need unit conversion (e.g. kg to g)
      // For now assuming quantity matches unit cost basis or simple ratio
      // Let's assume quantity is in the same unit as inventory for simplicity of UI demo
      return total + item.unitCost * ing.quantity;
    }, 0);
  };

  if (variants.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-coffee-900/50 p-6 rounded-xl border border-dashed border-gray-300 dark:border-coffee-700 text-center">
        <p className="text-gray-500 dark:text-coffee-400">
          {t("dashboard.products.recipe.noVariants")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-coffee-100 dark:border-coffee-800 pb-4">
        <div>
          <h3 className="font-bold text-coffee-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-coffee-600 dark:text-coffee-400" />
            {t("dashboard.products.recipe.title")}
          </h3>
          <p className="text-sm text-coffee-500 dark:text-coffee-400">
            {t("dashboard.products.recipe.subtitle")}
          </p>
        </div>
        <div className="bg-success/10 dark:bg-success/20 px-4 py-2 rounded-xl border border-success/20 dark:border-success/30 flex flex-col items-end">
          <span className="text-xs text-success dark:text-success font-medium uppercase tracking-wider">
            {t("dashboard.products.recipe.estimatedCost")}
          </span>
          <span className="font-mono font-bold text-xl text-success dark:text-success leading-none">
            {CURRENCY}
            {currentRecipe ? calculateCost(currentRecipe).toFixed(2) : "0.00"}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Variant Tabs */}
        <div>
          <Label className="mb-2 block text-xs uppercase text-coffee-400 font-bold tracking-wider">
            {t("dashboard.products.recipe.selectVariant")}
          </Label>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all border ${
                  selectedVariant === v
                    ? "bg-coffee-900 dark:bg-coffee-600 text-white border-coffee-900 dark:border-coffee-600 shadow-md transform scale-105"
                    : "bg-white dark:bg-coffee-800 text-coffee-600 dark:text-coffee-300 border-coffee-200 dark:border-coffee-700 hover:border-coffee-400 dark:hover:border-coffee-500 hover:bg-coffee-50 dark:hover:bg-coffee-700"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Editor */}
        <div className="bg-gray-50/50 dark:bg-coffee-800/30 rounded-xl border border-coffee-100 dark:border-coffee-800 p-1">
          <div className="bg-white dark:bg-coffee-900 rounded-lg shadow-sm border border-coffee-50 dark:border-coffee-800 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-coffee-50/30 dark:bg-coffee-800/50 border-b border-coffee-100 dark:border-coffee-800 text-xs font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wider">
              <div className="col-span-6">
                {t("dashboard.products.recipe.table.ingredient")}
              </div>
              <div className="col-span-3">
                {t("dashboard.products.recipe.table.quantity")}
              </div>
              <div className="col-span-2">
                {t("dashboard.products.recipe.table.unit")}
              </div>
              <div className="col-span-1 text-center">
                {t("dashboard.products.recipe.table.action")}
              </div>
            </div>

            {/* Ingredients List */}
            <div className="divide-y divide-coffee-50 dark:divide-coffee-800">
              {currentRecipe?.ingredients.map((ing, idx) => {
                const item = MOCK_INVENTORY.find(
                  (i) => i.id === ing.inventoryId
                );
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30 transition-colors group"
                  >
                    <div className="col-span-6">
                      <Select
                        value={ing.inventoryId}
                        onValueChange={(val) =>
                          updateIngredient(idx, "inventoryId", val)
                        }
                      >
                        <SelectTrigger className="border-transparent hover:border-coffee-200 dark:hover:border-coffee-700 bg-transparent hover:bg-white dark:hover:bg-coffee-800 focus:bg-white dark:focus:bg-coffee-800 transition-all h-9 text-coffee-900 dark:text-white">
                          <SelectValue
                            placeholder={t(
                              "dashboard.products.recipe.placeholders.selectItem"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_INVENTORY.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              <span className="font-medium text-coffee-900">
                                {item.name}
                              </span>
                              <span className="text-coffee-400 ml-2 text-xs">
                                ({CURRENCY}
                                {item.unitCost}/{item.unit})
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        step="0.01"
                        value={ing.quantity}
                        onChange={(e) =>
                          updateIngredient(
                            idx,
                            "quantity",
                            parseFloat(e.target.value)
                          )
                        }
                        className="h-9 border-coffee-200 dark:border-coffee-700 focus:border-coffee-500 text-right font-mono bg-white dark:bg-coffee-900 text-coffee-900 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-coffee-500 font-medium px-2">
                        {item ? item.unit : "-"}
                      </span>
                    </div>
                    <div className="col-span-1 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(idx)}
                        className="h-8 w-8 p-0 text-coffee-300 hover:text-error hover:bg-error/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {currentRecipe?.ingredients.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-coffee-400 mb-3">
                  {t("dashboard.products.recipe.noIngredients", {
                    variant: selectedVariant,
                  })}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
                  className="border-dashed border-coffee-300 dark:border-coffee-600 text-coffee-600 dark:text-coffee-300 hover:bg-coffee-50 dark:hover:bg-coffee-800"
                >
                  <Plus className="w-4 h-4 mr-2" />{" "}
                  {t("dashboard.products.recipe.addFirst")}
                </Button>
              </div>
            )}

            {/* Footer Action */}
            {currentRecipe && currentRecipe.ingredients.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-coffee-800/30 border-t border-coffee-100 dark:border-coffee-800">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addIngredient}
                  className="text-coffee-600 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-white hover:bg-coffee-100 dark:hover:bg-coffee-800 w-full flex items-center justify-center h-8 text-xs font-medium uppercase tracking-wide"
                >
                  <Plus className="w-3 h-3 mr-2" />{" "}
                  {t("dashboard.products.recipe.addAnother")}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 items-start bg-info/10 dark:bg-info/20 p-4 rounded-xl border border-info/20 dark:border-info/30">
          <AlertCircle className="w-5 h-5 text-info dark:text-info shrink-0 mt-0.5" />
          <div className="text-sm text-info dark:text-info">
            <p className="font-bold mb-1">
              {t("dashboard.products.recipe.info.title")}
            </p>
            <p className="text-info/80 dark:text-info/80 leading-relaxed">
              {t("dashboard.products.recipe.info.content")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
