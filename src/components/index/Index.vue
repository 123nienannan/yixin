<template>
 <div class="wrapper">
    <div class="index_scan">
      <div class="click_pic">
        <input type="file" ref="inputer" accept="image/*" multiple @change="fileUpload">
      </div>
      <div class="scan">
        <div class="scan_photo">
          <img :data-src="photoUrl" :src="picVal">
        </div>
      </div>
    </div>
    <div class="scan_btn">
        <span>点击上传非美颜正面免冠照</span>
    </div>
    <div class="index_info">
      <div>
        <span>公司名称</span>
        <input type="text" v-model="companyName" @blur="blurHandle" placeholder="请输入公司名称">
      </div>
      <div>
        <span class="username">姓名</span>
        <input type="text" v-model="personName" @blur="blurHandle" placeholder="请输入您的姓名">
      </div>
      <div>
        <span class="mobile">手机号</span>
        <input type="text" v-model="mobilePhone" @blur="blurHandle" placeholder="请输入您的手机号码">
      </div>
    </div>
    <div class="confirm" @click="enroll">
       上传照片并报名
    </div>
    <p class="question">如有问题，请拨打电话18516772134</p>
 </div>
</template>

<script>
import EXIF from 'exif-js'
export default {
  data () {
    return {
      active:false,
      photoUrl:'',
      picVal:require('../../assets/images/line.png'),
      companyName: '',
      personName: '',
      mobilePhone: '',
    }
  },
  methods: {
    fileUpload(e) {
      let that = this
      let files = e.target.files || e.dataTransfer.files
      this.picValue = files[0]
      this.imgPreview(this.picValue)
      EXIF.getData(this.picValue, function () {
        that.Orientation = EXIF.getTag(this, 'Orientation')
      })
    },
    imgPreview (file) {
      let self = this
      if (!file || !window.FileReader) return
      if (/^image/.test(file.type)) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function () {
          let IMG = new Image()
          IMG.src = this.result
          IMG.onload = function () {
            let w = this.naturalWidth
            let h = this.naturalHeight
            let resizeW = 0
            let resizeH = 0
            let maxSize = {
              width: 1280,
              height: 1280,
              level: 0.6
            }
            if (w > maxSize.width || h > maxSize.height) {
              let multiple = Math.max(w / maxSize.width, h / maxSize.height)
              resizeW = w / multiple
              resizeH = h / multiple
            } else {
              resizeW = w
              resizeH = h
            }
            let canvas = document.createElement('canvas')
            let cxt = canvas.getContext('2d')
            if (self.Orientation === 3) {
              canvas.width = resizeW
              canvas.height = resizeH
              cxt.rotate(Math.PI)
              cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
            } else if (self.Orientation === 8) {
              canvas.width = resizeH
              canvas.height = resizeW
              cxt.rotate(Math.PI * 3 / 2)
              cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
            } else if (self.Orientation === 6) {
              canvas.width = resizeH
              canvas.height = resizeW
              cxt.rotate(Math.PI / 2)
              cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
            } else {
              canvas.width = resizeW
              canvas.height = resizeH
              cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
            }
            self.base64 = canvas.toDataURL('image/jpeg', maxSize.level)
            self.postImg(self.base64)
          }
        }
      }
    },
    async postImg (data) {
      this.$indicator.open()
      const res = await this.$http.post('/file/upload/base64',{file:data})
      if(res.data.data) {
        this.photoUrl = res.data.data
        this.picVal = res.data.data
      }
      this.$indicator.close()
    },
    async enroll () {
      if(this.photoUrl=="") {
        this.$toast({
          message: '请上传照片',
          position: 'middle',
          duration: 1500,
          className: "changeFont"
        });
        return
      }
      if(this.companyName == "") {
        this.$toast({
          message: '公司名称为必填项',
          position: 'middle',
          duration: 1500,
          className: "changeFont"
        });
        return
      }
      if(this.personName == "") {
        this.$toast({
          message: '用户名为必填项',
          position: 'middle',
          duration: 1500,
          className: "changeFont"
        });
        return
      }
      if(this.mobilePhone == "") {
         this.$toast({
          message: '手机号码为必填项',
          position: 'middle',
          duration: 1500,
          className: "changeFont"
        });
        return
      }
      if(!(/^1[3456789]\d{9}$/.test(this.mobilePhone))) {
        this.$toast({
          message: '手机号码格式不正确',
          position: 'middle',
          duration: 1500,
          className: "changeFont"
        });
        return
      }
      const params = {
        photoUrl:this.photoUrl,
        companyName:this.companyName,
        personName:this.personName,
        mobilePhone:this.mobilePhone
      }
      const res = await this.$http.post('/wx/person/add',params)
      this.$toast({
          message: '报名成功',
          position: 'middle',
          duration: 1500,
          className: "success"
        });
      this.photoUrl = ""
      this.companyName =""
      this.personName = ""
      this.mobilePhone = ""
      this.picVal = require('../../assets/images/line.png')
    },
    blurHandle () {
      setTimeout(() => {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    }
  },
  mounted () {
    var ua = navigator.userAgent.toLowerCase()
    if(ua.indexOf('android') > -1 || ua.indexOf('adr') > -1){
      if(ua.indexOf(' qq/') > -1){
        this.$refs.inputer.setAttribute("capture","camera")
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  overflow-y:auto;
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background: url("../../assets/images/background.jpg") no-repeat;
  background-size: cover;
  .index_scan {
    position: relative;
    padding-top: 144px;
    .click_pic {
      margin-top: 144px;
      position: absolute;
      left: 50%;
      top: 0;
      margin-left: -188px;
      width: 374px;
      height: 375px;
      input {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }
    .scan {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      width: 374px;
      height: 375px;
      background: url("../../assets/images/scan.png") no-repeat;
      background-size: cover;
      .scan_photo {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 357px;
        height: 356px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }
  }
  .scan_btn {
    margin-top: 46px;
    display: flex;
    justify-content: center;
    font-size: 24px;
    letter-spacing: 1px;
    color: #fff;
     span {
        position: relative;
        &::before {
        content: '';
        width:10px;
        height: 10px;
        background-color: #fbfcfc;
        position: absolute;
        left: -17px;
        top:8px;
        border-radius: 50%;
      }
      &::after {
        content: '';
        width:10px;
        height: 10px;
        background-color: #fbfcfc;
        position: absolute;
        right: -17px;
        top:8px;
        border-radius: 50%;
      }
     }
  }
  .index_info {
    margin-top: 125px;
    div {
      margin: 0 auto 20px;
      width: 479px;
      position: relative;
      span{
        font-size:24px;
        color:#ffffff;
        position: absolute;
        text-align: right;
        top:50%;
        transform: translateY(-50%);
        left:20px;
        &.username {
          text-indent: 2em;
        }
        &.mobile {
          text-indent: 1em;
        }
      }
      input {
        width:100%;
        padding:24px 5px 24px 140px;
        box-sizing: border-box;
        outline: none;
        border: 2px solid #fff;
        background-color: transparent;
        font-size: 24px;
        border-radius:40px;
        color: #fff;
      }
    }
  }
  .confirm {
      color: #fff;
      width: 480px;
      margin:70px auto 0;
      text-align: center;
      line-height: 80px;
      font-size: 24px;
      height: 80px;
      background: #4f38fc;
      border-radius:40px;
      background-size: cover;
  }
  .question {
    text-align: center;
    color: #fff;
    padding-top: 15px;
    font-size: 24px;
  }
}
</style>
<style>
.success {
    width: 500px;
    font-size: 16px;
    color: green !important;
    background-color: #fdf6ec;
  }
  .changeFont {
    width: 400px;
    font-size: 16px;
  }
</style>

