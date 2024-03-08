<template>
    <HeaderDoctor />
    <div class="d-flex">
        <AsidebarDoctor />
        <div class="container mt-2">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            إضــــافة محاضرة جديدة
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="UploadPDF">
                                <n-upload directory-dnd :max="1" @change="handleChange"
                                @remove="handleRemove"
                                ref="fileInput"
                                    :accept="'application/pdf'"
                                >
                                    <n-upload-dragger>
                                        <div style="margin-bottom: 12px">
                                            <n-icon size="48" :depth="3">
                                                <ArchiveOutline />
                                            </n-icon>
                                        </div>
                                        <n-text style="font-size: 16px">
                                            اضغط أو اسحب الملف هنا للتحميل
                                        </n-text>
                                        <n-p depth="3" style="margin: 8px 0 0 0">
                                            من فضلك قم بتحميل الملف المطلوب
                                        </n-p>
                                    </n-upload-dragger>
                                </n-upload>
                                <!-- Name -->
                                <n-input size="large" class="mt-2" placeholder="اسم المادة"
                                    v-model:value="state.pdf.name" />
                                <!-- small Error Validation -->
                                <small v-if="v$.pdf.name.$error" class="text-right d-flex w-100 mt-1 text-danger">
                                    {{ v$.pdf.name.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : v$.pdf.name.$errors[0].$message === 'This field should be at least 3 characters long' ? 'يجب أن يحتوي الاسم على 3 أحرف على الأقل' : 'يجب أن يحتوي الاسم على 3 أحرف على الأقل' }}
                                </small>
                                <!-- Subjects -->
                                <n-select size="large" class="mt-2" placeholder="اختر المادة" :options="subjects"
                                    v-model:value="selectedSubject" />
                                <!-- publishPrice -->
                                <n-input placeholder="سعر النشر" class="mt-2" size="large"
                                    v-model:value="state.pdf.publishPrice" :input-props="{ type: 'number' }">
                                    <template #suffix>
                                        جنية
                                    </template>
                                </n-input>
                                <!-- small Error Validation -->
                                <small v-if="v$.pdf.publishPrice.$error" class="text-right d-flex w-100 mt-1 text-danger">
                                    {{ v$.pdf.publishPrice.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : 'هذا الحقل مطلوب' }}
                                </small>
                                <!-- description -->
                                <n-space vertical>
                                    <n-input class="mt-2" type="textarea" maxlength="100" show-count
                                        v-model:value="state.pdf.description" placeholder="وصف المادة" :clearable="true"
                                        resizable :rows="5" />
                                </n-space>
                                <!-- small Error Validation -->
                                <small v-if="v$.pdf.description.$error" class="text-right d-flex w-100 mt-1 text-danger">
                                    {{ v$.pdf.description.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : v$.pdf.description.$errors[0].$message === 'This field should be at least 10 characters long' ? 'يجب أن يحتوي الوصف على 10 أحرف على الأقل' : 'يجب أن يحتوي الوصف على 10 أحرف على الأقل' }}
                                </small>
                                <!-- submit -->
                                <div class="d-flex mt-3">
                                    <n-button type="primary" class="px-3 m-auto" @click="UploadPDF" :loading="loading"
                                        :disabled="loading">
                                        إضـــافة
                                    </n-button>
                                </div>
                            </form>
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
import {
    NUpload,
    NUploadDragger,
    NIcon,
    NText,
    NP,
    NInput,
    NButton,
    NSpace,
    NSelect,
} from "naive-ui";

import { ArchiveOutline } from '@vicons/ionicons5';
import { required, minLength } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { reactive, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
    name: 'DoctorView',
    data() {
        return {
            fileImage: null,
            url: '',
            subjects: [],
            selectedSubject: null,
            loading: false,
        }
    },
    components: {
        HeaderDoctor, AsidebarDoctor,
        NUpload,
        NUploadDragger,
        NIcon,
        NText,
        NP,
        ArchiveOutline,
        NInput,
        NButton,
        NSpace,
        NSelect,
    },
    methods: {
        handleChange(file) {
            if (file && file.fileList && file.fileList.length > 0 && file.fileList[0].file) {
                this.fileImage = file.fileList[0].file;
                this.getLink();
            }
        },
        async UploadPDF() {
            if(this.fileImage === null) {
                useToast().error('من فضلك قم بتحميل الملف أولاً');
                return;
            }else if(this.selectedSubject === null) {
                useToast().error('من فضلك اختر المادة أولاً');
                return;
            }
            this.v$.$validate();
            if (!this.v$.$error) {
                this.loading = true;
                const axiosWithoutInterceptors = axios.create();
                 await axiosWithoutInterceptors.put(`${this.url}`, this.fileImage, {
                    headers: {
                         Authorization: '', // Setting Authorization header to an empty string
                        'Content-Type': 'application/pdf',
                    }
                })
                    .then(response => {
                        if (response.status === 200) {
                            axios.post(`/Subjects/${this.selectedSubject}/Lectures`, {
                                name: this.state.pdf.name,
                                description: this.state.pdf.description,
                                publishPrice: this.state.pdf.publishPrice,
                                key: this.state.pdf.key
                            })
                            .then(response => {
                                if (response.status === 200) {
                                    this.state.pdf.name = '';
                                    this.state.pdf.description = '';
                                    this.state.pdf.publishPrice = '';
                                    this.state.pdf.key = '';
                                    this.selectedSubject = null;
                                    this.fileImage = null;
                                    this.url = '';
                                    this.loading = false;
                                    useToast().success('تم إضافة المحاضرة بنجاح');
                                    // clear File Input
                                    this.fileImage = null;
                                    this.url = '';
                                    this.$router.push('/Doctor');
                                    // Reset the form
                                    this.v$.$reset();
                                    }
                                })
                                .catch(error => {
                                    this.loading = false;
                                    console.log(error);
                                });
                        }
                    })
                    .catch(error => {
                        this.loading = false;
                        useToast().error('حدث خطأ أثناء رفع الملف');
                        console.log(error);
                    });
            }
        },
        async getLink() {
            await axios.get(`/DigitalOcean/PresignedURL?user=Doctor`)
                .then(response => {
                    if (response.status === 200) {
                        this.state.pdf.key = response.data.Key;
                        this.url = response.data.url;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        async getDrSubjects() {
            try {
                const response = await axios.get('/Subjects');
                if (response.status === 200) {
                    this.subjects = response.data.data.map((subject) => ({
                        label: subject.name,
                        value: subject._id
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        },
        handleRemove() {
            this.fileImage = null;
            this.url = '';
        }
    },
    setup() {
        const state = reactive({
            pdf: {
                name: '',
                description: '',
                key: '',
                publishPrice: ''
            }
        });
        const rules = computed(() => {
            return {
                pdf: {
                    name: [required, minLength(3)],
                    publishPrice: [required],
                    description: [required, minLength(10)]
                }
            };
        });
        const v$ = useVuelidate(rules, state);

        return {
            rules, state, v$,
            onlyAllowNumber: (value) => !value || /^\d+$/.test(value),
            noSideSpace: (value) => !/ /g.test(value),
            validator: (x) => x > 0,
        };
    },
    mounted() {
        this.getDrSubjects();
    }
}
</script>

<style scoped>
@import url("@/assets/css/custom.css");

.overflow-auto::-webkit-scrollbar {
    height: .2rem;
}

.overflow-auto::-webkit-scrollbar-track {
    background: #eee;
}

.overflow-auto::-webkit-scrollbar-thumb {
    background: #fff;
}
</style>