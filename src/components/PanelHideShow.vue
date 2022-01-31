<template>

    <div>

        <div class="title">
            <img v-show="!expanded" src="../assets/images/icon_plus.png" alt="[+]" @click="expanded = !expanded" :class="size"/>
            <img v-show="expanded" src="../assets/images/icon_minus.png" alt="[-]" @click="expanded = !expanded" :class="size"/>
            <h2 v-if="size=='medium'"><slot name="title"></slot></h2>
            <h3 v-if="size=='small'"><slot name="title"></slot></h3>
        </div>

        <div v-show="expanded">
            <slot name="content"></slot>
        </div>

  </div>

</template>

<script>

    export default {
      name: 'PanelHideShow',
      props: {
        expanded_init: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: "medium"
        }
      },
      data() {
        return {
            expanded: this.expanded_init,
        };
      }
    }

</script>

<style scoped lang="scss">

    .title {
       display: flex;
       align-items:center;
       padding-top: 10px;
    }

    img {
        margin-right: 10px;
        cursor: pointer;
    }

    .small {
        width: 15px;
    }

    .medium {
        width: 20px;
    }

</style>