<template>
    <div class="bg-white">
        <div class="py-2 container-fluid px-lg-5 px-3">
            <div class="d-flex justify-content-between align-items-center">
                <n-icon size="30" class="d-block d-md-none" @click="activate('right')">
                    <MenuOutline />
                </n-icon>
                <n-drawer v-model:show="active" :default-width="350" resizable :placement="placement">
                    <n-drawer-content title="القائمة" closable>
                        <ul class="list-unstyled d-flex flex-column">
                            <li>
                                <router-link to="/Doctor"
                                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark rounded"
                                    exact-active-class="active">
                                    <n-icon size="20">
                                        <HomeOutline />
                                    </n-icon>
                                    الرئيسية
                                </router-link>
                            </li>
                            <li class="mt-1">
                                <router-link to="/Doctor/AddSubject"
                                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark rounded"
                                    exact-active-class="active">
                                    <n-icon size="20">
                                        <Add />
                                    </n-icon>
                                    إضــافة مادة
                                </router-link>
                            </li>
                            <li class="mt-1">
                                <router-link to="/Doctor/Profile"
                                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark rounded"
                                    exact-active-class="active">
                                    <n-icon size="20">
                                        <Person />
                                    </n-icon>
                                    الملف الشخصى
                                </router-link>
                            </li>
                            <li class="mt-1">
                                <a href=""
                                    class="fs-4 text-right d-flex py-2 px-3 gap-1 align-items-center fw-medium text-dark rounded"
                                    @click.prevent="signOut">
                                    <n-icon size="20">
                                        <LogOutOutline />
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
                        <a class="dropdown-item" href="" @click.prevent="signOut">
                            <n-icon size="15">
                                <LogOutOutline />
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
import { Person, LogOutOutline, MenuOutline, HomeOutline, Add } from "@vicons/ionicons5";
import { mapActions, mapGetters } from "vuex";
import { useToast } from "vue-toastification";

export default {
    name: 'HeaderDoctor',
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
        Person, NIcon, LogOutOutline, MenuOutline,
        NDrawer, NDrawerContent, HomeOutline, Add

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