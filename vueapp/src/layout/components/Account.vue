<template>
  <el-drawer
    v-model="drawer"
    title="登录/注册"
    :direction="'rtl'"
    @closed="onCancel"
  >
    <div>
      <el-row style="justify-content: center; margin-bottom: 22px">
        <el-button
          :type="mode === 1 ? 'primary' : 'default'"
          @click="changeMode(1)"
          style="width: 30%; font-size: 18px"
          >登录</el-button
        >
        <el-button
          :type="mode !== 1 ? 'primary' : 'default'"
          @click="changeMode(0)"
          style="width: 30%; font-size: 18px"
          >注册</el-button
        >
      </el-row>
    </div>
    <el-form ref="formRef" :model="form" label-width="70px">
      <el-form-item label="账号" v-if="mode === 1">
        <el-input v-model="loginform.account" placeholder="必填"></el-input>
      </el-form-item>
      <el-form-item label="密码" v-if="mode === 1">
        <el-input
          v-model="loginform.password"
          type="password"
          placeholder="必填"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="账号" v-if="mode !== 1">
        <el-input
          v-model="form.account"
          placeholder="必填"
          :autocomplete="'new-password'"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" v-if="mode !== 1">
        <el-input
          v-model="form.password"
          :autocomplete="'new-password'"
          type="password"
          placeholder="必填"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="密码验证" v-if="mode !== 1">
        <el-input
          v-model="form.passwordCheck"
          type="password"
          placeholder="再次输入密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" v-if="mode !== 1">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="性别" v-if="mode !== 1">
        <el-radio v-model="form.sex" label="男" size="large">男</el-radio>
        <el-radio v-model="form.sex" label="女" size="large">女</el-radio>
      </el-form-item>
      <el-form-item label="生日" v-if="mode !== 1">
        <el-date-picker
          v-model="form.birth"
          type="date"
          value-format="YYYY-MM-DD"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import { useStore } from "vuex";
import { reactive, ref, computed } from "vue";
import req from "@/request";
import { ElNotification } from "element-plus";
export default {
  name: "Account",
  components: {},
  setup() {
    const store = useStore();
    const drawer = computed(() => store.state.accountEdit);
    const formRef = ref("");
    const mode = ref(1);
    const loginform = reactive({
      account: "",
      password: "",
    });
    const form = reactive({
      account: "",
      password: "",
      nickname: "",
      sex: "",
      birth: "",
      passwordCheck: "",
    });

    // 提交
    const onSubmit = () => {
      let obj;
      if (mode.value === 1) {
        if (!loginform.account || !loginform.password) {
          ElNotification({
            title: "账号和密码是必填项",
            type: "warning",
          });
          return;
        }
        obj = {
          account: loginform.account,
          password: loginform.password,
        };
      } else {
        if (!form.account || !form.password) {
          ElNotification({
            title: "账号和密码是必填项",
            type: "warning",
          });
          return;
        }
        if (form.password !== form.passwordCheck) {
          ElNotification({
            title: "两次密码输入不一致",
            type: "warning",
          });
          return;
        }
        obj = {
          account: form.account,
          password: form.password,
          nickname: form.nickname,
          sex: form.sex,
          birth: form.birth,
        };
      }
      req(mode.value !== 1 ? "addUser" : "checkUser", obj, "POST").then(
        (data) => {
          if (data.code === 1) {
            ElNotification({
              title: data.message,
              type: "success",
            });
            store.dispatch("changeUserInfo", data.data);
            onCancel();
          } else {
            ElNotification({
              title: data.message,
              type: "error",
            });
          }
        }
      );
    };

    // 修改全局参数关闭模态框
    const onCancel = () => {
      store.dispatch("changeAccount", false);
    };

    const changeMode = (event) => {
      mode.value = event;
    };
    return {
      drawer,
      formRef,
      form,
      mode,
      loginform,
      onSubmit,
      onCancel,
      changeMode,
    };
  },
};
</script>

<style>
</style>