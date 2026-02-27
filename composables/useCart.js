// composables/useCart.js
export const useCart = () => {
  const cartItems = useState('cart-items', () => []);
  const cartStore = useState('cart-store', () => null);

  if (process.client && cartItems.value.length === 0) {
    try {
      const saved = localStorage.getItem('helparr_cart');
      const savedStore = localStorage.getItem('helparr_cart_store');
      if (saved) cartItems.value = JSON.parse(saved);
      if (savedStore) cartStore.value = savedStore;
    } catch (e) {}
  }

  const persist = () => {
    if (process.client) {
      localStorage.setItem('helparr_cart', JSON.stringify(cartItems.value));
      localStorage.setItem('helparr_cart_store', cartStore.value || '');
    }
  };

  const addToCart = (product, quantity = 1, merchantId = null) => {
    if (merchantId && cartStore.value && cartStore.value !== merchantId) cartItems.value = [];
    if (merchantId) cartStore.value = merchantId;

    const existing = cartItems.value.find((i) => i.product_id === product.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.quantity || 999);
    } else {
      cartItems.value.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        compare_price: product.compare_price,
        image: product.image || null,
        quantity,
        stock: product.quantity || 999,
      });
    }
    persist();
  };

  const updateQuantity = (productId, quantity) => {
    const item = cartItems.value.find((i) => i.product_id === productId);
    if (item) {
      if (quantity <= 0) { removeFromCart(productId); return; }
      item.quantity = Math.min(quantity, item.stock);
      persist();
    }
  };

  const removeFromCart = (productId) => {
    cartItems.value = cartItems.value.filter((i) => i.product_id !== productId);
    if (!cartItems.value.length) cartStore.value = null;
    persist();
  };

  const clearCart = () => { cartItems.value = []; cartStore.value = null; persist(); };

  const cartCount = computed(() => cartItems.value.reduce((s, i) => s + i.quantity, 0));
  const cartSubtotal = computed(() => cartItems.value.reduce((s, i) => s + i.price * i.quantity, 0));
  const platformFee = computed(() => cartSubtotal.value * 0.025);
  const cartTotal = computed(() => cartSubtotal.value + platformFee.value);
  const isInCart = (id) => cartItems.value.some((i) => i.product_id === id);
  const getItemQuantity = (id) => { const i = cartItems.value.find((x) => x.product_id === id); return i ? i.quantity : 0; };

  return { cartItems, cartStore, cartCount, cartSubtotal, cartTotal, platformFee, addToCart, updateQuantity, removeFromCart, clearCart, isInCart, getItemQuantity };
};