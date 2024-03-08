<template>
    <HeaderDoctor />
    <div class="d-flex">
        <AsidebarDoctor />
        <div class="container mt-2">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            ملخص الأرباح 
                            <n-tag type="success" class="ms-2" round>
                                {{ TotalEarnings? TotalEarnings + ' ' + 'جنية' : 'جارى التحميل...'}}
                            </n-tag>
                        </div>
                        <div class="card-body">
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
                                            أرباح المادة
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
                                    <tr v-else-if="Subjects.length === 0">
                                        <td colspan="5" class="py-5 fs-3 fw-medium">
                                            لا يوجد مــواد
                                        </td>
                                    </tr>
                                    <tr v-else v-for="(subject, index) in Subjects" :key="index">
                                        <td>
                                            {{ index + 1 }}
                                        </td>
                                        <td>
                                            <img :src="subject.subjectPhoto" :alt="subject.subjectName"
                                                v-if="subject.subjectPhoto"
                                                style="width: 60px; height: 60px; object-fit: cover;"
                                                class="rounded-circle" />
                                            <img src="../../assets/images/Book.jpg" :alt="subject.subjectName"
                                                style="width: 60px; height: 60px; object-fit: cover;" class="rounded-circle"
                                                v-else />
                                        </td>
                                        <td>
                                            {{ subject.subjectName }}
                                        </td>
                                        <td>
                                            {{ subject.SubjectEarnings + ' ' + 'جنية' }}
                                        </td>
                                        <td>
                                            <router-link to="" @click="showLectures(subject.lectures, subject.subjectName)"
                                                data-bs-toggle="modal" data-bs-target="#LectureEarning">
                                                <n-button type="primary">
                                                    عرض المحاضرات
                                                </n-button>
                                            </router-link>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Modal LectureEarning -->
                                <div class="modal fade" id="LectureEarning" tabindex="-1" role="dialog"
                                    aria-labelledby="modalTitleId" aria-hidden="true">
                                    <div class="modal-dialog modal-lg" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="modalTitleId">
                                                    {{ subjectName }}
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
                                                            عدد الإشتراكات
                                                        </th>
                                                        <th class="p-2">
                                                            أرباح المحاضرة
                                                        </th>
                                                    </tr>
                                                    <tr v-if="lectures.length === 0">
                                                        <td colspan="4" class="py-5 fs-3 fw-medium">
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
                                                            {{ lecture.new_purchases }}
                                                        </td>
                                                        <td class="p-2">
                                                            {{ lecture.earning + ' ' + 'جنية' }}
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
        </div>
    </div>
</template>

<script>
import HeaderDoctor from '@/Doctor/HeaderDoctor.vue'
import AsidebarDoctor from '@/Doctor/AsidebarDoctor.vue'
import { mapGetters } from 'vuex';
import {
    NButton, NTag
} from 'naive-ui';
import axios from 'axios';

export default {
    name: 'DoctorView',
    data() {
        return {
            TotalEarnings: '',
            Subjects: [],
            isLoadingSubject: true,
            lectures: [],
            subjectName: ''
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    },
    methods: {
        async getEarning() {
            await axios.get(`/Doctors/${this.user.object._id}/earning`)
                .then(response => {
                    this.TotalEarnings = response.data.data.TotalEarnings;
                    this.Subjects = response.data.data.Subjects;
                    this.isLoadingSubject = false;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async showLectures(lectures, subjectName) {
            this.lectures = lectures;
            this.subjectName = subjectName;
        }
    },
    mounted() {
        this.getEarning()
    },
    components: {
        HeaderDoctor, AsidebarDoctor, NButton, NTag
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