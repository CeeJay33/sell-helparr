<template>
  <div class="merchant-portal">
    <!-- Top Navigation -->
    <nav class="portal-nav">
      <div class="portal-nav__inner">
        <div class="portal-nav__left">
          <div class="portal-nav__logo">
            <div class="portal-nav__logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span class="portal-nav__brand">{{ storeName }}</span>
          </div>
          <div class="portal-nav__tabs">
            <button 
              v-for="tab in tabs" :key="tab.id"
              :class="['portal-nav__tab', activeTab === tab.id && 'portal-nav__tab--active']"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
              <span v-if="tab.id === 'orders' && stats.total_orders" class="portal-nav__tab-badge">{{ stats.total_orders }}</span>
            </button>
          </div>
        </div>
        <div class="portal-nav__right">
          <div class="portal-nav__store-info" v-if="storeData">
            <img v-if="storeImage" :src="storeImage" class="portal-nav__avatar" :alt="storeName">
            <div v-else class="portal-nav__avatar portal-nav__avatar--placeholder">{{ storeName.substring(0,2).toUpperCase() }}</div>
            <div class="portal-nav__user-info">
              <span class="portal-nav__user-name">{{ storeData.owner?.name || storeName }}</span>
              <span class="portal-nav__user-email">{{ storeData.owner?.email || '' }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Mobile Tabs -->
      <div class="portal-nav__mobile-tabs">
        <button 
          v-for="tab in tabs" :key="'m-'+tab.id"
          :class="['portal-nav__mobile-tab', activeTab === tab.id && 'portal-nav__mobile-tab--active']"
          @click="activeTab = tab.id"
        >
          <svg v-if="tab.id === 'dashboard'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <svg v-if="tab.id === 'orders'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <svg v-if="tab.id === 'customers'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="portal-loading">
      <div class="portal-loading__spinner"></div>
      <p>Loading dashboard...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="portal-error">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      <h2>Something went wrong</h2>
      <p>{{ error }}</p>
      <button @click="fetchDashboard" class="portal-btn portal-btn--primary">Retry</button>
    </div>

    <!-- Content -->
    <main v-else class="portal-content">
      
      <!-- ═══════════════════════════════════════════════ -->
      <!-- DASHBOARD TAB -->
      <!-- ═══════════════════════════════════════════════ -->
      <section v-show="activeTab === 'dashboard'" class="dashboard">
        <div class="dashboard__grid">
          <!-- Left Column -->
          <div class="dashboard__main">
            
            <!-- Today's Increase Card -->
            <div class="dash-card dash-card--highlight">
              <div class="dash-card__header">
                <div class="dash-card__header-left">
                  <div class="dash-card__icon dash-card__icon--primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  </div>
                  <span class="dash-card__title">Today's Increase</span>
                </div>
                <div class="dash-card__badge dash-card__badge--green">{{ formatCurrency(stats.today_sales) }}</div>
              </div>
              <div class="dash-card__body dash-card__body--chart">
                <!-- Semi-donut chart -->
                <div class="donut-chart">
                  <svg :width="chartSize" :height="chartSize/2 + 30" :viewBox="`0 0 ${chartSize} ${chartSize/2 + 30}`">
                    <path :d="donutBgPath" stroke="#E5E7EB" :stroke-width="donutStroke" fill="none" stroke-linecap="round"/>
                    <path v-for="(seg, i) in donutSegments" :key="i" :d="seg.path" :stroke="seg.color" :stroke-width="donutStroke" fill="none" stroke-linecap="round"/>
                  </svg>
                  <div class="donut-chart__center">
                    <span class="donut-chart__value">{{ stats.total_orders.toLocaleString() }}</span>
                    <span class="donut-chart__label">Total Sales</span>
                  </div>
                </div>
                <!-- Top Products -->
                <div class="top-products">
                  <div v-for="(p, i) in topProducts.slice(0, 3)" :key="p.id" class="top-product">
                    <div class="top-product__rank" :style="{ borderLeftColor: productColors[i] }">
                      <img v-if="getImageUrl(p.image)" :src="getImageUrl(p.image)" class="top-product__img" :alt="p.name">
                      <div v-else class="top-product__img-placeholder" :style="{ backgroundColor: productColors[i] + '20' }">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="productColors[i]" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                      </div>
                      <div class="top-product__info">
                        <span class="top-product__name">{{ p.name }}</span>
                        <span class="top-product__sold">{{ p.total_sold }} sold</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="topProducts.length === 0" class="top-products__empty">No products yet</div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
              <div class="quick-action">
                <div class="quick-action__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <span class="quick-action__title">Billing &amp;</span>
                <span class="quick-action__subtitle">Transactions</span>
              </div>
              <div class="quick-action">
                <div class="quick-action__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div>
                <span class="quick-action__title">Store</span>
                <span class="quick-action__subtitle">Visits: {{ visits.total }}</span>
              </div>
              <div class="quick-action">
                <div class="quick-action__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg></div>
                <span class="quick-action__title">Target</span>
                <span class="quick-action__subtitle">Sales</span>
              </div>
            </div>

            <!-- Weekly Sales Chart -->
            <div class="dash-card">
              <div class="dash-card__header">
                <div class="dash-card__header-left">
                  <div class="dash-card__icon dash-card__icon--outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                  </div>
                  <div>
                    <span class="dash-card__title">Sales Analytics</span>
                    <span class="dash-card__subtitle">Revenue this week</span>
                  </div>
                </div>
              </div>
              <div class="bar-chart">
                <div v-for="(day, i) in weeklyChartData" :key="i" class="bar-chart__col">
                  <div class="bar-chart__bar-wrapper">
                    <div class="bar-chart__bar" :style="{ height: day.height + '%', backgroundColor: day.isToday ? '#E07B39' : '#1E3A5F' }"></div>
                  </div>
                  <span class="bar-chart__label">{{ day.label }}</span>
                </div>
              </div>
              <div class="dash-stats-row">
                <div class="dash-stat">
                  <span class="dash-stat__value">{{ formatCurrency(stats.total_sales) }}</span>
                  <span class="dash-stat__label">Total Revenue</span>
                </div>
                <div class="dash-stat__divider"></div>
                <div class="dash-stat">
                  <span class="dash-stat__value">{{ stats.total_orders }}</span>
                  <span class="dash-stat__label">Total Orders</span>
                </div>
                <div class="dash-stat__divider"></div>
                <div class="dash-stat">
                  <span class="dash-stat__value">{{ stats.total_orders > 0 ? formatCurrency(stats.total_sales / stats.total_orders) : '₦0' }}</span>
                  <span class="dash-stat__label">Avg. Order</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="dashboard__sidebar">
            <!-- Store Info Card -->
            <div class="dash-card">
              <div class="store-profile">
                <img v-if="storeImage" :src="storeImage" class="store-profile__image" :alt="storeName">
                <div v-else class="store-profile__image store-profile__image--placeholder">{{ storeName.substring(0,2).toUpperCase() }}</div>
                <h3 class="store-profile__name">{{ storeName }}</h3>
                <p class="store-profile__email">{{ storeData?.owner?.email || 'No email' }}</p>
              </div>
              <div class="store-info-section">
                <h4>Store Address</h4>
                <p>{{ storeData?.location || 'No address set' }}</p>
              </div>
              <div class="store-info-section">
                <h4>Phone</h4>
                <p>{{ storeData?.owner?.phone || 'No phone' }}</p>
              </div>
              <div class="store-info-section">
                <h4>Wallet Balance</h4>
                <p class="store-info-section__highlight">{{ formatCurrency(stats.wallet_balance) }}</p>
              </div>
            </div>

            <!-- Recent Orders -->
            <div class="dash-card">
              <h3 class="dash-card__section-title">Recent Orders</h3>
              <div class="store-info-section">
                <p>Total Money Spent: <strong>{{ formatCurrency(stats.total_sales) }}</strong></p>
                <p>Average Check: <strong>{{ stats.total_orders > 0 ? formatCurrency(stats.total_sales / stats.total_orders) : '₦0' }}</strong></p>
              </div>
              <div class="recent-orders-list">
                <div v-for="order in recentOrders.slice(0, 5)" :key="order.id" class="recent-order-item" @click="viewOrder(order)">
                  <div class="recent-order-item__left">
                    <span class="recent-order-item__id">#{{ order.order_number }}</span>
                    <span class="recent-order-item__buyer">{{ order.buyer_name }}</span>
                  </div>
                  <div class="recent-order-item__right">
                    <span class="recent-order-item__amount">{{ formatCurrency(order.total) }}</span>
                    <span :class="['recent-order-item__status', 'recent-order-item__status--' + order.payment_status]">{{ order.payment_status }}</span>
                  </div>
                </div>
                <div v-if="recentOrders.length === 0" class="recent-orders-list__empty">No orders yet</div>
              </div>
            </div>

            <!-- Visits Card -->
            <div class="dash-card">
              <div class="visits-header">
                <div class="visits-header__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                <div>
                  <span class="visits-header__title">Store Visits</span>
                  <span class="visits-header__subtitle">People viewing your store</span>
                </div>
                <div class="visits-header__total">
                  <span class="visits-header__total-value">{{ visits.total }}</span>
                  <span class="visits-header__total-label">Total</span>
                </div>
              </div>
              <div class="visits-stats">
                <div class="visit-stat">
                  <span class="visit-stat__value">{{ visits.today }}</span>
                  <span class="visit-stat__label">Today</span>
                </div>
                <div class="visit-stat__divider"></div>
                <div class="visit-stat">
                  <span class="visit-stat__value">{{ visits.this_week }}</span>
                  <span class="visit-stat__label">This Week</span>
                </div>
                <div class="visit-stat__divider"></div>
                <div class="visit-stat">
                  <span class="visit-stat__value">{{ visits.unique_visitors }}</span>
                  <span class="visit-stat__label">Unique</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- ORDERS TAB -->
      <!-- ═══════════════════════════════════════════════ -->
      <section v-show="activeTab === 'orders'" class="orders-tab">
        <div class="orders-tab__grid">
          <div class="orders-tab__main">
            <div class="orders-tab__header">
              <h2>Orders</h2>
              <span class="orders-tab__date" v-if="selectedOrder">{{ formatDate(selectedOrder.created_at) }}</span>
            </div>

            <!-- Search -->
            <div class="orders-search">
              <div class="orders-search__input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input v-model="orderSearch" @input="debouncedSearchOrders" type="text" placeholder="Search by Order ID..." class="orders-search__input">
                <button v-if="orderSearch" @click="orderSearch = ''; fetchOrders()" class="orders-search__clear">&times;</button>
              </div>
            </div>

            <!-- Ordered Products (selected order or all recent) -->
            <div class="dash-card">
              <h3 class="dash-card__section-title">{{ selectedOrder ? 'Order #' + selectedOrder.order_number : 'Ordered Products' }}</h3>
              
              <div v-if="displayedItems.length > 0" class="ordered-products">
                <div class="ordered-products__header">
                  <span class="ordered-products__col ordered-products__col--product">Product</span>
                  <span class="ordered-products__col ordered-products__col--qty">Quantity</span>
                  <span class="ordered-products__col ordered-products__col--subtotal">Subtotal</span>
                  <span class="ordered-products__col ordered-products__col--action"></span>
                </div>
                <div v-for="item in displayedItems" :key="item.id" class="ordered-product">
                  <div class="ordered-product__info">
                    <img v-if="getImageUrl(item.product_image)" :src="getImageUrl(item.product_image)" class="ordered-product__img" :alt="item.product_name">
                    <div v-else class="ordered-product__img ordered-product__img--placeholder">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                    </div>
                    <div>
                      <span class="ordered-product__name">{{ item.product_name }}</span>
                      <span class="ordered-product__price">₦{{ formatPriceAbbr(item.unit_price) }}</span>
                    </div>
                  </div>
                  <span class="ordered-product__qty">{{ item.quantity }}</span>
                  <span class="ordered-product__subtotal">₦{{ formatPriceAbbr(item.total_price) }}</span>
                  <span class="ordered-product__source">{{ item._source || '' }}</span>
                </div>
              </div>
              <div v-else class="ordered-products__empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                <p>No ordered products to display</p>
              </div>

              <!-- Order Summary -->
              <div v-if="selectedOrder" class="order-summary">
                <div class="order-summary__row">
                  <span>Subtotal:</span>
                  <span>₦{{ formatPriceAbbr(selectedOrder.total - (selectedOrder.delivery_fee || 0)) }}</span>
                </div>
                <div v-if="selectedOrder.delivery_fee" class="order-summary__row">
                  <span>Delivery:</span>
                  <span>₦{{ formatPriceAbbr(selectedOrder.delivery_fee) }}</span>
                </div>
                <div class="order-summary__row order-summary__row--total">
                  <span>Total:</span>
                  <span>₦{{ formatPriceAbbr(selectedOrder.total) }}</span>
                </div>
              </div>
            </div>

            <!-- All Orders List -->
            <div class="dash-card">
              <h3 class="dash-card__section-title">All Orders</h3>
              <div class="orders-list">
                <div v-for="order in orders" :key="order.id + '-' + order.source" 
                     :class="['order-row', selectedOrder?.id === order.id && selectedOrder?.source === order.source && 'order-row--active']"
                     @click="selectOrder(order)">
                  <div class="order-row__left">
                    <span class="order-row__number">#{{ order.order_number }}</span>
                    <span class="order-row__buyer">{{ order.buyer?.name || 'Customer' }}</span>
                  </div>
                  <div class="order-row__center">
                    <span :class="['order-row__badge', 'order-row__badge--' + (order.source || 'app')]">{{ order.source === 'public' ? 'Web' : 'App' }}</span>
                    <span :class="['order-row__status', 'order-row__status--' + order.payment_status]">{{ order.payment_status }}</span>
                  </div>
                  <div class="order-row__right">
                    <span class="order-row__amount">₦{{ formatPriceAbbr(order.total) }}</span>
                    <span class="order-row__date">{{ formatDateShort(order.created_at) }}</span>
                  </div>
                  <button class="order-row__view-btn" @click.stop="goToOrderDetail(order)">View</button>
                </div>
                <div v-if="orders.length === 0" class="orders-list__empty">
                  <p>{{ orderSearch ? 'No orders found for "' + orderSearch + '"' : 'No orders yet' }}</p>
                </div>
              </div>
              <!-- Pagination -->
              <div v-if="ordersPagination.pages > 1" class="pagination">
                <button :disabled="ordersPagination.page <= 1" @click="fetchOrders(ordersPagination.page - 1)" class="pagination__btn">&laquo; Prev</button>
                <span class="pagination__info">Page {{ ordersPagination.page }} of {{ ordersPagination.pages }}</span>
                <button :disabled="ordersPagination.page >= ordersPagination.pages" @click="fetchOrders(ordersPagination.page + 1)" class="pagination__btn">Next &raquo;</button>
              </div>
            </div>
          </div>

          <!-- Orders Sidebar -->
          <div class="orders-tab__sidebar">
            <div class="dash-card">
              <div class="store-profile store-profile--compact">
                <img v-if="storeImage" :src="storeImage" class="store-profile__image store-profile__image--sm" :alt="storeName">
                <div v-else class="store-profile__image store-profile__image--sm store-profile__image--placeholder">{{ storeName.substring(0,2).toUpperCase() }}</div>
                <h3 class="store-profile__name">{{ storeName }}</h3>
                <p class="store-profile__email">{{ storeData?.owner?.email || '' }}</p>
              </div>
              <div class="store-info-section">
                <h4>Store Address</h4>
                <p>{{ storeData?.location || 'No address' }}</p>
              </div>
              <div v-if="selectedOrder?.buyer" class="store-info-section">
                <h4>Buyer Information</h4>
                <p>{{ selectedOrder.buyer.name }}</p>
                <p v-if="selectedOrder.buyer.phone">{{ selectedOrder.buyer.phone }}</p>
                <p v-if="selectedOrder.buyer.email">{{ selectedOrder.buyer.email }}</p>
                <p v-if="selectedOrder.buyer.address">{{ selectedOrder.buyer.address }}</p>
              </div>
            </div>

            <div class="dash-card">
              <h3 class="dash-card__section-title">Recent Orders</h3>
              <div class="store-info-section">
                <p>Total Earned: <strong>{{ formatCurrency(stats.total_sales) }}</strong></p>
                <p>Average Check: <strong>{{ stats.total_orders > 0 ? formatCurrency(stats.total_sales / stats.total_orders) : '₦0' }}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- CUSTOMERS TAB -->
      <!-- ═══════════════════════════════════════════════ -->
      <section v-show="activeTab === 'customers'" class="customers-tab">
        <div class="customers-tab__header">
          <h2>Customers</h2>
          <div class="customers-tab__stats">
            <div class="customers-tab__stat">
              <span class="customers-tab__stat-value">{{ customerSummary.total_customers }}</span>
              <span class="customers-tab__stat-label">Total</span>
            </div>
            <div class="customers-tab__stat">
              <span class="customers-tab__stat-value">{{ formatCurrency(customerSummary.total_revenue) }}</span>
              <span class="customers-tab__stat-label">Revenue</span>
            </div>
            <div class="customers-tab__stat">
              <span class="customers-tab__stat-value">{{ formatCurrency(customerSummary.avg_order_value) }}</span>
              <span class="customers-tab__stat-label">Avg Order</span>
            </div>
          </div>
        </div>

        <!-- Search -->
        <div class="orders-search" style="margin-bottom: 20px;">
          <div class="orders-search__input-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="customerSearch" @input="debouncedSearchCustomers" type="text" placeholder="Search customers..." class="orders-search__input">
          </div>
        </div>

        <div class="customers-grid">
          <div v-for="customer in customers" :key="customer.id" class="customer-card">
            <div class="customer-card__header">
              <img v-if="getImageUrl(customer.avatar)" :src="getImageUrl(customer.avatar)" class="customer-card__avatar" :alt="customer.name">
              <div v-else class="customer-card__avatar customer-card__avatar--placeholder">{{ (customer.name || 'C').substring(0,2).toUpperCase() }}</div>
              <div class="customer-card__info">
                <span class="customer-card__name">{{ customer.name }}</span>
                <span class="customer-card__email">{{ customer.email || customer.phone || 'No contact' }}</span>
              </div>
              <span :class="['customer-card__source', 'customer-card__source--' + customer.source]">{{ customer.source === 'public' ? 'Web' : 'App' }}</span>
            </div>
            <div class="customer-card__stats">
              <div class="customer-card__stat">
                <span class="customer-card__stat-value">{{ customer.order_count }}</span>
                <span class="customer-card__stat-label">Orders</span>
              </div>
              <div class="customer-card__stat">
                <span class="customer-card__stat-value">{{ formatCurrency(customer.total_spent) }}</span>
                <span class="customer-card__stat-label">Spent</span>
              </div>
              <div class="customer-card__stat">
                <span class="customer-card__stat-value">{{ formatDateShort(customer.last_order_date) }}</span>
                <span class="customer-card__stat-label">Last Order</span>
              </div>
            </div>
          </div>
          <div v-if="customers.length === 0" class="customers-grid__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <p>No customers yet</p>
          </div>
        </div>

        <div v-if="customersPagination.pages > 1" class="pagination">
          <button :disabled="customersPagination.page <= 1" @click="fetchCustomers(customersPagination.page - 1)" class="pagination__btn">&laquo; Prev</button>
          <span class="pagination__info">Page {{ customersPagination.page }} of {{ customersPagination.pages }}</span>
          <button :disabled="customersPagination.page >= customersPagination.pages" @click="fetchCustomers(customersPagination.page + 1)" class="pagination__btn">Next &raquo;</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });

const route = useRoute();
const config = useRuntimeConfig();
const storeId = route.params.id;
const storeSlug = route.params.slug;

const API_BASE = config.public.apiBase || 'https://product.helparr.com';
const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Orders' },
  { id: 'customers', label: 'Customers' },
];
const productColors = ['#E07B39', '#1E3A5F', '#10B981', '#8B5CF6', '#EC4899'];

const loading = ref(true);
const error = ref(null);
const activeTab = ref('dashboard');
const storeData = ref(null);
const stats = ref({ total_sales: 0, today_sales: 0, total_orders: 0, total_products: 0, total_customers: 0, wallet_balance: 0 });
const visits = ref({ today: 0, this_week: 0, this_month: 0, total: 0, unique_visitors: 0 });
const topProducts = ref([]);
const weeklySales = ref([]);
const recentOrders = ref([]);

// Orders tab
const orders = ref([]);
const selectedOrder = ref(null);
const orderSearch = ref('');
const ordersPagination = ref({ page: 1, limit: 20, total: 0, pages: 0 });

// Customers tab
const customers = ref([]);
const customerSearch = ref('');
const customerSummary = ref({ total_customers: 0, total_revenue: 0, avg_order_value: 0 });
const customersPagination = ref({ page: 1, limit: 20, total: 0, pages: 0 });

const storeName = computed(() => storeData.value?.name || storeSlug || 'Store');
const storeImage = computed(() => getImageUrl(`https://helparr.com/media/${storeData.value?.image}`));

// Donut chart
const chartSize = 180;
const donutStroke = 20;
const donutRadius = (chartSize - donutStroke) / 2;
const donutCx = chartSize / 2;
const donutCy = chartSize / 2 + 10;

const donutBgPath = computed(() => {
  const startX = donutCx - donutRadius;
  const endX = donutCx + donutRadius;
  return `M ${startX} ${donutCy} A ${donutRadius} ${donutRadius} 0 0 1 ${endX} ${donutCy}`;
});

const donutSegments = computed(() => {
  const prods = topProducts.value.slice(0, 3);
  const total = prods.reduce((sum, p) => sum + (p.total_sold || 1), 0) || 1;
  let currentAngle = Math.PI;
  return prods.map((p, i) => {
    const segAngle = ((p.total_sold || 1) / total) * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + segAngle;
    const startX = donutCx + donutRadius * Math.cos(startAngle);
    const startY = donutCy + donutRadius * Math.sin(startAngle);
    const endX = donutCx + donutRadius * Math.cos(endAngle);
    const endY = donutCy + donutRadius * Math.sin(endAngle);
    const largeArc = segAngle > Math.PI ? 1 : 0;
    currentAngle = endAngle;
    return { path: `M ${startX} ${startY} A ${donutRadius} ${donutRadius} 0 ${largeArc} 1 ${endX} ${endY}`, color: productColors[i] };
  });
});

const weeklyChartData = computed(() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = (new Date().getDay() + 6) % 7;
  const data = weeklySales.value;
  const maxVal = Math.max(...data.map(d => d.total), 1);
  
  if (data.length === 0) {
    return days.map((d, i) => ({ label: d, height: 5, isToday: i === todayIndex }));
  }
  
  // Map sales data to days
  const dayMap = {};
  data.forEach(d => {
    const date = new Date(d.date);
    const dayIdx = (date.getDay() + 6) % 7;
    dayMap[dayIdx] = d.total;
  });
  
  return days.map((d, i) => ({
    label: d,
    height: Math.max(((dayMap[i] || 0) / maxVal) * 100, 4),
    isToday: i === todayIndex,
  }));
});

const displayedItems = computed(() => {
  if (selectedOrder.value) {
    return selectedOrder.value.items || [];
  }
  // Show items from recent orders
  const allItems = [];
  for (const order of orders.value.slice(0, 5)) {
    for (const item of (order.items || [])) {
      allItems.push({ ...item, _source: order.source === 'public' ? 'Web' : 'App' });
    }
  }
  return allItems.slice(0, 10);
});

// Helpers
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

function formatPriceAbbr(price) {
  const num = parseFloat(price) || 0;
  return num.toLocaleString();
}

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// API calls
async function fetchDashboard() {
  try {
    loading.value = true;
    error.value = null;
    const res = await $fetch(`${API_BASE}/api/merchant-portal/store/${storeId}/${storeSlug}`);
    if (res.success) {
      storeData.value = res.data.store;
      stats.value = res.data.stats;
      visits.value = res.data.visits;
      topProducts.value = res.data.top_products || [];
      weeklySales.value = res.data.weekly_sales || [];
      recentOrders.value = res.data.recent_orders || [];
    } else {
      error.value = res.message || 'Failed to load';
    }
  } catch (e) {
    console.error('Dashboard fetch error:', e);
    error.value = 'Failed to connect to server';
  } finally {
    loading.value = false;
  }
}

async function fetchOrders(page = 1) {
  try {
    const params = new URLSearchParams({ page, limit: 20 });
    if (orderSearch.value) params.append('search', orderSearch.value);
    
    const res = await $fetch(`${API_BASE}/api/merchant-portal/orders/${storeId}?${params}`);
    if (res.success) {
      orders.value = res.data.orders;
      ordersPagination.value = res.data.pagination;
      if (!selectedOrder.value && orders.value.length > 0) {
        selectedOrder.value = orders.value[0];
      }
    }
  } catch (e) {
    console.error('Orders fetch error:', e);
  }
}

async function fetchCustomers(page = 1) {
  try {
    const params = new URLSearchParams({ page, limit: 20 });
    if (customerSearch.value) params.append('search', customerSearch.value);
    
    const res = await $fetch(`${API_BASE}/api/merchant-portal/customers/${storeId}?${params}`);
    if (res.success) {
      customers.value = res.data.customers;
      customerSummary.value = res.data.summary;
      customersPagination.value = res.data.pagination;
    }
  } catch (e) {
    console.error('Customers fetch error:', e);
  }
}

function selectOrder(order) {
  selectedOrder.value = order;
}

function viewOrder(order) {
  activeTab.value = 'orders';
  const found = orders.value.find(o => o.id === order.id);
  if (found) selectedOrder.value = found;
}

function goToOrderDetail(order) {
  navigateTo(`/product-orders/${storeId}/${storeSlug}/order/${order.order_number || order.id}`);
}

let searchTimeout = null;
function debouncedSearchOrders() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    selectedOrder.value = null;
    fetchOrders(1);
  }, 400);
}

let customerSearchTimeout = null;
function debouncedSearchCustomers() {
  clearTimeout(customerSearchTimeout);
  customerSearchTimeout = setTimeout(() => fetchCustomers(1), 400);
}

// Watch tab changes to load data
watch(activeTab, (tab) => {
  if (tab === 'orders' && orders.value.length === 0) fetchOrders();
  if (tab === 'customers' && customers.value.length === 0) fetchCustomers();
});

useHead({ title: computed(() => `${storeName.value} — Dashboard`) });

onMounted(async () => {
  // Check if navigated with a tab query param (e.g. from order detail page)
  const tabParam = route.query.tab;
  if (tabParam && ['dashboard', 'orders', 'customers'].includes(tabParam)) {
    activeTab.value = tabParam;
  }
  await fetchDashboard();
  fetchOrders();
});
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

.merchant-portal { min-height: 100vh; }

/* ═══ NAV ═══ */
.portal-nav { background: var(--color-white); border-bottom: 1px solid var(--color-border); position: sticky; top: 0; z-index: 100; }
.portal-nav__inner { display: flex; align-items: center; justify-content: space-between; max-width: 1360px; margin: 0 auto; padding: 0 24px; height: 64px; }
.portal-nav__left { display: flex; align-items: center; gap: 40px; }
.portal-nav__logo { display: flex; align-items: center; gap: 10px; }
.portal-nav__logo-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--color-primary); display: flex; align-items: center; justify-content: center; color: white; }
.portal-nav__brand { font-size: 16px; font-weight: 700; color: var(--color-text); }
.portal-nav__tabs { display: flex; gap: 2px; background: var(--color-bg); border-radius: 12px; padding: 4px; }
.portal-nav__tab { padding: 9px 22px; border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--color-text-muted); background: none; border: none; cursor: pointer; transition: all 0.2s; position: relative; font-family: var(--font); }
.portal-nav__tab:hover { color: var(--color-text-secondary); }
.portal-nav__tab--active { color: var(--color-primary); background: var(--color-white); font-weight: 600; border: 1px solid var(--color-border); }
.portal-nav__tab-badge { background: var(--color-green); color: white; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 8px; margin-left: 6px; }
.portal-nav__right { display: flex; align-items: center; gap: 16px; }
.portal-nav__store-info { display: flex; align-items: center; gap: 10px; }
.portal-nav__avatar { width: 40px; height: 40px; border-radius: 12px; object-fit: cover; }
.portal-nav__avatar--placeholder { background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
.portal-nav__user-info { display: flex; flex-direction: column; }
.portal-nav__user-name { font-size: 13px; font-weight: 600; color: var(--color-text); }
.portal-nav__user-email { font-size: 11px; color: var(--color-text-muted); }
.portal-nav__mobile-tabs { display: none; }

/* ═══ LOADING / ERROR ═══ */
.portal-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; }
.portal-loading__spinner { width: 40px; height: 40px; border: 3px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.portal-loading p, .portal-error p { color: var(--color-text-muted); font-size: 14px; }
.portal-error { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 12px; }
.portal-error h2 { font-size: 20px; color: var(--color-text); }

/* ═══ CONTENT ═══ */
.portal-content { max-width: 1360px; margin: 0 auto; padding: 24px; }

/* ═══ DASH CARD ═══ */
.dash-card { background: var(--color-white); border-radius: var(--radius);  padding: 20px; margin-bottom: 16px; }
.dash-card--highlight { border: 1px solid rgba(30, 58, 95, 0.08); }
.dash-card__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.dash-card__header-left { display: flex; align-items: center; gap: 10px; }
.dash-card__icon { width: 32px; height: 32px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dash-card__icon--primary { background: var(--color-primary); }
.dash-card__icon--outline { background: var(--color-bg); color: var(--color-primary); }
.dash-card__title { font-size: 15px; font-weight: 600; color: var(--color-text); }
.dash-card__subtitle { font-size: 12px; color: var(--color-text-muted); display: block; }
.dash-card__badge { padding: 5px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.dash-card__badge--green { background: var(--color-green-light); color: var(--color-green); }
.dash-card__section-title { font-size: 16px; font-weight: 700; margin-bottom: 14px; }
.dash-card__body--chart { display: flex; align-items: center; gap: 16px; }

/* ═══ DONUT ═══ */
.donut-chart { position: relative; flex-shrink: 0; }
.donut-chart__center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -20%); text-align: center; }
.donut-chart__value { font-size: 28px; font-weight: 800; color: var(--color-text); display: block; }
.donut-chart__label { font-size: 11px; color: var(--color-text-muted); }

/* ═══ TOP PRODUCTS ═══ */
.top-products { flex: 1; }
.top-product { margin-bottom: 12px; }
.top-product__rank { display: flex; align-items: center; gap: 10px; padding-left: 12px; border-left: 3px solid; }
.top-product__img { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; }
.top-product__img-placeholder { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.top-product__info { flex: 1; min-width: 0; }
.top-product__name { font-size: 13px; font-weight: 500; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-product__sold { font-size: 12px; color: var(--color-text-muted); }
.top-products__empty { font-size: 13px; color: var(--color-text-muted); text-align: center; padding: 20px 0; }

/* ═══ QUICK ACTIONS ═══ */
.quick-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
.quick-action { background: var(--color-white); border-radius: var(--radius);  padding: 20px 16px; text-align: center; cursor: pointer; transition: transform 0.15s; }
.quick-action:hover { transform: translateY(-2px); }
.quick-action__icon { width: 44px; height: 44px; border-radius: 12px; background: var(--color-bg); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--color-primary); }
.quick-action__title { font-size: 12px; font-weight: 500; display: block; }
.quick-action__subtitle { font-size: 11px; color: var(--color-text-muted); }

/* ═══ BAR CHART ═══ */
.bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 160px; padding: 10px 0 0; margin-bottom: 16px; }
.bar-chart__col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
.bar-chart__bar-wrapper { flex: 1; width: 100%; display: flex; align-items: flex-end; justify-content: center; }
.bar-chart__bar { width: 70%; max-width: 32px; border-radius: 4px 4px 0 0; transition: height 0.3s; min-height: 4px; }
.bar-chart__label { font-size: 11px; color: var(--color-text-muted); margin-top: 6px; }

/* ═══ STATS ROW ═══ */
.dash-stats-row { display: flex; border-top: 1px solid var(--color-border); padding-top: 16px; }
.dash-stat { flex: 1; text-align: center; }
.dash-stat__value { font-size: 17px; font-weight: 700; display: block; }
.dash-stat__label { font-size: 11px; color: var(--color-text-muted); margin-top: 2px; display: block; }
.dash-stat__divider { width: 1px; background: var(--color-border); margin: 0 8px; }

/* ═══ DASHBOARD GRID ═══ */
.dashboard__grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
.dashboard__main { min-width: 0; }
.dashboard__sidebar { min-width: 0; }

/* ═══ STORE PROFILE ═══ */
.store-profile { text-align: center; padding-bottom: 16px; border-bottom: 1px solid var(--color-border); margin-bottom: 16px; }
.store-profile--compact { padding-bottom: 12px; }
.store-profile__image { width: 72px; height: 72px; border-radius: 20px; object-fit: cover; margin: 0 auto 12px; display: block; }
.store-profile__image--sm { width: 56px; height: 56px; border-radius: 16px; }
.store-profile__image--placeholder { background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px; }
.store-profile__name { font-size: 16px; font-weight: 700; }
.store-profile__email { font-size: 13px; color: var(--color-text-muted); margin-top: 2px; }
.store-info-section { margin-bottom: 14px; }
.store-info-section h4 { font-size: 13px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; }
.store-info-section p { font-size: 13px; color: var(--color-text); line-height: 1.5; }
.store-info-section__highlight { font-size: 20px !important; font-weight: 700 !important; color: var(--color-green) !important; }

/* ═══ RECENT ORDERS LIST ═══ */
.recent-orders-list { display: flex; flex-direction: column; gap: 8px; }
.recent-order-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-radius: var(--radius-sm); cursor: pointer; transition: background 0.15s; }
.recent-order-item:hover { background: var(--color-bg); }
.recent-order-item__left, .recent-order-item__right { display: flex; flex-direction: column; }
.recent-order-item__id { font-size: 13px; font-weight: 600; }
.recent-order-item__buyer { font-size: 11px; color: var(--color-text-muted); }
.recent-order-item__amount { font-size: 13px; font-weight: 600; text-align: right; }
.recent-order-item__status { font-size: 10px; font-weight: 600; text-transform: uppercase; text-align: right; }
.recent-order-item__status--paid { color: var(--color-green); }
.recent-order-item__status--pending { color: var(--color-warning); }
.recent-order-item__status--cancelled { color: var(--color-danger); }
.recent-orders-list__empty { font-size: 13px; color: var(--color-text-muted); text-align: center; padding: 20px 0; }

/* ═══ VISITS ═══ */
.visits-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.visits-header__icon { width: 40px; height: 40px; border-radius: 20px; background: var(--color-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.visits-header__title { font-size: 15px; font-weight: 600; display: block; }
.visits-header__subtitle { font-size: 12px; color: var(--color-text-muted); }
.visits-header__total { margin-left: auto; text-align: right; }
.visits-header__total-value { font-size: 22px; font-weight: 800; color: var(--color-primary); display: block; }
.visits-header__total-label { font-size: 11px; color: var(--color-text-muted); }
.visits-stats { display: flex; background: var(--color-bg); border-radius: var(--radius-sm); padding: 16px; }
.visit-stat { flex: 1; text-align: center; }
.visit-stat__value { font-size: 20px; font-weight: 700; display: block; }
.visit-stat__label { font-size: 11px; color: var(--color-text-muted); margin-top: 2px; display: block; }
.visit-stat__divider { width: 1px; background: var(--color-border); margin: 0 8px; }

/* ═══ ORDERS TAB ═══ */
.orders-tab__grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }
.orders-tab__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.orders-tab__header h2 { font-size: 22px; font-weight: 700; }
.orders-tab__date { font-size: 13px; color: var(--color-text-muted); }

/* ═══ SEARCH ═══ */
.orders-search { margin-bottom: 16px; }
.orders-search__input-wrapper { display: flex; align-items: center; background: var(--color-white); border: 1px solid var(--color-border); border-radius: 12px; padding: 10px 16px; gap: 10px; }
.orders-search__input { flex: 1; border: none; outline: none; font-family: var(--font); font-size: 14px; color: var(--color-text); background: transparent; }
.orders-search__input::placeholder { color: var(--color-text-muted); }
.orders-search__clear { background: none; border: none; font-size: 20px; color: var(--color-text-muted); cursor: pointer; line-height: 1; }

/* ═══ ORDERED PRODUCTS ═══ */
.ordered-products__header { display: grid; grid-template-columns: 2fr 80px 100px 60px; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--color-border); margin-bottom: 8px; }
.ordered-products__col { font-size: 12px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.ordered-products__col--qty { text-align: center; }
.ordered-products__col--subtotal { text-align: right; }
.ordered-product { display: grid; grid-template-columns: 2fr 80px 100px 60px; gap: 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
.ordered-product__info { display: flex; align-items: center; gap: 12px; min-width: 0; }
.ordered-product__img { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.ordered-product__img--placeholder { background: #f5f5f5; display: flex; align-items: center; justify-content: center; }
.ordered-product__name { font-size: 14px; font-weight: 500; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ordered-product__price { font-size: 12px; color: var(--color-text-muted); }
.ordered-product__qty { text-align: center; font-size: 14px; font-weight: 600; }
.ordered-product__subtotal { text-align: right; font-size: 14px; font-weight: 600; }
.ordered-product__source { font-size: 10px; color: var(--color-text-muted); text-align: center; }
.ordered-products__empty { text-align: center; padding: 40px 20px; color: var(--color-text-muted); }
.ordered-products__empty p { margin-top: 8px; font-size: 13px; }

/* ═══ ORDER SUMMARY ═══ */
.order-summary { border-top: 2px solid var(--color-border); margin-top: 16px; padding-top: 16px; }
.order-summary__row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
.order-summary__row--total { font-size: 18px; font-weight: 700; padding-top: 10px; border-top: 1px solid var(--color-border); margin-top: 6px; }

/* ═══ ORDERS LIST ═══ */
.orders-list { display: flex; flex-direction: column; gap: 4px; }
.order-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
.order-row:hover { background: var(--color-bg); }
.order-row--active { background: rgba(30, 58, 95, 0.04); border-color: rgba(30, 58, 95, 0.12); }
.order-row__left { min-width: 0; }
.order-row__number { font-size: 14px; font-weight: 600; display: block; }
.order-row__buyer { font-size: 12px; color: var(--color-text-muted); }
.order-row__center { display: flex; gap: 8px; align-items: center; }
.order-row__badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 8px; text-transform: uppercase; }
.order-row__badge--app { background: rgba(30, 58, 95, 0.08); color: var(--color-primary); }
.order-row__badge--public { background: var(--color-accent-light); color: var(--color-accent); }
.order-row__status { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 8px; text-transform: uppercase; }
.order-row__status--paid { background: var(--color-green-light); color: var(--color-green); }
.order-row__status--pending { background: #FEF3C7; color: #D97706; }
.order-row__status--cancelled { background: #FEE2E2; color: var(--color-danger); }
.order-row__right { text-align: right; }
.order-row__amount { font-size: 14px; font-weight: 600; display: block; }
.order-row__date { font-size: 11px; color: var(--color-text-muted); }
.order-row__view-btn { padding: 5px 14px; border-radius: 8px; border: 1px solid var(--color-primary); background: none; color: var(--color-primary); font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--font); transition: all 0.15s; flex-shrink: 0; }
.order-row__view-btn:hover { background: var(--color-primary); color: white; }
.orders-list__empty { text-align: center; padding: 40px 20px; color: var(--color-text-muted); }

/* ═══ PAGINATION ═══ */
.pagination { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 20px; }
.pagination__btn { padding: 8px 16px; border-radius: 8px; border: 1px solid var(--color-border); background: var(--color-white); cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s; }
.pagination__btn:hover:not(:disabled) { background: var(--color-bg); }
.pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pagination__info { font-size: 13px; color: var(--color-text-muted); }

/* ═══ CUSTOMERS TAB ═══ */
.customers-tab__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 16px; }
.customers-tab__header h2 { font-size: 22px; font-weight: 700; }
.customers-tab__stats { display: flex; gap: 24px; }
.customers-tab__stat { text-align: center; }
.customers-tab__stat-value { font-size: 18px; font-weight: 700; color: var(--color-primary); display: block; }
.customers-tab__stat-label { font-size: 11px; color: var(--color-text-muted); }
.customers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.customer-card { background: var(--color-white); border-radius: var(--radius);  padding: 16px; transition: transform 0.15s; }
.customer-card:hover { transform: translateY(-2px); }
.customer-card__header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.customer-card__avatar { width: 44px; height: 44px; border-radius: 22px; object-fit: cover; flex-shrink: 0; }
.customer-card__avatar--placeholder { background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
.customer-card__info { flex: 1; min-width: 0; }
.customer-card__name { font-size: 14px; font-weight: 600; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.customer-card__email { font-size: 12px; color: var(--color-text-muted); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.customer-card__source { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 8px; text-transform: uppercase; flex-shrink: 0; }
.customer-card__source--app { background: rgba(30, 58, 95, 0.08); color: var(--color-primary); }
.customer-card__source--public { background: var(--color-accent-light); color: var(--color-accent); }
.customer-card__stats { display: flex; background: var(--color-bg); border-radius: var(--radius-sm); padding: 12px; }
.customer-card__stat { flex: 1; text-align: center; }
.customer-card__stat-value { font-size: 14px; font-weight: 700; display: block; }
.customer-card__stat-label { font-size: 10px; color: var(--color-text-muted); }
.customers-grid__empty { grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--color-text-muted); }
.customers-grid__empty p { margin-top: 8px; }

/* ═══ BUTTON ═══ */
.portal-btn { padding: 10px 24px; border-radius: 10px; border: none; cursor: pointer; font-family: var(--font); font-size: 14px; font-weight: 600; transition: all 0.15s; }
.portal-btn--primary { background: var(--color-primary); color: white; }
.portal-btn--primary:hover { background: var(--color-primary-light); }

/* ═══ RESPONSIVE ═══ */
@media (max-width: 1024px) {
  .dashboard__grid { grid-template-columns: 1fr; }
  .orders-tab__grid { grid-template-columns: 1fr; }
  .orders-tab__sidebar { order: -1; }
  .portal-nav__tabs { display: none; }
  .portal-nav__mobile-tabs { display: flex !important; }
  .portal-nav__user-info { display: none; }
  .portal-content { padding: 16px; }
}

@media (max-width: 640px) {
  .dash-card__body--chart { flex-direction: column; }
  .quick-actions { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .quick-action { padding: 14px 8px; }
  .ordered-products__header { grid-template-columns: 1fr 60px 80px; }
  .ordered-product { grid-template-columns: 1fr 60px 80px; }
  .ordered-product__source { display: none; }
  .ordered-products__col--action { display: none; }
  .customers-grid { grid-template-columns: 1fr; }
  .customers-tab__stats { gap: 16px; }
  .portal-nav__inner { padding: 0 16px; }
}

@media (max-width: 480px) {
  .portal-nav__brand { font-size: 14px; }
  .portal-nav__right { display: none; }
  .donut-chart svg { width: 140px; }
  .donut-chart__value { font-size: 22px; }
  .bar-chart { height: 120px; }
}
</style>