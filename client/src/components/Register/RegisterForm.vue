<template>
    <div class="col-xl-6 col-md-8 m-auto">
        <div class="card shadow py-1">
            <div class="card-body">
                <n-gradient-text type="primary" size="35"
                    class="fw-semibold text-center m-auto d-flex justify-content-center mb-3">
                    إنشاء حساب جديد
                </n-gradient-text>
                <form class="d-flex flex-column justify-content-center align-items-center gap-2 mt-2"
                    @submit.prevent="Register" @remove="handleRemove">
                    <n-upload directory-dnd :max="1" with-credentials @change="handleChange"
                        accept="image/png, image/jpeg, image/jpg"
                    >
                        <n-upload-dragger>
                            <div style="margin-bottom: 12px">
                                <n-icon size="48" :depth="3">
                                    <ArchiveSharp />
                                </n-icon>
                            </div>
                            <n-text style="font-size: 16px">
                                اضغط أو اسحب لتحميل الصورة
                            </n-text>
                            <n-p depth="3" style="margin: 8px 0 0 0">
                                يرجى رفع صورة الكارنية الجامعي بكل وضوح
                            </n-p>
                        </n-upload-dragger>
                    </n-upload>
                    <div class="d-flex w-100 gap-2">
                        <div class="d-flex gap-1 flex-column w-100">
                            <n-input v-model:value="state.register.first_name" placeholder="الإسم الأول" :minlength="2" :maxlength="25"
                                class="border-0"  size="large" />
                            <!-- small Error Validation -->
                            <small v-if="v$.register.first_name.$error" class="text-right d-flex w-100 text-danger">
                                {{ v$.register.first_name.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : v$.register.first_name.$errors[0].$message === 'This field should be at least 2 characters long' ? 'يجب أن يحتوي الاسم على حرفين على الأقل' : v$.register.first_name.$errors[0].$message === 'This field should be at most 25 characters long' ? 'يجب أن يحتوي الاسم على 25 حرف على الأكثر' : v$.register.first_name.$errors[0].$message === false ? 'يجب أن يحتوي الاسم على حرفين على الأقل' : 'يجب أن يحتوي الاسم على حرفين على الأقل' }}
                            </small>
                        </div>
                        <div class="d-flex gap-1 flex-column w-100">
                            <n-input v-model:value="state.register.last_name" placeholder="الإسم الثانى" :minlength="2" :maxlength="25"
                                class="border-0"  size="large" />
                            <!-- small Error Validation -->
                            <small v-if="v$.register.last_name.$error" class="text-right d-flex w-100 text-danger">
                                {{ v$.register.last_name.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : v$.register.last_name.$errors[0].$message === 'This field should be at least 2 characters long' ? 'يجب أن يحتوي الاسم على حرفين على الأقل' : v$.register.last_name.$errors[0].$message === 'This field should be at most 25 characters long' ? 'يجب أن يحتوي الاسم على 25 حرف على الأكثر' : v$.register.last_name.$errors[0].$message === false ? 'يجب أن يحتوي الاسم على حرفين على الأقل' : 'يجب أن يحتوي الاسم على حرفين على الأقل' }}
                            </small>
                        </div>
                    </div>
                    <div class="w-100 d-flex gap-1 flex-column">
                        <n-input v-model:value="state.register.phone" placeholder="رقم الهاتف (010, 011, 012, 015)" :maxlength="11" show-count
                            class="border-0" @keypress="allowOnlyNumber" size="large" />
                        <!-- small Error Validation -->
                        <small v-if="v$.register.phone.$error" class="text-right d-flex w-100 text-danger">
                            {{ v$.register.phone.$errors[0].$message == 'Value is required' ? 'هذا الحقل مطلوب' : v$.register.phone.$errors[0].$message == 'This field should be at least 11 characters long' ? 'يجب أن يحتوي رقم الهاتف على 11 رقم' : v$.register.phone.$errors[0].$message == false ? 'يجب أن يحتوي رقم الهاتف على 11 رقم' : 'يجب أن يحتوي رقم الهاتف على أرقام فقط' }}
                        </small>
                    </div>
                    <n-radio-group v-model:value="value" name="radiogroup">
                        <n-space>
                            <n-radio v-for="song in songs" :key="song.value" :value="song.value" :label="song.label" />
                        </n-space>
                    </n-radio-group>
                    <div class="w-100 d-flex gap-1 flex-column">
                        <n-select
                            :options="options" size="large" 
                            placeholder="الجامعة"
                            @change="getAllUniversity" />
                    </div>
                    <div class="w-100 d-flex gap-1 flex-column">
                        <n-select
                            @change="getFacultyById"
                            :options="faculty"
                            placeholder="الكلية"
                            size="large" 
                            :disabled="!selectedUniversity"
                            v-model:value="state.register.faculty"
                        />
                        <!-- Error Validation -->
                        <small v-if="v$.register.faculty.$error" class="text-right d-flex w-100 text-danger">
                        {{ v$.register.faculty.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : v$.register.faculty.$errors[0].$message === false ? 'يجب أن تختار الكلية' : 'يجب أن تختار الكلية' }}
                        </small>
                    </div>
                    <div class="w-100">
                        <n-select
                            v-model:value="state.register.semester"
                            placeholder="السميستر"
                            :options="semester" size="large" 
                        />
                    </div>
                    <div class="w-100 d-flex gap-1 flex-column">
                        <n-input v-model:value="state.register.password" placeholder="كلمة المرور"
                            showPasswordOn="click" :maxlength="8" type="password" size="large" />
                        <!-- small Error Validation -->
                        <small v-if="v$.register.password.$error" class="text-right d-flex w-100 text-danger">
                            {{ v$.register.password.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : v$.register.password.$errors[0].$message === 'This field should be at least 8 characters long' ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' : v$.register.password.$errors[0].$message === false ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' : 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' }}
                        </small>
                    </div>
                    <div class="w-100 d-flex gap-1 flex-column">
                        <n-input v-model:value="state.register.passwordConfirm" placeholder="تأكيد كلمة المرور"
                            showPasswordOn="click" :maxlength="8" type="password" size="large"  />
                        <!-- small Error Validation -->
                        <small v-if="v$.register.passwordConfirm.$error" class="text-right d-flex w-100 text-danger">
                            {{ v$.register.passwordConfirm.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : v$.register.passwordConfirm.$errors[0].$message === 'This field should be at least 8 characters long' ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' : v$.register.passwordConfirm.$errors[0].$message === false ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' : 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' }}
                        </small>
                    </div>
                    <n-button type="primary" class="w-100" loading block secondary strong disabled
                        v-if="isLoading"></n-button>
                    <n-button type="primary" class="w-100" @click="Register" block secondary strong v-else>
                        إنشاء حساب جديد
                    </n-button>
                    <router-link to="/login" class="w-100">
                        <n-button type="primary" dashed block class="w-100">
                            لديك حساب بالفعل؟ تسجيل الدخول
                        </n-button>
                    </router-link>
                </form>

                <div class="modal" id="modalId" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
                    role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modalTitleId">
                                    تفعيل الحساب
                                </h5>
                            </div>
                            <div class="modal-body py-4">
                                <div class="d-flex flex-column m-auto justify-content-center ">
                                    <div class="d-flex m-auto flex-column">
                                        <img :src="qrCode.QR" alt="QR Code" class="w-75 m-auto" loading="lazy" ref="qr" />
                                        <div class="mt-1 w-75 m-auto">
                                            <h5>
                                                <n-icon size="18">
                                                    <CheckmarkDone />
                                                </n-icon>
                                                قم بفتح الواتساب الخاص بك
                                            </h5>
                                            <h5>
                                                <n-icon size="18">
                                                    <CheckmarkDone />
                                                </n-icon>
                                                اختر القائمة المنسدلة أو الإعدادات
                                            </h5>
                                            <h5>
                                                <n-icon size="18">
                                                    <CheckmarkDone />
                                                </n-icon>
                                                اضغط على ال QR Code
                                            </h5>
                                            <h5>
                                                <n-icon size="18">
                                                    <CheckmarkDone />
                                                </n-icon>
                                                ثم قم بالمسح على ال QR Code
                                            </h5>
                                        </div>
                                    </div>
                                    <a :href="qrCode.Clickable" target="_blank" ref="qrClickable">
                                        <n-button type="primary" class="m-auto d-flex mt-2 px-3" secondary strong>
                                            أو اضغط هنا
                                        </n-button>
                                    </a>
                                    <hr class="mb-1" /> 
                                    <n-space class="d-flex m-auto mt-2">
                                        <span style="font-variant-numeric: tabular-nums">
                                           <span class="me-2"  v-if="counter">
                                             مدة الصلاحية 
                                           </span>
                                            <n-countdown :duration="durational" :active="active" ref="countdown" @finish="counterFinish"  v-if="counter"
                                            />
                                            <n-button type="primary" class="m-auto d-flex mt-2 px-3" secondary strong @click="verifyOTP(refreshQr)" v-if="!counter && !active"  :disabled="isLoadingBtn" :loading="isLoadingBtn">
                                            إعادة الإرسال
                                            </n-button>
                                        </span>
                                    </n-space>
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
import {
    NInput, NButton, NGradientText, NRadioGroup, NSpace, NRadio, NUpload, NUploadDragger, NIcon, NText, NP, NCountdown,
    NSelect
} from 'naive-ui';
import { useVuelidate } from '@vuelidate/core';
import { maxLength, minLength, numeric, required, sameAs } from '@vuelidate/validators';
import { reactive, computed } from 'vue';
import { ArchiveSharp, CheckmarkDone } from '@vicons/ionicons5';
import { defineComponent } from 'vue';
import axios from 'axios';
import bootstrapBundleMin from 'bootstrap/dist/js/bootstrap.bundle.min';
import { useToast } from 'vue-toastification';
import io from 'socket.io-client';

export default defineComponent({
    name: "RegisterForm",
    components: {
        NInput,
        NButton,
        NGradientText,
        NRadioGroup,
        NSpace,
        NRadio,
        NUpload,
        NUploadDragger,
        NIcon,
        NText,
        NP,
        ArchiveSharp,
        CheckmarkDone,
        NCountdown,
        NSelect,
    },
    data() {
        return {
            songs: [
                { value: 'male', label: 'ذكر' },
                { value: 'female', label: 'أنثى' },
            ],
            value: 'male',
            qrCode: {},
            isLoading: false,
            active: false,
            refreshQr: "",
            durational: 60000,
            isLoadingBtn: false,
            counter: true,
            options: [],
            faculty: [],
            selectedUniversity: '',
            userId: '',
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
        }
    },
    methods: {
        async Register() {
            if(this.state.register.facultyCard == "") {
                useToast().error('يجب رفع صورة الكارنية الجامعية');
                return;
            }
            this.state.register.gender = this.value;
            this.v$.$validate();
            if (!this.v$.$error) {
                this.isLoading = true;
                // form data
                const formData = new FormData();
                formData.append('first_name', this.state.register.first_name);
                formData.append('last_name', this.state.register.last_name);
                formData.append('phone', "2" + this.state.register.phone);
                formData.append('password', this.state.register.password);
                formData.append('facultyCard', this.state.register.facultyCard);
                formData.append('gender', this.state.register.gender);
                formData.append('semester', this.state.register.semester);
                formData.append('faculty', this.state.register.faculty);

                await axios.post('/Students/signup', formData)
                    .then((response) => {
                        if (response.status == 200) {
                            this.verifyOTP(response.data.data._id);
                            this.refreshQr = response.data.data._id;
                            this.userId = response.data.data._id;
                            this.isLoading = false;
                        }
                    })
                    .catch((err) => {
                        this.isLoading = false;
                        if (err.response.data.message == "Password must contain both letters and numbers.") {
                            useToast().error('كلمة المرور يجب أن تحتوي على حروف وأرقام');
                        } 
                        else if (err.response.data.message == "Phone number already exists") {
                            useToast().error('رقم الهاتف موجود بالفعل');
                        }
                        else {
                            useToast().error('حدث خطأ ما');
                        }
                    });
            }
        },
        handleChange(file) {
            if (file && file.fileList && file.fileList.length > 0 && file.fileList[0].file) {
                this.state.register.facultyCard = file.fileList[0].file;
            }
        },
        async verifyOTP(id) {
            this.isLoadingBtn = true;
            await axios.post('/wasage?type=verify', {
                "id": id,
            })
                .then((response) => {
                    if (response.status == 200) {
                        this.qrCode = response.data.data;
                        this.state.register.first_name = "";
                        this.state.register.last_name = "";
                        this.state.register.phone = "";
                        this.state.register.faculty = "";
                        this.state.register.facultyCard = "";
                        this.value = "";
                        this.state.register.semester = "1";
                        this.state.register.password = "";
                        this.state.register.passwordConfirm = "";
                        // Reset Validation
                        this.v$.$reset();
                        this.showModal();
                        this.durational = 60000;
                        this.active = true;
                        this.counter = true;
                        this.isLoadingBtn = false;
                        this.handleReset();
                        // When retry -> ref (qr) remov class QrBlur
                        this.$refs.qr.classList.remove('QrBlur');
                        // When retry -> ref (qrClickable) remov class d-none
                        this.$refs.qrClickable.classList.remove('d-none');
                        const socket = io(`https://fasila.onrender.com/?userId=${this.userId}`);
                        socket.on('otp-verify', (msg) => {
                            if (msg.status == true) {
                                const modalElement = document.getElementById('modalId');
                                const existingModal = bootstrapBundleMin.Modal.getInstance(modalElement);
                                existingModal.hide();
                                this.$router.push('/Login');
                                useToast().success('تم تفعيل الحساب بنجاح');
                            } else {
                                useToast().error('رقم الهاتف غير مسجل لدينا');
                            }
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.isLoadingBtn = false;
                })
        },
        handleReset() {
            this.counter = true;
            if (this.$refs.countdown) {
                this.$refs.countdown.reset();
            }
        },
        counterFinish() {
            this.active = false;
            this.counter = false;
        },
        showModal() {
            const modalElement = document.getElementById('modalId');
            const existingModal = bootstrapBundleMin.Modal.getInstance(modalElement);

            if (!existingModal || !existingModal._isShown) {
                // Show the modal using Bootstrap modal API
                const modal = new bootstrapBundleMin.Modal(modalElement);
                modal.show();
            }
        },
        async getAllUniversity(e) {
            try {
                const response = await axios.get('/Universities');
                if (response.status === 200) {
                    this.options = response.data.data.map(university => ({ value: university._id, label: university.name }));
                    if (e) {
                        this.getFacultyByUniversity(e);
                        this.selectedUniversity = e;
                        this.state.register.faculty = "";
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
            this.state.register.faculty = id;
        },

        handleRemove() {
            this.state.register.facultyCard = "";
        },

        allowOnlyNumber(e) {
            // Allow only numbers with start 011 or 012 or 010 or 015
            if (e.target.value.length === 0) {
                if (e.key !== "0") {
                    e.preventDefault();
                }
            }
            if (e.target.value.length === 1) {
                if (e.key !== "1") {
                    e.preventDefault();
                }
            }
            if (e.target.value.length === 2) {
                if (e.key !== "1" && e.key !== "2" && e.key !== "0" && e.key !== "5") {
                    e.preventDefault();
                }
            }
        },
    },
    mounted() {
        this.getAllUniversity();
        // When active 0 -> ref (qr) add class QrBlur
        this.$watch(() => this.active, (newVal) => {
            if (newVal == false) {
                this.$refs.qr.classList.add('QrBlur');
            }
        })
        // When active 0 -> ref (qrClickable) add class d-none
        this.$watch(() => this.active, (newVal) => {
            if (newVal == false) {
                this.$refs.qrClickable.classList.add('d-none');
            }
        })
    },
    setup() {
        const state = reactive({
            register: {
                first_name: "",
                last_name: "",
                phone: "",
                faculty: "",
                gender: "",
                facultyCard: "",
                semester: "1",
                password: "",
                passwordConfirm: ""
            }
        });
        const rules = computed(() => {
            return {
                register: {
                    first_name: [required, minLength(2), maxLength(25)],
                    last_name: [required, minLength(2), maxLength(25)],
                    phone: [ required, minLength(11), numeric],
                    faculty: [ required ],
                    gender: [required],
                    facultyCard: [ required ],
                    semester: [ required ],
                    password: [ required, minLength(8)],
                    passwordConfirm: [ required, minLength(8), sameAs(state.register.password)]
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
    }
});
</script>

<style scoped>
@import url('../../assets/css/custom.css');
.QrBlur{
    filter: blur(5px);
    -webkit-filter: blur(5px);
}
</style>