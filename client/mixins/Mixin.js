export const toastMixin = {
    methods: {
        showToast(variant = 'default', bodyMsg) {
            let title = 'Note'

            switch (variant) {
                case 'info':
                    title = 'Info'
                    break
                case 'success':
                    title = 'Success'
                    break
                case 'warning':
                    title = 'Warning'
                    break
                case 'danger':
                    title = 'Error'
                    break
            }

            this.$bvToast.toast(bodyMsg, {
                title: title,
                variant: variant,
                solid: true
            })
        }
    }
}
