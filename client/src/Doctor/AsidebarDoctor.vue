<template>
    <div class="bg-white vh-100 col-lg-2 col-md-4 d-none d-md-block">
        <ul class="list-unstyled d-flex flex-column">
            <li>
                <router-link to="/Doctor"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon size="20">
                        <HomeOutline />
                    </n-icon>
                    الرئيسية
                </router-link>
            </li>
            <li class="mt-1">
                <router-link to="/Doctor/AddSubject"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon size="20">
                        <Add />
                    </n-icon>
                    إضــافة محاضرة
                </router-link>
            </li>
            <li class="mt-1">
                <router-link to="/Doctor/ShowEarnings"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon size="20">
                        <WalletOutline />
                    </n-icon>
                    ملخص الأربــــاح
                </router-link>
            </li>
            <li class="mt-1">
                <router-link to="/Doctor/Profile"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon size="20">
                        <Person />
                    </n-icon>
                    الملف الشخصى
                </router-link>
            </li>
            <li class="mt-1">
                <a href="" class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    @click.prevent="signOut">
                    <n-icon size="20">
                        <LogOutOutline />
                    </n-icon>
                    تسجيل الخـــروج
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { NIcon } from "naive-ui";
import { HomeOutline, Add, Person, LogOutOutline, WalletOutline } from "@vicons/ionicons5";
import { mapActions } from 'vuex';
import { useToast } from  'vue-toastification';

export default {
    name: 'AsidebarDoctor',
    components: { NIcon, HomeOutline, Add, Person, LogOutOutline, WalletOutline },
    methods: {
        ...mapActions({
            signOutAction: 'auth/signOut'
        }),
        signOut() {
            this.signOutAction().then(() => {
                useToast().success('تم تسجيل الخروج بنجاح');
                this.$router.push('/login');
            });
        },
    }
}
</script>

<style scoped>
li a {
    transition: all 0.3s ease-in-out;
}

li a:hover {
    background-color: #10c469 !important;
    color: #fff !important;
}

.active {
    background-color: #10c469 !important;
    color: #fff !important;
}
</style>