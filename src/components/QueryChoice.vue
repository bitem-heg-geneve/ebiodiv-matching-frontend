<template>

    <div class="component-container query-container">

        <h2>Search</h2>

        <div class="details">

            <label>Enter a search term (e.g. an institution, a country, a taxon, etc.): </label><br/>
            <input type="text" required v-model.trim="user_query.pre_q"/>
            <br/><br/>

        </div>

    </div>

</template>


<script>
import { mapState } from 'vuex'

    export default {
      name: 'QueryChoice',
      components: {
      },
      computed: {
        ...mapState(['user_query']),
      },
    }

</script>


<style scoped lang="scss">

    .details {
        text-align: justify;
    }

    label {
        font-size: 0.9rem;
        font-weight: bold;
        padding-right: 5px;
    }

    input[type="text"] {
        width: 100%;
        padding-left: 50px;
        background: url("~@/assets/images/icon_search.png") #fff no-repeat 5px 5px;
        background-size: 30px;
        height: 40px;
        border: 1px solid grey;
        border-radius: 5px;
        font-size: 0.9rem;
    }

</style>
