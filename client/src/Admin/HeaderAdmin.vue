<template>
    <div class="bg-white w-100">
        <div class="py-2 container-fluid px-lg-5 px-3">
            <div class="d-flex justify-content-between align-items-center">
                <n-icon size="30" class="d-block d-md-none" @click="activate('right')">
                    <MenuOutline />
                </n-icon>
                <n-drawer v-model:show="active" :default-width="350" resizable :placement="placement">
                    <n-drawer-content title="القائمة" closable>
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
                    </n-drawer-content>
                </n-drawer>
                <!-- logo -->
                <img src="../assets/images/logo.png" alt="Fasila" class="d-flex"
                    style="object-fit: contain; height: 60px;" />
                <!-- Dropdown -->
                <div class="btn-group" v-if="authenticated">
                    <button class="bg-transparent dropdown-toggle d-flex align-items-center gap-1 border-0" type="button"
                        id="triggerId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src="../assets/images/profile.jpg" alt="Profile Doctor" class="rounded-circle"
                            style="width: 40px; height: 40px; object-fit: cover;" />
                        <span class="d-none d-md-block">
                            {{ user.object.name }}
                        </span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-start" aria-labelledby="triggerId">
                        <a class="dropdown-item d-block d-md-none text-center" href="#">
                            <span>
                                {{ user.object.name }}
                            </span>
                        </a>
                        <a class="dropdown-item" href="#">
                            <n-icon size="15">
                                <Person />
                            </n-icon>
                            الصفحة الشخصية
                        </a>
                        <a class="dropdown-item" href="#" @click.prevent="signOut">
                            <n-icon size="15">
                                <LogOut />
                            </n-icon>
                            تسجيل الخروج
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NIcon,
    NDrawer,
    NDrawerContent
} from "naive-ui";
import {
    Person, LogOut, MenuOutline,
    BarChart, Settings,
    Book, PeopleCircle, People, Business, Duplicate
} from "@vicons/ionicons5";
import { mapActions, mapGetters } from "vuex";
import { useToast } from "vue-toastification";

export default {
    name: 'HeaderAdmin',
    data() {
        return {
            active: false,
            placement: 'right'
        }
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
        activate(placement) {
            this.placement = placement
            this.active = true
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            authenticated: 'auth/authenticated'
        }),
    },
    components: {
        Person, NIcon, LogOut, MenuOutline,
        NDrawer, NDrawerContent,
        BarChart, Settings,
        Book, PeopleCircle, People, Business, Duplicate
    },
}

</script>

<style scoped>
li a {
    transition: all 0.3s ease-in-out;
}

li a:hover {
    background-color: #18a058;
    color: #fff !important;
}

.active {
    background-color: #18a058;
    color: #fff !important;
}
</style>