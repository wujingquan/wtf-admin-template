<script lang="ts" setup>
import { ref } from "vue";
import role from "@/api/role";
import { CascaderProps } from "element-plus";
interface Role {
  id: number;
  pid: number;
  role_id: number;
  name: string;
  children?: Role[];
  disabled?: boolean;
}
const dialogVisible = ref(false);
const form = ref<{
  id?: number;
  pid: number;
  role_id: number;
  name: string;
}>({
  pid: 0,
  role_id: 0,
  name: ""
});
const formType = ref("add");
const tableData = ref<Role[]>([]);
const options = ref<any>([]);
const props1: CascaderProps = {
  checkStrictly: true,
  emitPath: false,
  value: "id",
  label: "name"
};
let originArr: Role[] = [];

function arrToTree(arr, pid: number | null = null) {
  const res: Role[] = [];
  arr.forEach(item => {
    if (item.pid === pid) {
      // 这样每次都需要遍历整个数组，因此时间复杂度为 n*n
      // const children = arrToTree(arr, item.id)

      // 往下递归时，每次数组的大小都在减小，每次都筛选掉父代元素，最终的时间复杂度为 n*logn
      const children = arrToTree(
        arr.filter(v => v.pid !== pid),
        item.id
      );
      if (children.length) {
        res.push({ ...item, children });
      } else {
        res.push({ ...item });
      }
    }
  });
  return res;
}
function arrToTree1(arr: Role[], pid: number | null = null, disabled = false) {
  const res: Role[] = [];
  arr.forEach(item => {
    if (item.pid === pid) {
      // 这样每次都需要遍历整个数组，因此时间复杂度为 n*n
      // const children = arrToTree(arr, item.id)

      // 往下递归时，每次数组的大小都在减小，每次都筛选掉父代元素，最终的时间复杂度为 n*logn
      const children = arrToTree1(
        arr.filter(v => v.pid !== pid),
        item.id,
        item.id === form.value.id || disabled
      );
      if (children.length) {
        res.push({
          ...item,
          children,
          disabled: item.id === form.value.id || disabled
        });
      } else {
        res.push({ ...item, disabled: item.id === form.value.id || disabled });
      }
    }
  });
  return res;
}
interface IRes {
  items: Role[];
}
const getList = async () => {
  const res = (await role.get()) as IRes;
  originArr = res.items;
  const tree = arrToTree(res.items, 0);
  console.log("tree", tree);
  options.value = [
    {
      id: 0,
      name: "根角色",
      children: tree
    }
  ];
  tableData.value = tree;
};
const onConfirm = async () => {
  if (formType.value === "add") {
    await role.post(form.value);
    dialogVisible.value = false;
    getList();
  } else {
    edit();
  }
};
const handleEdit = async row => {
  formType.value = "edit";
  form.value = {
    ...row
  };
  dialogVisible.value = true;
};
const edit = async () => {
  const { id, ...rest } = form.value;
  await role.put(id, rest);
  dialogVisible.value = false;
  await getList();
};
const handleDelete = async id => {
  await role.delete(id);
  await getList();
};
const add = pid => {
  formType.value = "add";
  form.value.pid = pid;
  dialogVisible.value = true;
};
const onChange = (...args) => {
  console.log("onChange", args);
};
const expandChange = (...args) => {
  console.log("expandChange", args);
};
const visibleChange = visible => {
  if (visible) {
    const arr = originArr.map(item => ({
      ...item,
      disabled: item.id === form.value.id
    }));
    const tree = arrToTree1(arr, 0);
    console.log("tree", tree);
    options.value = [
      {
        id: 0,
        name: "根角色",
        children: tree
      }
    ];
  }
};

getList();
</script>

<template>
  <div>
    <el-button type="primary" @click="add(0)">新增角色</el-button>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column prop="role_id" label="角色ID" />
      <el-table-column prop="name" label="角色名称" align="center" />
      <el-table-column prop="address" label="操作" align="center">
        <template #default="scope">
          <el-button size="small" type="primary">设置权限</el-button>
          <el-button size="small" type="primary" @click="add(scope.row.id)"
            >新增子角色</el-button
          >
          <el-button size="small" type="primary">拷贝</el-button>
          <el-button size="small" type="primary" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="Tips" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="父级角色">
          <el-cascader
            v-model="form.pid"
            :options="options"
            :props="props1"
            :show-all-levels="false"
            :disabled="formType === 'add'"
            clearable
            @change="onChange"
            @expand-change="expandChange"
            @visible-change="visibleChange"
          />
        </el-form-item>
        <el-form-item label="角色ID">
          <el-input v-model.number="form.role_id" />
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="onConfirm"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
