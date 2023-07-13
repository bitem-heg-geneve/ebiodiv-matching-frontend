<template>

    <div>

        <PulseLoader v-if="in_progress" :color="theme_color.main" />

        <div v-if="!in_progress">
            <button @click="openComments()" class="button-table">
                <img src="../assets/images/icon_comment.png"  class="small"/>
            </button>
            <br/>
            {{ comments.length }} comment<span v-if="comments.length > 1">s</span>
        </div>

        <div :class="comments_popup">

            <div class="right-container">
                <button type="button" class="button-close" @click="closeComments()">
                    <img src="../assets/images/icon_close.png"  class="mini"/>
                    Close
                </button>
            </div>

            <h1>Comments</h1>

            <div ref="commentsContainer" class="comments-container">

                    <div :class="comment_class(comment.orcid)" v-for="comment in comments" :key="comment.id">
                        <label for="msg">
                            <b class="orcid-link" @click="goToOrcid(comment.orcid)">{{ comment.userName }}</b>
                        </label> wrote on 
                        {{ new Date(comment.timestamp).toGMTString() }}                        
                         <p>{{ comment.text }}</p>
                    </div>

                    <textarea placeholder="Type a comment" name="msg" required v-model="comment"></textarea>

                    <div class="right-container">
                        <button class="button-validation" type="button" @click="postComment()" :disabled="to_disable">
                            Send
                        </button>
                    </div>

            </div>

        </div>

    </div>

</template>


<script>
import { mapState } from 'vuex'
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
            comments_visibility: false,
            comment: '',
            pending_post: ''
        };
    },
    computed: {
        ...mapState(['theme_color', 'user']),
        cssVars() {
            return {
                '--color': this.theme_color.main,
            }
        },
        comments_popup(){
            return "comments-popup "+this.comments_visibility
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
        loadComment(){
            this.in_progress = true
            this.comments = []
            let response_promise = this.$backend.fetch_comments(this.occurrence_key, this.curation_key)
            response_promise.then(response => {
                    this.comments = response.data.results;
                    this.scrollToBottom();
                    this.in_progress = false
            })
            .catch(error => {
                console.log(error)
                this.in_progress = false
            })
        },
        openComments(){
            this.comments_visibility = true
        },
        closeComments(){
            let close = this.comment.length == 0 || confirm('Are you sure you want to leaving without sending your comment?')
            if (close) {
                this.comments_visibility = false
                this.comment = ""
            }
        },
        postComment(){
            if (this.comment != ""){
                this.pending_comment = this.comment
                this.$emitter.emit('ensureLogin');
            }
        },
        sendComment(){
            this.in_progress = true
            var comment = {"occurrenceKey1": this.occurrence_key, "occurrenceKey2": this.curation_key, "text": this.pending_comment, "orcid": this.user.orcid, "userName": this.user.name};
            let response_promise = this.$backend.post_comment(comment)
            response_promise.then(() => {
                this.comment = ''
                this.loadComment()
            })
            .catch(error => {
                console.log(error)
                this.in_progress = false
            })
        },
        comment_class(orcid){
            var final_class = "comment-container"
            if (orcid == this.user.orcid){
                final_class += " user"
            }
            return final_class
        },
        goToOrcid (orcid) {
            window.open("http://orcid.org/"+orcid);
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.commentsContainer;
                container.scrollTop = container.scrollHeight;
            });
        },
    },
    beforeMount() {
        this.loadComment()
    },
    mounted() {
        this.$emitter.on('logged', () => {
            if (this.pending_comment != undefined && this.pending_comment != '') {
                // save on the Plazi backend
                this.sendComment(this.pending_comment);
                this.pending_comment = '';
                this.$gtag.event('post_comment');
            }
        });
        this.$emitter.on('loginAbort', () => {
            if (this.pending_comment != "") {
                // logingAbort event and this.pendingSave is not empty
                // ==> the user clicked on "Send" but cancel the logged in procedure
                this.pending_comment = '';
                alert('Your comment is not saved');
            }
        });
    },

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
