import Vue from 'vue'

export const bus = new Vue({
    name: 'bus',
    data: {
        fav: [
            {name: 'clothx', price: 1},
            {name: 'clothy', price: 2}
        ]
    },
    created() {
        this.$on('add', (item) => {
            this.addFav(item);
        })
    },
    methods: {
        addFav(item) {
            this.fav.push(item)
        }
    }
})