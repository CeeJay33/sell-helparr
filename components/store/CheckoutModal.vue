<template>
  <div class="checkout-overlay" @click.self="$emit('close')">
    <div class="checkout-modal">
      <!-- Header -->
      <div class="checkout-modal__header">
        <h3>Checkout</h3>
        <button @click="$emit('close')" class="checkout-modal__close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Order Summary -->
      <div class="checkout-modal__summary">
        <div class="checkout-modal__summary-row" v-for="item in cartItems" :key="item.product_id">
          <span>{{ item.name }} × {{ item.quantity }}</span>
          <span>₦{{ formatPrice(item.price * item.quantity) }}</span>
        </div>
        <div class="checkout-modal__summary-divider"></div>
        <div class="checkout-modal__summary-row"><span>Subtotal</span><span>₦{{ formatPrice(cartSubtotal) }}</span></div>
        <div class="checkout-modal__summary-row checkout-modal__summary-row--fee"><span>Service fee (2.5%)</span><span>₦{{ formatPrice(platformFee) }}</span></div>
        <div class="checkout-modal__summary-divider"></div>
        <div class="checkout-modal__summary-row checkout-modal__summary-row--total"><span>Total</span><span>₦{{ formatPrice(cartTotal) }}</span></div>
      </div>

      <!-- Buyer Form -->
      <form @submit.prevent="handleSubmit" class="checkout-form">
        <h4 class="checkout-form__title">Delivery Information</h4>

        <div class="checkout-form__field">
          <label for="co-name">Full Name *</label>
          <input id="co-name" v-model="form.full_name" type="text" placeholder="Enter your full name" required autocomplete="name" />
        </div>

        <div class="checkout-form__field">
          <label for="co-email">Email Address *</label>
          <input id="co-email" v-model="form.email" type="email" placeholder="you@example.com" required autocomplete="email" />
        </div>

        <div class="checkout-form__field">
          <label for="co-phone">Phone Number *</label>
          <input id="co-phone" v-model="form.phone" type="tel" placeholder="+234 800 000 0000" required autocomplete="tel" />
        </div>

        <!-- Address with Google Places Autocomplete -->
        <div class="checkout-form__field">
          <label for="co-address">
            Delivery Address *
            <span v-if="form.latitude" class="checkout-form__coords-ok">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1DB954" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              Location found
            </span>
          </label>
          <div class="checkout-form__address-wrap">
            <svg class="checkout-form__address-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <input
              ref="addressInputRef"
              id="co-address"
              v-model="form.address"
              type="text"
              placeholder="Start typing your address..."
              required
              autocomplete="off"
              @input="onAddressType"
            />
          </div>
          <small v-if="!mapsError" class="checkout-form__hint">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Select from dropdown for accurate delivery
          </small>
          <small v-else class="checkout-form__hint checkout-form__hint--warn">{{ mapsError }}</small>
        </div>

        <!-- Error message -->
        <div v-if="errorMsg" class="checkout-form__error">{{ errorMsg }}</div>

        <!-- Submit -->
        <button type="submit" class="checkout-form__submit" :disabled="submitting">
          <span v-if="submitting" class="checkout-form__spinner"></span>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          {{ submitting ? 'Processing...' : `Pay ₦${formatPrice(cartTotal)}` }}
        </button>

        <p class="checkout-form__secure">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          Secured by Paystack
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ merchantId: String });
const emit = defineEmits(['close', 'success']);
const config = useRuntimeConfig();

const { cartItems, cartSubtotal, cartTotal, platformFee, clearCart } = useCart();

const addressInputRef = ref(null);
const submitting = ref(false);
const errorMsg = ref('');
const mapsError = ref('');
let autocomplete = null;
let mapsLoaded = false;

const form = reactive({
  full_name: '',
  email: '',
  phone: '',
  address: '',
  latitude: null,
  longitude: null,
});

