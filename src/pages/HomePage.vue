<script setup>
import {onMounted, ref} from "vue";
import {showToast} from "vant";
import ProductList from "@/components/ProductList.vue";
import {netApi} from "../../common/API";
import request from "@/util/request";
import ResponseCode from "../../common/ResponseCode";

const active = ref(0);
const flag = ref(false)
const currTitle = ref('')


let carouselList = ref([]);
const updateTitle = ({ title }) => {
  currTitle.value = title
}
const fetchData = async ()=>{
  try{
    const locationResponse = await request.get(netApi.location.path)

    if (locationResponse.code === ResponseCode.success.code) {
      const locations = locationResponse.data.map(item => ({ location: item }))
      recommendedProducts.value.push(...locations)
      currTitle.value = recommendedProducts.value[0].location

      // 使用 Promise.all 等待所有异步操作完成
      await Promise.all(recommendedProducts.value.map(async (item) => {
        item['productList'] = await getRecommendProduct(item.location);
        console.log(item.productList);
      }));

      flag.value = true
    }else {
      showToast(locationResponse.message)
    }

  }catch (e){
    console.log('一个错误：', e)
  }
}
const getRecommendProduct = async (location) => {
  const recommendResponse = await request.get(netApi.recommend.path + location)

  if(recommendResponse.code === ResponseCode.success.code){

    return recommendResponse.data
  }

  showToast(recommendResponse.message)

};
onMounted(()=>{
  fetchData()
  request.get('/get/carousel')
      .then(res=>{
        if(res.code === ResponseCode.success.code){
          carouselList.value = res.data;
          console.log(carouselList.value)
        }
      })
})


const handleRecommendResponse = (recommendResponse) => {
  if (recommendResponse.code === ResponseCode.success.code) {
    // 遍历数组，找到匹配 location 的对象并更新 productList
    recommendedProducts.value.forEach(item => {
      if (item.location === recommendResponse.data.location) {
        // 如果找到匹配的对象，则添加新的 productList
        if(!item.productList)
          item['productList'] = recommendResponse.data.productList
        else
          item.productList = item.productList.concat(recommendResponse.data.productList)
      }
    });
  } else {
    showToast(recommendResponse.message);
  }
};
const recommendedProducts = ref([])
</script>

<template>
  <div id="home" >
    <van-swipe :autoplay="3000" indicator-color="#66c6f2">
      <van-swipe-item v-for="image in carouselList">
        <van-image
            :src="image.url"
            height="11rem"
            width="100%"
        />
      </van-swipe-item>
    </van-swipe>
    <van-tabs
        style="background-color: #ebeef1"
        v-model:active="active"
        swipeable @click-tab="updateTitle">
      <van-tab v-for="shop in recommendedProducts" :title="shop.location"
               style=" border-top: 1px solid #f3efef;"
      >
        <product-list
            :product-list="shop.productList"
            :location="currTitle"
            @update-recommend="handleRecommendResponse"
            style="min-height: 80vh"
            v-if="flag"/>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped>
#home{
  background-color: white;
}


</style>