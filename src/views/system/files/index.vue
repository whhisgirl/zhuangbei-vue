<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名称" prop="fileName">
        <el-input
          v-model="queryParams.fileName"
          placeholder="请输入文件名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:files:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:files:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:files:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:files:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="filesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="文件名称" align="center" prop="fileName" />
      <el-table-column label="上传" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-upload
            class="uploader"
            ref="uploadDirection"
            :file-list="fileList"
            :action="upload.url"
            :auto-upload="true"
            :headers="upload.headers"
            accept=".pdf, .doc, .docx, .zip, .rar, .xls, .xlsx, .ppt"
            :before-upload="(file)=>{return handlebeforeDirectionUpload(file,scope.row)}"
            :on-success="(response, file)=>{return handlePdfFileUploadSuccess(response, file,scope.row)}">
            <el-button size="small" type="primary"
            >点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip" style="width:100%">
              只能上传.pdf,.doc,.docx,.zip,.rar,.xls,.xlsx,.ppt文件
            </div> -->
            <template></template>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="下载" align="center" prop="download" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listFiles, getFiles, delFiles, addFiles, updateFiles } from "@/api/system/files";
import { getToken } from "@/utils/auth";

export default {
  name: "Files",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 上传文件表格数据
      filesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fileName: null
      },
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/upload",
      },
      fileList:[],
      uploadFileList:[],
      beforeList:[],
      afferentList:null,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询上传文件列表 */
    getList() {
      this.loading = true;
      listFiles(this.queryParams).then(response => {
        this.filesList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        fileName: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加上传文件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFiles(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改上传文件";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除上传文件编号为"' + ids + '"的数据项？').then(function() {
        return delFiles(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/files/export', {
        ...this.queryParams
      }, `files_${new Date().getTime()}.xlsx`)
    },
    returnData(){
      this.$emit('returnData',this.uploadFileList)
    },
    //时间戳格式化为yyyy/MM/dd
    formatDate2(d) {
      var date = new Date(d);
      var YY = date.getFullYear() + "/";
      var MM =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "/";
      var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return YY + MM + DD;
    },
    handlePdfFileUploadSuccess(response, file, row) {
      console.log("handlePdfFileUploadSuccess",row)
      if (response.code == 200) {
        console.log("response",response)
        let date= new Date();
        let time = this.formatDate2(date);
        var newFile ={};
        newFile.id = row.id;
        newFile.fileName = "";
        newFile.fileName = row.type;
        newFile.uploadFileName = response.originalFilename;
        console.log("newFile",newFile)
        updateFiles(newFile).then(response => {
          console.log(11111,response)
          this.$modal.msgSuccess("修改成功");
          this.getList();
        });
        // this.uploadFileList.push(pdfFile);
        // this.returnData();
      } else {
        this.$message.error(file.name + "上传失败!");
      }
    },
    handlebeforeDirectionUpload(file, row) {
      console.log(row)
      let fileName=file.name;
      let pos = fileName.lastIndexOf(".");
      let lastName = fileName.substring(pos, fileName.length);
      if (
        lastName.toLowerCase() !== ".pdf" &&
        lastName.toLowerCase() !== ".doc"&&
        lastName.toLowerCase() !== ".docx"&&
        lastName.toLowerCase() !== ".zip"&&
        lastName.toLowerCase() !== ".rar"&&
        lastName.toLowerCase() !== ".xls"&&
        lastName.toLowerCase() !== ".xlsx"&&
        lastName.toLowerCase() !== ".ppt"
      ) {
        this.$message.error("文件必须为.pdf .doc .docx .zip .rar .xls .xlsx .ppt类型");
        this.$refs.uploadFile.clearFiles();
        return false;
      }
    },
    closePreviewClick() {
      this.showPdf = false;
    },
    downloadFile(file){
      let fileUrl =file.url;
      // window.location.href = fileUrl
      console.log("file路径",file)
    },

  }
};
</script>
