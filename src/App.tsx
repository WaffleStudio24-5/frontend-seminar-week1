import { useState } from "react";
import "./App.css";
import data from "./data.json";

type Category = {
  id: number;
  name: string;
};

type Item = {
  id: number;
  name: string;
  price: number;
  category: number;
};

type CartItem = {
  item: Item;
  amount: number;
};

type Cart = Map<number, CartItem>;

function formatPrice(price: number) {
  let priceString = price.toString();
  let priceLength = priceString.length;

  let result = "";
  for (let i = 0; i < priceLength; ++i) {
    result += priceString[i];
    if ((priceLength - i) % 3 == 1 && i != priceLength - 1) {
      result += ",";
    }
  }
  result += "원";

  return result;
}

function CategoryButton({
  category,
  currentCategory,
  setCategory,
}: {
  category: Category;
  currentCategory: number;
  setCategory: Function;
}) {
  return (
    <button
      className={currentCategory === category.id ? "active" : ""}
      onClick={() => setCategory(category.id)}
    >
      {category.name}
    </button>
  );
}

function CategoryBar({ currentCategory, setCategory }: { currentCategory: number; setCategory: Function }) {
  const categories: Category[] = data.categories;

  return (
    <>
      {categories.map((category) => (
        <CategoryButton
          key={category.id}
          category={category}
          currentCategory={currentCategory}
          setCategory={setCategory}
        />
      ))}
    </>
  );
}

function MenuItemCard({ item, setCart }: { item: Item, setCart: Function}) {
  function addToCart() {
    setCart((prevCart: Cart) => {
      const newCart = new Map(prevCart);

      if (newCart.has(item.id)) {
        const current = newCart.get(item.id)!;
        newCart.set(item.id, { ...current, amount: current.amount + 1 });
      } else {
        newCart.set(item.id, { item: item, amount: 1 });
      }

      return newCart;
    });
  }

  return (
    <article onClick={() => addToCart()}>
      <h2>{item.name}</h2>
      <img src={`/assets/item-${item.id}.png`} alt={`${item.name}의 사진`} />
      <p>{formatPrice(item.price)}</p>
    </article>
  );
}

function MenuDisplay({ currentCategory, setCart }: {currentCategory: number, setCart: Function}) {
  const items: Item[] = data.items;

  return (
    <section id="menu">
      {items
        .filter(
          (item) => currentCategory == 0 || item.category == currentCategory,
        )
        .map((item) => (
          <MenuItemCard key={item.id} item={item} setCart={setCart} />
        ))}
    </section>
  );
}

function CartButton({ item, amount, setCart } : {item: CartItem, amount: number, setCart: Function}) {
  function updateCart() {
    const id = item.item.id;

    setCart((prevCart: Cart) => {
      const newCart = new Map(prevCart);

      if (newCart.has(id)) {
        const current = newCart.get(id)!;
        const updatedAmount = current.amount + amount;

        if (updatedAmount <= 0) {
          newCart.delete(id);
        } else {
          newCart.set(id, { ...current, amount: updatedAmount });
        }
      }

      return newCart;
    });
  }

  return (
    <button onClick={() => updateCart()}>{amount}</button>
  )
}

function CartItemCard({ item, setCart }: { item: CartItem, setCart: Function }) {
  return (
    <div>
      <h3>{item.item.name}</h3>
      <span>{formatPrice(item.item.price)}</span>
      <CartButton item={item} amount={1} setCart={setCart} />
      <span>{item.amount}</span>
      <CartButton item={item} amount={-1} setCart={setCart} />
    </div>
  );
}

function cartTotalAmount(cart: Cart) {
  let result = 0;
  
  cart.forEach((cartItem) => {
    result += cartItem.amount;
  })

  return result;
}

function cartTotalPrice(cart: Cart) {
  let result = 0;
  
  cart.forEach((cartItem) => {
    result += cartItem.item.price * cartItem.amount;
  })

  return result;
}

function CartDisplay({ cart, setCart }: { cart: Cart; setCart: Function }) {
  return (
    <>
      <h2>장바구니</h2>
      {cart.size > 0 ? (
        <section>
          {Array.from(cart.values()).map((cartItem) => (
            <CartItemCard
              key={cartItem.item.id}
              item={cartItem}
              setCart={setCart}
            />
          ))}
        </section> 
      ) : (
        <section>
          <p>장바구니가 비어 있어요</p>
          <p>왼쪽에서 메뉴를 추가해 보세요</p>
        </section>
      )}

      <p><label>총 수량</label> {cartTotalAmount(cart)}개</p>
      <p><label>총 금액</label> {formatPrice(cartTotalPrice(cart))}</p>

      <button id="order" onClick={() => {alert("주문이 완료되었습니다"); setCart(new Map())}} 
      disabled={cart.size == 0}>주문하기</button>
    </>
  );
}

function App() {
  const [currentCategory, setCategory] = useState<number>(0);
  const [cart, setCart] = useState<Cart>(new Map());

  return (
    <>
      <header>
        <h1>김다현의 잡탕 키오스크</h1>
        <nav>
          <CategoryBar
            currentCategory={currentCategory}
            setCategory={setCategory}
          />
        </nav>
      </header>

      <main>
        <MenuDisplay currentCategory={currentCategory} setCart={setCart} />
        <aside>
          <CartDisplay cart={cart} setCart={setCart} />
        </aside>
      </main>
    </>
  );
}

export default App;
