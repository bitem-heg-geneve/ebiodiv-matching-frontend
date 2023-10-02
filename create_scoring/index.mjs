/*
 * hack to create scoring.json
 * create the VueJS app with only the store
 * from that, read state.curation_characteristics
 * 
 * Since it requires ES Modules ("import ... from" instead of "const module = require(...)")
 * all files are named ".mjs" and it requires the "--experimental-modules" option like this:
 * node --experimental-modules index.mjs
 * 
 * The script except to run 
 */
import fs from 'fs';
import scoring from "./scoring.mjs";
import store from "./store.mjs";
import Vue from 'vue';
import process from 'process';

function field_items(output_filename) {
    console.log(output_filename);

    let field_descriptions = {}
    for (const fd of scoring.FIELDS) {
        let key = fd.field_name;
        let field_names = fd.field_name;
        const get_score_function_name = fd.get_score_function.name;
        const get_score_function_desc = scoring.F_SCORE_DESC[get_score_function_name];
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

    let app = new Vue({
        store,
    });

    for (const cc of app.$store.state.curation_characteristics) {
        rows.push({
            order: i,
            name: cc.name,
            ...field_descriptions[cc.score]
        });
        i++;
    }
    const content = JSON.stringify(rows, null, "  ");
    fs.writeFileSync('scoring.json', content, err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
    return "Ok"
}

console.log(field_items(process.argv[2]));
