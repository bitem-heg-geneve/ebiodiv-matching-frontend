/*
  use "a == null" instead of "a === null" to actually check null and undefined
*/
import { JaroWinkler } from 'string-metric';

const RE_NOT_ALPHANUM = new RegExp('[^A-Z0-9]+', 'i')

function deep_copy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function normalize_str(value) {
    return (value == null) ? "" : value.trim();
}

function normalize_str_alphanum(value) {
    /*
     * "I.42891-001" and "I 42891 - 001" becomes "I42891001" (without spaces).
     * "KS.43690" and "KS46553" becomes "KS46553" (occurrences 1100114000 and 3066982498)
       Drawback: "KS13" and "40.KS,13.KS" are going to match in get_score_string_exact_or_include
    */
    value = normalize_str(value).toUpperCase()
    // replaceAll requires node>15
    let old_value
    do {
        old_value = value
        value = value.replace(RE_NOT_ALPHANUM, "")
    } while (value != old_value)
    return value
}

function normalize_str_or_null(value) {
    return (value == null) ? null : value.trim()
}

function normalize_int(value) {
    // form https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#a_stricter_parse_function
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
        return Number(value)
    } else {
        return null
    }
}

function normalize_yearmonthday(year, month, day) {
    year = (year != null) ? Number(year) : null; /* check year for null or undefined */
    month = (year !== null) && (month != null) ? Number(month) : null; /* check month for null or undefined */
    day = (year !== null) && (month !== null) && (day != null) ? Number(day) : null; /* check day for null or undefined */
    return [year, month, day]
}

function normalize_latlon(lat, long) {
    if (lat == null && long == null) {
        return [null, null]
    }
    lat = Number(lat);
    long = Number(long);
    if ((lat == 0 && long == 0) || (lat == 360 && long == 360)) {
        return [null, null]
    }
    return [lat, long]
}

function normalize_recordedbyids(recordedbyids) {
    /* 
      recordedbyids stores a list of object with key & value properties
      this function select only the values 
    */
    if (!recordedbyids) {
        return [];
    }
    return recordedbyids.map(record => record.value);
}

function get_score_string_jw(subject_value, related_value) {
    if (!subject_value || !related_value) {
        return null;
    }
    return 1 - (new JaroWinkler().distance(subject_value, related_value));
}

function get_score_string_jw_log(subject_value, related_value) {
    return get_score_string_jw(subject_value, related_value);
}

function get_score_string_exact(subject_value, related_value) {
    if (!subject_value || !related_value) {
        return null;
    }
    return related_value.toUpperCase() == subject_value.toUpperCase() ? 1.0 : 0.0
}

function get_score_string_exact_or_include(subject_value, related_value) {
    /*
    occurrence 1804360418: catalog number = "CMNA 2015-0001"
    occurrence 2871638302: catalog number = "CMNA 2015-0001, CMNA 2015-0004, CMNA 2015-0011, CMNA 2015-0015, CMNA 2015-0017"

    the values are normalized as (by normalize_str_alphanum):
    "CMNA 2015 0001"
    and "CMNA 2015 0001 CMNA 2015 0004 CMNA 2015 0011 CMNA 2015 0015 CMNA 2015 0017"

    this scoring function returns 0.8 for these two occurrences.

    Note: in case of "RUSI 6139 (previously ORI 1482 (erroneously listed as ORI 1485 in the RUSI database ))"
    and "ORI 1485" the score is going to be 0.8 too.
    */
    if (!subject_value || !related_value) {
        return null;
    }
    subject_value = subject_value.toUpperCase();
    related_value = related_value.toUpperCase();
    if (subject_value === related_value) {
        return 1.0
    }
    if (subject_value.indexOf(related_value) !== -1 || related_value.indexOf(subject_value) !== -1) {
        return 0.8
    }
    return 0.0
}

function get_score_numeric(subject_value, related_value) {
    if (!subject_value || !related_value) {
        return null;
    }
    const abs_max_value = Math.abs(subject_value, related_value)
    return 1 - (Math.abs(related_value - subject_value) / abs_max_value)
}

function get_score_elevation(subject_value, related_value) {
    if (!subject_value || !related_value) {
        return null;
    }
    const diff = Math.abs(subject_value - related_value);
    return (6-Math.min(6, Math.log(diff+1)))/6;
}


function get_score_recordedbyids(subject_value, related_value) {
    /*
    If at least one identifier match between subject_value and related_value, then the score is 1 otherwise the score 0
    */
    return subject_value.findIndex(n => related_value.indexOf(n) !== -1) !== -1 ? 1 : 0;
}


