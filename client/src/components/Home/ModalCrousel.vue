<template>
    <div class="modal fade" id="Finiance" tabindex="-1" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content bg-transparent">
                <div class="modal-body">
                    <CarouselAsideBar />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import bootstrapBundleMin from 'bootstrap/dist/js/bootstrap.bundle.min';
import CarouselAsideBar from './CarouselAsideBar.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'ModalCrousel',
    components: { CarouselAsideBar },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            authenticated: 'auth/authenticated'
        })
    },
    mounted() {
        // When load show the modal only one time in SessionStorage
        if (this.authenticated) {
            if (sessionStorage.getItem('modal') === null) {
                const myModal = new bootstrapBundleMin.Modal(document.getElementById('Finiance'));
                myModal.show();
                sessionStorage.setItem('modal', 'true');
            }
        }
    }
}
</script>