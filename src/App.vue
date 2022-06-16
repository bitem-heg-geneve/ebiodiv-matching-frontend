<template>

    <div id="app" :style="cssVars">

      <router-view/>

      <div class="logo row">
          <div class="col-1">
                <img src="./assets/images/logo_ebiodiv.png"/>
          </div>
            <div class="col-1">
                <img src="./assets/images/logo_gbif.png"/>
          </div>
          <div class="col-1">
                <img src="./assets/images/logo_plazi.png"/>
          </div>
          <div class="col-1">
                <img src="./assets/images/logo_tb.png"/>
          </div>
          <div class="col-1">
                <img src="./assets/images/logo_bicikl.png"/>
          </div>
          <div class="col-1">
                <img src="./assets/images/logo_unibern.png"/>
          </div>
          <div class="col-1">
                <img src="./assets/images/logo_nmbe.png"/>
          </div>
          <div class="col-1">
                <img src="./assets/images/logo_swissuni.png"/>
          </div>
          <div class="col-1">
                <img src="./assets/images/logo_sib.png"/>
          </div>
          <div class="col-1">
                <img src="./assets/images/logo_heg.png"/>
          </div>
          <div class="col-1">
                <img src="./assets/images/logo_hesso.jpg"/>
          </div>
          <div class="col-1">
                <img src="./assets/images/logo_sibils.png"/>
          </div>
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
        width: 100%;
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
        width: 100%;
        margin-top: 50px;
        border-top: 1px solid var(--color-main);
        border-bottom: 1px solid var(--color-main);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 50px;
      }
      .logo img {
        width: 90%
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

</style>
