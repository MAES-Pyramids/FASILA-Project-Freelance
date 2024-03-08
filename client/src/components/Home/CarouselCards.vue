<template>
    <n-carousel effect="custom" draggable :transition-props="{ name: 'creative' }" show-arrow
        style="width: 100%; height: 240px" dot-type="line" :autoplay="true" :autoplay-speed="3000" dir="ltr">
        <div class="d-flex flex-column justify-content-center align-items-center rounded h-100 bg-light text-center">
            <h2>
                ترقبوا قريباً المزيد من التوسعات من خلال موقعنا الإلكتروني
                إن شاء الله
            </h2>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center rounded h-100 bg-light text-center">
            <h2>
                قووووووم ذاكر ولا تتأخر عن الدراسة لأن الإمتحانات السنادى صعبة
            </h2>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center rounded h-100 bg-light text-center">
            <h2>
              أحلى مساااااااااااااااااااااااااااااااااااااااااا
            </h2>
        </div>
    </n-carousel>
</template>

<script>
import { NCarousel } from 'naive-ui'
export default {
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