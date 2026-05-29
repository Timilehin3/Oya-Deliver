import { Link } from 'react-router-dom';

const EmptyState = ({
  title,
  description,
  image,
  actionLabel = 'Start Shopping',
  actionTo = '/products',
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
    {image && <img src={image} alt="" className="w-40 h-40 object-contain mb-6 opacity-90" />}
    <h2 className="text-xl font-bold text-oya-teal">{title}</h2>
    {description && <p className="text-oya-teal/70 mt-2 max-w-sm">{description}</p>}
    {onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="mt-6 px-6 py-3 rounded-lg bg-oya-green text-white font-semibold hover:bg-oya-teal transition-colors"
      >
        {actionLabel}
      </button>
    ) : (
      <Link
        to={actionTo}
        className="mt-6 px-6 py-3 rounded-lg bg-oya-green text-white font-semibold hover:bg-oya-teal transition-colors"
      >
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
