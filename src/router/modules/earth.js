import Layout from "@/layout/earth";

export default [
  {
    path: "/",
    component: Layout,
    redirect: "/earth",
    meta: { title: "首页", icon: "el-icon-s-home" },
    children: [
      {
        path: "earth",
        component: () => import("@/views/earth"),
        name: "earth",
        hidden: true,
        meta: { title: "Earth", icon: "earth", affix: true }
      }
    ]
  }
];
