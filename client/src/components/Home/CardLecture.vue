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
            <RouterLink to="" @click="goToDr">
                <n-button text class="fs-4 fw-semibold">
                    الدكاترة
                </n-button>
            </RouterLink>
        </n-breadcrumb-item>
        <n-breadcrumb-item class="fs-4">
            <RouterLink to="#">
                <n-button text class="fs-4 text-success fw-semibold">
                    المحاضرات
                    <span v-if="cardData.length > 0" class="mx-1">
                        ({{ cardData.length ? cardData.length : 'جار التحميل' }})
                    </span>
                </n-button>
            </RouterLink>
        </n-breadcrumb-item>
    </n-breadcrumb>
    <div class="d-flex justify-content-center flex-column text-center mt-5" v-if="isLoading">
        <div class="spinner"></div>
        <span class="text-muted mt-2">
            جاري تحميل المحاضرات
        </span>
    </div>
    <!-- NOT FOUND Lectures -->
    <div class="d-flex m-auto justify-content-center mt-5 flex-column" v-if="cardData.length === 0 && !isLoading">
        <n-icon class="d-flex m-auto" size="50">
            <AlertCircleOutline />
        </n-icon>
        <h4 class="mx-1 text-muted text-center">
            لا يوجد محاضرات
        </h4>
    </div>
    <div v-for="(card, index) in paginatedData" :key="index" v-else
        class="col-lg-4 col-md-6 col-12 mt-3 d-flex justify-content-center">
        <n-card :title="card.name" class="px-1 text-center fw-semibold position-relative">
            <template #cover>
                <img :src="card.preview_path" alt="doctor image" v-if="card.preview_path" />
                <img src="../../assets/images/Book.jpg" alt="doctor image" v-else />
            </template>
            <n-space size="small" class="d-flex gap-1 justify-content-center flex-wrap">
                <n-tag :bordered="false" type="primary" size="small">
                    <n-icon :component="CheckmarkCircle" size="small" />
                    {{ card.no_slides > 0 ? card.no_slides + ' ورقة' : 'لا يوجد ورق' }}
                </n-tag>
                <n-tag :bordered="false" type="primary" size="small">
                    <n-icon :component="CheckmarkCircle" size="small" />
                    {{ card.no_purchases > 0 ? card.no_purchases + 'مشترك' : 'لا يوجد مشتركين' }}
                </n-tag>
                <n-tag :bordered="false" type="primary" class="px-2 position-absolute top-0 start-0" trigger-click-on-close
                    size="large">
                    <!-- {{ card.finalPrice == 0 ? "مجاناً" : card.finalPrice + 'جنية' }} -->
                    <span v-if="card.isFree && card.finalPrice && Number(card.finalPrice.$numberDecimal)">
                        <span class="text-decoration-line-through">
                            {{ card.finalPrice.$numberDecimal + ' ' + 'جنية' }}
                        </span>
                        مجاناً
                    </span>
                    <span v-else-if="card.isFree && card.finalPrice && !card.finalPrice.$numberDecimal">
                        مجاناً
                    </span>
                    <span v-else-if="card.finalPrice && card.finalPrice.$numberDecimal == '0'">
                        مجاناً
                    </span>
                    <span v-else-if="!card.isFree && card.finalPrice && card.finalPrice.$numberDecimal">
                        {{ card.finalPrice.$numberDecimal ? card.finalPrice.$numberDecimal + ' ' + 'جنية' : ' - ' }}
                    </span>
                    <span v-else-if="card.purchased">
                        تم الشراء
                    </span>
                </n-tag>
            </n-space>
            <div class="mt-3 d-flex gap-1"
                v-if="authenticated && user.object.isActive"
            >
                <router-link to="" class="w-100" v-if="card.purchased == false && card.isFree == false && card.finalPrice && Number(card.finalPrice.$numberDecimal) > 0" data-bs-toggle="modal"
                    @click="PayLectureData(card)" data-bs-target="#PayLecture">
                    <n-button type="primary" class="w-100">
                        شراء
                    </n-button>
                </router-link>
                <router-link to="" class="w-100" @click="PayLectureData(card)" v-if="card.purchased == false && card.finalPrice && Number(card.finalPrice.$numberDecimal) == 0" data-bs-target="#PayLectureFree" data-bs-toggle="modal">
                    <n-button type="primary" class="w-100">
                        شراء (مجانية)
                    </n-button>
                </router-link>
                <router-link to="" class="w-100" @click="goToPdf(card._id)" v-if="card.purchased == true">
                    <n-button type="primary" class="w-100">
                        إبدأ الآن
                    </n-button>
                </router-link>
                <router-link to="" type="button" data-bs-toggle="modal" data-bs-target="#showDetails"
                    @click="showDetails(card)">
                    <n-button secondary type="primary">
                        تفاصيل
                    </n-button>
                </router-link>
            </div>
            <!-- PayMoney Modal -->
            <div class="modal fade" id="PayLecture" tabindex="-1" role="dialog"
                aria-labelledby="modalTitleId" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title d-flex justify-content-between w-100" id="modalTitleId">
                                <span>
                                    شراء المحاضرة
                                </span>
                                <span>
                                    <n-tag :bordered="false" type="success" size="small" v-if="authenticated">
                                        {{ 'رصيدك الحالى : ' + Number(user.object.wallet.balance.$numberDecimal) + ' جنية'
                                        }}
                                    </n-tag>
                                </span>
                            </h5>
                        </div>
                        <div class="modal-body">
                            <n-tabs type="card" animated :active-name="'محاضرة' + ' ' + '( ' + cardDetails.name + ' )'">
                                <n-tab-pane :name="'محاضرة' + ' ' + '( ' + cardDetails.name + ' )'"
                                    class="d-flex flex-column text-start ps-1">
                                    <label class="text-right">
                                        <!-- addEmptyPages -->
                                        <n-checkbox v-model:checked="addEmptyPages" class="mt-3"
                                            v-if="cardDetails && cardDetails.finalPrice && Number(cardDetails.finalPrice.$numberDecimal)"
                                                :disabled="Number(cardDetails.finalPrice.$numberDecimal) > Number(user.object.wallet.balance.$numberDecimal)"
                                            >
                                            إضافة صفحات فارغة
                                        </n-checkbox>
                                    </label>

                                    <label class="text-right w-100">
                                        <!-- addEmptyPageAfter make it write num id check -->
                                        <n-checkbox class="mt-3 d-flex align-items-center w-100"
                                            v-model:checked="addEmptyPageAfterLogic"
                                            v-if="cardDetails && cardDetails.finalPrice && Number(cardDetails.finalPrice.$numberDecimal)"
                                            :disabled="!addEmptyPages || Number(cardDetails.finalPrice.$numberDecimal) > Number(user.object.wallet.balance.$numberDecimal) || addTwoEmptyPagesAtEnd">
                                            <n-input-number v-model:value="addEmptyPageAfter" :show-button="false" :min="1"
                                                :max="100" :step="1" placeholder="إضافة صفحة بعد كل ورقة"
                                                :disabled="!addEmptyPages || Number(cardDetails.finalPrice.$numberDecimal) > Number(user.object.wallet.balance.$numberDecimal) || addTwoEmptyPagesAtEnd" class="w-100 pe-0"></n-input-number>
                                        </n-checkbox>
                                    </label>

                                    <label class="text-right">
                                        <!-- addTwoEmptyPagesAtEnd -->
                                        <n-checkbox v-model:checked="addTwoEmptyPagesAtEnd" class="mt-3"
                                            @click="addEmptyPageAfter = ''"
                                            v-if="cardDetails && cardDetails.finalPrice && Number(cardDetails.finalPrice.$numberDecimal)"
                                            :disabled="!addEmptyPages || Number(cardDetails.finalPrice.$numberDecimal) > Number(user.object.wallet.balance.$numberDecimal) || addEmptyPageAfterLogic">
                                            إضافة صفحتين فارغتين فى النهاية
                                        </n-checkbox>
                                    </label>
                                    <n-button type="primary" class="mt-3" @click="purchasePdf(cardDetails._id)"
                                        v-if="cardDetails && cardDetails.finalPrice && Number(cardDetails.finalPrice.$numberDecimal)"
                                        :loading="isLoadingPurchase"
                                        :disabled="Number(cardDetails.finalPrice.$numberDecimal) > Number(user.object.wallet.balance.$numberDecimal) || isLoadingPurchase">
                                        شراء المحاضرة
                                        <span
                                            v-if="cardDetails && cardDetails.finalPrice && Number(cardDetails.finalPrice.$numberDecimal)"
                                            class="ms-1">
                                            ({{ Number(cardDetails.finalPrice.$numberDecimal) > Number(user.object.wallet.balance.$numberDecimal)? 'رصيدك غير كافى' : Number(cardDetails.finalPrice.$numberDecimal) + ' ' + 'جنية' }})
                                        </span>
                                    </n-button>
                                </n-tab-pane>
                            </n-tabs>
                        </div>
                        <div class="modal-footer d-flex justify-content-center"
                            v-if="cardDetails && cardDetails.finalPrice && Number(cardDetails.finalPrice.$numberDecimal)"
                        >
                            <n-button type="primary" data-bs-toggle="modal" data-bs-target="#PayMoney" tertiary bordered
                                v-if="Number(cardDetails.finalPrice.$numberDecimal) > Number(user.object.wallet.balance.$numberDecimal)">
                                شحن الرصيد
                            </n-button>
                            <n-button type="primary" data-bs-dismiss="modal">
                                إغــلاق
                            </n-button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- PayMoney Modal -->
            <div class="modal fade" id="PayLectureFree" tabindex="-1" role="dialog"
                aria-labelledby="modalTitleId" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title d-flex justify-content-between w-100" id="modalTitleId">
                                <span>
                                    شراء المحاضرة (مجانية)
                                </span>
                                <span>
                                    <n-tag :bordered="false" type="success" size="small" v-if="authenticated">
                                        {{ 'رصيدك الحالى : ' + Number(user.object.wallet.balance.$numberDecimal) + ' جنية'
                                        }}
                                    </n-tag>
                                </span>
                            </h5>
                        </div>
                        <div class="modal-body">
                            <n-tabs type="card" animated :active-name="'محاضرة' + ' ' + '( ' + cardDetails.name + ' )'">
                                <n-tab-pane :name="'محاضرة' + ' ' + '( ' + cardDetails.name + ' )'"
                                    class="d-flex flex-column text-start ps-1">
                                        <label class="text-right">
                                            <!-- addEmptyPages -->
                                            <n-checkbox v-model:checked="addEmptyPages" class="mt-3"
                                                v-if="cardDetails && cardDetails.finalPrice && Number(cardDetails.finalPrice.$numberDecimal) == 0">
                                                إضافة صفحات فارغة
                                            </n-checkbox>
                                        </label>

                                        <label class="text-right w-100">
                                            <!-- addEmptyPageAfter make it write num id check -->
                                            <n-checkbox class="mt-3 d-flex align-items-center w-100"
                                                v-model:checked="addEmptyPageAfterLogic"
                                                v-if="cardDetails && cardDetails.finalPrice && Number(cardDetails.finalPrice.$numberDecimal) == 0"
                                                :disabled="!addEmptyPages || Number(cardDetails.finalPrice.$numberDecimal) > Number(user.object.wallet.balance.$numberDecimal) || addTwoEmptyPagesAtEnd">
                                                <n-input-number v-model:value="addEmptyPageAfter" :show-button="false" :min="1"
                                                    :max="100" :step="1" placeholder="إضافة صفحة بعد كل ورقة"
                                                    :disabled="!addEmptyPages || Number(cardDetails.finalPrice.$numberDecimal) > Number(user.object.wallet.balance.$numberDecimal) || addTwoEmptyPagesAtEnd" class="w-100 pe-0"></n-input-number>
                                            </n-checkbox>
                                        </label>

                                        <label class="text-right">
                                            <!-- addTwoEmptyPagesAtEnd -->
                                            <n-checkbox v-model:checked="addTwoEmptyPagesAtEnd" class="mt-3"
                                            @click="addEmptyPageAfter = ''"
                                                v-if="cardDetails && cardDetails.finalPrice && Number(cardDetails.finalPrice.$numberDecimal) == 0"
                                                :disabled="!addEmptyPages || Number(cardDetails.finalPrice.$numberDecimal)> Number(user.object.wallet.balance.$numberDecimal) || addEmptyPageAfterLogic">
                                                إضافة صفحتين فارغتين فى النهاية
                                            </n-checkbox>
                                        </label>

                                    <n-button type="primary" class="mt-3" @click="purchaseFreePdf(cardDetails._id)"
                                        v-if="cardDetails && cardDetails.finalPrice && Number(cardDetails.finalPrice.$numberDecimal) == 0"
                                        :loading="isLoadingPurchase"
                                        :disabled="isLoadingPurchase || !addEmptyPages"
                                        >
                                        شراء المحاضرة
                                        (مجاناً)
                                    </n-button>
                                </n-tab-pane>
                            </n-tabs>
                        </div>
                        <div class="modal-footer d-flex justify-content-center"
                        >
                            <n-button type="primary" data-bs-dismiss="modal">
                                إغــلاق
                            </n-button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- if you want to close by clicking outside the modal, delete the last endpoint:data-bs-backdrop and data-bs-keyboard -->
            <div class="modal fade" id="showDetails" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
                role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable" role="document">
                    <div class="modal-content">
                        <div class="modal-header position-relative">
                            <h5 class="modal-title" id="modalTitleId">
                                {{ cardDetails.name }}
                            </h5>
                            <n-tag :bordered="false" type="primary" class="px-3 position-absolute top-0 end-0"
                                trigger-click-on-close size="large">
                                <span
                                    v-if="cardDetails.isFree && cardDetails.finalPrice && cardDetails.finalPrice.$numberDecimal">
                                    <span class="text-decoration-line-through">
                                        {{ cardDetails.finalPrice.$numberDecimal + ' ' + 'جنية' }}
                                    </span>
                                    مجاناً
                                </span>
                                <span
                                    v-else-if="cardDetails.isFree && cardDetails.finalPrice && !cardDetails.finalPrice.$numberDecimal">
                                    مجاناً
                                </span>
                                <span
                                    v-else-if="!cardDetails.isFree && cardDetails.finalPrice && cardDetails.finalPrice.$numberDecimal">
                                    {{ cardDetails.finalPrice.$numberDecimal ? cardDetails.finalPrice.$numberDecimal + ' ' +
                                        'جنية' : ' - ' }}
                                </span>
                                <span
                                    v-else-if="cardDetails.purchased">
                                    تم الشراء
                                </span>
                            </n-tag>
                        </div>
                        <div class="modal-body mb-0">
                            <div class="d-flex flex-column justify-content-end">
                                <n-list hoverable bordered clickable>
                                    <n-list-item>
                                        <n-thing title="الوصـــــف : " content-style="margin-top: 10px;">
                                            {{ cardDetails.description }}
                                        </n-thing>
                                    </n-list-item>
                                    <n-list-item>
                                        <div class="d-flex align-items-center gap-1">
                                            <span>
                                                عدد المشتركين :
                                                {{ cardDetails.no_purchases > 0 ? cardDetails.no_purchases : 'لا يوجد مشتركين' }}
                                            </span>
                                        </div>
                                        <div class="d-flex align-items-center gap-1">
                                            <span>
                                                عدد الأوراق :
                                                {{ cardDetails.no_slides > 0 ? cardDetails.no_slides : 'لا يوجد ورق' }}
                                            </span>
                                        </div>
                                        <div class="d-flex align-items-center gap-1">
                                            <span>
                                                تاريخ النشر :
                                                {{
                                                    new Date(cardDetails.createdAt).toLocaleDateString('ar-GB', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })
                                                }}
                                            </span>
                                        </div>
                                    </n-list-item>
                                </n-list>
                            </div>
                            <n-button type="primary" data-bs-dismiss="modal" class="m-auto mt-2">
                                إغــــلاق
                            </n-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex mt-5 flex-column text-center m-auto justify-content-center" v-if="cardData.length === 0">
                <n-icon class="d-flex m-auto" size="100">
                    <AlertCircleOutline />
                </n-icon>
                <h2 class="mx-1 text-muted">
                    لا يوجد محاضرات
                </h2>
            </div>
        </n-card>
    </div>

    <div class="d-flex m-auto justify-content-center mt-3" v-if="cardData.length > 15">
        <n-space vertical>
            <n-pagination v-model:page="page" :page-count="totalPages" :page-slot="8" dir="ltr"
                @change="handlePageChange" />
        </n-space>
    </div>
