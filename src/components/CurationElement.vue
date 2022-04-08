<template>

    <tbody>

        <tr >
            <td>{{ curation.key }}</td>
            <template v-if="hasScore(curation)">
                <td v-for="char in curation_characteristics" :key="char.short+'sp-td'" :class="cellColor(curation.$score[char.short])" :title="curation[char.short]+'\n'+occurrences_selection[get_occurrence_json][char.short]">
                    {{ normalizeValue(curation.$score[char.short]) }}
                </td>
            </template>
            <template v-else>
                <td v-for="char in curation_characteristics" :key="char.short+'sp-td'" :title="curation[char.short]+'\n'+occurrences_selection[get_occurrence_json][char.short]">
                    unknown
                </td>
            </template>
            <td>
                <input type="checkbox" :checked="is_yes_selected" @click="storeValidation('yes')"/>
            </td>
            <td>
                <input type="checkbox" :checked="is_no_selected" @click="storeValidation('no')"/>
            </td>
            <td>
                <button @click="toggle()" class="button-table">
                    <img v-if="!expanded" src="../assets/images/icon_expand.png"  class="mini"/>
                    <img v-if="expanded" src="../assets/images/icon_reduce.png"  class="mini"/>
                </button>
            </td>
        </tr>

        <tr class="expanded" v-if="expanded">
            <td colspan="19">
                <table>

                    <tr>
                        <th></th>
                        <th>{{ get_occurrence_name }}</th>
                        <th>{{ get_curation_name }}</th>
                    </tr>

                    <template v-for="char in curation_characteristics">
                        <tr v-if="char.value" :key="char.short+'sp-td-exp'">
                            <td>{{ char.name }}</td>
                            <template v-if="hasScore(curation)">
                                <td :class="cellColor(curation.$score[char.short])">{{ occurrences_selection[get_occurrence_json][char.short] }}</td>
                                <td :class="cellColor(curation.$score[char.short])">{{ curation[char.short] }}</td>
                            </template>
                            <template v-else>
                                <td>{{ occurrences_selection[get_occurrence_json][char.short] }}</td>
                                <td>{{ curation[char.short] }}</td>
                            </template>
                        </tr>
                    </template>
                    <tr>
                        <td>GBIF</td>
                        <td><a :href="'https://www.gbif.org/occurrence/'+occurrences_selection[get_occurrence_json]['key']" target="_blank">See in GBIF</a></td>
                        <td><a :href="'https://www.gbif.org/occurrence/'+curation['key']" target="_blank">See in GBIF</a></td>
                    </tr>

                </table>
            </td>
        </tr>

    </tbody>

</template>


<script>
import { mapState } from 'vuex'

    export default {
      name: 'CurationElement',
      components: {
      },
      props: {
        curation: {
            type: Object,
            required: true
        },
        status: {
            type: String,
            required: true
        },
      },
      data() {
        return {
            expanded: false,
            checked_yes: null,
            checked_no: null
        };
      },
      computed: {
        ...mapState(['theme_color', 'occurrences_selection', 'matching', 'curation_characteristics', 'fields', 'format_selection']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        get_occurrence_name(){
            return this.fields[this.format_selection].format_occurrence.name
        },
        get_occurrence_json(){
            return this.fields[this.format_selection].format_occurrence.json
        },
        get_curation_name(){
            return this.fields[this.format_selection].format_curation.name
        },
        is_yes_selected(){
           if (this.checked_yes == true){
                return true
            }
            else {
                return false
            }
        },
        is_no_selected(){
            if (this.checked_no == true){
                return true
            }
            else {
                return false
            }
        },
      },
      methods:{
        normalizeValue(value){
                if (value == null){
                    return "NA"
                }
                return value
           },
        toggle (){
            this.expanded = !this.expanded
        },
        cellColor(value){
                var class_name = "cell-color-na"
                if (value == null){
                    class_name = "cell-color-na"
                }
                else if (value >= 0.8){
                    class_name = "cell-color-good"
                }
                else if (value >= 0.5){
                    class_name = "cell-color-medium"
                }
                else if (value >= 0.0){
                    class_name = "cell-color-bad"
                }
                return class_name
        },
        hasScore(curation){
                if ("$score" in curation){
                    return true;
                }
                else {
                    return false;
                }
        },
        storeValidation(choice){
            if (choice == "yes"){
                this.checked_yes = !this.checked_yes
                if (this.checked_yes){
                    this.checked_no = false

                }
            }
            else if (choice == "no"){
                this.checked_no = !this.checked_no
                if (this.checked_no){
                    this.checked_yes = false
                }
            }
            var status = "unknown"
            if (this.checked_yes){
                status = "true"
            }
            else if (this.checked_no){
                status = "false"
            }
            this.$emit('clicked', {"id": this.curation.key, "status": status})
        }
      },
      mounted: function () {
            if (this.status == "yes"){
                this.checked_yes = true
            }
            else if (this.status == "no"){
                this.checked_no = true
            }
      }
    }

</script>


<style scoped lang="scss">

    td, th {
      border: 1px solid #ddd;
      padding: 6px;
      text-align: center;
    }

    th {
      padding-top: 6px;
      padding-bottom: 6px;
      background-color: #AAA;
      color: white;
    }
    .clickable-th:hover {
       cursor: pointer;
       background-color: var(--color);
    }

    .cell-color-good {
        background-color: #D7F2D6;
    }
    .cell-color-medium {
        background-color: #FBECD7;
    }
    .cell-color-bad {
        background-color: #F0D3D4;
    }
    .cell-color-na {
        background-color: #eee;
    }

    .expanded {
        background-color: #eee;
    }

    .expanded tr {
        background-color: #fff;
    }

    .expanded table {
        width: 70%;
        margin: 20px auto;
        font-size: 1em;
    }

    .secondary {
        background-color: #AAA;
    }

    .button-table {
      display: inline-block;
      border-radius:5px;
      background-color: #AAA;
      border: none;
      color: #FFFFFF;
      text-align: center;
      padding: 5px 5px;
      cursor: pointer;
    }

    .button-table:hover {
      background-color: var(--color);
    }

    .mini {
        width: 15px;
    }

</style>