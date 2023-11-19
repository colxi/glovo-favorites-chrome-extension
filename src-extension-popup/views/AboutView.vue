<script setup lang="ts">
import { useFavoritesStore } from '@/stores/favorites'

const { favorites } = useFavoritesStore()
</script>

<template>
  <div class="about">
    <div v-for="favorite of favorites">
      {{ favorite }}
    </div>
  </div>
</template>

<style></style>
