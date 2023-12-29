<script setup>
import {showToast} from "vant";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import request from "@/util/request";
import api, {netApi} from "../../common/API";
import ResponseCode from "../../common/ResponseCode";
import responseCode from "../../common/ResponseCode";
const payOrder = ref([])
const route = useRoute()
const router = useRouter()
const payType = ref('0')
const onSubmit = () => {
  const sendData = {}
  sendData.order = payOrder.value
  console.log(sendData.order)

  sendData.order.forEach(item =>{
    item.payType = payType.value
  })

  request.post('order/generate', sendData)
      .then(res=>{
        if(res.code === responseCode.success.code){
          showToast('支付成功')
          router.back()
        }
        else if(res.code === responseCode.unAuthorized.code){
          showToast('未登录， 不能下单')
          router.push(api.login.path)
        }
        else if(res.code === responseCode.fail.code){
          showToast('请先完善信息再下单叭~')
        }
      })

  // console.log(sendData)
}
const number = ref(1);
const totalPrice = ref(0.00)
const message = ref('')

onMounted(async ()=> {
  const order = JSON.parse(route.query.order || '{}')
  const orderResp = await request.post(netApi.getOrder.path, {order: order})

  if(orderResp.code === ResponseCode.success.code){
    payOrder.value = orderResp.data.order
    totalPrice.value = orderResp.data.payPrice * 100;
    console.log(totalPrice.value)
  }else if(orderResp.code === ResponseCode.fail.code){
    showToast(orderResp.message)
    await router.push(api.home.path)
  }
})
</script>

<template>
  <div id="purchase" >
    <div v-for="order in payOrder" style="margin-top: 0.5rem">
      <van-cell :title="order.shopName" />
      <div v-for="good in order.goodList">
        <van-row
            gutter="20"
            style="padding: 1rem;"
            justify="left">
          <van-col>
            <van-image
                radius="10px"
                :src="good.mainImage"
                width="10rem"
                height="5rem"
            />
          </van-col>
          <van-col>
            <van-text-ellipsis :content="good.goodName" />
            <van-row >
              <h4>单价：￥{{ good.price }}</h4>
            </van-row>
            <van-row style="margin-top: 0.5rem">
            </van-row>
          </van-col>
        </van-row>
      </div>
      <van-cell-group
          style="border-top: 1px solid #e3dfdf"
          inset>
        <van-field
            v-model="order.note"
            rows="4"
            autosize
            label="备注"
            type="textarea"
            maxlength="100"
            placeholder="请输入备注"
            show-word-limit
        />
      </van-cell-group>
    </div>

    <van-radio-group

        v-model="payType"
        direction="horizontal"
        style="padding: 0.5rem 0.5rem 4rem 0.5rem">

      <van-radio name="0">微信</van-radio>
      <van-radio name="1">支付宝</van-radio>
    </van-radio-group>

  </div>

  <van-submit-bar
      :price="totalPrice"
      button-text="提交订单"
      @submit="onSubmit" />



</template>

<style scoped>
#purchase{
  margin: 0.5rem 0 0.5rem 0;
  border-radius: 10px;
  background-color: white;

}
</style>