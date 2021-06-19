<template>
  <div class="header">
    <div>
      <el-menu
        :default-active="$route.name"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleMenu"
      >
        <el-menu-item index="Home">首页</el-menu-item>
        <el-menu-item index="Contact">联系我们</el-menu-item>
      </el-menu>
    </div>
    <div class="profile">
      <Avart v-show="hasLogin"></Avart>
      <el-menu v-show="!hasLogin" class="el-menu-demo" mode="horizontal" @select="handleMenu">
        <el-menu-item index="Login">登录</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
<script>
import Avart from "@/components/Avart";
import { getToken } from "@/utils/auth";
export default {
  components: {
    Avart,
  },
  data() {
    return { hasLogin: false };
  },
  created() {
    this.hasLogin = getToken() || false;
    console.log(this.hasLogin);
  },
  methods: {
    handleMenu(name) {
      this.$router.push({ name });
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  height: 64px;
  display: flex;
  align-items: center;
  position: relative;
  .logo {
    height: 40px;
    margin: 0 10px;
    img {
      height: inherit;
    }
  }
  .profile {
    position: absolute;
    right: 0px;
  }
}
</style>