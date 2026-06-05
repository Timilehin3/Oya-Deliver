import { FiMinus, FiPlus } from "react-icons/fi";
import { formatPrice } from "../../utils/formatPrice";

const CartItem = ({ item, onQuantityChange, onRemove, updating = false }) => {
  if (!item) return null;

  return (
    <div className="grid gap-4 rounded-[2rem] border border-oya-teal/10 bg-white p-5 sm:grid-cols-[1.4fr_0.9fr]">
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-oya-paper border border-oya-teal/10 p-4">
          <img
            src={item.image}
            alt={item.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div>
          <h3 className="font-bold text-oya-teal">{item.name}</h3>
          <p className="text-sm text-oya-teal/70">{item.category}</p>
          <p className="mt-3 text-sm text-oya-green font-semibold">
            {formatPrice(item.price)} / {item.unit}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-oya-teal/20 bg-oya-paper overflow-hidden">
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || updating}
              className="px-3 py-2 text-oya-teal hover:text-oya-green disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-semibold text-oya-teal">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={updating}
              className="px-3 py-2 text-oya-teal hover:text-oya-green disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={updating}
            className="text-sm font-semibold text-oya-amber hover:text-oya-teal disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
        </div>

        <div className="flex items-center justify-between text-sm text-oya-teal/70">
          <span>Item total</span>
          <span className="font-semibold text-oya-teal">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
