<template>
  <div id="app">
    <clothes-count ref="count" />
    <clothes-price ref="price" />
  </div>
</template>

<script>
import ClothesCount from './components/ClothesCount.vue'
import ClothesPrice from './components/ClothesPrice.vue'

export default {
  name: 'app',
  components: {
    ClothesCount,
    ClothesPrice
  }
}
</script>
