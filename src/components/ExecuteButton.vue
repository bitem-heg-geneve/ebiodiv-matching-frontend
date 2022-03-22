<template>

  <span :style="cssVars">
       <button class="button" v-on="$listeners">
           <span>{{ button_text }}</span>
       </button>

  </span>

</template>

<script>
import { mapState } from 'vuex'

export default {

  name: 'ExecuteButton',
  props: {
    button_text: {
        type: String,
        default: "Search"
    },
  },
  computed: {
    ...mapState(['theme_color']),
    cssVars () {
        return{
            '--color': this.theme_color.main,
        }
    }
  }

}
</script>

<style scoped lang="scss">

    .button {
      display: inline-block;
      border-radius: 30px;
      background-color: var(--color);
      border: none;
      color: #FFFFFF;
      text-align: center;
      font-size: 1em;
      padding: 10px 10px;
      min-width: 200px;
      transition: all 0.5s;
      cursor: pointer;
      margin: 5px;
    }

    .button span {
      cursor: pointer;
      display: inline-block;
      position: relative;
      transition: 0.5s;
    }

    .button span:after {
      content: '\00bb';
      position: absolute;
      opacity: 0;
      top: 0;
      right: -20px;
      transition: 0.5s;
    }

    .button:hover span {
      padding-right: 25px;
    }

    .button:hover span:after {
      opacity: 1;
      right: 0;
    }

</style>
