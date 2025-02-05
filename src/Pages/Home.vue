<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container class="table-page">
    <v-row dense align="center" justify="space-between" class="filter-row">
      <v-col cols="12" sm="4" md="4" class="filter-col">
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

    <v-btn color="primary" class="fab" large absolute bottom right @click="dialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="listQaReq"
      :search="mSearch"
      class="data-table"
      dense
      rounded
    >
      <template v-slot:top>
        <v-toolbar flat class="custom-toolbar">
          <v-toolbar-title class="centered-title">QA REQUEST</v-toolbar-title>
          <v-tooltip text="Refresh" location="bottom" color="blue" text-color="white">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" v-bind="props" @click="getQaList">
                <v-icon color="blue">mdi-refresh</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="action-buttons">
          <!-- Edit Tooltip -->
          <v-tooltip text="Edit" location="bottom" color="blue" text-color="white">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" v-bind="props" @click="editItem(item)">
                <v-icon color="blue">mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Delete Tooltip -->
          <v-tooltip text="Delete" location="bottom" color="red" text-color="white">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" v-bind="props" @click="deleteItem(item)">
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
          <span class="dialog-title">✨ QA Form ✨</span>
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
                <v-card class="grey-card" outlined>
                  <v-card-text class="text-left">
                    เลขที่เอกสาร : QA250000001
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="5">
                <v-card class="grey-card" outlined>
                  <v-card-text class="text-left">
                    ผู้สร้างเอกสาร : {{ user.samAccount }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <!-- Tabs -->
            <v-row>
              <v-col cols="12">
                <v-sheet class="tab-container" elevation="3" rounded="lg">
                  <v-tabs
                    v-model="tab"
                    :items="tabs"
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
                        <v-row v-if="tab === 'tab-1'" dense>
                          <v-col cols="12" sm="3">
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
                              :readonly="viewOnly"
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span> ไลน์ผลิต
                              </template>
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="3">
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
                              :readonly="viewOnly"
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
                              class="filter-select input-field"
                            />
                          </v-col>
                          <v-col cols="12" sm="3">
                            <CustomDatepicker
                              v-model="mInspectionDate"
                              label="วันที่ตรวจสอบ"
                              class="filter-select input-field"
                            />
                          </v-col>

                          <v-row>
                            <!-- left Panel -->
                            <v-col cols="12" md="6">
                              <div class="panel left-panel">
                                <div class="header">
                                  <v-icon class="header-icon" color="primary"
                                    >mdi-clipboard-check-outline</v-icon
                                  >
                                  <h3 class="header-title">Line Clearance</h3>
                                </div>
                                <v-row>
                                  <v-col cols="12" md="12">
                                    <v-autocomplete
                                      v-model="mcLineprocess"
                                      :items="iMaterial"
                                      item-title="displayMaterial"
                                      item-value="materialCode"
                                      outlined
                                      dense
                                      required
                                      return-object
                                      class="filter-select input-field"
                                      :readonly="viewOnly"
                                    >
                                      <template v-slot:label> ผลิตภัณฑ์ </template>
                                    </v-autocomplete>
                                  </v-col>
                                </v-row>
                                <v-row class="d-flex justify-center">
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
                                      เลือก ผ่าน ทั้งหมด
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
                                      เลือก ไม่ผ่าน ทั้งหมด
                                    </v-btn>
                                  </v-col>
                                </v-row>
                                <v-row
                                  v-for="(item, index) in clearanceItem"
                                  :key="item.reasonClearID"
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
                            <!-- Right Panel -->
                            <v-col cols="12" md="6">
                              <div class="panel right-panel">
                                <div class="header">
                                  <v-icon class="header-icon" color="primary"
                                    >mdi-cogs</v-icon
                                  >
                                  <h3 class="header-title">Preparing Machine</h3>
                                </div>

                                <!-- ปุ่มเลือกทั้งหมด -->
                                <v-row class="d-flex justify-center">
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
                                      เลือก ผ่าน ทั้งหมด
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
                                      เลือก ไม่ผ่าน ทั้งหมด
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
                        <v-row v-else-if="tab === 'tab-2'" dense>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              outlined
                              dense
                              required
                              prepend-inner-icon="mdi-weight-kilogram"
                              class="input-field"
                              v-model="mQtyEA"
                            >
                              <template v-slot:label>
                                <span style="color: red">*</span>น้ำหนักบรรจุส่วนประกอบ
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field outlined dense required class="input-field" v-model="mStdWeight">
                              <template v-slot:label>
                                <span style="color: red">*</span>น้ำหนัก (STD)
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field outlined dense required class="input-field" v-model="mBulkUsed">
                              <template v-slot:label>
                                <span style="color: red">*</span>ปริมาณ Bulk ที่ใช้
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field outlined dense required class="input-field" v-model="mProdPlanEA">
                              <template v-slot:label>
                                <span style="color: red">*</span>แผนการผลิต (EA)
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field outlined dense required class="input-field" v-model="mExpectedProdEA">
                              <template v-slot:label>
                                <span style="color: red">*</span>คาดว่าผลิตได้ (EA)
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field outlined dense required class="input-field" v-model="mProdPlanQtyEA">
                              <template v-slot:label>
                                <span style="color: red">*</span>จำนวนแผนการผลิต (EA)
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field outlined dense required class="input-field" v-model="mStdTime">
                              <template v-slot:label>
                                <span style="color: red">*</span>เวลาบรรจุ STD (DZ/Hr.)
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field outlined dense required class="input-field" v-model="mScale">
                              <template v-slot:label>
                                <span style="color: red">*</span>เครื่องชัง BL
                              </template>
                            </v-text-field>
                          </v-col>
                          <!-- left Panel -->

                          <v-col cols="12" md="12">
                            <div class="panel left-panel">
                              <div class="header">
                                <v-icon class="header-icon" color="primary"
                                  >mdi-file-document-multiple-outline</v-icon
                                >
                                <h3 class="header-title">รายละเอียดบรรจุภัณฑ์</h3>
                              </div>
                              <v-row>
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
                                    :readonly="viewOnly"
                                  >
                                    <template v-slot:label>
                                      <span style="color: red">*</span> ประเภทรายละเอียด
                                    </template>
                                  </v-autocomplete>
                                </v-col>
                                <v-col cols="12" md="2">
                                  <v-autocomplete
                                    v-model="mReasonDetailItem"
                                    :items="iReasonDetailItem"
                                    item-title="reasonDesc"
                                    item-value="reasonDescID"
                                    outlined
                                    dense
                                    return-object
                                    class="filter-select input-field"
                                    :readonly="viewOnly"
                                  >
                                    <template v-slot:label>
                                      <span style="color: red">*</span> รายการ
                                    </template>
                                  </v-autocomplete>
                                </v-col>
                                <v-col cols="12" md="3">
                                  <v-autocomplete
                                    v-model="mVendor"
                                    :items="iVendor"
                                    item-title="vendorDesc"
                                    item-value="vendorNo"
                                    outlined
                                    dense
                                    return-object
                                    class="filter-select input-field"
                                    :readonly="viewOnly"
                                  >
                                    <template v-slot:label>
                                      <span style="color: red">*</span> บริษัท
                                    </template>
                                  </v-autocomplete>
                                </v-col>
                                <v-col cols="10" sm="3">
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
                            </div>
                          </v-col>
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

                                <template v-slot:item.actions="{ item }">
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
                              </v-data-table>
                            </v-card>
                          </v-container>

                          <v-col cols="12" md="12">
                            <div class="panel right-panel">
                              <div class="header">
                                <v-icon class="header-icon" color="primary"
                                  >mdi-clipboard-check-outline</v-icon
                                >
                                <h3 class="header-title">รายการตรวจสอบบรรจุภัณฑ์</h3>
                              </div>
                              <v-row class="align-center justify-space-between">
                                <!-- คอลัมน์แสดงหัวข้อ -->
                                <v-col cols="12" sm="5">
                                  <span class="current-date-label">วันเวลาปัจจุบัน</span>
                                </v-col>

                                <v-col cols="11" sm="6">
                                  <DateTimePicker v-model="selectedDateTime" />
                                </v-col>

                                <v-col cols="1" sm="1" xs="12" class="text-right">
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
                                        @click="plus(item)"
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
                                <v-col cols="12" sm="12">
                                  <v-sheet elevation="6">
                                    <v-tabs
                                      bg-color="indigo"
                                      next-icon="mdi-arrow-right-bold-box-outline"
                                      prev-icon="mdi-arrow-left-bold-box-outline"
                                      show-arrows
                                    >
                                      <v-tab
                                        v-for="i in 30"
                                        :key="i"
                                        :text="`Item ${i}`"
                                      ></v-tab>
                                    </v-tabs>
                                  </v-sheet>
                                </v-col>
                              </v-row>

                              <v-row>
                                <v-col cols="12" md="8" sm="8" xs="12">
                                  <v-row class="d-flex justify-center">
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
                                        เลือก ผ่าน ทั้งหมด
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
                                        เลือก ไม่ผ่าน ทั้งหมด
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
                                    <v-col cols="10" sm="10">
                                      <v-text-field
                                        outlined
                                        dense
                                        required
                                        prepend-inner-icon="mdi-weight-lifter"
                                        class="input-field"
                                        :readonly="viewOnly"
                                      >
                                        <template v-slot:label>
                                          <span style="color: red">*</span>น้ำหนัก
                                        </template>
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="2" sm="2">
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
                                            @click="plus(item)"
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
                                      <template v-slot:item.actions="{ item }">
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
                                                @click="deleteItem(item)"
                                              >
                                                <v-icon color="red">mdi-delete</v-icon>
                                              </v-btn>
                                            </template>
                                          </v-tooltip>
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
              <v-col cols="12">
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
                          <span class="info-label">ปริมาณ Bulk ใช้ทั้งหมด</span>
                          <span class="info-value">6500 KG</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">Bulk ยกมา</span>
                          <span class="info-value">6500 KG</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">Bulk ที่ใช้จริง</span>
                          <span class="info-value">5674 KG</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">Bulk คงเหลือ</span>
                          <span class="info-value">826 KG</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="info-item">
                          <span class="info-label">ปริมาณ Bulk สูญเสีย</span>
                          <span class="info-value">5674 KG</span>
                        </div>
                      </v-col>
                    </v-row>

                    <v-row dense>
                      <v-col cols="12" md="3">
                        <div class="info-item">
                          <span class="info-label">จำนวนผลิตได้จริง</span>
                          <span class="info-value">79540 EA</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">จำนวน DZ</span>
                          <span class="info-value">6628</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">% Yield</span>
                          <span class="info-value">56.75 %</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <div class="info-item">
                          <span class="info-label">% Loss</span>
                          <span class="info-value">26.51 %</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="info-item">
                          <span class="info-label">น้ำหนัก AVG</span>
                          <span class="info-value">745.35 G</span>
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
                          maxlength="500"
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
        <v-card-actions class="dialog-actions">
          <v-btn color="success" large @click="submitForm">✨ บันทึก ✨</v-btn>
          <v-btn color="error" text @click="resetForm">ยกเลิก</v-btn>
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
import {
  gLineProcess,
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
} from "@/services/apiQa.js";
import Swal from "sweetalert2";

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
      showSnackbar: false,
      msgSnackbar: "",
      snackbarColor: "yellow",
      preparingItem: [],
      clearanceItem: [],
      selectedDateTime: new Date(),
      FileBatch: [],
      mcRadioPreparing: null,
      mProductionDate: "",
      mInspectionDate: "",
      dialog: false,
      isLoading: false,
      mSearch: "",
      //   model picture Batch No
      dialogPicture: false,
      selectedImage: "",
      tab: "tab-1",
      tabs: [
        {
          icon: "mdi-head-lightbulb-outline",
          text: "หน้าแรก",
          value: "tab-1",
        },
        {
          icon: "mdi-file-document-edit-outline",
          text: "รายละเอียด",
          value: "tab-2",
        },
      ],
      headers: [
        {
          title: "Column 1",
          align: "left",
          key: "column1",
        },
        {
          title: "Column 2",
          align: "left",
          key: "column2",
        },
        {
          title: "Actions",
          align: "center",
          key: "actions",
          sortable: false,
        },
      ],

      listQaReq: [
        {
          column1: "column1",
          column2: "column1",
        },
        {
          column1: "column2",
          column2: "column2",
        },
      ],
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
          key: "column1",
        },
        {
          title: "น้ำหนัก",
          align: "left",
          key: "column2",
        },
        {
          title: "Actions",
          align: "center",
          key: "actions",
          sortable: false,
        },
      ],
      listVerifyProduct: [
        {
          column1: "1",
          column2: "column1",
        },
        {
          column1: "2",
          column2: "column2",
        },
      ],
      iVerifyProduct: [],
      mLineprocess: "",
      iLineprocess: [],
      mcLineprocess: "",
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
      mQtyEA: 0,
      mProdPlanEA: 0,
      mProdPlanQtyEA: 0,
      mExpectedProdEA: 0,
      mStdTime: 0,
      mStdWeight: 0,
      mBulkUsed: "",
      mScale: ""
    };
  },
  created() {
    this.gLineProcess();
    this.gVendor();
    this.gMaterialMaster();
    this.gTReasonDetail("QA250000001");
  },
  watch: {
    mLineprocess(val) {
      console.log(val, "mLineprocess");
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
        return "Unknown";
      }

      // อัปเดต iReasonDetailItem ด้วยรายการที่กรองได้
      this.iReasonDetailItem = filteredItems;

      // คืนค่ารายการ reasonDesc (สามารถปรับได้ตามความต้องการ)
      return filteredItems.map((item) => item.reasonDesc).join(", ");
    },
  },
  methods: {
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
    async deleteItemProductDetail(item) {
      console.log(item, "item");
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
            this.gTReasonDetail("QA250000001");
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
      this.isLoading = true;
      try {
        await pUploadFileBatchNo(
          this.FileBatch,
          "QA250000001",
          this.mLineprocess.lineProcessID,
          this.mReasonDetail.reasonID,
          this.mReasonDetailItem.reasonDescID,
          this.mVendor.vendorNo,
          this.mVendor.vendorDesc,
          this.user.empId
        );
        this.gTReasonDetail("QA250000001");
      } catch (e) {
        console.log(e);
      } finally {
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
      try {
        const response = await gVendor();
        this.iVendor = response.results;
      } catch (e) {
        console.log(e);
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async gLineProcess() {
      this.isLoading = true;
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
    getQaList() {},
    editItem() {},
    deleteItem() {},
    resetForm() {
      this.dialog = false;
    },
    async submitForm() {
      const init = {
        formID: "",
        lineProcessID: this.mLineprocess.lineProcessID,
        userID: this.user.empId,
        materialCode: this.mMaterial.materialCode,
        materialDesc: this.mMaterial.materialDescriptionTH,
        materialColor: this.mMaterial.hgdesclV5,
        materialSize: this.mMaterial.hglV7,
        materialCategory: this.mMaterial.hglV3,
        qtyEA: this.mQtyEA,
        prodPlanEA: this.mProdPlanEA,
        prodPlanQtyEA: this.mProdPlanQtyEA,
        expectedProdEA: this.mExpectedProdEA,
        stdTime: this.mStdTime,
        stdWeight: this.mStdWeight,
        bulkUsed: this.mBulkUsed,
        scale: this.mScale,
        productionDate: this.mProductionDate,
        checkIN: this.mInspectionDate,
        checkOut: "",
        status: "",
        remark: this.mProblemResolve,
        employeeID: this.user.empId,
      };
      const response = await pFormList(init);
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
