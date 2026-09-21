import { useState } from "react";
import "./App.css";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type CartItem = MenuItem & {
  quantity: number;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "아메리카노",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "크루아상",
    price: 3800,
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "딸기 케이크",
    price: 6500,
    image:
      "https://images.unsplash.com/photo-1611293388250-580b08c4a145?q=80&w=1676&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    name: "클럽 샌드위치",
    price: 7200,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
  },
];

const formatPrice = (price: number) => `${price.toLocaleString("ko-KR")}원`;

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (menuItem: MenuItem) => {
    setCartItems((currentItems) => {
      const itemAlreadyInCart = currentItems.some(
        (item) => item.id === menuItem.id,
      );

      if (!itemAlreadyInCart) {
        return [...currentItems, { ...menuItem, quantity: 1 }];
      }

      return currentItems.map((item) =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    });
  };

  const increaseQuantity = (itemId: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (itemId: number) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleOrder = () => {
    if (cartItems.length === 0) {
      return;
    }

    window.alert("주문이 완료되었습니다!");
    setCartItems([]);
  };

  return (
    <main className="app">
      <header className="header">
        <p className="eyebrow">WAFFLE CAFE - JHP</p>
        <h1>미니 키오스크</h1>
        <p>원하는 메뉴를 눌러 장바구니에 담아 보세요.</p>
      </header>

      <div className="kiosk-layout">
        <section className="menu-section" aria-labelledby="menu-title">
          <div className="section-heading">
            <h2 id="menu-title">메뉴</h2>
            <span>{MENU_ITEMS.length}개</span>
          </div>

          <div className="menu-grid">
            {MENU_ITEMS.map((item) => (
              <button
                className="menu-card"
                key={item.id}
                type="button"
                onClick={() => addToCart(item)}
              >
                <img src={item.image} alt={item.name} />

                <span className="menu-card-content">
                  <strong>{item.name}</strong>
                  <span>{formatPrice(item.price)}</span>
                  <small>클릭해서 담기</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <aside className="cart-section" aria-labelledby="cart-title">
          <div className="section-heading">
            <h2 id="cart-title">장바구니</h2>
            <span>{totalQuantity}개</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <span aria-hidden="true">🛒</span>
              <strong>장바구니가 비어 있어요</strong>
              <p>왼쪽에서 메뉴를 선택해 주세요.</p>
            </div>
          ) : (
            <ul className="cart-list">
              {cartItems.map((item) => (
                <li className="cart-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.price)}</span>
                  </div>

                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label={`${item.name} 수량 줄이기`}
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      aria-label={`${item.name} 수량 늘리기`}
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="cart-summary">
            <div>
              <span>총 수량</span>
              <strong>{totalQuantity}개</strong>
            </div>

            <div>
              <span>총 금액</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>
          </div>

          <button
            className="order-button"
            type="button"
            disabled={cartItems.length === 0}
            onClick={handleOrder}
          >
            주문하기
          </button>
        </aside>
      </div>
    </main>
  );
}