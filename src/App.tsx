import "./App.css";
import {useState} from "react";

function App() {
  type Menu={
    name: string;
    price: number;
    quantity: number;
  }
  const [menuList, setMenuList]=useState<Menu[]>([]);
  
  function AddMenu(menuName:string, menuPrice:number, difference:number){
    setMenuList(prevList=>{
      const existingMenu = prevList.find(
        menu => menu.name == menuName
      );
      if(existingMenu){
        return prevList.map(menu=>{
          if(menu.name == menuName){
            return{
              ...menu,
              quantity: (menu.quantity+difference>0)?(menu.quantity+difference):0
            };
          }
          else{
            return menu;
          }
        })
      }
      else{
        return[
          ...prevList,
          {
            name: menuName,
            price: menuPrice,
            quantity: (difference>0)?difference:0
          }
        ];
      }
    })
  }
  function TotalCount(){
    let totalCnt = 0;
    for(const menu of menuList){
      totalCnt += menu.quantity;
    }
    return totalCnt;
  }
  function TotalPrice(){
    let totalPrice = 0;
    for(const menu of menuList){
      totalPrice += menu.quantity * menu.price;
    }
    return totalPrice;
  }
  function OrderItems(){
    alert("주문이 완료되었습니다.");
    setMenuList([]);
  }
  return (
    <main>
      <h1 style={{}}>미니 키오스크</h1>
      <hr></hr>
      <div id="content">
        <div className="menuItems">
          <MenuButton menuName="NewJeans 1st EP <New Jeans> Bag ver." menuPrice={17.70} menuImg="https://cdn-contents.weverseshop.io/public/shop/3d97f046d9e633e20def38ac7c98eb87.png?w=320&q=95" onClick={AddMenu}></MenuButton>
          <MenuButton menuName="NewJeans <Supernatural> NJ X MURAKAMI Drawstring Bag ver." menuPrice={17.70} menuImg="https://cdn-contents.weverseshop.io/public/shop/f5d8066c4d3f18d0294dcb5c307e3b80.png?w=320&q=95" onClick={AddMenu}></MenuButton>
          <MenuButton menuName="NewJeans <OMG> Weverse Albums ver." menuPrice={8.57} menuImg="https://cdn-contents.weverseshop.io/public/shop/13b8bc23633f83d9638d2ff0c4875d26.png?w=320&q=95" onClick={AddMenu}></MenuButton>
        </div>
        <div className="shoppingCart">
          <h2 style={{textAlign: "center"}}>장바구니</h2>
          <div id="cartItems">
            {
              (TotalCount()>0)?
                menuList.filter(menu=>menu.quantity>0).map(menu=>(
                  <MenuItem
                    menuName={menu.name}
                    menuPrice={menu.price}
                    menuCnt={menu.quantity}
                    onClick={AddMenu}></MenuItem>
                ))
                :<div style={{textAlign: "center"}}>장바구니가 비어 있습니다.</div>
            }
          </div>
          <div id="cartBottom">
            <div className="cartHorizontalTexts">
              <div>총 수량</div>
              <div>{TotalCount()}개</div>
            </div>
            <div className="cartHorizontalTexts">
              <div>총 금액</div>
              <div>${TotalPrice().toFixed(2)}</div>
            </div>
            <button id="cartOrderButton" disabled={TotalCount()<=0} onClick={OrderItems}>주문하기</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function MenuButton({menuName, menuPrice, menuImg, onClick}
  :{menuName:string, menuPrice:number, menuImg:string, onClick: (menuName: string, menuPrice: number, difference:number) => void;})
{
  return <button 
      className="menuButton"
      onClick={()=>onClick(menuName,menuPrice, 1)
      }>
        <img className="menuImg" src={menuImg}></img>
        <p className="menuTitle">{menuName}</p>
        <p className="menuPrice">${menuPrice.toFixed(2).toLocaleString()}</p>
    </button>;
}

function MenuItem({menuName, menuPrice, menuCnt, onClick}
  :{menuName:string, menuPrice:number, menuCnt:number, onClick: (menuName:string, menuPrice:number, difference:number) => void;}
)
{
  return <div className="cartItem">
    <div className="cartItemName">{menuName}</div>
    <div className="cartCntAdjust">
      <button onClick={()=>onClick(menuName, menuPrice, 1)}>+</button>
      <div>{menuCnt}</div>
      <button onClick={()=>onClick(menuName, menuPrice, -1)}>-</button>
    </div>
    <div className="cartCalcItem">
      ${(menuPrice).toFixed(2)} X {menuCnt}개 = ${(menuPrice*menuCnt).toFixed(2)}
    </div>
  </div>
}

export default App;
