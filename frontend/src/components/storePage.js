import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import "../storePage.css"

const StorePage = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const goToMyOrders = () => {
    navigate("/my-orders");
  };

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://online-system-for-pet-care-and-treatment.onrender.com/product/all")
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  // Function to open the product details popup
  const openProductPopup = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
};


// Function to close the product details popup
const closeProductPopup = () => {
  setSelectedProduct(null);
};

// Function to handle quantity changes
const handleQuantityChange = (value) => {
  if (value >= 1 && value <= selectedProduct.stock) {
      setQuantity(value);
  }
};

// Function to add product to the cart
const addToCart = () => {

  if (selectedProduct.stock === 0 || !selectedProduct || quantity > selectedProduct.stock) return;

  const existingProduct = cart.find(item => item._id === selectedProduct._id);
  if (existingProduct) {
      //Update quantity in cart
      setCart(cart.map(item => item._id === selectedProduct._id ? { ...item, quantity: item.quantity + quantity } : item));
  } else {
      //Add new item to cart
      setCart([...cart, { ...selectedProduct, quantity }]);
  }

  // Reduce stock count immediately
    setProducts(products.map(item =>
        item._id === selectedProduct._id
            ? { ...item, stock: item.stock - quantity }
            : item
    ));

  closeProductPopup();
};

const removeFromCart = (productId) => {
  const removedProduct = cart.find(item => item._id === productId);
  if (removedProduct) {
    setCart(cart.filter(item => item._id !== productId));
    setProducts(products.map(item =>
      item._id === productId
        ? { ...item, stock: item.stock + removedProduct.quantity }
        : item
    ));
  }
};

//Calculate total cart value
const totalValue = cart.reduce((total, item) => total + item.price * item.quantity, 0);
const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="store-container">
      <h1 className="store-title">Pet Item Store</h1>
      <input
        type="text"
        placeholder="Search Products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className = "button-container">
      <button className="view-cart-btn" onClick={() => setShowCart(true)}>
        {cartItemCount > 0 ? `${cartItemCount} Products in the Cart` : "View Cart"}
      </button>
      <button onClick={goToMyOrders} className="my-orders-btn">My Orders</button>
      </div>
      <div className="products-grid">
        {products
          .filter((prod) => prod.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((prod) => (
            <div key={prod._id} className="product-card">
              <img src={`https://online-system-for-pet-care-and-treatment.onrender.com/${prod.image}`} alt={prod.name} className="product-image" />
              <h3 className="product-name">{prod.name}</h3>
              <p className="product-category">{prod.category}</p>
              <p className="product-price">Rs. {prod.price}.00</p>
              <p>Stock: {prod.stock > 0 ? prod.stock : "Out of Stock"}</p>
              <button onClick={() => openProductPopup(prod)} disabled={prod.stock === 0}>Add to Cart</button>
            </div>
          ))}
      </div>

      {/* Product Details Popup */}
      {selectedProduct && (
                <div className="product-popup-overlay" onClick={closeProductPopup}>
                <div className="product-popup" onClick={(e) => e.stopPropagation()}>
                  <h2>{selectedProduct.name}</h2>
                  <p>{selectedProduct.description}</p>
                  <p>Price: Rs.{selectedProduct.price}</p>
                  <p className="stock-info">
                    Stock:{" "}
                    {selectedProduct.stock > 0 ? selectedProduct.stock : <span className="out-of-stock">Out of Stock</span>}
                  </p>
                  <div className="quantity-selector">
                    <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>
                      -
                    </button>
                    <input type="number" value={quantity} onChange={(e) => handleQuantityChange(Number(e.target.value))} />
                    <button onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= selectedProduct.stock}>
                      +
                    </button>
                  </div>
                  <div className="popup-actions">
                    <button className="add-to-cart-btn" onClick={addToCart} disabled={selectedProduct.stock === 0}>
                      Add to Cart
                    </button>
                    <button className="cancel-btn" onClick={closeProductPopup}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              )}

        {showCart && (
          <div className="cart-popup-overlay" onClick={() => setShowCart(false)}>
            <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
              <h2 className="cart-heading">Cart</h2>
              {cart.length === 0 ? <p className="empty-cart-message">Cart is empty</p> : (
                <table className="cart-table">
                  <thead className="cart-table-header">
                    <tr>
                      <th className="cart-table-th">Product</th>
                      <th className="cart-table-th">Quantity</th>
                      <th className="cart-table-th">Price</th>
                      <th className="cart-table-th">Total</th>
                      <th className="cart-table-th">Action</th>
                    </tr>
                  </thead>
                  <tbody className="cart-table-body">
                    {cart.map((item) => (
                      <tr key={item._id} className="cart-item-row">
                        <td className="cart-table-td">{item.name}</td>
                        <td className="cart-table-td">{item.quantity}</td>
                        <td className="cart-table-td">Rs.{item.price}</td>
                        <td className="cart-table-td">Rs.{item.price * item.quantity}</td>
                        <td><button className="remove-button" onClick={() => removeFromCart(item._id)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <h3 className="cart-total">Sub total: <b>Rs.{totalValue}.00</b></h3>
              <div className="cart-buttons">
                <button className="checkout-btn" onClick = {() => navigate("/payment", {state: {cart,totalValue}})}>Proceed to Payment</button>
                <button className="close-cart-btn" onClick={() => setShowCart(false)}>Close</button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default StorePage;