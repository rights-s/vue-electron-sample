<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>MS SQL Server Data</h3>
    <table>
      <tr>
        <th>Id</th>
        <th>Name</th>
      </tr>
      <tr v-for="(row, index) in rows" :key="index">
        <td>{{ row.id }}</td>
        <td>{{ row.name }}</td>
      </tr>
    </table>
    <h3>USB Device List</h3>
    <button id="but"> Show Device List</button>
    <p id="display"></p>
    <!-- <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul> -->
  </div>
</template>

<script>
import api from '@/lib/api'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      rows: []
    }
  },
  created () {
    this.getSQLData()
  },
  methods: {
    async getSQLData () {
      this.rows = await api.getPosts()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
