import App from './App'
import messages from './locale/index'

let i18nConfig = {
	locale: uni.getLocale(),
	messages
}

import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false
App.mpType = 'app'


import uView from 'uview-ui'
Vue.use(uView)

import store from '@/store';

let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);


let capsuleMixin = require('@/store/capsuleMixin.js');
Vue.mixin(capsuleMixin)


let mescrollMixin = require('uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js')
Vue.mixin(mescrollMixin)

import util from '@/utils/util.js'
Vue.prototype.$util = util

import api from '@/config/api.js'
Vue.prototype.$api = api

const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()
