<template>
  <div class="cart-float">
    <button class="cart-float__btn" @click="showCart = true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>
      <span class="cart-float__count">{{ cartCount }}</span>
      <span class="cart-float__total">₦{{ formatPrice(cartSubtotal) }}</span>
    </button>

    <!-- Cart Drawer -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="showCart" class="cart-overlay" @click.self="showCart = false">
          <div class="cart-drawer">
            <div class="cart-drawer__head">
              <h3>Your Cart <span>({{ cartCount }})</span></h3>
              <button @click="showCart = false" class="cart-drawer__close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="cart-drawer__items">
              <div v-for="item in cartItems" :key="item.product_id" class="ci">
                <div class="ci__img-wrap">
                  <img v-if="item.image" :src="imgUrl(item.image)" class="ci__img" :alt="item.name" />
                  <div v-else class="ci__img-ph"></div>
                </div>
                <div class="ci__info">
                  <p class="ci__name">{{ item.name }}</p>
                  <p class="ci__price">₦{{ formatPrice(item.price * item.quantity) }}</p>
                  <div class="ci__qty">
                    <button @click="updateQuantity(item.product_id, item.quantity - 1)">−</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.product_id, item.quantity + 1)">+</button>
                  </div>
                </div>
                <button class="ci__remove" @click="removeFromCart(item.product_id)">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
              </div>
            </div>

            <div class="cart-drawer__foot">
              <div class="cart-drawer__row"><span>Subtotal</span><span>₦{{ formatPrice(cartSubtotal) }}</span></div>
              <div class="cart-drawer__row cart-drawer__row--sm"><span>Service fee (2.5%)</span><span>₦{{ formatPrice(platformFee) }}</span></div>
              <div class="cart-drawer__row cart-drawer__row--total"><span>Total</span><span>₦{{ formatPrice(cartTotal) }}</span></div>
              <button class="cart-drawer__cta" @click="goToCheckout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Checkout Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <StoreCheckoutModal
          v-if="showCheckout"
          :merchant-id="merchantId"
          @close="showCheckout = false"
          @success="handleCheckoutSuccess"
        />
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({ merchantId: String });
const config = useRuntimeConfig();

const showCart = ref(false);
const showCheckout = ref(false);

const { cartItems, cartCount, cartSubtotal, cartTotal, platformFee, updateQuantity, removeFromCart } = useCart();

const formatPrice = (price) => Number(price).toLocaleString('en-NG', { minimumFractionDigits: 0 });

// Fix: prepend apiBase to image paths so cart thumbnails actually load
const imgUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${config.public.apiBase}${path}`;
};

const goToCheckout = () => { showCart.value = false; showCheckout.value = true; };
const handleCheckoutSuccess = (paymentUrl) => { showCheckout.value = false; if (paymentUrl) window.location.href = paymentUrl; };
</script>

<style scoped>
/* ============ FLOATING BUTTON ============ */
.cart-float { position: fixed; bottom: 24px; right: 24px; z-index: 900; }
.cart-float__btn {
  display: flex; align-items: center; gap: 10px;
  background: var(--color-black); color: white;
  padding: 12px 22px; border-radius: var(--radius-full);
  box-shadow: 0 6px 24px rgba(0,0,0,0.22);
  font-family: var(--font-body); font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: all 200ms var(--ease-out);
}
.cart-float__btn:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(0,0,0,0.28); }
.cart-float__count {
  background: var(--color-helparr-primary); color: white;
  min-width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700;
}

/* ============ DRAWER OVERLAY ============ */
.cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); backdrop-filter: blur(2px); z-index: 1000; display: flex; justify-content: flex-end; }
.cart-drawer { width: 400px; max-width: 100%; height: 100%; background: white; display: flex; flex-direction: column; box-shadow: -8px 0 40px rgba(0,0,0,0.1); }

/* Head */
.cart-drawer__head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid rgba(0,0,0,0.05); }
.cart-drawer__head h3 { font-family: var(--font-heading); font-size: 1.15rem; }
.cart-drawer__head h3 span { font-family: var(--font-body); font-size: 0.8rem; color: var(--color-text-muted); font-weight: 400; }
.cart-drawer__close { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 150ms; }
.cart-drawer__close:hover { background: rgba(0,0,0,0.04); }

/* Items */
.cart-drawer__items { flex: 1; overflow-y: auto; padding: 12px 20px; }

/* Cart Item */
.ci { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.04); position: relative; }
.ci__img-wrap { width: 56px; height: 56px; border-radius: 10px; overflow: hidden; flex-shrink: 0; background: #f7f7f7; display: flex; align-items: center; justify-content: center; }
.ci__img { width: 80%; height: 80%; object-fit: contain; }
.ci__img-ph { width: 100%; height: 100%; background: #f0f0f0; }
.ci__info { flex: 1; min-width: 0; }
.ci__name { font-size: 0.82rem; font-weight: 500; line-height: 1.3; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ci__price { font-size: 0.85rem; font-weight: 700; margin-bottom: 6px; }
.ci__qty { display: flex; align-items: center; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; width: fit-content; }
.ci__qty button { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; cursor: pointer; transition: background 100ms; }
.ci__qty button:hover { background: rgba(0,0,0,0.04); }
.ci__qty span { width: 26px; text-align: center; font-size: 0.78rem; font-weight: 600; }
.ci__remove { position: absolute; top: 12px; right: 0; color: var(--color-text-muted); padding: 4px; cursor: pointer; transition: color 150ms; }
.ci__remove:hover { color: var(--color-accent-live); }

/* Footer / Summary */
.cart-drawer__foot { border-top: 1px solid rgba(0,0,0,0.05); padding: 16px 20px 20px; }
.cart-drawer__row { display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px; }
.cart-drawer__row--sm { color: var(--color-text-muted); font-size: 0.78rem; }
.cart-drawer__row--total { font-weight: 700; font-size: 1rem; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.05); margin-top: 6px; }
.cart-drawer__cta {
  width: 100%; margin-top: 14px; height: 46px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--color-black); color: white;
  border-radius: 12px; font-family: var(--font-body);
  font-size: 0.88rem; font-weight: 600;
  cursor: pointer; transition: all 200ms var(--ease-out);
}
.cart-drawer__cta:hover { background: #222; }

/* Transitions */
.drawer-enter-active { transition: all 300ms var(--ease-out); }
.drawer-leave-active { transition: all 220ms var(--ease-out); }
.drawer-enter-from .cart-drawer { transform: translateX(100%); }
.drawer-leave-to .cart-drawer { transform: translateX(100%); }
.drawer-enter-from { opacity: 0; }
.drawer-leave-to { opacity: 0; }
.modal-enter-active { transition: all 300ms var(--ease-out); }
.modal-leave-active { transition: all 200ms var(--ease-out); }
.modal-enter-from { opacity: 0; }
.modal-leave-to { opacity: 0; }

@media (max-width: 480px) {
  .cart-float { bottom: 16px; right: 16px; left: 16px; }
  .cart-float__btn { width: 100%; justify-content: center; }
}
</style>