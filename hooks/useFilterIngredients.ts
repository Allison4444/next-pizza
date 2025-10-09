import { Api } from '@/services/api-client';
import { Ingredient } from '@prisma/client';
import { useEffect, useState } from 'react';

export const useFilterIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const response = await Api.ingredients.getAll();

        if (active) {
          setIngredients(response);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  return { ingredients };
};
