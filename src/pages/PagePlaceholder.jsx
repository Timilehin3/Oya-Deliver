import { Link } from 'react-router-dom';

const PagePlaceholder = ({ title, description }) => (
  <section className="max-w-3xl mx-auto px-4 py-16 text-center">
    <h1 className="text-3xl font-bold text-oya-teal mb-3">{title}</h1>
    <p className="text-oya-teal/70 mb-8">
      {description ?? 'This page will be built in the next phase.'}
    </p>
    <Link
      to="/"
      className="inline-block px-6 py-3 rounded-full bg-oya-green text-white font-semibold hover:bg-oya-teal transition-colors"
    >
      Back to home
    </Link>
  </section>
);

export default PagePlaceholder;
