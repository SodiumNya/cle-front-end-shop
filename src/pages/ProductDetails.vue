<template>
  <div id="profileDetail">
    <van-swipe :autoplay="3000" indicator-color="#66c6f2">
      <van-swipe-item v-for="image in pictureList">
        <van-image
            :src="image.url"
            height="15rem"
            width="100%"
        />
      </van-swipe-item>
    </van-swipe>
  </div>
  <div>
    <van-form inset>
      <van-cell-group>
        <!-- 通过 pattern 进行正则校验 -->
        <van-field
            readonly
            label="商品名称"
            v-model="products.name"
            name="pattern"
        />
        <!-- 通过 validator 进行函数校验 -->
        <!-- 通过 validator 返回错误提示 -->
        <van-field
            readonly
            label="销量"
            v-model="products.sale"
            name="validatorMessage"

        />
        <van-field
            readonly
            label="综合评分"
            v-model="products.score"
            name="asyncValidator"
        />
        <van-cell is-link title="选择" @click="showSpecification = true" />
        <van-action-sheet :z-index="1999"
                          v-model:show="showSpecification"
                          title="选择">
          <div class="content">
            <van-row v-for="(values, attribute) in products.specs" :key="attribute">
              <van-space size="1rem">
                <h3>{{ attribute }}</h3>
                <van-radio-group v-for="value in values" :key="value"
                                 @change="queryPrice()"
                                 v-model="selectedOptions[attribute]"
                                 direction="horizontal">
                  <van-radio :name="value" style="margin-top: 0.5rem">{{value}}</van-radio>
                </van-radio-group>
              </van-space>
            </van-row>
            <van-divider />
            <van-stepper
                v-model="quantity"
                style="position: fixed; right: 10px;"
            />


          </div>
        </van-action-sheet>

        <van-cell
            is-link
            :to="{path: api.productComments.path, query:{productId: products.id}}"
            title="买家评价"
            name="asyncValidator"
        >
          <template #label>
            <a-comment v-for="user in comments.slice(0, 2)"
                       style="border-bottom: 1px solid #e5e3e3"
                       align="right"
                       :author="user.nickname"
                       :avatar="user.avatar"
                       :datetime="user.createdLocal"
            >
              <template #content>
                <van-text-ellipsis
                    :content="user.content"
                    expand-text="查看"
                />
              </template>
            </a-comment>
          </template>
        </van-cell>
      </van-cell-group>

    </van-form>
  </div>
  <van-action-bar style="z-index: 2000">
    <van-action-bar-icon icon="shop-o" text="店铺" @click="toShop(products.shopId)" />
    <van-action-bar-button color="#be99ff" type="warning" text="加入购物车" @click="addCart(products.id)"/>
    <van-action-bar-button v-if="totalPrice === null" color="#7232dd" type="danger" :text="`立即购买`" @click="purchase(products.id)"/>
    <van-action-bar-button v-else color="#7232dd" type="danger" :text="`立即购买 ${totalPrice}`" @click="purchase(products.id)"/>
  </van-action-bar>



</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import api, {netApi} from "../../common/API";
import {showToast} from "vant";
import request from "@/util/request";
import ResponseCode from "../../common/ResponseCode";

const route = useRoute()
const router = useRouter()
const selectedOptions = ref({});
const quantity = ref(1)

const products = ref([])
const pictureList = ref([])
const comments = ref([])
const totalPrice = ref(null)
const DataFetch = async (productId)=>{
  try {
    const basicInfoResp = await request.get(netApi.getProduct.path+productId)

    const pictureResp = await request.get(netApi.productPicture.path+productId)

    const commentsResp = await request.get(netApi.productComments.path+productId)

    if(basicInfoResp.code === ResponseCode.success.code){
      products.value = basicInfoResp.data
      for (const attribute in products.value.specs) {
        selectedOptions.value[attribute] = null;
      }
    }
    if(pictureResp.code === ResponseCode.success.code){
      pictureList.value = pictureResp.data
    }
    if(commentsResp.code === ResponseCode.success.code){
      comments.value = commentsResp.data
    }
  }catch (e){
    console.log('一个错误', e)
  }



}
onMounted(() => {
  const productId = route.query.productId
  DataFetch(productId)
})
const showSpecification = ref(false)
const toShop = (shopId)=>{
  router.push({
    path: api.shop.path,
    query: {shopId: shopId}
  })
}
const queryPrice = ()=>{
  const requestData = {};
  for (const attribute in selectedOptions.value) {
    if(!selectedOptions.value[attribute]) return
    requestData[attribute] = selectedOptions.value[attribute];
  }
  console.log(requestData)
  request.post(netApi.getPrice.path, {
    goodsId: products.value.id,
    specs: JSON.stringify(requestData)
  }).then(res=>{
    if(res.code === ResponseCode.success.code){
      console.log(res.data)
      totalPrice.value = res.data
    }else {
      showToast(res.message)
    }
  })
}
const purchase = (goodId)=>{
  const token = JSON.parse(localStorage.getItem('token') || 'null')
  if(token === null) {
    showToast('未登录')
    return;
  }

  for (let attribute in selectedOptions.value) {
    if (!selectedOptions.value[attribute]){
      showSpecification.value = true
      return
    }
  }
  const sendData = [{goodList: [
      {
          goodId: goodId,
          quantity: quantity.value,
          specs: JSON.stringify(selectedOptions.value)
      }
      ]}]
  router.push({
    path: api.purchase.path,
    query: {
      order: JSON.stringify(sendData)
    }
  })
}
const addCart = async (goodId) => {
  const token = JSON.parse(localStorage.getItem('token') || 'null')
  if(token === null) {
    showToast('未登录')
    return;
  }
  for (let attribute in selectedOptions.value) {
    if (!selectedOptions.value[attribute]){
      showSpecification.value = true
      return
    }
  }
  const addCartResp = await request.post(netApi.addCart.path, {
    shopId: 1,
    goodList: [
        {
          goodId: goodId,
          specs: JSON.stringify(selectedOptions.value),
          quantity: quantity.value,
        }
        ]
  })

  if(addCartResp.code === ResponseCode.success.code){
    showToast('添加成功')
  }else if(addCartResp.code === ResponseCode.unAuthorized.code){
    showToast('请先登录')
  }
}
</script>
<style scoped>
.content {
  padding: 16px 16px 160px;
}

</style>