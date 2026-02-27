<template>
  <div class="verify-page">
    <div class="verify-page__card container">
      <!-- Loading -->
      <div v-if="loading" class="verify-page__status">
        <div class="verify-page__spinner"></div>
        <h2>Verifying Payment...</h2>
        <p>Please wait while we confirm your payment.</p>
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
        <NuxtLink :to="`/store/${merchantId}`" class="btn btn-primary btn-lg verify-page__btn">
          Continue Shopping
        </NuxtLink>
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

const verifyPayment = async () => {
  if (!reference.value) {
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    const res = await $fetch(`${config.public.apiBase}/api/public/payment/verify/${reference.value}`);
    if (res.success && res.data.paid) {
      paid.value = true;
      orderId.value = res.data.order_id;
    }
  } catch (e) {
    console.error('Verify error:', e);
  } finally {
    loading.value = false;
  }
};

const retryVerify = () => verifyPayment();

useHead({ title: 'Payment Verification — Helparr Sell' });

onMounted(verifyPayment);
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
</style>