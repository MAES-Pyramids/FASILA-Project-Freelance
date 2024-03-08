<template>
    <div class="col-md-8 col-lg-9 col-sm-12">
        <div class="row">
            <CardLecture />
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import CardLecture from "./CardLecture.vue";

export default defineComponent({
    name: 'ContentLecture',
    components: {
        CardLecture
    },
});
</script>