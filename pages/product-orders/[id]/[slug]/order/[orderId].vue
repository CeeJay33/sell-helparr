<template>
  <div class="order-page">
    <!-- Top Navigation -->
    <nav class="order-nav">
      <div class="order-nav__inner">
        <div class="order-nav__left">
          <NuxtLink :to="`/product-orders/${storeId}/${storeSlug}?tab=dashboard`" class="order-nav__tab">Dashboard</NuxtLink>
          <NuxtLink :to="`/product-orders/${storeId}/${storeSlug}?tab=orders`" class="order-nav__tab order-nav__tab--active">
            Orders
            <span v-if="totalOrders" class="order-nav__badge">{{ totalOrders }}</span>
          </NuxtLink>
          <NuxtLink :to="`/product-orders/${storeId}/${storeSlug}?tab=customers`" class="order-nav__tab">Customers</NuxtLink>
        </div>
        <div class="order-nav__right" v-if="storeInfo">
          <img v-if="storeImageUrl" :src="storeImageUrl" class="order-nav__avatar" :alt="storeInfo.name">
          <div v-else class="order-nav__avatar order-nav__avatar--placeholder">{{ (storeInfo.name || 'S').substring(0,2).toUpperCase() }}</div>
          <div class="order-nav__user">
            <span class="order-nav__user-name">{{ storeInfo.owner?.name || storeInfo.name }}</span>
            <span class="order-nav__user-email">{{ storeInfo.owner?.email || '' }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="order-page__loading">
      <div class="order-page__spinner"></div>
      <p>Loading order...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="order-page__error">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <h2>Order not found</h2>
      <p>{{ error }}</p>
      <NuxtLink :to="`/product-orders/${storeId}/${storeSlug}`" class="order-page__back-btn">← Back to Dashboard</NuxtLink>
    </div>

    <!-- Order Content -->
    <main v-else-if="order" class="order-page__content">
      <div class="order-page__grid">
        
        <!-- Left Column - Main Content -->
        <div class="order-page__main">
          
          <!-- Order Header -->
          <div class="order-header">
            <div class="order-header__left">
              <NuxtLink :to="`/product-orders/${storeId}/${storeSlug}`" class="order-header__back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              </NuxtLink>
              <div>
                <h1 class="order-header__title">Order #{{ order.order_number }}</h1>
                <div class="order-header__meta">
                  <span :class="['order-header__status', 'order-header__status--' + order.payment_status]">{{ order.payment_status }}</span>
                  <span :class="['order-header__source', 'order-header__source--' + order.source]">{{ order.source === 'public' ? 'Web Store' : 'In-App' }}</span>
                </div>
              </div>
            </div>
            <span class="order-header__date">{{ formatDate(order.created_at) }}</span>
          </div>

          <!-- Search Bar -->
          <div class="order-search">
            <div class="order-search__wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input v-model="productSearch" type="text" placeholder="Search by Products..." class="order-search__input">
            </div>
            <NuxtLink :to="`/product-orders/${storeId}/${storeSlug}`" class="order-search__browse">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Browse Orders
            </NuxtLink>
          </div>

          <!-- Ordered Products Card -->
          <div class="order-card">
            <h3 class="order-card__title">Ordered Products</h3>
            
            <div v-if="filteredItems.length > 0" class="products-table">
              <!-- Table Header -->
              <div class="products-table__header">
                <span class="products-table__col products-table__col--product">Product</span>
                <span class="products-table__col products-table__col--qty">Quantity</span>
                <span class="products-table__col products-table__col--subtotal">Subtotal</span>
              </div>
              
              <!-- Product Rows -->
              <div v-for="(item, index) in filteredItems" :key="item.id || index" class="products-table__row">
                <div class="products-table__product">
                  <img v-if="getImageUrl(item.product_image)" :src="getImageUrl(item.product_image)" class="products-table__img" :alt="item.product_name">
                  <div v-else class="products-table__img products-table__img--placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                  </div>
                  <div class="products-table__product-info">
                    <span class="products-table__product-name">{{ item.product_name }}</span>
                    <span class="products-table__product-price">₦{{ Number(item.unit_price).toLocaleString() }}</span>
                  </div>
                </div>
                <div class="products-table__qty">
                  <div class="products-table__qty-control">
                    <span class="products-table__qty-btn">−</span>
                    <span class="products-table__qty-value">{{ item.quantity }}</span>
                    <span class="products-table__qty-btn">+</span>
                  </div>
                  <span class="products-table__qty-label">Quantity</span>
                </div>
                <div class="products-table__subtotal">
                  <span class="products-table__subtotal-value">₦{{ Number(item.total_price).toLocaleString() }}</span>
                  <span class="products-table__subtotal-label">Subtotal</span>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="products-table__empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              <p>{{ productSearch ? 'No products match your search' : 'No products in this order' }}</p>
            </div>

            <!-- Order Totals -->
            <div class="order-totals">
              <div class="order-totals__row">
                <span>Subtotal:</span>
                <span class="order-totals__value">₦{{ Number(itemsSubtotal).toLocaleString() }}</span>
              </div>
              <div v-if="order.delivery_fee" class="order-totals__row">
                <span>Delivery:</span>
                <span class="order-totals__value">₦{{ Number(order.delivery_fee).toLocaleString() }}</span>
              </div>
              <div v-if="order.platform_fee" class="order-totals__row">
                <span>Platform Fee:</span>
                <span class="order-totals__value">₦{{ Number(order.platform_fee).toLocaleString() }}</span>
              </div>
              <div class="order-totals__row order-totals__row--total">
                <span>Total:</span>
                <span class="order-totals__total">₦{{ Number(order.total).toLocaleString() }}</span>
              </div>
              <div v-if="order.merchant_amount" class="order-totals__row order-totals__row--merchant">
                <span>You Receive:</span>
                <span class="order-totals__merchant">₦{{ Number(order.merchant_amount).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="order-page__sidebar">
          
          <!-- Store Info Card -->
          <div class="order-card">
            <div class="sidebar-store">
              <img v-if="storeImageUrl" :src="storeImageUrl" class="sidebar-store__img" :alt="storeInfo?.name">
              <div v-else class="sidebar-store__img sidebar-store__img--placeholder">
                {{ (storeInfo?.name || 'S').substring(0,2).toUpperCase() }}
              </div>
              <h3 class="sidebar-store__name">{{ storeInfo?.name || 'Store' }}</h3>
              <p class="sidebar-store__email">{{ storeInfo?.owner?.email || '' }}</p>
            </div>
          </div>

          <!-- Buyer / Shipping Info -->
          <div class="order-card">
            <h3 class="order-card__title">{{ order.source === 'public' ? 'Buyer' : 'Customer' }} Information</h3>
            <div class="info-section">
              <div class="info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>{{ order.buyer?.name || 'N/A' }}</span>
              </div>
              <div v-if="order.buyer?.phone" class="info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <a :href="'tel:' + order.buyer.phone" class="info-row__link">{{ order.buyer.phone }}</a>
              </div>
              <div v-if="order.buyer?.email" class="info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a :href="'mailto:' + order.buyer.email" class="info-row__link">{{ order.buyer.email }}</a>
              </div>
              <div v-if="order.buyer?.address || order.delivery_address" class="info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ order.buyer?.address || order.delivery_address }}</span>
              </div>
            </div>
          </div>

          <!-- Store Address -->
          <div class="order-card">
            <h3 class="order-card__title">Store Address</h3>
            <div class="info-section">
              <div class="info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ storeInfo?.location || 'No address set' }}</span>
              </div>
              <div v-if="storeInfo?.owner?.phone" class="info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <span>{{ storeInfo.owner.phone }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Orders -->
          <div class="order-card">
            <h3 class="order-card__title">Recent Orders</h3>
            <div class="sidebar-stats">
              <div class="sidebar-stat">
                <span class="sidebar-stat__label">Total Earned</span>
                <span class="sidebar-stat__value">{{ formatCurrency(storeStats.total_sales) }}</span>
              </div>
              <div class="sidebar-stat">
                <span class="sidebar-stat__label">Average Check</span>
                <span class="sidebar-stat__value">{{ storeStats.total_orders > 0 ? formatCurrency(storeStats.total_sales / storeStats.total_orders) : '₦0' }}</span>
              </div>
            </div>
            <div class="sidebar-orders">
              <div v-for="ro in recentOrders" :key="ro.id" class="sidebar-order" @click="goToOrder(ro)">
                <div class="sidebar-order__left">
                  <span class="sidebar-order__id">#{{ ro.order_number }}</span>
                  <span class="sidebar-order__buyer">{{ ro.buyer_name }}</span>
                </div>
                <div class="sidebar-order__right">
                  <span class="sidebar-order__amount">₦{{ Number(ro.total).toLocaleString() }}</span>
                  <span :class="['sidebar-order__status', 'sidebar-order__status--' + ro.payment_status]">{{ ro.payment_status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });

const route = useRoute();
const config = useRuntimeConfig();
const storeId = route.params.id;
const storeSlug = route.params.slug;
const orderId = route.params.orderId;

const API_BASE = config.public.apiBase || 'https://product.helparr.com';

const loading = ref(true);
const error = ref(null);
const order = ref(null);
const storeInfo = ref(null);
const storeStats = ref({ total_sales: 0, total_orders: 0 });
const recentOrders = ref([]);
const totalOrders = ref(0);
const productSearch = ref('');

const storeImageUrl = computed(() => getImageUrl(storeInfo.value?.image));

const filteredItems = computed(() => {
  if (!order.value?.items) return [];
  if (!productSearch.value.trim()) return order.value.items;
  const q = productSearch.value.toLowerCase();
  return order.value.items.filter(i => i.product_name?.toLowerCase().includes(q));
});

const itemsSubtotal = computed(() => {
  return (order.value?.items || []).reduce((sum, i) => sum + (parseFloat(i.total_price) || 0), 0);
});

function getImageUrl(image) {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `${API_BASE}${image}`;
}

function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `₦${(num / 1000).toFixed(1)}K`;
  return `₦${num.toLocaleString()}`;
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function goToOrder(ro) {
  navigateTo(`/product-orders/${storeId}/${storeSlug}/order/${ro.order_number || ro.id}`);
}

function setOrdersTab() {
  // Will be handled by query param in dashboard
}

function setCustomersTab() {
  // Will be handled by query param in dashboard
}

async function fetchOrder() {
  try {
    loading.value = true;
    error.value = null;

    // Fetch order detail
    const orderRes = await $fetch(`${API_BASE}/api/merchant-portal/orders/${storeId}/${orderId}`);
    if (orderRes.success) {
      order.value = orderRes.data.order;
    } else {
      error.value = orderRes.message || 'Order not found';
      loading.value = false;
      return;
    }

    // Fetch store dashboard for sidebar data
    const dashRes = await $fetch(`${API_BASE}/api/merchant-portal/store/${storeId}/${storeSlug}`);
    if (dashRes.success) {
      storeInfo.value = dashRes.data.store;
      storeStats.value = dashRes.data.stats;
      recentOrders.value = dashRes.data.recent_orders || [];
      totalOrders.value = dashRes.data.stats.total_orders;
    }
  } catch (e) {
    console.error('Fetch order error:', e);
    error.value = 'Failed to load order data';
  } finally {
    loading.value = false;
  }
}

useHead({ title: computed(() => order.value ? `Order #${order.value.order_number}` : 'Order Detail') });

onMounted(fetchOrder);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

:root {
  --color-primary: #1E3A5F;
  --color-primary-light: #2D5A87;
  --color-accent: #E07B39;
  --color-accent-light: #F5DED3;
  --color-green: #00ae65;
  --color-green-light: #D1FAE5;
  --color-text: #1A1A1A;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;
  --color-bg: #F8F9FB;
  --color-white: #FFFFFF;
  --color-border: #E5E7EB;
  --color-danger: #EF4444;
  --color-warning: #F59E0B;
  --font: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --radius: 16px;
  --radius-sm: 10px;
  --shadow: none;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--font); background: var(--color-bg); color: var(--color-text); -webkit-font-smoothing: antialiased; }

.order-page { min-height: 100vh; }

/* ═══ NAV ═══ */
.order-nav { background: var(--color-white); border-bottom: 1px solid var(--color-border); position: sticky; top: 0; z-index: 100; }
.order-nav__inner { display: flex; align-items: center; justify-content: space-between; max-width: 1360px; margin: 0 auto; padding: 0 24px; height: 64px; }
.order-nav__left { display: flex; align-items: center; gap: 2px; background: var(--color-bg); border-radius: 12px; padding: 4px; }
.order-nav__tab { padding: 9px 22px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--color-text-muted); text-decoration: none; transition: all 0.2s; font-family: var(--font); }
.order-nav__tab:hover { color: var(--color-text-secondary); }
.order-nav__tab--active { color: var(--color-primary); background: var(--color-white); font-weight: 600; border: 1px solid var(--color-border); }
.order-nav__badge { background: var(--color-green); color: white; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 8px; margin-left: 6px; }
.order-nav__right { display: flex; align-items: center; gap: 10px; }
.order-nav__avatar { width: 40px; height: 40px; border-radius: 12px; object-fit: cover; }
.order-nav__avatar--placeholder { background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
.order-nav__user { display: flex; flex-direction: column; }
.order-nav__user-name { font-size: 13px; font-weight: 600; }
.order-nav__user-email { font-size: 11px; color: var(--color-text-muted); }

/* ═══ LOADING / ERROR ═══ */
.order-page__loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; }
.order-page__spinner { width: 40px; height: 40px; border: 3px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.order-page__loading p { color: var(--color-text-muted); font-size: 14px; }
.order-page__error { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 12px; text-align: center; }
.order-page__error h2 { font-size: 20px; }
.order-page__error p { color: var(--color-text-muted); }
.order-page__back-btn { display: inline-block; margin-top: 12px; padding: 10px 24px; background: var(--color-primary); color: white; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; }

/* ═══ CONTENT GRID ═══ */
.order-page__content { max-width: 1360px; margin: 0 auto; padding: 24px; }
.order-page__grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; }

/* ═══ ORDER HEADER ═══ */
.order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.order-header__left { display: flex; align-items: center; gap: 12px; }
.order-header__back { width: 40px; height: 40px; border-radius: 12px; background: var(--color-white); display: flex; align-items: center; justify-content: center; text-decoration: none; color: var(--color-text);  transition: transform 0.15s; }
.order-header__back:hover { transform: scale(1.05); }
.order-header__title { font-size: 24px; font-weight: 800; color: var(--color-text); }
.order-header__meta { display: flex; gap: 8px; margin-top: 6px; }
.order-header__status { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.3px; }
.order-header__status--paid { background: var(--color-green-light); color: var(--color-green); }
.order-header__status--pending { background: #FEF3C7; color: #D97706; }
.order-header__status--cancelled { background: #FEE2E2; color: var(--color-danger); }
.order-header__source { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 8px; }
.order-header__source--app { background: rgba(30, 58, 95, 0.08); color: var(--color-primary); }
.order-header__source--public { background: var(--color-accent-light); color: var(--color-accent); }
.order-header__date { font-size: 13px; color: var(--color-text-muted); white-space: nowrap; }

/* ═══ SEARCH ═══ */
.order-search { display: flex; gap: 12px; margin-bottom: 20px; }
.order-search__wrapper { flex: 1; display: flex; align-items: center; gap: 10px; background: var(--color-white); border: 1.5px solid var(--color-border); border-radius: 12px; padding: 10px 16px; transition: border-color 0.2s; }
.order-search__wrapper:focus-within { border-color: var(--color-primary); }
.order-search__input { flex: 1; border: none; outline: none; font-family: var(--font); font-size: 14px; color: var(--color-text); background: none; }
.order-search__input::placeholder { color: var(--color-text-muted); }
.order-search__browse { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 12px; border: 1.5px solid var(--color-primary); color: var(--color-primary); font-size: 14px; font-weight: 600; text-decoration: none; white-space: nowrap; transition: all 0.15s; }
.order-search__browse:hover { background: var(--color-primary); color: white; }

/* ═══ ORDER CARD ═══ */
.order-card { background: var(--color-white); border-radius: var(--radius);  padding: 24px; margin-bottom: 16px; }
.order-card__title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }

/* ═══ PRODUCTS TABLE ═══ */
.products-table__header { display: grid; grid-template-columns: 1fr 120px 120px; gap: 16px; padding-bottom: 12px; border-bottom: 1.5px solid var(--color-border); }
.products-table__col { font-size: 12px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.products-table__col--qty, .products-table__col--subtotal { text-align: center; }
.products-table__row { display: grid; grid-template-columns: 1fr 120px 120px; gap: 16px; align-items: center; padding: 16px 0; border-bottom: 1px solid #F5F5F5; }
.products-table__row:last-child { border-bottom: none; }
.products-table__product { display: flex; align-items: center; gap: 14px; min-width: 0; }
.products-table__img { width: 56px; height: 56px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }
.products-table__img--placeholder { background: #F5F5F5; display: flex; align-items: center; justify-content: center; }
.products-table__product-info { min-width: 0; }
.products-table__product-name { font-size: 14px; font-weight: 600; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.products-table__product-price { font-size: 13px; color: var(--color-text-muted); margin-top: 2px; display: block; }
.products-table__qty { text-align: center; }
.products-table__qty-control { display: inline-flex; align-items: center; gap: 12px; background: var(--color-bg); border-radius: 8px; padding: 6px 12px; }
.products-table__qty-btn { font-size: 16px; color: var(--color-primary); font-weight: 700; cursor: default; user-select: none; }
.products-table__qty-value { font-size: 15px; font-weight: 700; min-width: 16px; text-align: center; }
.products-table__qty-label { font-size: 11px; color: var(--color-text-muted); display: block; margin-top: 4px; }
.products-table__subtotal { text-align: center; }
.products-table__subtotal-value { font-size: 15px; font-weight: 700; display: block; }
.products-table__subtotal-label { font-size: 11px; color: var(--color-text-muted); display: block; margin-top: 4px; }
.products-table__empty { text-align: center; padding: 40px; color: var(--color-text-muted); }
.products-table__empty p { margin-top: 8px; font-size: 13px; }

/* ═══ ORDER TOTALS ═══ */
.order-totals { border-top: 2px solid var(--color-border); margin-top: 20px; padding-top: 16px; }
.order-totals__row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: var(--color-text-secondary); }
.order-totals__value { font-weight: 500; color: var(--color-text); }
.order-totals__row--total { border-top: 1px solid var(--color-border); margin-top: 8px; padding-top: 12px; font-size: 18px; font-weight: 700; color: var(--color-text); }
.order-totals__total { font-size: 22px; font-weight: 800; }
.order-totals__row--merchant { background: var(--color-green-light); border-radius: 10px; padding: 10px 14px; margin-top: 8px; }
.order-totals__merchant { font-weight: 700; color: var(--color-green); font-size: 16px; }

/* ═══ SIDEBAR ═══ */
.sidebar-store { text-align: center; padding-bottom: 16px; border-bottom: 1px solid var(--color-border); margin-bottom: 16px; }
.sidebar-store__img { width: 80px; height: 80px; border-radius: 20px; object-fit: cover; margin: 0 auto 12px; display: block; }
.sidebar-store__img--placeholder { background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 24px; }
.sidebar-store__name { font-size: 17px; font-weight: 700; }
.sidebar-store__email { font-size: 13px; color: var(--color-text-muted); margin-top: 2px; }

.info-section { display: flex; flex-direction: column; gap: 10px; }
.info-row { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; line-height: 1.5; }
.info-row svg { flex-shrink: 0; margin-top: 2px; }
.info-row__link { color: var(--color-primary); text-decoration: none; }
.info-row__link:hover { text-decoration: underline; }

.sidebar-stats { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.sidebar-stat { display: flex; justify-content: space-between; align-items: center; }
.sidebar-stat__label { font-size: 13px; color: var(--color-text-secondary); }
.sidebar-stat__value { font-size: 14px; font-weight: 700; }

.sidebar-orders { display: flex; flex-direction: column; gap: 6px; }
.sidebar-order { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-radius: var(--radius-sm); cursor: pointer; transition: background 0.15s; }
.sidebar-order:hover { background: var(--color-bg); }
.sidebar-order__left, .sidebar-order__right { display: flex; flex-direction: column; }
.sidebar-order__id { font-size: 13px; font-weight: 600; }
.sidebar-order__buyer { font-size: 11px; color: var(--color-text-muted); }
.sidebar-order__amount { font-size: 13px; font-weight: 600; text-align: right; }
.sidebar-order__status { font-size: 10px; font-weight: 600; text-transform: uppercase; text-align: right; }
.sidebar-order__status--paid { color: var(--color-green); }
.sidebar-order__status--pending { color: var(--color-warning); }

/* ═══ RESPONSIVE ═══ */
@media (max-width: 1024px) {
  .order-page__grid { grid-template-columns: 1fr; }
  .order-page__sidebar { order: -1; }
  .order-nav__left { overflow-x: auto; white-space: nowrap; }
  .order-nav__right .order-nav__user { display: none; }
  .order-page__content { padding: 16px; }
}

@media (max-width: 640px) {
  .order-header { flex-direction: column; gap: 8px; }
  .order-header__date { font-size: 12px; }
  .order-search { flex-direction: column; }
  .order-search__browse { justify-content: center; }
  .products-table__header { grid-template-columns: 1fr 80px 90px; }
  .products-table__row { grid-template-columns: 1fr 80px 90px; }
  .products-table__img { width: 44px; height: 44px; }
  .products-table__qty-control { gap: 8px; padding: 4px 8px; }
  .order-card { padding: 16px; }
  .order-nav__inner { padding: 0 16px; }
  .order-nav__tab { padding: 7px 16px; font-size: 13px; }
}
</style>