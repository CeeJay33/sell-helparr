<template>
  <header class="navbar" :class="{ scrolled: isScrolled, 'menu-open': isMobileMenuOpen }">
    <div class="navbar__inner container">
      <!-- Logo -->
      <NuxtLink to="/" class="navbar__logo" @click="closeMobile">
        <div class="navbar__logo-icon">
          <!-- Helparr Sell Logo Icon - Replace with your SVG -->
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="8" r="3" fill="currentColor" />
            <circle cx="8" cy="14" r="3" fill="currentColor" />
            <circle cx="24" cy="14" r="3" fill="currentColor" />
            <circle cx="16" cy="20" r="3" fill="currentColor" />
            <circle cx="10" cy="26" r="3" fill="currentColor" />
            <circle cx="22" cy="26" r="3" fill="currentColor" />
            <circle cx="16" cy="14" r="2" fill="currentColor" />
            <circle cx="12" cy="20" r="2" fill="currentColor" />
            <circle cx="20" cy="20" r="2" fill="currentColor" />
          </svg>
        </div>
        <span class="navbar__logo-divider">/</span>
        <span class="navbar__logo-text">helparr.sell</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="navbar__nav">
        <div class="navbar__nav-item" @mouseenter="openDropdown('products')" @mouseleave="closeDropdown">
          <button class="navbar__nav-link navbar__nav-link--dropdown">
            Products
            <svg class="navbar__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
          <!-- Dropdown -->
          <Transition name="dropdown">
            <div v-if="activeDropdown === 'products'" class="navbar__dropdown">
              <NuxtLink to="/products/sell" class="navbar__dropdown-item">
                <div class="navbar__dropdown-icon navbar__dropdown-icon--sell">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 3h14l-1.5 9H4.5L3 3z" stroke="currentColor" stroke-width="1.5" />
                    <circle cx="7" cy="16" r="1.5" stroke="currentColor" stroke-width="1.5" />
                    <circle cx="14" cy="16" r="1.5" stroke="currentColor" stroke-width="1.5" />
                  </svg>
                </div>
                <div>
                  <span class="navbar__dropdown-title">Helparr Sell</span>
                  <span class="navbar__dropdown-desc">E-commerce platform for sellers</span>
                </div>
              </NuxtLink>
              <NuxtLink to="/products/pay" class="navbar__dropdown-item">
                <div class="navbar__dropdown-icon navbar__dropdown-icon--pay">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" stroke-width="1.5" />
                    <line x1="2" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="1.5" />
                  </svg>
                </div>
                <div>
                  <span class="navbar__dropdown-title">Helparr Pay</span>
                  <span class="navbar__dropdown-desc">Payments & financial tools</span>
                </div>
              </NuxtLink>
              <NuxtLink to="/products/ai" class="navbar__dropdown-item">
                <div class="navbar__dropdown-icon navbar__dropdown-icon--ai">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z" stroke="currentColor"
                      stroke-width="1.5" />
                  </svg>
                </div>
                <div>
                  <span class="navbar__dropdown-title">Helparr AI</span>
                  <span class="navbar__dropdown-desc">AI business coaching</span>
                </div>
              </NuxtLink>
              <NuxtLink to="/products/now" class="navbar__dropdown-item">
                <div class="navbar__dropdown-icon navbar__dropdown-icon--now">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2v6l4 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
                  </svg>
                </div>
                <div>
                  <span class="navbar__dropdown-title">HelparrNow</span>
                  <span class="navbar__dropdown-desc">Last-mile delivery</span>
                </div>
              </NuxtLink>
            </div>
          </Transition>
        </div>

        <NuxtLink to="/stories" class="navbar__nav-link">Customer Stories</NuxtLink>
        <NuxtLink to="/resources" class="navbar__nav-link">Resources</NuxtLink>
        <NuxtLink to="/pricing" class="navbar__nav-link">Pricing</NuxtLink>
      </nav>

      <!-- CTA Buttons -->
      <div class="navbar__actions">
        <NuxtLink to="/demo" class="navbar__demo-link">Book A Demo</NuxtLink>
        <NuxtLink to="/get-started" class="btn btn-primary btn-sm navbar__cta">Get Started</NuxtLink>
      </div>

      <!-- Mobile Toggle -->
      <button class="navbar__toggle" :class="{ active: isMobileMenuOpen }" @click="toggleMobile"
        :aria-expanded="isMobileMenuOpen" aria-label="Toggle menu">
        <span class="navbar__toggle-bar"></span>
        <span class="navbar__toggle-bar"></span>
        <span class="navbar__toggle-bar"></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" class="navbar__mobile">
        <nav class="navbar__mobile-nav">
          <button class="navbar__mobile-link" @click="toggleMobileDropdown('products')">
            Products
            <svg class="navbar__chevron" :class="{ rotated: mobileDropdown === 'products' }" width="14" height="14"
              viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
          <Transition name="slide-down">
            <div v-if="mobileDropdown === 'products'" class="navbar__mobile-dropdown">
              <NuxtLink to="/products/sell" class="navbar__mobile-sublink" @click="closeMobile">Helparr Sell</NuxtLink>
              <NuxtLink to="/products/pay" class="navbar__mobile-sublink" @click="closeMobile">Helparr Pay</NuxtLink>
              <NuxtLink to="/products/ai" class="navbar__mobile-sublink" @click="closeMobile">Helparr AI</NuxtLink>
              <NuxtLink to="/products/now" class="navbar__mobile-sublink" @click="closeMobile">HelparrNow</NuxtLink>
            </div>
          </Transition>

          <NuxtLink to="/stories" class="navbar__mobile-link" @click="closeMobile">Customer Stories</NuxtLink>
          <NuxtLink to="/resources" class="navbar__mobile-link" @click="closeMobile">Resources</NuxtLink>
          <NuxtLink to="/pricing" class="navbar__mobile-link" @click="closeMobile">Pricing</NuxtLink>
        </nav>

        <div class="navbar__mobile-actions">
          <NuxtLink to="/demo" class="btn btn-outline btn-lg navbar__mobile-btn" @click="closeMobile">Book A Demo
          </NuxtLink>
          <NuxtLink to="/get-started" class="btn btn-primary btn-lg navbar__mobile-btn" @click="closeMobile">Get Started
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const activeDropdown = ref(null)
const mobileDropdown = ref(null)
let dropdownTimeout = null

