<template>
    <n-breadcrumb class="mt-3 bg-light p-2 rouded">
        <n-breadcrumb-item class="fs-4">
            <RouterLink to="/">
                <n-button text class="fs-4 fw-semibold">
                    المــواد
                </n-button>
            </RouterLink>
        </n-breadcrumb-item>
        <n-breadcrumb-item class="fs-4">
            <RouterLink to="#">
                <n-button text class="fs-4 text-success">
                    الدكاترة
                    <span v-if="doctors.length > 0" class="mx-1">
                        ({{
                            doctors.length > 0 ? doctors.length : 'جاري التحميل'
                        }})
                    </span>
                </n-button>
            </RouterLink>
        </n-breadcrumb-item>
    </n-breadcrumb>
    <div class="d-flex justify-content-center flex-column text-center mt-5" v-if="isLoading">
        <div class="spinner"></div>
        <span class="text-muted mt-2">
            جاري تحميل الدكاترة
        </span>
    </div>
    <!-- Not Found Doctors -->
    <div class="d-flex m-auto justify-content-center mt-5 flex-column" v-if="doctors.length === 0 && !isLoading">
        <n-icon class="d-flex m-auto" size="50">
            <AlertCircleOutline />
        </n-icon>
        <h4 class="mx-1 text-muted text-center">
            لا يوجد دكاترة
        </h4>
    </div>
    <div v-else v-for="(card, index) in paginatedData" :key="index"
        class="col-xl-4 col-md-6 col-sm-6 col-12 mt-3 d-flex justify-content-center">
        <n-card :title="card.name" class="text-center fw-semibold position-relative">
            <template #cover>
                <RouterLink to="" @click="goToPdf(card)">
                    <img :src="card.photo" alt="doctor image" v-if="card.photo" class="doctor_img" />
                    <img src="../../assets/images/doctor.jpg" alt="doctor image" v-else />
                </RouterLink>
            </template>
            <n-space size="small" class="d-flex gap-1 justify-content-center flex-wrap px-3 "
                v-if="card.PDFsNumber && card.PDFsNumber.length > 0">
                <n-tag :bordered="false" type="primary" size="small">
                    <n-icon :component="CheckmarkCircle" size="small" />
                    {{ card.PDFsNumber }}
                </n-tag>
            </n-space>
            <n-button type="primary" text class="position-absolute top-0 start-0 p-2">
                <n-icon size="30">
                    <!-- Conditionally render HeartOutline or HeartSlash based on whether the doctor is a favorite -->
                    <template v-if="isFavoriteDoctor(card._id)">
                        <HeartDislike @click="DisHeartDr(card)" class="text-danger" :disabled="isLooadingDislikeDr" />
                    </template>
                    <template v-else>
                        <HeartOutline @click="addDrToFavorites(card._id)" :disabled="isLooadinglikeDr" />
                    </template>
                </n-icon>
            </n-button>
        </n-card>
        <div class="d-flex mt-5 flex-column text-center m-auto justify-content-center" v-if="doctors.length === 0">
            <n-icon class="d-flex m-auto" size="100">
                <AlertCircleOutline />
            </n-icon>
            <h2 class="mx-1 text-muted">
                لا يوجد مواد
            </h2>
        </div>
    </div>
    <div class="d-flex m-auto justify-content-center mt-3" v-if="doctors.length > 15">
        <n-space vertical>
            <n-pagination v-model:page="page" :page-count="totalPages" :page-slot="8" dir="ltr"
                @change="handlePageChange" />
        </n-space>
    </div>
</template>

<script>
import {
    NCard, NTag, NIcon, NSpace, NPagination,
    NBreadcrumb, NBreadcrumbItem, NButton
} from 'naive-ui';
import { defineComponent, ref } from "vue";
import { CheckmarkCircle, HeartOutline, HeartDislike, AlertCircleOutline } from "@vicons/ionicons5";
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'CardDoctor',
    data() {
        return {
            doctors: [],
            isLoading: true,
            DrName: '',
            isLooadingDislikeDr: false,
            isLooadinglikeDr: false
        }
    },
    mounted() {
        this.getAllDr();
        this.$store.dispatch('getFavoriteDr');
    },
    methods: {
        async getAllDr() {
            const DoctorId = this.$route.params.DoctorId;
            await axios.get(`/Subjects/${DoctorId}`)
                .then(response => {
                    if (response.status == 200) {
                        this.doctors = response.data.data.doctors;
                        for (let i of this.doctors) {
                            this.DrName = i.name;
                        }
                        this.isLoading = false;
                    }
                })
                .catch(() => {
                    useToast().error('حدث خطأ أثناء تحميل الدكاترة');
                })
        },
        async addDrToFavorites(id) {
            if (this.user.object.telegramStatus == 'active') {
                await axios.patch(`/doctors/${id}/Student/favorites`).then(response => {
                    if (response.status == 200) {
                        this.$store.dispatch('getFavoriteDr');
                        this.isLooadinglikeDr = true;
                        this.getAllDr();
                        useToast().success(`تم إضافة الدكتور ${this.DrName} إلى المفضلة`)
                    }
                })
                    .catch(() => {
                        useToast().error(`حدث خطأ أثناء إضافة الدكتور ${this.DrName} إلى المفضلة`)
                    })
            }
            else {
                useToast().error('يجب عليك تفعيل الاشتراك في التليجرام أولاً');
                return;
            }
        },
        async goToPdf(card) {
            const subjectId = this.$route.params.DoctorId;
            this.$router.push(`/Doctors/${this.encodeId(subjectId)}/Lectures/${this.encodeId(card._id)}`)
        },
        encodeId(id) {
            return btoa(id);
        },
        async DisHeartDr(card) {
            await axios.delete(`/doctors/${card._id}/Student/favorites`)
                .then(response => {
                    if (response.status == 200) {
                        this.isLooadingDislikeDr = true;
                        this.$store.dispatch('getFavoriteDr');
                        this.getAllDr();
                        useToast().success(`تم إزالة الدكتور ${card.name} من المفضلة`);
                    }
                })
                .catch(() => {
                    useToast().error(`حدث خطأ أثناء إزالة الدكتور ${card.name} من المفضلة`);
                })
        },
        isFavoriteDoctor(doctorId) {
            if (this.favoriteDr) {
                return this.favoriteDr.some((doctor) => doctor._id === doctorId);
            }
        },
    },
    components: {
        NCard,
        NTag,
        NIcon,
        NSpace,
        NPagination,
        AlertCircleOutline,
        NBreadcrumb,
        NBreadcrumbItem,
        NButton,
        HeartOutline,
        HeartDislike
    },
    computed: {
        paginatedData() {
            const start = (this.page - 1) * 15;
            const end = start + 15;
            return this.doctors.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.doctors.length / 15);
        },
        ...mapGetters({
            user: 'auth/user',
            favoriteDr: 'getFavoriteDr'
        })
    },
    setup() {
        const page = ref(1);

        const handlePageChange = (value) => {
            page.value = value;
        };

        return {
            CheckmarkCircle,
            page,
            handlePageChange,
        };
    }
});
</script>

<style scoped>
.n-card {
    overflow: hidden;
}

.n-card img {
    transition: all 0.5s ease-in-out;
}

.n-card img:hover {
    cursor: pointer;
    transform: scale(1.1);
}

.spinner {
    border-right: 5px solid #10c469;
}

.doctor_img {
    object-fit: cover;
    height: 350px;
}
</style>