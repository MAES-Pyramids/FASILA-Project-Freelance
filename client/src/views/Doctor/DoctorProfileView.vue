<template>
    <HeaderDoctor />
    <div class="d-flex">
        <AsidebarDoctor />
        <div class="container mt-2">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            الملف الشخصى
                        </div>
                        <div class="card-body">
                            <div class="row align-items-center" v-if="authenticated">
                                <div class="col-lg-4 col-md-5 mb-2">
                                    <img :src="user.object.photo" alt="Doctor Profile"
                                        class="rounded-circle mx-auto d-block mb-2" width="200" height="200"
                                        v-if="user.object.photo" />
                                    <img src="../../assets/images/profile.jpg" alt="Doctor Profile"
                                        class="rounded-circle mx-auto d-block mb-2" width="200" height="200" v-else />
                                </div>
                                <div class="col-lg-8 col-md-7">
                                    <p class="bg-light w-100 rounded p-2">
                                        {{ "الإسم" + " : " + user.object.name }}
                                    </p>
                                    <n-divider class="m-0" />

                                    <p class="bg-light w-100 rounded p-2">
                                        {{ "رقم الهاتف" + " : " + user.object.phone.split('').slice(1, 12).join("") }}
                                    </p>
                                    <n-divider class="m-0" />

                                    <p class="bg-light w-100 rounded p-2">
                                        {{ "عدد الملفات التى تم رفعها" + " : " }} {{ user.object.PDFsNumber ?
                                            user.object.PDFsNumber + " ملف" : "0 ملف" }}
                                    </p>
                                    <n-divider class="m-0" />
                                    <p class="bg-light w-100 rounded p-2">
                                        {{ "الأرباح" + " : " }} {{ TotalEarnings > 0 ? TotalEarnings + " جنيه" :
                                            "جارى التحميل..." }}
                                    </p>
                                    <n-divider class="m-0" />

                                    <p class="bg-light w-100 rounded p-2">
                                        {{ "تاريخ الإنضمام" + " : " +
                                            new Date(user.object.createdAt)
                                                .toLocaleDateString('ar-EG') }}
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderDoctor from '@/Doctor/HeaderDoctor.vue'
import AsidebarDoctor from '@/Doctor/AsidebarDoctor.vue'
import { mapGetters } from 'vuex';
import {
    NDivider
} from 'naive-ui';
import axios from 'axios';

export default {
    name: 'DoctorView',
    data() {
        return {
            TotalEarnings: '',
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            authenticated: 'auth/authenticated',
        })
    },
    methods: {
        async getEarning() {
            await axios.get(`/Doctors/${this.user.object._id}/earning`)
                .then(response => {
                    this.TotalEarnings = response.data.data.TotalEarnings;
                })
                .catch(error => {
                    console.log(error)
                })
        },
    },
    mounted() {
        this.getEarning()
    },
    components: {
        HeaderDoctor, AsidebarDoctor,
        NDivider
    },
}
</script>

<style scoped>
@import url("@/assets/css/custom.css");

.overflow-auto::-webkit-scrollbar {
    height: .2rem;
}

.overflow-auto::-webkit-scrollbar-track {
    background: #fff;
}

.overflow-auto::-webkit-scrollbar-thumb {
    background: #eee;
}
</style>