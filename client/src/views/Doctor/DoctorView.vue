<template>
    <HeaderDoctor />
    <div class="d-flex">
        <AsidebarDoctor />
        <div class="container mt-2">
            <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-12">
                    <div class="card mb-0">
                        <div class="card-body d-flex justify-content-between">
                            <span>
                                عدد المــواد
                            </span>
                            <span>
                                <n-tag type="success" round>
                                    {{
                                        subjects? subjects.length : 0
                                    }}
                                </n-tag>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-sm-12">
                    <div class="card mb-0">
                        <div class="card-body d-flex justify-content-between">
                            <span>
                                الأرباح
                            </span>
                            <span>
                                <n-tag type="success" round>
                                    {{
                                        TotalEarnings? TotalEarnings + ' جنية' : ' جارى التحميل...'
                                    }}
                                </n-tag>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="container mt-2">
                    <div class="overflow-auto">
                        <table
                            class="table table-striped table-hover bg-white table-bordered text-center w-100 text-nowrap rounded mb-0">
                            <tr class="bg-success text-light">
                                <th class="p-2">
                                    الرقم
                                </th>
                                <th class="p-2">
                                    صورة المادة
                                </th>
                                <th class="p-2">
                                    عنوان المادة
                                </th>
                                <th class="p-2">
                                    السمستر
                                </th>
                                <th class="p-2">
                                    محاضرات المادة
                                </th>
                            </tr>
                            <tr v-if="isLoadingSubject">
                                <td colspan="5" class="py-2">
                                    <n-button :loading="isLoadingSubject" text type="primary"></n-button>
                                </td>
                            </tr>
                            <tr v-else-if="subjects.length === 0">
                                <td colspan="5" class="py-5 fs-3 fw-medium">
                                    لا يوجد مــواد
                                </td>
                            </tr>
                            <tr v-else v-for="(subject, index) in subjects" :key="index">
                                <td>
                                    {{ index + 1 }}
                                </td>
                                <td>
                                    <img :src="subject.photo" :alt="subject.name" v-if="subject.photo"
                                        style="width: 60px; height: 60px; object-fit: cover;" class="rounded-circle" />
                                    <img src="../../assets/images/Book.jpg" :alt="subject.name"
                                        style="width: 60px; height: 60px; object-fit: cover;" class="rounded-circle"
                                        v-else />
                                </td>
                                <td>
                                    {{ subject.name }}
                                </td>
                                <td>
                                    {{
                                        subject.semester == 1 ? 'الترم الأول' : subject.semester == 2 ? 'الترم الثاني' :
                                        subject.semester == 3 ? 'الترم الثالث'
                                            : subject.semester == 4 ? 'الترم الرابع' : subject.semester == 5 ? 'الترم الخامس' :
                                                subject.semester == 6 ? 'الترم السادس' : subject.semester == 7 ? 'الترم السابع' :
                                                    subject.semester == 8 ? 'الترم الثامن' : 'غير محدد'
                                    }}
                                </td>
                                <td>
                                    <router-link to="" @click="showLectures(subject._id)" data-bs-toggle="modal"
                                        data-bs-target="#Lectures">
                                        <n-button type="primary">
                                            عرض المحاضرة
                                        </n-button>
                                    </router-link>
                                </td>
                            </tr>
                        </table>

                        <!-- Modal Lectures -->
                        <div class="modal fade" id="Lectures" tabindex="-1" role="dialog" aria-labelledby="modalTitleId"
                            aria-hidden="true">
                            <div class="modal-dialog modal-lg" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="modalTitleId">
                                            {{ LecName }}
                                        </h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body overflow-auto">
                                        <table
                                            class="table table-striped table-hover bg-white table-bordered text-center w-100 text-nowrap mb-0 rounded mb-0">
                                            <tr class=" bg-success text-light">
                                                <th class="p-2">
                                                    الرقم
                                                </th>
                                                <th class="p-2">
                                                    عنوان المحاضرة
                                                </th>
                                                <th class="p-2">
                                                    وصف المحاضرة
                                                </th>
                                                <th class="p-2">
                                                    السعر
                                                </th>
                                                <th class="p-2">
                                                    حالة النشر
                                                </th>
                                                <th class="p-2">
                                                    عدد الإشتراكات
                                                </th>
                                                <th class="p-2">
                                                    عدد الأوراق
                                                </th>
                                                <th class="p-2">
                                                    تاريخ النشر
                                                </th>
                                            </tr>
                                            <tr v-if="isLoadingLectures">
                                                <td colspan="8" class="py-2">
                                                    <n-button :loading="isLoadingLectures" text type="primary"></n-button>
                                                </td>
                                            </tr>
                                            <tr v-else-if="lectures.length === 0">
                                                <td colspan="8" class="py-5 fs-3 fw-medium">
                                                    لا يوجد محاضرات
                                                </td>
                                            </tr>
                                            <tr v-else v-for="(lecture, index) in lectures" :key="index">
                                                <td class="p-2">
                                                    {{ index + 1 }}
                                                </td>
                                                <td class="p-2">
                                                    {{ lecture.name }}
                                                </td>
                                                <td class="p-2">
                                                    {{ lecture.description }}
                                                </td>
                                                <td class="p-2">
                                                    {{ lecture.isFree ? 'مجانية' :
                                                        lecture && lecture.publishPrice && lecture.publishPrice.$numberDecimal +
                                                        'جنية' }}
                                                </td>
                                                <td class="p-2">
                                                    {{ lecture.confirmed ? 'تم النشر' : 'لم يتم النشر' }}
                                                </td>
                                                <td class="p-2">
                                                    {{ lecture.no_purchases > 0 ? lecture.no_purchases : 'لا يوجد إشتراكات'
                                                    }}
                                                </td>
                                                <td class="p-2">
                                                    {{ lecture.no_slides > 0 ? lecture.no_slides : 'لا يوجد أوراق' }}
                                                </td>
                                                <td class="p-2">
                                                    {{
                                                        new Date(lecture.createdAt).toLocaleDateString('ar-EG', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit'
                                                        })
                                                    }}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div class="modal-footer d-flex">
                                        <n-button type="primary" data-bs-dismiss="modal" class="m-auto">
                                            إغــــلاق
                                        </n-button>
                                    </div>
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
import axios from 'axios'
import { useToast } from 'vue-toastification';
import {
    NButton, NTag
} from 'naive-ui'
import { mapGetters } from 'vuex';

