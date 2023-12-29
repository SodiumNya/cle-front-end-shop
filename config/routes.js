import api from "../common/API";

const routes = [
    {
        path: api.home.path,
        name: api.home.name,
        component: () => import('@/pages/HomePage.vue')
    },
    {
        path: api.order.path,
        name: api.order.name,
        component: () => import('@/pages/OrdersPage.vue')
    },
    {
        path: api.orderDetail.path,
        name: api.orderDetail.name,
        component: () => import('@/pages/OrderDetails.vue')
    },
    {
        path: api.productComments.path,
        name: api.productComments.name,
        component: () => import('@/pages/CommentsPage.vue')
    },
    {
        path: api.shoppingCart.path,
        name: api.shoppingCart.name,
        component: () => import('@/pages/ShoppingCart.vue')

    },
    {
        path: api.profile.path,
        name: api.profile.name,
        component: () => import('@/pages/ProfilePage.vue')
    },
    {
        path: api.profileEdit.path,
        name: api.profileEdit.name,
        component: () => import('@/pages/ProfileEditPage.vue')
    },
    {
        path: api.blacklist.path,
        name: api.blacklist.name,
        component: () => import('@/pages/BlackListPage.vue')
    },
    {
        path: api.productDetails.path,
        name: api.productDetails.name,
        component: ()=> import('@/pages/ProductDetails.vue')
    },
    {
        path: api.purchase.path,
        name: api.purchase.name,
        component: () => import('@/pages/PurchasePage.vue')
    },
    {
        path: api.rate.path,
        name: api.rate.name,
        component: () => import('@/pages/RatePage.vue')
    },
    {
        path: api.search.path,
        name: api.search.name,
        component: () => import('@/pages/SearchPage.vue')
    },
    {
        path: api.shop.path,
        name: api.shop.name,
        component: ()=> import('@/pages/ShopPage.vue')
    },
    {
        path: api.login.path,
        name: api.login.name,
        component: ()=> import('@/pages/LoginPage.vue')
    },
    {
        path: api.register.path,
        name: api.register.name,
        component: ()=> import('@/pages/Register.vue')
    },
    {
        path: api.reSetPassword.path,
        name: api.reSetPassword.name,
        component: ()=> import('@/pages/ResetPassword.vue')
    }



]

export default routes