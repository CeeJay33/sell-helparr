<template>
  <div class="app-layout">
    <NavBar />
    <main>
      <slot />
    </main>
    <FooterSection />
  </div>
</template>

<script setup>
// Layout uses auto-imported components from /components
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>