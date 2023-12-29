
<template>
  <van-form @submit="onSubmit" style="margin-top: 1rem">
    <van-cell-group inset class="van-hairline--bottom">
      <div style="margin: 1.2rem" >
        评分: <van-rate style="padding: 0.5rem" v-model="rateValue" allow-half />
        {{rateValue}}
      </div>
      <van-cell-group
          style="border-top: 1px solid #e3dfdf"
          inset>
        <van-field
            v-model="message"
            rows="4"
            autosize
            label="备注"
            type="textarea"
            maxlength="100"
            placeholder="非常好食物, 爱使我旋转"
            show-word-limit
        />
      </van-cell-group>
    </van-cell-group>

    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        保存
      </van-button>
    </div>
  </van-form>



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
const goodsId = route.query.goodsId;
const orderSn = route.query.orderSn;
const rateValue = ref(5.0);
const message =ref('')
const onSubmit = async (values) => {
  const token = JSON.parse(localStorage.getItem('token') || 'null')
  if(token === null){
    showToast('未登录或身份过期, 请重新登录')
    return
  }
  if(goodsId === null){
    showToast('评价失败, 请刷新')
  }
  const rateResp = await request.post(netApi.goodsRate.path, {
    id: goodsId,
    orderSn: orderSn,
    score: rateValue.value,
    message: message.value}
  )

  if(rateResp.code === ResponseCode.success.code){
    showToast('评价成功')
    router.back()
  }else showToast('操作失败')
};



</script>

<style scoped>
.custom-field {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 将内容放到右边 */
}
</style>