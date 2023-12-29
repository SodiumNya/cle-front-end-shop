
<template>
  <div id="profileEdit">
    <van-form @submit="onSubmit" style="">

      <van-cell-group inset class="van-hairline--bottom">

        <van-field v-if="editUser.editKey !== 'avatar'"
                   v-model="editUser.editValue"
                   :name="editUser.editKey"
                   :label='editUser.editLabel'
                   :placeholder="editUser.editKey"
                   :rules="[{ required: true, message: '请输入'}]"
        />
        <van-field v-else class="custom-field"
                   name="uploader"
                   :label="editUser.editLabel"
        >
          <template #input>
            <van-uploader
                v-model="uploader"
                reupload max-count="1"
                :after-read="afterRead"

            />
          </template>
        </van-field>
      </van-cell-group>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          保存
        </van-button>
      </div>
    </van-form>

  </div>



</template>
<script setup>
import {reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import request from "@/util/request";
import api, {netApi} from "../../common/API";
import {showToast} from "vant";
import ResponseCode from "../../common/ResponseCode";
const route = useRoute()
const router = useRouter()
const editUser = ref({
  editKey: '',
  editValue: '',
  editLabel: '',
  editIndex: '',
})
editUser.value.editKey = route.query.editKey
editUser.value.editValue = route.query.editValue
editUser.value.editLabel = route.query.editLabel
editUser.value.editIndex = route.query.editIndex
const uploader = ref([
  { url: editUser.value.editValue },
]);
const username = ref('');
const password = ref('');
let upload = ref(null);
const afterRead = (file)=>{
  upload = file
  console.log(upload)
}
const onSubmit = (values) => {

  console.log(editUser.value.editIndex)
  const account = JSON.parse(localStorage.getItem('account'|| '{}'))
  const item = netApi.update.find((item)=>{
    if(item.name === editUser.value.editIndex)
      return item
  })
  if(editUser.value.editIndex === 'avatar'){
    if(upload.value === null) return
    const sendData = new FormData;
    sendData.append('file', upload.file)
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    request.put(item.path ,sendData, config)
        .then(res => {
          if(res.code === ResponseCode.success.code){
            showToast(res.message)
            router.push(api.profile.path)
          }else {
            showToast(res.message)
          }
        })
  }else {
    request.put(item.path, editUser.value.editValue)
        .then(res => {
          if(res.code === ResponseCode.success.code){
            showToast(res.message)
            router.push(api.profile.path)
          }else {
            showToast(res.message)
          }
        })
  }
};



</script>

<style scoped>
.custom-field {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 将内容放到右边 */
}
#profileEdit{
  padding-top: 0.5rem;

}
</style>