function get_occurrence_date(occ) {
    /*
    Return the number of day since 1/1/0.
    * If the month is not defined then it is replaced by 6
    * If the day is not defnied then it is replaced by 15
    */
    if (!occ.year) {
        return null;
    }
    // unix timestamp (milliseconds from 1/1/1970)
    const timestamp = new Date(occ.year, occ.month || 6, occ.day || 15).getTime();
    // return the number of days from 1/1/1970
    return timestamp / (24 * 3600 * 1000);
}

function get_score_yearmonthday(subject_occ, related_occ) {
    /*
    The current scoring takes into account the date difference, nothing more.
    350 in math.exp(...) is adjusted to have:
    * a 1 day distance returns a score of 0.90
    * a 7 days distance returns a score of 0.5
    * a 15 days distance returns a score of 0.22

    It may require some adjustments after a review of confirmed matched occurrences.

    Possible errors (ignored in this implementation):
    * A typo about "22/5/2022" can transform in "2/5/2022" or "22/8/2022" or "22/5/2012".
    * A date format misunderstanding can transform in "2/5/2022" to "5/2/2022".
    * If the day is missing "22/5/2022" becomes "5/2022". The current scoring seen "5/2022" as "1/5/2022".
    */
    const subject_date = get_occurrence_date(subject_occ);
    const related_date = get_occurrence_date(related_occ);
    if (!subject_date || !related_date) {
        return null;
    }
    return Math.exp(-Math.abs(subject_date - related_date) / 10)
}

function get_score_latlon(subject_occ, related_occ) {
    /* 
     * use the Haversine formula
     * https://en.wikipedia.org/wiki/Haversine_formula
     */
    let [lat_1, lng_1] = [subject_occ.decimalLatitude, subject_occ.decimalLongitude]
    let [lat_2, lng_2] = [related_occ.decimalLatitude, related_occ.decimalLongitude]

    if (lat_1 == null || lng_1 == null || lat_2 == null || lng_2 == null) {
        return null;
    }
    try {
        // convert degree to radian
        [lng_1, lat_1, lng_2, lat_2] = [lng_1, lat_1, lng_2, lat_2].map(d => d * (Math.PI / 180))
        //
        const d_lat = lat_2 - lat_1
        const d_lng = lng_2 - lng_1
        const h = Math.sin(d_lat / 2) ** 2 + Math.cos(lat_1) * Math.cos(lat_2) * Math.sin(d_lng / 2) ** 2
        /*
         * not used here : distance_in_kilometer = distance * 6378.0 * 2 # diameter of Earth
         * math.asin(math.sqrt(h)) as an alternative form using math.atan2 which might
           be better when the arc cross a pole.
        */
        const distance = Math.asin(Math.sqrt(h))
        return Math.exp(-100 * distance)
    } catch (e) {
        return null;
    }
}

function get_collectionCode(occ) {
    if (occ['basisOfRecord'] == "MATERIAL_CITATION") {
        return occ['institutionCode'];
    }
    return occ['collectionCode'];
}

function get_institutionCode(occ) {
    if (occ['basisOfRecord'] == "MATERIAL_CITATION") {
        return occ['collectionCode'];
    }
    return occ['institutionCode'];
}

class FieldDescription {

    constructor(field_name, weight, normalize_function, get_score_function, get_value=null) {
        this.field_name = field_name;
        this.weight = weight;
        this.normalize_function = normalize_function;
        this.get_score_function = get_score_function;
        if (get_value === null) {
            get_value = (occ) => occ[this.field_name];
        }
        this.get_value = get_value;
    }

    /**
     * normalize some fields of occurrence.
     * @param {Object} occurrence is not changed.
     * @returns {Object} object with the normalized fields.
     * 
     * This allows to swap two fields from an occurrence in the normalized ocurrence without override issue.
     * 
     * If the occurrence parameter is updated (as it was in the previous version):
     * * The normalize method of a first FiedDescription overrides the "collectionCode" field using "institutionCode"
     * * The normalize method of a second FiedDescription overrides the "institutionCode" field using "collectionCode".
     *   However "collectionCode" was overrides by the "institutionCode" just before.
     *   In the end, the "collectionCode" is lost.
     * 
     * Usage exemple: 
     * ```
     * const occurrence = {key: 42, typeStatus: 'dummy', institutionCode: 'Lipsum', familly: 'Apis'};
     * const fd = new FieldDescription("typeStatus", 2, normalize_str, get_score_string_exact);
     * const normalized_fields = fd.normalize(occurrence);
     * normalized_fields === {typeStatus: 'dummy'} // normalized_fields contains only one value
     * ```
     * 
     * In MultiFieldsDescription, the normalize method returns multiple normalized fields.
     */
    normalize(occurrence) {
        return {
            [this.field_name]: this.normalize_function(this.get_value(occurrence))
        }
    }

