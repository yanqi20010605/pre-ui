<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
        <el-tree
          :data="classData"
          :props="classTreeProps"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <el-input
            v-model="query.studentName"
            clearable
            size="small"
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入用户名"
            @keyup.enter.native="handleFind"
          />
          <el-button class="filter-item" type="primary" icon="el-icon-search" size="small" @click="handleFind">搜索
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-refresh" size="small" @click="handleReset">重置
          </el-button>
          <el-button class="filter-item" type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加
          </el-button>
        </div>

        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
          <el-table-column label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>

          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.studentName }}</span>
            </template>
          </el-table-column>

<!--          <el-table-column label="头像" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-avatar :size="50" :src=" scope.row.photo "></el-avatar>-->
<!--            </template>-->
<!--          </el-table-column>-->

          <el-table-column label="手机号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.telephone }}</span>
            </template>
          </el-table-column>

          <el-table-column label="邮箱" width="180" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>

          <el-table-column label="班级" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.className }}</div>
            </template>
          </el-table-column>

          <el-table-column label="性别" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.sex }}</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="150" align="center">
            <template slot-scope="scope">
              <el-button size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="pagination">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            background
            @current-change="handleCurrentChange"
          />
        </div>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="operation?'新增用户':'编辑用户'" :visible.sync="dialogFormVisible" center>
          <el-form :model="dataForm" :rules="rules2" label-width="80px" size="small" label-position="right">

            <el-form-item label="用户名" :label-width="formLabelWidth" prop="studentName" required>
              <el-input v-model="dataForm.studentName" auto-complete="off" placeholder="请输入用户名" />
            </el-form-item>

<!--            <el-form-item label="头像" :label-width="formLabelWidth" prop="email">-->
<!--              <el-upload-->
<!--                :photo-list="photoList">-->
<!--                <el-button size="small" type="primary">上传头像</el-button>-->
<!--              </el-upload>-->
<!--            </el-form-item>-->

            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="dataForm.email" auto-complete="off" placeholder="请输入邮箱" />
            </el-form-item>

            <el-form-item label="手机" :label-width="formLabelWidth" prop="telephone">
              <el-input v-model="dataForm.telephone" auto-complete="off" placeholder="请输入手机" />
            </el-form-item>

            <el-form-item label="班级" :label-width="formLabelWidth">
              <popup-tree-input
                :data="classData"
                :props="classTreeProps"
                :prop="dataForm.className"
                :node-key="dataForm.classId"
                :current-change-handle="classTreeCurrentChangeHandle"
              />
            </el-form-item>

            <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
<!--              <el-input v-model="dataForm.sex" auto-complete="off" placeholder="请输入性别" />-->
              <el-radio v-model="dataForm.sex" label="男">男</el-radio>
              <el-radio v-model="dataForm.sex" label="女">女</el-radio>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addStudent, getStudentList, editStudent, deleteStudent } from '@/api/student'
import { getClass } from '@/api/class'
import PopupTreeInput from '@/components/PopupTreeInput'

export default {
  components: {
    PopupTreeInput
  },
  // mixins: [initDict],
  data() {
    // 验证手机号是否合法
    const checkTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else if (!this.checkMobile(value)) {
        callback(new Error('手机号码不合法'))
      } else {
        callback()
      }
    }
    return {
      // 学生列表
      tableData: [],
      operation: false, // true:新增, false:编辑
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
      classId: '',
      dialogFormVisible: false, // 控制弹出框
      formLabelWidth: '120px',
      query: {
        studentName: ''
      },
      dataForm: {
        studentName: '',
        classId: '',
        className: '',
        email: '',
        telephone: '',
        sex: ''
        // photoList: ''
      },
      classData: [],
      classTreeProps: {
        label: 'className',
        children: 'children'
      },
      value5: '100',
      filterText: '',
      loading: false,
      rules2: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, {
          pattern: /^[a-zA-Z0-9_]{4,8}$/,
          message: '以字母开头，长度在4-8之间， 只能包含字符、数字和下划线'
        }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkTel, trigger: 'change' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, {
          pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, message: '输入邮箱不合法'
        }]
      }

    }
  },
  created() {
    this.studentList()
    this.findClassTree()
  },
  methods: {
    // 加载班级列表
    findClassTree: function() {
      getClass().then((res) => {
        this.classData = res.data.data
      })
    },
    // 班级菜单树选中
    classTreeCurrentChangeHandle(data) {
      this.dataForm.classId = data.classId
      this.dataForm.className = data.className
    },
    // 加载学生列表
    studentList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('current', this.currentPage)
      params.append('size', this.pageSize)
      params.append('classId', this.classId)
      params.append('studentName', this.query.studentName)
      getStudentList(params).then(response => {
        this.loading = false
        this.tableData = response.data.data.records
        this.total = response.data.data.total
      })
    },
    handleFind: function() {
      this.studentList()
    },
    handleReset: function() {
      this.query = {
        studentName: ''
      }
      this.studentList()
    },
    // 添加
    handleAdd: function() {
      this.dialogFormVisible = true
      this.operation = true
      this.dataForm = {
        studentName: '',
        classId: '',
        className: '',
        email: '',
        telephone: '',
        sex: ''
        // lockFlag: '' + 0
      }
    },
    // 编辑
    handleEdit: function(row) {
      this.dialogFormVisible = true
      this.operation = false
      // this.dataForm = row
      this.dataForm = Object.assign({}, row)
    },

    // 删除用户
    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将该管理员删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteStudent(row.studentId).then(response => {
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.studentList()
            } else {
              this.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.studentList()
    },

    handleNodeClick(data) {
      this.classId = data.classId === '' ? '' : data.classId
      this.studentList()
    },
    submitForm: function() {
      console.log(this.dataForm)
      if (!this.operation) {
        // 编辑用户
        editStudent(this.dataForm).then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogFormVisible = false
            this.studentList()
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
        })
      } else {
        // 添加用户
        addStudent(this.dataForm).then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogFormVisible = false
            this.studentList()
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
        })
      }
    },
    // 验证手机号
    checkMobile(str) {
      const reg = /^1[3456789]\d{9}$/
      return reg.test(str)
    }
  }
}
</script>

<style>
</style>
