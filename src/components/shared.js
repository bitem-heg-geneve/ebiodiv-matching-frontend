export default {
  filterThis(settings, document){

    var status = true;
    var user_selection = settings.user_selection
    var filters = settings.filters

    // Define facets allowing multiple values
    var multi = []
    for (const filter_nb in filters){
        if (settings.filters[filter_nb].multi === true){
            multi.push(settings.filters[filter_nb].short)
        }
    }

    // Filter documents
    for (const key in user_selection) {

        // If the document is not already rejected
        if (status){

             // If date
            if (key == "date") {

                // Retrieve minmax value chosen by the user
                var minmax = user_selection[key]

                // Check if there is a minmax
                if (minmax.length > 0){

                    // Check if the document must be filtered out
                    for (let f=0; f<document.processed_facets[key].length; f++){
                        if (document.processed_facets[key][f] < minmax[0] || document.processed_facets[key][f] > minmax[1]){
                            status = false;
                            break;
                        }
                    }
                }

            }

            // If facet with multiple values
            else if (multi.includes(key)){

                let list = user_selection[key]

                // If there is at least one value selected
                if (list.length > 0){

                    // The document is filtered out except if one value match
                    thisStatus = false;

                    for (let i=0; i<list.length; i++){

                        for (let f=0; f<document.processed_facets[key].length; f++){
                            if (document.processed_facets[key][f] == list[i]){
                                thisStatus = true;
                                break;
                            }
                        }

                    }

                    // If no value matched, reject the document
                    if (!thisStatus){
                        status = false;
                        break;
                    }

                }

            }

            // If facet with one single value
            else {

                var list = user_selection[key]

                for (let i=0; i<list.length; i++){

                    // The document is filtered out except if all value match
                    var thisStatus = false;

                    for (let f=0; f<document.processed_facets[key].length; f++){
                        if (document.processed_facets[key][f] == list[i]){
                            thisStatus = true;
                        }
                    }

                    if (!thisStatus){
                        status = false
                        break;
                    }
                }

            }

        }

    }

     return status;

  },
}
