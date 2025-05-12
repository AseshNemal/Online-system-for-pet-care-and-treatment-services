import { useState, useEffect } from "react"
import axios from "axios"
import "../AdminDashboard.css"

const AdminDashboard = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    restockLevel: "",
    restockAmount: "",
    image: null,
  })
  const [editingProductId, setEditingProductId] = useState(null)

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  const handleImageChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.keys(product).forEach((key) => {
      formData.append(key, product[key])
    })

    try {
      if (editingProductId) {
        await axios.put(`https://online-system-for-pet-care-and-treatment.onrender.com/product/update/${editingProductId}`, formData)
      } else {
        await axios.post("https://online-system-for-pet-care-and-treatment.onrender.com/product/add", formData)
      }
      fetchProducts()
      closeForm()
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleEdit = (prod) => {
    setProduct({ ...prod, image: null })
    setEditingProductId(prod._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://online-system-for-pet-care-and-treatment.onrender.com/product/delete/${id}`)
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setProduct({ name: "", description: "", price: "", category: "", stock: "", image: null })
    setEditingProductId(null)
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Pet Store Management</h1>
        <div className="search-add-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => setShowForm(true)} className="add-button">
            + Add Product
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Restock Level</th>
              <th>Restock Amount</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((prod) => prod.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((prod) => (
                <tr key={prod._id}>
                  <td>{prod.name}</td>
                  <td>{prod.category}</td>
                  <td>Rs. {prod.price}.00</td>
                  <td>{prod.stock}</td>
                  <td>{prod.restockLevel}</td>
                  <td>{prod.restockAmount}</td>
                  <td>
                    <div className="product-image-container">
                      <img src={`https://online-system-for-pet-care-and-treatment.onrender.com/${prod.image}`} alt={prod.name} className="product-image" />
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(prod)} className="edit-button" title="Edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(prod._id)} className="delete-button" title="Delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editingProductId ? "Edit Product" : "Add Product"}</h2>
              <button onClick={closeForm} className="close-button">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={product.description}
                  onChange={handleChange}
                  required
                  rows={3}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="Price"
                    min="1"
                    max="999999"
                    value={product.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    min="1"
                    max="9999"
                    value={product.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={product.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="restockLevel">Restock Level</label>
                <input
                  id="restockLevel"
                  type="number"
                  name="restockLevel"
                  placeholder="Restock Level"
                  min="1"
                  max={product.stock}
                  value={product.restockLevel}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="restockAmount">Restock Amount</label>
                <input
                  id="restockAmount"
                  type="number"
                  name="restockAmount"
                  placeholder="Restock Amount"
                  min={product.restockLevel}
                  max="9999"
                  value={product.restockAmount}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-group">
                <label htmlFor="image">Product Image</label>
                <input id="image" type="file" name="image" onChange={handleImageChange} />
              </div>

              <div className="form-actions">
                <button type="button" onClick={closeForm} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {editingProductId ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard;