import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiImage } from "react-icons/fi";
import supabase from "../../supabase/client";
import { formatPrice } from "../../utils/formatPrice";
import toast from "react-hot-toast";
import categories from "../../data/categories.json";

const AdminCatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: categories[0],
    unit: "kg",
    description: "",
    stock_quantity: 0,
    reorder_threshold: 10,
    vendor: "Oya Deliver Primary",
    tax_class: "standard",
    featured: false,
    image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Searchable category state
  const [categorySearch, setCategorySearch] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load products");
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setForm({
        name: product.name,
        price: product.price,
        category: product.category,
        unit: product.unit,
        description: product.description || "",
        stock_quantity: product.stock_quantity || 0,
        reorder_threshold: product.reorder_threshold || 10,
        vendor: product.vendor || "Oya Deliver Primary",
        tax_class: product.tax_class || "standard",
        featured: product.featured || false,
        image: product.image || ""
      });
    } else {
      setEditingId(null);
      setForm({
        name: "",
        price: "",
        category: categories[0],
        unit: "kg",
        description: "",
        stock_quantity: 0,
        reorder_threshold: 10,
        vendor: "Oya Deliver Primary",
        tax_class: "standard",
        featured: false,
        image: ""
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageFile(null);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return form.image;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      throw new Error("Image upload failed");
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await handleImageUpload();
      }

      if (!imageUrl && !editingId) {
        // Provide a default placeholder if no image is uploaded
        imageUrl = "/images/product-placeholder.png";
      }

      const productData = {
        ...form,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        reorder_threshold: Number(form.reorder_threshold),
        image: imageUrl,
      };

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        toast.success("Product added successfully");
      }

      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to save product");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-oya-teal">Catalog & Inventory</h1>
          <p className="text-sm text-oya-teal/70 mt-1">Manage your store products and stock levels.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-oya-green text-white font-semibold rounded-lg hover:bg-oya-teal transition-colors"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-12 bg-white border border-oya-teal/10 rounded-lg"></div>
          <div className="h-12 bg-white border border-oya-teal/10 rounded-lg"></div>
          <div className="h-12 bg-white border border-oya-teal/10 rounded-lg"></div>
        </div>
      ) : (
        <div className="bg-white border border-oya-teal/10 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-oya-teal">
              <thead className="bg-oya-paper text-oya-teal/70 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oya-teal/10">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-oya-teal/50">
                      No products found. Add your first product to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const isLowStock = product.stock_quantity <= product.reorder_threshold;
                    return (
                      <tr key={product.id} className="hover:bg-oya-teal/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image || "/images/product-placeholder.png"}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-md bg-oya-paper"
                            />
                            <div>
                              <p className="font-bold text-oya-teal">{product.name}</p>
                              <p className="text-xs text-oya-teal/50">Vendor: {product.vendor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4 font-semibold">{formatPrice(product.price)}/{product.unit}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={isLowStock ? "text-amber-600 font-bold" : "text-oya-green font-semibold"}>
                              {product.stock_quantity}
                            </span>
                            {isLowStock && (
                              <FiAlertCircle className="w-4 h-4 text-amber-500" title="Low stock warning" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openModal(product)}
                            className="p-2 text-oya-teal hover:text-oya-green transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-oya-teal hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-oya-teal/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-oya-teal/10 flex justify-between items-center bg-oya-paper">
              <h2 className="text-lg font-bold text-oya-teal">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={closeModal} className="text-oya-teal/50 hover:text-oya-teal">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-oya-teal/70 uppercase text-xs tracking-wider">Basic Info</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-oya-teal mb-1">Name</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border border-oya-teal/20 rounded-lg focus:outline-none focus:border-oya-green"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-oya-teal mb-1">Price (₦)</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full px-3 py-2 border border-oya-teal/20 rounded-lg focus:outline-none focus:border-oya-green"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-oya-teal mb-1">Unit</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. kg, pack, liter"
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        className="w-full px-3 py-2 border border-oya-teal/20 rounded-lg focus:outline-none focus:border-oya-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-oya-teal mb-1">Category</label>
                    <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsCategoryOpen(false); }}>
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="Search category…"
                        value={isCategoryOpen ? categorySearch : form.category}
                        onFocus={() => { setCategorySearch(""); setIsCategoryOpen(true); }}
                        onChange={(e) => { setCategorySearch(e.target.value); setIsCategoryOpen(true); }}
                        className="w-full px-3 py-2 border border-oya-teal/20 rounded-lg focus:outline-none focus:border-oya-green text-sm"
                      />
                      {isCategoryOpen && filteredCategories.length > 0 && (
                        <ul className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-oya-teal/20 rounded-lg shadow-lg">
                          {filteredCategories.map((cat) => (
                            <li
                              key={cat}
                              tabIndex={0}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setForm({ ...form, category: cat });
                                setCategorySearch("");
                                setIsCategoryOpen(false);
                              }}
                              className={`px-3 py-2 text-sm cursor-pointer hover:bg-oya-green/10 hover:text-oya-green ${
                                form.category === cat ? "bg-oya-green/10 text-oya-green font-semibold" : "text-oya-teal"
                              }`}
                            >
                              {cat}
                            </li>
                          ))}
                        </ul>
                      )}
                      {isCategoryOpen && filteredCategories.length === 0 && (
                        <div className="absolute z-50 mt-1 w-full px-3 py-2 bg-white border border-oya-teal/20 rounded-lg shadow-lg text-sm text-oya-teal/50">
                          No matching category
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inventory & Display */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-oya-teal/70 uppercase text-xs tracking-wider">Inventory & Display</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-oya-teal mb-1">Stock Qty</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={form.stock_quantity}
                        onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                        className="w-full px-3 py-2 border border-oya-teal/20 rounded-lg focus:outline-none focus:border-oya-green"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-oya-teal mb-1">Low Stock Alert</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={form.reorder_threshold}
                        onChange={(e) => setForm({ ...form, reorder_threshold: e.target.value })}
                        className="w-full px-3 py-2 border border-oya-teal/20 rounded-lg focus:outline-none focus:border-oya-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-oya-teal mb-1">Vendor / Store</label>
                    <input
                      required
                      type="text"
                      value={form.vendor}
                      onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                      className="w-full px-3 py-2 border border-oya-teal/20 rounded-lg focus:outline-none focus:border-oya-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-oya-teal mb-1">Product Image</label>
                    <div className="flex items-center gap-4">
                      {form.image && !imageFile && (
                        <img src={form.image} alt="Preview" className="w-12 h-12 rounded object-cover border border-oya-teal/20" />
                      )}
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-oya-teal/30 rounded-lg cursor-pointer hover:bg-oya-teal/5 transition-colors text-sm text-oya-teal/70">
                        <FiImage />
                        <span>{imageFile ? imageFile.name : "Upload new image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setImageFile(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-oya-teal hover:text-oya-green">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="rounded border-oya-teal/30 text-oya-green focus:ring-oya-green/30"
                      />
                      Feature this product on the landing page
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-oya-teal mb-1">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-oya-teal/20 rounded-lg focus:outline-none focus:border-oya-green resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-oya-teal/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-semibold text-oya-teal hover:bg-oya-teal/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-oya-green hover:bg-oya-teal rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCatalogPage;