// Scroll handler
onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})

// Desktop dropdown
function openDropdown(name) {
  clearTimeout(dropdownTimeout)
  activeDropdown.value = name
}

function closeDropdown() {
  dropdownTimeout = setTimeout(() => {
    activeDropdown.value = null
  }, 150)
}

// Mobile menu
function toggleMobile() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    mobileDropdown.value = null
  }
}

function closeMobile() {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
  mobileDropdown.value = null
}

function toggleMobileDropdown(name) {
  mobileDropdown.value = mobileDropdown.value === name ? null : name
}
</script>

<style scoped>
/* --------- Navbar Container --------- */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--nav-height);
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all var(--duration-normal) var(--ease-out);
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  background-color: rgba(255, 255, 255, 0.97);
  border-bottom-color: rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* --------- Logo --------- */
.navbar__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 1rem;
  color: var(--color-text);
  text-decoration: none;
  flex-shrink: 0;
  z-index: 10;
}

.navbar__logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-black);
}

.navbar__logo-divider {
  color: var(--color-text-muted);
  font-weight: 300;
  font-size: 1.25rem;
  margin: 0 2px;
}

.navbar__logo-text {
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* --------- Desktop Nav --------- */
.navbar__nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.navbar__nav-item {
  position: relative;
}

.navbar__nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 450;
  color: var(--color-text);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.navbar__nav-link:hover {
  color: var(--color-text);
  background-color: rgba(0, 0, 0, 0.04);
}

.navbar__nav-link--dropdown {
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 450;
}

.navbar__chevron {
  transition: transform var(--duration-fast) var(--ease-out);
}

.navbar__nav-item:hover .navbar__chevron {
  transform: rotate(180deg);
}

/* --------- Dropdown --------- */
.navbar__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  background: var(--color-white);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: 8px;
  z-index: 100;
}

