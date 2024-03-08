<template>
    <HeaderAdmin />
    <div class="d-flex">
        <AsideBarAdmin />
        <div class="d-flex flex-column w-100">
            <div class="container mt-2">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4 class="m-0 text-dark">
                                        المواد
                                    </h4>
                                    <a href="" data-bs-toggle="modal" data-bs-target="#AddSubject">
                                        <n-button type="primary" class="bg-success d-flex align-items-center gap-1 border-0">
                                            <n-icon>
                                                <Add />
                                            </n-icon>
                                            إضافة مادة
                                        </n-button>
                                    </a>
                                    <!-- Modal -->
                                    <div class="modal fade" id="AddSubject" tabindex="-1" role="dialog"
                                        aria-labelledby="modalTitleId" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="modalTitleId">
                                                        إضافة مادة
                                                    </h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <form @submit.prevent="addSubject"
                                                        class="d-flex flex-column gap-2 justify-content-center align-items-center">
                                                        <n-upload directory-dnd :max="1" with-credentials @change="handleChange"
                                                            accept="image/png, image/jpeg, image/jpg">
                                                            <n-upload-dragger>
                                                                <div style="margin-bottom: 12px">
                                                                    <n-icon size="48" :depth="3">
                                                                        <ArchiveSharp />
                                                                    </n-icon>
                                                                </div>
                                                                <div class="d-flex flex-column">
                                                                    <n-text style="font-size: 16textx">
                                                                        اضغط أو اسحب لتحميل الصورة
                                                                    </n-text>
                                                                    <n-p depth="3" class="m-0">
                                                                        يمكنك تحميل صورة للمادة
                                                                    </n-p>
                                                                </div>
                                                            </n-upload-dragger>
                                                        </n-upload>
                                                        <div class="d-flex flex-column w-100">
                                                            <n-input v-model:value="state.Subject.name" placeholder="اسم المادة"
                                                                :disabled="isLoadingSubjectAdded" size="large" />
                                                            <!-- small Error Validation -->
                                                            <small v-if="v$.Subject.name.$error"
                                                                class="text-right d-flex w-100 text-danger">
                                                                {{ v$.Subject.name.$errors[0].$message == 'required' ? 'هذا الحقل مطلوب' : 'هذا الحقل مطلوب' }}
                                                            </small>
                                                        </div>
                                                        <div class="w-100">
                                                            <n-select v-model:value="state.Subject.semester"
                                                                placeholder="السميستر" :options="semester" size="large" />
                                                        </div>
                                                        <div class="w-100 d-flex gap-1 flex-column">
                                                            <n-select :options="options" size="large" placeholder="الجامعة"
                                                                @change="getAllUniversity" />
                                                        </div>
                                                        <div class="w-100 d-flex gap-1 flex-column">
                                                            <n-select @change="getFacultyById" :options="faculty"
                                                                placeholder="الكلية" size="large"
                                                                :disabled="!selectedUniversity"
                                                                v-model:value="state.Subject.faculty" />
                                                            <!-- Error Validation -->
                                                            <small v-if="v$.Subject.faculty.$error"
                                                                class="text-right d-flex w-100 text-danger">
                                                                {{ v$.Subject.faculty.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : v$.Subject.faculty.$errors[0].$message === false
                                                                    ? 'يجب أن تختار الكلية' : 'يجب أن تختار الكلية' }}
                                                            </small>
                                                        </div>
                                                        <n-button type="primary" class="m-auto mt-1 px-3" @click="addSubject"
                                                            :loading="isLoadingSubjectAdded" :disabled="isLoadingSubjectAdded">
                                                            إضــافة
                                                        </n-button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Table -->
                                <div class="overflow-auto">
                                    <table
                                        class="table table-striped rounded table-bordered text-nowrap mb-0 table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xl table-responsive-xxl mt-3">
                                        <thead>
                                            <tr class="bg-success text-light">
                                                <th>#</th>
                                                <th>اسم المادة</th>
                                                <th>صورة المادة</th>
                                                <th>الفصل الدراسي</th>
                                                <th>الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody class="align-middle">
                                            <tr v-if="loadingSubjects">
                                                <td colspan="5" class="text-center py-5">
                                                    <n-button loading type="primary" text></n-button>
                                                    <br />
                                                    <span>
                                                        جاري تحميل المواد
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="(subject, index) in paginatedData" :key="subject._id">
                                                <td>{{ GlobalIndex(index + 1) }}</td>
                                                <td>{{ subject.name }}</td>
                                                <td>
                                                    <img :src="subject.photo" :alt="subject.name" v-if="subject.photo"
                                                        style="width: 35px; height: 35px; object-fit: cover;"
                                                        class="rounded-circle" />
                                                    <img src="../../assets/images/Book.jpg" :alt="subject.name"
                                                        style="width: 35px; height: 35px; object-fit: cover;"
                                                        class="rounded-circle" v-else />
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
                                                <td class="d-flex gap-1">
                                                    <n-button type="primary"
                                                        class="bg-success text-light d-flex align-items-center gap-1 border-0 rounded"
                                                        data-bs-toggle="modal" data-bs-target="#LectureDetails"
                                                        @click="showSubjectDetails(subject._id)">
                                                        تفاصيل
                                                    </n-button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Modal -->
                                    <div class="modal fade" id="LectureDetails" tabindex="-1" role="dialog"
                                        aria-labelledby="modalTitleId" aria-hidden="true">
                                        <div class="modal-dialog modal-lg" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="modalTitleId">
                                                        {{ subjectDetails ? subjectDetails.name : 'جارى التحميل...' }}
                                                    </h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <div class="overflow-auto">
                                                        <table
                                                            class="table table-striped table-hover bg-white table-bordered text-center w-100 text-nowrap rounded mb-0">
                                                            <tr class="bg-success text-light">
                                                                <th class="p-2">
                                                                    صورة المادة
                                                                </th>
                                                                <th class="p-2">
                                                                    عنوان المادة
                                                                </th>
                                                                <th class="p-2">
                                                                    دكاترة المادة
                                                                </th>                                                     
                                                            </tr>
                                                            <tr v-if="isLoadingSubjectDetails">
                                                                <td colspan="5" class="py-2">
                                                                    <n-button :loading="isLoadingSubjectDetails" text
                                                                        type="primary"></n-button>
                                                                </td>
                                                            </tr>
                                                            <tr v-else-if="subjects.length === 0">
                                                                <td colspan="5" class="py-5 fs-3 fw-medium">
                                                                    لا يوجد مــواد
                                                                </td>
                                                            </tr>
                                                            <tr v-else>
                                                                <td>
                                                                    <img :src="subjectDetails.photo" :alt="subjectDetails.name"
                                                                        v-if="subjectDetails.photo"
                                                                        style="width: 70px; height: 70px; object-fit: cover;"
                                                                        class="rounded-circle" />
                                                                    <img src="../../assets/images/Book.jpg" :alt="subjectDetails.name"
                                                                        style="width: 70px; height: 70px; object-fit: cover;"
                                                                        class="rounded-circle" v-else />
                                                                </td>
                                                                <td>
                                                                    {{ subjectDetails.name }}
                                                                </td>
                                                                <td>
                                                                    <n-popover trigger="hover" v-for="dr in subjectDetails.doctors" :key="dr.id">
                                                                        <template #trigger>
                                                                            <!-- {{ subjectDetails.doctors }} -->
                                                                            <img :src="dr.photo" :alt="dr.name"
                                                                                style="width: 40px; height: 40px; object-fit: cover;"
                                                                                class="rounded-circle p-0 image_filter border-2"
                                                                            />
                                                                        </template>
                                                                        <span>
                                                                            {{ dr.name }}
                                                                        </span>
                                                                    </n-popover>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div class="modal-footer d-flex">
                                                    <n-button class="m-auto" type="success" data-bs-dismiss="modal">
                                                        إغــلاق
                                                    </n-button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="d-flex m-auto justify-content-center mt-3" v-if="subjects.length > 10">
                                        <n-space vertical>
                                            <n-pagination v-model:page="page" :page-count="totalPages" :page-slot="8" dir="ltr"
                                                @change="handlePageChange" />
                                        </n-space>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container mt-2">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-header">
                                <h4 class="m-0 text-dark">
                                    إضافة / إزالة مادة للدكتور
                                </h4>
                            </div>
                            <div class="card-body">
                                <n-tabs type="bar" animated justify-content="center">
                                    <n-tab-pane name="oasis" tab="إضافة مادة للدكتور">
                                       <div class="row gap-1 gap-lg-0 my-2">
                                            <div class="col-lg-6 col-12">
                                                <n-select
                                                    v-model:show="show2"
                                                    filterable
                                                    placeholder="إختر المادة"
                                                    :options="subjectsDoctor"
                                                    @change="handleSubjectDoctorChange"
                                                    >
                                                    <template v-if="show" #arrow>
                                                        <md-search />
                                                    </template>
                                                </n-select>
                                            </div>
                                            <div class="col-lg-6 col-12">
                                                <n-select
                                                    v-model:show="show"
                                                    filterable
                                                    placeholder="إختر الدكتور"
                                                    :options="doctors"
                                                    @change="handleDoctorChange"
                                                    >
                                                    <template v-if="show" #arrow>
                                                        <md-search />
                                                    </template>
                                                </n-select>
                                            </div>
                                            <n-button type="primary" class="m-auto mt-2 px-3 w-auto"
                                                :loading="isLoadingSubjectDoctor" :disabled="isLoadingSubjectDoctor"    
                                                @click="addSubjectDoctor"
                                            >
                                                إضــافة
                                            </n-button>
                                       </div>
                                    </n-tab-pane>
                                    <n-tab-pane name="the beatles" tab="إزالة مادة من الدكتور">
                                        <div class="row gap-1 gap-lg-0 my-2">
                                            <div class="col-lg-6 col-12">
                                                <n-select
                                                    v-model:show="show2"
                                                    filterable
                                                    placeholder="إختر المادة"
                                                    :options="subjectsDoctor"
                                                    @change="handleSubjectDoctorChange"
                                                    >
                                                    <template v-if="show" #arrow>
                                                        <md-search />
                                                    </template>
                                                </n-select>
                                            </div>
                                            <div class="col-lg-6 col-12">
                                                <n-select
                                                    v-model:show="show"
                                                    filterable
                                                    placeholder="إختر الدكتور"
                                                    :options="doctors"
                                                    @change="handleDoctorChange"
                                                    >
                                                    <template v-if="show" #arrow>
                                                        <md-search />
                                                    </template>
                                                </n-select>
                                            </div>
                                            <n-button type="primary" class="m-auto mt-2 px-3 w-auto"
                                                :loading="isLoadingSubjectDoctor" :disabled="isLoadingSubjectDoctor"    
                                                @click="removeSubjectDoctor"
                                            >
                                                إزالــة
                                            </n-button>
                                        </div>
                                    </n-tab-pane>
                                </n-tabs>
                            </div>
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
import {
    NButton, NIcon, NInput, NSpace, NPagination, NUpload, NUploadDragger, NP, NText, NSelect, NPopover, NTabs, NTabPane
} from 'naive-ui';

