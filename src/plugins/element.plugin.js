import Vue from 'vue'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Container,
  Col,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Input,
  Icon,
  InputNumber,
  Loading,
  RadioButton,
  Row,
  Menu,
  MenuItem,
  Message,
  MessageBox,
  Option,
  Popover,
  Radio,
  RadioGroup,
  Submenu,
  Select,
  Switch,
  Table,
  TableColumn,
  Tooltip,
  Upload
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Alert)
Vue.use(Button)
Vue.use(Card)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Container)
Vue.use(Col)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Icon)
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
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Upload)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = Message
