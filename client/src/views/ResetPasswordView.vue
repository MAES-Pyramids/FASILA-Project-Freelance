<template>
    <div class="container">
        <div class="row align-items-center min-vh-100">
            <ResetPasswordForm />
            <div class="bg-light position-absolute start-0 top-0 bottom-0 h-100 col-lg-6 col-md-4 d-none d-lg-block d-xl-block d-xxl-block"
                style="z-index: -1;"></div>
        </div>
    </div>
</template>

<script>
import ResetPasswordForm from '@/components/ResetPassword/ResetPasswordForm.vue';

export default {
    name: "LoginView",
    components: {
        ResetPasswordForm,
    },
}
</script>

<style lang="scss" scoped></style>