import {
    Add, ArchiveSharp, MdSearch
} from '@vicons/ionicons5';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { reactive, computed } from 'vue';
import bootstrapBundleMin from 'bootstrap/dist/js/bootstrap.bundle.min';

export default {
    name: "DashboardView",
    components: {
        HeaderAdmin,
        AsideBarAdmin,
        NButton,
        NIcon,
        Add,
        NInput,
        NSpace,
        NPagination,
        NUpload,
        NUploadDragger,
        ArchiveSharp,
        NP,
        NText,
        NSelect,
        NPopover,
        NTabs,
        NTabPane,
        MdSearch,
    },
    data() {
        return {
            subjects: [],
            subjectName: '',
            options: [],
            faculty: [],
            selectedUniversity: '',
            isLoadingSubjectAdded: false,
            isLoadingFaculty: false,
            loadingSubjects: true,
            page: 1,
            semester: [
                { value: '1', label: 'الفصل الدراسي الأول' },
                { value: '2', label: 'الفصل الدراسي الثاني' },
                { value: '3', label: 'الفصل الدراسي الثالث' },
                { value: '4', label: 'الفصل الدراسي الرابع' },
                { value: '5', label: 'الفصل الدراسي الخامس' },
                { value: '6', label: 'الفصل الدراسي السادس' },
                { value: '7', label: 'الفصل الدراسي السابع' },
                { value: '8', label: 'الفصل الدراسي الثامن' },
                { value: '9', label: 'الفصل الدراسي التاسع' },
                { value: '10', label: 'الفصل الدراسي العاشر' },
            ],
            subjectDetails: [],
            isLoadingSubjectDetails: false,
            doctors: [],
            show: false,
            show2: false,
            selectedDoctor: '',
            subjectsDoctor: [],
            selectedSubjectDoctor: '',
            isLoadingSubjectDoctor: false,
        }
    },
    methods: {
        async getSubjects() {
            this.loading = true;
            await axios.get('/Subjects')
                .then((response) => {
                    this.subjects = response.data.data;
                    this.subjectsDoctor = response.data.data.map(subject => ({ value: subject._id, label: subject.name }));
                    this.loadingSubjects = false;
                })
                .catch((error) => {
                    this.error = error.response.data.message || error.message;
                });
        },
        async getAllUniversity(e) {
            try {
                const response = await axios.get('/Universities');
                if (response.status === 200) {
                    this.options = response.data.data.map(university => ({ value: university._id, label: university.name }));
                    if (e) {
                        this.getFacultyByUniversity(e);
                        this.selectedUniversity = e;
                        this.state.Subject.faculty = "";
                    }
                }
            } catch (error) {
                useToast().error('حدث خطأ ما');
            }
        },

        async getFacultyByUniversity(id) {
            try {
                const response = await axios.get(`/Universities/${id}`);
                if (response.status === 200) {
                    if (id) {
                        this.faculty = response.data.data.faculties.map(faculty => ({ value: faculty._id, label: faculty.name }));
                    }
                }
            } catch (err) {
                console.log(err);
                useToast().error('حدث خطأ ما');
            }
        },

        getFacultyById(id) {
            this.state.Subject.faculty = id;
        },

        async addSubject() {
            try {
                if (this.state.Subject.photo === '') {
                    useToast().error('يجب عليك تحميل صورة للمادة');
                    return;
                }
                this.v$.$validate();
                if (!this.v$.$error) {
                    this.isLoadingSubjectAdded = true;
                    const response = await axios.post('/Subjects', this.state.Subject);
                    if (response.status === 200) {
                        useToast().success('تم إضافة المادة بنجاح');
                        this.getSubjects();
                        this.state.Subject.name = '';
                        this.state.Subject.faculty = '';
                        this.state.Subject.semester = '';
                        this.selectedUniversity = '';
                        this.v$.$reset();
                        this.isLoadingSubjectAdded = false;
                        // Hide Modal
                        this.hideModal();
                    }
                }
            } catch (error) {
                this.isLoadingSubjectAdded = false;
                if (error.response.message == "Invalid semester number") {
                    useToast().error('رقم الفصل الدراسي غير صحيح');
                }
                else {
                    useToast().error('حدث خطأ ما');
                }
            }
        },

        hideModal() {
            const modal = document.getElementById('AddSubject');
            const modalBS = bootstrapBundleMin.Modal.getInstance(modal);
            modalBS.hide();
        },

        handlePageChange(page) {
            this.page = page;
        },

        GlobalIndex(index) {
            return (this.page - 1) * 10 + index;
        },

        handleChange(file) {
            if (file && file.fileList && file.fileList.length > 0 && file.fileList[0].file) {
                this.state.Subject.photo = file.fileList[0].file;
            }
        },

        handleRemove() {
            this.state.Subject.photo = '';
        },

        async showSubjectDetails(id) {
            this.isLoadingSubjectDetails = true;
            await axios.get(`/Subjects/${id}`)
                .then((response) => {
                    if (response.status === 200) {
                        this.isLoadingSubjectDetails = false;
                        this.subjectDetails = response.data.data;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        async getyAllDoctors() {
            await axios.get('/Doctors')
                .then((response) => {
                    this.doctors = response.data.data.map(doctor => ({ value: doctor._id, label: doctor.name }));
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        handleDoctorChange(e) {
            this.selectedDoctor = e;
        },
        
        handleSubjectDoctorChange(e) {
            this.selectedSubjectDoctor = e;
        },

        async addSubjectDoctor() {
            if(!this.selectedDoctor || !this.selectedSubjectDoctor) {
                useToast().error('يجب عليك إختيار المادة والدكتور');
                return;
            }
            this.isLoadingSubjectDoctor = true;
            await axios.patch(`/Subjects/${this.selectedSubjectDoctor}?type=add`, {
                doctor: this.selectedDoctor,
            })
                .then((response) => {
                    if (response.status === 200) {
                        this.isLoadingSubjectDoctor = false;
                        this.selectedDoctor = '';
                        this.selectedSubjectDoctor = '';
                        useToast().success('تم إضافة المادة للدكتور بنجاح');
                    }
                })
                .catch((error) => {
                    if(error.response.data.message === "Doctor already added") {
                        this.isLoadingSubjectDoctor = false;
                        useToast().error('الدكتور مضاف بالفعل لهذه المادة');
                    }
                    else {
                        this.isLoadingSubjectDoctor = false;
                        useToast().error('حدث خطأ ما أثناء إضافة المادة للدكتور');
                    }
                });
        },

        async removeSubjectDoctor() {
            if(!this.selectedDoctor || !this.selectedSubjectDoctor) {
                useToast().error('يجب عليك إختيار المادة والدكتور');
                return;
            }
            this.isLoadingSubjectDoctor = true;
            await axios.patch(`/Subjects/${this.selectedSubjectDoctor}?type=remove`, {
                doctor: this.selectedDoctor,
            })
                .then((response) => {
                    if (response.status === 200) {
                        this.isLoadingSubjectDoctor = false;
                        this.selectedDoctor = '';
                        this.selectedSubjectDoctor = '';
                        useToast().success('تم إزالة المادة من الدكتور بنجاح');
                    }
                })
                .catch(() => {
                    this.isLoadingSubjectDoctor = false;
                    useToast().error('حدث خطأ ما أثناء إزالة المادة من الدكتور');
                });
        },

    },
    mounted() {
        this.getSubjects();
        this.getAllUniversity();
        this.getyAllDoctors();
    },
    computed: {
        paginatedData() {
            const start = (this.page - 1) * 10;
            const end = start + 10;
            return this.subjects.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.subjects.length / 10);
        },
    },
    setup() {
        const state = reactive({
            Subject: {
                name: '',
                faculty: '',
                semester: '1',
                photo: '',
            },
        });

        const rules = computed(() => {
            return {
                Subject: {
                    name: {
                        required,
                    },
                    faculty: {
                        required,
                    },
                    semester: {
                        required,
                    },
                    photo: {
                        required,
                    },
                },
            };
        });

        const v$ = useVuelidate(rules, state);

        return {
            state,
            v$,
        };
    },
}
</script>

<style scoped>
@import url("../../assets/css/custom.css");

.overflow-auto::-webkit-scrollbar {
    height: .2rem;
}

.overflow-auto::-webkit-scrollbar-track {
    background: #fff;
}

.overflow-auto::-webkit-scrollbar-thumb {
    background: #eee;
}

.image_filter:not(.image_filter:first-child){
    margin-right: -10px;
}

</style>