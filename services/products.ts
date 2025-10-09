import { Product } from '@prisma/client';
import { ApiRouter } from './constants';
import { axiosInstance } from './instance';

type SearchOptions = {
  signal?: AbortSignal;
};

export const search = async (query: string, opts: SearchOptions = {}): Promise<Product[]> => {
  return (
    await axiosInstance.get<Product[]>(ApiRouter.SEARCH_PRODUCTS, {
      params: { query },
      signal: opts.signal,
    })
  ).data;
};
