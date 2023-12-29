<script setup>
import {ref} from "vue";
import api from "../../common/API";
import {showToast} from "vant";
import {useRouter} from "vue-router";
import request from "@/util/request";
const router = useRouter()
const searchValue = ref('')
const recommendedProducts = ref([])

const doSearch = ()=>{
  showToast("搜索： "+ searchValue.value)
  request.get(`product/search/${searchValue.value}`)
      .then(res=>{recommendedProducts.value = res.data})
}
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
const active = ref(0);
</script>

<template>
  <van-search
      v-model="searchValue"
      shape="round"
      background="#4fc08d"
      placeholder="请输入搜索关键词"
      @search="doSearch"
  />
  <div id="searchPage">
    <van-tabs v-model:active="active" swipeable>
      <van-tab v-for="shop in recommendedProducts" :title="shop.canteenName"
               style=" border-top: 1px solid #f3efef;"
      >
        <van-pull-refresh
            v-model="isLoading"
            success-text="刷新成功"
            @refresh="onRefresh"
        >
          <van-row justify="space-between">
            <van-col v-for="product in shop.goodsList"
                     class="product"
                     @click="toProdDetail(product.id)"
            >
              <van-image
                  height="7rem"
                  width="11rem"
                  :src="product.mainImage"

              />
              <div style="margin-left: 0.5rem; margin-right: 0.5rem">
                <van-text-ellipsis :content="product.name" />

                <van-row justify="space-between">
                  <van-col>
                    <strong style="color: red">￥{{product.price}}</strong>
                  </van-col>
                  <van-col>
                    <h4>销量:{{product.sale}}</h4>
                  </van-col>
                </van-row>
              </div>
            </van-col>
          </van-row>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped>
.product{
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  margin: 0.3rem 5px 0.3rem 5px;
}
</style>