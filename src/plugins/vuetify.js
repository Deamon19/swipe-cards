import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import es from 'vuetify/es5/locale/es'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  options: {
    customProperties: true
  },
  iconfont: 'mdi',
  lang: {
    locales: {
      es
    },
    current: 'es'
  },
  theme: {
    primary: colors.pink.lighten2,
    secondary: colors.grey.lighten2,
    accent: colors.grey.lighten4
  }
})
