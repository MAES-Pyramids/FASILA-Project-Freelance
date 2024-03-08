<template>
    <footer class="position-absolute start-0 end-0 bottom-0">
        <n-alert type="default" class="text-center" :show-icon="false">
            <span>
                كل الحقوق محفوظة لدى منصة فسيلة
            </span>
            {{ new Date().getFullYear() }} &copy;
        </n-alert>
    </footer>
</template>

<script>
import { defineComponent } from "vue";
import { NAlert } from "naive-ui";

export default defineComponent({
    name: "FooterUser",
    components: {
        NAlert
    }
});
</script>

<style lang="scss" scoped></style>