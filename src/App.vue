<template>

    <div id="app" :style="cssVars">

      <div id="nav">

      </div>

      <router-view/>

      <div class="logo">
        <img src="./assets/images/logo_ebiodiv.png"/>
        <img src="./assets/images/logo_gbif.png"/>
        <img src="./assets/images/logo_plazi.png"/>
        <img src="./assets/images/logo_tb.png"/>
        <img src="./assets/images/logo_sib.png"/>
        <img src="./assets/images/logo_heg.png"/>
        <img src="./assets/images/logo_hesso.jpg"/>
        <img src="./assets/images/logo_sibils.png"/>
      </div>

    </div>

</template>

<script>
import { mapState } from 'vuex'

    export default {
      computed: {
            ...mapState(['theme_color']),
            cssVars () {
                return{
                    '--color-main': this.theme_color.main,
                }
            }
      }
    }

</script>


<style lang="scss">

   #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      font-size: 0.8em;

      .banner-container {
        width: 99%;
        margin: 0 auto;
      }

      .component-container {
        width: 90%;
        margin: 0 auto;
      }

      .query-container {
        padding: 20px;
        background-color: #F2F2F2;
        border-radius: 10px;
      }

      a {
        font-weight: bold;
        text-decoration: none;
        color: var(--color-main);
      }
      a:hover {
        text-decoration: underline;
      }

      h1 {
        font-size: 1.8em;
        padding: 20px 0;
        margin: 0;
      }
      h2 {
        font-size: 1.2em;
        padding: 15px 0;
        margin: 0;
      }
      h3 {
        font-size: 1.1em;
        padding: 10px 0;
        margin: 0;
      }

      .info {
        font-style: italic;
        font-size: 0.8em;
      }

      .required {
        color: red;
      }

      .nav-pills .tab-title .nav-link:not(.active) {
        background-color: #FFFFFF !important;
        color: #000000;
        font-weight: normal;
      }

      .nav-pills .tab-title .nav-link {
        background-color: var(--color-main) !important;
        color: #fff;
        text-decoration: none;
        font-weight: normal;
      }

      .page-item .page-link {
        color: #2c3e50;
      }

      .page-item .page-link:hover {
        color: #2c3e50;
      }
      .page-item.active .page-link {
        color: #fff !important;
        background: var(--color-main) !important;
        border: 0px solid var(--color-main);
      }

      .page-item.active {
        color: #fff !important;
        background: var(--color-main) !important;
        border: 1px solid var(--color-main);
      }

      .logo {
        margin-top: 50px;
        border-top: 1px solid var(--color-main);
        border-bottom: 1px solid var(--color-main);
      }
      .logo img {
        height: 80px;
        padding: 20px;
      }

      .separator h2 {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 1em;
        }

        .separator h2::before,
        .separator h2::after {
          content: "";
          display: block;
          flex-grow: 1;
          height: 1px;
          background: #ccc;
        }

        .separator h2 span {
          padding: 0 2em;
        }
        .separator {
        margin-bottom: 20px;
        }

    }


    #nav {

      padding: 30px;

      a {
        font-weight: bold;
        color: #2c3e50;
        text-decoration: none;

        &.router-link-exact-active {
          color: var(--color-main);
        }
      }
      a:hover {
        text-decoration: underline;
      }

    }

</style>