    get_score(subject_occ, related_occ) {
        return this.get_score_function(this.get_value(subject_occ), this.get_value(related_occ))
    }

    get key() {
        return this.field_name
    }
}

class MultiFieldsDescription extends FieldDescription {

    normalize(occurrence) {
        const values = this.field_name.map(fname => occurrence[fname]);
        const normalized_values = this.normalize_function(...values);
        const output = {}
        for (const i in this.field_name) {
            output[this.field_name[i]] = normalized_values[i];
        }
        return output;
    }

    get_score(subject_occ, related_occ) {
        return this.get_score_function(subject_occ, related_occ)
    }

    get key() {
        return this.field_name[0]
    }
}

export default new class Scoring {

    /**
     * List of field to compute the score between two occurrences.
     * 
     * Do note that this must synchronized with store/index.js:
     * collectionCode and institutionCode might be swapped.
     */
    static FIELDS = [
        new FieldDescription("typeStatus", 2, normalize_str, get_score_string_exact),
        new FieldDescription("basisOfRecord", 2, normalize_str, get_score_string_exact),
        new FieldDescription("basisOfRecord", 2, normalize_str, get_score_string_exact),
        new FieldDescription("recordedBy", 2, normalize_str, get_score_string_jw),
        new FieldDescription("recordNumber", 2, normalize_str, get_score_string_exact),
        new FieldDescription("recordedByIDs", 2, normalize_recordedbyids, get_score_recordedbyids),
        new FieldDescription("collectionCode", 2, normalize_str_alphanum, get_score_string_exact_or_include, get_collectionCode),
        new FieldDescription("institutionCode", 2, normalize_str_alphanum, get_score_string_exact_or_include, get_institutionCode),
        new FieldDescription("catalogNumber", 2, normalize_str_alphanum, get_score_string_exact_or_include),
        new FieldDescription("individualCount", 1, normalize_int, get_score_numeric),
        new FieldDescription("family", 1, normalize_str, get_score_string_jw),
        new FieldDescription("genus", 1, normalize_str, get_score_string_jw),
        new FieldDescription("specificEpithet", 1, normalize_str, get_score_string_jw),
        new FieldDescription("country", 1, normalize_str, get_score_string_exact),  // the value is normalized by GBIF, there is no typo
        new FieldDescription("city", 1, normalize_str_or_null, get_score_string_jw),
        new FieldDescription("locality", 0.5, normalize_str_or_null, get_score_string_jw_log),
        new FieldDescription("elevation", 0.5, normalize_int, get_score_elevation),
        new MultiFieldsDescription(["year", "month", "day"], 1, normalize_yearmonthday, get_score_yearmonthday),
        new MultiFieldsDescription(["decimalLatitude", "decimalLongitude"], 2, normalize_latlon, get_score_latlon),
    ]

    constructor() {
        this.occurrence_cache = {}
        this.score_cache = {}
    }

    get_scores(occurrences1, occurrences2) {
        const cache_key = occurrences1.key > occurrences2.key ? occurrences1.key + '_' + occurrences2.key : occurrences2.key + '_' + occurrences1.key;
        if (this.score_cache[cache_key] != null) {
            return this.score_cache[cache_key];
        }
        // Purge cache if there are many entries
        if (this.score_cache.length > 20000) {
            this.score_cache = {}
        }
        // compute the scores
        const o1 = this.#get_normalized_occurrence(occurrences1);
        const o2 = this.#get_normalized_occurrence(occurrences2);
        const scores = Scoring.#get_scores_for_normalized_occurrences(o1, o2);
        this.score_cache[cache_key] = scores;
        return scores;
    }

    #get_normalized_occurrence(occurrence) {
        if (this.occurrence_cache[occurrence.key] != null) {
            return this.occurrence_cache[occurrence.key];
        }
        // Purge cache if there are many entries
        if (this.occurrence_cache.length > 20000) {
            this.occurrence_cache = {}
        }
        // normalize the occurrence
        let normalized_occurrence = deep_copy(occurrence);
        for (const field of Scoring.FIELDS) {
            normalized_occurrence = { ...normalized_occurrence, ...field.normalize(occurrence) };
        }
        this.occurrence_cache[occurrence.key] = normalized_occurrence;
        return occurrence;
    }

    static #get_scores_for_normalized_occurrences(subject_occ, related_occ) {
        let scores = {};
        let total = 0;
        let count = 0;
        for (const field of Scoring.FIELDS) {
            const field_score = field.get_score(subject_occ, related_occ)
            scores[field.key] = field_score;
            if (field_score !== null) {
                total += field.weight * field_score;
                count += field.weight;
            }
        }
        scores['$global'] = (total / count).toPrecision(2);
        return scores;
    }
}
