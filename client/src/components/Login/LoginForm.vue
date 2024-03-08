<template>
    <div class="col-lg-5 col-md-8 m-auto">
        <div class="card shadow py-1">
            <div class="card-body">
                <n-gradient-text type="primary" size="35"
                    class="fw-semibold text-center m-auto d-flex justify-content-center mb-3">
                    تسجيل الدخـــــول
                </n-gradient-text>
                <form class="d-flex flex-column justify-content-center align-items-center gap-2" @submit.prevent="Login">
                    <div class="w-100 d-flex gap-1 flex-column">
                        <n-input v-model:value="state.form.phone" placeholder="رقم الهاتف" :maxlength="11" show-count
                            class="p-1 border-0" :allow-input="onlyAllowNumber"  @keypress="allowOnlyNumber" />
                        <small v-if="v$.form.phone.$error" class="text-right d-flex w-100 text-danger">
                            {{ v$.form.phone.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : 'رقم الهاتف يجب أن يحتوي على 11 رقم على الأقل' }}
                        </small>
                    </div>
                    <div class="w-100 d-flex gap-1 flex-column">
                        <n-input v-model:value="state.form.password" placeholder="كلمة المرور" class="p-1"
                            showPasswordOn="click" :maxlength="8" type="password" :allow-input="noSideSpace" />
                        <small v-if="v$.form.password.$error" class="text-right d-flex w-100 text-danger">
                            {{ v$.form.password.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل' }}
                        </small>
                    </div>
                    <div class="w-100 d-flex justify-content-between flex-wrap">
                        <n-checkbox default-checked>
                            تذكرني
                        </n-checkbox>
                        <router-link to="/forgetPassword" class="text-success">
                            نسيت كلمة المرور؟
                        </router-link>
                    </div>
                    <n-button type="primary" class="w-100" loading block secondary strong disabled
                        v-if="isLoading"></n-button>
                    <n-button type="primary" class="w-100" @click="Login" block secondary strong v-else>
                        تسجيل الدخول
                    </n-button>
                    <router-link to="/register" class="w-100">
                        <n-button type="primary" dashed block class="w-100">
                            أليس لديك حساب؟
                            إنشاء حساب جديد
                        </n-button>
                    </router-link>
                </form>
                <div class="modal" id="VerifyAccount" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
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
                                            <span class="me-2" v-if="counter">
                                                مدة الصلاحية
                                            </span>
                                            <n-countdown :duration="durational" :active="active" ref="countdown"
                                                @finish="counterFinish" v-if="counter" />
                                            <n-button type="primary" class="m-auto d-flex mt-2 px-3" secondary strong
                                                @click="verifyOTP(userId)" v-if="!counter && !active"
                                                :disabled="isLoadingBtn" :loading="isLoadingBtn">
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
        <RouterLink to="/Login/ForceLogin" v-if="ForceEnter">
            <n-button type="error" text block class="w-100 d-flex align-items-center gap-1 bg-white rounded py-2">
                <n-icon>
                    <InformationCircleOutline />
                </n-icon>
                دخول إضرارى
            </n-button>
        </RouterLink>
    </div>
</template>

<script>
import {
    NInput, NButton, NGradientText, NCheckbox, NIcon,
    NCountdown, NSpace
} from 'naive-ui';
import { mapActions } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { computed, reactive } from 'vue';
// import { useToast } from 'vue-toastification';
import { InformationCircleOutline } from "@vicons/ionicons5";
import { useToast } from 'vue-toastification';
import axios from 'axios';
import io from 'socket.io-client';
import bootstrapBundleMin from 'bootstrap/dist/js/bootstrap.bundle.min';

export default {
    name: "LoginForm",
    data() {
        return {
            isLoading: false,
            ForceEnter: false,
            qrCode: {},
            counter: true,
            active: false,
            durational: 60000,
            isLoadingBtn: false,
            userId: "",
        }
    },
    components: {
        NInput,
        NButton,
        NGradientText,
        NCheckbox,
        InformationCircleOutline,
        NIcon,
        NCountdown,
        NSpace
    },
    methods: {
        ...mapActions({
            signIn: 'auth/signIn'
        }),
        Login() {
            this.v$.$validate();
            if (!this.v$.$error) {
                this.isLoading = true;
                let status = this.signIn(
                    {
                        phone: '2' + this.state.form.phone,
                        password: this.state.form.password,
                    }
                );
                status.then((e) => {
                    if (e.data.object.suspended.value === true) {
                        useToast().error('تم تعليق حسابك، يرجى التواصل مع الإدارة');
                    }
                    else if (e.data.object.verified === false && e.data.object.deleted.value === false) {
                        useToast().error('لم يتم تفعيل حسابك بعد، قم بتفعيله الآن');
                        this.userId = e.data.object._id;
                        this.verifyOTP(e.data.object._id);
                    }
                    this.isLoading = false;
                })
                    .catch((err) => {
                        this.isLoading = false;
                        if (err.response.data.message === "user has active session") {
                            useToast().error('لديك جلسة فعالة، يرجى تسجيل الخروج أولاً');
                            this.ForceEnter = true;
                        }
                        else if (err.response.data.message == "Password must contain both letters & numbers.") {
                            useToast().error('كلمة المرور يجب أن تحتوي على أحرف وأرقام');
                        }
                        else if (err.response.status === 401) {
                            useToast().error('رقم الهاتف أو كلمة المرور غير صحيحة');
                        }
                        else {
                            useToast().error('حدث خطأ ما، يرجى المحاولة مرة أخرى');
                        }
                    });
            }
        },
        async verifyOTP(id) {
            this.isLoadingBtn = true;
            await axios.post('/wasage?type=verify', {
                "id": id,
            })
                .then((response) => {
                    if (response.status == 200) {
                        this.userId = id;
                        this.qrCode = response.data.data;
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
                                const modalElement = document.getElementById('VerifyAccount');
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
                .catch(() => {
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
            const modalElement = document.getElementById('VerifyAccount');
            const existingModal = bootstrapBundleMin.Modal.getInstance(modalElement);
            if(!existingModal || !existingModal._isShown) {
                const modal = new bootstrapBundleMin.Modal(modalElement);
                modal.show();
            }
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
    setup() {
        const state = reactive({
            form: {
                phone: "",
                password: "",
            }
        });
        const rules = computed(() => {
            return {
                form: {
                    phone: [required, minLength(11)],
                    password: [required, minLength(8)],
                }
            };
        });
        const v$ = useVuelidate(rules, state);
        return {
            rules, state, v$,
            onlyAllowNumber: (value) => !value || /^\d+$/.test(value),
            noSideSpace: (value) => !/ /g.test(value)
        };
    },
    mounted() {
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
    }
}
</script>

<style scoped>
.QrBlur {
    filter: blur(5px);
    -webkit-filter: blur(5px);
}
</style>