<template>

    <div :style="cssVars" class="dropdown-container">

      <div class="dropdown">
        <p>Sort by <span class="selected-option">{{ selected_name }}</span></p>
        <div class="dropdown-content">
          <p v-for="option in options" :key="'sortby_'+option.field" @click="updateSort(option.field)">{{ option.title }}</p>
        </div>
      </div>

    </div>

</template>


<script>
import { mapState } from 'vuex'

    export default {
      name: 'SortDropdown',
      props: {
        selected: {
          type: String,
          required: true
        },
        options: {
            type: Array,
            required: true
        },
        updateSort: {
            type: Function,
            required: true
        },
      },
      computed: {
        ...mapState([
          'theme_color',
        ]),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        selected_name () {
            for (var i=0; i<this.options.length; i++){
              if (this.options[i].field == this.selected){
                return this.options[i].title
              }
            }
            return this.selected
          }
      },
      methods:{
        
      },
    }

</script>


<style scoped lang="scss">

.selected-option {
  color: var(--color);
}



.dropdown {
  padding-top: 20px;
  position: relative;
  display: inline-block;
}

.dropdown p {
  margin: 0;
  padding: 0 0 10px 0;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content p {
  color: black;
  padding: 5px 10px;
  margin: 0;
  text-decoration: none;
  display: block;
  text-align: left;
  
}

.dropdown-content p:hover {
  cursor: pointer;
  background-color: #ddd;
  color: var(--color);
}

.dropdown:hover .dropdown-content {display: block;}


</style>
