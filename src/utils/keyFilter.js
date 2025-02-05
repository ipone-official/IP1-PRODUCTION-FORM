export default {
    /**
     * Allow only numeric input
     * @param {KeyboardEvent} event
     */
    numbersOnly(event) {
      const charCode = event.which || event.keyCode;
      if (
        charCode < 48 || // Less than '0'
        charCode > 57 // Greater than '9'
      ) {
        event.preventDefault();
      }
    },
    allowThaiOnly(event) {
      const charCode = event.which || event.keyCode;
      const allowedKeys = [44, 46, 32]; // 44 = ',' | 46 = '.' | 32 = 'space'
      
      // ช่วง Unicode ภาษาไทย (U+0E00 ถึง U+0E7F)
      if (
        (charCode < 3584 || charCode > 3675) && // ไม่ใช่ภาษาไทย
        !allowedKeys.includes(charCode) // ไม่ใช่ , . หรือ space
      ) {
        event.preventDefault();
      }
    },
    allowEnglishOnly(event) {
      const charCode = event.which || event.keyCode;
      const allowedKeys = [44, 46, 32]; // 44 = ',' | 46 = '.' | 32 = 'space'
      
      // ช่วง Unicode ภาษาไทย (U+0E00 ถึง U+0E7F)
      if (
        (charCode < 65 || charCode > 90) && // Not uppercase A-Z
        (charCode < 97 || charCode > 122)&&  // Not lowercase a-z
        !allowedKeys.includes(charCode) // ไม่ใช่ , . หรือ space
      ) {
        event.preventDefault();
      }
    },
    allowEnglishNumberOnly(event) {
      const charCode = event.which || event.keyCode;
      const allowedKeys = [32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]; // เพิ่ม 32 สำหรับช่องว่าง
    
      // ช่วง Unicode ภาษาไทย (U+0E00 ถึง U+0E7F)
      if (
        (charCode < 65 || charCode > 90) && // Not uppercase A-Z
        (charCode < 97 || charCode > 122) && // Not lowercase a-z
        !allowedKeys.includes(charCode) // ไม่ใช่ตัวเลขหรือ space
      ) {
        event.preventDefault();
      }
    },
    
    /**
     * Allow only alphabetic input
     * @param {KeyboardEvent} event
     */
    lettersOnly(event) {
      const charCode = event.which || event.keyCode;
      if (
        (charCode < 65 || charCode > 90) && // Not uppercase A-Z
        (charCode < 97 || charCode > 122) // Not lowercase a-z
      ) {
        event.preventDefault();
      }
    },
  
    /**
     * Allow alphanumeric input
     * @param {KeyboardEvent} event
     */
    alphaNumeric(event) {
      const charCode = event.which || event.keyCode;
      if (
        (charCode < 48 || charCode > 57) && // Not a number
        (charCode < 65 || charCode > 90) && // Not uppercase A-Z
        (charCode < 97 || charCode > 122) // Not lowercase a-z
      ) {
        event.preventDefault();
      }
    },
  
    /**
     * Allow custom regex filtering
     * @param {KeyboardEvent} event
     * @param {RegExp} regex
     * ex. @keypress="(e) => keyFilter.customFilter(e, /^[aeiouAEIOU]$/)"
     */
    customFilter(event, regex) {
      const char = String.fromCharCode(event.which || event.keyCode);
      if (!regex.test(char)) {
        event.preventDefault();
      }
    },
  };
  