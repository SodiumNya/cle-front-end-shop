<template>
  <div id="shoppingCart" v-for="cartItem in productList">
    <van-cell :title="cartItem.shopName" />
    <van-row v-for="goods in cartItem.goodList"
             justify="space-around"
             class="product"
    >
      <van-col style="margin-top: 0.5rem">
        <van-checkbox
            v-model="goods.checked"
            @click="changeCheck(goods)"
        />
        <van-button
            type="danger"
            size="mini"
            style="margin-top: 1rem"
            @click="deleteProduct(goods)"
        >删除</van-button>
      </van-col>
      <van-col style="margin-top: 0.5rem">
        <van-image
            radius="10px"
            :src="goods.mainImage"
            width="10rem"
            height="5rem"

        />
      </van-col>
      <van-col style="margin-top: 0.5rem">
        <van-text-ellipsis  :content="goods.goodName"/>
        <van-row >
          <van-col>
            <h4>单价：￥{{goods.price}}</h4>
            <van-stepper v-model="goods.quantity" @change="caclulateTotalPrice"/>
          </van-col>
          <van-col>
          </van-col>
        </van-row>
      </van-col>
    </van-row>
  </div>
  <van-submit-bar
      button-text="提交订单"
      style="bottom: 50px"
      @submit="onSubmit">
    <div style="position: fixed; left: 1rem" >
      <van-button v-if="checkedAll" round type="success" @click="changeAllCheck">取消</van-button>
      <van-button v-else round type="success" @click="changeAllCheck">全选</van-button>
    </div>

  </van-submit-bar>

</template>
<script setup>
import {onMounted, ref} from "vue";
import {showConfirmDialog, showToast} from "vant";
import api, {netApi} from "../../common/API";
import ResponseCode from "../../common/ResponseCode";
import request from "@/util/request";
import {useRouter} from "vue-router";
const router = useRouter()

const productList = ref([])
// const totalPrice = ref(0.00)
const checkedAll = ref(false)
const checkCount = ref(0)
const goodsCount = ref(0)

const changeCheck = (goods)=> {
  if(goods.checked) checkCount.value++
  else checkCount.value--
  checkedAll.value = (checkCount.value === goodsCount.value)
}
const changeAllCheck =  ()=> {
  console.log("xxx")
  checkedAll.value = !checkedAll.value
  // 使用 forEach 遍历 cartItemList
  productList.value.forEach(cartItem => {
    // 使用 forEach 遍历 goodList
    cartItem.goodList.forEach(good => {
      // 添加 checked 属性
      good.checked = checkedAll.value;
    });
  });
}
const caclulateTotalPrice = ()=>{}

const FetchData = async ()=>{
  try {
    const cartResp = await request.get(netApi.getCart.path)

    if(cartResp.code === ResponseCode.success.code) {
      productList.value = cartResp.data.cartItemList
      // 使用 forEach 遍历 cartItemList
      productList.value.forEach(cartItem => {
        // 使用 forEach 遍历 goodList
        cartItem.goodList.forEach(good => {
          // 添加 checked 属性
          good.checked = false;
          goodsCount.value++
        });
      });

      console.log(productList.value)

    }
  }catch (e){
    console.log('一个异常', e)
  }
}

const deleteProduct = (goods) =>{
  showConfirmDialog({
    title: '提醒',
    message: '确定删除？',

  }).then(async () => {
    showToast("删除物品")
    // TODO 发送请求, 更新购物车。
    const removeResp = await request.post(netApi.removeFromCart.path, {id: goods.cartItemId})
    if(removeResp.code === ResponseCode.success.code){
      showToast('已经移除');
      await FetchData()
    }else showToast('删除失败')
    caclulateTotalPrice()
  }).catch(()=>{});
}
const onSubmit = ()=>{
  const sendData = []
  productList.value.forEach(cartItem => {
    // 使用 forEach 遍历 goodList
    let shop = {goodList: []}

    cartItem.goodList.forEach(good => {
      if(good.checked) shop.goodList.push({
        goodId: good.goodId,
        specs: good.specs,
        quantity: good.quantity,
        cartItemId: good.cartItemId
      })
    });
    if(shop.goodList.length !== 0) sendData.push(shop)
  });

  console.log(sendData)
  if(sendData.length === 0) showToast('没有商品不能下单')
  else {
    router.push({
      path: api.purchase.path,
      query: {
        order: JSON.stringify(sendData)
      }
    })
  }
}

onMounted(()=>{
  FetchData()
})
</script>
<style scoped>
#shoppingCart{
  background-color: white;
  margin: 0.5rem;
  padding: 0.5rem;
  border-radius: 10px;
}
.product{
}
</style>