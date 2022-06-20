<template>
    <div  class="banner" :style="cssVars">

    <div class="row">
        <div class="col-12">
            <div class="float-start position-absolute">
                <img src="../assets/images/logo_ebiodiv_small.png" class="medium-img"/>
            </div>
            <h1>{{ title }}</h1>
            <p><i>{{ subtitle }}</i></p>
        </div>

        </div>

    </div>

</template>


<script>
import { mapState } from 'vuex'

    export default {
      name: 'BannerComponent',
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
        padding: 10px 20px 10px 20px;
        height: 150px;
        margin-bottom: 10px;


    }

    .row {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    p {
        font-size: 1.2em;
    }

    .medium-img {
        height: 120px;
    }

</style>
