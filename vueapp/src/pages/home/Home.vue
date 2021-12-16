<template>
  <div>
    <el-row style="background: white; margin-bottom: 20px">
      <el-col :span="24">
        <el-card class="box-card">
          <div style="display: flex; justify-content: start">
            <el-icon :size="40" style="padding: 20px">
              <avatar />
            </el-icon>
            <div style="width: 80%; padding: 5px 0px">
              <p
                style="
                  margin: 12px 0px;
                  font-size: 20px;
                  font-weight: 700;
                  color: #3c4a54;
                "
              >
                呜啦啦啦啦啦
              </p>
              <p style="font-size: 14px; color: #808695">呜啦啦啦啦啦</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card class="box-card" style="background: white">
          <div id="DayWork" style="height: 250px; width: 100%"></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" style="background: white">
          <div id="WeekWork" style="height: 250px; width: 100%"></div></el-card
      ></el-col>
      <el-col :span="12">
        <el-card class="box-card" style="background: white; height: 290px">
          <p
            style="
              text-align: center;
              font-size: 20px;
              font-weight: 700;
              color: rgb(60, 74, 84);
              margin: 0 0 16px 0;
            "
          >
            版本说明
          </p>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="datea" label="名称" width="180" />
            <el-table-column prop="versiona" label="版本" width="180" />
            <el-table-column prop="dateb" label="名称" width="180" />
            <el-table-column prop="versionb" label="版本" width="180" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="18">
        <el-card class="box-card" style="background: white">
          <div id="weekWeather" style="height: 500px; width: 100%"></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" style="background: white; height: 290px">
          <div>1</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import req from "@/request";
import { onMounted, onUpdated, onUnmounted, getCurrentInstance } from "vue";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      tableData: [
        {
          datea: "vue",
          versiona: "^3.2.20",
          dateb: "vue-router",
          versionb: "^4.0.11",
        },
        {
          datea: "element-plus",
          versiona: "^1.1.0-beta.19",
          dateb: "@element-plus/icons",
          versionb: "0.0.11",
        },
        {
          datea: "echarts",
          versiona: "^5.2.1",
          dateb: "vuex",
          versionb: "^4.0.2",
        },
      ],
    };
  },
  setup() {
    const TODAY_WORK = {
      title: {
        text: "今日任务",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        bottom: "bottom",
      },
      series: [
        {
          name: "今日任务",
          type: "pie",
          radius: "50%",
          data: [
            { value: 1048, name: "改 BUG" },
            { value: 735, name: "写 BUG" },
            { value: 580, name: "功能开发" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    const WEEK_WORK = {
      title: {
        text: "周统计图",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["改 BUG", "写 BUG", "功能开发"],
        bottom: "bottom",
      },
      grid: {
        left: "2%",
        right: "3%",
        bottom: "30px",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "改 BUG",
          type: "line",
          stack: "Total",
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "写 BUG",
          type: "line",
          stack: "Total",
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "功能开发",
          type: "line",
          stack: "Total",
          data: [150, 232, 201, 154, 190, 330, 410],
        },
      ],
    };

    // const instance = getCurrentInstance();
    const WEATHER_URL =
      "https://www.tianqiapi.com/api?version=v9&appid=78954942&appsecret=Vp7KCOxw&city=%E8%A5%BF%E5%AE%89";
    req(WEATHER_URL, {}, "GET").then((data) => {
      let day = [],
        topTem = [],
        bottomTem = [],
        air = [];
      for (let item of data.data) {
        day.push(item.day);
        topTem.push(item.tem1);
        bottomTem.push(item.tem2);
        air.push(item.air);
      }
      const WEEK_WEATHER = {
        title: {
          text: "未来 7 天天气预报",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ["最低温度", "最高温度", "空气质量"],
        },
        xAxis: [
          {
            type: "category",
            data: day,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "温度",
            min: -10,
            max: 20,
            interval: 2.5,
            axisLabel: {
              formatter: "{value} °C",
            },
          },
          {
            type: "value",
            name: "空气质量",
            min: 30,
            max: 90,
            interval: 5,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: "最低温度",
            type: "bar",
            data: bottomTem,
          },
          {
            name: "最高温度",
            type: "bar",
            data: topTem,
          },
          {
            name: "空气质量",
            type: "line",
            yAxisIndex: 1,
            data: air,
          },
        ],
      };
      var weekWeatherChart = echarts.init(
        document.getElementById("weekWeather")
      );
      weekWeatherChart.setOption(WEEK_WEATHER);
    });
    onMounted(() => {
      {
        // 基于准备好的dom，初始化echarts实例
        var dayChart = echarts.init(document.getElementById("DayWork"));
        var weekChart = echarts.init(document.getElementById("WeekWork"));
        // 绘制图表
        dayChart.setOption(TODAY_WORK);
        weekChart.setOption(WEEK_WORK);
        return {};
      }
    });
  },
};
</script>

<style lang="scss">
</style>