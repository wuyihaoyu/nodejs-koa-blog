<template>
<div>
  <div id="main" style="width: 500px;height:400px;margin-bottom:100px"></div>
  <div id="main2" style="width: 1000px;height:400px;"></div>
</div>
</template>

<script>
import * as echarts from 'echarts';

import { list } from '@/api/article'

// import { list as getCategoryList } from '@/api/category'
// 绘制图表
export default {
  
  name: 'datacount',
  data() {
    return {
       categoryList: [],
       list:[],
       names:[],
       num:[],
       browse:[],
       browsenum:[],
       browsetitle:[],
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
    text: 'Website--文章访问量 ',
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
      name: 'Access From',
      type: 'pie',
      radius: '60%',
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


</style>
