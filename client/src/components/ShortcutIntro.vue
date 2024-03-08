<template>
    <div>
        <!-- Button -->
        <n-button tertiary data-bs-toggle="modal" data-bs-target="#ShortcutModal" class="w-100 bg-white">
            تجربة أفضل للمستخدم
        </n-button>
        <!-- Modal -->
        <div class="modal fade" id="ShortcutModal" tabindex="-1" role="dialog" aria-labelledby="modalTitleId"
            aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered " role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-center">
                            يمكنك الإستمتاع بتجربة أفضل عند إضافة فسيلة إلى الشاشة الرئيسية
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body row rounded">
                        <div class="d-flex">
                            <img src="../assets/images/step1.jpg" alt="step1" class="col-6" />
                            <img src="../assets/images/step2.jpg" alt="step2" class="col-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { NButton } from 'naive-ui';
export default {
    name: "ShortcutIntro",
    components: {
        NButton
    }
}
</script>

<style scoped>
img {
    max-height: 700px;
}
</style>