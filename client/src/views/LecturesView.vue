<template>
    <HeaderStudent />
    <TelegramSubscribe />
    <div class="d-flex flex-column">
        <CarouselCards class="mt-5" />
        <div class="container-fluid mb-5">
            <div class="row">
                <AsideBar />
                <ContentLecture />
            </div>
        </div>
        <FooterUser />
    </div>
</template>

<script>
import FooterUser from '@/components/FooterUser.vue';
import AsideBar from '@/components/Home/AsideBar.vue';
import CarouselCards from '@/components/Home/CarouselCards.vue'
import ContentLecture from '@/components/Home/ContentLecture.vue';
import TelegramSubscribe from '@/components/Telegram.vue';
import HeaderStudent from '@/components/Header.vue';

export default {
    name: 'HomeView',
    components: {
        CarouselCards,
        AsideBar,
        FooterUser,
        ContentLecture,
        TelegramSubscribe,
        HeaderStudent
    }
}
</script>

<style lang="scss" scoped></style>