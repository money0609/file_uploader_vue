<template>
    <div class="registerPage">
        <b-modal ref="nameModal" ok-only no-close-on-esc no-close-on-backdrop hide-header-close title="Nickname" @ok="saveUsername">
            <div role="group">
                <label for="input-live">Nickname:</label>
                <b-form-input
                    id="input-live"
                    v-model="username"
                    :state="nameState"
                    aria-describedby="input-live-help input-live-feedback"
                    placeholder="Enter your nickname"
                    trim
                ></b-form-input>

                <!-- This will only be shown if the preceding input has an invalid state -->
                <b-form-invalid-feedback id="input-live-feedback">Enter at least 3 letters</b-form-invalid-feedback>

            </div>
        </b-modal>

        <Spacewarp></Spacewarp>

        <Menu :username="username"></Menu>
    </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import { toastMixin } from '../../mixins/Mixin'
import Menu from './Menu'
import Spacewarp from './Spacewarp'

export default {
    name: 'Register',
    mixins: [toastMixin],
    components: {
        Menu,
        Spacewarp
    },
    data () {
        return {
            username: ''
        }
    },
    computed: {
        nameState () {
            // eslint-disable-next-line
            return this.username.length > 2 ? true : false
        }
    },
    methods: {
        showNameModal () {
            this.$refs['nameModal'].show()
        },
        async saveUsername (evt) {
            if (this.username.length < 3) {
                evt.preventDefault()
                return
            }

            await AuthenticationService.register({
                username: this.username
            }).then(() => this.showToast('success', 'Welcome ' + this.username))
        }
    },
    mounted () {
      this.showNameModal()
    }
}
</script>
