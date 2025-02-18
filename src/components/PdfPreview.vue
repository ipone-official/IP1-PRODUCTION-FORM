<template>
  <v-dialog v-model="dialog" fullscreen persistent hide-overlay>
    <v-container fluid class="pdf-container">
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

      <div class="pdf-viewer">
        <div v-if="error" class="error-message">⚠️ ไม่สามารถโหลดไฟล์ PDF ได้</div>
        <div
          v-else
          v-for="(canvas, index) in pdfCanvases"
          :key="index"
          class="canvas-container"
        >
          <canvas :ref="(el) => (pdfCanvases[index] = el)"></canvas>
        </div>
      </div>
    </v-container>
  </v-dialog>
</template>

<script>
import { ref, onMounted, watch, nextTick } from "vue";
import axios from "axios";
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
    const pdfInstance = ref(null); // ✅ เก็บ PDF Object เพื่อไม่ให้โหลดซ้ำ
    const scale = ref(2.0); // ✅ ปรับค่า scale ให้ใหญ่ขึ้น

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
        // ✅ ใช้ axios โหลด PDF
        const response = await axios.get(pdfSrc.value, { responseType: "arraybuffer" });
        const pdfData = new Uint8Array(response.data);

        // ✅ โหลด PDF จาก memory
        const loadingTask = getDocument({ data: pdfData });
        pdfInstance.value = await loadingTask.promise;
        numPages.value = pdfInstance.value.numPages;

        await nextTick(); // ✅ ให้ Vue อัปเดต DOM ก่อนวาด PDF

        for (let i = 1; i <= numPages.value; i++) {
          const page = await pdfInstance.value.getPage(i);
          const viewport = page.getViewport({ scale: scale.value });

          if (pdfCanvases.value[i - 1]) {
            const canvas = pdfCanvases.value[i - 1];
            const context = canvas.getContext("2d");

            // ✅ ปรับขนาด canvas ให้เต็มจอ
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = "100%";
            canvas.style.height = "auto";

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
      async (newVal) => {
        dialog.value = newVal;
        if (newVal) {
          await loadPdf();
        }
      }
    );

    return { dialog, pdfCanvases, close, downloadPDF, error, numPages };
  },
};
</script>

<style scoped>
/* ✅ ปรับ PDF ให้เต็มจอ และเลื่อนดูได้ */
.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  background-color: #f4f4f4;
  padding-bottom: 20px;
}

.pdf-viewer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

canvas {
  border: 1px solid #ccc;
  max-width: 100%;
  height: auto;
}

.error-message {
  color: red;
  text-align: center;
  font-size: 18px;
  padding: 20px;
}
</style>
