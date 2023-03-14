　<template>
    <div class="box-card">
    <!-- <el-card class="box-card"> -->
    <div class="box">
      <div class="item div1 shou" @click="on1" >1.RCG480系统毁伤效果评估作战效能指标</div>
      <div class="item div2 shou" @click="on2">2.扩展型对抗系统毁伤效果评估指标体系</div>
      <div class="item div3 shou" @click="on3">3.RCL673系统毁伤效果评估作战效能指标</div>
      <div class="item div4 shou" @click="on4">4. 作战适用性指标体系</div>
    </div>
    <!-- </el-card> -->
</div>
  </template>
  <script>
  export default {
  
  methods: {
    on1:function () {
      this.$router.push({
        path:"../inputExcel/inputQuality",
      })
    },
    on2:function () {
      this.$router.push({
        path:"../inputExcel/input2",
      })
    },
    on3:function () {
      this.$router.push({
        path:"../inputExcel/input3",
      })
    },
    on4:function () {
      this.$router.push({
        path:"../inputExcel/input4",
      })
    },
  },
  }
  </script>
  <style scoped>
  .box {
    width: auto;
    height: auto;
    margin: auto;
    grid-gap: 5px;
    display: grid;
    padding-right: 20px;
    grid-template-columns: 20% 20% 20% 20% 20%;
    grid-template-rows: 35% 35% 35% 35% 35%;
  }
  
  .item {
    border: 1px solid black;
    box-sizing: border-box;
  }
  
  .el-card ::v-deep .el-card__body { 
    padding-top: 2px;
    height: 100%;
    /* background-color: powderblue; */
   }

  .box-card {
    width: auto;
    height: auto;
    margin: 50px 20px 50px 100px;
  }
  
  .div1 {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
    /*(div1从占据从第一条网格线开始，到第三条网格线结束)*/
    line-height: 200px;
    text-align: center;
    background: #84C1FF;
    /* grid-column: 1/3;(这是缩写的形式) */
  }
  
  
  .div3 {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 3;
    grid-row-end: 5;
    /* grid-row: 2/4;(这是缩写的形式) */
    line-height: 200px;
    text-align: center;
    background: rgb(21, 207, 108);
  }
  
  .div2 {
    grid-column-start: 3;
    grid-column-end: 5;
    grid-row-start: 1;
    grid-row-end: 3;
    /*grid-row-start: 2;*/
    grid-row-end: 3;
    line-height: 200px;
    text-align: center;
    background: rgb(252, 134, 0);
  }
  .div4 {
    grid-column-start: 3;
    grid-column-end: 5;
    grid-row-start: 3;
    grid-row-end: 5;
    line-height: 200px;
    text-align: center;
    background: #DCB5FF;
    /* grid-column: 2/4;(这是缩写的形式) */
  }
  
  .shou {
    cursor: pointer;
  }
  </style>
  