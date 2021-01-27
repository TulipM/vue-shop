<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table class="treeTable" :data="cateList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="#"
      border>
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success"
          v-if="scope.row.catDeleted === false"
          style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else
          style="color: red;"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.catLevel === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.catLevel === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">搜索</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pageNum"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClose">
        <!-- 添加分类的表单 -->
        <el-form ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="120px">
          <el-form-item label="分类名称" prop="catName">
            <el-input v-model="addCateForm.catName"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- options用来指定数据源 -->
            <!-- props用来指定配置对象 -->
            <el-cascader
              expand-trigger="hover"
              :options="parentCateList"
              :props="cascaderProps"
              v-model="selectedKeys"
              @change="parentCateChange"
              clearable
              change-on-select>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addCate">确认</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Cate',
    data(){
      return {
        queryInfo: {
          type: 3,
          pageNum: 1,
          pageSize: 5
        },
        // 商品分类的数量
        cateList: [
          {
            catId: 1,
            catName: "大家电",
            catPid: 0,
            catLevel: 0,
            catDeleted: false,
            children: [
              {
                catId: 10,
                catName: "电视",
                catPid: 1,
                catLevel: 1,
                catDeleted: false,
                children: [
                  {
                    catId: 100,
                    catName: "曲面电视",
                    catPid: 3,
                    catLevel: 2,
                    catDeleted: false
                  }
                ]
              }
            ]
          },
          {
            catId: 2,
            catName: "热门推荐",
            catPid: 0,
            catLevel: 0,
            catDeleted: false,
            children: [
              {
                catId: 20,
                catName: "电视",
                catPid: 1,
                catLevel: 1,
                catDeleted: false,
                children: [
                  {
                    catId: 200,
                    catName: "曲面电视",
                    catPid: 3,
                    catLevel: 2,
                    catDeleted: false
                  }
                ]
              }
            ]
          },
          {
            catId: 3,
            catName: "海外购",
            catPid: 0,
            catLevel: 0,
            catDeleted: false,
            children: [
              {
                catId: 30,
                catName: "电视",
                catPid: 1,
                catLevel: 1,
                catDeleted: false,
                children: [
                  {
                    catId: 300,
                    catName: "曲面电视",
                    catPid: 3,
                    catLevel: 2,
                    catDeleted: false
                  }
                ]
              }
            ]
          },
          {
            catId: 4,
            catName: "苏宁房产",
            catPid: 0,
            catLevel: 0,
            catDeleted: false,
            children: [
              {
                catId: 40,
                catName: "电视",
                catPid: 1,
                catLevel: 1,
                catDeleted: false,
                children: [
                  {
                    catId: 400,
                    catName: "曲面电视",
                    catPid: 3,
                    catLevel: 2,
                    catDeleted: false
                  }
                ]
              }
            ]
          },
          {
            catId: 5,
            catName: "手机相机",
            catPid: 0,
            catLevel: 0,
            catDeleted: false,
            children: [
              {
                catId: 50,
                catName: "电视",
                catPid: 1,
                catLevel: 1,
                catDeleted: false,
                children: [
                  {
                    catId: 500,
                    catName: "曲面电视",
                    catPid: 3,
                    catLevel: 2,
                    catDeleted: false
                  }
                ]
              }
            ]
          }
        ],
        // 总数据条数
        total: 30,
        // 为table指定列的定义
        columns: [
          {
            label: '分类名称',
            prop: 'catName'
          },
          {
            label: '是否有效',
            // 表示当前定义为模板列
            type: 'template',
            // 表示当前这一列使用的模板名称
            template: 'isOk'
          },
          {
            label: '排序',
            // 表示当前定义为模板列
            type: 'template',
            // 表示当前这一列使用的模板名称
            template: 'order'
          },
          {
            label: '操作',
            // 表示当前定义为模板列
            type: 'template',
            // 表示当前这一列使用的模板名称
            template: 'opt'
          }
        ],
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        // 添加分类的表单数据对象
        addCateForm: {
          // 将要添加的分类的名称
          catName: '',
          // 父级分类的id
          catPid: 0,
          // 分类的等级，默认为一级分类
          catLevel: 0
        },
        // 添加分类的表单的验证规则对象
        addCateFormRules: {
          catName: [
            {
              required: true,
              message: '请输入分类名称',
              trigger: 'blur'
            }
          ]
        },
        // 父级分类的列表
        parentCateList: [],
        // 指定级联选择器的配置对象
        cascaderProps: {
          value: 'catId',
          label: 'catName',
          children: 'children'
        },
        // 选中的父级分类的id数组
        selectedKeys: []
      }
    },
    created(){
      this.getCateList()
    },
    methods: {
      // 获取商品分类数据
      async getCateList(){
        const {data:res} = await this.$http.get('categories',{
          params: this.querInfo
        })
        // if(res.meta.status !== 200){
          // return this.$message.error('获取商品分类失败!')
        // }

        // this.cateList = res.data.result
        // this.total = res.data.total
      },
      // 监听pageSize的改变
      handleSizeChange(newSize){
        this.queryInfo.pageSize = newSize
        this.getCateList()
      },
      // 监听pageNum的改变
      handleCurrentChange(newPage){
        this.queryInfo.pageNum = newPage
        this.getCateList()
      },
      // 电机按钮，展示添加分类的对话框
      showAddCateDialog(){
        // 先获取获取父级分类数据
        this.getParentCateList()
        // 再展示对话框
        this.addCateDialogVisible = true
      },
      // 获取父级分类的数据列表
      async getParentCateList(){
        const {data:res} = await this.$http.get('categories',{params: {type:2}})
        if(res.meta.status !== 200){
          // return this.$message.error('获取父级分类数据失败!')
        }
        this.$message.success('获取父级分类数据成功！')
        this.parentCateList = this.cateList
      },
      // 选择项发生变化触发这个函数
      parentCateChange(){
        // 如果selectedKeys数组中的length大于0，证明选中的父级分类
        // 否则，就说明没有选中任何父级分类
        if(this.selectedKeys.length > 0){
          // 父级分类的ID
          this.addCateForm.catPid = this.selectedKeys[selectedKeys.length - 1]
          // 为当前分类的等级赋值
          this.addCateForm.catLevel = this.selectKeys.length
        }else{
          // 父级分类的ID
          this.addCateForm.catPid = 0
          // 为当前分类的等级赋值
          this.addCateForm.catLevel = 0
        }
      },
      // 点击按钮，添加新的分类
      addCate(){
        this.$refs.addCateFormRef.validate(async valid => {
          if(!valid) return ;
          const {data:res} = await this.$http.post('categories',this.addCateForm)
          if(res.meta.status !== 201){
            // return this.$message.error('添加分类失败!')
          }
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDialogVisible = false
        })
      },
      // 监听对话框的关闭事件，重置表单数据
      addCateDialogClose(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.catPid = 0
        this.addCateForm.catLevel = 0
      }
    }
  }
</script>

<style lang="less" scoped>
  .treeTable{
    margin-top: 15px;
  }

  .el-cascader{
    width: 100%;
  }
</style>