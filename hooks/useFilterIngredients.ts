import { QueryFilters } from '@/components/shared/filters';
import { Api } from '@/services/api-client';
import { Ingredient } from '@prisma/client';
import { useEffect, useState } from 'react';

interface ReturnValue {
  ingredients: Ingredient[];
  loading: boolean;
  selectedIngredientIds: Set<string>;
  toggleIngredientsState: (id: string) => void;
}

export const useFilterIngredients = (
  searchParams: Map<keyof QueryFilters, string>,
): ReturnValue => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedIngredientIds, setSelectedIngredientIds] = useState<Set<string>>(
    new Set<string>(
      searchParams.has('ingredients') ? searchParams.get('ingredients')?.split(',') : '',
    ),
  );

  const toggleIngredientsState = (id: string) => {
    setSelectedIngredientIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await Api.ingredients.getAll();

        if (active) {
          setIngredients(response);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  return { ingredients, loading, selectedIngredientIds, toggleIngredientsState };
};
