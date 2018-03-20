<template>
  <div class="count">
    <h2>count</h2>
    <span>allCount: {{allCount}}</span>
    <ul>
      <li v-for="item in allList" :key="item.id">
        {{item.name}} : {{item.num}}
        <span>
          <button @click="add(item.id)">+</button>
          <button @click="decrease(item.id)">-</button>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'clothes-count',
  methods: {
    add(id) {
      this.$store.commit('addQuantity', id)
    },
    decrease(id) {
      this.$store.commit('decQuantity', id)
    }
  },
  computed: {
    allList() {
      return this.$store.state.list
    },
    allCount() {
      return this.$store.getters.numTotal
    }
  }
}
</script>
