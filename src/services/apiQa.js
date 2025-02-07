// src/services/apiService.js
import axios from 'axios';

// สร้าง instance ของ axios เพื่อกำหนดค่า base URL และ config เบื้องต้น
const api = axios.create({
  baseURL: 'https://localhost:44349/', // เปลี่ยน URL เป็น API ที่คุณต้องการ
  timeout: 0, // ตั้งค่า timeout สำหรับการเชื่อมต่อ (หน่วยเป็นมิลลิวินาที)
  headers: {
    'Content-Type': 'application/json',
  },
});

export const gLineProcess = async () => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gLineProcess`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gLineProcess:', error);
      throw error;
    }
  };

export const gVendor = async () => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gVendor`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gVendor:', error);
      throw error;
    }
  };
  export const gPreparing = async (lineProcessId) => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gPreparing?LineProcessID=${lineProcessId}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gPreparing:', error);
      throw error;
    }
  };
  export const gLineClearance = async (lineProcessId) => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gLineClearance?LineProcessID=${lineProcessId}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gLineClearance:', error);
      throw error;
    }
  };
  export const gMaterialMaster = async () => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gMaterialMaster`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gMaterialMaster:', error);
      throw error;
    }
  };

  export const gReasonDetail = async (lineProcessId) => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gReasonDetail?LineProcessID=${lineProcessId}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gReasonDetail:', error);
      throw error;
    }
  };

  export const gRandomDetect = async (lineProcessId) => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gRandomDetect?LineProcessID=${lineProcessId}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gRandomDetect:', error);
      throw error;
    }
  };

  export const gTReasonDetail = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gTReasonDetail?FormID=${FormID}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTReasonDetail:', error);
      throw error;
    }
  };

  export const gTLineClearance = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gTLineClearance?FormID=${FormID}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTLineClearance:', error);
      throw error;
    }
  };

  export const gTPreparing = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gTPreparing?FormID=${FormID}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTPreparing:', error);
      throw error;
    }
  };

  export const pUploadFileBatchNo = async (file, FormID, LineProcessID, ReasonID, ReasonDescID, VendorID, VendorDesc, UpdateBy) => {
    try {
      // ตรวจสอบว่าไฟล์ไม่ว่างเปล่า
      if (!file) {
        throw new Error("No file provided for upload.");
      }
  
      // สร้าง FormData และเพิ่มไฟล์เข้าไป
      const formData = new FormData();
      formData.append("files", file);
      formData.append("FormID", FormID);
      formData.append("LineProcessID", LineProcessID);
      formData.append("ReasonID", ReasonID);
      formData.append("ReasonDescID", ReasonDescID);
      formData.append("VendorID", VendorID);
      formData.append("VendorDesc", VendorDesc);
      formData.append("UpdateBy", UpdateBy);
  
      // ส่งคำขอ POST พร้อม Bearer Token
      const response = await api.post(`QA/v1/pUploadFileBatchNo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // กำหนด Content-Type
        },
      });
  
      return response.data; // ส่งคืนข้อมูลเมื่ออัปโหลดสำเร็จ
    } catch (error) {
      console.error("Error in pUploadFileBatchNo:", error);
      throw error; // ส่งข้อผิดพลาดกลับไปยังผู้เรียก
    }
  };
  
  export const pDeleteFileBatchNo = async (deleteFileRequest) => {
    try {
      // ตรวจสอบว่า deleteFileRequest มีค่าที่จำเป็นหรือไม่
      if (!deleteFileRequest || !deleteFileRequest.formID || 
          !deleteFileRequest.detectno || !deleteFileRequest.fileName) {
        throw new Error("FormID, Detectno and FileName are required.");
      }
  
      // ส่งคำขอ DELETE พร้อม Body
      const response = await api.delete(`QA/v1/pDeleteFileBatchNo`, {
        data: deleteFileRequest, // ส่งข้อมูลใน Body
        headers: {
          "Content-Type": "application/json", // กำหนด Content-Type
        },
      });
  
      return response.data; // ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in pDeleteFileBatchNo:", error);
      throw error; // ส่งข้อผิดพลาดกลับไปยังผู้เรียก
    }
  };

  export const pPreparing = async (data) => {
    try {
      // ตรวจสอบว่า data มีค่าที่จำเป็นหรือไม่
      if (!data) {
        throw new Error("Data required.");
      }
  
      // ส่งคำขอ post พร้อม Body
      const response = await api.post(`QA/v1/pPreparing`, 
        data, // ส่งข้อมูลใน Body
      );
  
      return response.data; // ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in pPreparing:", error);
      throw error; // ส่งข้อผิดพลาดกลับไปยังผู้เรียก
    }
  };

  export const pLineClearance = async (data) => {
    try {
      // ตรวจสอบว่า data มีค่าที่จำเป็นหรือไม่
      if (!data) {
        throw new Error("Data required.");
      }
  
      // ส่งคำขอ post พร้อม Body
      const response = await api.post(`QA/v1/pLineClearance`, 
         data, // ส่งข้อมูลใน Body 
        );
  
      return response.data; // ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in pLineClearance:", error);
      throw error; // ส่งข้อผิดพลาดกลับไปยังผู้เรียก
    }
  };

  
  export const pFormList = async (data) => {
    try {
      // ตรวจสอบว่า data มีค่าที่จำเป็นหรือไม่
      if (!data) {
        throw new Error("Data required.");
      }
  
      // ส่งคำขอ post พร้อม Body
      const response = await api.post(`QA/v1/pFormList`, 
        data, // ส่งข้อมูลใน Body
      );
  
      return response.data; // ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in pFormList:", error);
      throw error; // ส่งข้อผิดพลาดกลับไปยังผู้เรียก
    }
  };

  export const gTFormList = async () => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gTFormList`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTFormList:', error);
      throw error;
    }
  };

  export const gTFormListById = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gTFormListById?FormID=${FormID}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTFormListById:', error);
      throw error;
    }
  };

  export const pProblemRandomDetect = async (data) => {
    try {
      // ตรวจสอบว่า data มีค่าที่จำเป็นหรือไม่
      if (!data) {
        throw new Error("Data required.");
      }
  
      // ส่งคำขอ post พร้อม Body
      const response = await api.post(`QA/v1/pProblemRandomDetect`, 
        data, // ส่งข้อมูลใน Body
      );
  
      return response.data; // ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in pProblemRandomDetect:", error);
      throw error; // ส่งข้อผิดพลาดกลับไปยังผู้เรียก
    }
  };

  export const pProblemRandomDetectWeight = async (data) => {
    try {
      // ตรวจสอบว่า data มีค่าที่จำเป็นหรือไม่
      if (!data) {
        throw new Error("Data required.");
      }
  
      // ส่งคำขอ post พร้อม Body
      const response = await api.post(`QA/v1/pProblemRandomDetectWeight`, 
        data, // ส่งข้อมูลใน Body
      );
  
      return response.data; // ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in pProblemRandomDetectWeight:", error);
      throw error; // ส่งข้อผิดพลาดกลับไปยังผู้เรียก
    }
  };

  export const gTProblemRandomDetact = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenQa");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `QA/v1/gTProblemRandomDetact?FormID=${FormID}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTProblemRandomDetact:', error);
      throw error;
    }
  };