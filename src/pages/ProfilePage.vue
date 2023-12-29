<template>
  <div id="profile">
    <van-cell
        is-link class="avatar"
        @click="show = true"
    >
      <van-image
          round
          width="4rem"
          height="4rem"
          lazy-load
          :src="user.avatar"
      />
    </van-cell>
    <van-action-sheet v-model:show="show" :actions="actions" @select="onSelect" />
    <van-cell
        title="用户名"
        is-link :value="user.account"
        @click="DoEdit(user.account, '', '用户名', 'account')"
    />
    <van-cell
        title="昵称"
        is-link :value="user.nickname"
        @click="DoEdit(user.nickname, '', '昵称', 'nickname')"
    />
    <van-cell
        title="手机号"
        is-link :value="user.phone"
        @click="DoEdit(user.phone, '', '手机号', 'phone')"
    />
    <van-cell
        title="邮箱"
        is-link :value="user.email"
        @click="DoEdit(user.email, '', '邮箱', 'email')"
    />
    <van-cell
        title="重置密码"
        is-link
        @click="reSetPwd()"
    />
    <div style="padding: 0.5rem">
      <van-button v-if="user.account" round block type="primary" native-type="submit" @click="logOut">
        退出登录
      </van-button>
      <van-button v-else round block type="primary" native-type="submit" @click="login">
        登录
      </van-button>
    </div>

  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {showImagePreview, showToast} from "vant";
import api, {netApi} from "../../common/API";
import request from "@/util/request";
import ResponseCode from "../../common/ResponseCode";
const user = ref({
  account: '',
  avatar: '',
  phone: '',
  email: '',
  password: '',
  nickname: '',
})
onMounted(()=>{
  const token = JSON.parse(localStorage.getItem('token') || 'null')
  if(token === null) return
request.get(netApi.info.path)
    .then(res => {
      if(res.code !== ResponseCode.success.code){
        showToast(res.message)
      }else {
        user.value = res.data
      }
    })
})

const router = useRouter()
const DoEdit = (editKey, editValue, editLabel, editIndex)=>{
  router.push({
    path:api.profileEdit.path,
    query: {
      editKey: editKey,
      editValue: editValue,
      editLabel: editLabel,
      editIndex: editIndex,
    }
  });
}

const reSetPwd = ()=>{
  router.push(api.reSetPassword.path)
}



const show = ref(false);
const actions = [
  { name: '查看头像', value: 0 },
  { name: '修改头像', value: 1 },

];
const onSelect = (item) => {
  // 默认情况下点击选项时不会自动收起
  // 可以通过 close-on-click-action 属性开启自动收起
  show.value = false;
  if(item.value === 1){
    DoEdit('avatar', user.value.avatar, '头像', 'avatar')
  }else {
    showImagePreview([user.value.avatar])
  }

};


const login = ()=>{
  router.push(api.login.path)
}
const logOut = ()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('avatar')
  localStorage.removeItem('user')
  router.push(api.login.path)
}
</script>
<style scoped>
.avatar{
  display: flex;
  align-items: center
}
#profile{
  padding: 0.5rem;
  border-radius: 10px;
}
</style>