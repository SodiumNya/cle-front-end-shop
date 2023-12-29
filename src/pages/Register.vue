

<template>
  <div id="business-register">
    <div style=" display: flex;justify-content: center; padding-bottom: 3rem">
      <van-image
          round
          height="10rem"
          width="10rem"
          fit="cover"
          position="center"
          src="https://blob.keylol.com/forum/201910/24/220905r5htv25lsd2qzs0c.jpg"
      />
    </div>
      <van-form style="width: 100%;" @failed="onFailed" @submit="doRegister">
        <van-cell-group inset>
          <!-- 通过 pattern 进行正则校验 -->
          <van-field
              v-model="inputAccount"
              name="pattern"
              placeholder="账户"
              :rules="[{ pattern, message: '请输入正确内容' }]"
          />
          <!-- 通过 validator 进行函数校验 -->
          <van-field
              v-model="inputPassword"
              name="validator"
              placeholder="密码"
              :rules="[{ validator:passwordValidator, message: '请输入正确内容' }]"
          />
          <van-field
              v-model="verifyPassword"
              name="validator"
              placeholder="确认密码"
              :rules="[{ validator:passwordValidator, message: '请输入正确内容' }]"
          />
<!--          <van-field-->
<!--              v-model="code"-->
<!--              name="validator"-->
<!--              placeholder="邀请码"-->
<!--              :rules="[{ validator:codeValidator, message: '请输入正确内容' }]"-->
<!--          />-->
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="success" native-type="submit">
            注册
          </van-button>
        </div>
      </van-form>

    <div  style=" display: flex;justify-content: center;" >
      已有账号？
      <a style="color: #1989fa" @click="toLogin">登录</a>
    </div>

  </div>


</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import api, {netApi} from "../../common/API";
import request from "@/util/request";
import responseCode from "../../common/ResponseCode";
import {showToast} from "vant";

const router = useRouter()

const inputAccount = ref('');
const inputPassword = ref('');
const verifyPassword = ref('');
const code = ref('');
const pattern = /^[A-Za-z0-9\s]+$/;


// 校验函数返回 true 表示校验通过，false 表示不通过
const passwordValidator = (val) => /^[\w\s!@#$%^&*(),.?":{}|<>]+$/i.test(val);

const codeValidator = (val) => /^[a-zA-Z0-9]{8}$/.test(val);


const onFailed = (errorInfo) => {
  console.log('failed', errorInfo);
};
const doRegister = ()=> {
  request.post(netApi.register.path,
      {
        account: inputAccount.value,
        password: inputPassword.value,
        verifyPassword: verifyPassword.value,
      }).then(res =>{
    console.log(res)
    if(res.code === responseCode.success.code){
      showToast("注册成功")
      router.push(api.login.path)
    }else {
      showToast(res.message)
    }
  })
}
const toLogin = ()=>{router.push(api.login.path)}
</script>

<style scoped>
#business-register{
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>