'use client';

import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/category';
import React from 'react';

interface Props {
  className?: string;
}

const items = [
  {
    title: 'Пиццы',
    id: 1,
  },
  {
    title: 'Комбо',
    id: 2,
  },
  {
    title: 'Закуски',
    id: 3,
  },
  {
    title: 'Коктейли',
    id: 4,
  },
  {
    title: 'Кофе',
    id: 5,
  },
  {
    title: 'Напитки',
    id: 6,
  },
  {
    title: 'Десерты',
    id: 7,
  },
];

export const Categories: React.FC<Props> = ({ className }) => {
  const { activeId, setActiveId } = useCategoryStore();

  return (
    <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
      {items.map((item) => (
        <a
          href={`/#${item.title}`}
          key={item.id}
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5 cursor-pointer',
            activeId === item.id && 'bg-white shadow-md shadow-gray-200 text-primary',
          )}
          onClick={() => setActiveId(item.id)}>
          <button className="cursor-pointer">{item.title}</button>
        </a>
      ))}
    </div>
  );
};
