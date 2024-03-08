<template>
    <aside class="bg-white vh-100 col-xl-2 col-lg-3 col-md-4 d-none d-md-block">
        <ul class="d-flex flex-column list-unstyled">
            <li>
                <RouterLink to="/Admin"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon>
                        <BarChart />
                    </n-icon>
                    لوحة التحكم
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/Admin/Subjects"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon>
                        <Book />
                    </n-icon>
                    المـــــواد
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/Admin/Doctors"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon>
                        <PeopleCircle />
                    </n-icon>
                    الدكـــاترة
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/Admin/Admins"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon>
                        <People />
                    </n-icon>
                    المديــرين
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/Admin/Univertsities"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon>
                        <Business />
                    </n-icon>
                    الجامعات
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/Admin/Faculties"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon>
                        <Duplicate />
                    </n-icon>
                    الكـــليات
                </RouterLink>
            </li>
            <li class="mt-1">
                <RouterLink to="/Setting"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon>
                        <Settings />
                    </n-icon>
                    الإعدادات
                </RouterLink>
            </li>
            <li class="mt-1">
                <a href="" @click.prevent="signOut"
                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark"
                    exact-active-class="active">
                    <n-icon>
                        <LogOut />
                    </n-icon>
                    تسجيل الخروج
                </a>
            </li>
        </ul>
    </aside>
</template>

<script>
import { NIcon } from "naive-ui";
import { Settings, LogOut, BarChart, People, PeopleCircle, Book, Business, Duplicate } from "@vicons/ionicons5";
import { mapActions } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
    name: "AsidebarAdmin",
    components: {
        NIcon,
        Settings,
        LogOut,
        BarChart,
        People,
        PeopleCircle,
        Book,
        Business,
        Duplicate
    },
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