<template>
    <div>
        <!-- <a href="" type="button"> -->
            <img src="../assets/images/telegram.png" alt="telegram" class="position-fixed bottom-0 end-0 m-3 cursor-pointer"
                style="width: 50px; height: 50px; z-index: 1000;"  data-bs-toggle="modal" data-bs-target="#TelegramBot"/>
        <!-- </a> -->

        <!-- Modal -->
        <div class="modal fade" id="TelegramBot" tabindex="-1" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog-centered modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitleId">
                            امسح الكود للإشتراك في قناة التليجرام
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <img src="../assets/images/telegramQr.jpg" alt="telegramQr" class="d-flex w-100 m-auto" />
                            <n-button class="w-100 mt-2" type="primary" size="large" round>
                                <a href="https://t.me/Fasila_libbot" target="_blank" class="text-decoration-none text-white">
                                    أو اضغط هنا للإشتراك
                                </a>
                            </n-button>
                        </div>
                    </div>
                    <div class="modal-footer" v-if="authenticated && user.object.telegramStatus != 'active'">
                        <div class="container-fluid d-flex">
                            <n-button type="primary" tertiary data-bs-target="#Telegram_Bot_2" data-bs-toggle="modal"
                                class="m-auto justify-content-center w-100">
                                ماذا بعد نسخ الكود؟
                            </n-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="Telegram_Bot_2" aria-hidden="true" aria-labelledby="Telegram_Bot_Label2"
            tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="Telegram_Bot_Label2">
                            ماذا بعد نسخ الكود؟
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div v-if="!Success">
                                <h5 class="m-0">
                                    1- 
                                    قم بإدخال الكود الذي سيصلك على التليجرام في الحقل أدناه
                                </h5>
                                <form @submit.prevent="sendTelegramId" class="d-flex">
                                    <!-- Input For telegramId -->
                                    <n-input class="mt-2" placeholder="أدخل الكود هنا" v-model:value="state.form.telegramId"
                                        :allow-input="onlyAllowNumber" :disabled="isLoadingTelegram" />
                                    <!-- Button For Submit -->
                                    <n-button class="mt-2" type="primary" @click="sendTelegramId"
                                        :loading="isLoadingTelegram" :disabled="isLoadingTelegram">
                                        إرسال
                                    </n-button>
                                </form>
                                <small v-if="v$.form.telegramId.$error" class="text-right d-flex w-100 text-danger">
                                    {{ v$.form.telegramId.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : 'هذا الحقل مطلوب' }}
                                </small>
                            </div>
                            <div v-else>
                                <h5 class="m-0">
                                    2- 
                                   ادخل ال OTP الذي سيصلك على التليجرام في الحقل أدناه
                                </h5>
                                <form @submit.prevent="sendOtp" class="d-flex">
                                    <!-- Input For Otp -->
                                    <n-input class="mt-2" placeholder="أدخل الكود الذي وصلك على التليجرام هنا"
                                        v-model:value="state.form.Otp" :allow-input="onlyAllowNumber"
                                        :disabled="isLoadingOtp" />
                                    <!-- Button For Submit -->
                                    <n-button class="mt-2" type="primary" @click="sendOtp" :loading="isLoadingOtp"
                                        :disabled="isLoadingOtp">
                                        إرسال
                                    </n-button>
                                </form>
                                <small v-if="v$.form.Otp.$error" class="text-right d-flex w-100 text-danger">
                                    {{ v$.form.Otp.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' : 'هذا الحقل  مطلوب' }}
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="container-fluid d-flex">
                            <n-button type="primary" tertiary data-bs-target="#TelegramBot" data-bs-toggle="modal"
                                @click="Success = true"
                                class="m-auto w-100">
                                العودة لنسخ الكود مرة أخرى
                            </n-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { NButton, NInput } from "naive-ui";
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, reactive } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { mapGetters } from 'vuex';

export default {
    name: "TelegramSubscribe",
    components: {
        NButton,
        NInput,
    },
    data() {
        return {
            Success: false,
            isLoadingTelegram: false,
            isLoadingOtp: false,
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            authenticated: 'auth/authenticated',
        })  
    },
    methods: {
        async sendTelegramId() {
            this.v$.form.telegramId.$validate();
            if (!this.v$.form.telegramId.$error) {
                this.isLoadingTelegram = true;
                await axios.post(`/Students/TelegramID`, {
                    "telegramId": this.state.form.telegramId
                })
                    .then((res) => {
                        if (res.status === 200) {
                            this.isLoadingTelegram = false;
                            this.Success = true;
                        }
                    })
                    .catch((err) => {
                        if (err.response.status === 400) {
                            this.isLoadingTelegram = false;
                            this.Success = true;
                        }
                    })
            }
        },
        async sendOtp() {
            this.v$.form.Otp.$validate();
            if (!this.v$.form.Otp.$error) {
                this.isLoadingOtp = true;
                await axios.patch(`/Students/TelegramID`, {
                    "otp": this.state.form.Otp
                })
                    .then((res) => {
                        if (res.status === 200) {
                            this.isLoadingOtp = false;
                            this.Success = false;
                            this.state.form.Otp = '';
                            this.state.form.telegramId = '';
                            window.location.reload();
                        }
                    })
                    .catch(() => {
                        this.Success = false;
                        this.isLoadingOtp = false;
                        this.state.form.Otp = '';
                        this.state.form.telegramId = '';
                        useToast().error('ID الذي أدخلته غير صحيح');
                        this.v$.form.Otp.$reset();
                        this.v$.form.telegramId.$reset();
                    })
            }
        },
    },
    setup() {
        const state = reactive({
            form: {
                telegramId: '',
                Otp: ''
            },
        });

        const rules = computed(() => {
            return {
                form: {
                    telegramId: {
                        required,
                    },
                    Otp: {
                        required,
                    },
                },
            };
        });

        const v$ = useVuelidate(rules, state);

        return {
            state,
            v$,
            rules,
            onlyAllowNumber: (value) => !value || /^\d+$/.test(value),
            noSideSpace: (value) => !/ /g.test(value)
        }
    }
}
</script>

<style scoped>
img {
    transition: all 0.3s ease-in-out;
}

img:hover {
    transform: translateY(-5px);
}
</style>