<template>
  <ul>
    <li v-for="(item, index) in data" :key="index" @click="searchList">{{ item.key }}</li>
  </ul>
</template>

<script>
export default {
  name: 'DataList',
  props: {
    data: {
      type: Array,
      default() {
        return null
      },
    },
  },

  methods: {
    searchList() {

    }
  },
}
</script>

<style lang="scss" scoped>
ul{
  position: absolute;
  margin: 10px;
  top: 50px;
  width: 84%;
  left: 0;
  background-color: #fff;
  box-shadow: 0 0 10px #eee;
  border-radius: 5px;
  li{
    list-style: none;
    line-height: 2;
  }
}
</style>
