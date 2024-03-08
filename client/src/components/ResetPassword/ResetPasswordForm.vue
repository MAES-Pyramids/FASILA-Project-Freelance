<template>
    <div class="col-lg-5 col-md-8 m-auto">
        <div class="card shadow py-1">
            <div class="card-body">
                <n-gradient-text type="primary" size="35"
                    class="fw-semibold text-center m-auto d-flex justify-content-center mb-3">
                    كلمة المرور الجديدة
                </n-gradient-text>
                <form class="d-flex flex-column justify-content-center align-items-center gap-2" @submit.prevent="NewPass">
                    <div class="w-100 d-flex gap-1 flex-column">
                        <n-input v-model:value="state.form.password" placeholder="كلمة المرور الجديدة" class="p-1"
                            showPasswordOn="click" :maxlength="8" type="password" />
                        <!-- small Error Validation -->
                        <small v-if="v$.form.password.$error" class="text-right d-flex w-100 text-danger">
                            {{ v$.form.password.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' :
                                v$.form.password.$errors[0].$message === 'This field should be at least 8 characters long' ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' : v$.form.password.$errors[0].$message === false ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' : 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' }}
                        </small>
                    </div>
                    <div class="w-100 d-flex gap-1 flex-column">
                        <n-input v-model:value="state.form.passwordConfirm" placeholder="تأكيد كلمة المرور الجديدة" class="p-1"
                            showPasswordOn="click" :maxlength="8" type="password" />
                        <!-- small Error Validation -->
                        <small v-if="v$.form.passwordConfirm.$error" class="text-right d-flex w-100 text-danger">
                            <!-- check if required of length of not equal pass -->
                            {{ v$.form.passwordConfirm.$errors[0].$message === 'required' ? 'هذا الحقل مطلوب' :
                                v$.form.passwordConfirm.$errors[0].$message === 'This field should be at least 8 characters long' ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' : v$.form.passwordConfirm.$errors[0].$message === "The value must be equal to the other value" ? 'كلمة المرور غير متطابقة' : v$.form.passwordConfirm.$errors[0].$message === false ? 'كلمة المرور غير متطابقة' : 'كلمة المرور غير متطابقة' }}
                        </small>
                    </div>
                    <n-button type="primary" class="w-100" loading block secondary strong disabled
                        v-if="isLoading"></n-button>
                    <n-button type="primary" class="w-100" @click="NewPass" block secondary strong v-else>
                       تغييـــر
                    </n-button>
                </form>
            </div>
        </div>
        <RouterLink to="/NewPass/ForceNewPass" v-if="ForceEnter">
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
import { NInput, NButton, NGradientText } from 'naive-ui';
import useVuelidate from '@vuelidate/core';
import { required, minLength, sameAs } from '@vuelidate/validators';
import { computed, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { InformationCircleOutline } from "@vicons/ionicons5";
import axios from 'axios';

export default {
    name: "ResetPasswordForm",
    data() {
        return {
            isLoading: false,
        }
    },
    components: {
        NInput,
        NButton,
        NGradientText,
        InformationCircleOutline,
    },
    methods: {
        async NewPass() {
            this.v$.$validate();
            if (!this.v$.$error) {
                this.isLoading = true;
                await axios.patch(`/students/public?resetToken=${this.$store.state.auth.token}`, {
                    password: this.state.form.password,
                }).then((res) => {
                    if (res.status === 200) {
                        this.isLoading = false;
                        this.$router.push('/Login');
                        useToast().success('تم تغيير كلمة المرور بنجاح');
                    }
                }).catch((err) => {
                    useToast().error('حدث خطأ ما');
                    console.log(err);
                    this.isLoading = false;
                });   
            }
        },
    },
    setup() {
        const state = reactive({
            form: {
                password: "",
                passwordConfirm: "",
            }
        });
        const rules = computed(() => {
            return {
                form: {
                    password: [required, minLength(8)],
                    passwordConfirm: [required, minLength(8), sameAs(state.form.password)],
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
