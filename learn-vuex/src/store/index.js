import Vue from 'vue'
import Vuex from 'vuex'
import { clothesList } from '../data/list'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
    list: [].concat(clothesList)
}

const getters = {
    itemLens: state => state.list.length,
    numTotal: state => state.list.map(item => item.num).reduce((pre, cur) => pre + cur, 0),
    priceAverage: state => state.list.map(item => item.price).reduce((pre, cur) => pre + cur, 0) / (state.list.length || 1),
    priceTotal() {
        
    }
}

const mutations = {
    addQuantity(state, id) {
        state.list.find(item => item.id === id).num ++
    },
    decQuantity(state, id) {
        let goods = state.list.find(item => item.id === id);
        goods.num > 0 && goods.num --
    },
    addPrice(state, id) {
        state.list.find(item => item.id === id).price ++
    },
    decPrice(state, id) {
        let goods = state.list.find(item => item.id === id);
        goods.price > 0 && goods.price--
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    strict: debug
})