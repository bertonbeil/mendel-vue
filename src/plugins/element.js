import Vue from 'vue'
import {
  Button,
  Container,
  Dialog,
  Menu,
  MenuItem,
  Submenu
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Container)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
