<template>
    <n-breadcrumb class="mt-3">
        <n-breadcrumb-item class="fs-4 bg-light w-100 p-2 rounded-1">
            <RouterLink to="/">
                <n-button text class="fs-4 fw-semibold">
                    المــواد
                    <n-skeleton text :repeat="1" width="20%" v-if="isLoading" />
                    <span class="mx-1" v-if="cardData.length > 0 && !isLoading">
                        ({{ cardData.length }})
                    </span>
                </n-button>
            </RouterLink>
        </n-breadcrumb-item>
    </n-breadcrumb>
    <div class="d-flex justify-content-center flex-column text-center mt-5" v-if="isLoading">
        <div class="spinner"></div>
        <span class="text-muted mt-2">
            جاري تحميل المواد
        </span>
    </div>
    <!-- Not Found Subjects -->
    <div class="d-flex m-auto justify-content-center mt-5 flex-column" v-if="cardData.length === 0 && !isLoading">
        <n-icon class="d-flex m-auto" size="50">
            <AlertCircleOutline />
        </n-icon>
        <h4 class="mx-1 text-muted text-center">
            لا يوجد مواد
        </h4>
    </div>
    <div v-for="(item, index) in paginatedData" :key="index" class="col-xl-4 col-md-6 col-sm-6 mt-3" v-else>
        <RouterLink :to="'/Doctors/' + encodeId(item._id)">
            <n-card :title="item.name" class="text-center fw-semibold">
                <template #cover>
                    <img :src="item.photo" alt="doctor image" v-if="item.photo" class="img_subject" />
                    <img src="../../assets/images/Book.jpg" alt="doctor image" v-else />
                </template>
                <n-space size="small" class="d-flex gap-1 justify-content-center flex-wrap">
                    <n-tag :bordered="false" type="primary" size="small">
                        <n-icon :component="CheckmarkCircle" size="small" />
                        عدد الدكاترة
                        ({{ item.doctors.length ? item.doctors.length : 'لا يوجد' }})
                    </n-tag>
                </n-space>
            </n-card>
        </RouterLink>
    </div>
    <div class="d-flex m-auto justify-content-center mt-3" v-if="cardData.length > 15">
        <n-space vertical>
            <n-pagination v-model:page="page" :page-count="totalPages" :page-slot="8" dir="ltr"
                @change="handlePageChange" />
        </n-space>
    </div>
</template>

<script>
import { NCard, NTag, NIcon, NSpace, NPagination, NBreadcrumb, NBreadcrumbItem, NButton, NSkeleton } from 'naive-ui';
import { defineComponent } from "vue";
import { CheckmarkCircle, BookmarkOutline, AlertCircleOutline } from "@vicons/ionicons5";
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default defineComponent({
    name: 'CardSubject',
    data() {
        return {
            cardData: [],
            isLoading: true,
        }
    },
    async mounted() {
        await this.getSubjects();
    },
    methods: {
        async getSubjects() {
            try {
                await axios.get('/Subjects').then(response => {
                    if (response.status === 200) {
                        this.isLoading = false;
                        this.cardData = response.data.data;
                    }
                });
            } catch (error) {
                useToast().error('حدث خطأ أثناء تحميل المواد');
            }
        },
        encodeId(id) {
            return btoa(id);
        },
    },
    components: {
        NCard,
        NTag,
        NIcon,
        NSpace,
        NPagination,
        NBreadcrumb,
        NBreadcrumbItem,
        NButton,
        NSkeleton,
        AlertCircleOutline
    },
    computed: {
        totalPages() {
            return Math.ceil(this.cardData.length / 15);
        },
        paginatedData() {
            const start = (this.page - 1) * 15;
            const end = start + 15;
            return this.cardData.slice(start, end);
        },
    },
    setup() {

        const page = ref(1);

        const handlePageChange = (value) => {
            page.value = value;
        };


        return {
            CheckmarkCircle,
            BookmarkOutline,
            page,
            handlePageChange,
        };
    }
});
</script>

<style scoped>
@import url('../../assets/css/custom.css');

.n-card {
    max-width: 600px;
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

.img_subject{
    object-fit: cover;
    height: 300px;
}
</style>