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
        <div v-if="error" class="error-message">⚠️ ไม่สามารถโหลดไฟล์ PDF ได้</div>
        <div v-else v-for="(canvas, index) in pdfCanvases" :key="index">
          <canvas :ref="(el) => (pdfCanvases[index] = el)"></canvas>
        </div>
      </div>
    </v-container>
  </v-dialog>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { saveAs } from "file-saver";

// ✅ ใช้ CDN Worker
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

export default {
  props: {
    modelValue: Boolean, // ใช้ v-model เพื่อเปิด/ปิด dialog
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const dialog = ref(props.modelValue);
    const error = ref(false);
    const pdfCanvases = ref([]); // เก็บ <canvas> แต่ละหน้า
    const numPages = ref(0);
    const scale = ref(2.0); // ✅ ปรับค่า scale ให้ใหญ่ขึ้น (ค่าเดิมคือ 1.5)

    const pdfSrc = ref(
      "https://portal.ip-one.com/Web-Production-Form/UserManual/ProductionForm.pdf"
    );

    const close = () => {
      emit("update:modelValue", false);
    };

    const downloadPDF = () => {
      saveAs(pdfSrc.value, "UserManual_ProductionForm.pdf");
    };

    const loadPdf = async () => {
      error.value = false;
      try {
        const loadingTask = getDocument(pdfSrc.value);
        const pdf = await loadingTask.promise;
        numPages.value = pdf.numPages;

        for (let i = 1; i <= numPages.value; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: scale.value }); // ✅ ใช้ scale ที่ใหญ่ขึ้น

          // หา canvas ตาม index ที่ถูกต้อง
          if (pdfCanvases.value[i - 1]) {
            const canvas = pdfCanvases.value[i - 1];
            const context = canvas.getContext("2d");

            // ✅ ปรับขนาด canvas ตาม scale
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = { canvasContext: context, viewport: viewport };
            await page.render(renderContext).promise;
          }
        }
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

    return { dialog, pdfCanvases, close, downloadPDF, error };
  },
};
</script>

<style scoped>
.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}
canvas {
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
.error-message {
  color: red;
  text-align: center;
  font-size: 18px;
}
</style>
