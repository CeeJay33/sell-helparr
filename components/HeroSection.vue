<template>
  <section class="hero">
    <div class="hero__content container">
      <!-- Heading -->
      <div class="hero__text">
        <h1 class="hero__title">
          Order Now<br />
          Track Your Deliveries 
        </h1>
        <p class="hero__subtitle">
          From concept to conversion — manage thousands of successful<br class="hero__br-desktop" />
          sellers ads seamlessly.
        </p>

        <!-- CTA Buttons -->
        <div class="hero__ctas">
          <NuxtLink to="/download" class="btn btn-primary btn-lg">
            Download Free App
          </NuxtLink>
          <NuxtLink to="/get-started" class="btn btn-outline btn-lg">
            Get Started Free
          </NuxtLink>
        </div>
      </div>

      <!-- Visual Section with Phone + Floating Cards -->
      <div class="hero__visual">
        <!-- Gradient circle background -->
        <div class="hero__circle-bg"></div>

        <!-- Floating Card: Product Video (top-left) -->
        <div class="hero__float-card hero__float-card--video">
          <div class="hero__video-card">
            <div class="hero__video-timestamp">2:01</div>
            <!--
              VIDEO THUMBNAIL IMAGE
              Replace the src below with your own image path, e.g.:
              src="/images/hero/product-video-thumb.jpg"
              Recommended size: 260x280px (will be cropped to fit)
            -->
            <div class="hero__video-thumb">
              <img
                :src="heroVideoThumb"
                alt="Product video thumbnail"
                class="hero__video-thumb-img"
              />
            </div>
          </div>
        </div>

        <!-- Floating Card: Star Rating (below video card) -->
        <div class="hero__float-card hero__float-card--rating">
          <div class="hero__rating-card">
            <div class="hero__stars">
              <svg v-for="i in 5" :key="i" width="18" height="18" viewBox="0 0 18 18" fill="#111111">
                <path
                  d="M9 1.5L11.3 6.2L16.5 6.9L12.75 10.5L13.6 15.7L9 13.3L4.4 15.7L5.25 10.5L1.5 6.9L6.7 6.2L9 1.5Z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Phone Mockup (center) -->
        <div class="hero__phone">
          <div class="hero__phone-frame">
            <!-- Phone notch -->
            <div class="hero__phone-notch"></div>

            <!-- Phone screen content -->
            <div class="hero__phone-screen">
              <!-- Live stream header -->
              <div class="hero__phone-header">
                <div class="hero__phone-user">
                  <!--
                    USER AVATAR IMAGE
                    Replace src, e.g.: src="/images/hero/avatar.jpg"
                    Recommended size: 56x56px (circle crop)
                  -->
                  <img
                    :src="heroAvatar"
                    alt="Wade Warren"
                    class="hero__avatar-img"
                  />
                </div>
                
              </div>

              <!--
                PHONE SCREEN / LIVE STREAM IMAGE
                Replace the src below with your own image path, e.g.:
                src="/images/hero/live-stream.jpg"
                Recommended size: 480x850px (portrait, fills the phone screen)
              -->
              <div class="hero__phone-image">
                <img
                  :src="heroPhoneImg"
                  alt="Live stream preview"
                  class="hero__phone-screen-img"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Card: Items Sold (top-right) -->
        <div class="hero__float-card hero__float-card--sold">
          <div class="hero__sold-card">
            <div class="hero__sold-number">
              <span class="hero__sold-big">8</span>
              <span class="hero__sold-label">items</span>
            </div>
            <div class="hero__sold-subtitle">Sold this week</div>
            <div class="hero__sold-price">$12</div>
            <!--
              SOLD ITEM PRODUCT IMAGE
              Replace the src below, e.g.: src="/images/hero/sold-product.png"
              Recommended size: 96x96px (small square thumbnail)
            -->
            <div class="hero__sold-thumb">
              <img
                :src="heroSoldProduct"
                alt="Product thumbnail"
                class="hero__sold-thumb-img"
              />
            </div>
          </div>
        </div>

        <!-- Floating Card: Engagement (bottom-left) -->
        <div class="hero__float-card hero__float-card--engagement">
          <div class="hero__engagement-card">
            <div class="hero__engagement-bars">
              <div class="hero__bar hero__bar--1"></div>
              <div class="hero__bar hero__bar--2"></div>
              <div class="hero__bar hero__bar--3"></div>
              <div class="hero__bar hero__bar--4"></div>
            </div>
            <div class="hero__engagement-info">
              <span class="hero__engagement-label">Engagement</span>
              <div class="hero__engagement-value">
                <span class="hero__engagement-percent">40%</span>
                <span class="hero__engagement-trend">●</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Card: Social Post (bottom-right) -->
        <div class="hero__float-card hero__float-card--social">
          <div class="hero__social-card">
            <!--
              SOCIAL POST IMAGE
              Replace the src below, e.g.: src="/images/hero/social-post.jpg"
              Recommended size: 300x260px (slightly landscape)
            -->
            <div class="hero__social-image">
              <img
                :src="heroSocialPost"
                alt="Social media post"
                class="hero__social-post-img"
              />
            </div>
            <div class="hero__social-meta">
              <span class="hero__social-likes">1.5k</span>
            </div>
            <div class="hero__social-actions">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#E74C3C">
                <path
                  d="M8 14s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 5.5 3c0 3.5-5.5 7-5.5 7z" />
              </svg>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#999" stroke-width="1.5">
                <path d="M14 8c0 3-4 5.5-6 7-2-1.5-6-4-6-7a4 4 0 0 1 8-1 4 4 0 0 1 4 1z" opacity="0" />
                <circle cx="8" cy="8" r="6" />
                <path d="M5 8h6M8 5v6" stroke-linecap="round" opacity="0" />
              </svg>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#999" stroke-width="1.2">
                <path d="M2 2h12v9H5l-3 3V2z" />
              </svg>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#999" stroke-width="1.2">
                <path d="M3 6h10M8 3v10M11 13l3-3-3-3" stroke-linecap="round" stroke-linejoin="round"
                  transform="rotate(-45 8 8)" opacity="0" />
                <rect x="2" y="5" width="8" height="6" rx="1" />
                <path d="M10 7l4-2v6l-4-2" />
              </svg>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#999" stroke-width="1.2"
                style="margin-left: auto;">
                <path d="M14 1l-5 5M9 1h5v5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Connecting lines (decorative) -->
        <svg class="hero__connections" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 200 C 300 200, 350 280, 400 280" stroke="#ddd" stroke-width="1.5" stroke-dasharray="4 4"
            fill="none" />
          <path d="M600 200 C 500 200, 450 280, 400 280" stroke="#ddd" stroke-width="1.5" stroke-dasharray="4 4"
            fill="none" />
          <path d="M200 380 C 300 380, 350 350, 400 350" stroke="#ddd" stroke-width="1.5" stroke-dasharray="4 4"
            fill="none" />
          <path d="M600 380 C 500 380, 450 350, 400 350" stroke="#ddd" stroke-width="1.5" stroke-dasharray="4 4"
            fill="none" />
        </svg>
      </div>
    </div>

    <!-- Brand Logos Strip -->
    <div class="hero__brands">
      <div class="hero__brands-track">
        <div class="hero__brand-item" v-for="(brand, index) in [...brands, ...brands]" :key="`brand-${index}`">
          <span class="hero__brand-name" :style="{ fontFamily: brand.font, fontWeight: brand.weight, fontStyle: brand.style || 'normal', fontSize: brand.size || '1rem', letterSpacing: brand.spacing || 'normal' }">
            {{ brand.name }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// ============================================
// IMAGE IMPORTS — Nuxt 3 requires importing assets
// from the assets/ folder. Update these paths to
// point to YOUR actual image files.
// ============================================
import heroPhoneImg from '~/assets/img/photo_2026-02-24_15-05-00.jpg'
import heroVideoThumb from '~/assets/img/photo_2026-02-24_15-05-00.jpg'
import heroAvatar from '~/assets/img/photo_2026-02-24_15-05-00.jpg'
import heroSoldProduct from '~/assets/img/photo_2026-02-24_15-05-00.jpg'
import heroSocialPost from '~/assets/img/photo_2026-02-24_15-05-00.jpg'

const brands = [
  { name: 'HEIRESS', font: 'var(--font-body)', weight: '300', size: '0.85rem', spacing: '0.15em' },
  { name: 'TOZO', font: 'var(--font-body)', weight: '800', size: '1.15rem', spacing: '0.02em' },
  { name: 'HELLBABIES', font: 'var(--font-heading)', weight: '400', size: '1rem', style: 'italic' },
  { name: 'cocokind', font: 'var(--font-body)', weight: '600', size: '1.05rem', spacing: '-0.01em' },
  { name: 'Oxyfresh', font: 'var(--font-body)', weight: '500', size: '1.05rem' },
  { name: 'DOT & KEY', font: 'var(--font-body)', weight: '700', size: '0.85rem', spacing: '0.08em' },
  { name: 'Skyboy', font: 'var(--font-heading)', weight: '400', size: '1.05rem', style: 'italic' },
  { name: 'Bellefit', font: 'var(--font-body)', weight: '800', size: '1.05rem' },
  { name: 'AMAZING LACE', font: 'var(--font-body)', weight: '400', size: '0.8rem', spacing: '0.12em' },
]
</script>

<style scoped>
/* --------- Hero Section --------- */
.hero {
  padding-top: calc(var(--nav-height) + 40px);
  overflow: hidden;
}

/* --------- Text Content --------- */
.hero__text {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  animation: fadeInUp 800ms var(--ease-out) forwards;
}

.hero__title {
  font-family: var(--font-heading);
  font-size: clamp(2.75rem, 6vw, 4.5rem);
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: var(--color-black);
  margin-bottom: 20px;
}

.hero__subtitle {
  font-size: clamp(0.95rem, 1.5vw, 1.05rem);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero__br-desktop {
  display: block;
}

/* --------- CTAs --------- */
.hero__ctas {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* --------- Visual Area --------- */
.hero__visual {
  position: relative;
  max-width: 900px;
  height: 520px;
  margin: 50px auto 0;
}

/* Circle gradient background */
.hero__circle-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, #FFF5E0 0%, #FFFAF0 40%, transparent 70%);
  z-index: 0;
}

/* Connecting lines SVG */
.hero__connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  opacity: 0.5;
}

/* --------- Phone Mockup --------- */
.hero__phone {
  position: absolute;
  top: 20%;
  left: 35%;
  transform: translate(-50%, -50%);
  z-index: 5;
  animation: fadeInUp 600ms 200ms var(--ease-out) both;
}

.hero__phone-frame {
  width: 240px;
  height: 440px;
  background: var(--color-black);
  border-radius: 36px;
  padding: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  overflow: hidden;
  position: relative;
}

.hero__phone-notch {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 24px;
  background: var(--color-black);
  border-radius: 0 0 14px 14px;
  z-index: 10;
}

.hero__phone-screen {
  width: 100%;
  height: 100%;
  background: #2C2C2E;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
}

.hero__phone-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36px 16px 12px;
  z-index: 5;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
}

