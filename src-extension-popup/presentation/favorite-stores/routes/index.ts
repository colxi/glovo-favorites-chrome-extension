import type { RouteRecordRaw } from 'vue-router'
import FavoriteStores from '../components/FavoriteStores.vue'

export const favoriteStoresRoute: RouteRecordRaw = {
  path: '/',
  alias: '/favorite-stores',
  name: 'favorite-stores',
  component: FavoriteStores
}
