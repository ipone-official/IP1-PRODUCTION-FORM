// src/services/apiService.js
import axios from 'axios';

// สร้าง instance ของ axios เพื่อกำหนดค่า base URL และ config เบื้องต้น
const api = axios.create({
  baseURL: 'https://portal.ip-one.com/ApiProductionForm/', // เปลี่ยน URL เป็น API ที่คุณต้องการ
  timeout: 0, // ตั้งค่า timeout สำหรับการเชื่อมต่อ (หน่วยเป็นมิลลิวินาที)
  headers: {
    'Content-Type': 'application/json',
  },
});

export const gLineProcess = async () => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gLineProcess`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gLineProcess:', error);
      throw error;
    }
  };

  
  export const gLineProcessNotWorking = async () => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gLineProcessNotWorking`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gLineProcessNotWorking:', error);
      throw error;
    }
  };

export const gVendor = async () => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gVendor`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gVendor:', error);
      throw error;
    }
  };
  export const gPreparing = async (lineProcessId) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gPreparing?LineProcessID=${lineProcessId}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gPreparing:', error);
      throw error;
    }
  };
  export const gLineClearance = async (lineProcessId) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gLineClearance?LineProcessID=${lineProcessId}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gLineClearance:', error);
      throw error;
    }
  };
  export const gMaterialMaster = async () => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gMaterialMaster`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gMaterialMaster:', error);
      throw error;
    }
  };

  export const gReasonDetail = async (lineProcessId) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gReasonDetail?LineProcessID=${lineProcessId}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gReasonDetail:', error);
      throw error;
    }
  };

  export const gRandomDetect = async (lineProcessId) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gRandomDetect?LineProcessID=${lineProcessId}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gRandomDetect:', error);
      throw error;
    }
  };

  export const gTReasonDetail = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gTReasonDetail?FormID=${FormID}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTReasonDetail:', error);
      throw error;
    }
  };

  export const gTLineClearance = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gTLineClearance?FormID=${FormID}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTLineClearance:', error);
      throw error;
    }
  };

  export const gTPreparing = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gTPreparing?FormID=${FormID}`,
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
      const response = await api.post(`ProductionForm/v1/pUploadFileBatchNo`, formData, {
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
      const response = await api.delete(`ProductionForm/v1/pDeleteFileBatchNo`, {
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
      const response = await api.post(`ProductionForm/v1/pPreparing`, 
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
      const response = await api.post(`ProductionForm/v1/pLineClearance`, 
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
      const response = await api.post(`ProductionForm/v1/pFormList`, 
        data, // ส่งข้อมูลใน Body
      );
  
      return response.data; // ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in pFormList:", error);
      throw error; // ส่งข้อผิดพลาดกลับไปยังผู้เรียก
    }
  };

  export const gTFormList = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.post(
        `ProductionForm/v1/gTFormList`, data
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTFormList:', error);
      throw error;
    }
  };

  export const gTFormListById = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gTFormListById?FormID=${FormID}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTFormListById:', error);
      throw error;
    }
  };

  export const gTProductionResult = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gTProductionResult?FormID=${FormID}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTProductionResult:', error);
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
      const response = await api.post(`ProductionForm/v1/pProblemRandomDetect`, 
        data, // ส่งข้อมูลใน Body
      );
  
      return response.data; // ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in pProblemRandomDetect:", error);
      throw error; // ส่งข้อผิดพลาดกลับไปยังผู้เรียก
    }
  };

  export const gTProblemRandomDetect = async (FormID) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.get(
        `ProductionForm/v1/gTProblemRandomDetect?FormID=${FormID}`,
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTProblemRandomDetect:', error);
      throw error;
    }
  };

  export const gTProblemRandomDetectWeight = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessTokenProductionForm");
      // ตรวจสอบว่า accessToken มีค่าหรือไม่
      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      // ส่งคำขอ get พร้อมข้อมูลและ Bearer Token
      const response = await api.post(
        `ProductionForm/v1/gTProblemRandomDetectWeight`, data
      );
  
      return response.data;
    } catch (error) {
      console.error('Error in gTProblemRandomDetectWeight:', error);
      throw error;
    }
  };


  export const pTProblemRandomDetectWeight = async (data) => {
    try {
      // ตรวจสอบว่า data มีค่าที่จำเป็นหรือไม่
      if (!data) {
        throw new Error("Data required.");
      }
  
      // ส่งคำขอ post พร้อม Body
      const response = await api.post(`ProductionForm/v1/pTProblemRandomDetectWeight`, 
        data, // ส่งข้อมูลใน Body
      );
  
      return response.data; // ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in pTProblemRandomDetectWeight:", error);
      throw error; // ส่งข้อผิดพลาดกลับไปยังผู้เรียก
    }
  };

  export const dTProblemRandomDetectWeight = async (data) => {
    try {
      // ✅ ตรวจสอบว่ามีข้อมูลส่งเข้ามาหรือไม่
      if (!data) {
        throw new Error("Data required.");
      }
  
      // ✅ ส่ง HTTP DELETE request พร้อม Body โดยใส่ data ใน config
      const response = await api.delete(`ProductionForm/v1/dTProblemRandomDetectWeight`, {
        data, // ✅ ใส่ data ใน config ของ axios
      });
  
      return response.data; // ✅ ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in dTProblemRandomDetectWeight:", error);
      throw error; // ✅ ส่งข้อผิดพลาดกลับไป
    }
  };
  
  export const dFormList = async (FormID) => {
    try {
      // ✅ ตรวจสอบว่ามีข้อมูลส่งเข้ามาหรือไม่
      if (!FormID) {
        throw new Error("Data required.");
      }
  
      // ✅ ส่ง HTTP DELETE request พร้อม Body โดยใส่ data ใน config
      const response = await api.delete(`ProductionForm/v1/dFormList?FormID=${FormID}`);
  
      return response.data; // ✅ ส่งคืนข้อมูลเมื่อสำเร็จ
    } catch (error) {
      console.error("Error in dTProblemRandomDetectWeight:", error);
      throw error; // ✅ ส่งข้อผิดพลาดกลับไป
    }
  };

  