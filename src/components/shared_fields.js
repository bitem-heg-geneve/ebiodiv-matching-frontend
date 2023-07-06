const STATUS_CODE_LABELS = {
        "DONE": "Done",
        "PNDG": "Pending",
        "UDCB": "Undecidable"        
}

// values from
// https://github.com/gbif/download-query-tools/blob/33562b5f0486fe032a1d274987edd6682415660d/src/main/resources/org/gbif/occurrence/query/filter.properties#L130-L141
// https://github.com/gbif/gbif-web/blob/be5c9b54d59da14c26cc43ee7cd573c2d687b27d/packages/react-components/locales/translations/en/enums/basisOfRecord.json
const BASIS_OF_RECORD_LABELS = {
    PRESERVED_SPECIMEN: "Specimen",
    FOSSIL_SPECIMEN: "Fossil",
    LIVING_SPECIMEN: "Living Specimen",
    OBSERVATION: "Observation",
    HUMAN_OBSERVATION: "Human Observation",
    MACHINE_OBSERVATION: "Machine Observation",
    LITERATURE: "Literature Occurrence",
    MATERIAL_SAMPLE: "Material sample",
    OCCURRENCE: "Occurrence evidence",
    MATERIAL_CITATION: "Material citation",
    UNKNOWN: "Unknown evidence",
}

// https://github.com/gbif/gbif-web/blob/be5c9b54d59da14c26cc43ee7cd573c2d687b27d/packages/react-components/locales/translations/en/enums/typeStatus.json
const TYPE_STATUS_LABELS = {
    TYPE: "Type",
    TYPE_SPECIES: "Type species",
    TYPE_GENUS: "Type genus",
    ALLOLECTOTYPE: "Allolectotype",
    ALLONEOTYPE: "Alloneotype",
    ALLOTYPE: "Allotype",
    COTYPE: "Cotype",
    EPITYPE: "Epitype",
    EXEPITYPE: "Ex-epitype",
    EXHOLOTYPE: "Ex-holotype",
    EXISOTYPE: "Ex-isotype",
    EXLECTOTYPE: "Ex-lectotype",
    EXNEOTYPE: "Ex-neotype",
    EXPARATYPE: "Ex-paratype",
    EXSYNTYPE: "Ex-syntype",
    EXTYPE: "Ex-type",
    HAPANTOTYPE: "Hapantotype",
    HOLOTYPE: "Holotype",
    ICONOTYPE: "Iconotype",
    ISOLECTOTYPE: "Isolectotype",
    ISONEOTYPE: "Isoneotype",
    ISOSYNTYPE: "Isosyntype",
    ISOTYPE: "Isotype",
    LECTOTYPE: "Lectotype",
    NEOTYPE: "Neotype",
    PARALECTOTYPE: "Paralectotype",
    PARANEOTYPE: "Paraneotype",
    PARATYPE: "Paratype",
    PLASTOHOLOTYPE: "Plastoholotype",
    PLASTOISOTYPE: "Plastoisotype",
    PLASTOLECTOTYPE: "Plastolectotype",
    PLASTONEOTYPE: "Plastoneotype",
    PLASTOPARATYPE: "Plastoparatype",
    PLASTOSYNTYPE: "Plastosyntype",
    PLASTOTYPE: "Plastotype",
    SECONDARYTYPE: "Secondary type",
    SUPPLEMENTARYTYPE: "Supplementary type",
    SYNTYPE: "Syntype",
    TOPOTYPE: "Topotype",
    ORIGINALMATERIAL: "Original material",
    NOTATYPE: "Not a type"
}

/* always round the number to one decimal */
const LATLON_FORMAT = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
});

export default {
    mixin_fields: {
        methods: {
            display_value_decimalLatitude_decimalLongitude(decimalLatitude, decimalLongitude) {
                // Both values are defined 
                if (decimalLatitude != null & decimalLongitude != null) {
                    /* 
                        Math.sign(x) is between -1 and 1 (-1 for negative number, 0 for zero, 1 for positive number)
                        1 + Math.sign(x) is between 0 and 2 (0 for negative number, 1 for zero, 2 for positive number)
                        ["negative", "zero", "position"][1 + Math.sign(x)] returns 
                            * "negative" for negative number
                            * "zero" for zero
                            * "positive" for positive number
                     */
                    const lat_suffix = ["S", "", "N"][1 + Math.sign(decimalLatitude)];
                    const lon_suffix = ["W", "", "E"][1 + Math.sign(decimalLongitude)];
                    return LATLON_FORMAT.format(decimalLatitude) + lat_suffix + ", " + LATLON_FORMAT.format(decimalLongitude) + lon_suffix;
                }
                // Only one value is defined (should not happen)
                if ((decimalLatitude == null || decimalLongitude == null) && (decimalLatitude != null || decimalLongitude != null)) {
                    return decimalLatitude + ", " + decimalLongitude;
                }
                // Undefined
                return "";
            },
            display_value_elevation_depth(elevation, depth) {
                // Only elevation
                if (elevation != null && depth == null) {
                    return elevation;
                }
                // Only depth
                if (elevation == null && depth != null) {
                    return -depth;
                }
                // Both
                if (elevation != null && depth != null) {
                    return elevation + "/" + (-depth);
                }
                // None
                return "";
            },
            display_value_day_month_year(day, month, year) {
                const values_without_null = [day, month, year].filter(v => v != null);
                return values_without_null.join("/");
            },
            display_value_statusCode(statusCode) {
                let value = STATUS_CODE_LABELS[statusCode];
                if (value != null) {
                    return value;
                }
                return statusCode;
            },
            display_value_typeStatus(typeStatus) {
                let value = TYPE_STATUS_LABELS[typeStatus];
                if (value != null) {
                    return value;
                }
                return typeStatus;
            },
            display_value_basisOfRecord(basisOfRecord) {
                let value = BASIS_OF_RECORD_LABELS[basisOfRecord];
                if (value != null) {
                    return value;
                }
                return basisOfRecord;
            },
            display_content(object, keys) {
                const values = keys.map(k => object[k]);
                // if keys = ["elevation, "depth"]
                // then method_name = "display_value_elevation_depth"  
                const method_name = 'display_value_' + keys.join('_');
                if (method_name in this) {
                    // the method exist: call it
                    return this[method_name](...values);
                }
                // by default: concat all the values separated by "/"
                return values.filter(v => v != null).join("/");
            },
        }
    },
}
