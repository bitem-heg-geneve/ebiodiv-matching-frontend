<template>
  <div v-show="comments_visibility" class="custom-dialog" :style="dialogStyle" @mousedown="startDrag">
    <div class="handle">

        <div class="right-container">
            <button type="button" class="button-close" @click="closeComments()">
                <img src="../assets/images/icon_close.png"  class="mini"/>
                Close
            </button>
        </div>

        <h2>Comments about {{ occurrence_key }} and {{ curation_key }}</h2>

        <div ref="commentsContainer" class="comments-container"  :class="{ 'scrollable': isScrollable }">

                <div :class="comment_class(comment.orcid)" v-for="comment in comments" :key="comment.id">
                    <label for="msg">
                        <b class="orcid-link" @click="goToOrcid(comment.orcid)">{{ comment.userName }}</b>
                    </label> wrote on 
                    {{ new Date(comment.timestamp).toGMTString() }}                        
                        <p>{{ comment.text }}</p>
                </div>

                <textarea placeholder="Type a comment" name="msg" required v-model="comment_txt"></textarea>

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
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      initialX: ((window.innerWidth-500)/ 2),
      initialY: 200,
      comments_visibility: false,
        comment_txt: '',
        pending_post: '',
        comments: [],
        curation_key: null,
        occurrence_key: null,
        isScrollable: false,
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
        },
    dialogStyle() {
      return {
        display: this.comments_visibility ? 'block' : 'none',
        top: this.initialY + 'px',
        left: this.initialX + 'px',
      };
    },
  },
  methods: {
    ...mapActions([
            'updateCommentSelection', 
            'updateCommentSaved'
        ]),  
        openComments(){
            this.comments_visibility = true
            this.scrollToBottom()
        },
        openNewComments(values){
            this.updateCommentSaved(null)
            this.comments = values.comments
            this.curation_key = values.curation
            this.occurrence_key = values.occurrence
            this.openComments()
        },
        closeComments(new_comment){
            let close = this.comment_txt.length == 0 || confirm('Are you sure you want to leaving without sending your comment?')
            if (close) {
                this.comments_visibility = false
                this.comment_txt = ""
                this.updateCommentSelection(null)
                this.curation_key = null
                if (new_comment){
                    this.openNewComments(new_comment)
                }
            }
        },
        postComment(){
            if (this.comment != ""){
                this.pending_comment = this.comment_txt
                this.$emitter.emit('ensureLogin');
            }
        },
        sendComment(){
            this.in_progress = true
            var comment = {"occurrenceKey1": this.occurrence_key, "occurrenceKey2": this.curation_key, "text": this.pending_comment, "orcid": this.user.orcid, "userName": this.user.name};
            let response_promise = this.$backend.post_comment(comment)
            response_promise.then(() => {
                this.comment_txt = ''
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
    startDrag(event) {
      if (event.button !== 0) return; // Vérifiez si le clic est le clic gauche
      this.dragging = true;
      this.initialX = this.$el.offsetLeft;
      this.initialY = this.$el.offsetTop;
      this.offsetX = event.clientX;
      this.offsetY = event.clientY;
      window.addEventListener('mousemove', this.drag);
      window.addEventListener('mouseup', this.stopDrag);
    },
    drag(event) {
      if (!this.dragging) return;
      const deltaX = event.clientX - this.offsetX;
      const deltaY = event.clientY - this.offsetY;
      this.initialX = this.initialX + deltaX;
      this.initialY = this.initialY + deltaY;
      this.offsetX = event.clientX;
      this.offsetY = event.clientY;
    },
    stopDrag() {
      this.dragging = false;
      window.removeEventListener('mousemove', this.drag);
      window.removeEventListener('mouseup', this.stopDrag);
    },
  },
  mounted() {
        this.$emitter.on('logged', () => {
            if (this.pending_comment != undefined && this.pending_comment != '') {
                // save on the Plazi backend
                this.sendComment(this.pending_comment);
                this.pending_comment = '';
                this.$gtag.event('post_comment');
                this.updateCommentSaved(this.curation_key)
                this.comments_visibility = false
                this.updateCommentSelection(null)
                this.curation_key = null
            }
        });
        this.$emitter.on('loginAbort', () => {
            if (this.pending_comment != undefined && this.pending_comment != "") {
                // logingAbort event and this.pendingSave is not empty
                // ==> the user clicked on "Send" but cancel the logged in procedure
                this.pending_comment = '';
                alert('Your comment is not saved');
            }
        });
    },
    watch: {
        "comment.selection": {
            handler(){
                if(this.comment.selection != null){
                    // Check if different comment
                    if (this.comment.selection.curation != this.curation_key){
                        // Check if it needs to save a comment before
                        if(this.comments_visibility){
                            this.closeComments(this.comment.selection)
                        }
                        else {
                            this.openNewComments(this.comment.selection)
                        }
                    }
                }
            },
            deep: true
        },
    }
};
</script>

<style scoped lang="scss">
.custom-dialog {
  position: fixed;
  width: 500px;
  max-height: 80vh;
  overflow: auto;
  border: 2px solid #ccc;
  background-color: #fff;
  z-index: 1000;
}

.handle {
  cursor: move;
}

.close-button {
  cursor: pointer;
}

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

.comments-container {
    text-align: left;
    margin: 20px;
    padding: 20px;
    height:75%;
    overflow: scroll;
    border: 1px solid #ddd;
    background-color: #eee;
    max-height: 50vh;
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
