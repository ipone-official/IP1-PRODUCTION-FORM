<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container class="table-page">
    <v-row dense align="center" justify="space-start" class="filter-row">
      <v-col cols="8" sm="3">
        <CustomDatepicker
          v-model="sProductionDateStart"
          label="วันที่ผลิต"
          :disabled="sDisabledDate"
          class="filter-select input-field"
        />
      </v-col>
      ถึง
      <v-col cols="8" sm="3">
        <CustomDatepicker
          v-model="sProductionDateEnd"
          label="วันที่ผลิต"
          :disabled="sDisabledDate"
          class="filter-select input-field"
        />
      </v-col>
      <v-tooltip top color="teal" v-if="!sDisabledDate">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="#007fc4"
            dark
            class="ma-2 small-export-button"
            v-bind="attrs"
            v-on="on"
            @click="(sDisabledDate = true), gTFormList()"
          >
            <v-icon size="20">mdi-magnify</v-icon>
          </v-btn>
        </template>
        <span>Search</span>
      </v-tooltip>
      <v-tooltip top color="teal" v-else-if="sDisabledDate">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="red"
            dark
            class="ma-2 small-export-button"
            v-bind="attrs"
            v-on="on"
            @click="closeSearch"
          >
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Close Search</span>
      </v-tooltip>
    </v-row>

    <v-row
      dense
      align="center"
      justify="space-between"
      class="filter-row"
      v-if="sDisabledDate"
    >
      <v-col cols="12" sm="4" md="3" class="filter-col">
        <v-autocomplete
          v-model="mFilterLineProcess"
          :items="iFilterLineProcess"
          label="ไลน์ผลิต"
          item-title="displayLineProcessName"
          item-value="lineProcessID"
          outlined
          dense
          class="filter-select input-field custom-autocomplete"
          return-object
          multiple
          :color="'primary'"
          active-class="custom-active-class"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="4" md="3" class="filter-col">
        <v-autocomplete
          v-model="mFilterStatus"
          :items="iFilterStatus"
          label="สถานะ"
          item-title="displayStatus"
          item-value="status"
          outlined
          dense
          class="filter-select input-field custom-autocomplete"
          return-object
          multiple
          :color="'primary'"
          active-class="custom-active-class"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="4" md="5" class="filter-col">
        <v-text-field
          v-model="mSearch"
          label="Search"
          outlined
          dense
          prepend-inner-icon="mdi-magnify"
          class="search-bar input-field"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-btn color="primary" class="fab" large absolute bottom right @click="oPenDialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Toolbar จะแสดงเสมอ -->
    <v-toolbar flat class="custom-toolbar">
      <v-toolbar-title class="centered-title">รายการเอกสาร</v-toolbar-title>
      <v-tooltip text="Refresh" location="bottom" color="blue" text-color="white">
        <template #activator="{ props }">
          <v-btn icon variant="text" v-bind="props" @click="gTFormList">
            <v-icon color="blue">mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-toolbar>

    <!-- Table (แสดงเมื่อ listQaReq มีค่า) -->
    <v-data-table
      v-if="listQaReq.length != 0"
      :headers="headersListQa"
      :items="listQaReq"
      :search="mSearch"
      class="data-table"
      dense
      rounded
    >
      <template v-slot:item.productionDate="{ item }">
        <div>
          {{ item.productionDate ? formatDateProductionDate(item.productionDate) : "-" }}
        </div>
      </template>
      <template v-slot:item.checkIN="{ item }">
        <div>
          {{ item.checkIN ? formatDateCheckin(item.checkIN) : "-" }}
        </div>
      </template>
      <template v-slot:item.status="{ item }">
        <div>
          {{ item.status ? translateStatus(item.status) : "-" }}
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="action-buttons">
          <!-- Edit Tooltip -->
          <v-tooltip text="ดูรายการ" location="bottom" color="blue" text-color="white">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" v-bind="props" @click="editItemTFormList(item)">
                <v-icon color="blue">mdi-washing-machine</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Delete Tooltip -->
          <v-tooltip
            text="ลบรายการ"
            location="bottom"
            color="red"
            text-color="white"
            v-if="canEdit(item)"
          >
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" v-bind="props" @click="deleteItemTFomList(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" fullscreen>
      <v-card class="dialog-card">
        <!-- Header -->
        <v-card-title class="dialog-header">
          <span class="dialog-title">✨ Production Form ✨</span>
          <v-btn icon @click="resetForm" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <!-- Form Content -->
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <!-- Row 1 -->
            <v-row justify="space-between" align="center">
              <v-col cols="12" md="5">
                <v-card class="grey-card" outlined v-if="mSelectedReqQa.length != 0">
                  <v-card-text class="text-left">
                    เลขที่เอกสาร : {{ mSelectedReqQa.formID }}
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="5">
                <v-card class="grey-card" outlined>
                  <v-card-text class="text-left">
                    ผู้สร้างเอกสาร :
                    {{
                      mSelectedReqQa.length != 0
                        ? `${mSelectedReqQa.samAccount} (${mSelectedReqQa.userID})`
                        : `${user.samAccount} (${user.empId})`
                    }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row justify="end" align="center" v-show="canEdit(mSelectedReqQa)">
              <v-col
                cols="12"
                md="2"
                v-if="(managerEdit && mSelectedReqQa.status !== 'Completed') || adminEdit"
              >
                <v-btn
                  color="success"
                  large
                  elevation="6"
                  class="rounded-xl text-white font-weight-bold px-8 py-2 transition"
                  @click="submitForm('Completed')"
                >
                  <v-icon left>mdi-check-circle-outline</v-icon> อนุมัติ
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                md="2"
                v-if="
                  (supervisorEdit &&
                    !['WaitApproved', 'Completed'].includes(mSelectedReqQa.status)) ||
                  adminEdit
                "
              >
                <v-btn
                  color="success"
                  large
                  elevation="6"
                  class="rounded-xl text-white font-weight-bold px-8 py-2 transition"
                  @click="submitForm('WaitApproved')"
                >
                  <v-icon left>mdi-check-circle-outline</v-icon> ส่งอนุมัติ
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                md="2"
                v-if="(operatorEdit && mSelectedReqQa.status == 'InProcess') || adminEdit"
              >
                <v-btn
                  color="success"
                  large
                  elevation="6"
                  class="rounded-xl text-white font-weight-bold px-8 py-2 transition"
                  @click="submitForm('WaitConfirm')"
                >
                  <v-icon left>mdi-check-circle-outline</v-icon> ส่งตรวจสอบ
                </v-btn>
              </v-col>
            </v-row>
            <!-- Tabs -->
            <v-row>
              <v-col cols="12">
                <v-sheet class="tab-container" elevation="3" rounded="lg">
                  <v-tabs
                    v-model="tab"
                    :items="filteredTabs"
                    align-tabs="center"
                    color="#007fc4"
                    height="50"
                    slider-color="#ffc107"
                  >
                    <template v-slot:tab="{ item }">
                      <v-tab
                        :prepend-icon="item.icon"
                        :text="item.text"
                        :value="item.value"
                        class="custom-tab"
                      ></v-tab>
                    </template>

                    <template v-slot:item="{ item }">
                      <v-tabs-window-item :value="item.value" class="pa-4">
                        <!-- Tab 1 Content -->
                        <v-row v-if="tab === 'Home'" dense>
                          <v-col cols="12" sm="2">
                            <v-autocomplete
                              v-model="mLineprocess"
                              :items="iLineprocess"
                              item-title="lineProcessName"
                              item-value="lineProcessID"
                              outlined
                              dense
                              required
                              return-object
                              class="filter-select input-field"
                              :readonly="Boolean(mSelectedReqQa.formID)"
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span> ไลน์ผลิต
                              </template>
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-autocomplete
                              v-model="mMaterial"
                              :items="iMaterial"
                              item-title="displayMaterial"
                              item-value="materialCode"
                              outlined
                              dense
                              required
                              return-object
                              class="filter-select input-field"
                              :readonly="Boolean(mSelectedReqQa.formID)"
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span> ผลิตภัณฑ์
                              </template>
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <CustomDatepicker
                              v-model="mProductionDate"
                              label="วันที่ผลิต"
                              :disabled="Boolean(mSelectedReqQa.formID)"
                              class="filter-select input-field"
                            />
                          </v-col>
                          <v-col cols="12" sm="3">
                            <CustomDatepicker
                              v-model="mInspectionDate"
                              label="วันที่ตรวจสอบ"
                              :disabled="Boolean(mSelectedReqQa.formID)"
                              class="filter-select input-field"
                            />
                          </v-col>

                          <v-col cols="12" sm="3">
                            <v-text-field
                              outlined
                              dense
                              required
                              prepend-inner-icon="mdi-weight-kilogram"
                              class="input-field"
                              v-model="formattedWeightPacking"
                              @input="updateWeightPacking"
                              @keypress="keyFilter.numbersOnly"
                              type="text"
                              inputmode="decimal"
                              pattern="[0-9]*"
                              :readonly="Boolean(mSelectedReqQa.formID)"
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span
                                >น้ำหนักภาชนะบรรจุและส่วนประกอบ
                              </template>
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="3">
                            <v-text-field
                              outlined
                              dense
                              required
                              class="input-field"
                              v-model="formattedStdWeight"
                              type="text"
                              inputmode="decimal"
                              pattern="[0-9]*"
                              @input="updateStdWeight"
                              @keypress="keyFilter.numbersOnly"
                              :readonly="Boolean(mSelectedReqQa.formID)"
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span>น้ำหนัก (STD) g.
                              </template>
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="3">
                            <v-text-field
                              outlined
                              dense
                              required
                              class="input-field"
                              v-model="formattedStdTime"
                              type="text"
                              inputmode="decimal"
                              pattern="[0-9]*"
                              @input="updateStdTime"
                              @keypress="keyFilter.numbersOnly"
                              :readonly="Boolean(mSelectedReqQa.formID)"
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span>เวลาบรรจุ STD (DZ/Hr.)
                              </template>
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="3">
                            <v-text-field
                              outlined
                              dense
                              required
                              class="input-field"
                              v-model="mScale"
                              :readonly="Boolean(mSelectedReqQa.formID)"
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span>เครื่องชัง BL
                              </template>
                            </v-text-field>
                          </v-col>

                          <v-row v-if="mLineprocess.length != 0">
                            <!-- left Panel -->
                            <v-col cols="12" md="6">
                              <div class="panel left-panel">
                                <div class="header">
                                  <v-icon class="header-icon" color="primary"
                                    >mdi-clipboard-check-outline</v-icon
                                  >
                                  <h3 class="header-title">รายการสินค้าผลิตก่อนหน้า</h3>
                                </div>
                                <v-row>
                                  <v-col cols="12" md="12">
                                    <v-autocomplete
                                      v-model="mcMaterial"
                                      :items="iMaterial"
                                      item-title="displayMaterial"
                                      item-value="materialCode"
                                      outlined
                                      dense
                                      required
                                      return-object
                                      class="filter-select input-field"
                                      :readonly="Boolean(mSelectedReqQa.formID)"
                                    >
                                      <template v-slot:label>
                                        <span style="color: red">*</span> ผลิตภัณฑ์
                                      </template>
                                    </v-autocomplete>
                                  </v-col>
                                </v-row>
                                <v-row
                                  class="d-flex justify-center"
                                  v-if="mcMaterial.length != 0 && canEdit(mSelectedReqQa)"
                                >
                                  <v-col
                                    cols="12"
                                    sm="5"
                                    xs="12"
                                    class="d-flex justify-center"
                                  >
                                    <v-btn
                                      color="primary"
                                      block
                                      @click="selectAllClearance('Y')"
                                    >
                                      ผ่าน ทั้งหมด
                                    </v-btn>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="5"
                                    xs="12"
                                    class="d-flex justify-center"
                                  >
                                    <v-btn
                                      color="red"
                                      block
                                      @click="selectAllClearance('N')"
                                    >
                                      ไม่ผ่าน ทั้งหมด
                                    </v-btn>
                                  </v-col>
                                </v-row>
                                <v-row
                                  v-for="(item, index) in clearanceItem"
                                  :key="item.reasonClearID"
                                  class="align-center no-gutters py-1"
                                  v-show="mcMaterial.length != 0"
                                >
                                  <!-- ข้อความ -->
                                  <v-col
                                    cols="12"
                                    md="6"
                                    sm="7"
                                    xs="12"
                                    class="d-flex align-center text-wrap py-0"
                                  >
                                    <h5 class="mb-0 text-break w-100 font-bold">
                                      {{ item.reasonClearDesc }}
                                    </h5>
                                  </v-col>

                                  <!-- ปุ่ม radio -->
                                  <v-col
                                    cols="12"
                                    md="6"
                                    sm="5"
                                    xs="12"
                                    class="d-flex justify-center align-center py-1 px-2"
                                  >
                                    <v-radio-group
                                      v-model="item.selected"
                                      inline
                                      class="d-flex flex-nowrap gap-3"
                                      density="compact"
                                      :readonly="
                                        !operatorEdit &&
                                        !supervisorEdit &&
                                        !managerEdit &&
                                        !adminEdit &&
                                        !flagCreate
                                      "
                                    >
                                      <v-radio
                                        color="primary"
                                        label="ผ่าน"
                                        value="Y"
                                        density="compact"
                                        class="mr-3"
                                      ></v-radio>
                                      <v-radio
                                        color="red"
                                        label="ไม่ผ่าน"
                                        value="N"
                                        density="compact"
                                      ></v-radio>
                                    </v-radio-group>
                                  </v-col>
                                </v-row>
                                <v-col cols="12" md="12" v-if="mcMaterial.length != 0">
                                  <v-textarea
                                    v-model="mRemarkClearance"
                                    label="อื่น ๆ / เพิ่มเติม"
                                    variant="outlined"
                                    rows="2"
                                    prepend-inner-icon="mdi-file-document-edit-outline"
                                    class="input-field"
                                    maxlength="255"
                                    :readonly="
                                      !operatorEdit &&
                                      !supervisorEdit &&
                                      !managerEdit &&
                                      !adminEdit &&
                                      !flagCreate
                                    "
                                  ></v-textarea>
                                </v-col>
                              </div>
                            </v-col>

                            <!-- Right Panel -->
                            <v-col cols="12" md="6">
                              <div class="panel right-panel">
                                <div class="header">
                                  <v-icon class="header-icon" color="primary"
                                    >mdi-cogs</v-icon
                                  >
                                  <h3 class="header-title">จัดเตรียมเครื่องจักร</h3>
                                </div>

                                <!-- ปุ่มเลือกทั้งหมด -->
                                <v-row
                                  class="d-flex justify-center"
                                  v-if="canEdit(mSelectedReqQa)"
                                >
                                  <v-col
                                    cols="12"
                                    sm="5"
                                    xs="12"
                                    class="d-flex justify-center"
                                  >
                                    <v-btn
                                      color="primary"
                                      block
                                      @click="selectAllPreparing('Y')"
                                    >
                                      ผ่าน ทั้งหมด
                                    </v-btn>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="5"
                                    xs="12"
                                    class="d-flex justify-center"
                                  >
                                    <v-btn
                                      color="red"
                                      block
                                      @click="selectAllPreparing('N')"
                                    >
                                      ไม่ผ่าน ทั้งหมด
                                    </v-btn>
                                  </v-col>
                                </v-row>
                                <!-- แสดงรายการ -->
                                <v-row
                                  v-for="(item, index) in preparingItem"
                                  :key="item.reasonPreparingID"
                                  class="align-center no-gutters py-1"
                                >
                                  <!-- ข้อความ -->
                                  <v-col
                                    cols="12"
                                    md="6"
                                    sm="7"
                                    xs="12"
                                    class="d-flex align-center text-wrap py-0"
                                  >
                                    <h5 class="mb-0 text-break w-100">
                                      {{ item.reasonPreparingDesc }}
                                    </h5>
                                  </v-col>

                                  <!-- ปุ่ม radio -->
                                  <v-col
                                    cols="12"
                                    md="6"
                                    sm="5"
                                    xs="12"
                                    class="d-flex justify-center align-center py-1 px-2"
                                  >
                                    <v-radio-group
                                      v-model="item.selected"
                                      inline
                                      class="d-flex flex-nowrap gap-3"
                                      density="compact"
                                      :readonly="
                                        !operatorEdit &&
                                        !supervisorEdit &&
                                        !managerEdit &&
                                        !adminEdit &&
                                        !flagCreate
                                      "
                                    >
                                      <v-radio
                                        color="primary"
                                        label="ผ่าน"
                                        value="Y"
                                        density="compact"
                                        class="mr-3"
                                      ></v-radio>
                                      <v-radio
                                        color="red"
                                        label="ไม่ผ่าน"
                                        value="N"
                                        density="compact"
                                      ></v-radio>
                                    </v-radio-group>
                                  </v-col>
                                </v-row>
                              </div>
                            </v-col>
                          </v-row>
                        </v-row>
                        <v-row v-else-if="tab === 'Detail'" dense>
                          <v-col cols="12" sm="4">
                            <v-text-field
                              outlined
                              dense
                              required
                              class="input-field"
                              v-model="formattedBulkUsed"
                              type="text"
                              inputmode="decimal"
                              pattern="[0-9]*"
                              @input="updateBulkUsed"
                              @keypress="keyFilter.numbersOnly"
                              :readonly="
                                !operatorEdit &&
                                !supervisorEdit &&
                                !managerEdit &&
                                !adminEdit &&
                                !flagCreate
                              "
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span>ปริมาณ Bulk ที่ใช้
                              </template>
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="4">
                            <v-text-field
                              outlined
                              dense
                              required
                              class="input-field"
                              v-model="formattedBulkQuoted"
                              type="text"
                              inputmode="decimal"
                              pattern="[0-9]*"
                              @input="updateBulkQuoted"
                              @keypress="keyFilter.numbersOnly"
                              :readonly="
                                !operatorEdit &&
                                !supervisorEdit &&
                                !managerEdit &&
                                !adminEdit &&
                                !flagCreate
                              "
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span>ปริมาณ Bulk ยกมา
                              </template>
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="4">
                            <v-text-field
                              outlined
                              dense
                              required
                              class="input-field"
                              v-model="formattedBulkActually"
                              type="text"
                              inputmode="decimal"
                              pattern="[0-9]*"
                              @input="updateBulkActually"
                              @keypress="keyFilter.numbersOnly"
                              :readonly="
                                !operatorEdit &&
                                !supervisorEdit &&
                                !managerEdit &&
                                !adminEdit &&
                                !flagCreate
                              "
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span>ปริมาณ Bulk ที่ใช้จริง
                              </template>
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="4">
                            <v-text-field
                              outlined
                              dense
                              required
                              class="input-field"
                              v-model="formattedProdPlanEA"
                              type="text"
                              inputmode="numeric"
                              pattern="[0-9]*"
                              @input="updateProdPlanEA"
                              @keypress="keyFilter.numbersOnlyInteger"
                              :readonly="
                                !operatorEdit &&
                                !supervisorEdit &&
                                !managerEdit &&
                                !adminEdit &&
                                !flagCreate
                              "
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span>แผนการผลิต (EA)
                              </template>
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="4">
                            <v-text-field
                              outlined
                              dense
                              required
                              class="input-field"
                              v-model="formattedExpectedProdEA"
                              type="text"
                              inputmode="numeric"
                              pattern="[0-9]*"
                              @input="updateExpectedProdEA"
                              @keypress="keyFilter.numbersOnlyInteger"
                              :readonly="
                                !operatorEdit &&
                                !supervisorEdit &&
                                !managerEdit &&
                                !adminEdit &&
                                !flagCreate
                              "
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span>คาดว่าผลิตได้ (EA)
                              </template>
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="4">
                            <v-text-field
                              outlined
                              dense
                              required
                              class="input-field"
                              v-model="formattedProdPlanQtyEA"
                              type="text"
                              inputmode="numeric"
                              pattern="[0-9]*"
                              @input="updateProdPlanQtyEA"
                              @keypress="keyFilter.numbersOnlyInteger"
                              :readonly="
                                !operatorEdit &&
                                !supervisorEdit &&
                                !managerEdit &&
                                !adminEdit &&
                                !flagCreate
                              "
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span>จำนวนแผนการผลิต (EA)
                              </template>
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" md="12">
                            <div class="panel left-panel">
                              <div class="header">
                                <v-icon class="header-icon" color="primary"
                                  >mdi-file-document-multiple-outline</v-icon
                                >
                                <h3 class="header-title">รายละเอียดบรรจุภัณฑ์</h3>
                              </div>
                              <v-row
                                dense
                                class="d-flex text-wrap py-0"
                                v-if="canEdit(mSelectedReqQa)"
                              >
                                <v-col cols="12" md="3">
                                  <v-autocomplete
                                    v-model="mReasonDetail"
                                    :items="iReasonDetail"
                                    item-title="reasonHeader"
                                    item-value="reasonID"
                                    outlined
                                    dense
                                    return-object
                                    class="filter-select input-field"
                                  >
                                    <template v-slot:label>
                                      <span style="color: red">*</span> ประเภทรายละเอียด
                                    </template>
                                  </v-autocomplete>
                                </v-col>
                                <v-col
                                  cols="12"
                                  :md="
                                    mReasonDetail.reasonID == 'RS0002' || !mReasonDetail
                                      ? 4
                                      : 2
                                  "
                                >
                                  <v-autocomplete
                                    v-model="mReasonDetailItem"
                                    :items="iReasonDetailItem"
                                    item-title="reasonDesc"
                                    item-value="reasonDescID"
                                    outlined
                                    dense
                                    return-object
                                    class="filter-select input-field"
                                  >
                                    <template v-slot:label>
                                      <span style="color: red">*</span> รายการ
                                    </template>
                                  </v-autocomplete>
                                </v-col>
                                <v-col
                                  cols="12"
                                  md="3"
                                  v-show="mReasonDetail.reasonID == 'RS0001'"
                                >
                                  <v-autocomplete
                                    v-model="mVendor"
                                    :items="iVendor"
                                    item-title="displayVendor"
                                    item-value="vendorNo"
                                    outlined
                                    dense
                                    clearable
                                    return-object
                                    class="filter-select input-field"
                                  >
                                    <template v-slot:label> บริษัท </template>
                                  </v-autocomplete>
                                </v-col>
                                <v-col
                                  cols="11"
                                  :md="
                                    mReasonDetail.reasonID == 'RS0002' || !mReasonDetail
                                      ? 4
                                      : 3
                                  "
                                >
                                  <v-file-input
                                    v-model="FileBatch"
                                    label="อัพโหลด Batch No."
                                    outlined
                                    dense
                                    class="input-field"
                                    prepend-icon="mdi-file-pdf-box"
                                    :show-size="true"
                                    :truncate-length="0"
                                    accept="image/*"
                                    @change="handleFileChange()"
                                  />
                                </v-col>

                                <v-col cols="1" sm="1">
                                  <v-tooltip
                                    text="เพิ่มรายการ"
                                    location="bottom"
                                    color="primary"
                                    text-color="white"
                                  >
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        icon
                                        variant="text"
                                        v-bind="props"
                                        @click="plusProduct()"
                                      >
                                        <v-icon color="primary"
                                          >mdi-plus-circle-outline</v-icon
                                        >
                                      </v-btn>
                                    </template>
                                  </v-tooltip>
                                </v-col>
                              </v-row>

                              <v-container fluid v-if="listDProduct.length > 0">
                                <v-card class="overflow-auto" style="max-height: 400px">
                                  <v-data-table
                                    :headers="headersDProduct"
                                    :items="listDProduct"
                                    class="data-table"
                                    dense
                                    rounded
                                  >
                                    <template v-slot:item.batchNo="{ item }">
                                      <v-btn
                                        icon
                                        small
                                        variant="text"
                                        @click="openImageDialog(item.batchPicture)"
                                      >
                                        <v-icon color="primary">mdi-image</v-icon>
                                      </v-btn>
                                    </template>

                                    <template
                                      v-slot:item.actions="{ item }"
                                      v-if="canEdit(mSelectedReqQa)"
                                    >
                                      <div class="action-buttons">
                                        <v-tooltip
                                          text="Delete"
                                          location="bottom"
                                          color="red"
                                          text-color="white"
                                        >
                                          <template v-slot:activator="{ props }">
                                            <v-btn
                                              icon
                                              small
                                              variant="text"
                                              v-bind="props"
                                              @click="deleteItemProductDetail(item)"
                                            >
                                              <v-icon color="red">mdi-delete</v-icon>
                                            </v-btn>
                                          </template>
                                        </v-tooltip>
                                      </div>
                                    </template>
                                    <template v-slot:item.actions="{ item }" v-else>
                                      <div class="action-buttons">
                                        <v-icon color="green">mdi-progress-check</v-icon>
                                      </div>
                                    </template>
                                  </v-data-table>
                                </v-card>
                              </v-container>
                            </div>
                          </v-col>
                          <v-col cols="12" md="12">
                            <div class="panel right-panel">
                              <div class="header">
                                <v-icon class="header-icon" color="primary"
                                  >mdi-clipboard-check-outline</v-icon
                                >
                                <h3 class="header-title">รายการตรวจสอบผลิตภัณฑ์</h3>
                                <div
                                  class="d-flex justify-end pa-2"
                                  style="color: #3498db"
                                >
                                  <v-icon color="red" @click="dialogNotification = true"
                                    >mdi-bell-ring</v-icon
                                  >
                                </div>
                                <!-- Dialog สำหรับแสดงรูปภาพ -->
                                <v-dialog
                                  v-model="dialogNotification"
                                  class="dialog-width-noti"
                                >
                                  <v-card
                                    class="elevation-10"
                                    style="border-radius: 16px; overflow: hidden"
                                  >
                                    <!-- สไลด์แสดงรูปภาพ -->
                                    <v-carousel hide-delimiters cycle :interval="5000">
                                      <v-carousel-item
                                        v-for="(image, index) in imagesNotification"
                                        :key="index"
                                      >
                                        <div>
                                          <img
                                            :src="image"
                                            alt="Slide Image"
                                            class="carousel-image"
                                          />
                                        </div>
                                      </v-carousel-item>
                                    </v-carousel>

                                    <!-- ปุ่มปิด -->
                                    <v-card-actions class="d-flex justify-end pa-2">
                                      <v-btn
                                        color="red"
                                        class="white--text"
                                        rounded
                                        @click="dialogNotification = false"
                                      >
                                        <v-icon left>mdi-close</v-icon> Close
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </div>
                              <v-row
                                class="align-center justify-space-between"
                                v-if="canEdit(mSelectedReqQa)"
                              >
                                <!-- คอลัมน์แสดงหัวข้อ -->
                                <v-col cols="12" sm="7">
                                  <span class="current-date-label">วันเวลาปัจจุบัน</span>
                                </v-col>

                                <v-col cols="11" sm="4">
                                  <DateTimePicker v-model:value="selectedDateTime" />
                                </v-col>

                                <v-col
                                  cols="2"
                                  sm="1"
                                  xs="12"
                                  class="text-right"
                                  v-show="!mCreateOnly"
                                >
                                  <v-tooltip
                                    text="เพิ่มรอบเวลาตรวจสอบ"
                                    location="bottom"
                                    color="primary"
                                    text-color="white"
                                  >
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        icon
                                        variant="text"
                                        v-bind="props"
                                        @click="plusTimeSlot(selectedDateTime)"
                                      >
                                        <v-icon color="primary"
                                          >mdi-plus-circle-outline</v-icon
                                        >
                                      </v-btn>
                                    </template>
                                  </v-tooltip>
                                </v-col>
                              </v-row>

                              <v-row>
                                <!-- {{ CreateByName }}
                                {{ selectedTabTime }} // {{ selectedItemsTime }} //
                                {{ mRawDataRandomDetect }} -->
                                <v-col
                                  :cols="mCreateOnly && tabsTime.length > 0 ? 10 : 12"
                                  :sm="mCreateOnly && tabsTime.length > 0 ? 11 : 12"
                                  :xs="mCreateOnly && tabsTime.length > 0 ? 11 : 12"
                                  v-if="tabsTime.length != 0"
                                >
                                  <v-sheet elevation="6">
                                    <v-tabs
                                      v-model="selectedTabTime"
                                      :items="tabsTime"
                                      bg-color="#007fc4"
                                      next-icon="mdi-arrow-right-bold-box-outline"
                                      prev-icon="mdi-arrow-left-bold-box-outline"
                                      show-arrows
                                    >
                                      <template v-slot:tab="{ item }">
                                        <v-tab
                                          :key="item.value"
                                          :value="item.value"
                                          :class="getTabColor(item.role)"
                                        >
                                          <v-icon left>{{ item.icon }}</v-icon>
                                          <span v-html="item.formattedText"></span>
                                        </v-tab>
                                      </template>
                                    </v-tabs>
                                  </v-sheet>
                                </v-col>

                                <!-- ✅ แสดงปุ่มลบเฉพาะเมื่อ mCreateOnly == true -->
                                <v-col
                                  cols="1"
                                  sm="1"
                                  xs="1"
                                  v-show="mCreateOnly && tabsTime.length > 0"
                                >
                                  <v-tooltip
                                    text="ลบข้อมูลล่าสุด"
                                    location="top"
                                    color="primary"
                                    text-color="white"
                                  >
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        icon
                                        variant="text"
                                        v-bind="props"
                                        @click="removeLastTab"
                                      >
                                        <v-icon color="red">mdi-delete</v-icon>
                                      </v-btn>
                                    </template>
                                  </v-tooltip>
                                </v-col>
                              </v-row>
                              <v-row class="d-flex justify-end">
                                <v-col cols="12" md="4">
                                  <v-card
                                    class="grey-card"
                                    outlined
                                    v-if="selectedTabTime"
                                  >
                                    <v-card-text class="text-left">
                                      ผู้ตรวจสอบ :
                                      {{
                                        CreateByName.length != 0
                                          ? CreateByName
                                          : `${user.samAccount} (${user.empId})`
                                      }}
                                    </v-card-text>
                                  </v-card>
                                </v-col>
                              </v-row>
                              <v-row v-if="selectedTabTime">
                                <v-col cols="12" md="8" sm="8" xs="12">
                                  <v-row
                                    class="d-flex justify-center"
                                    v-if="canEdit(mSelectedReqQa)"
                                  >
                                    <v-col
                                      cols="12"
                                      sm="5"
                                      xs="12"
                                      class="d-flex justify-center"
                                    >
                                      <v-btn
                                        color="primary"
                                        block
                                        @click="selectAllVerifyProduct('Y')"
                                        :readonly="
                                          (!operatorEdit || !flagEdit) &&
                                          !supervisorEdit &&
                                          !managerEdit &&
                                          !adminEdit
                                        "
                                      >
                                        ผ่าน ทั้งหมด
                                      </v-btn>
                                    </v-col>
                                    <v-col
                                      cols="12"
                                      sm="5"
                                      xs="12"
                                      class="d-flex justify-center"
                                    >
                                      <v-btn
                                        color="red"
                                        block
                                        @click="selectAllVerifyProduct('N')"
                                        :readonly="
                                          (!operatorEdit || !flagEdit) &&
                                          !supervisorEdit &&
                                          !managerEdit &&
                                          !adminEdit
                                        "
                                      >
                                        ไม่ผ่าน ทั้งหมด
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                  <!-- แสดงรายการ -->
                                  <v-row
                                    v-for="(item, index) in iVerifyProduct"
                                    :key="item.problemDetectID"
                                    class="align-center no-gutters py-1"
                                  >
                                    <!-- ข้อความ -->
                                    <v-col
                                      cols="12"
                                      md="6"
                                      sm="7"
                                      xs="12"
                                      class="d-flex align-center text-wrap py-0"
                                    >
                                      <h5 class="mb-0 text-break w-100">
                                        {{ item.problemDetectDesc }}
                                      </h5>
                                    </v-col>

                                    <!-- ปุ่ม radio -->
                                    <v-col
                                      cols="12"
                                      md="6"
                                      sm="5"
                                      xs="12"
                                      class="d-flex justify-center align-center py-1 px-2"
                                    >
                                      <v-radio-group
                                        v-model="item.selected"
                                        inline
                                        class="d-flex flex-nowrap gap-3"
                                        density="compact"
                                        @change="handleSelectionChange(item)"
                                        :readonly="
                                          (!operatorEdit || !flagEdit) &&
                                          !supervisorEdit &&
                                          !managerEdit &&
                                          !adminEdit &&
                                          !flagCreate
                                        "
                                      >
                                        <v-radio
                                          color="primary"
                                          label="ผ่าน"
                                          value="Y"
                                          density="compact"
                                          class="mr-3"
                                        ></v-radio>
                                        <v-radio
                                          color="red"
                                          label="ไม่ผ่าน"
                                          value="N"
                                          density="compact"
                                        ></v-radio>
                                      </v-radio-group>
                                    </v-col>
                                  </v-row>
                                </v-col>
                                <v-col cols="12" md="4" sm="4" xs="12">
                                  <v-row>
                                    <v-col
                                      cols="10"
                                      sm="10"
                                      v-if="canEdit(mSelectedReqQa)"
                                    >
                                      <v-text-field
                                        v-model="formattedWeight"
                                        outlined
                                        dense
                                        required
                                        prepend-inner-icon="mdi-weight-lifter"
                                        class="input-field"
                                        type="text"
                                        @input="updateWeight"
                                        @keyup.enter="plusWeight"
                                        :readonly="
                                          (!operatorEdit || !flagEdit) &&
                                          !supervisorEdit &&
                                          !managerEdit &&
                                          !adminEdit
                                        "
                                      >
                                        <template v-slot:label>
                                          <span style="color: red">*</span>น้ำหนัก
                                        </template>
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="2" sm="2" v-if="canEdit(mSelectedReqQa)">
                                      <v-tooltip
                                        text="เพิ่มรายการน้ำหนัก"
                                        location="bottom"
                                        color="primary"
                                        text-color="white"
                                      >
                                        <template v-slot:activator="{ props }">
                                          <v-btn
                                            icon
                                            variant="text"
                                            v-bind="props"
                                            @click="plusWeight"
                                            :readonly="
                                              (!operatorEdit || !flagEdit) &&
                                              !supervisorEdit &&
                                              !managerEdit &&
                                              !adminEdit
                                            "
                                          >
                                            <v-icon color="primary"
                                              >mdi-plus-circle-outline</v-icon
                                            >
                                          </v-btn>
                                        </template>
                                      </v-tooltip>
                                    </v-col>
                                    <v-data-table
                                      :headers="headersVerifyProduct"
                                      :items="listVerifyProduct"
                                      class="data-table"
                                      dense
                                      rounded
                                    >
                                      <template
                                        v-slot:item.actions="{ item }"
                                        v-if="canEdit(mSelectedReqQa)"
                                      >
                                        <div class="action-buttons">
                                          <v-tooltip
                                            text="Delete"
                                            location="bottom"
                                            color="red"
                                            text-color="white"
                                          >
                                            <template v-slot:activator="{ props }">
                                              <v-btn
                                                icon
                                                variant="text"
                                                v-bind="props"
                                                @click="deleteItemWeight(item)"
                                                :readonly="
                                                  (!operatorEdit || !flagEdit) &&
                                                  !supervisorEdit &&
                                                  !managerEdit &&
                                                  !adminEdit
                                                "
                                              >
                                                <v-icon color="red">mdi-delete</v-icon>
                                              </v-btn>
                                            </template>
                                          </v-tooltip>
                                        </div>
                                      </template>
                                      <template v-slot:item.actions="{ item }" v-else>
                                        <div class="action-buttons">
                                          <v-icon color="green"
                                            >mdi-progress-check</v-icon
                                          >
                                        </div>
                                      </template>
                                    </v-data-table>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </div>
                          </v-col>
                        </v-row>
                      </v-tabs-window-item>
                    </template>
                  </v-tabs>
                </v-sheet>
              </v-col>
              <!-- สรุปผลการผลิต -->
              <v-col cols="12" v-if="mSelectedReqQa.length != 0">
                <v-card class="panel" outlined>
                  <!-- Header -->
                  <v-card-title class="header">
                    <v-icon class="header-icon" color="primary"
                      >mdi-file-document-check-outline</v-icon
                    >
                    <h3 class="header-title">สรุปผลการผลิต</h3>
                  </v-card-title>

                  <!-- Content -->
                  <v-card-text>
                    <v-row dense>
                      <v-col cols="12" md="3">
                        <div class="info-item">
                          <span class="info-label">ผลิตภัณฑ์</span>
                          <span class="info-value">{{
                            rProductionResult.materialCode
                              ? rProductionResult.materialCode
                              : "-"
                          }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">รายละเอียดผลิตภัณฑ์</span>
                          <span class="info-value">{{
                            rProductionResult.materialDesc
                              ? rProductionResult.materialDesc
                              : "-"
                          }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">สีผลิตภัณฑ์</span>
                          <span class="info-value">{{
                            rProductionResult.materialColor
                              ? rProductionResult.materialColor
                              : "-"
                          }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">ขนาดผลิตภัณฑ์</span>
                          <span class="info-value">{{
                            rProductionResult.materialSize
                              ? formatNumber(rProductionResult.materialSize, 0)
                              : "-"
                          }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="info-item">
                          <span class="info-label">หมวดหมู่ผลิตภัณฑ์</span>
                          <span class="info-value">{{
                            rProductionResult.materialCategory
                              ? rProductionResult.materialCategory
                              : "-"
                          }}</span>
                        </div>
                      </v-col>
                    </v-row>

                    <v-row dense>
                      <v-col cols="12" md="3">
                        <div class="info-item">
                          <span class="info-label">ปริมาณ Bulk ใช้ทั้งหมด</span>
                          <span class="info-value"
                            >{{ formatNumber(rProductionResult.bulkUsed, 2) }} KG</span
                          >
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">Bulk ยกมา</span>
                          <span class="info-value"
                            >{{ formatNumber(rProductionResult.bulkQuoted, 2) }} KG</span
                          >
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">Bulk ที่ใช้จริง</span>
                          <span class="info-value"
                            >{{
                              formatNumber(rProductionResult.bulkActually, 2)
                            }}
                            KG</span
                          >
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">Bulk คงเหลือ</span>
                          <span class="info-value"
                            >{{
                              formatNumber(rProductionResult.bulkRemaining, 2)
                            }}
                            KG</span
                          >
                        </div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="info-item">
                          <span class="info-label">ปริมาณ Bulk สูญเสีย</span>
                          <span class="info-value"
                            >{{ formatNumber(rProductionResult.bulkLoss, 2) }} KG</span
                          >
                        </div>
                      </v-col>
                    </v-row>

                    <v-row dense>
                      <v-col cols="12" md="3">
                        <div class="info-item">
                          <span class="info-label">จำนวนผลิตได้จริง</span>
                          <span class="info-value"
                            >{{
                              formatNumber(rProductionResult.prodPlanQtyEA, 0)
                            }}
                            EA</span
                          >
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">จำนวน DZ</span>
                          <span class="info-value"
                            >{{ formatNumber(rProductionResult.prodPlanQtyActually, 0) }}
                          </span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">% Yield</span>
                          <span class="info-value"
                            >{{ formatNumber(rProductionResult.percentYield, 2) }} %</span
                          >
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">% Loss</span>
                          <span class="info-value"
                            >{{ formatNumber(rProductionResult.percentLoss, 2) }} %</span
                          >
                        </div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="info-item">
                          <span class="info-label">น้ำหนัก AVG</span>
                          <span class="info-value"
                            >{{
                              formatNumber(rProductionResult.avgDetectWeight, 2)
                            }}
                            G</span
                          >
                        </div>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-textarea
                          v-model="mProblemResolve"
                          label="ปัญหา / การแก้ไขปัญหา"
                          variant="outlined"
                          rows="2"
                          prepend-inner-icon="mdi-file-document-edit-outline"
                          class="input-field"
                          maxlength="255"
                          :readonly="
                            !operatorEdit &&
                            !supervisorEdit &&
                            !managerEdit &&
                            !adminEdit &&
                            !flagCreate
                          "
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="dialog-actions justify-center mb-3">
          <!-- ✅ เพิ่ม mb-4 -->
          <v-btn
            v-show="canEdit(mSelectedReqQa)"
            color="success"
            large
            elevation="6"
            class="rounded-xl text-white font-weight-bold px-8 py-2 transition"
            @click="submitForm"
          >
            <v-icon left>mdi-check-circle-outline</v-icon> บันทึก
          </v-btn>

          <v-btn
            color="red darken-3"
            large
            elevation="6"
            class="rounded-xl text-white font-weight-bold px-8 py-2 transition"
            @click="resetForm"
          >
            <v-icon left>mdi-close-circle-outline</v-icon> ยกเลิก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialogPicture -->
    <v-dialog v-model="dialogPicture" max-width="600px">
      <v-card>
        <v-card-title class="dialog-header">
          <span class="dialog-title">✨ Batch No.✨</span>
          <v-btn icon @click="dialogPicture = false" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-img :src="selectedImage" max-height="400" max-width="100%" contain></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogPicture = false">ปิด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      :color="snackbarColor"
      rounded="pill"
      class="text-center"
    >
      {{ msgSnackbar }}
    </v-snackbar>
    <loading :isLoading="isLoading" />
  </v-container>
</template>

<script>
import loading from "@/components/Loading.vue";
import { useUserStore } from "@/stores/userStore";
import CustomDatepicker from "@/components/CustomDatepicker.vue";
import DateTimePicker from "@/components/DateTimePicker.vue";
import keyFilter from "@/utils/keyFilter.js";

import {
  gLineProcess,
  gLineProcessNotWorking,
  gVendor,
  gPreparing,
  gLineClearance,
  gMaterialMaster,
  gReasonDetail,
  gRandomDetect,
  pUploadFileBatchNo,
  pDeleteFileBatchNo,
  gTReasonDetail,
  pFormList,
  pLineClearance,
  pPreparing,
  gTLineClearance,
  gTPreparing,
  gTFormList,
  gTFormListById,
  pProblemRandomDetect,
  gTProblemRandomDetect,
  gTProblemRandomDetectWeight,
  pTProblemRandomDetectWeight,
  dTProblemRandomDetectWeight,
  dFormList,
  gTProductionResult,
} from "@/services/apiQa.js";
import Swal from "sweetalert2";
import { isEmpty } from "lodash";

export default {
  name: "HomePage",
  components: {
    loading,
    CustomDatepicker,
    DateTimePicker,
  },
  setup() {
    const userStore = useUserStore();
    return {
      user: userStore,
    };
  },
  data() {
    return {
      rProductionResult: [],
      keyFilter,
      flagEdit: false,
      sDisabledDate: false,
      sProductionDateStart: this.getFirstDayOfMonthYYYYMMDD(),
      sProductionDateEnd: this.getTodayYYYYMMDD(),
      operatorEdit: false,
      supervisorEdit: false,
      managerEdit: false,
      adminEdit: false,
      flagCreate: true,
      viewOnly: false,
      mSelectedReqQa: [],
      showSnackbar: false,
      msgSnackbar: "",
      snackbarColor: "yellow",
      preparingItem: [],
      clearanceItem: [],
      selectedDateTime: new Date(),
      FileBatch: [],
      mProductionDate: "",
      mInspectionDate: "",
      dialog: false,
      isLoading: false,
      mSearch: "",
      //   model picture Batch No
      dialogPicture: false,
      selectedImage: "",
      tab: "Home",
      tabs: [
        {
          icon: "mdi-head-lightbulb-outline",
          text: "หน้าแรก",
          value: "Home",
        },
        {
          icon: "mdi-file-document-edit-outline",
          text: "รายละเอียด",
          value: "Detail",
        },
      ],
      tabsTime: [],
      headersListQa: [
        {
          title: "เลขที่เอกสาร",
          align: "left",
          key: "formID",
        },
        {
          title: "ไลน์ผลิต",
          align: "left",
          key: "lineProcessName",
        },
        {
          title: "ผลิตภัณฑ์",
          align: "left",
          key: "materialDesc",
        },
        {
          title: "ผู้สร้างเอกสาร",
          align: "left",
          key: "samAccount",
        },
        {
          title: "วันที่ผลิต",
          align: "left",
          key: "productionDate",
        },
        {
          title: "วันที่ตรวจสอบ",
          align: "left",
          key: "checkIN",
        },
        {
          title: "สถานะ",
          align: "left",
          key: "status",
        },
        {
          title: "Actions",
          align: "center",
          key: "actions",
          sortable: false,
        },
      ],

      listQaReq: [],
      rawListQaReq: [],
      headersDProduct: [
        {
          title: "รายละเอียด",
          align: "left",
          key: "reasonHeader",
        },
        {
          title: "รายการ",
          align: "left",
          key: "reasonDesc",
        },
        {
          title: "บริษัท",
          align: "left",
          key: "vendorDesc",
        },
        {
          title: "Batch No.",
          align: "left",
          key: "batchNo",
        },
        {
          title: "Actions",
          align: "center",
          key: "actions",
          sortable: false,
        },
      ],
      listDProduct: [],
      headersVerifyProduct: [
        {
          title: "ลำดับ",
          align: "left",
          key: "index",
        },
        {
          title: "น้ำหนัก",
          align: "left",
          key: "detectWeightFormatted",
        },
        {
          title: "Actions",
          align: "center",
          key: "actions",
          sortable: false,
        },
      ],
      listVerifyProduct: [],
      iVerifyProduct: [],
      mLineprocess: "",
      iLineprocess: [],
      mcMaterial: "",
      mMaterial: "",
      iMaterial: [],
      mProblemResolve: "",
      iVendor: [],
      mVendor: "",
      iRawReasonDetail: [],
      iReasonDetail: [],
      mReasonDetail: "",
      iReasonDetailItem: [],
      mReasonDetailItem: "",
      mWeightPacking: "",
      mProdPlanEA: "",
      mProdPlanQtyEA: "",
      mExpectedProdEA: "",
      mStdTime: "",
      mStdWeight: "",
      mBulkUsed: 0,
      mBulkQuoted: 0,
      mBulkActually: 0,
      mScale: "",
      mTLineClearance: [],
      mTPreparing: [],
      selectedTabTime: null,
      selectedItemsTime: [],
      mCreateOnly: false,
      mRawDataRandomDetect: [],
      CreateByName: "",
      mWeight: "",
      mFilterStatus: null,
      mFilterLineProcess: null,
      mRemarkClearance: "",
      dialogNotification: false,
      imagesNotification: [require("@/assets/images/I.P. Portal 2025.png")],
    };
  },
  created() {
    this.gLineProcess();
    this.gVendor();
    this.gMaterialMaster();
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((tab) => {
        if (tab.value === "Detail") {
          return this.mSelectedReqQa.length !== 0; // ✅ แสดง "รายละเอียด" เมื่อ mSelectedReqQa มีค่า
        }
        return true; // ✅ แสดง "หน้าแรก" เสมอ
      });
    },
    iFilterLineProcess() {
      // ใช้ Map เพื่อลดค่า lineProcessID ที่ซ้ำ และจับคู่กับ lineProcessName ที่ถูกต้อง
      const lineProcessMap = new Map();

      this.rawListQaReq.forEach((item) => {
        if (item.lineProcessID && item.lineProcessName) {
          lineProcessMap.set(item.lineProcessID, item.lineProcessName);
        }
      });

      // แปลง Map เป็นอาร์เรย์ของ Object สำหรับ `v-autocomplete`
      return Array.from(lineProcessMap, ([lineProcessID, lineProcessName]) => ({
        lineProcessID,
        displayLineProcessName: lineProcessName,
      }));
    },
    iFilterStatus() {
      const uniqueStatuses = [...new Set(this.rawListQaReq.map((item) => item.status))];
      return uniqueStatuses
        .filter((status) => status.trim() !== "") // ลบค่า `status` ที่ว่างออก
        .map((status) => ({
          status: status,
          displayStatus: this.translateStatus(status), // แปลงเป็นภาษาไทย
        }));
    },
    formattedWeight: {
      get() {
        if (!this.mWeight) return ""; // ถ้าว่างให้คืนค่าว่าง

        // แยกค่าตัวเลขกับทศนิยม
        let parts = this.mWeight.split(".");
        parts[0] = parseInt(parts[0]).toLocaleString("en-US"); // ใส่ comma เฉพาะส่วนหลักพัน
        return parts.join("."); // รวมกลับเป็นค่าแสดงผล
      },
      set(value) {
        this.mWeight = value.replace(/,/g, ""); // ลบ comma ออกแล้วเก็บค่า
      },
    },
    formattedWeightPacking: {
      get() {
        if (!this.mWeightPacking) return "0"; // ถ้าค่าว่างให้เป็น "0"
        let parts = this.mWeightPacking.split(".");
        parts[0] = parseInt(parts[0] || "0").toLocaleString("en-US"); // แสดง comma เฉพาะตัวเลขหลักพัน
        return parts.join(".");
      },
      set(value) {
        let cleanedValue = value.replace(/,/g, ""); // ลบ comma ออก
        if (cleanedValue === "" || cleanedValue === ".") {
          this.mWeightPacking = "0"; // ป้องกัน NaN หรือค่า "." อย่างเดียว
        } else {
          this.mWeightPacking = cleanedValue;
        }
      },
    },
    formattedStdWeight: {
      get() {
        if (!this.mStdWeight) return "0";
        let parts = this.mStdWeight.split(".");
        parts[0] = parseInt(parts[0]).toLocaleString("en-US"); // ใส่ comma เฉพาะหลักพัน
        return parts.join(".");
      },
      set(value) {
        let cleanedValue = value.replace(/,/g, ""); // ลบ comma ออก
        if (cleanedValue === "" || cleanedValue === ".") {
          this.mStdWeight = "0"; // ป้องกัน NaN หรือค่า "." อย่างเดียว
        } else {
          this.mStdWeight = cleanedValue;
        }
      },
    },
    formattedStdTime: {
      get() {
        if (!this.mStdTime) return "0";
        let parts = this.mStdTime.split(".");
        parts[0] = parseInt(parts[0]).toLocaleString("en-US"); // ใส่ comma เฉพาะหลักพัน
        return parts.join(".");
      },
      set(value) {
        let cleanedValue = value.replace(/,/g, ""); // ลบ comma ออก
        if (cleanedValue === "" || cleanedValue === ".") {
          this.mStdTime = "0"; // ป้องกัน NaN หรือค่า "." อย่างเดียว
        } else {
          this.mStdTime = cleanedValue;
        }
      },
    },
    formattedBulkUsed: {
      get() {
        if (!this.mBulkUsed) return "0";
        let parts = this.mBulkUsed.split(".");
        parts[0] = parseInt(parts[0]).toLocaleString("en-US"); // ใส่ comma เฉพาะหลักพัน
        return parts.join(".");
      },
      set(value) {
        let cleanedValue = value.replace(/,/g, ""); // ลบ comma ออก
        if (cleanedValue === "" || cleanedValue === ".") {
          this.mBulkUsed = "0"; // ป้องกัน NaN หรือค่า "." อย่างเดียว
        } else {
          this.mBulkUsed = cleanedValue;
        }
      },
    },
    formattedBulkQuoted: {
      get() {
        if (!this.mBulkQuoted) return "0";
        let parts = this.mBulkQuoted.split(".");
        parts[0] = parseInt(parts[0]).toLocaleString("en-US"); // ใส่ comma เฉพาะหลักพัน
        return parts.join(".");
      },
      set(value) {
        let cleanedValue = value.replace(/,/g, ""); // ลบ comma ออก
        if (cleanedValue === "" || cleanedValue === ".") {
          this.mBulkQuoted = "0"; // ป้องกัน NaN หรือค่า "." อย่างเดียว
        } else {
          this.mBulkQuoted = cleanedValue;
        }
      },
    },
    formattedBulkActually: {
      get() {
        if (!this.mBulkActually) return "0";
        let parts = this.mBulkActually.split(".");
        parts[0] = parseInt(parts[0]).toLocaleString("en-US"); // ใส่ comma เฉพาะหลักพัน
        return parts.join(".");
      },
      set(value) {
        let cleanedValue = value.replace(/,/g, ""); // ลบ comma ออก
        if (cleanedValue === "" || cleanedValue === ".") {
          this.mBulkActually = "0"; // ป้องกัน NaN หรือค่า "." อย่างเดียว
        } else {
          this.mBulkActually = cleanedValue;
        }
      },
    },
    formattedProdPlanEA: {
      get() {
        if (!this.mProdPlanEA) return "";
        return parseInt(this.mProdPlanEA).toLocaleString("en-US"); // ใส่ comma
      },
      set(value) {
        this.mProdPlanEA = value.replace(/,/g, ""); // ลบ comma ออกแล้วเก็บค่า
      },
    },
    formattedExpectedProdEA: {
      get() {
        if (!this.mExpectedProdEA) return "";
        return parseInt(this.mExpectedProdEA).toLocaleString("en-US"); // ใส่ comma
      },
      set(value) {
        this.mExpectedProdEA = value.replace(/,/g, ""); // ลบ comma ออกแล้วเก็บค่า
      },
    },
    formattedProdPlanQtyEA: {
      get() {
        if (!this.mProdPlanQtyEA) return "";
        return parseInt(this.mProdPlanQtyEA).toLocaleString("en-US"); // ใส่ comma
      },
      set(value) {
        this.mProdPlanQtyEA = value.replace(/,/g, ""); // ลบ comma ออกแล้วเก็บค่า
      },
    },
  },
  watch: {
    mFilterStatus() {
      this.filterListQaReq();
    },
    mFilterLineProcess() {
      this.filterListQaReq();
    },
    selectedTabTime(val) {
      if (!val) return "Unknow";
      this.mWeight = "";
      this.CreateByName = "";
      this.flagEdit = true;
      const [datePart, timePart] = val.split(" ");
      const [day, month, year] = datePart.split("/");
      const formattedGroupDate = `${year}${month}${day}`; // แปลงเป็น YYYYMMDD
      const formattedGroupTime = timePart; // HH:MM (คงค่าเดิม)

      const initGet = {
        formID: this.mSelectedReqQa.formID,
        groupDate: formattedGroupDate,
        groupTime: formattedGroupTime,
      };
      this.gTProblemRandomDetectWeight(initGet);

      // ✅ ค้นหาและกรองข้อมูลที่ตรงกับ groupDate และ groupTime
      const filterRandomDetact = this.mRawDataRandomDetect.filter(
        (item) => item.groupDate === formattedGroupDate && item.groupTime === timePart
      );

      if (filterRandomDetact.length !== 0) {
        // ✅ ใช้ข้อมูลจาก mRawDataRandomDetect
        this.iVerifyProduct = this.iVerifyProduct.map((item) => {
          const matchedItem = filterRandomDetact.find(
            (lc) => lc.problemDetectID === item.problemDetectID
          );
          if (matchedItem) {
            this.CreateByName = `${matchedItem.createByName} (${matchedItem.createBy})`;
            this.flagEdit = matchedItem.createBy == this.user.empId;
          }
          return {
            ...item,
            selected: matchedItem ? matchedItem.detect : null,
          };
        });
      } else {
        const filterSelectedItems = this.selectedItemsTime.filter(
          (item) => item.DateTime === val // ตรวจสอบค่า DateTime ตรงกับ selectedTabTime
        );

        this.iVerifyProduct = this.iVerifyProduct.map((item) => {
          const matchedItem = filterSelectedItems.find(
            (lc) => lc.problemDetectID === item.problemDetectID
          );
          return {
            ...item,
            selected: matchedItem ? matchedItem.selected : null,
          };
        });
      }
    },
    mLineprocess(val) {
      if (val.length === 0) return "Unknow";
      this.gPreparing(val.lineProcessID);
      this.gLineClearance(val.lineProcessID);
      this.gReasonDetail(val.lineProcessID);
      this.gRandomDetect(val.lineProcessID);
    },
    mReasonDetail(val) {
      // ตรวจสอบถ้า val ไม่มีค่า หรือความยาวเป็น 0 ให้คืนค่า "Unknown"
      if (!val || val.length === 0) return "Unknown";
      // กรองข้อมูลใน iRawReasonDetail ด้วย reasonID
      const filteredItems = this.iRawReasonDetail.filter(
        (item) => item.reasonID === val.reasonID
      );
      // ถ้าหาไม่เจอ ให้คืนค่า "Unknown"
      if (filteredItems.length === 0) {
        this.iReasonDetailItem = []; // อัปเดต iReasonDetailItem เป็นค่าว่าง
        this.mReasonDetailItem = "";
        return "Unknown";
      }
      // อัปเดต iReasonDetailItem ด้วยรายการที่กรองได้
      this.iReasonDetailItem = filteredItems;
      this.mReasonDetailItem = "";
      this.mVendor = "";
      // คืนค่ารายการ reasonDesc (สามารถปรับได้ตามความต้องการ)
      return filteredItems.map((item) => item.reasonDesc).join(", ");
    },
  },
  methods: {
    formatNumber(value, decimalPlaces = 0) {
      if (value === null || value === undefined || value === "") {
        return decimalPlaces > 0 ? "0.00" : "0";
      }

      // แปลงค่าเป็นตัวเลข
      let num = parseFloat(value);
      if (isNaN(num)) return decimalPlaces > 0 ? "0.00" : "0";

      // ใช้ Intl.NumberFormat เพื่อเพิ่ม comma และทศนิยม
      return num.toLocaleString("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
    },
    updateProdPlanQtyEA(event) {
      let value = event.target.value.replace(/,/g, ""); // ลบ comma ออกก่อน
      if (/^\d*$/.test(value)) {
        // ให้กรอกเฉพาะตัวเลข ไม่มีทศนิยม
        this.mProdPlanQtyEA = value;
      }
    },
    updateExpectedProdEA(event) {
      let value = event.target.value.replace(/,/g, ""); // ลบ comma ออกก่อน
      if (/^\d*$/.test(value)) {
        // ให้กรอกเฉพาะตัวเลข ไม่มีทศนิยม
        this.mExpectedProdEA = value;
      }
    },
    updateProdPlanEA(event) {
      let value = event.target.value.replace(/,/g, ""); // ลบ comma ออกก่อน
      if (/^\d*$/.test(value)) {
        // ให้กรอกเฉพาะตัวเลข ไม่มีทศนิยม
        this.mProdPlanEA = value;
      }
    },
    updateBulkActually(event) {
      let value = event.target.value.replace(/,/g, ""); // ลบ comma ออกก่อน
      if (value === ".") {
        this.mBulkActually = "0."; // ป้องกัน "." อย่างเดียว
        return;
      }
      if (/^\d*\.?\d*$/.test(value)) {
        // ให้กรอกเฉพาะตัวเลขและทศนิยม
        this.mBulkActually = value;
      } else {
        this.mBulkActually = "0";
      }
    },
    updateBulkQuoted(event) {
      let value = event.target.value.replace(/,/g, ""); // ลบ comma ออกก่อน
      if (value === ".") {
        this.mBulkQuoted = "0."; // ป้องกัน "." อย่างเดียว
        return;
      }
      if (/^\d*\.?\d*$/.test(value)) {
        // ให้กรอกเฉพาะตัวเลขและทศนิยม
        this.mBulkQuoted = value;
      } else {
        this.mBulkQuoted = "0";
      }
    },
    updateWeight(event) {
      let value = event.target.value.replace(/,/g, ""); // ลบ comma ออกก่อน
      if (value === ".") {
        this.mWeight = "0."; // ป้องกัน "." อย่างเดียว
        return;
      }
      if (/^\d*\.?\d*$/.test(value)) {
        // เช็คให้สามารถพิมพ์ทศนิยมได้
        this.mWeight = value;
      } else {
        this.mWeight = "0";
      }
    },
    updateWeightPacking(event) {
      let value = event.target.value.replace(/,/g, ""); // ลบ comma ออกก่อน
      if (value === ".") {
        this.mWeightPacking = "0."; // ป้องกัน "." อย่างเดียว
        return;
      }
      if (/^\d*\.?\d*$/.test(value)) {
        // ให้กรอกเฉพาะตัวเลขและทศนิยม
        this.mWeightPacking = value;
      } else {
        this.mWeightPacking = "0"; // ถ้าค่าไม่ถูกต้องให้เป็น "0"
      }
    },
    updateStdWeight(event) {
      let value = event.target.value.replace(/,/g, ""); // ลบ comma ออกก่อน
      if (value === ".") {
        this.mStdWeight = "0."; // ป้องกัน "." อย่างเดียว
        return;
      }
      if (/^\d*\.?\d*$/.test(value)) {
        // ให้กรอกเฉพาะตัวเลขและทศนิยม
        this.mStdWeight = value;
      } else {
        this.mStdWeight = "0"; // ถ้าค่าไม่ถูกต้องให้เป็น "0"
      }
    },
    updateStdTime(event) {
      let value = event.target.value.replace(/,/g, ""); // ลบ comma ออกก่อน
      if (value === ".") {
        this.mStdTime = "0."; // ป้องกัน "." อย่างเดียว
        return;
      }
      if (/^\d*\.?\d*$/.test(value)) {
        // ให้กรอกเฉพาะตัวเลขและทศนิยม
        this.mStdTime = value;
      } else {
        this.mStdTime = "0"; // ถ้าค่าไม่ถูกต้องให้เป็น "0"
      }
    },
    updateBulkUsed(event) {
      let value = event.target.value.replace(/,/g, ""); // ลบ comma ออกก่อน
      if (value === ".") {
        this.mBulkUsed = "0."; // ป้องกัน "." อย่างเดียว
        return;
      }
      if (/^\d*\.?\d*$/.test(value)) {
        // ให้กรอกเฉพาะตัวเลขและทศนิยม
        this.mBulkUsed = value;
      } else {
        this.mBulkUsed = "0"; // ถ้าค่าไม่ถูกต้องให้เป็น "0"
      }
    },
    filterListQaReq() {
      if (
        (!this.mFilterStatus || this.mFilterStatus.length === 0) &&
        (!this.mFilterLineProcess || this.mFilterLineProcess.length === 0)
      ) {
        // 🔹 กรณีไม่มีการเลือก filter ทั้งสองตัว
        this.listQaReq = this.rawListQaReq;
      } else if (
        this.mFilterStatus &&
        this.mFilterStatus.length > 0 &&
        (!this.mFilterLineProcess || this.mFilterLineProcess.length === 0)
      ) {
        // 🔹 กรณีเลือกแค่ Status อย่างเดียว
        this.listQaReq = this.rawListQaReq.filter((element) =>
          this.mFilterStatus.some((status) => element.status === status.status)
        );
      } else if (
        (!this.mFilterStatus || this.mFilterStatus.length === 0) &&
        this.mFilterLineProcess &&
        this.mFilterLineProcess.length > 0
      ) {
        // 🔹 กรณีเลือกแค่ LineProcess อย่างเดียว
        this.listQaReq = this.rawListQaReq.filter((element) =>
          this.mFilterLineProcess.some(
            (lineProcess) => element.lineProcessID === lineProcess.lineProcessID
          )
        );
      } else {
        // 🔹 กรณีเลือกทั้ง Status และ LineProcess
        this.listQaReq = this.rawListQaReq.filter(
          (element) =>
            this.mFilterStatus.some((status) => element.status === status.status) &&
            this.mFilterLineProcess.some(
              (lineProcess) => element.lineProcessID === lineProcess.lineProcessID
            )
        );
      }
    },
    getFirstDayOfMonthYYYYMMDD() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      return `${yyyy}${mm}01`; // วันที่ 1 ของเดือน
    },
    getTodayYYYYMMDD() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      return `${yyyy}${mm}${dd}`;
    },
    translateStatus(status) {
      const statusMapping = {
        InProcess: "ระหว่างดำเนินการ",
        WaitConfirm: "ระหว่างตรวจสอบ",
        WaitApproved: "ระหว่างอนุมัติ",
        Completed: "เสร็จสิ้น",
      };
      return statusMapping[status] || "สถานะไม่ทราบ"; // กรณี status ไม่มีใน mapping
    },
    translateFlagStatus(status) {
      const statusMapping = {
        WaitConfirm: "ส่งตรวจสอบ",
        WaitApproved: "ส่งอนุมัติ",
        Completed: "เสร็จสิ้น",
      };
      return statusMapping[status] || "สถานะไม่ทราบ"; // กรณี status ไม่มีใน mapping
    },
    canEdit(item) {
      if (item.length == 0) return true;
      const userGroups = this.user.group;
      const itemStatus = item.status;

      const isOperator =
        ["PDD.OPERATOR", "PDD.QUALITY CONTROL"].some((group) =>
          userGroups.includes(group)
        ) && itemStatus === "InProcess";

      const isAdmin = userGroups.includes("PDD.ADMIN");

      const isManager = userGroups.includes("PDD.MANAGER") && itemStatus !== "Completed";

      const isSupervisor =
        userGroups.includes("PDD.SUPERVISOR") &&
        !["WaitApproved", "Completed"].includes(itemStatus);

      return isOperator || isAdmin || isManager || isSupervisor;
    },
    async plusWeight() {
      const [datePart, timePart] = this.selectedTabTime.split(" ");
      const [day, month, year] = datePart.split("/");
      const formattedGroupDate = `${year}${month}${day}`; // YYYYMMDD
      const formattedGroupTime = timePart; // HH:MM (คงค่าเดิม)
      const init = {
        formID: this.mSelectedReqQa.formID,
        groupDate: formattedGroupDate,
        groupTime: formattedGroupTime,
        detectWeight: Number(this.mWeight),
        employeeID: this.user.empId,
      };
      if (!this.mWeight && Number(this.mWeight) == 0) {
        return this.showError("กรุณากรอกน้ำหนัก");
      }
      this.isLoading = true;
      try {
        await pTProblemRandomDetectWeight(init);
        this.mWeight = "";
        const initGet = {
          formID: this.mSelectedReqQa.formID,
          groupDate: formattedGroupDate,
          groupTime: formattedGroupTime,
        };
        this.gTProblemRandomDetectWeight(initGet);
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    async gTProblemRandomDetectWeight(val) {
      this.isLoading = true;
      this.listVerifyProduct = [];
      try {
        const response = await gTProblemRandomDetectWeight(val);
        this.listVerifyProduct = response.results.map((item, index) => ({
          ...item,
          index: index + 1, // ✅ เพิ่มฟิลด์ index (เริ่มที่ 1)
          detectWeightFormatted: new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(parseFloat(item.detectWeight)), // ✅ เติม .00 และคั่น comma
        }));
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async deleteItemTFomList(item) {
      console.log(item, "deleteItemTFomList");
      Swal.fire({
        html: `คุณแน่ใจหรือไม่ว่าต้องการลบเลขที่เอกสาร <strong>${item.formID} </strong>?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          try {
            await dFormList(item.formID);
            Swal.fire({
              html: `ลบรายการสำเร็จ`,
              icon: "success",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonText: "OK",
            }).then(async (result) => {
              if (result.isConfirmed) {
                await this.gTFormList();
              }
            });
          } catch (e) {
            Swal.fire({
              text: "500 Internal server error",
              icon: "error",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonText: "OK",
            });
          } finally {
            // ปิดการแสดงผล Loading ในทุกกรณี
            this.isLoading = false;
          }
        }
      });
    },
    async deleteItemWeight(item) {
      this.dialog = false;
      Swal.fire({
        html: `คุณแน่ใจหรือไม่ว่าต้องการลบรายการลำดับที่  <strong>${item.index}</strong> <br> น้ำหนัก <strong>${item.detectWeight}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          const initDel = {
            formID: item.formID,
            groupDate: item.groupDate,
            groupTime: item.groupTime,
            detectno: item.detectno,
          };
          const initGet = {
            formID: item.formID,
            groupDate: item.groupDate,
            groupTime: item.groupTime,
          };
          try {
            await dTProblemRandomDetectWeight(initDel);
            await this.gTProblemRandomDetectWeight(initGet);
            this.dialog = true;
          } catch (e) {
            console.log(e);
            this.dialog = true;
          } finally {
            // ปิดการแสดงผล Loading ในทุกกรณี
            this.isLoading = false;
          }
        } else {
          this.dialog = true;
        }
      });
    },
    handleSelectionChange(item) {
      if (!this.selectedTabTime) return "selectedTabTime is null";
      // ✅ แปลง selectedTabTime ("07/02/2025 09:48") เป็น groupDate และ groupTime
      const [datePart, timePart] = this.selectedTabTime.split(" ");
      const [day, month, year] = datePart.split("/");
      const formattedGroupDate = `${year}${month}${day}`; // YYYYMMDD
      const formattedGroupTime = timePart; // HH:MM (คงค่าเดิม)

      // ✅ ค้นหาและอัปเดตค่า detect ใน this.mRawDataRandomDetect
      this.mRawDataRandomDetect.forEach((dataItem) => {
        if (
          dataItem.groupDate === formattedGroupDate &&
          dataItem.groupTime === formattedGroupTime &&
          dataItem.problemDetectID === item.problemDetectID
        ) {
          dataItem.detect = item.selected; // ✅ อัปเดตค่า detect
          dataItem.updateBy = this.user.empId;
        }
      });

      // ✅ ค้นหา index ใน selectedItemsTime
      const existingIndex = this.selectedItemsTime.findIndex(
        (i) =>
          i.problemDetectID === item.problemDetectID &&
          i.DateTime === this.selectedTabTime
      );

      if (existingIndex !== -1) {
        // ✅ ถ้ามี timestamp เดิมอยู่แล้ว → อัปเดตเฉพาะค่า selected
        this.selectedItemsTime[existingIndex].selected = item.selected;
        this.selectedItemsTime[existingIndex].updateBy = this.user.empId;
      }
    },
    removeLastTab() {
      if (this.tabsTime.length > 0) {
        this.tabsTime.pop(); // ✅ ลบแท็บสุดท้ายออก

        // ✅ ถ้ามีแท็บเหลือ ให้ตั้ง selectedTabTime เป็น value ของแท็บสุดท้าย
        if (this.tabsTime.length > 0) {
          this.selectedTabTime = this.tabsTime[this.tabsTime.length - 1].value;
        } else {
          this.selectedTabTime = null; // ✅ ถ้าไม่มีแท็บ ให้เป็น null
        }
      }

      // ✅ รีเซ็ตค่าที่เกี่ยวข้อง
      this.selectedItemsTime = [];
      this.mCreateOnly = false;
    },

    formatDateTime(date) {
      if (!(date instanceof Date) || isNaN(date)) return "-";

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return {
        date: `${day}/${month}/${year}`, // ✅ วันที่
        time: `${hours}:${minutes}`, // ✅ เวลา
      };
    },
    plusTimeSlot(minutesToAdd) {
      // แปลง minutesToAdd เป็น Date
      const newTime = new Date(minutesToAdd);

      const formatted = this.formatDateTime(newTime);

      // ดึง role ปัจจุบันของ user
      const userRole = this.MapRole(this.user.group);

      // กรองเฉพาะรายการที่ role ตรงกับ user
      const userTabs = this.tabsTime.filter((tab) => tab.role === userRole);

      if (userTabs.length > 0) {
        // แปลง tabsTime.value ให้เป็นรูปแบบที่ Date เข้าใจ
        const parseToDate = (value) => {
          const [date, time] = value.split(" "); // แยกวันที่และเวลา
          const [day, month, year] = date.split("/"); // แยกวัน/เดือน/ปี
          return new Date(`${year}-${month}-${day}T${time}:00`); // รวมฟอร์แมตใหม่
        };

        // แปลงเวลาล่าสุดจาก tabsTime.value เป็น Date
        const latestTime = userTabs
          .map((tab) => parseToDate(tab.value)) // แปลง value เป็น Date
          .sort((a, b) => b - a)[0]; // หาเวลาล่าสุด

        if (isNaN(latestTime)) {
          return this.showError("เวลาล่าสุดใน tabsTime ไม่ถูกต้อง");
        }
        // คำนวณระยะห่างระหว่าง newTime และ latestTime เป็นนาที
        const diffMinutes = (newTime.getTime() - latestTime.getTime()) / (1000 * 60);

        // เช็คว่าห่างกันมากกว่า 15 นาทีหรือไม่
        if (diffMinutes < 30) {
          return this.showError("กรุณาเพิ่มเวลาให้มากกว่ารายการล่าสุดอย่างน้อย 30 นาที");
        }
      }
      this.CreateByName = "";
      this.flagEdit = true;

      // ถ้าผ่านเงื่อนไข ก็เพิ่มรายการใหม่ได้
      const newTab = {
        icon: "mdi-clock-outline",
        text: formatted.date,
        value: formatted.date + " " + formatted.time,
        role: userRole,
        formattedText: `${formatted.date}<br>${formatted.time}`,
      };

      this.tabsTime.push(newTab);
      this.selectedTabTime = newTab.value;
      this.gRandomDetect(this.mLineprocess.lineProcessID);

      this.selectedItemsTime = this.iVerifyProduct.map((item) => ({
        ...item,
        selected: null, // ✅ ล้างค่า selected ให้เป็น null
        DateTime: formatted.date + " " + formatted.time,
        Date: this.FormatDate(formatted.date),
        Time: formatted.time,
        role: userRole,
      }));

      this.mCreateOnly = true;
    },
    MapRole(user) {
      const rolesPriority = [
        "PDD.ADMIN",
        "PDD.MANAGER",
        "PDD.SUPERVISOR",
        "PDD.OPERATOR",
        "PDD.QUALITY CONTROL",
      ];

      for (const role of rolesPriority) {
        if (user.includes(role)) {
          return role;
        }
      }

      return null;
    },
    FormatDate(val) {
      if (!val) return "Unknow";
      const date = val.split("/");
      return `${date[2]}${date[1]}${date[0]}`;
    },
    async gTFormList() {
      if (Number(this.sProductionDateStart) > Number(this.sProductionDateEnd)) {
        this.sDisabledDate = false;
        return this.showError("กรุณาเลือกวันที่ผลิตใหม่ เนื่องจากวันที่ผลิตไม่ถูกต้อง");
      }
      this.isLoading = true;
      try {
        // เก็บค่าเดิมของ mFilterStatus และ mFilterLineProcess (เฉพาะเมื่อมีค่า)
        const prevFilterStatus = this.mFilterStatus?.length
          ? [...this.mFilterStatus]
          : null;
        const prevFilterLineProcess = this.mFilterLineProcess?.length
          ? [...this.mFilterLineProcess]
          : null;

        // เคลียร์ค่าของ list ก่อนโหลดข้อมูลใหม่
        this.listQaReq = [];
        this.rawListQaReq = [];
        this.sDisabledDate = true;
        // ตั้งค่า request
        const init = {
          productionDateStart: this.sProductionDateStart,
          productionDateEnd: this.sProductionDateEnd,
          employeeID: this.user.empId,
          role: this.MapRole(this.user.group),
        };

        // เรียก API
        const response = await gTFormList(init);

        // อัปเดตข้อมูล
        this.rawListQaReq = response.results;
        this.listQaReq = response.results;

        // ✅ คืนค่าเก่าของ mFilterStatus และ mFilterLineProcess (ถ้ามี)
        this.$nextTick(() => {
          if (prevFilterStatus) this.mFilterStatus = prevFilterStatus;
          if (prevFilterLineProcess) this.mFilterLineProcess = prevFilterLineProcess;
        });
      } catch (e) {
        console.error("❌ Error fetching data:", e);
      } finally {
        // ปิดการแสดงผล Loading
        this.isLoading = false;
      }
    },
    selectAllPreparing(value) {
      this.preparingItem.forEach((item) => {
        item.selected = value;
      });
    },
    selectAllClearance(value) {
      this.clearanceItem.forEach((item) => {
        item.selected = value;
      });
    },
    selectAllVerifyProduct(value) {
      this.selectedItemsTime.forEach((item) => {
        if (item.DateTime === this.selectedTabTime) {
          item.selected = value;
        }
      });
      this.iVerifyProduct.forEach((item) => {
        item.selected = value;
      });
    },
    async deleteItemProductDetail(item) {
      this.dialog = false;
      Swal.fire({
        html: `คุณแน่ใจหรือไม่ว่าต้องการลบรายการ <br> <strong>${item.reasonHeader}</strong> : <strong>${item.reasonDesc}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          try {
            const init = {
              formID: item.formID,
              detectno: item.detectno,
              fileName: item.filename,
            };
            await pDeleteFileBatchNo(init);
            this.gTReasonDetail(this.mSelectedReqQa.formID);
            this.dialog = true;
          } catch (e) {
            console.log(e);
          } finally {
            this.isLoading = false;
          }
        } else {
          this.dialog = true;
        }
      });
    },
    async plusProduct() {
      if (isEmpty(this.mReasonDetail)) {
        return this.showError("กรุณาเลือกประเภทรายละเอียด");
      }
      if (isEmpty(this.mReasonDetailItem)) {
        return this.showError("กรุณาเลือกรายการ");
      }
      if (this.FileBatch == null) {
        return this.showError("กรุณาเลือกอัพโหลด Batch No.");
      }
      this.isLoading = true;
      try {
        await pUploadFileBatchNo(
          this.FileBatch,
          this.mSelectedReqQa.formID,
          this.mLineprocess.lineProcessID,
          this.mReasonDetail.reasonID,
          this.mReasonDetailItem.reasonDescID,
          this.mVendor.vendorNo || "-",
          this.mVendor.vendorDesc || "-",
          this.user.empId
        );
        this.gTReasonDetail(this.mSelectedReqQa.formID);
        this.mReasonDetail = "";
        this.mReasonDetailItem = "";
        this.mVendor = "";
        this.FileBatch = null;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    convertDateToDDMMYYYY(inputDate) {
      if (!/^\d{8}$/.test(inputDate)) return null; // ตรวจสอบว่าข้อมูลเป็น 8 หลัก

      const year = inputDate.substring(0, 4);
      const month = inputDate.substring(4, 6);
      const day = inputDate.substring(6, 8);

      return `${day}/${month}/${year}`;
    },
    getTabColor(role) {
      const roleColors = {
        "PDD.ADMIN": "bg-green lighten-3",
        "PDD.MANAGER": "bg-green lighten-3",
        "PDD.SUPERVISOR": "bg-green lighten-3",
        "PDD.OPERATOR": "light-blue darken-3",
        "PDD.QUALITY CONTROL": "bg-yellow",
      };

      return roleColors[role] || "bg-grey lighten-3"; // สีเริ่มต้นถ้าไม่มี role ที่ตรงกัน
    },
    async gTProblemRandomDetect(val) {
      this.isLoading = true;
      this.mRawDataRandomDetect = [];
      try {
        const response = await gTProblemRandomDetect(val);
        this.mRawDataRandomDetect = response.results;
        // ลบค่าซ้ำโดยใช้ groupDate และ groupTime
        const uniqueDates = new Map();
        let latestDateTime = { date: "", time: "" };
        response.results.forEach((item) => {
          const key = item.groupDate + " " + item.groupTime;
          if (!uniqueDates.has(key)) {
            uniqueDates.set(key, {
              date: item.groupDate,
              time: item.groupTime,
              role: item.role,
            });
          }
          if (
            item.groupDate > latestDateTime.date ||
            (item.groupDate === latestDateTime.date &&
              item.groupTime > latestDateTime.time)
          ) {
            latestDateTime = { date: item.groupDate, time: item.groupTime };
          }
        });

        // แปลงข้อมูลให้เป็น newTab format
        const uniqueTabs = Array.from(uniqueDates.values()).map((formatted) => ({
          icon: "mdi-clock-outline",
          text: this.convertDateToDDMMYYYY(formatted.date),
          value: this.convertDateToDDMMYYYY(formatted.date) + " " + formatted.time,
          role: formatted.role,
          formattedText: `${this.convertDateToDDMMYYYY(formatted.date)}<br>${
            formatted.time
          }`,
        }));
        // เพิ่มไปยัง tabsTime
        this.tabsTime = uniqueTabs;
        if (latestDateTime.date && latestDateTime.time) {
          this.selectedTabTime =
            this.convertDateToDDMMYYYY(latestDateTime.date) + " " + latestDateTime.time;
        }
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gTFormListById(val) {
      this.isLoading = true;
      try {
        const response = await gTFormListById(val);
        this.dialog = true;
        return response.results[0];
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gTProductionResult(val) {
      this.isLoading = true;
      try {
        const response = await gTProductionResult(val);
        return (this.rProductionResult = response.results[0]);
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gTReasonDetail(val) {
      this.isLoading = true;
      this.listDProduct = [];
      try {
        const response = await gTReasonDetail(val);
        this.listDProduct = response.results;
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gTLineClearance(val) {
      this.isLoading = true;
      this.mTLineClearance = [];
      try {
        const response = await gTLineClearance(val);
        this.mTLineClearance = response.results;
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gTPreparing(val) {
      this.isLoading = true;
      this.mTPreparing = [];
      try {
        const response = await gTPreparing(val);
        this.mTPreparing = response.results;
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gReasonDetail(val) {
      this.isLoading = true;
      try {
        const response = await gReasonDetail(val);
        this.iRawReasonDetail = response.results;
        // กรองค่าที่ซ้ำกันโดย reasonID
        this.iReasonDetail = this.iRawReasonDetail.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.reasonID === item.reasonID)
        );
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gRandomDetect(val) {
      this.isLoading = true;
      try {
        const response = await gRandomDetect(val);
        this.iVerifyProduct = [];
        this.iVerifyProduct = response.results.map((item) => ({
          ...item, // คัดลอกข้อมูลเดิม
          selected: null, // เพิ่มฟิลด์ selected
        }));
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gLineClearance(val) {
      this.isLoading = true;
      try {
        const response = await gLineClearance(val);
        this.clearanceItem = response.results.map((item) => ({
          ...item, // คัดลอกข้อมูลเดิม
          selected: null, // เพิ่มฟิลด์ selected
        }));
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gMaterialMaster(val) {
      this.isLoading = true;
      this.iMaterial = [];
      try {
        const response = await gMaterialMaster(val);
        this.iMaterial = response.results.map((item) => ({
          ...item, // คัดลอกข้อมูลเดิม
          displayMaterial: `${item.materialCode} : ${item.materialDescriptionTH}`, // เพิ่มฟิลด์ selected
        }));
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gPreparing(val) {
      this.isLoading = true;
      try {
        const response = await gPreparing(val);
        this.preparingItem = response.results.map((item) => ({
          ...item, // คัดลอกข้อมูลเดิม
          selected: null, // เพิ่มฟิลด์ selected
        }));
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gVendor() {
      this.isLoading = true;
      this.iVendor = [];
      try {
        const response = await gVendor();
        this.iVendor = response.results.map((item) => ({
          ...item, // คัดลอกข้อมูลเดิม
          displayVendor: `${item.vendorNo} : ${item.vendorDesc}`,
        }));
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async oPenDialog() {
      this.dialog = true;
      if (this.flagCreate) {
        await this.gLineProcessNotWorking();
      } else {
        await this.gLineProcess();
      }
    },
    async gLineProcess() {
      this.isLoading = true;
      this.iLineprocess = [];
      try {
        const response = await gLineProcess();
        this.iLineprocess = response.results;
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gLineProcessNotWorking() {
      this.isLoading = true;
      this.iLineprocess = [];
      try {
        const response = await gLineProcessNotWorking();
        this.iLineprocess = response.results;
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    showError(message, color = "yellow") {
      this.msgSnackbar = message;
      this.snackbarColor = color;
      this.showSnackbar = true;
    },
    handleFileChange() {
      const maxSize = 30 * 1024 * 1024; // 30MB in bytes
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      // ตรวจสอบว่ามีไฟล์หรือไม่
      if (!this.FileBatch || this.FileBatch.length === 0) {
        this.showError("กรุณาเลือกไฟล์");
        this.FileBatch = null; // รีเซ็ตค่า
        return;
      }
      // รับไฟล์แรกเท่านั้น
      const file = this.FileBatch;

      // ตรวจสอบว่าเป็นไฟล์ภาพหรือไม่
      if (!allowedTypes.includes(file.type)) {
        this.FileBatch = null;
        this.showError("กรุณาเลือกไฟล์รูปภาพที่เป็น JPG, PNG, GIF หรือ WEBP เท่านั้น");
        return;
      }

      // ตรวจสอบขนาดไฟล์
      if (file.size > maxSize) {
        this.showError("ไฟล์ " + file.name + " มีขนาดเกิน 30MB");
        this.FileBatch = null; // รีเซ็ตค่า
      } else {
        // เก็บไฟล์ที่ผ่านเงื่อนไข
        this.FileBatch = file;
      }
    },

    openImageDialog(imageUrl) {
      this.selectedImage = imageUrl; // ตั้งค่ารูปภาพที่เลือก
      this.dialogPicture = true; // เปิด dialogPicture
    },
    async editItemTFormList(item) {
      this.dialog = true;
      this.mSelectedReqQa = item;

      const userGroups = this.user.group;
      const itemStatus = item.status;
      this.flagCreate = false;
      this.operatorEdit =
        ["PDD.OPERATOR", "PDD.QUALITY CONTROL"].some((group) =>
          userGroups.includes(group)
        ) && itemStatus === "InProcess";

      this.supervisorEdit =
        userGroups.includes("PDD.SUPERVISOR") &&
        !["WaitApproved", "Completed"].includes(itemStatus);

      this.managerEdit = userGroups.includes("PDD.MANAGER") && itemStatus !== "Completed";

      this.adminEdit = userGroups.includes("PDD.ADMIN");

      await this.gTReasonDetail(this.mSelectedReqQa.formID);
      this.mLineprocess = {
        lineProcessID: item.lineProcessID,
        lineProcessName: item.lineProcessName,
      };
      await this.gTLineClearance(this.mSelectedReqQa.formID);
      await this.gTPreparing(this.mSelectedReqQa.formID);
      await this.gTProblemRandomDetect(this.mSelectedReqQa.formID);
      await this.gTProductionResult(this.mSelectedReqQa.formID);
      if (this.mTLineClearance.length != 0) {
        this.mcMaterial = {
          materialCode: this.mTLineClearance.material,
          displayMaterial: `${this.mTLineClearance.material} : ${this.mTLineClearance.materialDesc}`,
          materialDescriptionTH: this.mTLineClearance.materialDesc,
        };
        this.clearanceItem = this.clearanceItem.map((item) => {
          // ค้นหารายการที่มี reasonClearID ตรงกัน
          const matchedItem = this.mTLineClearance.details.find(
            (lc) => lc.reasonClearID === item.reasonClearID
          );

          return {
            ...item, // คัดลอกข้อมูลเดิม
            selected: matchedItem ? matchedItem.detect : null, // ใช้ detect แทน selected
          };
        });
      }
      if (this.mTPreparing.length != 0) {
        this.preparingItem = this.preparingItem.map((item) => {
          // ค้นหารายการที่มี reasonPreparingID ตรงกัน
          const matchedItem = this.mTPreparing.details.find(
            (lc) => lc.reasonPreparingID === item.reasonPreparingID
          );

          return {
            ...item, // คัดลอกข้อมูลเดิม
            selected: matchedItem ? matchedItem.detect : null, // ใช้ detect แทน selected
          };
        });
      }
      this.mMaterial = {
        materialCode: item.materialCode,
        displayMaterial: `${item.materialCode} : ${item.materialDesc}`,
        materialDescriptionTH: item.materialDesc,
        hgdesclV5: item.materialColor,
        hglV7: item.materialSize,
        hglV3: item.materialCategory,
      };
      this.mWeightPacking = item.weightPacking.toString();
      this.mProdPlanEA = item.prodPlanEA.toString();
      this.mProdPlanQtyEA = item.prodPlanQtyEA.toString();
      this.mExpectedProdEA = item.expectedProdEA.toString();
      this.mStdTime = item.stdTime.toString();
      this.mStdWeight = item.stdWeight.toString();
      this.mBulkUsed = item.bulkUsed.toString();
      this.mBulkQuoted = item.bulkQuoted.toString();
      this.mBulkActually = item.bulkActually.toString();
      this.mScale = item.scale;
      this.mProductionDate = item.productionDate;
      this.mInspectionDate = item.checkIN;
      this.mProblemResolve = item.remark;
      this.mRemarkClearance = item.remarkClearance;
    },
    closeSearch() {
      this.sDisabledDate = false;
      this.mFilterStatus = null;
      this.mFilterLineProcess = null;
      this.listQaReq = [];
      this.rawListQaReq = [];
    },
    async resetForm() {
      this.dialog = false;
      this.mSelectedReqQa = [];
      this.preparingItem = [];
      this.clearanceItem = [];
      this.selectedDateTime = new Date();
      this.FileBatch = [];
      this.mProductionDate = "";
      this.mInspectionDate = "";
      this.dialogPicture = false;
      this.selectedImage = "";
      this.tab = "Home";
      this.listDProduct = [];
      this.iVerifyProduct = [];
      this.mLineprocess = "";
      this.mcMaterial = "";
      this.mMaterial = "";
      this.mProblemResolve = "";
      this.mRemarkClearance = "";
      this.mVendor = "";
      this.mReasonDetail = "";
      this.mReasonDetailItem = "";
      this.iReasonDetailItem = [];
      this.mWeightPacking = "";
      this.mProdPlanEA = "";
      this.mProdPlanQtyEA = "";
      this.mExpectedProdEA = "";
      this.mStdTime = "";
      this.mStdWeight = "";
      this.mWeight = "";
      this.mBulkUsed = 0;
      this.mBulkQuoted = 0;
      this.mBulkActually = 0;
      this.mScale = "";
      this.mTLineClearance = [];
      this.mTPreparing = [];
      this.selectedTabTime = null;
      this.selectedItemsTime = [];
      this.tabsTime = [];
      this.mCreateOnly = false;
      this.mRawDataRandomDetect = [];
      this.CreateByName = "";
      this.operatorEdit = false;
      this.supervisorEdit = false;
      this.managerEdit = false;
      this.adminEdit = false;
      this.viewOnly = false;
      this.flagCreate = true;
      this.flagEdit = false;
      this.rProductionResult = [];
      if (this.sDisabledDate) {
        await this.gTFormList();
      }
    },
    async submitForm(flagStatus) {
      if (this.mSelectedReqQa.length == 0) {
        if (isEmpty(this.mLineprocess)) {
          return this.showError("กรุณาเลือกไลน์ผลิต");
        }
        if (isEmpty(this.mMaterial)) {
          return this.showError("กรุณาเลือกผลิตภัณฑ์");
        }
        if (isEmpty(this.mProductionDate)) {
          return this.showError("กรุณาเลือกวันที่ผลิต");
        }
        if (isEmpty(this.mInspectionDate)) {
          return this.showError("กรุณาเลือกวันที่ตรวจสอบ");
        }
        if (Number(this.mInspectionDate) < Number(this.mProductionDate)) {
          return this.showError("วันที่ตรวจสอบน้อยกว่าวันที่เริ่มผลิต");
        }
        if (!this.mWeightPacking && Number(this.mWeightPacking) == 0) {
          return this.showError("กรุณากรอกน้ำหนักภาชนะบรรจุและส่วนประกอบ");
        }
        if (!this.mStdWeight && Number(this.mStdWeight) == 0) {
          return this.showError("กรุณากรอกน้ำหนัก (STD) กรัม");
        }
        if (!this.mStdTime && Number(this.mStdTime) == 0) {
          return this.showError("กรุณากรอกเวลาบรรจุ STD (DZ/Hr.)");
        }
        if (!this.mScale) {
          return this.showError("กรุณากรอกเครื่องชัง BL");
        }
        if (isEmpty(this.mcMaterial)) {
          return this.showError("กรุณาเลือกผลิตภัณฑ์ รายการสินค้าผลิตก่อนหน้า");
        }
      } else {
        if (!this.mBulkUsed && Number(this.mBulkUsed) == 0) {
          return this.showError("กรุณากรอกปริมาณ Bulk ที่ใช้");
        }
        if (!this.mBulkQuoted && Number(this.mBulkQuoted) == 0) {
          return this.showError("กรุณากรอกปริมาณ Bulk ยกมา");
        }
        if (!this.mBulkActually && Number(this.mBulkActually) == 0) {
          return this.showError("กรุณากรอกปริมาณ Bulk ที่ใช้จริง");
        }
        if (!this.mProdPlanEA && Number(this.mProdPlanEA) == 0) {
          return this.showError("กรุณากรอกแผนการผลิต (EA)");
        }
        if (!this.mExpectedProdEA && Number(this.mExpectedProdEA) == 0) {
          return this.showError("กรุณากรอกคาดว่าผลิตได้ (EA)");
        }
        if (!this.mProdPlanQtyEA && Number(this.mProdPlanQtyEA) == 0) {
          return this.showError("กรุณากรอกจำนวนแผนการผลิต (EA)");
        }
      }
      if (flagStatus.length !== undefined) {
        this.dialog = false;

        const result = await Swal.fire({
          html: `คุณแน่ใจหรือไม่ว่าต้องการ <strong>${this.translateFlagStatus(
            flagStatus
          )}</strong> <br> เลขที่เอกสาร : ${this.mSelectedReqQa.formID} ?`,
          icon: "warning",
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });

        if (!result.isConfirmed) {
          this.dialog = true;
          return; // ❌ หยุดการทำงานที่นี่ ถ้าผู้ใช้กดยกเลิก
        }
      }
      this.isLoading = true;
      try {
        const init = {
          formID: this.mSelectedReqQa.length == 0 ? "" : this.mSelectedReqQa.formID,
          lineProcessID: this.mLineprocess.lineProcessID,
          userID:
            this.mSelectedReqQa.length == 0
              ? this.user.empId
              : this.mSelectedReqQa.userID,
          materialCode: this.mMaterial.materialCode,
          materialDesc: this.mMaterial.materialDescriptionTH,
          materialColor: this.mMaterial.hgdesclV5,
          materialSize: this.mMaterial.hglV7,
          materialCategory: this.mMaterial.hglV3,
          weightPacking: Number(this.mWeightPacking),
          prodPlanEA: Number(this.mProdPlanEA),
          prodPlanQtyEA: Number(this.mProdPlanQtyEA),
          expectedProdEA: Number(this.mExpectedProdEA),
          stdTime: Number(this.mStdTime),
          stdWeight: Number(this.mStdWeight),
          bulkUsed: Number(this.mBulkUsed),
          bulkQuoted: Number(this.mBulkQuoted),
          bulkActually: Number(this.mBulkActually),
          scale: this.mScale,
          productionDate: this.mProductionDate,
          checkIN: this.mInspectionDate,
          checkOut: "",
          status:
            this.mSelectedReqQa.length == 0
              ? "InProcess"
              : flagStatus.length == undefined
              ? this.mSelectedReqQa.status
              : flagStatus,
          remark: this.mProblemResolve,
          remarkClearance: this.mRemarkClearance,
          employeeID: this.user.empId,
        };
        const response = await pFormList(init);

        this.dialog = false;
        Swal.fire({
          html: `บันทึกสำเร็จ เลขที่เอกสาร : ${response.formID}`,
          icon: "success",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.ClearingPreparing(response.formID);
            this.resetForm();
            const data = await this.gTFormListById(response.formID);
            this.editItemTFormList(data);
          }
        });
      } catch (e) {
        this.dialog = false; // ปิด dialog ชั่วคราว
        Swal.fire({
          text: "500 Internal server error",
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        }).then(() => {
          this.dialog = true; // เปิด dialog กลับ
        });
      } finally {
        this.isLoading = false;
      }
    },
    async ClearingPreparing(formID) {
      if (this.mcMaterial.length != 0) {
        const init = {
          formID: this.mSelectedReqQa.length == 0 ? formID : this.mSelectedReqQa.formID,
          lineProcessID: this.mLineprocess.lineProcessID,
          lineProcessName: this.mLineprocess.lineProcessName,
          material: this.mcMaterial.materialCode,
          materialDesc: this.mcMaterial.materialDescriptionTH,
          updateBy: this.user.empId,
          details: [], // ✅ เพิ่ม details เป็นอีกฟิลด์
        };

        for (let index = 0; index < this.clearanceItem.length; index++) {
          init.details.push({
            reasonClearID: this.clearanceItem[index].reasonClearID, // ✅ ต้องใช้ index
            reasonClearDesc: this.clearanceItem[index].reasonClearDesc,
            detect:
              this.clearanceItem[index].selected == null
                ? ""
                : this.clearanceItem[index].selected,
          });
        }
        try {
          await pLineClearance(init);
        } catch (e) {
          console.log(e);
        }
      }

      if (this.preparingItem.length != 0) {
        const init = {
          formID: this.mSelectedReqQa.length == 0 ? formID : this.mSelectedReqQa.formID,
          lineProcessID: this.mLineprocess.lineProcessID,
          updateBy: this.user.empId,
          details: [],
        };
        for (let index = 0; index < this.preparingItem.length; index++) {
          init.details.push({
            reasonPreparingID: this.preparingItem[index].reasonPreparingID, // ✅ ต้องใช้ index
            reasonPreparingDesc: this.preparingItem[index].reasonPreparingDesc,
            detect:
              this.preparingItem[index].selected == null
                ? ""
                : this.preparingItem[index].selected,
          });
        }
        try {
          await pPreparing(init);
        } catch (e) {
          console.log(e);
        }
      }
      if (this.selectedItemsTime.length != 0 || this.mRawDataRandomDetect.length != 0) {
        const init = {
          formID: this.mSelectedReqQa.length == 0 ? formID : this.mSelectedReqQa.formID,
          lineProcessID: this.mLineprocess.lineProcessID,
          details: [],
        };
        if (this.selectedItemsTime.length != 0) {
          for (let index = 0; index < this.selectedItemsTime.length; index++) {
            init.details.push({
              role: this.selectedItemsTime[index].role,
              groupDate: this.selectedItemsTime[index].Date,
              groupTime: this.selectedItemsTime[index].Time,
              problemDetectID: this.selectedItemsTime[index].problemDetectID,
              problemDetectDesc: this.selectedItemsTime[index].problemDetectDesc,
              employeeID: this.user.empId,
              detect:
                this.selectedItemsTime[index].selected == null
                  ? ""
                  : this.selectedItemsTime[index].selected,
            });
          }
        }
        if (this.mRawDataRandomDetect.length != 0) {
          for (let index = 0; index < this.mRawDataRandomDetect.length; index++) {
            init.details.push({
              role: this.mRawDataRandomDetect[index].role,
              groupDate: this.mRawDataRandomDetect[index].groupDate,
              groupTime: this.mRawDataRandomDetect[index].groupTime,
              problemDetectID: this.mRawDataRandomDetect[index].problemDetectID,
              problemDetectDesc: this.mRawDataRandomDetect[index].problemDetectDesc,
              employeeID: this.mRawDataRandomDetect[index].updateBy,
              detect:
                this.mRawDataRandomDetect[index].detect == null
                  ? ""
                  : this.mRawDataRandomDetect[index].detect,
            });
          }
        }
        try {
          await pProblemRandomDetect(init);
        } catch (e) {
          console.log(e);
        }
      }
    },
    formatDateCheckin(dateStr) {
      // ตรวจสอบว่าข้อมูลมีความยาวที่ถูกต้อง
      if (dateStr.length !== 14) {
        throw new Error("Invalid date format");
      }

      // แยกส่วนของวันที่
      const year = dateStr.slice(0, 4); // ปี
      const month = dateStr.slice(4, 6); // เดือน
      const day = dateStr.slice(6, 8); // วัน
      const hhmm = dateStr.slice(8);

      // จัดรูปแบบวันที่
      return `${day}/${month}/${year} ${hhmm}`;
    },
    formatDateProductionDate(dateStr) {
      // ตรวจสอบว่าข้อมูลมีความยาวที่ถูกต้อง
      if (dateStr.length !== 8) {
        throw new Error("Invalid date format");
      }

      // แยกส่วนของวันที่
      const year = dateStr.slice(0, 4); // ปี
      const month = dateStr.slice(4, 6); // เดือน
      const day = dateStr.slice(6, 8); // วัน

      // จัดรูปแบบวันที่
      return `${day}/${month}/${year}`;
    },
  },
};
</script>
<style scoped>
/* General Styles */
.table-page {
  padding: 20px;
  position: relative;
}
.custom-toolbar {
  background: linear-gradient(
    360deg,
    rgba(255, 219, 122, 1) 0%,
    rgba(248, 200, 73, 1) 35%,
    rgba(240, 176, 6, 1) 100%
  ) !important;
  border-radius: 10px 10px 0px 0px !important;
}

/* Table Styles */
.data-table {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.data-table .v-data-table-header th {
  background: linear-gradient(90deg, #007fc4, #005f9c);
  color: white;
  font-weight: bold;
  text-align: left;
}

::v-deep(.v-data-table__th) {
  background: linear-gradient(
    90deg,
    rgba(0, 127, 196, 1) 0%,
    rgba(0, 127, 196, 1) 35%,
    rgba(0, 127, 196, 1) 100%
  ) !important;
  color: white !important;
}

::v-deep(.data-table td, .data-table th) {
  text-align: left !important; /* บังคับข้อความให้ชิดซ้าย */
  vertical-align: middle !important; /* จัดให้อยู่ตรงกลางแนวตั้ง */
}

::v-deep(.input-field) {
  margin-bottom: -1.5rem; /* สำหรับระยะห่างแนวตั้งในจอเล็ก */
  color: #007fc4 !important;
}
/* Center the title */
::v-deep(.centered-title) {
  flex: 1; /* ใช้ flex เต็มพื้นที่ */
  text-align: center;
  font-weight: bold;
  color: white;
}

/* Custom styles for refresh button (optional) */
.refresh-btn {
  position: absolute;
  right: 16px;
  top: 4px;
}

.action-buttons {
  display: flex; /* ใช้ Flexbox */
  justify-content: center; /* จัดปุ่มให้อยู่ตรงกลาง */
  align-items: center; /* จัดตำแหน่งให้อยู่ตรงแนวเดียวกัน */
  gap: 2px; /* ระยะห่างระหว่างปุ่ม */
  width: 100%; /* ใช้พื้นที่เต็มของเซลล์ */
}

::v-deep(.v-data-table__wrapper td) {
  vertical-align: middle !important; /* จัดให้อยู่ตรงกลางแนวตั้ง */
}

/* Actions */
.fab {
  background-color: #007fc4 !important;
  color: white !important;
  bottom: -10px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2) !important;
  z-index: 100 !important;
}
.fab:hover {
  background-color: #ea8da2 !important; /* สีเหลืองเข้มเมื่อ hover */
}

/* ลดระยะห่างในหน้าจอเล็ก */
.filter-row {
  gap: 8px; /* ลดช่องว่างระหว่างคอลัมน์ */
  margin-bottom: 0; /* ลดระยะห่างแนวตั้งของทั้งแถว */
}

.filter-col {
  margin-bottom: 4px; /* ลดช่องว่างระหว่างฟิลด์ในแนวตั้ง */
}

.filter-select,
.search-bar {
  margin-bottom: 12px; /* เพิ่มระยะห่างแนวตั้งสำหรับจอเล็ก */
}

@media (min-width: 600px) {
  .filter-row {
    gap: 16px; /* ขยายช่องว่างเมื่อหน้าจอใหญ่ขึ้น */
  }
  .filter-col {
    margin-bottom: 8px;
  }
}

@media (min-width: 960px) {
  .filter-row {
    gap: 24px; /* ระยะห่างปกติในหน้าจอขนาดใหญ่ */
  }
  .filter-col {
    margin-bottom: 0; /* เอาช่องว่างออกในหน้าจอใหญ่ */
  }
  .input-field {
    margin-bottom: -1.3rem; /* สำหรับระยะห่างแนวตั้งในจอเล็ก */
    color: #007fc4 !important;
  }
}

.dialog-width-noti {
  max-width: 50%; /* กำหนดความกว้างของ dialog */
}

.carousel-image {
  width: 100%; /* รูปภาพเต็มความกว้างของ container */
  height: 100%; /* รูปภาพเต็มความสูงของ container */
  object-fit: cover; /* ปรับให้รูปภาพเติมพื้นที่ container */
  border-radius: 8px; /* มุมโค้งของรูปภาพ */
}

@media screen and (max-width: 600px) {
  .dialog-width-noti {
    max-width: 100%; /* ลดความกว้าง dialog สำหรับหน้าจอมือถือ */
  }

  .carousel-image {
    max-width: 100%; /* จำกัดความกว้าง */
    max-height: 100%; /* จำกัดความสูง */
    object-fit: contain; /* รักษาสัดส่วนของภาพ */
  }
}

/* Dialog Card Styles */
.dialog-card {
  border-radius: 24px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  animation: fadeIn 0.5s ease-in-out;
  overflow: hidden; /* ป้องกันส่วนที่เกินจาก Header */
  position: relative; /* สำหรับปุ่ม Close */
  max-height: 100vh;
  overflow-y: auto;
}

/* Header */
.dialog-header {
  background: linear-gradient(90deg, #007fc4, #005f9c);
  color: white;
  padding: 16px;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: white;
  color: #007fc4;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  z-index: 10;
}
.close-btn:hover {
  background-color: #f8c849;
  color: white !important;
}

.custom-tab {
  font-weight: 600;
  text-transform: uppercase;
  color: black;
}

.content-container {
  color: #333;
  font-size: 1.2rem;
  line-height: 1.5;
  background-color: #ffffff;
  border-radius: 8px;
}

.v-tabs-slider {
  height: 3px;
}
.systems-page {
  background-color: #ffffff;
  padding: 0px 0px;
}

.grey-card {
  background-color: #daf0fc; /* สีเทาอ่อน */
  color: #424242; /* สีข้อความ */
  height: 40px; /* กำหนดความสูงให้เล็กลง */
  padding: 8px; /* ลดระยะห่างภายใน */
  border-radius: 8px; /* ขอบมน */
  display: flex; /* จัดข้อความให้อยู่กลางแนวตั้ง */
  align-items: center; /* จัดข้อความให้อยู่กลางแนวตั้ง */
  justify-content: center; /* จัดข้อความให้อยู่กลางแนวนอน */
  font-size: 13px; /* ลดขนาดตัวอักษร */
}

/* พื้นที่ของแต่ละฝั่ง */
.panel {
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 0px; /* ไม่มีระยะห่างด้านล่าง */
}

.v-btn:hover {
  filter: brightness(1.2); /* เพิ่มความสว่างเมื่อ Hover */
}

/* Actions */
.dialog-actions {
  display: flex;
  justify-content: space-between;
  padding: 16px 16px 0; /* เอาเฉพาะ padding ด้านบน */
}

/* พื้นที่หัวข้อ */
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-icon {
  font-size: 25px;
  margin-right: 10px;
}

.header-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

/* ฝั่งซ้าย */
.left-panel {
  border-right: 2px solid #e0e0e0;
}

/* ฝั่งขวา */
.right-panel {
  border-left: 2px solid #e0e0e0;
}

/* สำหรับหน้าจอมือถือ */
@media (max-width: 600px) {
  .left-panel {
    border-right: none;
  }

  .right-panel {
    border-left: none;
  }

  .panel {
    margin-bottom: 24px;
  }
  .input-field {
    margin-bottom: -1.3rem; /* สำหรับระยะห่างแนวตั้งในจอเล็ก */
    color: #007fc4 !important;
  }
}

/* Content Styling */
.info-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.info-label {
  font-size: 15px;
  color: #333;
}

.info-value {
  font-size: 12px;
  font-weight: bold;
  color: #007fc4;
}

/* ปรับสี font ของ label */
.custom-radio-group {
  color: #0a0a0a !important; /* สีฟ้า */
  font-size: 16px; /* ปรับขนาด font */
  overflow: visible !important; /* บังคับให้แสดงเนื้อหา */
}

.current-date-label {
  font-size: 1rem;
  font-weight: bold;
  color: #424242;
}

.highlight {
  background-color: #f6b26b; /* สีส้มไฮไลต์ */
  font-weight: bold;
  color: #000;
}
</style>