// Reset coords when user types manually (they need to re-select from dropdown)
const onAddressType = () => {
  form.latitude = null;
  form.longitude = null;
};

// ---- Load Google Maps + init autocomplete ----
// Key fix: use nextTick + small delay to ensure the DOM input is rendered
// (this component is teleported to body and rendered conditionally)
onMounted(async () => {
  await nextTick();
  // Small delay to ensure Teleport has moved the DOM
  setTimeout(() => {
    loadGoogleMaps();
  }, 100);
});

const loadGoogleMaps = () => {
  const apiKey = config.public.googleMapsApiKey;

  if (!apiKey) {
    mapsError.value = 'Address autocomplete unavailable. Enter your full address manually.';
    console.warn('GOOGLE_MAPS_API_KEY not set in .env');
    return;
  }

  // Already loaded
  if (window.google?.maps?.places) {
    mapsLoaded = true;
    initAutocomplete();
    return;
  }

  // Check if script tag already exists (another instance may have started loading)
  if (document.querySelector('script[src*="maps.googleapis.com"]')) {
    // Wait for it to load
    const wait = setInterval(() => {
      if (window.google?.maps?.places) {
        clearInterval(wait);
        mapsLoaded = true;
        initAutocomplete();
      }
    }, 200);
    setTimeout(() => clearInterval(wait), 10000);
    return;
  }

  // Load fresh
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    mapsLoaded = true;
    initAutocomplete();
  };
  script.onerror = () => {
    mapsError.value = 'Could not load Google Maps. Enter your full address manually.';
  };
  document.head.appendChild(script);
};

const initAutocomplete = () => {
  const input = addressInputRef.value;
  if (!input || !window.google?.maps?.places) {
    console.warn('Cannot init autocomplete — input ref or google not ready');
    return;
  }

  try {
    autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: ['ng', 'gh', 'ke', 'za'] },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        form.address = place.formatted_address || place.name || '';
        form.latitude = place.geometry.location.lat();
        form.longitude = place.geometry.location.lng();
        console.log('📍 Place selected:', form.address, form.latitude, form.longitude);
      }
    });

    console.log('✅ Google Places autocomplete initialized');
  } catch (e) {
    console.error('Autocomplete init error:', e);
    mapsError.value = 'Autocomplete error. Enter your full address manually.';
  }
};

// ---- Fallback geocoding ----
const geocodeAddress = async (address) => {
  if (!window.google?.maps?.Geocoder) return false;

  try {
    const geocoder = new google.maps.Geocoder();
    const result = await new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) resolve(results[0]);
        else reject(new Error('Geocode failed: ' + status));
      });
    });

    form.latitude = result.geometry.location.lat();
    form.longitude = result.geometry.location.lng();
    console.log('📍 Geocoded:', form.latitude, form.longitude);
    return true;
  } catch (e) {
    console.warn('Geocode fallback failed:', e.message);
    return false;
  }
};

// ---- Submit ----
const handleSubmit = async () => {
  errorMsg.value = '';

  if (!form.full_name.trim()) { errorMsg.value = 'Please enter your name'; return; }
  if (!form.email.trim()) { errorMsg.value = 'Please enter your email'; return; }
  if (!form.phone.trim()) { errorMsg.value = 'Please enter your phone number'; return; }
  if (!form.address.trim()) { errorMsg.value = 'Please enter your delivery address'; return; }

  // If no coordinates yet, try geocoding as fallback
  if (!form.latitude || !form.longitude) {
    const geocoded = await geocodeAddress(form.address);
    if (!geocoded) {
      // Still allow checkout without coords — the address text is still stored
      console.warn('No coordinates — proceeding with address text only');
    }
  }

  submitting.value = true;

  try {
    const payload = {
      buyer: {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        latitude: form.latitude,
        longitude: form.longitude,
      },
      items: cartItems.value.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    const res = await $fetch(`${config.public.apiBase}/api/public/store/${props.merchantId}/checkout`, {
      method: 'POST',
      body: payload,
    });

    if (res.success && res.data.payment?.authorization_url) {
      clearCart();
      emit('success', res.data.payment.authorization_url);
    } else {
      errorMsg.value = res.message || 'Checkout failed. Please try again.';
    }
  } catch (e) {
    console.error('Checkout error:', e);
    errorMsg.value = e.data?.message || 'Something went wrong. Please try again.';
  } finally {
    submitting.value = false;
  }
};

const formatPrice = (price) => Number(price).toLocaleString('en-NG', { minimumFractionDigits: 0 });
</script>

<style scoped>
.checkout-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(2px); z-index: 1100; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; }
.checkout-modal { background: white; border-radius: 24px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }

