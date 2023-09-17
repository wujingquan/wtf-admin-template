<script lang="ts" setup>
import { ref } from "vue";
import api from "@/api/api";

interface IApi {
  id: number;
  group: string;
  name: string;
  description?: string;
  method: string;
  path: string;
}
interface IRes {
  items: IApi[];
}

const dialogVisible = ref(false);
const form = ref<{
  id?: number;
  group: string;
  name: string;
  description?: string;
  method: string;
  path: string;
}>({
  group: "",
  name: "",
  description: "",
  method: "",
  path: ""
});
const formType = ref("add");
const tableData = ref<IApi[]>([]);
const getList = async () => {
  const res = (await api.get()) as IRes;
  tableData.value = res.items;
};
const onConfirm = async () => {
  if (formType.value === "add") {
    await api.post(form.value);
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
  await api.put(id, rest);
  dialogVisible.value = false;
  await getList();
};
const handleDelete = async id => {
  await api.delete(id);
  await getList();
};
const add = () => {
  formType.value = "add";
  dialogVisible.value = true;
};

getList();
</script>

<template>
  <div>
    <el-button type="primary" @click="add()">新增角色</el-button>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column prop="id" label="id" />
      <el-table-column prop="path" label="API路径" align="center" />
      <el-table-column prop="method" label="动作" align="center" />
      <el-table-column prop="group" label="API分组" align="center" />
      <el-table-column prop="name" label="API名称" align="center" />
      <el-table-column prop="description" label="API描述" align="center" />
      <el-table-column prop="address" label="操作" align="center">
        <template #default="scope">
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
        <el-form-item label="路径">
          <el-input v-model="form.path" />
        </el-form-item>
        <el-form-item label="请求">
          <el-input v-model="form.method" />
        </el-form-item>
        <el-form-item label="API分组">
          <el-input v-model="form.group" />
        </el-form-item>
        <el-form-item label="API名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="API简介">
          <el-input v-model="form.description" />
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
