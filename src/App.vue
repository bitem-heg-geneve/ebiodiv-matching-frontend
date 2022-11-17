<template>

  <div id="app" :style="cssVars" class="d-flex flex-column min-vh-100">

    <router-view />

    <div class="logo row mt-auto">
      <div class="col-1">
        <a href="https://ebiodiv.org/"><img src="./assets/images/logo_ebiodiv.png" /></a>
      </div>
      <div class="col-1">
        <a href="https://www.gbif.org/"><img src="./assets/images/logo_gbif.png" /></a>
      </div>
      <div class="col-1">
        <a href="https://plazi.org/"><img src="./assets/images/logo_plazi.png" /></a>
      </div>
      <div class="col-1">
        <a href="https://plazi.org/treatmentbank/"><img src="./assets/images/logo_tb.png" /></a>
      </div>
      <div class="col-1">
        <a href="https://bicikl-project.eu/"><img src="./assets/images/logo_bicikl.png" /></a>
      </div>
      <div class="col-1">
        <a href="https://www.unibe.ch/"><img src="./assets/images/logo_unibern.png" /></a>
      </div>
      <div class="col-1">
        <a href="https://www.nmbe.ch/"><img src="./assets/images/logo_nmbe.png" /></a>
      </div>
      <div class="col-1">
        <a href="https://www.swissuniversities.ch/"><img src="./assets/images/logo_swissuni.png" /></a>
      </div>
      <div class="col-1">
        <a href="https://www.sib.swiss/"><img src="./assets/images/logo_sib.png" /></a>
      </div>
      <div class="col-1">
        <a href="https://www.hesge.ch/heg/"><img src="./assets/images/logo_heg.png" /></a>
      </div>
      <div class="col-1">
        <a href="https://www.hes-so.ch/"><img src="./assets/images/logo_hesso.jpg" /></a>
      </div>
      <div class="col-1">
        <a href="https://candy.hesge.ch/SIBiLS/"><img src="./assets/images/logo_sibils.png" /></a>
      </div>
    </div>

    <CookieConsentElement></CookieConsentElement>
  
  </div>

</template>

<script>
import { mapState } from 'vuex'
import CookieConsentElement from '@/components/CookieConsentElement.vue'

export default {
  components: {
    CookieConsentElement,
  },
  computed: {
    ...mapState(['theme_color']),
    cssVars() {
      return {
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