export default {
    components: {
        HeaderDoctor, AsidebarDoctor, NButton, NTag
    },
    name: 'DoctorView',
    data() {
        return {
            subjects: [],
            isLoadingSubject: true,
            lectures: {},
            isLoadingLectures: true,
            LecName: '',
            TotalEarnings: '',
        }
    },
    methods: {
        async getMySubjects() {
            await axios.get('/Subjects')
                .then(response => {
                    if (response.status == 200) {
                        this.isLoadingSubject = false
                        this.subjects = response.data.data
                    }
                })
                .catch(() => {
                    useToast().error('حدث خطأ أثناء تحميل المواد')
                })
        },
        async showLectures(id) {
            await axios.get(`/Subjects/${id}/Lectures`)
                .then(response => {
                    if (response.status == 200) {
                        this.lectures = response.data.data;
                        for (let lecName of this.lectures) {
                            this.LecName = lecName.name
                        }
                        this.isLoadingLectures = false;
                    }
                })
                .catch(() => {
                    useToast().error('حدث خطأ أثناء تحميل المحاضرات')
                })
        },
        async getEarnings() {
            await axios.get(`/Doctors/${this.user.object._id}/earning`)
                .then(response => {
                    if (response.status == 200) {
                        this.TotalEarnings = response.data.data.TotalEarnings;
                    }
                })
                .catch(() => {
                    useToast().error('حدث خطأ أثناء تحميل الأرباح')
                })
        }
    },
    mounted() {
        this.getMySubjects();
        this.getEarnings();
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    }
}
</script>

<style scoped>
.overflow-auto::-webkit-scrollbar {
    height: .2rem;
}

.overflow-auto::-webkit-scrollbar-track {
    background: #eee;
}

.overflow-auto::-webkit-scrollbar-thumb {
    background: #bdbdbd;
}
</style>