import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product, showAddToCart = false, onAddToCart, adding = false }) => {
  if (!product) return null;

  return (
    <article className="flex flex-col bg-white border border-oya-teal/10 rounded-lg overflow-hidden hover:border-oya-green/40 transition-colors">
      <Link to={`/products/${product.id}`} className="group block flex-1">
        <div className="aspect-square bg-oya-paper p-4 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="p-4 pb-3">
          <p className="text-xs text-oya-green font-semibold uppercase tracking-wide">
            {product.category}
          </p>
          <h3 className="font-bold text-oya-teal mt-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-lg font-extrabold text-oya-teal">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-oya-teal/60">/ {product.unit}</span>
          </div>
        </div>
      </Link>

      {showAddToCart && (
        <div className="px-4 pb-4">
          <button
            type="button"
            disabled={adding}
            onClick={(e) => onAddToCart?.(product, e)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-oya-green text-white text-sm font-bold rounded-lg hover:bg-oya-teal disabled:opacity-60 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            {adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      )}
    </article>
  );
};

export default ProductCard;
