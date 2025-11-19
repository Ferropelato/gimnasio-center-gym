function CartWidget({ count = 0, onClick }) {
  return (
    <button className="cart-btn" aria-label="Ver carrito" onClick={onClick}>
      🛒
      {count > 0 && <span className="cart-badge">{count}</span>}
    </button>
  )
}

export default CartWidget


