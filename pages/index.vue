<template>
  <div class="home-page">
    <HeroSection />

    <!-- Features Section -->
    <section class="features">
      <div class="features__inner container">
        <div class="features__header">
          <h2 class="features__title">Everything You Need<br />to Sell Smarter</h2>
          <p class="features__subtitle">
            Powerful tools designed to help African sellers and artisans grow their business online.
          </p>
        </div>

        <div class="features__grid">
          <div v-for="(feature, i) in features" :key="i" class="feature-card"
            :class="`feature-card--${feature.accent}`">
            <div class="feature-card__icon" v-html="feature.icon"></div>
            <h3 class="feature-card__title">{{ feature.title }}</h3>
            <p class="feature-card__desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stats__inner container">
        <div v-for="(stat, i) in stats" :key="i" class="stat-item">
          <span class="stat-item__number">{{ stat.number }}</span>
          <span class="stat-item__label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-section__inner container">
        <div class="cta-section__content">
          <h2 class="cta-section__title">Ready to Grow<br />Your Sales?</h2>
          <p class="cta-section__subtitle">
            Join thousands of sellers already using Helparr Sell to reach more customers across Africa.
          </p>
          <div class="cta-section__buttons">
            <NuxtLink to="/get-started" class="btn btn-primary btn-lg">Get Started Free</NuxtLink>
            <NuxtLink to="/demo" class="btn btn-outline btn-lg">Book A Demo</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Page meta
useHead({
  title: 'Helparr Sell — AI-Driven Conversion Growth',
})

// Features data
const features = [
  {
    title: 'AI-Powered Matching',
    description: 'Our intelligent algorithm connects your products with the right buyers at the right time.',
    accent: 'mint',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  },
  {
    title: 'Live Selling',
    description: 'Go live and sell directly to your audience with real-time engagement and checkout.',
    accent: 'coral',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  },
  {
    title: 'Seamless Payments',
    description: 'Accept payments effortlessly with Helparr Pay integration. Multiple currencies supported.',
    accent: 'yellow',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track your performance with detailed insights on sales, engagement, and customer behavior.',
    accent: 'purple',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  },
  {
    title: 'Fast Delivery',
    description: 'Integrate with HelparrNow for last-mile delivery that gets products to customers quickly.',
    accent: 'blue',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  },
  {
    title: 'AI Business Coach',
    description: 'Get personalized business advice and strategies powered by Helparr AI.',
    accent: 'mint',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
]

// Stats data
const stats = [
  { number: '50K+', label: 'Active Sellers' },
  { number: '1M+', label: 'Products Listed' },
  { number: '98%', label: 'Satisfaction Rate' },
  { number: '12', label: 'African Countries' },
]
</script>

<style scoped>
/* --------- Features Section --------- */
.features {
  padding: 100px 0;
}

.features__header {
  text-align: center;
  max-width: 550px;
  margin: 0 auto 60px;
}

.features__title {
  font-family: var(--font-heading);
  color: var(--color-black);
  margin-bottom: 16px;
}

.features__subtitle {
  font-size: 1.05rem;
  color: var(--color-text-secondary);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Feature Card */
.feature-card {
  padding: 32px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all var(--duration-normal) var(--ease-out);
  background: var(--color-white);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.feature-card__icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

/* :deep() is needed because v-html content is not scoped */
.feature-card__icon :deep(svg) {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.feature-card--mint .feature-card__icon {
  background: var(--color-accent-mint);
  color: #0d7a3e;
}
.feature-card--mint .feature-card__icon :deep(svg) { stroke: #0d7a3e; }

.feature-card--coral .feature-card__icon {
  background: #FFE0E0;
  color: #c0392b;
}
.feature-card--coral .feature-card__icon :deep(svg) { stroke: #c0392b; }

.feature-card--yellow .feature-card__icon {
  background: var(--color-accent-yellow-bg);
  color: #b8860b;
}
.feature-card--yellow .feature-card__icon :deep(svg) { stroke: #b8860b; }

.feature-card--purple .feature-card__icon {
  background: #E8E0F5;
  color: #6b21a8;
}
.feature-card--purple .feature-card__icon :deep(svg) { stroke: #6b21a8; }

.feature-card--blue .feature-card__icon {
  background: #DBEAFE;
  color: #1d4ed8;
}
.feature-card--blue .feature-card__icon :deep(svg) { stroke: #1d4ed8; }

.feature-card__title {
  font-family: var(--font-body);
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--color-text);
}

.feature-card__desc {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* --------- Stats Section --------- */
.stats {
  padding: 64px 0;
  background: var(--color-off-white);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.stats__inner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item__number {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 3vw, 3rem);
  color: var(--color-black);
  line-height: 1.1;
}

.stat-item__label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-weight: 450;
}

/* --------- CTA Section --------- */
.cta-section {
  padding: 100px 0;
}

.cta-section__content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 64px 40px;
  background: var(--color-off-white);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.cta-section__title {
  font-family: var(--font-heading);
  color: var(--color-black);
  margin-bottom: 16px;
}

.cta-section__subtitle {
  font-size: 1.05rem;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}

.cta-section__buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* --------- Responsive --------- */
@media (max-width: 900px) {
  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats__inner {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
}

@media (max-width: 600px) {
  .features {
    padding: 60px 0;
  }

  .features__grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: 24px;
  }

  .stats__inner {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  .cta-section {
    padding: 60px 0;
  }

  .cta-section__content {
    padding: 40px 24px;
  }

  .cta-section__buttons {
    flex-direction: column;
  }

  .cta-section__buttons .btn {
    width: 100%;
  }
}
</style>