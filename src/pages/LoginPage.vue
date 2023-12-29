
<template>
  <div id="business-login">
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
      <van-form style="width: 100%;" @failed="onFailed">
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
              :rules="[{ validator, message: '请输入正确内容' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" @click="doLogin">
            登录
          </van-button>
        </div>
      </van-form>

    <div  style=" display: flex;justify-content: center;" >
      还没有账号？
      <a @click="toRegister">去注册</a>
    </div>

  </div>


</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import api from "../../common/API";
import { netApi } from "../../common/API"
import request from "@/util/request";
import responseCode from "../../common/ResponseCode";
import {showToast} from "vant";


const router = useRouter()

const inputAccount = ref('');
const inputPassword = ref('');
const pattern = /^[A-Za-z0-9\s]+$/;


// 校验函数返回 true 表示校验通过，false 表示不通过
const validator = (val) => /^[\w\s!@#$%^&*(),.?":{}|<>]+$/i.test(val);

const onFailed = (errorInfo) => {
  console.log('failed', errorInfo);
};
const doLogin = ()=>{
  request.post(netApi.login.path,
      {
        account: inputAccount.value,
        password: inputPassword.value
      }).then(res =>{
    console.log(res)
        if(res.code === responseCode.success.code){
          if(res.data.role !== '用户'){
            showToast('非用户不可登录')
            return
          }
          showToast("登陆成功")
          localStorage.setItem('token', JSON.stringify(res.data.token))
          localStorage.setItem('avatar', JSON.stringify(res.data.avatar))
          router.push(api.home.path)
        }else {
          showToast(res.message)
        }
          })
}

const toRegister = ()=>{router.push(api.register.path)}
</script>

<style scoped>
#business-login{
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>