</template>

<script>
import {
    NCard, NTag, NIcon, NSpace, NPagination, NButton, NList, NBreadcrumb, NBreadcrumbItem, NListItem, NThing,
    NTabs, NTabPane, NInputNumber, NCheckbox
} from 'naive-ui';
import { defineComponent, ref } from "vue";
import { CheckmarkCircle, AlertCircleOutline } from "@vicons/ionicons5";
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { mapGetters } from 'vuex';
import bootstrapBundleMin from 'bootstrap/dist/js/bootstrap.bundle.min';

export default defineComponent({
    name: 'CardLecture',
    data() {
        return {
            cardData: [],
            cardDetails: {},
            isLoading: true,
            numberDecimal: '',
            addEmptyPages: false,
            addEmptyPageAfter: '',
            addTwoEmptyPagesAtEnd: false,
            isLoadingPurchase: false,
            addEmptyPageAfterLogic: false,
        }
    },
    components: {
        NCard,
        NTag,
        NIcon,
        NSpace,
        NPagination,
        NButton,
        NList,
        NListItem,
        NThing,
        AlertCircleOutline,
        NBreadcrumb,
        NBreadcrumbItem,
        NTabs,
        NTabPane,
        NInputNumber,
        NCheckbox,
    },
    computed: {
        paginatedData() {
            const start = (this.page - 1) * 15;
            const end = start + 15;
            return this.cardData.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.cardData.length / 15);
        },
        ...mapGetters({
            user: 'auth/user',
            authenticated: 'auth/authenticated',
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
    },
    methods: {
        async getLectures() {
            const LectureId = this.$route.params.LectureId;
            const DoctorId = this.$route.params.DoctorId;
            await axios.get(`/doctors/${LectureId}/Subjects/${DoctorId}/Lectures`)
                .then(response => {
                    if (response.status == 200) {
                        this.cardData = response.data.data;
                        this.isLoading = false;
                    }
                })
                .catch(() => {
                    useToast().error('حدث خطأ أثناء تحميل المحاضرات');
                })
        },
        async goToPdf(cardId) {
            await axios.get(`/PLectures/${cardId}`)
                .then(response => {
                    if (response.status == 200) {
                        // const encodedCard = btoa(response.data.data.path); // Encode card to Base64
                        this.$router.push({
                            path: `/pdf/${cardId}`,
                            query: { pdfLink: response.data.data.path, password: btoa(response.data.data.password) }
                        });
                    }
                })
        },
        showDetails(card) {
            this.cardDetails = card;
        },
        goToDr() {
            const DoctorId = this.$route.params.DoctorId;
            this.$router.push(`/Doctors/${this.encodeId(DoctorId)}`)
        },
        encodeId(id) {
            return btoa(id);
        },
        async purchasePdf(id) {
            this.isLoadingPurchase = true;
            const defaultVal = this.addEmptyPages ? this.addEmptyPageAfter || 1 : '';
            await axios.get(`/Lectures/${id}?addEmptyPages=${this.addEmptyPages}&addEmptyPageAfter=${defaultVal}&addTwoEmptyPagesAtEnd=${this.addTwoEmptyPagesAtEnd}`)
                .then(async (response) => {
                    if (response.status === 200) {
                        useToast().success('تم الشراء بنجاح');
                        this.getLectures();
                        await this.$store.dispatch('auth/attempt');
                        this.isLoadingPurchase = false;
                        // Hide Modal
                        const modal = document.getElementById('PayLecture');
                        const modalInstance = bootstrapBundleMin.Modal.getInstance(modal);
                        modalInstance.hide();
                    }
                })
                .catch(() => {
                    this.isLoadingPurchase = false;
                    useToast().error('حدث خطأ أثناء الشراء');
                });
        },
        async purchaseFreePdf(id) {
            this.isLoadingPurchase = true;
            const defaultVal = this.addEmptyPages ? this.addEmptyPageAfter || 1 : '';
            await axios.get(`/Lectures/${id}?addEmptyPages=${this.addEmptyPages}&addEmptyPageAfter=${defaultVal}&addTwoEmptyPagesAtEnd=${this.addTwoEmptyPagesAtEnd}`)
                .then(async (response) => {
                    if (response.status === 200) {
                        useToast().success('تم الشراء بنجاح');
                        this.getLectures();
                        await this.$store.dispatch('auth/attempt');
                        this.isLoadingPurchase = false;
                        // Hide free Modal
                        const modalFree = document.getElementById('PayLectureFree');
                        const modalInstanceFree = bootstrapBundleMin.Modal.getInstance(modalFree);
                        modalInstanceFree.hide();
                    }
                })
                .catch(() => {
                    this.isLoadingPurchase = false;
                    useToast().error('حدث خطأ أثناء الشراء');
                });
        },
        PayLectureData(card) {
            this.cardDetails = card;
        },
    },
    mounted() {
        this.getLectures();
    }
});
</script>

<style scoped>
@import url('../../assets/css/thing.css');

.n-card img {
    width: 100%;
    min-height: 200px;
    height: 300px;
    transition: all 0.5s ease-in-out;
    object-fit: contain;
}

.n-card img:hover {
    transform: scale(1.1);
}

.spinner {
    border-right: 5px solid #10c469;
}</style>