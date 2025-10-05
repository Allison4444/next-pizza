'use client';

import React, { useState } from 'react';
import { FilterChecboxProps, FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui';

type Item = FilterChecboxProps;

interface Props {
  title: string;
  items: Item[];
  defaultItems: Item[];
  limit?: number;
  loading?: boolean;
  searchInputPlaceholder?: string;
  onClickCheckbox?: (id: string) => void;
  defaultValue?: string[];
  selected?: Set<string>;
  className?: string;
  name?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  defaultItems,
  limit = 5,
  searchInputPlaceholder = 'Поиск...',
  className,

  name,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [filterValue, setFilterValue] = useState('');

  const list = showAll
    ? items.filter((item) =>
        item.text.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()),
      )
    : defaultItems.slice(0, limit);

  const handleChangeFilterValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  return (
    <div className={className}>
      <p className="font-bold mb-3">{title}</p>

      {showAll && (
        <div className="mb-5">
          <Input
            value={filterValue}
            onChange={handleChangeFilterValue}
            placeholder={searchInputPlaceholder}
            className="bg-gray-50 border-none"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
        {list.map((item, index) => (
          <FilterCheckbox
            key={index}
            text={item.text}
            value={item.value}
            checked={item.checked}
            endAdornment={item.endAdornment}
            name={name}
            onCheckedChange={(id) => console.log(id)}
          />
        ))}
      </div>
      {items.length > limit && (
        <div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
          <button className="text-primary mt-3" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Скрыть' : '+ Показать всё'}
          </button>
        </div>
      )}
    </div>
  );
};
