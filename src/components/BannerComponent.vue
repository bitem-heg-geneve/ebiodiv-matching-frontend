<template>
    <div :class="bannerCssClasses" :style="cssVars">
        <div>
            <div class="float-start position-absolute">
                <a :href="baseUrl"><img src="../assets/images/logo_ebiodiv_small.png" class="medium-img" /></a>
            </div>
            <h1>{{ title }}</h1>
            <p><i>{{ subtitle }}</i></p>
        </div>
        <div class="user-login-container">
            <b-nav>
                <b-nav-item href="https://ebiodiv.org/help/" link-classes="ebiodiv_navbar_link" target="_blank"><b-icon-question-circle></b-icon-question-circle> Help</b-nav-item>
                <b-nav-item href="https://ebiodiv.org/" link-classes="ebiodiv_navbar_link" target="_blank"><b-icon-info-circle></b-icon-info-circle> About</b-nav-item>
            </b-nav>
            <UserComponent></UserComponent>
        </div>
    </div>
</template>


<script>
import { mapState } from 'vuex'
import UserComponent from '@/components/UserComponent.vue'

    export default {
      name: 'BannerComponent',
      components: {
        UserComponent,
      },
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
            },
            bannerCssClasses() {
                // return "banner productionBackend";
                return "banner " + process.env.VUE_APP_BACKEND_JSON.replace(".json", "").replace("backend-", "") + "Backend";
            },
            baseUrl() {
                const value = process.env.BASE_URL;
                if (value == "") {
                    return "/";
                }
                return value;
            }
        }
    }

</script>


<style scoped lang="scss">

    .banner{
        background: var(--color-secondary);
        color: #FFFFFF;
        padding: 10px 20px 10px 20px;
        height: 150px;
        margin-bottom: 10px;
    }

    .user-login-container {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        flex-direction: row;
    }
    .banner.productionBackend {
        background: conic-gradient(at 0% 30%, var(--color-secondary) 10%, var(--color-main) 30%, var(--color-secondary) 50%);
    }

    .banner.sandboxBackend {
        background: repeating-linear-gradient(
            -45deg,
            var(--color-main),
            var(--color-main) 15px,
            var(--color-secondary) 15px,
            var(--color-secondary) 30px
        );
    }

    .banner.sandboxBackend:after {
        content: "Sandbox";
        display: block;
        position: absolute;
        right: 1rem;
        top: 7.5rem;
        font-size: 1rem;
    }

    p {
        font-size: 1rem;
    }

    .medium-img {
        height: 120px;
    }

    #app .ebiodiv_navbar_link {
        color: white;
    }

</style>
