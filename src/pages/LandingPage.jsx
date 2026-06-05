import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import ProductCard from "../components/ui/ProductCard";
import ProductCardSkeleton from "../components/ui/ProductCardSkeleton";
import categories from "../data/categories.json";
import productsData from "../data/products.json";
import logoOnlyText from "../assets/oyadeliver_logo_onlytext.png";

const FEATURED_CATEGORIES = categories.slice(0, 6);

const categoryAccent = {
  Fruits: "border-l-oya-green",
  Vegetables: "border-l-green-600",
  Dairy: "border-l-blue-600",
  Bakery: "border-l-oya-amber",
  "Meat & Seafood": "border-l-rose-600",
  Pantry: "border-l-orange-600",
};

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const items = productsData.filter((p) => p.featured).slice(0, 4);
      setFeatured(items);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-oya-paper border-b border-oya-teal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-oya-green font-bold text-sm uppercase tracking-widest mb-3">
                grocery delivery
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-oya-teal leading-tight">
                Fresh groceries{" "}
                <span className="text-oya-green">delivered</span> in minutes
              </h1>
              <p className="mt-4 text-lg text-oya-teal/70 max-w-md">
                Shop local produce, pantry staples, and weekly deals — brought
                straight to your door by Oya Deliver.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-8 flex gap-2 max-w-lg"
              >
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-oya-teal/40 w-5 h-5" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bananas, milk, bread…"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-oya-teal/20 bg-white text-oya-teal placeholder:text-oya-teal/40 focus:outline-none focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 bg-oya-green text-white font-bold rounded-lg hover:bg-oya-teal transition-colors shrink-0"
                >
                  Search
                </button>
              </form>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-6 text-oya-teal font-semibold hover:text-oya-green transition-colors"
              >
                Browse all groceries
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src={logoOnlyText}
                alt="Oya Deliver logo"
                className="w-full max-w-md lg:max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-oya-teal">
              Shop by category
            </h2>
            <p className="text-oya-teal/60 mt-1">
              Pick a aisle and start filling your cart
            </p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-oya-green hover:text-oya-teal transition-colors"
          >
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className={`bg-white border border-oya-teal/10 border-l-4 ${
                categoryAccent[cat] ?? "border-l-oya-teal"
              } rounded-lg p-5 hover:border-oya-green/40 transition-colors`}
            >
              <span className="font-bold text-sm text-oya-teal">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-white border-y border-oya-teal/10 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-oya-teal">
                Featured picks
              </h2>
              <p className="text-oya-teal/60 mt-1">
                Popular items our customers love
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-oya-green hover:text-oya-teal transition-colors"
            >
              See all products <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-oya-teal rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-oya-paper">
              First delivery on us
            </h2>
            <p className="text-oya-paper/70 mt-2">
              Sign up today and get free delivery on your first order.
            </p>
          </div>
          <Link
            to="/register"
            className="px-8 py-3 bg-oya-amber text-oya-teal font-bold rounded-lg hover:bg-oya-green hover:text-white transition-colors shrink-0"
          >
            Create free account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
