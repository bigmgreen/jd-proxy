<template>
  <article>
    <div class="input">
      <input type="text" placeholder="输入商品标题" v-model="kw" />

      <button type="button">搜索</button>

      <DataList v-show="dataList.length > 0" :data="dataList" />
    </div>

    <div class="list">
      <Card v-for="(item, index) in cardList" :key="index" />
    </div>
  </article>
</template>

<script>
import axios from 'axios'
import Card from './components/Card.vue'
import DataList from './components/DataList.vue'

export default {
  name: 'App',

  components: {
    Card,
    DataList,
  },

  data() {
    return {
      cardList: [],
      dataList: [],
      kw: ''
    }
  },

  watch: {
    async kw(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.dataList = await this.search(newVal)
      }
    }
  },

  methods: {
    async search(kw) {
      return new Promise((resolve, reject) => {
        axios({
        method: 'GET',
        url: '//127.0.0.1:5566/search',
        params: { kw }
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch(function(error) {
          reject(error)
        })
      })
    },

    searchList() {
      axios({
        method: 'GET',
        url: '/oauth/qibuauthorize',
      })
        .then(res => {
          resolve(response.data)
        })
        .catch(function(error) {
          reject(error)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  padding: 10px;
  position: relative;
  input {
    flex: 1;
    padding: 10px;
  }
}
</style>
