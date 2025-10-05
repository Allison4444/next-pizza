import { Container, Filters, ProductCard, Title, TopBar } from '@/components/shared';

export default function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title text="Все пиццы" size="lg" className="font-extrabold" />
      </Container>
      <TopBar />
      <Container className="mt-10 pb-14">
        <div className="flex gap-[60px]">
          <div className="w-[250px]">
            <Filters />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <ProductCard
                id={1}
                imageUrl="https://media.dodostatic.net/image/r:292x292/0198bf57bc517218ab93c762f4b0193e.avif"
                name="Пепперони"
                price={990}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
