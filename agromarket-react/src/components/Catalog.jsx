import ProductCard from "./ProductCard.jsx"

export default function Catalog({ products, onAdd }) {
  return (
    <section className="catalog">
      <h2>Каталог</h2>
      <div className="cards">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}
