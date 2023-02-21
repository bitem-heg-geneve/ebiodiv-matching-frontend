<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-table
          striped
          hover
          id="fields"
          :items="field_items"
          :fields="fields"
          primary-key="GBIF_fields">
          <template #cell(description)="data">
            <span v-html="data.value"></span>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>
<script>
// @ is an alias to /src
import { mapState } from 'vuex'


export default {
  name: 'HomePage',
  data (){
    return {
      fields: [
        { key: 'order', sortable: true},
        { key: 'name', sortable: true},
        { key: 'GBIF_fields', sortable: true },
        { key: 'weight', sortable: true },
        { key: 'description', sortable: true }
      ]
    };
  },
  computed: {
    ...mapState(['curation_characteristics']),
    field_items() {
      let field_descriptions = {}
      for (const fd of this.$scoring.FIELDS) {
        let key = fd.field_name;
        let field_names = fd.field_name;
        const get_score_function_name = fd.get_score_function.name;
        const get_score_function_desc = this.$scoring.F_SCORE_DESC[get_score_function_name];
        if (Array.isArray(field_names)) {
          key = field_names[0];
          field_names = field_names.join(", ");
        }
        field_descriptions[key] = {
          GBIF_fields: field_names,
          weight: fd.weight,
          description: get_score_function_desc,
        };
      }

      let rows = [];
      let i = 1;
      for (const cc of this.curation_characteristics) {
        rows.push({
          order: i,
          name: cc.name,
          ...field_descriptions[cc.score]
        });
        i++;
      }
      return rows;
    },
  }
}
</script>

<style scoped lang="scss">
.container-fluid {
  padding-right: 0px;
  padding-left: 0px;
  margin-right: auto;
  margin-left: auto;
}

.row {
  margin-left: 0;
  margin-right: 0;
}

.col {
  padding: 0;
}

#fields {
  text-align: left;
}
</style>
