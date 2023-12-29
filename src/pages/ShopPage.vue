<script setup>
import {useRoute, useRouter} from "vue-router";
import api, {netApi} from "../../common/API";
import {showToast} from "vant";
import {onMounted, ref} from "vue";
import ProductDetails from "@/pages/ProductDetails.vue";
import ProductList from "@/components/ProductList.vue";
import request from "@/util/request";
import ResponseCode from "../../common/ResponseCode";
const router = useRouter()
const route = useRoute()
const active = ref(0);
const toProdDetail = (productId)=>{
  router.push({
    path: api.productDetails.path,
    query: {productId: productId}
  })
}

const isLoading = ref(true);
const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    isLoading.value = false;

  }, 1000);
};
const shop = ref({})
const products = ref([
  {
    productId: '1',
    name: '肯德基疯狂星期四vivo50',
    src: "https://fastly.jsdelivr.net/npm/@vant/assets/doge-fire.jpeg",
    price: 2.50,
    sale: 114514,
  },
  {
    productId: '2',
    src: "https://fastly.jsdelivr.net/npm/@vant/assets/doge-fire.jpeg",
    name: '肯德基疯狂星期四vivo50',
    price: 2.50,
    sale: 114514,
  },

])
const shopStatus = ref(false)
const show = ref(false);
const showPopup = () => {
  show.value = true;
};

const FetchData = async (shopId)=>{
  try {
    const shopResp = await request.get(netApi.shopShowInfo.path+shopId)

    const saleResp = await request.get(netApi.saleProduct.path+shopId)

    if(shopResp.code === ResponseCode.success.code){
      shop.value = shopResp.data
    }
    if(saleResp.code === ResponseCode.success.code){
      products.value = saleResp.data
    }
  }catch (e){
    console.log('一个异常', e)
  }
}
onMounted(()=>{
  FetchData(route.query.shopId)
})

</script>

<template>
  <div id="shop-page">
    <van-nav-bar >
    <template #left>
      <h3>{{shop.name}}</h3>
    </template>
    <template #right>
      <van-icon name="search" size="18" @click="showPopup"/>
    </template>
  </van-nav-bar>
    <van-popup
        v-model:show="show"
        position="bottom"
        :style="{ height: '30%' }"
    >
      <van-cell center title="拉黑店铺">
        <template #right-icon>
          <van-switch v-model="shopStatus" />
        </template>
      </van-cell>
    </van-popup>
  </div>
  <product-list :product-list="products"/>
</template>

<style scoped>
</style>