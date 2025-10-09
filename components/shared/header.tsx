import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';
import { Container } from './container';
import { Button } from '../ui';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { SearchInput } from './search-input';
import Link from 'next/link';

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn('border border-b', className)}>
      <Container className="flex items-center justify-between py-8">
        {/* Левая часть */}
        <Link href="/" className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={35} height={35} />
          <div>
            <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
            <p className="text-sm text-gray-400 leading-3">вкусней уже некуда</p>
          </div>
        </Link>

        <div className="mx-10 flex-1">
          <SearchInput />
        </div>

        {/* Правая часть */}
        <div>
          <Button className="group relative cursor-pointer">
            <b>520$</b>
            <span className="h-full w-[1px] bg-white/30 mx-3" />
            <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
              <ShoppingCart size={16} strokeWidth={2} />
              <b>3</b>
            </div>
            <ArrowRight
              size={20}
              className="absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
            />
          </Button>
        </div>
      </Container>
    </header>
  );
};
