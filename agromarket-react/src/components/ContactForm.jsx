import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'
import './ContactForm.css'

export default function ContactForm() {
  const [status, setStatus] = useState(null) // { type: 'ok' | 'error', text }
  const [products, setProducts] = useState([])

  // Список товаров для выпадающего списка
  useEffect(() => {
    fetch(`${API_URL}/products?limit=100`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => {})
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (!res.ok) {
        setStatus({ type: 'error', text: result.error })
        return
      }
      setStatus({ type: 'ok', text: `Заявка №${result.id} принята!` })
      form.reset()
    } catch {
      setStatus({ type: 'error', text: 'Сервер недоступен. Запущен ли agromarket-server?' })
    }
  }

  return (
    <section className="order">
      <h2>Оптовая заявка</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Товар
          <select name="product_id" defaultValue="">
            <option value="">— не выбран —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Имя *
          <input name="name" required />
        </label>
        <label>
          Email *
          <input name="email" type="email" required />
        </label>
        <label>
          Телефон
          <input name="phone" type="tel" />
        </label>
        <label>
          Объём, кг * (от 10)
          <input name="quantity" type="number" min="10" required />
        </label>
        <label>
          Желаемая дата
          <input name="date" type="date" />
        </label>
        <label>
          Комментарий
          <textarea name="comment" rows="3" />
        </label>
        <button type="submit">Отправить заявку</button>
      </form>
      {status && <p className={status.type === 'ok' ? 'ok' : 'error'}>{status.text}</p>}
    </section>
  )
}