.hero__phone-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Avatar handled by .hero__avatar-img */

.hero__phone-username {
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.hero__phone-live {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--color-accent-live);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.hero__live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
  animation: pulse 1.5s ease infinite;
}

.hero__phone-image {
  width: 100%;
  height: 100%;
}

/* --------- Floating Cards --------- */
.hero__float-card {
  position: absolute;
  z-index: 6;
}

/* Video card — top left */
.hero__float-card--video {
  top: 30px;
  left: 20px;
  animation: slideInLeft 600ms 400ms var(--ease-out) both;
}

.hero__video-card {
  width: 130px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: float 4s ease-in-out infinite;
}

.hero__video-timestamp {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.hero__video-thumb {
  width: 100%;
  height: 140px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Star rating — below video */
.hero__float-card--rating {
  top: 200px;
  left: 100px;
  animation: slideInLeft 600ms 600ms var(--ease-out) both;
}

.hero__rating-card {
  background: var(--color-accent-yellow);
  padding: 8px 14px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-md);
  animation: float 5s ease-in-out 1s infinite;
}

.hero__stars {
  display: flex;
  gap: 2px;
}

/* Items sold — top right */
.hero__float-card--sold {
  top: 20px;
  right: 20px;
  animation: slideInRight 600ms 500ms var(--ease-out) both;
}

.hero__sold-card {
  background: var(--color-accent-mint);
  border-radius: var(--radius-xl);
  padding: 16px 20px;
  width: 170px;
  box-shadow: var(--shadow-md);
  animation: float 4.5s ease-in-out 0.5s infinite;
  position: relative;
}

.hero__sold-number {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.hero__sold-big {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-black);
  line-height: 1;
}

.hero__sold-label {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.hero__sold-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.hero__sold-price {
  display: inline-block;
  background: var(--color-white);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  margin-top: 8px;
}

.hero__sold-thumb {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

/* Engagement — bottom left */
.hero__float-card--engagement {
  bottom: 20px;
  left: 30px;
  animation: slideInLeft 600ms 700ms var(--ease-out) both;
}

.hero__engagement-card {
  background: var(--color-accent-yellow-bg);
  border-radius: var(--radius-xl);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-md);
  animation: float 5s ease-in-out 1.5s infinite;
}

.hero__engagement-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 36px;
}

.hero__bar {
  width: 8px;
  border-radius: 3px;
  background: var(--color-black);
}

.hero__bar--1 {
  height: 14px;
}

.hero__bar--2 {
  height: 24px;
}

.hero__bar--3 {
  height: 36px;
}

.hero__bar--4 {
  height: 20px;
}

.hero__engagement-label {
  font-size: 0.7rem;
  color: var(--color-accent-coral);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.hero__engagement-value {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hero__engagement-percent {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-black);
  line-height: 1;
}

.hero__engagement-trend {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

/* Social post — bottom right */
.hero__float-card--social {
  bottom: 10px;
  right: 20px;
  animation: slideInRight 600ms 800ms var(--ease-out) both;
}

.hero__social-card {
  width: 150px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: float 4s ease-in-out 2s infinite;
}

.hero__social-image {
  width: 100%;
  height: 130px;
  overflow: hidden;
}

.hero__social-meta {
  padding: 6px 10px 0;
}

.hero__social-likes {
  display: inline-block;
  background: var(--color-accent-live);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.hero__social-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px 10px;
}

/* --------- Actual Image Styles --------- */

/* Video thumbnail image */
.hero__video-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Phone screen image (live stream person) */
.hero__phone-screen-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Avatar image inside phone header */
.hero__avatar-img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  display: block;
}

/* Sold card product thumbnail */
.hero__sold-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-md);
  display: block;
}

