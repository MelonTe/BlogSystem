import axios from "axios";
import NProgress from "nprogress";

import { ElMessage } from "element-plus";
import { getToken, removeToken } from "@/stores/tokenUtils";

import "nprogress/nprogress.css";

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: "http://112.124.9.51:8080/",
  timeout: 50000,
});

/**
 * 添加请求拦截器
 * @param config - 请求配置对象
 * @returns config - 修改后的请求配置对象
 */
service.interceptors.request.use((config) => {
  NProgress.start(); // 开启进度条

  const token = getToken();

  if (token) {
    config.headers["Authorization"] = token;
  }

  return config;
});

/**
 * 添加响应拦截器
 * @param response - 响应对象
 * @returns 响应数据中的data属性数据或拒绝请求
 */
service.interceptors.response.use(
  (response) => {
    NProgress.done(); // 关闭进度条
    if (response.data.code !== 200) {
    } else {
      return response.data.data; // 返回成功响应数据中的data属性数据
    }
  },
  (error) => {
    NProgress.done(); // 关闭进度条
    if (error.response.data.code == 401) {
      removeToken();
      Promise.reject(ElMessage.error("登录已失效"));
    }
    return Promise.reject(ElMessage.error(error.response.data.message));
  }
);

export default service;
