<template>
  <div class="main-normal-box">
    <div v-if="userInfo">
      <el-drawer
        v-model="drawer"
        title="添加工作安排"
        :direction="'ttb'"
        :size="200"
      >
        <el-form
          ref="formRef"
          :model="form"
          label-width="70px"
          style="padding: 0px 10px 0 15%"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="事件名称">
                <el-input
                  v-model="form.name"
                  placeholder="必填"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="6">
              <el-form-item label="类型">
                <el-select
                  v-model="form.type"
                  class="m-2"
                  size="large"
                  @change="selectChange('type', $event)"
                >
                  <el-option
                    v-for="(value, key) of types"
                    :key="key"
                    :label="value"
                    :value="key"
                  >
                  </el-option>
                </el-select> </el-form-item
            ></el-col>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select
                  v-model="form.state"
                  class="m-2"
                  size="large"
                  @change="selectChange('state', $event)"
                >
                  <el-option
                    v-for="(value, key) of states"
                    v-show="key !== '3'"
                    :key="key"
                    :label="value"
                    :value="key"
                  >
                  </el-option>
                </el-select> </el-form-item
            ></el-col>
            <el-col :span="6"
              ><el-button type="primary" round @click="submitWork"
                >提交</el-button
              ></el-col
            >
          </el-row>
        </el-form>
      </el-drawer>
      <el-row :gutter="20">
        <el-col :span="12">
          <p
            style="
              text-align: center;
              font-weight: bold;
              font-size: 24px;
              line-height: 4rem;
              padding-left: 35%;
            "
          >
            待办事项
            <el-button circle style="width: 42px" @click="drawer = true"
              ><el-icon><plus /></el-icon
            ></el-button>
            <el-date-picker
              v-model="viewDay"
              style="margin-left: 10px"
              @change="getWorkList($event)"
              type="date"
              placeholder="Pick a day"
              :shortcuts="shortcuts"
            >
            </el-date-picker>
          </p>

          <el-table :data="todoData" style="width: 100%" border>
            <el-table-column type="index" width="50" align="center" />
            <el-table-column
              prop="name"
              width="200"
              label="事件名称"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="type" label="类型">
              <template #default="scope">
                <div>{{ types[scope.row.type] }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="状态">
              <template #default="scope">
                <div>{{ states[scope.row.state] }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="170" align="center">
              <template #default="scope">
                <el-button
                  v-if="scope.row.state !== '1'"
                  type="primary"
                  size="small"
                  plain
                  @click="handleClick('1', scope.row.id)"
                  >开始</el-button
                >
                <el-button
                  v-else
                  type="primary"
                  size="small"
                  plain
                  @click="handleClick('2', scope.row.id)"
                  >暂停</el-button
                >
                <el-button
                  type="success"
                  plain
                  size="small"
                  @click="handleClick('3', scope.row.id)"
                  >完成</el-button
                >
                <el-popconfirm
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  icon-color="red"
                  title="是否删除?"
                  @confirm="handleClick('4', scope.row.id)"
                >
                  <template #reference>
                    <el-button type="danger" size="small" plain>删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <el-col :span="12">
          <p
            style="
              text-align: center;
              font-weight: bold;
              font-size: 24px;
              line-height: 4rem;
            "
          >
            完成事项
          </p>
          <el-table
            :data="finshData"
            border
            style="width: 100%"
            :row-style="{ height: '57px' }"
          >
            <el-table-column type="index" width="50" align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="事件名称"
              width="200"
              :show-overflow-tooltip="true"
            />

            <el-table-column
              prop="startTime"
              label="开始时间"
              class-name="col-time"
              style="word-break: break-word"
            />
            <el-table-column
              prop="endTime"
              label="结束时间"
              style="word-break: break-word"
            />
            <el-table-column label="详情" width="70" align="center">
              <template #default="scope">
                <el-dropdown>
                  <el-icon><more /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        >总耗时：{{ scope.row.takeUpTime }} 分</el-dropdown-item
                      >
                      <el-dropdown-item>
                        类型：{{ types[scope.row.type] }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        >创建时间：{{ scope.row.createTime }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template></el-table-column
            >
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div v-else style="display: flex; justify-content: center">
      <div>
        <el-image
          key="CycleProcess"
          :src="require('@/assets/bqb/jdxq.jpg')"
          :preview-src-list="[require('@/assets/bqb/jdxq.jpg')]"
        ></el-image>
        <p
          style="
            text-align: center;
            font-weight: bold;
            font-size: 24px;
            margin-bottom: 10px;
          "
        >
          你好像没登录诶
        </p>
        <p
          style="
            font-size: 24px;
            font-weight: bold;
            color: #65659d;
            cursor: pointer;
            text-align: center;
          "
          @click="accountEdit"
        >
          登录/注册
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue-demi";
import { useStore } from "vuex";
import { computed, watch } from "vue";
import { ElNotification } from "element-plus";
import { changeTime, timeDiff } from "@/utils/index";
import req from "@/request";
import { onMounted } from "vue";
export default {
  name: "Workbench",
  components: {},
  setup() {
    const store = useStore(); // 获取store 实例
    const userInfo = computed(() => store.state.userInfo);
    watch(userInfo, () => {
      if (userInfo.value) {
        getWorkList(new Date());
      }
    });
    const states = {
      0: "未开始",
      1: "进行中",
      2: "暂停",
      3: "已完成",
    };
    const types = {
      0: "内部管理",
      1: "部门协同会",
      2: "其他会议",
      3: "需求讨论",
      4: "方案设计",
      5: "编码，测试",
      6: "冒烟问题处理",
      7: "发布脚本",
      8: "系统升级",
      9: "基础资源维护",
      10: "内部沟通",
      11: "岗位说明书",
      12: "内部系统",
    };

    const shortcuts = [
      {
        text: "今天",
        value: new Date(),
      },
      {
        text: "昨天",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          return date;
        },
      },
      {
        text: "前天",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
          return date;
        },
      },
      {
        text: "一周前",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          return date;
        },
      },
    ];

    // 待完成事项
    const todoData = ref([]);
    // 已完成事项
    const finshData = ref([]);
    // 查看某一天未完成事项
    const viewDay = ref(new Date());
    const drawer = ref(false);

    const formRef = ref("");
    const form = reactive({
      name: "",
      state: "0",
      type: "",
    });

    const accountEdit = () => {
      store.dispatch("changeAccount", true);
    };

    /**
     * 编辑工作任务
     */
    const selectChange = (field, event) => {};

    /**
     * 添加工作任务
     */
    const submitWork = () => {
      if (!form.name) {
        ElNotification({
          title: "事件名称都不写，你是想干啥！",
          type: "warning",
        });
        return;
      }

      const nowDate = changeTime("YYMMDDhhmmss", new Date());
      const workEditObj = {
        name: form.name,
        state: form.state,
        type: form.type,
        startTime: form.state === 1 ? nowDate : "",
        endTime: "",
        createTime: nowDate,
        takeUpTime: "",
        createBy: userInfo.value.id,
      };

      req("addWork", workEditObj, "POST").then((res) => {
        if (res.code === 1) {
          // 添加后还原表单数据
          form.name = "";
          form.state = "0";
          form.type = "";

          workEditObj["id"] = res.data.id;
          todoData.value.push(workEditObj);
          ElNotification({
            title: "添加成功",
            type: "success",
          });
        }
      });
    };

    /**
     * 删除工作任务
     */
    const deleteWork = (id) => {
      req("deleteWork", { id }, "POST").then((data) => {});
    };

    /**
     * 更改工作任务信息
     */
    const changeWork = (item) => {
      req("changeWork", item, "POST").then((data) => {});
    };

    /**
     * 工作任务状态操作 开始/暂停/结束/删除
     */
    const handleClick = (event, id) => {
      for (let index in todoData.value) {
        const item = todoData.value[index];
        if (item.id === id) {
          if (event === "4") {
            // 删除
            deleteWork(id);
            todoData.value.splice(index, 1);
          } else {
            item.state = event;
            const nowDate = changeTime("YYMMDDhhmmss", new Date());
            if (event === "3") {
              // 完成，该数据移至完成队列
              item.endTime = nowDate;
              item.takeUpTime = timeDiff(
                new Date(item.startTime.replace(/-/g, "/")),
                new Date()
              ).mDiff;
              finshData.value.push(item);
              todoData.value.splice(index, 1);
            } else if (event === "1" && !item.startTime) {
              // 开始
              item.startTime = nowDate;
            }
            changeWork(item);
          }
          continue;
        }
      }
    };
    /**
     * 获取某天的工作任务
     */
    const getWorkList = (date) => {
      const obj = {
        createTime: changeTime("YYMMDDhhmmss", date).split(" ")[0],
        createBy: userInfo.value.id,
      };
      req("getWork", obj, "POST").then((res) => {
        finshData.value = [];
        todoData.value = [];
        for (let item of res.data.workList) {
          if (item.state === "3") {
            // 已完成队列
            finshData.value.push(item);
          } else {
            // 待处理队列
            todoData.value.push(item);
          }
        }
      });
    };

    onMounted(() => {
      {
        if (userInfo.value) {
          getWorkList(new Date());
        }
      }
    });

    return {
      todoData,
      states,
      types,
      finshData,
      drawer,
      formRef,
      form,
      viewDay,
      shortcuts,
      userInfo,
      selectChange,
      submitWork,
      handleClick,
      getWorkList,
      accountEdit,
    };
  },
};
</script>

<style>
</style>