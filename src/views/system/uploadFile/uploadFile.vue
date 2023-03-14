<template>
  <div>
    <el-card style="width: 95%; margin-left: 30px; margin-top: 10px">

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>


      <el-table v-loading="loading" :data="dataList"
                @selection-change="handleSelectionChange"
                :default-sort="defaultSort"
                @sort-change="handleSortChange"
                :header-cell-style="{
               background: '#84BBFE',
               color: '#fff',
               // fontSize: '14px',
               textAlign: 'center',
               // fontWeight: '600',
               fontFamily: '黑体',
               padding: '0',
                 }" style="margin-top: 10px" class="myTable">
        <el-table-column type="index"  align="center" label="序号"/>
        <el-table-column label="文件" align="center" prop="fileName" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']"/>
        <el-table-column label="上传" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:data:remove']"
            >上传</el-button>
          </template>
        </el-table-column>
        <el-table-column label="下载" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:data:remove']"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open3" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url3 + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <!--          <div class="el-upload__tip" slot="tip">
                      <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
                    </div>-->
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate3">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open3 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import { listData, getData, delData, addData, updateData } from "@/api/system/data";
  // import {getToken} from "@/utils/auth";

  export default {
    name: "UploadFile",
    data() {
      return {

        upload: {
          // 是否显示弹出层（用户导入）
          open3: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url3: process.env.VUE_APP_BASE_API + "/system/data/importData",

        },
        // 遮罩层
        loading: true,
        // 默认排序
        defaultSort: {prop:"remodelDate", order: 'descending'},
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
        // 装备设计/改型数据表格数据
        dataList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open1: false,
        open2: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          planeType: null,
          remodelDate: null,
          remodelMeasure: null,
          makeUnit: null,
          modelSeries: null
        },
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
      handleImport3() {
        this.upload.title = "装备设计/改型数据导入";
        this.upload.open3 = true;
      },
      importTemplate3() {
        this.download('system/data/importTemplate', {
        }, `EquipmentDesignData${new Date().getTime()}.xlsx`)
      },
      submitFileForm() {
        this.$refs.upload.submit();
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 产品设计文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open3 = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
        this.getList();
      },
      /** 查询装备设计/改型数据列表 */
      getList() {
        this.loading = true;
        listData(this.queryParams).then(response => {
          this.dataList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open1 = false;
        this.open2 = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          planeType: null,
          remodelDate: null,
          remodelMeasure: null,
          makeUnit: null,
          modelSeries: null
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
        this.queryParams.pageNum = 1;
        this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
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
        this.title = "添加装备设计/改型数据";
      },
      /** 详细按钮操作 */
      handleDetail(row) {
        this.reset();
        const id = row.id || this.ids
        getData(id).then(response => {
          this.form = response.data;
          this.open2 = true;
          this.title = "装备设计/改型数据 详细信息";
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getData(id).then(response => {
          this.form = response.data;
          this.open1 = true;
          this.title = "修改装备设计/改型数据";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateData(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open1 = false;
                this.getList();
              });
            } else {
              addData(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open1 = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        const name = row.planeType;
        this.$modal.confirm('是否确认删除装备设计/改型数据名为"' + name + '"的数据项？').then(function() {
          return delData(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 排序触发事件 */
      handleSortChange(column, prop, order) {
        this.queryParams.orderByColumn = column.prop;
        this.queryParams.isAsc = column.order;
        this.getList();
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/data/export', {
          ...this.queryParams
        }, `data_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>

<style lang="scss" scoped>
  .myTable{
    width: 100%;
    height: 50%;
  }

</style>

