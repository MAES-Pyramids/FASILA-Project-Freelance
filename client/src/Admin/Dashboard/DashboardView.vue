<template>
    <HeaderAdmin />
    <div class="d-flex">
        <AsideBarAdmin />
        <div class="container mt-2">
            <div class="row">
                <div class="col-lg-3 col-md-6 mt-1">
                    <div class="card">
                        <div class="card-body bg-success rounded d-flex justify-content-between align-items-center">
                            <h5 class="m-0 text-light">
                                عدد الدكاترة
                            </h5>
                            <h3 class="m-0 text-light">
                                <n-skeleton v-if="loadingDoctors" circle size="medium" />
                                {{ NumOfDr }}
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 mt-0 mt-md-1">
                    <div class="card">
                        <div class="card-body bg-white rounded d-flex justify-content-between align-items-center">
                            <h5 class="m-0 text-dark">
                                عدد الطلاب
                            </h5>
                            <h3 class="m-0 text-dark">
                                <n-skeleton v-if="loadingStudents" circle size="medium" />
                                {{ NumOfSt }}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import AsideBarAdmin from '../AsideBarAdmin.vue';
import HeaderAdmin from '../HeaderAdmin.vue';
import { useToast } from 'vue-toastification';
import { NSkeleton } from 'naive-ui';

export default {
    name: "DashboardView",
    components: {
        HeaderAdmin,
        AsideBarAdmin,
        NSkeleton
    },
    methods: {
        async getAllDr() {
            await axios.get('/statistics/DoctorsNumber')
                .then((res) => {
                    if (res.status == 200) {
                        this.NumOfDr = res.data.data;
                        this.loadingDoctors = false;
                    }
                })
                .catch(() => {
                    useToast().error('حدث خطأ أثناء جلب البيانات')
                })
        },
        async getAllStudents() {
            await axios.get('/statistics/StudentsNumber')
                .then((res) => {
                    if (res.status == 200) {
                        this.NumOfSt = res.data.data;
                        this.loadingStudents = false;
                    }
                })
                .catch(() => {
                    useToast().error('حدث خطأ أثناء جلب البيانات')
                })
        },
    },
    data() {
        return {
            NumOfDr: '',
            NumOfSt: '',
            loadingStudents: true,
            loadingDoctors: true
        };
    },
    mounted() {
        this.getAllDr();
        this.getAllStudents();
    }
}
</script>

<style scoped></style>