.navbar__dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--ease-out);
}

.navbar__dropdown-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.navbar__dropdown-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.navbar__dropdown-icon--sell {
  background-color: var(--color-accent-mint);
  color: #0d7a3e;
}

.navbar__dropdown-icon--pay {
  background-color: var(--color-accent-yellow-bg);
  color: #b8860b;
}

.navbar__dropdown-icon--ai {
  background-color: #E8E0F5;
  color: #6b21a8;
}

.navbar__dropdown-icon--now {
  background-color: #DBEAFE;
  color: #1d4ed8;
}

.navbar__dropdown-title {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}

.navbar__dropdown-desc {
  display: block;
  font-size: 0.775rem;
  color: var(--color-text-muted);
  line-height: 1.3;
  margin-top: 1px;
}

/* Dropdown transitions */
.dropdown-enter-active {
  transition: all 200ms var(--ease-out);
}

.dropdown-leave-active {
  transition: all 150ms var(--ease-out);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px);
}

/* --------- Actions --------- */
.navbar__actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.navbar__demo-link {
  font-size: 0.9rem;
  font-weight: 450;
  color: var(--color-text);
  transition: color var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.navbar__demo-link:hover {
  color: var(--color-text-secondary);
}

.navbar__cta {
  font-size: 0.85rem;
  padding: 10px 22px;
}

/* --------- Mobile Toggle --------- */
.navbar__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  z-index: 10;
  padding: 8px;
}

.navbar__toggle-bar {
  display: block;
  width: 20px;
  height: 2px;
  background-color: var(--color-text);
  border-radius: 1px;
  transition: all var(--duration-normal) var(--ease-out);
  transform-origin: center;
}

.navbar__toggle.active .navbar__toggle-bar:nth-child(1) {
  transform: rotate(45deg) translateY(5px) translateX(5px);
}

.navbar__toggle.active .navbar__toggle-bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.navbar__toggle.active .navbar__toggle-bar:nth-child(3) {
  transform: rotate(-45deg) translateY(-5px) translateX(5px);
}

/* --------- Mobile Menu --------- */
.navbar__mobile {
  position: fixed;
  top: var(--nav-height);
  left: 0;
  right: 0;

  background: var(--color-white);
  padding: var(--space-xl) var(--space-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}

.navbar__mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.navbar__mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 4px;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: color var(--duration-fast);
  text-decoration: none;
  width: 100%;
  text-align: left;
}

.navbar__mobile-link .navbar__chevron.rotated {
  transform: rotate(180deg);
}

.navbar__mobile-dropdown {
  display: flex;
  flex-direction: column;
  padding: 4px 0 12px 16px;
}

.navbar__mobile-sublink {
  padding: 12px 8px;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  font-weight: 450;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast);
}

.navbar__mobile-sublink:hover {
  color: var(--color-text);
  background-color: rgba(0, 0, 0, 0.03);
}

.navbar__mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: var(--space-xl);
}

.navbar__mobile-btn {
  width: 100%;
  justify-content: center;
  text-align: center;
}

/* Mobile menu transitions */
.mobile-menu-enter-active {
  transition: all 350ms var(--ease-out);
}

.mobile-menu-leave-active {
  transition: all 250ms var(--ease-out);
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.mobile-menu-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 250ms var(--ease-out);
}

.slide-down-leave-active {
  transition: all 150ms var(--ease-out);
}

.slide-down-enter-from {
  opacity: 0;
  max-height: 0;
}

.slide-down-leave-to {
  opacity: 0;
}

/* --------- Responsive --------- */
@media (max-width: 900px) {
  .navbar__nav,
  .navbar__actions {
    display: none;
  }

  .navbar__toggle {
    display: flex;
  }
}

@media (max-width: 480px) {
  .navbar__logo-text {
    font-size: 0.9rem;
  }
}
</style>