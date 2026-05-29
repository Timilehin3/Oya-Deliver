import { Link } from 'react-router-dom';
import logoBird from '../assets/oyadeliver_both_textandbird.png';

const Error404Page = () => (
  <section className="max-w-lg mx-auto px-4 py-20 text-center">
    <p className="text-8xl font-black text-oya-teal/20">404</p>
    <h1 className="text-2xl font-bold text-oya-teal mt-4">Oops! Page not found</h1>
    <p className="text-oya-teal/70 mt-2 mb-8">
      The bird flew off with this page. Let&apos;s get you back home.
    </p>
    <img
      src={logoBird}
      alt="Oya Deliver"
      className="h-24 mx-auto object-contain opacity-80 mb-8"
    />
    <Link
      to="/"
      className="inline-block px-6 py-3 rounded-full bg-oya-green text-white font-semibold hover:bg-oya-teal transition-colors"
    >
      Back to home
    </Link>
  </section>
);

export default Error404Page;
