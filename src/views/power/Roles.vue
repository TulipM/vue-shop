<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop':'','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row :class="[i2 === 0 ? 'bdtop':'','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable
                    @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id"
                    type="warning" closable
                    @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @click="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightsList"
      :props="treeProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checkd-keys="defKeys"
      ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="allotRights">确认</el-button>
        <!-- @click="allotRights" -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Roles',
    data(){
      return {
        // 所有角色列表数据
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
                    "path": null,
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
        // 控制对话框的显示与隐藏
        setRightDialogVisible: false,
        // 所有权限数据
        rightsList: [],
        // 树形孔家的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        // 默认选中的节点id值数组
        defKeys: [101,102,1021],
        // 当前即将分配角色的ID
        roleId: ''
      }
    },
    created(){
      this.getRolesList()
    },
    methods: {
      // 获取所有角色列表
      async getRolesList(){
        const {data:res} = await this.$http.get('roles')
        // if(res.meta.status !== 200){
          // return this.$message.error('获取角色列表失败!')
        // }

        // this.rolesList = res.data
      },
      // 根据id删除对应的权限
      async removeRightById(role, rightId){
        // 弹框提示用户是否要删除
        const confirmResult = await this.$confirm('此操作将会删除该用户的权限，是否继续','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        // 确认返回的是confirm，取消返回cancel
        if(confirmResult !== 'confirm'){
          return this.$message.info("已取消删除");
        }

        // const {data:res} = await this.$http.delete(`roles/${role.id}/right/${rightId}`)

        // if(res.meta.status !== 200){
        //   return this.$message.error('删除权限失败!')
        // }

        // 提示删除成功
        this.$message.success('删除权限成功!')
        // 刷新用户列表数据
        // role.children = res.data
      },
      // 展示分配权限的对话框
      async showSetRightDialog(role){
        this.roleId = role.id
        const {data:res} = await this.$http.get('rights/tree')
        // if(res.meta.status !== 200){
          // return this.$message.error('获取权限数据失败!')
        // }

        // this.rightsList = res.data
        this.rightsList = this.rolesList[0].children
        // 递归获取三级节点的ID
        this.getLeafKeys(role,this.defKeys)
        this.setRightDialogVisible = true
      },
      // 通过递归获取角色所有的三级权限id，并保存到defKeys数组中
      getLeafKeys(node,arr){
        // 判断是否为三级节点
        if(!node.children){
          return arr.push(node.id)
        }

        node.children.forEach(item =>
        this.getLeafKeys(item,arr))
      },
      // 监听分配权限对话框的关闭事件
      setRightDialogClosed(){
        this.defKeys = []
      },
      // 点击为角色分配权限
      async allotRights(){
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        
        // const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        // if(res.meta.status !== 200){
          // return this.$message.error('分配权限失败!')
        // }
        this.$message.success('分配权限成功！')
        this.getRolesList()
        this.setRightDialogVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 7px;
  }

  .bdtop{
    border-top: 1px solid #eee;
  }

  .bdbottom{
    border-bottom: 1px solid #eee;
  }

  .vcenter{
    display: flex;
    align-items: center;
  }
</style>