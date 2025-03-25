import { useState, useEffect } from "react"
import axios from "axios"
import "../storePage.css"

const StorePage = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8090/product/all")
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

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
      <div className="products-grid">
        {products
          .filter((prod) => prod.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((prod) => (
            <div key={prod._id} className="product-card">
              <img src={`http://localhost:8090/${prod.image}`} alt={prod.name} className="product-image" />
              <h3 className="product-name">{prod.name}</h3>
              <p className="product-category">{prod.category}</p>
              <p className="product-price">${prod.price}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default StorePage;