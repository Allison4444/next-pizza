'use client';

import React, { useEffect, useState } from 'react';
import { Title } from './title';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilterIngredients } from '@/hooks';
import qs from 'qs';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  className?: string;
}

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

export interface QueryFilters extends PriceProps {
  pizzaTypes: string;
  sizes: string;
  ingredients: string;
}
export const Filters: React.FC<Props> = ({ className }) => {
  const router = useRouter();

  const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>;

  const [prices, setPrices] = useState<PriceProps>({
    priceFrom: Number(searchParams.get('priceFrom')) || undefined,
    priceTo: Number(searchParams.get('priceTo')) || undefined,
  });
  const [sizes, setSizes] = useState<Set<string>>(
    new Set<string>(searchParams.has('sizes') ? searchParams.get('sizes')?.split(',') : ''),
  );
  const [pizzaTypes, setPizzaTypes] = useState<Set<string>>(
    new Set<string>(
      searchParams.has('pizzaTypes') ? searchParams.get('pizzaTypes')?.split(',') : '',
    ),
  );

  const { ingredients, loading, selectedIngredientIds, toggleIngredientsState } =
    useFilterIngredients(searchParams);

  const ingredientItems = ingredients.map((item) => ({
    text: item.name,
    value: String(item.id),
  }));

  const changePrice = <K extends keyof PriceProps>(type: K, value: PriceProps[K]) => {
    setPrices((prev) => ({ ...prev, [type]: value }));
  };

  const toggleSizesState = (id: string) => {
    setSizes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const togglePizzaTypesState = (id: string) => {
    setPizzaTypes((prev) => {
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
    const filters = {
      ...prices,
      pizzaTypes: Array.from(pizzaTypes),
      sizes: Array.from(sizes),
      ingredients: Array.from(selectedIngredientIds),
    };

    const query = qs.stringify(filters, { arrayFormat: 'comma' });

    router.push(`?${query}`, { scroll: false });
  }, [prices, sizes, pizzaTypes, selectedIngredientIds, router]);

  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      <CheckboxFiltersGroup
        title="Тип теста"
        name="pizzaTypes"
        className="mb-5"
        onClickCheckbox={togglePizzaTypesState}
        selected={pizzaTypes}
        items={[
          { text: 'Тонкое', value: '1' },
          { text: 'Традиционное', value: '2' },
        ]}
      />

      <CheckboxFiltersGroup
        title="Размеры"
        name="sizes"
        className="mb-5"
        onClickCheckbox={toggleSizesState}
        selected={sizes}
        items={[
          { text: '20 см', value: '20' },
          { text: '30 см', value: '30' },
          { text: '40 см', value: '40' },
        ]}
      />

      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            value={prices.priceFrom ?? '0'}
            onChange={(e) => changePrice('priceFrom', Number(e.target.value))}
            type="number"
            placeholder="0"
            min={0}
            max={1000}
          />
          <Input
            value={prices.priceTo ?? '1000'}
            onChange={(e) => changePrice('priceTo', Number(e.target.value))}
            type="number"
            min={100}
            max={1000}
            placeholder="1000"
          />
        </div>
        <RangeSlider
          max={1000}
          min={0}
          step={10}
          value={[prices.priceFrom ?? 0, prices.priceTo ?? 1000]}
          onValueChange={(values) => setPrices({ priceFrom: values[0], priceTo: values[1] })}
        />
      </div>
      <CheckboxFiltersGroup
        title="Ингридиенты"
        className="mt-8"
        limit={6}
        items={ingredientItems}
        defaultItems={ingredientItems.slice(0, 6)}
        loading={loading}
        selected={selectedIngredientIds}
        onClickCheckbox={toggleIngredientsState}
        name="ingredients"
      />
    </div>
  );
};
