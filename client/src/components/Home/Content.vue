<template>
    <div class="col-md-8 col-lg-9 col-sm-12">
        <div class="row">
            <CardSubject />
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import CardSubject from './CardSubject.vue';

export default defineComponent({
    name: 'ContentHome',
    components: {
        CardSubject,
    },
});
</script>