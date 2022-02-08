<template>
    <div  class="banner" :style="cssVars">

        <h1>{{ title }}</h1>
        <p><i>{{ subtitle }}</i></p>

    </div>

</template>


<script>
import { mapState } from 'vuex'

    export default {
      name: 'Banner',
      props: {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: true,
            default: ""
        },
      },
      computed: {
            ...mapState(['theme_color']),
            cssVars () {
                return{
                    '--color-main': this.theme_color.main,
                    '--color-secondary': this.theme_color.secondary,
                }
            }
      }
    }

</script>


<style scoped lang="scss">

    .banner{
        background: conic-gradient(at 0% 30%, var(--color-secondary) 10%, var(--color-main) 30%, var(--color-secondary) 50%);
        color: #FFFFFF;
        padding: 20px 10px 10px 10px;
        height: 150px;
        margin-bottom: 10px;
    }

    p {
        font-size: 1.2em;
    }

</style>
