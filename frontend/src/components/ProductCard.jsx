import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product }) {
  const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Calculate discounted price
  const discountedPrice = product.discount_percentage > 0
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/products' } } });
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product.id, 1);
    setAddingToCart(false);

    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
        {/* Main Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isHovered && product.image_2 ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Alternate Image on Hover */}
        {product.image_2 && (
          <img
            src={product.image_2}
            alt={`${product.name} - alternate`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              -{product.discount_percentage}%
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full shadow-md">
              TOP
            </span>
          </div>
        )}

        {/* Quick Actions - Visible on Hover */}
        <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="w-full py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {addingToCart ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Qo'shilmoqda...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Savatga qo'shish</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(discountedPrice)} so'm
          </span>
          {product.discount_percentage > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)} so'm
            </span>
          )}
        </div>

        {/* External Links */}
        <div className="flex gap-2 pt-2">
          <a
            href={product.uzum_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Uzum
          </a>

          {product.yandex_market_link && (
            <a
              href={product.yandex_market_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 py-2 px-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Yandex
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
