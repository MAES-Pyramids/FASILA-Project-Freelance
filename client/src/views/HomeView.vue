<template>
    <HeaderStudent />
    <TelegramSubscribe />
    <div class="d-flex flex-column">
        <CarouselCards class="mt-5" />
        <div class="container-fluid mb-5">
            <div class="row">
                <AsideBar />
                <ContentHome />
                <ModalCrousel />
            </div>
        </div>
        <FooterUser />
    </div>
</template>

<script>
import FooterUser from '@/components/FooterUser.vue';
import AsideBar from '@/components/Home/AsideBar.vue';
import CarouselCards from '@/components/Home/CarouselCards.vue'
import ContentHome from '@/components/Home/Content.vue';
import TelegramSubscribe from '@/components/Telegram.vue';
import HeaderStudent from '@/components/Header.vue';
import ModalCrousel from '@/components/Home/ModalCrousel.vue';

export default {
    name: 'HomeView',
    components: {
        CarouselCards,
        AsideBar,
        ContentHome,
        FooterUser,
        TelegramSubscribe,
        HeaderStudent,
        ModalCrousel,
    },
}
</script>

<style lang="scss" scoped></style>