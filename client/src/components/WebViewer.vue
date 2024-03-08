<template>
    <div id="webviewer" ref="viewer"></div>
    <n-button @click="saveChanges" type="primary" class="position-absolute bottom-0 position-fixed">
        <template #icon>
            <n-icon>
                <Save />
            </n-icon>
        </template>
        <span class="ms-1 d-none d-md-flex">
            حفظ التغييرات
        </span>
    </n-button>
    <div class="loader d-flex text-center justify-content-center flex-column gap-2" v-if="isLoading">
        <n-button loading text type="primary" size="large"></n-button>
        <span class="ms-2 d-none d-md-inline">
            جارى حفظ التعديلات...
        </span>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import WebViewer from '@pdftron/webviewer';
import { Save } from "@vicons/ionicons5";
import axios from 'axios';
import { NButton, NIcon } from 'naive-ui';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';

export default {
    name: 'WebViewer',
    props: {
        initialDoc: {
            type: String,
        },

    },
    setup(props) {
        const viewer = ref(null);
        const isLoading = ref(false);
        const route = useRoute(); // Using useRoute to access the current route

        const saveChanges = async () => {
            isLoading.value = true; // Step 1: Set isLoading to true
            await axios.get('/DigitalOcean/PresignedURL?user=Student')
                .then(async (response) => {
                    if (response.status === 200) {
                        const { Key, url } = response.data;
                        await uploadChanges(Key, url);
                    }
                })
        };

        const uploadChanges = async (Key, url) => {
            const { documentViewer, annotationManager } = window.instance.Core;
            const doc = documentViewer.getDocument();
            const xfdfString = await annotationManager.exportAnnotations();
            const data = await doc.getFileData({
                // saves the document with annotations in it
                xfdfString
            });
            const arr = new Uint8Array(data);
            const blob = new Blob([arr], { type: 'application/pdf' });

            const axiosWithoutInterceptors = axios.create();

            await axiosWithoutInterceptors.put(`${url}`, blob, {
                headers: {
                    Authorization: '', // Setting Authorization header to an empty string
                    'Content-Type': 'application/pdf',
                }
            })
                .then(async (response) => {
                    if (response.status === 200) {
                        const LectureIdToEdit = window.location.href.split('/')[4].split('?')[0];
                        await axios.patch(`/Lectures/${LectureIdToEdit}`, {
                            key: Key
                        })
                            .then((res) => {
                                if (res.status === 200) {
                                    isLoading.value = false; // Step 2: Set isLoading to false
                                    useToast().success('تم حفظ التعديلات بنجاح');
                                    // Go back to the previous page
                                    window.history.back();
                                }
                            })
                            .catch(() => {
                                isLoading.value = false; // Step 2: Set isLoading to false
                                useToast().error('حدث خطأ أثناء حفظ التعديلات');
                            });
                    }
                })
        };

        onMounted(() => {

            const path = `${process.env.BASE_URL}webviewer`;
            const password = atob(route.query.password);

            WebViewer(
                {
                    path,
                    initialDoc: props.initialDoc,
                    licenseKey: 'demo:1705246330523:7f6855c70300000000697bd96159f7d1c609e43e0871ba6314d5616803',
                    // Use disabledElements to hide specific UI elements
                    disabledElements: [
                        'saveButton',
                        'saveAsButton',
                        'downloadButton',
                        'printButton',
                        'openFileButton',
                        'fileAttachmentButton',
                        'printModal',
                        'cropModal',
                        'settingsButton',
                        'menuButton',
                        // crop page
                        'cropPageButton',
                        'cropPagePanel',
                        'cropPageOverlay',
                        'cropPageApply',
                        'cropPageCancel',
                        'cropPageTooltip',
                        'cropPageTooltipText',
                        'cropPageTooltipTail',
                        'cropPageTooltipTailText',
                        'crop*', // remove all crop elements
                        'snippingToolButton',
                        'snippingToolButton',
                        'snippingToolOverlay',
                        'snippingToolHeader',
                        'snippingToolApply',
                        // remove tool-group-buttons-scroll
                        'toolGroup-buttons-scroll',
                        // remove Edit button
                        'editButton',

                    ],
                    // Disable all hotkeys, including keyboard shortcuts
                    disableHotkeys: true,
                    // Disabled Editing in toolbar
                    // enableFilePicker: false,
                    enableRedaction: false,
                    enableTextSelection: false,
                    enableTextAnnotation: false,
                    enableMeasurement: false,
                },

                viewer.value
            )
                .then(async (instance) => {
                    // call APIs here
                    window.instance = instance;

                    if (password) {
                        // Enter Password to open the document if it's password protected (pass i got from route.query.password)
                        // instance.UI.loadDocument(props.initialDoc, { password });
                        await instance.Core.documentViewer.loadDocument(props.initialDoc, { password });
                        await instance.UI.loadDocument(props.initialDoc, { password });
                    }

                    instance.UI.setHeaderItems((header) => {
                        header.push({
                            type: 'actionButton',
                            img: '/save.png',
                            onClick: saveChanges,
                            title: 'حفظ التغييرات',
                        });
                    });

                    instance.UI.disableElements([
                        'cropPageButton',
                        'cropPagePanel',
                        'cropPageOverlay',
                        'cropPageApply',
                        'cropPageCancel',
                        'cropPageTooltip',
                        'cropPageTooltipText',
                        'cropPageTooltipTail',
                        'cropPageTooltipTailText',
                        // remove all crop elements
                        'crop*',
                        // remove Edit button
                        'editButton',
                        'printButton',
                    ]);

                    instance.UI.disableElements(['toolbarGroup-Edit']);

                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error);
                });
        });

        return {
            viewer,
            saveChanges,
            isLoading,
        };
    },
    components: {
        Save,
        NButton,
        NIcon,
    },
}
</script>

<style>
#webviewer {
    height: 100vh;
    width: 100%;
}

.PrintModal {
    display: none !important;
}

.loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    background: #fff;
    width: 100%;
    height: 100%;
    opacity: 0.8;
}

/* Prevent Printing */
@media print {
    * {
        display: none !important;
    }
}
</style>