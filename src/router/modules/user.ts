// 最简代码，也就是这些字段必须有
export default {
  path: "/manage",
  meta: {
    title: "系统管理"
  },
  children: [
    {
      path: "/role/index",
      name: "Role",
      component: () => import("@/views/role/index.vue"),
      meta: {
        title: "角色管理"
      }
    },
    {
      path: "/menu/index",
      name: "Menu",
      component: () => import("@/views/menu/index.vue"),
      meta: {
        title: "菜单管理"
      }
    },
    {
      path: "/api/index",
      name: "API",
      component: () => import("@/views/api/index.vue"),
      meta: {
        title: "API管理"
      }
    },
    {
      path: "/user/index",
      name: "User",
      component: () => import("@/views/user/index.vue"),
      meta: {
        title: "用户管理"
      }
    },
    {
      path: "/dictionary/index",
      name: "Dictionary",
      component: () => import("@/views/dictionary/index.vue"),
      meta: {
        title: "字典管理"
      }
    },
    {
      path: "/operation/index",
      name: "Operation",
      component: () => import("@/views/operation/index.vue"),
      meta: {
        title: "操作历史"
      }
    }
  ]
};
