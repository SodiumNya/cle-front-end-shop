<template>


  <div id="BasicLayout" >
    <van-popup
        v-model:show="show"
        position="left"
        :style="{ width: '50%', height: '100%', display: 'flex', justifyContent: 'center'}"
    >

      <div style="display: flex; flex-direction: column; align-items: center; margin: 4rem;">
        <van-image
            is-link @click="showPopup"
            round
            width="5rem"
            height="5rem"
            lazy-load
            :src="avatar"
        />
<!--        <van-space fill style="margin-top: 1rem; width: 100px" align="center">-->
<!--          {{businessStatus}}-->
<!--          <van-switch-->
<!--              :model-value="switchStatus"-->
<!--              @update:model-value="onUpdateValue" />-->
<!--        </van-space>-->
      </div>

    </van-popup>
    <van-sticky>
      <van-nav-bar
          v-if="isActiveTab"
          :title="pageTitle"
          left-text=""
          right-text=""
          left-arrow
          @click-right="onClickRight"
      >
        <template #left>
          <van-image
              is-link @click="showPopup"
              round
              width="2rem"
              height="2rem"
              lazy-load
              :src="avatar"
          />


        </template>

        <template #right>
          <van-popover

              placement="bottom-end"
              v-model:show="showPopover"
              :actions="actions"
              @select="onSelect">
            <template #reference>
              <van-icon name="add-o" size="1.5rem" color="#323233" />
            </template>
          </van-popover>

        </template>
      </van-nav-bar>
      <van-nav-bar
          v-if="!isActiveTab"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
      />
    </van-sticky>

    <div id="content">
      <router-view />
    </div >
    <van-tabbar v-show="isActiveTab"
        placeholder
        route v-model="active"
        @change="onChange">
      <van-tabbar-item name="首页" :to="api.home.path" icon="home-o" >首页</van-tabbar-item>
      <van-tabbar-item name="订单" :to="api.order.path" icon="orders-o">订单</van-tabbar-item>
      <van-tabbar-item name="购物车" :to="api.shoppingCart.path" icon="goods-collect-o">购物车</van-tabbar-item>
      <van-tabbar-item name="我的信息" :to="api.profile.path" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>

</template>

<style scoped>
#BasicLayout{
  background-color: #edf0f3;
  min-height: 100vh;
}
</style>

<script setup>
import {computed, onMounted, ref} from "vue";
import {showConfirmDialog, showToast} from "vant";
import {useRoute, useRouter} from "vue-router";
import api from "../../common/API";
const avatar = ref('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg')
onMounted(()=>{
  const url = JSON.parse(localStorage.getItem('avatar'))
  if(url) avatar.value = url
})

const route = useRoute()
const pageTitle = ref('')

const showTab = [api.home.name, api.order.name, api.shoppingCart.name, api.profile.name]
const isActiveTab = computed(()=>{
  return showTab.includes(route.name)
})

const onChange = (index)=>{
  active.value=index
  pageTitle.value = index
  if(index === '首页'){
    pageTitle.value = ''
  }
}
const router = useRouter()
const active = ref('首页');

const onClickLeft = () => history.back();
const onClickRight = () => {}
const show = ref(false);
const showPopup = () => {
  show.value = true;
};
const switchStatus = ref(true);
const businessStatus = ref('营业')
const updateBusinessStatus = ()=>{
  businessStatus.value = (!switchStatus.value) ?'营业' : '休息'
}
const onUpdateValue = (newValue) => {
  showConfirmDialog({
    title: '提醒',
    message: (!newValue) ?'确定要休息了吗？': '确定开始营业吗？',

  }).then(() => {
    switchStatus.value = !switchStatus.value;
    updateBusinessStatus()

  });
}
const ToProfile = () => {
  router.push('/business/profile')
};

const showPopover = ref(false);

// 通过 actions 属性来定义菜单选项
const actions = [
  { text: '订单',  path: api.order.path},
  { text: '搜索', path: api.search.path},
  { text: '小黑屋', path: api.blacklist.path },
];
const onSelect = (action) => {
  showToast(action.text);
  router.push(action.path)
}
</script>