/* Header */
.checkout-modal__header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid rgba(0,0,0,0.05); position: sticky; top: 0; background: white; z-index: 2; border-radius: 24px 24px 0 0; }
.checkout-modal__header h3 { font-family: var(--font-heading); font-size: 1.2rem; }
.checkout-modal__close { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; cursor: pointer; transition: background 150ms; }
.checkout-modal__close:hover { background: rgba(0,0,0,0.04); }

/* Summary */
.checkout-modal__summary { padding: 14px 22px; background: var(--color-off-white); }
.checkout-modal__summary-row { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 3px 0; color: var(--color-text-secondary); }
.checkout-modal__summary-row--fee { font-size: 0.78rem; color: var(--color-text-muted); }
.checkout-modal__summary-row--total { font-weight: 700; font-size: 0.95rem; color: var(--color-text); }
.checkout-modal__summary-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 6px 0; }

/* Form */
.checkout-form { padding: 22px; }
.checkout-form__title { font-size: 0.92rem; font-weight: 600; margin-bottom: 18px; }

.checkout-form__field { margin-bottom: 16px; }
.checkout-form__field label { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: var(--color-text); margin-bottom: 6px; }
.checkout-form__coords-ok { display: inline-flex; align-items: center; gap: 3px; font-size: 0.68rem; font-weight: 500; color: #1DB954; }

.checkout-form__field input {
  width: 100%; padding: 11px 14px;
  border: 1.5px solid rgba(0,0,0,0.1); border-radius: 10px;
  font-family: var(--font-body); font-size: 0.88rem;
  transition: border-color 200ms, box-shadow 200ms; background: white;
}
.checkout-form__field input:focus { outline: none; border-color: var(--color-helparr-primary, #1DB954); box-shadow: 0 0 0 3px rgba(29,185,84,0.08); }
.checkout-form__field input::placeholder { color: #bbb; }

/* Address field with icon */
.checkout-form__address-wrap { position: relative; }
.checkout-form__address-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; z-index: 1; }
.checkout-form__address-wrap input { padding-left: 36px; }

.checkout-form__hint { display: flex; align-items: center; gap: 4px; font-size: 0.68rem; color: var(--color-text-muted); margin-top: 4px; }
.checkout-form__hint--warn { color: #e67e22; }

.checkout-form__error { background: #FFF0F0; color: var(--color-accent-live); font-size: 0.82rem; font-weight: 500; padding: 10px 14px; border-radius: 10px; margin-bottom: 14px; }

.checkout-form__submit {
  width: 100%; height: 46px; margin-top: 6px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--color-black); color: white;
  border-radius: 12px; font-family: var(--font-body);
  font-size: 0.88rem; font-weight: 600; cursor: pointer;
  transition: all 200ms var(--ease-out);
}
.checkout-form__submit:hover:not(:disabled) { background: #222; }
.checkout-form__submit:disabled { opacity: 0.5; cursor: not-allowed; }
.checkout-form__spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.checkout-form__secure { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.75rem; color: var(--color-text-muted); margin-top: 14px; }

/* Google Places dropdown z-index fix */
:global(.pac-container) { z-index: 9999 !important; }
</style>