<template>

    <div>

        <PulseLoader v-if="in_progress" :color="theme_color.main" />

        <div v-if="!in_progress">
            <button @click="openComments" class="button-table">
                <img src="../assets/images/icon_comment.png"  class="small"/>
            </button>
            <br/>
            {{ comments.length }} comment<span v-if="comments.length > 1">s</span>
        </div>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;

export default {
    name: 'CommentElement',
    components: {
        PulseLoader
    },
    props: {
        occurrence_key: {
            type: Number,
            required: true
        },
        curation_key: {
            type: Number,
            required: true
        },
    },
    data() {
        return {
            in_progress: true,
            comments: [],
        };
    },
    computed: {
        ...mapState(['theme_color', 'user', 'comment']),
        cssVars() {
            return {
                '--color': this.theme_color.main,
            }
        },
        to_disable(){
            if (this.comment == ""){
                return true
            }
            else {
                return false
            } 
        }
    },
    methods: {
        ...mapActions([
            'updateCommentSelection', 
        ]),   
        loadComment(){
            this.in_progress = true
            this.comments = []
            let response_promise = this.$backend.fetch_comments(this.occurrence_key, this.curation_key)
            response_promise.then(response => {
                    this.comments = response.data.results;
                    this.in_progress = false
            })
            .catch(error => {
                console.log(error)
                this.in_progress = false
            })
        },
        openComments(){
            this.updateCommentSelection({"occurrence": this.occurrence_key, "curation": this.curation_key, "comments": this.comments})
        },
    },
    beforeMount() {
        this.loadComment()
    },
    watch: {
        "comment.saved": function ()  {
            if(this.comment.saved == this.curation_key){
                this.in_progress = true
                setTimeout(() => {
                    this.loadComment()
                }, 2000);
                
            }
        },
    }
}

</script>


<style scoped lang="scss">

.small {
    width: 30px;
    cursor: pointer
}
.mini {
    width: 15px;
    padding-bottom: 5px;
}
.right-container {
    text-align: right;
    width: 100%
}

.comments-popup {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 90%;
    border: 3px solid #f1f1f1;
    z-index: 9;
    background-color: #fff
}
.comments-popup.true {
  display: block;
}

.comments-container {
    text-align: left;
    margin: 20px;
    padding: 20px;
    height:75%;
    overflow: scroll;
    border: 1px solid #ddd;
    background-color: #eee
}

.comment-container {
    background-color: #ddd;
    border-radius: 5px;
    padding: 5px;
    margin: 10px 0px;
}

.comment-container.user {
    background-color: var(--color);
    color: #fff
}

textarea {
    width: 100%
}

.orcid-link:hover {
    cursor: pointer;
    text-decoration: underline
}


.button-table {
      display: inline-block;
      border-radius:5px;
      background-color: #fff;
      border: none;
      color: #FFFFFF;
      text-align: center;
      padding: 5px 5px;
      cursor: pointer;
    }

.button-table:hover {
    background-color: var(--color);
}

.button-validation {
    display: inline-block;
    border-radius: 5px;
    background-color: var(--color);
    border: none;
    color: #FFFFFF;
    text-align: center;
    padding: 5px 10px;
    cursor: pointer;
    margin: 10px 0 0 0;
    width: 100px;
}

.button-validation:hover {
    background-color: var(--color-secondary);
}

.button-validation:disabled, .button-validation[disabled]{
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
}

.button-validation:disabled, .button-validation[disabled]{
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
}

.button-close{
    background: #fff;
    border: 0px
}

.button-close:hover{
    cursor: pointer;
    background-color:#f2f2f2
}

</style>
