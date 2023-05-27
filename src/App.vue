<template>
  <div id="app">
    <v-card
      class="elevation-0"
      height="80vh"
      :class="[
        background ? 'bg-card' : null,
        title == 'top' ? 'content' : null,
      ]"
    >
      <v-slide-y-transition>
        <v-card-text
          v-if="title == 'top' && productOut"
          class="text-xs-center title"
          :style="`color: ${background ? 'white' : 'black'}`"
        >
          <strong>¿Comprarias este producto?</strong>
        </v-card-text>
      </v-slide-y-transition>

      <vue-tinder
        ref="showroom"
        key-name="id"
        :queue.sync="products"
        :offset-y="10"
        @submit="onSubmit"
      >
        <template slot-scope="{ data }">
          <div
            class="pic"
            :style="{
              'background-image': `url(${data.image})`,
            }"
          >
            <template v-if="!data.isProduct">
              <v-layout justify-center column fill-height>
                <v-flex xs12>
                  <div class="container fluid fill-height pt-0">
                    <v-layout justify-center align-center>
                      <v-flex md5 lg4 text-xs-center>
                        <p class="headline font-weight-bold primary--text">
                          ¡Gracias por tu opinion!
                        </p>

                        <p class="title font-weight-bold">
                          Es importante para nosotros, lo tomaremos en cuenta
                          para próximos catálogos.
                        </p>

                        <v-btn
                          block
                          large
                          dark
                          color="primary"
                          @click="goToCatalog"
                          >Salir de Showroom</v-btn
                        >
                      </v-flex>
                    </v-layout>
                  </div>
                </v-flex>
              </v-layout>
            </template>
            <template v-else>
              <div class="item-name">
                <span class="item-first">{{ data.name.split(" ")[0] }}</span>
                <span class="item-second">{{ data.name.split(" ")[1] }}</span>
                <span class="item-price">${{ data.price }}</span>
              </div>
            </template>
          </div>
        </template>

        <img class="like-pointer" slot="like" :src="yesTxt" />
        <img class="nope-pointer" slot="nope" :src="noTxt" />
        <img class="super-pointer" slot="super" :src="maybeTxt" />
        <img class="rewind-pointer" slot="rewind" :src="retryTxt" />
      </vue-tinder>

      <v-card-text
        style="color: black"
        v-if="title == 'bottom'"
        class="text-xs-center title mt-4"
      >
        <strong>¿Comprarias este producto?</strong>
      </v-card-text>
      <v-slide-y-transition>
        <div class="btns">
          <img :src="zGetButtons().retry" @click="decide('rewind')" />
          <img :src="zGetButtons().no" @click="decide('nope')" />
          <img :src="zGetButtons().maybe" @click="decide('super')" />
          <img :src="zGetButtons().yes" @click="decide('like')" />
          <img :src="zGetButtons().help" @click="decide('help')" />
        </div>
      </v-slide-y-transition>
    </v-card>
  </div>
</template>

<script>
import source from "@/assets/showroom.json";

import VueTinder from "vue-tinder";

import yes from "@/assets/showroom/yes.png";
import no from "@/assets/showroom/no.png";
import maybe from "@/assets/showroom/maybe.png";
import retry from "@/assets/showroom/retry.png";
import help from "@/assets/showroom/help.png";
import yesOutline from "@/assets/showroom/yes-outline.png";
import noOutline from "@/assets/showroom/no-outline.png";
import maybeOutline from "@/assets/showroom/maybe-outline.png";
import retryOutline from "@/assets/showroom/retry-outline.png";
import helpOutline from "@/assets/showroom/help-outline.png";
import yesEmoji from "@/assets/showroom/yes-emoji.png";
import noEmoji from "@/assets/showroom/no-emoji.png";
import maybeEmoji from "@/assets/showroom/maybe-emoji.png";

import yesTxt from "@/assets/showroom/yes-txt.png";
import noTxt from "@/assets/showroom/no-txt.png";
import maybeTxt from "@/assets/showroom/maybe-txt.png";
import retryTxt from "@/assets/showroom/retry-txt.png";

