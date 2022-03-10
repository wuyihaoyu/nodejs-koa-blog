<template>
<div>
  <div id="main" style="width: 600px;height:400px;"></div>
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
      
        // const res = await getCategoryList()
        // this.categoryList = res.data.data
          
         this.Separatedata()
         this.showChart()


      } catch (err) {
        console.log(err)
      } finally {
        console.log('没问题！')
      }
    },
    Separatedata(){
      let titleList = this.list.map(item => {
      return item.category_info.name
        })
      console.log(this.getRepeatNum(titleList))
      // {生活: 4, 前端JavaScript: 2}
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

    showChart(){
          var myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
          var option = {
            title: {
              text: '文章类型数量统计'
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
    }

  }
}
</script>

<style scoped lang="scss">


</style>
