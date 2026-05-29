/**
 * Run once from Firebase Console or a Cloud Function to seed catalog + demo accounts.
 * Enable Email/Password in Authentication, then create:
 *   user@test.com / password123  (role: user)
 *   admin@oya.com / admin123      (role: admin)
 * Store extended profile fields in Firestore `users/{uid}`.
 */
import products from './products.json';
import categories from './categories.json';

export const seedCatalog = { products, categories };

export const DEMO_USERS = [
  {
    email: 'user@test.com',
    password: 'password123',
    profile: { name: 'Demo User', phone: '555-0100', role: 'user' },
  },
  {
    email: 'admin@oya.com',
    password: 'admin123',
    profile: { name: 'Oya Admin', phone: '555-0199', role: 'admin' },
  },
];
