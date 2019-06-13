import Vue from 'vue'
import {
  Button,
  Card,
  Container,
  Col,
  Dialog,
  Form,
  FormItem,
  Input,
  InputNumber,
  Loading,
  RadioButton,
  Row,
  Menu,
  MenuItem,
  MessageBox,
  Option,
  Popover,
  Radio,
  RadioGroup,
  Submenu,
  Select,
  Table,
  TableColumn
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Card)
Vue.use(Container)
Vue.use(Col)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Loading)
Vue.use(RadioButton)
Vue.use(Row)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Option)
Vue.use(Popover)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Submenu)
Vue.use(Select)
Vue.use(Table)
Vue.use(TableColumn)

Vue.prototype.$confirm = MessageBox.confirm
