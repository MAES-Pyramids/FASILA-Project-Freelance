<template>
    <n-carousel effect="custom"
    :transition-props="{ name: 'creative' }" draggable
    class="rounded" style="width: 100%; height: 240px"
        dot-type="line" dot-placement="bottom" :autoplay="true" :autoplay-speed="3000" dir="ltr">
        <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg">
        <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg">
    </n-carousel>
</template>

<script>
import { NCarousel } from 'naive-ui'
export default {
    name: 'CarouselAsideBar',
    components: {
        NCarousel,
    }
}
</script>

<style scoped>
.carousel-img {
    width: 100%;
    height: 240px;
    object-fit: cover;
}

:deep(.creative-enter-from),
:deep(.creative-leave-to) {
    opacity: 0;
    transform: scale(0.8);
}

:deep(.creative-enter-active),
:deep(.creative-leave-active) {
    transition: all 0.3s ease;
}
</style>