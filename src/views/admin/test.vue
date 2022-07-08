<template>
  <el-dialog :title="addName" :visible.sync="dialogAddFile" width="500px" style="padding:0;" @close="resetAdd">
    附件名称：<el-input v-model="addFileName" autocomplete="off" size="small" style=" width: 300px;" />
    <div class="add-file-right" style="height:70px;margin-left:100px;margin-top:15px;">
      <div class="add-file-right-img" style="margin-left:70px;">上传文件：</div>
      <input ref="clearFile" type="file" multiple="multiplt" class="add-file-right-input" style="margin-left:70px;" accept=".docx,.doc,.pdf" @change="getFile($event)">
      <span class="add-file-right-more">支持扩展名：.doc .docx .pdf </span>
    </div>
    <div class="add-file-list">
      <ul>
        <li v-for="(item, index) in addArr" :key="index"><a>{{ item.name }}</a></li>
      </ul>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="submitAddFile">开始上传</el-button>
      <el-button size="small" @click="resetAdd">全部删除</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  methods: {
    getFile() {
      var file = event.target.files
      for (var i = 0; i < file.length; i++) {
        //    上传类型判断
        var imgName = file[i].name
        var idx = imgName.lastIndexOf('.')
        if (idx !== -1) {
          var ext = imgName.substr(idx + 1).toUpperCase()
          ext = ext.toLowerCase()
          // eslint-disable-next-line no-empty
          if (ext !== 'pdf' && ext !== 'doc' && ext !== 'docx') {

          } else {
            this.addArr.push(file[i])
          }
          // eslint-disable-next-line no-empty
        } else {

        }
      }
    },

    submitAddFile() {
      if (this.addArr.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择要上传的文件'
        })
        return
      }

      var formData = new FormData()
      formData.append('num', this.addType)
      formData.append('linkId', this.addId)
      formData.append('rfilename', this.addFileName)
      for (var i = 0; i < this.addArr.length; i++) {
        formData.append('fileUpload', this.addArr[i])
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': this.token
        }
      }
      this.axios.post(apidate.uploadEnclosure, formData, config)
        .then((response) => {
          if (response.data.info === 'success') {
            this.$message({
              type: 'success',
              message: '附件上传成功!'
            })
          }
        })
    }
  }
}
</script>
