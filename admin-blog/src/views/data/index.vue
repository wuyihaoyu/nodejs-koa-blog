<template>
<div>
  <hr>
  <div class="datetime">
    <datetime :styleObj="{}"></datetime>
    <div class="msg"><span><h4>你已经发表了<i> {{msgnum}} </i>篇文章，总浏览量为<i> {{seenum}} </i>次。</h4></span></div>
  </div>
  <hr>
     <div id="main" style="width: 700px;height:400px;margin:0 auto"></div>
  <hr>
  <div id="main2" style="width: 1000px;height:400px;margin:0 auto"></div>
  <hr>
</div>
</template>

<script>
import * as echarts from 'echarts';

import { list } from '@/api/article';

import datetime from './time.vue';

// import { list as getCategoryList } from '@/api/category'
// 绘制图表
export default {
  
  name: 'datacount',
  components: {
    datetime
  },
  data() {
    return {
       categoryList: [],
       list:[],
       names:[],
       num:[],
       browse:[],
       browsenum:[],
       browsetitle:[],
       msgnum:0,
       seenum:0,
      searchForm: {
        id: '',
        title: '',
        status: '',
        page: 1,
        category_id: ''
      }

    }
  },

  created(){
    this.getCategoryList()
  },
  methods:{
     async getCategoryList() {
      try {
        const res2 = await list(this.searchForm)
        this.list = res2.data.data
          
         this.Separatedata()
         this.showChart()
        
         this.getbrowse()
         this.showdata()


      } catch (err) {
        console.log(err)
      } finally {
        console.log('没问题！')
      }
    },
    Separatedata(){
      let titleList = this.list.map(item => {
      return item.category_info.name  })
      for(var i in this.getRepeatNum(titleList)){
              this.num.push(this.getRepeatNum(titleList)[i])
              this.msgnum+=this.getRepeatNum(titleList)[i]
              this.names.push(i)
          }
    },

    getRepeatNum(titleList){ 
        var obj = {}; 
        for(var i= 0, l = titleList.length; i< l; i++){ 
            var item = titleList[i]; 
            obj[item] = (obj[item] +1 ) || 1; 
        } 
        return obj; 
    },

    getbrowse(){
        for(var i=0;i<this.list.length;i++){
          //  this.browsenum.push(this.list[i].browse)
          //  this.browsetitle.push(this.list[i].title)
          this.seenum+=this.list[i].browse
           this.browse.push({value:this.list[i].browse,name:this.list[i].title})
        }
        // console.log(this.browse)
        // console.log(this.browsetitle)
    },

    showChart(){
          var myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
          var option = {
            title: {
              text: '文章--类型数量统计'
            },
            tooltip: {},
            legend: {
              data: ['销量']
            },
            xAxis: {
              data:this.names
            },
            yAxis: {},
            series: [
              {
                name: '文章数量',
                type: 'bar',
                data: this.num
              }
            ]
          };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    showdata(){
      var chartDom = document.getElementById('main2');
var myChart = echarts.init(chartDom);
var option;

option = {
  title: {
    text: 'Website--文章访问量统计 ',
    subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '访问量:',
      type: 'pie',
      radius: '70%',
      data: this.browse,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

option && myChart.setOption(option);

      
    }

  }
}
</script>

<style scoped lang="scss">
.datetime{
  width: 100%;
  height: 20%;
  display: flex;
}
.msg{
  display: flex;
  align-items: center;
}


</style>
