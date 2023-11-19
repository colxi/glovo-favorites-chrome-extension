<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onBeforeMount } from 'vue'
import router from './router'

onBeforeMount(async () => {
  await router.push('/')
})

</script>

<template>
  <div class="wrapper">
    <div>Glovo favorites</div>
      <nav>
        <RouterLink to="/">Favorites</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.wrapper{
  width: 400px;
  height: 700px;
  color:white
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>
