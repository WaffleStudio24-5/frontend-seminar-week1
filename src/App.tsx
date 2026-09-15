import { useState } from "react";
import "./App.css";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "목살슬라이스덮밥", price: 6000, category: "덮밥", emoji: "🍚" },
  { id: 2, name: "소불고기덮밥", price: 6500, category: "덮밥", emoji: "🍛" },
  { id: 3, name: "닭불고기간장볶음", price: 7000, category: "볶음/구이", emoji: "🍗" },
  { id: 4, name: "제육볶음", price: 6500, category: "볶음/구이", emoji: "🥘" },
  { id: 5, name: "차돌된장찌개", price: 6000, category: "찌개/국", emoji: "🍲" },
  { id: 6, name: "순두부찌개", price: 6000, category: "찌개/국", emoji: "🌶️" },
];

const CATEGORIES: string[] = ["전체", "덮밥", "볶음/구이", "찌개/국"];

type CartState = Record<number, number>;

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [cart, setCart] = useState<CartState>({});

  const filteredProducts: Product[] =
    selectedCategory === "전체"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => ({
      product: PRODUCTS.find((p) => p.id === Number(id)),
      qty,
    }))
    .filter(
      (entry): entry is { product: Product; qty: number } =>
        entry.product !== undefined
    );

  const totalQty = cartEntries.reduce((sum, e) => sum + e.qty, 0);
  const totalPrice = cartEntries.reduce(
    (sum, e) => sum + e.qty * e.product.price,
    0
  );

  const addToCart = (product: Product) => {
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const increment = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrement = (id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] <= 1) {
        delete next[id];
      } else {
        next[id] -= 1;
      }
      return next;
    });
  };

  const handleOrder = () => {
    if (totalQty === 0) return;
    alert("주문이 완료되었습니다.");
    setCart({});
  };

  return (
    <div className="kiosk-page">
      <div className="kiosk-card">
        <header className="kiosk-header">
          <h1>미니 키오스크</h1>
        </header>

        <div className="kiosk-body">
          {/* 메뉴 영역 */}
          <div className="kiosk-menu">
            <div className="category-row">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${
                    selectedCategory === cat ? "category-pill--active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filteredProducts.map((p) => {
                const qty = cart[p.id] || 0;
                return (
                  <button
                    key={p.id}
                    className={`product-card ${
                      qty > 0 ? "product-card--selected" : ""
                    }`}
                    onClick={() => addToCart(p)}
                  >
                    {qty > 0 && <span className="qty-badge">{qty}</span>}
                    <div className="product-thumb">{p.emoji}</div>
                    <div className="product-info">
                      <p className="product-name">{p.name}</p>
                      <p className="product-price">
                        {p.price.toLocaleString()}원
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 장바구니 영역 */}
          <div className="kiosk-cart">
            <h2>장바구니</h2>

            <div className="cart-list">
              {cartEntries.length === 0 ? (
                <div className="cart-empty">
                  <p className="cart-empty-title">장바구니가 비어 있어요</p>
                  <p className="cart-empty-desc">왼쪽에서 메뉴를 추가해 보세요</p>
                </div>
              ) : (
                cartEntries.map(({ product, qty }) => (
                  <div key={product.id} className="cart-item">
                    <div className="cart-item-info">
                      <p className="cart-item-name">{product.name}</p>
                      <p className="cart-item-price">
                        {product.price.toLocaleString()}원
                      </p>
                    </div>
                    <div className="cart-item-controls">
                      <button onClick={() => decrement(product.id)} aria-label="수량 감소">
                        −
                      </button>
                      <span>{qty}</span>
                      <button onClick={() => increment(product.id)} aria-label="수량 증가">
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>총 수량</span>
                <span>{totalQty}개</span>
              </div>
              <div className="summary-row summary-row--total">
                <span>총 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <button
                className="order-button"
                disabled={totalQty === 0}
                onClick={handleOrder}
              >
                주문하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
