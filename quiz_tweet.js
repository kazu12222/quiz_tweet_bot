<template>
  <b-container>
    <div class="row">
      <div class="col-sm-12 col-lg-8 mx-auto mt-4 mb-4">
        <b-card border-variant="dark" class="mt-3" header="ログイン">
          <div v-if="isLoading" class="loading">
            <b-spinner class="loading-spinner" variant="primary" label="Spinning"/>{{loadingMessage}}
	  </div>
          <div v-show="!isLoading" id="firebaseui-auth-container"/>
        </b-card>
      </div>
    </div>
  </b-container>
</template>

<script>
import firebase from '~/plugins/firebase'
const firebaseui = require('firebaseui-ja')
import 'firebaseui-ja/dist/firebaseui.css'

import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'

  export default {
    name: "login",
    data(){
      return {
        isLoading: false,
	loadingMessage: '読み込み中...'
      }
    },
    mounted(){
      this.isLoading = true
      const redirectUrl = this.$route.query.redirect_url || '/'
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());

      ui.start('#firebaseui-auth-container', {
        signInSuccessUrl: redirectUrl,
        signInFlow: 'popup',
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            this.loadingMessage = 'ログイン処理中...'	  
            this.isLoading = true
            return true
        },
          uiShown: () => {
            this.isLoading = false
          }
        }
      })
    },
    methods: {
      logout(){
        firebase.auth().signOut()
      },
      ...mapMutations('user', ['setUserInfo'])
    }
  }
</script>

<style scoped>
.loading{
  display: flex;
  justify-content: center
}
.loading-spinner{
  margin: 0 0.5em
}
</style>
