import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import supabase from '../supabase/client';
import { formatPrice } from '../utils/formatPrice';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      setQuantity(1);
      
      const { data: found, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) console.error(error);

      if (mounted) {
        setProduct(found || null);
        
        if (found) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .eq('category', found.category)
            .neq('id', found.id)
            .limit(4);
          setAllProducts(relatedData || []);
        }
      }
      if (mounted) setLoading(false);
    }
    loadData();

    return () => { mounted = false; };
  }, [id]);

  const related = allProducts;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setAdding(true);
    try {
      await addToCart(product, quantity);
      toast.success(
        quantity === 1
          ? `${product.name} added to cart`
          : `${quantity} × ${product.name} added to cart`,
      );
    } catch (err) {
      if (err.message === 'LOGIN_REQUIRED') {
        navigate('/login', { state: { from: location } });
      } else {
        toast.error('Could not add to cart. Try again.');
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          title="Product not found"
          description="This item may have been removed or the link is incorrect."
          image="/images/empty-cart.svg"
          actionLabel="Browse groceries"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-oya-teal/70 hover:text-oya-green transition-colors mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to groceries
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <div className="bg-oya-paper border border-oya-teal/10 rounded-lg p-8 flex items-center justify-center aspect-square max-h-[480px]">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-xs text-oya-green font-semibold uppercase tracking-wide">
            {product.category}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-oya-teal mt-2">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-extrabold text-oya-teal">
              {formatPrice(product.price)}
            </span>
            <span className="text-oya-teal/60">per {product.unit}</span>
          </div>

          <p className="text-oya-teal/70 mt-6 leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <p className="text-sm font-bold text-oya-teal mb-3">Quantity</p>
            <div className="inline-flex items-center border border-oya-teal/20 rounded-lg bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="p-3 text-oya-teal hover:text-oya-green disabled:opacity-40 transition-colors"
                aria-label="Decrease quantity"
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-oya-teal">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-oya-teal hover:text-oya-green transition-colors"
                aria-label="Increase quantity"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-oya-teal/60">
            <span>Subtotal</span>
            <span className="font-bold text-oya-teal text-base">
              {formatPrice(product.price * quantity)}
            </span>
          </div>

          <button
            type="button"
            disabled={adding}
            onClick={handleAddToCart}
            className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-oya-green text-white font-bold rounded-lg hover:bg-oya-teal disabled:opacity-60 transition-colors"
          >
            <FiShoppingCart className="w-5 h-5" />
            {adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-oya-teal/10">
          <h2 className="text-xl font-extrabold text-oya-teal mb-6">
            More in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
