<template>
    <div :style="cssVars">

    <div class="banner">
            <div class="row">
                <div class="col-1 extra-left-banner" ></div>
                <div class="col-1 left-banner" ></div>
                <div class="col-8 middle-banner">
                    <h1>{{ title }}</h1>
                    <p><i>{{ subtitle }}</i></p>
                </div>
                <div class="col-2 right-banner" ></div>
            </div>
        </div>
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
        color: #FFFFFF;
        padding: 20px 10px 10px 10px;
        height: 150px;
        margin-bottom: 10px;
    }
    .extra-left-banner{
        background: var(--color-secondary);
    }
    .left-banner{
        background:    linear-gradient(to bottom left,transparent 50%, var(--color-secondary) 50.1%)
        left -1px top 0
        /30% 100%
        no-repeat,
        var(--color-main);
    }

    .right-banner {
            background: var(--color-main);
    }
    .middle-banner{
        background: var(--color-main);
    }

    p {
        font-size: 1.2em;
    }

</style>
