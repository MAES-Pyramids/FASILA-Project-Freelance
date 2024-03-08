<template>
    <div class="col-md-8 col-lg-9 col-sm-12">
        <div class="row">
            <CardDoctor />
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { LogoSlack } from "@vicons/ionicons5";
import CardDoctor from "./CardDoctor.vue";

export default defineComponent({
    name: 'ContentDoctor',
    components: {
        CardDoctor
    },
    setup() {
        return {
            LogoSlack
        };
    }
});
</script>