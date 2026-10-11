import { useEffect, useState } from "react"
import Catalog from "./components/Catalog.jsx"
import ContactForm from "./components/ContactForm.jsx"
import { API_URL } from "./api.js"

export default function App() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [greeting, setGreeting] = useState("")
  const [cart, setCart] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError("")

    fetch(`${API_URL}/products?search=${encodeURIComponent(search)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка сервера: " + res.status)
        return res.json()
      })
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        setError("Не удалось загрузить товары. Запущен ли agromarket-server?")
        setLoading(false)
      })

    return () => controller.abort()
  }, [search])

  const addToCart = (product) => setCart((prev) => [...prev, product])

  return (
    <>
      <h1>АгроМаркет</h1>
      <button id="greetBtn" onClick={() => setGreeting("Шалом!")}>
        Шалом
      </button>
      {greeting && <p>{greeting}</p>}
      <p>Товаров в корзине: {cart.length}</p>

      <input
        className="search"
        type="search"
        placeholder="Поиск товара…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Загрузка…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && products.length === 0 && <p>Ничего не найдено</p>}
      {!error && <Catalog products={products} onAdd={addToCart} />}

      <ContactForm />
    </>
  )
}
