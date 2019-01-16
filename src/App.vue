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
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @font-face {
    font-family: "Custom SS";
    src: url("../static/fonts/micross.ttf");
  }
  body {
    margin: 0 !important;
    overflow: hidden;
  }
  #app {
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100vh;
    position: relative;
  }
  header {
    height: 60px;
    background-color: blue;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
  nav {
    height: 100%;
  }
  nav ul {
    display: flex;
    padding: 0;
    height: 100%;
    list-style-type: none;
    justify-content: center;
    margin: 0;
  }
  nav ul li {
    height: 100%;
  }
  nav ul li:last-child {
    margin-left: 30px;
  }
  nav ul li a {
    color: white;
    text-decoration: none;
    height: 100%;
    font-weight: 600;
    display: flex;
    align-items: center;
    position: relative;
    box-sizing: border-box;
  }
  nav ul li a.router-link-exact-active:after {
    display: block;
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: white;
  }
  main {
    height: 100%;
  }

</style>