export default {
  data() {
    return {
      yes: yes,
      no: no,
      maybe: maybe,
      retry: retry,
      help: help,
      yesOutline: yesOutline,
      noOutline: noOutline,
      maybeOutline: maybeOutline,
      retryOutline: retryOutline,
      helpOutline: helpOutline,
      yesEmoji: yesEmoji,
      noEmoji: noEmoji,
      maybeEmoji: maybeEmoji,
      yesTxt: yesTxt,
      noTxt: noTxt,
      maybeTxt: maybeTxt,
      retryTxt: retryTxt,
      URL: "https://api.tissini.app/",
      products: [],
      offset: 0,
      history: [],
      buttons: "solid",
      background: false,
      title: "top",
      productOut: true,
    };
  },
  created() {
    this.getProducts();
  },
  components: {
    VueTinder,
  },
  methods: {
    getProducts: function (count = 5) {
      this.products = [];
      try {
        let list = [];
        let newSource = source.filter((element) => Boolean(element.active));

        for (let i = 0; i < newSource.length; i++) {
          let obj = {
            ...newSource[this.offset],
            id: this.offset,
            image: `${this.URL}/img/showroom/${this.getTextImageUrl(
              newSource[this.offset]
            )}`,
            isProduct: true,
          };
          list.push(obj);
          this.offset++;
        }

        list.push({ id: count + 1, isProduct: false });
        this.products = this.products.concat(list);
      } catch (err) {
        err;
      }
    },
    getTextImageUrl: function ({ name }) {
      return name.toLowerCase().replace(" ", "_") + ".jpg";
    },
    decide: function (choice) {
      if (choice === "rewind") {
        if (this.history.length) {
          this.$refs.showroom.rewind([this.history.pop()]);
        }
      } else if (choice === "help") {
        window.open("https://shanlh.github.io/vue-tinder");
      } else {
        this.$refs.showroom.decide(choice);
      }
    },
    onSubmit({ item }) {
      this.history.push(item);
      this.productOut = this.products.length > 1;

      if (this.products.length == 0) this.goToCatalog();
    },
    zGetButtons: function () {
      let buttons = {
        solid: {
          maybe: this.maybe,
          no: this.no,
          yes: this.yes,
          help: this.help,
          retry: this.retry,
        },
        outline: {
          maybe: this.maybeOutline,
          no: this.noOutline,
          yes: this.yesOutline,
          help: this.helpOutline,
          retry: this.retryOutline,
        },
        emojis: {
          maybe: this.maybeEmoji,
          no: this.noEmoji,
          yes: this.yesEmoji,
          help: this.help,
          retry: this.retry,
        },
      };

      return buttons[this.buttons] || buttons.solid;
    },
    goToCatalog: function () {
      this.$router.push("/categorias", () => {});
    },
  },
};
</script>

<style>
#app .vue-tinder {
  position: absolute;
  margin: auto;
  z-index: 1;
  left: 0;
  right: 0;
  top: 5px;
  width: 100%;
  height: 100%;
  min-width: 300px;
  max-width: 350px;
}

.nope-pointer,
.like-pointer {
  position: absolute;
  z-index: 1;
  top: 30px;
  width: 96px;
  height: 96px;
}

.nope-pointer {
  right: 10px;
}

.like-pointer {
  left: 10px;
}

.super-pointer {
  position: absolute;
  z-index: 1;
  bottom: 50px;
  left: 80px;
  right: 0;
  margin: auto;
  width: 112px;
  height: 100px;
}

.rewind-pointer {
  position: absolute;
  z-index: 1;
  top: 30px;
  right: 10px;
  width: 96px;
  height: 96px;
}

.btns {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 400px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;
  max-width: 355px;
}
.btns img {
  margin-right: 12px;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.btns img:nth-child(2n + 1) {
  width: 54px;
}

.btns img:nth-child(2n) {
  width: 54px;
}

.btns img:nth-last-child(1) {
  margin-right: 0;
}

.pic {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}
.bg-card {
  color: #fff;
  background: -webkit-linear-gradient(150deg, #d9a94c 66%, #eae2c0 66%);
  background: -o-linear-gradient(150deg, #d9a94c 66%, #eae2c0 66%);
  background: -moz-linear-gradient(150deg, #d9a94c 66%, #eae2c0 66%);
  background: linear-gradient(150deg, #d9a94c 66%, #eae2c0 66%);
}

.item-name {
  position: relative;
  padding: 10px;
  display: flex;
  flex-direction: column;
  font-family: "walkway_black";
}
.item-name .item-first {
  font-size: 1.8em;
  font-weight: 500;
  padding: 0px;
  font-family: "Roboto";
  position: relative;
  top: 160px;
  color: #f06292;
  -webkit-text-stroke: 0.5px rgb(255, 98, 192);
}
.item-name .item-second {
  position: relative;
  top: 160px;
  font-size: 2.8em;
  padding: 0px;
  color: #f06292;
  font-family: "Roboto";
  -webkit-text-stroke: 0.5px rgb(255, 98, 192);
}
.item-name .item-price {
  position: relative;
  top: 160px;
  font-size: 18px;
  padding: 0px;
  font-family: "Roboto", sans-serif;
  color: #f06292;
  font-weight: bolder;
  -webkit-text-stroke: 0.5px rgb(255, 98, 192);
}
</style>
