<template>
  <div class="container">
    <div class="mem-container" ref="mem-container">
      <div class="mem-wrapper" ref="mem-wrapper" @click="addElement">
        <img v-if='memeEditor.image.length>0' :src="memeEditor.image[1]">
        <img v-else-if="userImageIsUsed" :src="userImage">
        <span v-else class="instruction">
          Загрузите свою картинку или выберите из приведенных ниже
        </span>
        <div v-for="(te, i) in memeEditor.textElems"
             v-on-clickaway="closePanel"
             :id="'te-'+i" :style="{ top: te.top+'px', left: te.left+'px' }"
             class="text-element"
             @mousedown.prevent="changePlace(i, $event)"
             @dblclick="preStartEditing(i)"
             @click.stop
             :ref="'te-'+i"
             @keypress.enter.prevent="endEditing(i)"
             @keyup.esc.prevent="endEditing(i)"
            >
          <textarea @focus="closePanel();te.showPanel=true;"
                    rows="1"
                    :ref="'ta-'+i"
                    :cols="te.text.length"
                    wrap="off"
                    :style="{ fontWeight: te.fontWeight, fontSize: te.fontSize+'px', color: te.color }"
                    v-model="te.text"
                    :disabled="!te.editing"
                    type="text">
          </textarea>
          <div @mousedown.stop=""
               :class="{ shown: te.showPanel }"
               class="panel">
            <span class="panel-text">Размер: </span>
            <input v-model="te.fontSize" type="number">
            <span class="panel-text">Цвет: </span>
            <Swatches @close="focusTo(i)" :colors="'text-advanced'" class="cpicker" v-model="te.color"></Swatches>
            <span class="panel-text">Толщина: </span>
            <select @change="focusTo(i)" v-model="te.fontWeight">
              <option value="500">1</option>
              <option value="600">2</option>
              <option value="1000">3</option>
            </select>
          </div>
        </div>
      </div>
      <div class="side-panel">
        <label class="button" title="Загрузить свою картинку">
          <input @change="useUserImage" type="file">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADuSURBVFiF7ZZdCsIwEISnokfQFLygoBfzNEKtFbzM+NAKaZqN6XalUjoQyMNm9svmF1j1vyIVrQJ4mBOAAF8Aj4YAKuDaoBJqgKcRhBpgD/BusBxaAKCdOeuJEJP2QNhqaVSRNgSAIhETixdTRX22eeY5kkDTYBs7AJ2WCMArwBvA3Q8BWAJ0Cc+s5N+SCMeQDuBjeNNJUGOPc3IgnXfBsANxMpQpQC9507WwH3kDTAB6yT+zLru+X41mCGEDcPGMvXXulT6EOhsCAABP8ec13Hx0bazkowbQKu2zxJtwBRinjP+AxUaUNXsFVs2uN8jtLtemR0YYAAAAAElFTkSuQmCC">
        </label>
        <label @click="createMem" class="button" title="Сохранить">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABfAAAAXwBsrqMZwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACOSURBVEiJ7ZQxDoMwEATnCalipFDwPCT4qdskBRQ8ZSk4IUt2UCSb7rZd35xvfTK4XP9LATTeCf+ABJpaw1+gxeAR9HB4LVwj6HnhB9DX4O/rs3nxnBSGgt9VwOEYVdEAyxHF6fWgtUHmWZMeNIC2hg+qYBHIIqmJ5WeTdJI7VhGSL6DlzbMmXXmjXC7TDpCLfsKVHbykAAAAAElFTkSuQmCC">
        </label>
      </div>
    </div>
    <carousel class="slider" :per-page="6" :paginationEnabled="false">
      <slide v-for="(i, k) in images" :key="k">
        <img @click="changeBGImage(k)" :src="i" alt="">
      </slide>
    </carousel>
  </div>
</template>

