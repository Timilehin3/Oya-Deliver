import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import ProductCard from '../components/ui/ProductCard';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import categories from '../data/categories.json';
import supabase from '../supabase/client';
import { formatPrice } from '../utils/formatPrice';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

const MAX_PRICE = 500000;
const MIN_PRICE = 500;

function filterProducts(products, { search, selectedCategories, maxPrice }) {
  const term = search.trim().toLowerCase();

  return products.filter((p) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
      return false;
    }
    if (p.price > maxPrice) return false;
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  });
}

function sortProducts(products, sort) {
  const list = [...products];
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return list;
  }
}

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const search = searchParams.get('search') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const selectedCategories = searchParams.getAll('category');
  const maxPrice = Number(searchParams.get('maxPrice')) || MAX_PRICE;

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const setSearchParam = (query) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (query) next.set('search', query);
      else next.delete('search');
      return next;
    }, { replace: true });
  };

  const setSortParam = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('sort', value);
      else next.delete('sort');
      return next;
    }, { replace: true });
  };

  const setMaxPriceParam = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value >= MAX_PRICE) next.delete('maxPrice');
      else next.set('maxPrice', String(value));
      return next;
    }, { replace: true });
  };

  const toggleCategoryInUrl = (cat) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete('category');
      next.forEach((c) => params.append('category', c));
      return params;
    }, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setSearchInput('');
    setMobileFiltersOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParam(searchInput.trim());
    setMobileFiltersOpen(false);
  };

  const filtered = useMemo(
    () => filterProducts(products, { search, selectedCategories, maxPrice }),
    [products, search, selectedCategories, maxPrice],
  );

  const displayed = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setAddingId(product.id);
    try {
      await addToCart(product);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      if (err.message === 'LOGIN_REQUIRED') {
        navigate('/login', { state: { from: location } });
      } else {
        toast.error('Could not add to cart. Try again.');
      }
    } finally {
      setAddingId(null);
    }
  };

  const hasActiveFilters =
    search || selectedCategories.length > 0 || maxPrice < MAX_PRICE || sort;

  const filterSidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-oya-teal mb-3">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat}>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-oya-teal hover:text-oya-green">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategoryInUrl(cat)}
                  className="rounded border-oya-teal/30 text-oya-green focus:ring-oya-green/30"
                />
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-oya-teal mb-3">
          Max price: {maxPrice >= MAX_PRICE ? 'Any' : formatPrice(maxPrice)}
        </h3>
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPriceParam(Number(e.target.value))}
          className="w-full accent-oya-green"
        />
        <div className="flex justify-between text-xs text-oya-teal/50 mt-1">
          <span>{formatPrice(MIN_PRICE)}</span>
          <span>{formatPrice(MAX_PRICE)}</span>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-semibold text-oya-amber hover:text-oya-teal transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-oya-teal">Groceries</h1>
        <p className="text-oya-teal/60 mt-1">
          {loading ? 'Loading products…' : `${displayed.length} product${displayed.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-oya-teal/40 w-5 h-5" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-oya-teal/20 bg-white text-oya-teal placeholder:text-oya-teal/40 focus:outline-none focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-oya-teal text-white font-semibold rounded-lg hover:bg-oya-green transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSortParam(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2.5 rounded-lg border border-oya-teal/20 bg-white text-oya-teal text-sm focus:outline-none focus:border-oya-green"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen((o) => !o)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-oya-teal/20 rounded-lg bg-white text-oya-teal font-semibold text-sm"
          >
            {mobileFiltersOpen ? <FiX className="w-4 h-4" /> : <FiFilter className="w-4 h-4" />}
            Filters
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && !loading && (
        <div className="flex flex-wrap gap-2 mb-6">
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-oya-teal/10 text-oya-teal text-sm rounded-lg">
              &ldquo;{search}&rdquo;
              <button type="button" onClick={() => setSearchParam('')} aria-label="Remove search">
                <FiX className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 px-3 py-1 bg-oya-green/10 text-oya-green text-sm rounded-lg"
            >
              {cat}
              <button type="button" onClick={() => toggleCategoryInUrl(cat)} aria-label={`Remove ${cat}`}>
                <FiX className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 bg-white border border-oya-teal/10 rounded-lg p-5">
            {filterSidebar}
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <button
              type="button"
              className="absolute inset-0 bg-oya-teal/40"
              aria-label="Close filters"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-oya-teal">Filters</h2>
                <button type="button" onClick={() => setMobileFiltersOpen(false)}>
                  <FiX className="w-5 h-5 text-oya-teal" />
                </button>
              </div>
              {filterSidebar}
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <EmptyState
              title="No products match your criteria"
              description="Try adjusting your search or filters to find what you're looking for."
              image="/images/empty-cart.svg"
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {displayed.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showAddToCart
                  onAddToCart={handleAddToCart}
                  adding={addingId === product.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
