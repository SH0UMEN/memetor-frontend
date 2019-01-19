<template>
  <div id="app">
    <header>
      <nav>
        <ul>
          <li>
            <router-link to="create-mem">Cоздать мем</router-link>
          </li>
          <li>
            <router-link to="/">Все мемы</router-link>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <transition name="router" mode="out-in">
        <router-view/>
      </transition>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="sass">

  @font-face
    font-family: "Custom SS"
    src: url("../static/fonts/micross.ttf")


  body
    margin: 0 !important
    overflow: hidden

  #app
    font-family: sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    color: #2c3e50
    height: 100vh
    position: relative
    .container
      position: relative
      opacity: 1
    .router-enter-active, .router-leave-active
      transition: opacity .2s
    .router-leave-to, .router-enter
      opacity: 0

  header
    height: 60px
    background-color: blue
    position: absolute
    z-index: 1000
    left: 0
    right: 0
    top: 0

  nav
    height: 100%
    ul
      display: flex
      padding: 0
      height: 100%
      list-style-type: none
      justify-content: center
      margin: 0
      li
        height: 100%
        &:last-child
          margin-left: 30px
        a
          color: white
          text-decoration: none
          height: 100%
          font-weight: 600
          display: flex
          align-items: center
          position: relative
          box-sizing: border-box
          &.router-link-exact-active:after
            display: block
            content: ""
            position: absolute
            bottom: 0
            left: 0
            width: 100%
            height: 3px
            background-color: white

  main
    height: 100%
</style>