<script>
  import {Carousel, Slide} from 'vue-carousel';
  import axios from 'axios';
  import Swatches from 'vue-swatches';
  import { directive as onClickaway } from 'vue-clickaway';

  export default {
    name: "CreateMem",
    directives: {
      onClickaway: onClickaway,
    },
    components: {
      Carousel,
      Slide,
      Swatches,
    },
    data() {
      return {
        userImageIsUsed: false,
        userImage: null,
        images: {},
        dragging: false,
        editingEl: -1,
        memeEditor: {
          image: [],
          textElems: []
        }
      }
    },
    methods: {
      // Operation panel methods
      useUserImage(e) {
        this.preChangeImage();
        let reader = new FileReader();
        reader.onload = (event) => {
          console.log(event.target.result);
          this.userImage = event.target.result;
          this.userImageIsUsed = true;
        }
        reader.readAsDataURL(e.target.files[0]);
      },

      debug(text) {
        console.log(text);
      },
      changePlace(i, event){
        this.dragging = true;
        let mouseCurPlaceX = event.pageX,
            mouseCurPlaceY = event.pageY,
            thisEl = this.memeEditor.textElems[i],
            xRight = this.$refs['mem-wrapper'].offsetWidth-this.$refs['te-'+i][0].offsetWidth,
            yBottom = this.$refs['mem-wrapper'].offsetHeight-this.$refs['te-'+i][0].offsetHeight;
        document.onmouseup = () => {
          this.stopChangePlace(i);
        };
        document.onmousemove = (e) => {
          let mYd = mouseCurPlaceY-e.pageY,
              mXd = mouseCurPlaceX-e.pageX;

          if(thisEl.top >= 0 && thisEl.top <= yBottom) {
            thisEl.top-= mYd;
          } else if(thisEl.top < 0) {
            thisEl.top = 0;
          } else {
            thisEl.top = yBottom;
          }

          if(thisEl.left >= 0 && thisEl.left <= xRight) {
            thisEl.left-= mXd;
          } else if(thisEl.left < 0) {
            thisEl.left = 0;
          } else {
            thisEl.left = xRight;
          }
          mouseCurPlaceY = e.pageY;
          mouseCurPlaceX = e.pageX;
        }
      },
      stopChangePlace(i) {
        this.dragging = false;
        document.onmousemove = null;
      },
      changeBGImage(pk) {
        this.userImageIsUsed = false;
        this.preChangeImage();
        this.memeEditor.image.push(pk);
        this.memeEditor.image.push(this.images[pk]);
      },
      preChangeImage() {
        this.memeEditor.image = [];
        this.memeEditor.textElems = [];
        this.editingEl = -1;
      },
      addElement(event) {
        if(this.memeEditor.image.length > 0 || this.userImage) {
          let memWrapper = this.$refs['mem-wrapper'],
            memContainer = this.$refs['mem-container'],
            top = event.pageY - memWrapper.offsetTop-memContainer.offsetTop,
            left = event.pageX - memWrapper.offsetLeft-memContainer.offsetLeft,
            newTE = {
              text: "",
              fontSize: 24,
              top: top,
              left: left,
              color: "#000000",
              showPanel: false,
              fontWeight: 500,
              editing: false
            };
          newTE.top-=newTE.fontSize-8;
          this.memeEditor.textElems.push(newTE);
          this.startEditing(this.memeEditor.textElems.length-1);
        }
      },
      focusTo(i) {
        document.querySelector('#te-'+i+'>textarea').focus();
      },
      closePanel() {
        let els = this.memeEditor.textElems;
        for(var i = 0; i < els.length; i++) {
          els[i].showPanel = false;
        }
      },
      preStartEditing(i) {
        if(!this.memeEditor.textElems[i].editing) {
          this.startEditing(i);
        }
      },
      endEditing(i) {
        if(i>=0) {
          let el = this.memeEditor.textElems[i];
          if(el.text.length == 0) {
            this.closePanel();
            this.memeEditor.textElems.splice(i, 1);
            return true;
          } else {
            document.querySelector('#te-'+i+'>textarea').blur();
            this.memeEditor.textElems[i].editing = false;
            this.closePanel();
          }
        }
      },
      startEditing(i) {
        if(!this.endEditing(this.editingEl) || this.memeEditor.textElems.length != i ){
          this.editingEl = i;
        }
        this.memeEditor.textElems[this.editingEl].editing = true;
        setTimeout(() => {
          this.focusTo(this.editingEl);
          this.memeEditor.textElems[this.editingEl].showPanel = true;
        }, 100);
      },
      createMem() {
        let data = this.memeEditor;
        data['current-width'] = this.$refs['mem-wrapper'].clientWidth;
        axios.post('http://localhost:8000/create-mem', data)
          .then((res)=>{
            console.log(res.data);
          })
      }
    },
    mounted() {
      axios.get('http://localhost:8000/all-images').then((res) => {
        this.images = res.data;
      });
    },
  }
</script>

<style lang="sass">
  .container
    height: 100%
    box-sizing: border-box
    padding-top: 60px
  .slider
    height: 15%
    *
      height: 100% !important

  .VueCarousel-slide img
    cursor: pointer

  .mem-container
    height: 85%
    display: flex
    align-items: center
    justify-content: center
    position: relative
    .side-panel
      position: absolute
      right: 20px
      padding: 5px
      width: 40px
      top: 20px
      bottom: 20px
      background-color: blue
      color: white
      .button
        background-color: white
        display: block
        border-radius: 50%
        padding: 4px
        cursor: pointer
        margin-bottom: 5px
        img
          display: block
          width: 100%
          height: auto
        input[type=file]
          position: absolute
          visibility: hidden

  .mem-wrapper
    height: 90%
    display: inline-flex
    align-items: center
    cursor: text
    position: relative
    -webkit-user-select: none !important
    -moz-user-select: none !important
    -ms-user-select: none !important
    user-select: none !important
    img
      height: 100%
    .text-element
      position: absolute
      z-index: 1000

  .mem-wrapper
    .text-element > textarea
      width: 100%
      padding: 0
      border: none
      outline: none
      background: transparent
      resize: none
      overflow: hidden
      font-family: "Custom SS"
      &[disabled=disabled]
        cursor: pointer
    .panel
      position: absolute
      top: -27px
      left: 0
      background-color: blue
      border-radius: 3px
      padding: 3px
      display: flex
      visibility: hidden
      &.shown
        visibility: visible
      > *
        display: inline-block
        color: white
      input, select
        width: 30px
        padding: 0
        color: black
        background-color: white
      span
        margin-right: 3px
        margin-left: 3px
      .vue-swatches__container
        position: absolute
        right: 0
        left: unset !important
      .vue-swatches__trigger
        height: 18px !important
        width: 18px !important
</style>
