<template>
  <v-dialog v-model="dialog" fullscreen persistent hide-overlay>
    <v-container fluid>
      <v-toolbar color="primary" dense>
        <v-btn icon @click="close">
          <v-icon>mdi-keyboard-backspace</v-icon>
        </v-btn>
        <v-toolbar-title>User Manual</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="downloadPDF">
          <v-icon>mdi-file-download-outline</v-icon>
        </v-btn>
      </v-toolbar>

      <div class="pdf-container">
        <canvas ref="pdfCanvas"></canvas>
      </div>
    </v-container>
  </v-dialog>
</template>
<script>
import { ref, onMounted, watch } from "vue";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { saveAs } from "file-saver";

// ✅ ตั้งค่า Web Worker ให้ใช้ CDN
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

export default {
  props: {
    modelValue: Boolean, // ใช้ v-model เพื่อเปิด/ปิด dialog
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const dialog = ref(props.modelValue);
    const pdfCanvas = ref(null);
    const error = ref(false);

    const pdfSrc = ref( "https://portal.ip-one.com/Web-Production-Form/UserManual/ProductionForm.pdf");


    const close = () => {
      emit("update:modelValue", false);
    };

    const downloadPDF = () => {
      saveAs(pdfSrc.value, "UserManual ProductionForm.pdf");
    };

    const loadPdf = async () => {
      error.value = false;
      try {
        const loadingTask = getDocument(pdfSrc.value);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const canvas = pdfCanvas.value;
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = { canvasContext: context, viewport: viewport };
        await page.render(renderContext).promise;
      } catch (err) {
        console.error("🚨 PDF Load Error:", err);
        error.value = true;
      }
    };

    onMounted(() => {
      if (dialog.value) {
        loadPdf();
      }
    });

    watch(
      () => props.modelValue,
      (newVal) => {
        dialog.value = newVal;
        if (newVal) {
          loadPdf();
        }
      }
    );

    return { dialog, pdfCanvas, close, downloadPDF, error };
  },
};
</script>

<style scoped>
.pdf-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 56px);
  overflow-y: auto;
}
canvas {
  border: 1px solid #ccc;
}
</style>
