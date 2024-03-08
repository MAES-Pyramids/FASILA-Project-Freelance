<template>
    <div>
        <WebViewer :initialDoc="pdfLink" />
    </div>
</template>

<script>
import WebViewer from '@/components/WebViewer.vue';

export default {
    name: 'PDFView',
    components: {
        WebViewer,
    },
    // data() {
    //     return {
    //         pdfLink: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
    //     };
    // },
    props: {
        pdfLink: {
            type: String,
            default: '',
        },
    },
};
</script>

<style lang="scss" scoped></style>
