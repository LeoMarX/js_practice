<template>
    <div class="price">
        <h2>price</h2>
        <span>average: {{average | perfixPrice}}</span>
        <ul>
            <li v-for="item in allList" :key="item.id">
                {{item.name}} : {{item.price}}
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
    name: 'cloth-price',
    methods: {
        add(id) {
            this.$store.commit('addPrice', id)
        },
        decrease(id) {
            this.$store.commit('decPrice', id)
        }
    },
    computed: {
        allList() {
            return this.$store.state.list
        },
        average() {
            return this.$store.getters.priceAverage
        }
    },
    filters: {
        perfixPrice(val) {
            return Number(val).toFixed(2);
        }
    }
};
</script>

