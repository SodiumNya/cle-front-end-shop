<script setup>
import request from "@/util/request";

defineProps({
  productList: {
    type: Array,
    required: true
  },
  location: {
    type: String,
    required: true
  },

})
const emit = defineEmits(['updateRecommend'])
const update = (data)=>{
  emit('updateRecommend', data)
}
import {useRouter} from "vue-router";
import api, {netApi} from "../../common/API";
import {showToast} from "vant";
import {ref} from "vue";
import ResponseCode from "../../common/ResponseCode";
const router = useRouter()
const toProdDetail = (productId)=>{
  router.push({
    path: api.productDetails.path,
    query: {productId: productId}
  })
}

const isLoading = ref(true);
const onRefresh = (location, productList) => {

  if(location === '') {
    isLoading.value = false;
    return
  }
  try {
   request.get(netApi.recommend.path + location)
       .then(res=>{
         handleRecommendResponse(res, productList);

       });
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
const handleRecommendResponse = (recommendResponse, productList) => {
  showToast(recommendResponse.code)
  if (recommendResponse.code === ResponseCode.success.code) {
    update(recommendResponse)
    console.log(productList)
    showToast('刷新成功');
    isLoading.value = false;
  } else {
    showToast(recommendResponse.message);
  }
};
</script>

<template>
  <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh(location, productList)"
  >
    <van-row justify="space-between">
      <van-col v-for="product in productList"
               class="product"
               @click="toProdDetail(product.id)"
      >
        <van-image
            height="7rem"
            width="11rem"
            lazy-load
            :src="product.mainImage"

        />
        <div style="margin-left: 0.5rem; margin-right: 0.5rem">
          <van-text-ellipsis :content="product.name" />

          <van-row justify="space-between">
            <van-col>
              <h4>评分:{{product.score}}</h4>
            </van-col>
            <van-col>
              <h4>销量:{{product.sale}}</h4>
            </van-col>
          </van-row>
        </div>
      </van-col>
    </van-row>
  </van-pull-refresh>



</template>

<style scoped>
.product{
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  margin: 0.3rem 5px 0.3rem 5px;
}
</style>