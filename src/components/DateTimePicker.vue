<template>
    <div class="input-group">
      <input
        id="datetime"
        ref="datetime"
        type="text"
        :value="formattedDateTime"
        readonly
        placeholder="Select Date & Time"
        class="datetime-input"
      />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      value: {
        type: Date,
        default: () => new Date(), // ค่าเริ่มต้นเป็นเวลาปัจจุบัน
      },
    },
    data() {
      return {
        selectedDateTime: this.value, // ใช้ค่าเริ่มต้นจาก Props
        intervalId: null,
      };
    },
    computed: {
      formattedDateTime() {
        if (!this.selectedDateTime) return "-";
        const date = this.selectedDateTime;
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      },
    },
    watch: {
      selectedDateTime(newVal) {
        this.$emit("input", newVal); // ส่งค่ากลับไปยัง Parent เมื่อเวลาเปลี่ยน
      },
    },
    mounted() {
      this.startRealTimeClock();
    },
    beforeUnmount() {
      clearInterval(this.intervalId);
    },
    methods: {
      startRealTimeClock() {
        this.intervalId = setInterval(() => {
          const now = new Date();
          this.selectedDateTime = new Date(
            now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
          );
        }, 1000);
      },
    },
  };
  </script>
  
  <style scoped>
  .datetime-input {
    font-size: 1.2rem;
    padding: 10px;
    border: 2px solid #007fc4;
    border-radius: 4px;
    background-color: #f9f9f9;
    cursor: not-allowed;
    color: #2397b4;
    width: 100%;
    text-align: center;
  }
  </style>
  