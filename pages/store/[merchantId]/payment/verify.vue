<template>
  <div class="verify-page">
    <div class="verify-page__card container">
      <!-- Loading / Polling -->
      <div v-if="loading" class="verify-page__status">
        <div class="verify-page__spinner"></div>
        <h2>Verifying Payment...</h2>
        <p>Please wait while we confirm your payment.</p>
        <p v-if="pollCount > 2" class="verify-page__subtitle">
          Still checking... this may take a few seconds.
        </p>
      </div>

      <!-- Success -->
      <div v-else-if="paid" class="verify-page__status verify-page__status--success">
        <div class="verify-page__icon verify-page__icon--success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2>Payment Successful!</h2>
        <p>Your order <strong>{{ orderId }}</strong> has been confirmed.</p>
        <p class="verify-page__subtitle">The seller has been notified and will process your order shortly.</p>
        <p class="verify-page__subtitle">We've sent the seller's contact details to your email.</p>
        
        <NuxtLink :to="`/store/${merchantId}`" class="btn btn-primary btn-lg verify-page__btn">
          Continue Shopping
        </NuxtLink>
        
        <!-- App Download Section -->
        <div class="verify-page__app-section">
          <p class="verify-page__app-text">Get our app for a better experience</p>
          <div class="verify-page__app-badges">
            <a href="https://play.google.com/store/apps/details?id=com.helparr.app" target="_blank" rel="noopener" class="verify-page__app-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 1.67L12.5 11l-9.32 9.33c-.23-.18-.37-.47-.37-.8V2.47c0-.33.14-.62.37-.8zm10.45 9.33l2.55-2.55L5.27.6C4.93.42 4.58.37 4.27.44l9.36 10.56zm0 2l-9.36 10.56c.31.07.66.02 1-.16l10.91-6.46L13.63 13zm6.87-3.78l-2.7-1.6-2.82 2.82 2.82 2.82 2.7-1.6c.83-.49.83-1.95 0-2.44z"/></svg>
              <div>
                <span class="verify-page__badge-label">GET IT ON</span>
                <span class="verify-page__badge-store">Google Play</span>
              </div>
            </a>
            <a href="https://apps.apple.com/app/helparr/id6740043432" target="_blank" rel="noopener" class="verify-page__app-badge">
              <svg width="18" height="22" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              <div>
                <span class="verify-page__badge-label">Download on the</span>
                <span class="verify-page__badge-store">App Store</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- Failed -->
      <div v-else class="verify-page__status verify-page__status--failed">
        <div class="verify-page__icon verify-page__icon--failed">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>
        <h2>Payment Not Confirmed</h2>
        <p>We couldn't verify your payment. If you completed the payment, it may take a moment to process.</p>
        <div class="verify-page__actions">
          <button @click="retryVerify" class="btn btn-primary btn-lg">Retry Verification</button>
          <NuxtLink :to="`/store/${merchantId}`" class="btn btn-outline btn-lg">Back to Store</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const merchantId = route.params.merchantId;

const reference = computed(() => route.query.reference || route.query.trxref);
const loading = ref(true);
const paid = ref(false);
const orderId = ref('');
const pollCount = ref(0);
const maxPolls = 20; // 20 attempts × 3 seconds = 60 seconds max wait
let pollTimer = null;

const verifyPayment = async () => {
  if (!reference.value) {
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    const res = await $fetch(`${config.public.apiBase}/api/public/payment/verify/${reference.value}`);
    
    if (res.success && res.data.paid) {
      // Payment confirmed
      stopPolling();
      paid.value = true;
      orderId.value = res.data.order_id;
      loading.value = false;
      return;
    }
    
    // Payment not yet confirmed — start polling if not already
    pollCount.value++;
    
    if (pollCount.value < maxPolls) {
      // Keep loading state, poll again in 3 seconds
      pollTimer = setTimeout(verifyPayment, 3000);
    } else {
      // Gave up after 60 seconds
      loading.value = false;
    }
  } catch (e) {
    console.error('Verify error:', e);
    // On error, retry a few times before giving up
    pollCount.value++;
    if (pollCount.value < maxPolls) {
      pollTimer = setTimeout(verifyPayment, 3000);
    } else {
      loading.value = false;
    }
  }
};

const stopPolling = () => {
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
};

const retryVerify = () => {
  pollCount.value = 0;
  paid.value = false;
  verifyPayment();
};

useHead({ title: 'Payment Verification — Helparr Sell' });

onMounted(verifyPayment);
onUnmounted(stopPolling);
</script>

<style scoped>
.verify-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.verify-page__card {
  max-width: 480px;
  text-align: center;
}

.verify-page__status { padding: 40px 0; }

.verify-page__spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0,0,0,0.08);
  border-top-color: var(--color-black);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto 24px;
}

.verify-page__status h2 {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  margin-bottom: 10px;
}

.verify-page__status p {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.verify-page__subtitle {
  margin-top: 6px;
  font-size: 0.85rem !important;
  color: var(--color-text-muted) !important;
}

.verify-page__icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.verify-page__icon--success { background: #1DB954; }
.verify-page__icon--failed { background: #E74C3C; }

.verify-page__btn { margin-top: 32px; }

.verify-page__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
}

/* App Download Section */
.verify-page__app-section {
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.verify-page__app-text {
  font-size: 0.82rem !important;
  color: var(--color-text-muted) !important;
  margin-bottom: 16px !important;
}

.verify-page__app-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.verify-page__app-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #111;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 180ms ease;
  min-width: 148px;
}

.verify-page__app-badge:hover {
  background: #222;
  transform: translateY(-1px);
}

.verify-page__app-badge svg {
  flex-shrink: 0;
}

.verify-page__app-badge div {
  display: flex;
  flex-direction: column;
}

.verify-page__badge-label {
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.8;
  line-height: 1;
}

.verify-page__badge-store {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
  margin-top: 1px;
}

@media (max-width: 400px) {
  .verify-page__app-badges {
    flex-direction: column;
  }
  .verify-page__app-badge {
    width: 100%;
    justify-content: center;
  }
}
</style>