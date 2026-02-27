<template>
  <footer class="footer">
    <div class="footer__inner container">
      <div class="footer__top">
        <!-- Brand -->
        <div class="footer__brand">
          <NuxtLink to="/" class="footer__logo">
            <div class="footer__logo-icon">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="8" r="3" fill="currentColor" />
                <circle cx="8" cy="14" r="3" fill="currentColor" />
                <circle cx="24" cy="14" r="3" fill="currentColor" />
                <circle cx="16" cy="20" r="3" fill="currentColor" />
                <circle cx="10" cy="26" r="3" fill="currentColor" />
                <circle cx="22" cy="26" r="3" fill="currentColor" />
              </svg>
            </div>
            <span>helparr.sell</span>
          </NuxtLink>
          <p class="footer__tagline">
            AI-powered platform connecting sellers with customers across Africa.
          </p>
        </div>

        <!-- Links -->
        <div class="footer__links-group">
          <h4 class="footer__links-title">Products</h4>
          <ul class="footer__links">
            <li><NuxtLink to="/products/sell">Helparr Sell</NuxtLink></li>
            <li><NuxtLink to="/products/pay">Helparr Pay</NuxtLink></li>
            <li><NuxtLink to="/products/ai">Helparr AI</NuxtLink></li>
            <li><NuxtLink to="/products/now">HelparrNow</NuxtLink></li>
          </ul>
        </div>

        <div class="footer__links-group">
          <h4 class="footer__links-title">Company</h4>
          <ul class="footer__links">
            <li><NuxtLink to="/about">About</NuxtLink></li>
            <li><NuxtLink to="/stories">Customer Stories</NuxtLink></li>
            <li><NuxtLink to="/careers">Careers</NuxtLink></li>
            <li><NuxtLink to="/blog">Blog</NuxtLink></li>
          </ul>
        </div>

        <div class="footer__links-group">
          <h4 class="footer__links-title">Resources</h4>
          <ul class="footer__links">
            <li><NuxtLink to="/pricing">Pricing</NuxtLink></li>
            <li><NuxtLink to="/docs">Documentation</NuxtLink></li>
            <li><NuxtLink to="/support">Support</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact</NuxtLink></li>
          </ul>
        </div>

        <div class="footer__links-group">
          <h4 class="footer__links-title">Legal</h4>
          <ul class="footer__links">
            <li><NuxtLink to="/privacy">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms">Terms of Service</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copyright">&copy; {{ new Date().getFullYear() }} Helparr. All rights reserved.</p>
        <div class="footer__social">
          <a href="#" aria-label="Twitter/X">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-black);
  color: rgba(255, 255, 255, 0.85);
  padding: 64px 0 32px;
  margin-top: 80px;
}

.footer__top {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  margin-bottom: 12px;
}

.footer__logo-icon {
  color: white;
}

.footer__tagline {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  max-width: 260px;
}

.footer__links-title {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 16px;
}

.footer__links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer__links a {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  transition: color 200ms;
}

.footer__links a:hover {
  color: white;
}

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
}

.footer__copyright {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.35);
}

.footer__social {
  display: flex;
  gap: 16px;
}

.footer__social a {
  color: rgba(255, 255, 255, 0.5);
  transition: color 200ms;
}

.footer__social a:hover {
  color: white;
}

@media (max-width: 900px) {
  .footer__top {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .footer__top {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer__bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>