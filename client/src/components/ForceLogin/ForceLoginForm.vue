<template>
    <div class="col-lg-5 col-md-8 m-auto">
        <div class="card shadow py-1">
            <div class="card-body">
                <n-gradient-text type="primary" size="35"
                    class="fw-semibold text-center m-auto d-flex justify-content-center mb-3">
                    دخول إضرارى
                </n-gradient-text>
                <form class="d-flex flex-column justify-content-center align-items-center gap-2" @submit.prevent="Force">
                    <div class="w-100 d-flex gap-1 flex-column">
                        <n-input v-model:value="state.form.phone" placeholder="رقم الهاتف" :maxlength="11" show-count
                            class="p-1 border-0" :allow-input="onlyAllowNumber"  @keypress="allowOnlyNumber" />
                        <small v-if="v$.form.phone.$error" class="text-right d-flex w-100 text-danger">
                            {{ v$.form.phone.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : 'رقم الهاتف يجب أن يحتوي على 11 رقم على الأقل' }}
                        </small>
                    </div>
                    <n-button type="primary" class="w-100" loading block secondary strong disabled
                        v-if="isLoading"></n-button>
                    <n-button type="primary" class="w-100" @click="Force" block secondary strong v-else>
                        دخـــــول
                    </n-button>
                    <router-link to="/Login" class="w-100">
                        <n-button type="primary" dashed block class="w-100">
                            لديك حساب؟ سجل الآن
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
                                            <span class="me-2" v-if="counter">
                                                مدة الصلاحية
                                            </span>
                                            <n-countdown :duration="durational" :active="active" ref="countdown"
                                                v-if="counter" @finish="counterFinish" />
                                            <n-button type="primary" class="m-auto d-flex mt-2 px-3" secondary strong
                                                @click="Retry" v-if="!counter && !active" :disabled="isLoadingBtn"
                                                :loading="isLoadingBtn">
                                                إعادة المحاولة
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
    NInput, NButton, NGradientText,
    NCountdown,
    NIcon
} from 'naive-ui';
import { mapActions } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { computed, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import bootstrapBundleMin from 'bootstrap/dist/js/bootstrap.bundle.min';
import { CheckmarkDone } from '@vicons/ionicons5';
import io from 'socket.io-client';

export default {
    name: "ForceLoginForm",
    data() {
        return {
            isLoading: false,
            qrCode: {},
            active: false,
            durational: 60000,
            isLoadingBtn: false,
            counter: true,
        }
    },
    components: {
        NInput,
        NButton,
        NCountdown,
        NGradientText,
        CheckmarkDone,
        NIcon
    },
    methods: {
        ...mapActions({
            signIn: 'auth/signIn'
        }),
        async Force() {
            this.v$.$validate();
            if (!this.v$.$error) {
                this.isLoading = true;
                await axios.get(`/students/public?mobileNumber=2${this.state.form.phone}`)
                    .then((response) => {
                        if (response.status == 200) {
                            this.userId = response.data._id;
                            const socket = io(`https://fasila.onrender.com/?userId=${response.data._id}`);
                            socket.on('otp-forceLogout', (msg) => {
                                if (msg.status == true) {
                                    const modalElement = document.getElementById('modalId');
                                    const existingModal = bootstrapBundleMin.Modal.getInstance(modalElement);
                                    existingModal.hide();
                                    this.$router.push('/Login');
                                    useToast().success('تم تسجيل الخروج من جميع الأجهزة بنجاح');
                                } else {
                                    useToast().error('رقم الهاتف غير مسجل لدينا');
                                }
                            })
                            this.ForceNow();
                        }
                    })
                    .catch((err) => {
                        if (err.response.status == 404) {
                            useToast().error('رقم الهاتف غير مسجل لدينا');
                        }
                        this.isLoading = false;
                    })
            }
        },
        async ForceNow() {
            this.isLoadingBtn = true;
            axios.post('/wasage?type=force', {
                "id": this.userId
            })
                .then((response) => {
                    if (response.status == 200) {
                        this.qrCode = response.data.data;
                        this.isLoading = false;
                        this.isLoadingBtn = false;
                        this.active = true;
                        this.showModal();
                        this.counter = true;
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.isLoading = false;
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
            // Check if the modal is already visible
            const modalElement = document.getElementById('modalId');
            const existingModal = bootstrapBundleMin.Modal.getInstance(modalElement);

            if (!existingModal || !existingModal._isShown) {
                // Show the modal using Bootstrap modal API
                const modal = new bootstrapBundleMin.Modal(modalElement);
                modal.show();
            }
        },
        Retry() {
            this.ForceNow();
            this.handleReset();
            // When retry -> ref (qr) remov class QrBlur
            this.$refs.qr.classList.remove('QrBlur');
            // When retry -> ref (qrClickable) remov class d-none
            this.$refs.qrClickable.classList.remove('d-none');
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
            form: {
                phone: "",
            }
        });
        const rules = computed(() => {
            return {
                form: {
                    phone: [required, minLength(11)],
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
}
</script>

<style scoped>
.QrBlur {
    filter: blur(5px);
    -webkit-filter: blur(5px);
}
</style>