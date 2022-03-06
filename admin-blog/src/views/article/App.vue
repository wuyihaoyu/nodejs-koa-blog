<template>
  <div id="shibie">
      <div class="box">
            <div id="preview" v-on:paste="handlePaste">
                <span>将图片按Ctrl+V 粘贴至此处</span>
            </div>
      </div>
      <div id="text" class="box">{{text}}</div>
      <div class="box">
          <input id="write" type="text" v-model="text">
          <div>
              <button v-on:click="uploadPlans">上传文件</button>
              <button v-on:click="clear">重置文字</button>
              <button v-on:click="read">语音读取</button>
          </div>
      </div>
     
  </div>
  
</template>

<script>
import { createWorker, PSM, OEM } from "tesseract.js";
// const path = require("path");
const worker = createWorker({
  workerPath: "/tesseract/tesseract.js/dist/worker.min.js",
  corePath: "/tesseract/tesseract.js-core/tesseract-core.wasm.js",
  langPath: "/tesseract/tesseract-lang",  // TODO：prd环境下会报错
  // logger: (m) => console.log(m),
});

export default {
  name: "app",
  data() {
    return {
      haveInit: false,
      text:'请识别图片文字！',
      file:'',
    };
  },
  created(){
    this.recognize();
  },

  methods: {
     async recognize() {
      if (!this.haveInit) {
        await worker.load();
        await worker.loadLanguage("chi_sim");
        await worker.initialize("chi_sim", OEM.LSTM_ONLY);
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        });
        this.haveInit = true;
      }
    },

    handlePaste(event) {
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;

      if (!items || items.length === 0) {
        alert("当前浏览器不支持本地");
        return;
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        alert("粘贴内容非图片");
        return;
      }
      // 此时file就是我们的剪切板中的图片对象
      // 如果需要预览，可以执行下面代码   preview.
      const reader = new FileReader();
      reader.onload = event => {
        preview.innerHTML = `<img src="${event.target.result}">`;
        // console.log(preview)
      };
      reader.readAsDataURL(file);
      this.file = file;    
    },
    // 上传文件成功后回调
    async uploadPlans() {
      let file = this.file;

      if (!file) {
        alert("请粘贴图片后上传");
        return;
      }else{
          const { data: { text }, } = await worker.recognize(file);
            // console.log(text);
            alert(text);
            this.text=text; 
      }
     },
    clear(){
        document.getElementById("preview").innerHTML="";
        this.text='';
        this.file='';
          },
    read(){
        this.speechInstance = new SpeechSynthesisUtterance(this.text);
        // Object.keys(this.queryParams).forEach(key => {
        //     this.speechInstance[key] = this.queryParams[key];
        // })
        // console.log(this.speechInstance);
        if(this.speechInstance.text.length==0){    
          alert('请输入文本后读取！！')
          return
        }else{
          
          speechSynthesis.speak(this.speechInstance);
          
        }
    }
  },
 
};
</script>

<style>
#shibie {
  display: flex;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
 #preview{
   width: 100%;
   height: 300px;
 }
 #text{
   width: 100%;
 }
 #write{
   width: 80%;
 }
 .box{
  flex: 1;
  border:rgb(252, 212, 212) solid;
 }
</style>
