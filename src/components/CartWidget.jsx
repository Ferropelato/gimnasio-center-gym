function CartWidget({ count = 0 }) {
  return (
    <button className="cart-btn" aria-label="Ver carrito">
      🛒
      {count > 0 && <span className="cart-badge">{count}</span>}
    </button>
  )
}

export default CartWidget