/* Social post image */
.hero__social-post-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Fallback background when images haven't loaded yet */
.hero__video-thumb {
  background: linear-gradient(135deg, #a8d4f0, #c4dce8);
}

.hero__phone-image {
  background: linear-gradient(135deg, #e8a87c, #d4784a);
}

.hero__sold-thumb {
  background: linear-gradient(135deg, #b8e6c8, #87d4a0);
}

.hero__social-image {
  background: linear-gradient(135deg, #7bc67e, #4a9e5c);
}

/* --------- Brand Logos --------- */
.hero__brands {
  margin-top: 50px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 28px 0;
  overflow: hidden;
}

.hero__brands-track {
  display: flex;
  align-items: center;
  gap: 48px;
  animation: marquee 30s linear infinite;
  width: max-content;
}

.hero__brand-item {
  flex-shrink: 0;
}

.hero__brand-name {
  color: var(--color-text);
  opacity: 0.7;
  transition: opacity var(--duration-normal);
  white-space: nowrap;
  user-select: none;
}

.hero__brand-item:hover .hero__brand-name {
  opacity: 1;
}

/* --------- Responsive --------- */
@media (max-width: 900px) {
  .hero__visual {
    height: 450px;
    max-width: 100%;
  }

  .hero__circle-bg {
    width: 320px;
    height: 320px;
  }

  .hero__phone-frame {
    width: 200px;
    height: 370px;
    border-radius: 30px;
  }

  .hero__phone-screen {
    border-radius: 24px;
  }

  .hero__float-card--video {
    left: 0;
    top: 50px;
  }

  .hero__video-card {
    width: 100px;
  }

  .hero__video-thumb {
    height: 110px;
  }

  .hero__float-card--sold {
    right: 0;
    top: 40px;
  }

  .hero__sold-card {
    width: 145px;
    padding: 12px 16px;
  }

  .hero__sold-big {
    font-size: 2rem;
  }

  .hero__float-card--rating {
    left: 50px;
    top: 190px;
  }

  .hero__float-card--engagement {
    bottom: 10px;
    left: 0;
  }

  .hero__float-card--social {
    bottom: 0;
    right: 0;
  }

  .hero__social-card {
    width: 120px;
  }

  .hero__social-image {
    height: 100px;
  }

  .hero__connections {
    display: none;
  }
}

@media (max-width: 600px) {
  .hero {
    padding-top: calc(var(--nav-height) + 24px);
  }

  .hero__title {
    font-size: 2.25rem;
  }

  .hero__subtitle {
    font-size: 0.9rem;
  }

  .hero__br-desktop {
    display: none;
  }

  .hero__ctas {
    flex-direction: column;
    gap: 12px;
  }

  .hero__ctas .btn {
    width: 100%;
    max-width: 280px;
  }

  .hero__visual {
    height: 380px;
    margin-top: 36px;
  }

  .hero__phone-frame {
    width: 170px;
    height: 310px;
    border-radius: 26px;
  }

  .hero__float-card--video,
  .hero__float-card--social {
    display: none;
  }

  .hero__float-card--engagement {
    left: 5px;
    bottom: 0;
  }

  .hero__float-card--sold {
    right: 5px;
  }

  .hero__float-card--rating {
    left: 10px;
    top: 160px;
  }

  .hero__brands-track {
    gap: 32px;
  }

  .hero__brand-name {
    font-size: 0.85rem !important;
  }
}
</style>