<template>

    <div :style="cssVars">

        <slot name="default-list"></slot>

        <div v-show="expanded">
            <slot name="extra-list"></slot>
        </div>

        <div v-show="items_length > visible_length" class="extra-link-container">
            <span class="extra-link" v-show="!expanded" @click="expanded = !expanded">[+] {{ message_more }}</span>
            <span class="extra-link" v-show="expanded" @click="expanded = !expanded">[-] {{ message_less }}</span>
        </div>

    </div>

</template>

<script>
import { mapState } from 'vuex'

    export default {
      name: 'PanelMoreLess',
      props: {
        visible_length: {
            type: Number,
            required: true,
            default: 5
        },
        items_length: {
            type: Number,
            required: true
        },
        message_more: {
            type: String,
            default: "More"
        },
        message_less: {
            type: String,
            default: "Less"
        },
      },
     data() {
        return {
            expanded: false,
        };
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

    .extra-link-container {
        margin-bottom: 10px;
    }

    .extra-link {
        font-size: 0.8em;
        font-style: italic;
    }

    .extra-link:hover {
        text-decoration: underline;
        color: var(--color);
    }

</style>