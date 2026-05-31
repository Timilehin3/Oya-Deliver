const ProductCardSkeleton = () => (
  <div className="bg-white border border-oya-teal/10 rounded-lg overflow-hidden animate-pulse">
    <div className="aspect-square bg-oya-teal/5" />
    <div className="p-4 space-y-2">
      <div className="h-3 w-16 bg-oya-teal/10 rounded" />
      <div className="h-4 w-full bg-oya-teal/10 rounded" />
      <div className="h-5 w-20 bg-oya-teal/10 rounded mt-3" />
    </div>
  </div>
);

export default ProductCardSkeleton;
