<template>
  <div class="container" @load="debug('Fuck, Yeah')">
    <img v-for="mem in memes" :src="mem">
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
  name: 'HelloWorld',
    data () {
      return {
        memes: []
      }
    },
    methods: {
      debug(message) {
        console.log(message)
      }
    },
    mounted() {
      axios.get('http://localhost:8000/').then((res)=>{
        this.memes = res.data.memes;
      })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
