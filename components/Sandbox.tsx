import React, { useEffect, useState } from 'react';
import { useTracking } from '../contexts/TrackingContext';
import { ShoppingCart, Star, ArrowRight, Home, Package, Info, CreditCard } from 'lucide-react';

// Simulated Pages
const PAGES = ['Home', 'Products', 'ProductDetail', 'Cart', 'Checkout'];

export const Sandbox: React.FC = () => {
  const { track } = useTracking();
  const [activePage, setActivePage] = useState('Home');
  const [cartCount, setCartCount] = useState(0);

  // Track page views when activePage changes
  useEffect(() => {
    track('page_view', activePage, { title: `${activePage} - Demo Store` });
  }, [activePage, track]);

  const navigate = (page: string) => {
    setActivePage(page);
  };

  const handleAddToCart = (productName: string, price: number) => {
    setCartCount(prev => prev + 1);
    track('custom', 'add_to_cart', { product: productName, price, currency: 'USD' });
  };

  const handleCheckout = () => {
    track('click', 'checkout_start', { cartItems: cartCount });
    navigate('Checkout');
  };

  const handlePurchase = () => {
    if (cartCount === 0) {
      track('error', 'checkout_empty_cart', { message: 'Attempted checkout with 0 items' });
      alert("Cart is empty!");
      return;
    }
    track('conversion', 'purchase_complete', { 
      value: cartCount * 49.99, 
      items: cartCount,
      currency: 'USD'
    });
    setCartCount(0);
    alert("Purchase Simulated! Event Tracked.");
    navigate('Home');
  };

  // --- Page Components ---

  const HomePage = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Summer Collection 2024</h2>
        <p className="mb-4 opacity-90">Experience the future of fashion analytics.</p>
        <button 
          onClick={() => {
            track('click', 'hero_cta_clicked');
            navigate('Products');
          }}
          className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Shop Now
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {
              track('click', `featured_collection_${i}_clicked`);
              navigate('Products');
          }}>
            <div className="h-24 bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-slate-400">
               <Package size={32} />
            </div>
            <h3 className="font-semibold text-slate-800">Collection {i}</h3>
            <p className="text-sm text-slate-500">Trending now</p>
          </div>
        ))}
      </div>
    </div>
  );

  const ProductsPage = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
      {['Classic Tee', 'Urban Hoodie', 'Pro Sneakers', 'Cap'].map((item, idx) => (
        <div key={item} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
          <div 
            className="h-32 bg-slate-50 rounded-lg mb-4 flex items-center justify-center cursor-pointer"
            onClick={() => {
                track('click', 'product_image_click', { product: item });
                navigate('ProductDetail');
            }}
          >
            <Package className="text-slate-300" size={48} />
          </div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-slate-800">{item}</h3>
              <p className="text-sm text-slate-500">$49.99</p>
            </div>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
          </div>
          <button 
            onClick={() => handleAddToCart(item, 49.99)}
            className="mt-auto w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      ))}
    </div>
  );

  const ProductDetailPage = () => (
    <div className="animate-fade-in space-y-6">
        <button onClick={() => navigate('Products')} className="text-sm text-slate-500 hover:underline mb-4">← Back to Products</button>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="h-64 bg-slate-100 rounded-xl mb-6 flex items-center justify-center">
                <Package className="text-slate-300" size={80} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Classic Tee</h1>
            <p className="text-xl text-indigo-600 font-semibold mb-4">$49.99</p>
            <p className="text-slate-600 mb-6">
                This is a high-quality simulation product designed to test your event tracking capabilities. 
                Clicking around this page generates valuable data points.
            </p>
            <div className="flex gap-4">
                <button 
                    onClick={() => handleAddToCart('Classic Tee', 49.99)}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Add to Cart
                </button>
                <button 
                    onClick={() => track('custom', 'add_to_wishlist', { product: 'Classic Tee' })}
                    className="px-4 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
                >
                    <Star size={20} />
                </button>
            </div>
        </div>
        
        {/* Suggested Section to generate more scroll/click events */}
        <div className="pt-8 border-t border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4">You might also like</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
                 {[1,2,3].map(i => (
                     <div key={i} className="min-w-[150px] h-32 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200 transition" onClick={() => track('click', 'related_product_click', { id: i })}>
                         Related {i}
                     </div>
                 ))}
            </div>
        </div>
    </div>
  );

  const CheckoutPage = () => (
    <div className="animate-fade-in bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h2>
        <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600">Subtotal ({cartCount} items)</span>
                <span className="font-semibold">${(cartCount * 49.99).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-slate-800">Total</span>
                <span className="text-lg font-bold text-indigo-600">${(cartCount * 49.99).toFixed(2)}</span>
            </div>
        </div>
        
        <button 
            onClick={handlePurchase}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2"
        >
            <CreditCard size={20} /> Pay Now
        </button>
        <button 
             onClick={() => navigate('Cart')}
             className="w-full mt-4 text-slate-500 text-sm hover:text-slate-800"
        >
            Return to Cart
        </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden rounded-2xl border border-slate-200 shadow-xl relative">
      {/* Mock Browser Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-slate-100 rounded-md px-3 py-1.5 text-xs text-slate-500 font-mono flex items-center">
            <span className="text-slate-400 mr-2">https://</span>
            shop-demo.local/{activePage.toLowerCase()}
        </div>
        <div className="flex items-center gap-4 text-slate-600">
            <div 
                className="relative cursor-pointer hover:text-indigo-600 transition"
                onClick={() => {
                    navigate('Cart');
                    track('click', 'nav_cart_icon');
                }}
            >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                    </span>
                )}
            </div>
        </div>
      </div>

      {/* Mock Site Content */}
      <div className="flex-1 overflow-y-auto p-6 relative">
          {/* Simple Router Switch */}
          {activePage === 'Home' && <HomePage />}
          {activePage === 'Products' && <ProductsPage />}
          {activePage === 'ProductDetail' && <ProductDetailPage />}
          {activePage === 'Cart' && (
              <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">Your Cart ({cartCount})</h2>
                  <button onClick={handleCheckout} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">Proceed to Checkout</button>
              </div>
          )}
          {activePage === 'Checkout' && <CheckoutPage />}
      </div>
      
      {/* Sandbox Nav Bar (Bottom) */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center text-sm shrink-0">
         <div className="flex gap-6">
             {PAGES.slice(0,2).map(p => (
                 <button 
                    key={p} 
                    onClick={() => navigate(p)}
                    className={`font-medium transition ${activePage === p ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                 >
                     {p}
                 </button>
             ))}
         </div>
         <div className="text-xs text-slate-400">
             Interactive Sandbox Environment
         </div>
      </div>
    </div>
  );
};
