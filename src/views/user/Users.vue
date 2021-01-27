<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
          v-model="queryInfo.query" clearable
          @clear="getUserList">
            <el-button slot="append"
            icon="el-icon-search"
            @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mgState" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" @click="showEditDialog(scope.row.id)" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" @click="removeUserById(scope.row.id)" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pagenum"
      :page-sizes="[5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form ref="addFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUserInfo">确认</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="30%">
      <!-- 内容主体区 -->
      <el-form ref="editFormRef"
      :model="editForm"
      :rules="editFormRules"
      label-width="70px"
      @close="editDialogClosed">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确认</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.roleName}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Users',
    data(){
      // 验证邮箱的校验规则
      let checkEmail = (rule,value,cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

        if(regEmail.test(value)){
          // 合法的邮箱^1[3|4|5|7|8][0-9]{9}$
          return cb()
        }

        cb(new Error('请输入合法的邮箱！'))
      }

      // 验证手机号的校验规则
      let checkMobile = (rule,value,cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^1[3|4|5|7|8][0-9]{9}$/

        if(regMobile.test(value)){
          // 合法的手机号
          return cb()
        }

        cb(new Error('请输入合法的手机号！'))
      }

      return {
        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 2
        },
        // 共有几条数据
        total: 2,
        userlist: [
          {
            id: 1,
            username: "admin",
            email: "abc@qq.com",
            mobile: "15911111111",
            createTime: "2021-01-18",
            mgState: true,
            roleName: "超级管理员"
          },
          {
            id: 2,
            username: "why",
            email: "why@qq.com",
            mobile: "17022222222",
            createTime: "2021-01-18",
            mgState: false,
            roleName: "超级管理员"
          }
        ],
        // 控制用户对话框的显示和隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          // username: '',
          // email: '',
          // mobile: '',
          // password: ''
          username: "Rose",
          email: "Rose@qq.com",
          mobile: "15512345678",
          createTime: "2021-01-01",
          mgState: false,
          roleName: "超级管理员"
        },
        // 添加表单的验证规则对象
        addFormRules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '用户名的长度在3~10个字节之间',
              trigger: "blur"
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 15,
              message: '密码的长度在6~10个字节之间',
              trigger: "blur"
            }
          ],
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: "blur"
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: "blur"
            }
          ]
        },
        // 控制修改用户信息对话框的显示和隐藏
        editDialogVisible: false,
        // 查询到用户信息对象
        editForm: {},
        // 修改表单的验证对象
        editFormRules: {
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: "blur"
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: "blur"
            }
          ]
        },
        // 控制分配角色对话框的显示与隐藏
        setRoleDialogVisible: false,
        // 需要被分配角色的用户信息？
        userInfo: {},
        // 所有角色的数据列表
        rolesList: [
          {
            id: 301,
            roleName: "主管",
            roleDesc: "技术负责人",
            children: [
              {
                "id": 101,
                "authName": "商品管理",
                "path": null,
                "children": [
                  {
                    "id": 102,
                    "authName": "商品列表",
                    "path": null,
                    "children": [
                      {
                        "id": 1021,
                        "authName": "商品修改",
                        "path": null
                      }
                    ]
                  },
                  {
                    "id": 104,
                    "authName": "分类参数",
                    "path": null,
                    "children": [
                      {
                        "id": 1041,
                        "authName": "获取参数列表",
                        "path": null
                      },
                      {
                        "id": 1042,
                        "authName": "创建商品参数",
                        "path": null
                      },
                      {
                        "id": 1043,
                        "authName": "删除商品参数",
                        "path": null
                      }
                    ]
                  },
                  {
                    "id": 105,
                    "authName": "商品分类",
                    "path": "/cate",
                    "children": [
                      {
                        "id": 1051,
                        "authName": "添加分类",
                        "path": null
                      },
                      {
                        "id": 1052,
                        "authName": "删除分类",
                        "path": null
                      },
                      {
                        "id": 1053,
                        "authName": "获取分类详情",
                        "path": null
                      }
                    ]
                  }
                ]
              },
              {
               "id": 110,
                "authName": "用户管理",
                "path": null,
                "children": [
                  {
                    "id": 111,
                    "authName": "用户列表",
                    "path": null,
                    "children": []
                  }
                ]
              },
              {
                "id": 120,
                "authName": "订单管理",
                "path": null,
                "children": [
                  {
                    "id": 121,
                    "authName": "订单列表",
                    "path": null,
                    "children": []
                  }
                ]
              },
              {
                "id": 130,
                "authName": "权限管理",
                "path": null,
                "children": [
                  {
                    "id": 131,
                    "authName": "角色列表",
                    "path": null,
                    "children": []
                  },
                  {
                    "id": 132,
                    "authName": "权限列表",
                    "path": null,
                    "children": []
                  }
                ]
              },
              {
                "id": 140,
                "authName": "数据统计",
                "path": null,
                "children": []
              }
            ]
          },
          {
            id: 302,
            roleName: "测试角色",
            roleDesc: "测试",
            children: [
              {
                "id": 101,
                "authName": "商品管理",
                "path": null,
                "children": [
                  {
                    "id": 102,
                    "authName": "商品列表",
                    "path": null,
                    "children": [
                      {
                        "id": 103,
                        "authName": "添加商品",
                        "path": null
                       }
                    ]
                  }
                ]
              },
              {
               "id": 110,
                "authName": "用户管理",
                "path": null,
                "children": [
                  {
                    "id": 111,
                    "authName": "用户列表",
                    "path": null,
                    "children": []
                  }
                ]
              },
              {
                "id": 120,
                "authName": "订单管理",
                "path": null,
                "children": [
                  {
                    "id": 121,
                    "authName": "订单列表",
                    "path": null,
                    "children": []
                  }
                ]
              },
              {
                "id": 130,
                "authName": "权限管理",
                "path": null,
                "children": [
                  {
                    "id": 131,
                    "authName": "角色列表",
                    "path": null,
                    "children": []
                  },
                  {
                    "id": 132,
                    "authName": "权限列表",
                    "path": null,
                    "children": []
                  }
                ]
              },
              {
                "id": 140,
                "authName": "数据统计",
                "path": null,
                "children": []
              }
            ]
          }
        ],
        // 已选中角色的id值
        selectedRoleId: ''
      }
    },
    created(){
      this.getUserList()
    },
    methods: {
      async getUserList(){
        const {data:res} = await this.$http.get('users',{
          params: this.queryInfo
        })
        if(res.meta.status !== 200){
          // return this.$message.error('获取用户列表失败!')
        }
        // this.userlist = res.data.users
        // this.total = res.data.total
      },
      // 监听pagesize改变的事件
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      // 监听页码值改变的事件
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      // 监听状态switch开关的改变
      async userStateChanged(userinfo){
        // const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mgState}`)
        await this.$http.put(`users/${userinfo.id}/state/${userinfo.mgState}`)
        // if(res.meta.status !== 200){
          // return this.$message.error('更新用户状态失败!')
        // }
        // this.$message.success('更新用户成功!')
      },
      // 监听添加用户对话框的关闭事件
      addDialogClosed(){
        this.$refs.addFormRef.resetFields()
      },
      // 点击按钮,添加新用户
      addUserInfo(){
        // this.$refs.addFormRef.validate(async valid => {
          // if(!valid) return ;
          // 可以发起添加用户网络请求
          // const {data:res} = await this.$http.post('users',this.addForm)
          this.userlist.push(this.addForm)
          // if(res.meta.status !== 201){
          //   return this.$message.error('添加用户失败!')
          // }
          // 天剑成功关闭对话框
          this.addDialogVisible = false
          // 提示成功信息
          this.$message.success('添加用户成功!')
          // 刷新用户列表数据
          this.getUserList()
        // })
      },
      // 展示编辑用户的对话框
      showEditDialog(id){
        // const {data:res} = await this.$http.get('users/' + id)
        // if(res.meta.status !== 200){
        //   return this.$message.error('查询用户信息失败!')
        // }
        // this.editForm = res.data

        this.editForm = this.userlist[id-1]
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed(){
        this.$refs.editFormRef.resetFields()
      },
      // 修改用户信息并提交
      editUserInfo(){
        // this.$refs.editFormRef.validate(valid => {
          // if(!valid) return ;
          // 发起修改用户信息的数据请求
          // const {data:res} = await this.$http.put('users/' + this.editForm.id,{
          //   email: this.editForm.email,
          //   mobile: this.editForm.mobile
          // })

          // if(res.meta.status !== 200){
          //   return this.$message.error('更新用户信息失败!')
          // }

          // 关闭对话框
          this.editDialogVisible = false
          // 提示修改成功
          this.$message.success('更新用户信息成功!')
          // 刷新用户列表数据
          this.getUserList()
        // })
      },
      // 根据id删除对应信息
      async removeUserById(id){
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        // 确认返回的是confirm，取消返回cancel
        if(confirmResult !== 'confirm'){
          return this.$message.info("已取消删除");
        }

        // const {data:res} = await this.$http.delete('users/' + id)

        // if(res.meta.status !== 200){
        //   return this.$message.error('删除用户失败!')
        // }
        delete this.userlist[id - 1]

        // 提示删除成功
        this.$message.success('删除用户成功!')
        // 刷新用户列表数据
        this.getUserList()
      },
      // 展示分配角色的对话框
      async setRole(userInfo){
        this.userInfo = userInfo

        // 展开对话框之前，获取所有角色的列表
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status !== 200){
          // return this.$message.error('获取用户列表失败!')
        }
        // this.rolesList = res.data
        this.setRoleDialogVisible = true
      },
      // 点击按钮分配角色
      async saveRoleInfo(){
        if(!this.selectedRoleId){
          return this.$message.error('请选择要分配的角色！')
        }

        const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,
        {rid: this.selectedRoleId})

        if(res.meta.status !== 200){
          // return this.$message.error('更新角色失败!')
        }
        this.$message.success('更新角色成功!')
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      // 监听分配角色对话框的关闭事件
      setRoleDialogClosed(){
        this.selectedRoleId = ''
        this.userInfo = {}
      }
    }
  }
</script>

<style lang="less" scoped>

</style>