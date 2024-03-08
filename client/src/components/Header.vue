<template>
    <div class="w-100 d-flex m-auto justify-content-center bg-white shadow py-2 position-fixed top-0"
        style="z-index: 1000;">
        <div class="d-sm-flex gap-1 flex-column position-absolute start-0 mx-2 d-none" style="margin-top: -8px;">
            <h5 class="m-0">
                <n-button circle type="primary" class="btn_statistics">
                    {{ doctors === 0 ? '0' : doctors }}
                </n-button>
            </h5>
            <h5 class="m-0">
                <n-button circle type="primary" class="btn_statistics_Student">
                    {{ students === 0 ? '0' : students }}
                </n-button>
            </h5>
        </div>
        <img src="../assets/images/logo.png" alt="Fasila" class="d-flex m-auto"
            style="object-fit: contain; height: 60px;" />
    </div>
</template>

<script>
import axios from 'axios';
import { NButton } from 'naive-ui';
import { mapGetters } from 'vuex';

export default {
    name: "HeaderStudent",
    data() {
        return {
            doctors: "",
            students: ""
        };
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    },
    methods: {
        async getAllDrs() {
            await axios.get('/statistics/DoctorsNumber')
                .then((response) => {
                    this.doctors = response.data.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        async getAllStudent() {
            await axios.get('/statistics/StudentsNumber')
                .then((response) => {
                    this.students = response.data.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    },
    mounted() {
        this.getAllDrs();
        this.getAllStudent();
    },
    components: {
        NButton
    }
}
</script>

<style scoped>
.btn_statistics::before {
    content: "دكتور";
    font-size: 15px;
    position: absolute;
    top: 0px;
    left: -80px;
    background-color: rgba(24, 160, 88, 0.12);
    color: #36ad6a;
    padding: 10px 40px 10px 30px;
    border-radius: 40px;
    font-weight: 600;
}

.btn_statistics_Student::before {
    content: "طـالب";
    font-size: 15px;
    position: absolute;
    top: 0px;
    left: -80px;
    background-color: rgba(24, 160, 88, 0.12);
    color: #36ad6a;
    padding: 10px 40px 10px 30px;
    border-radius: 40px;
    font-weight: 600;
}
</style>