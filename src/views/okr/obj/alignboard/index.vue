<template>
  <el-container class="alignboard">
    <el-header style="height: 10vh">
      <div style="display: flex; justify: space-between; margin: 5px 0px">
        <div style="flex: 1">
          <el-radio-group v-model="radio" size="mini">
            <el-radio-button label="我的对齐" />
            <el-radio-button label="全部对齐" />
          </el-radio-group>
        </div>
        <div>
          <el-select
            v-model="CycleID"
            placeholder="周期"
            size="mini"
            @change="selectChang"
          >
            <el-option
              v-for="item in CycleTableData"
              :key="item.item"
              :label="item.CycleName"
              :value="item.CycleID"
            />
          </el-select>
        </div>
      </div>
    </el-header>
    <el-main style="height: 90vh">
      <v2-tree
        :sources="datas"
        @handleRemove="removeItem"
        @handleAdd="addChild"
        @handleEdit="editChild"
      />
    </el-main>
  </el-container>
</template>
<script>
import vueTree from 'v2-tree';
import Vue from 'vue';
import { SelectInCycle } from '@/api/okr/cycle';
import { MyAlign } from '@/api/okr/aligning';

Vue.use(vueTree);

export default {
  data() {
    return {
      CycleTableData: [],
      CycleID: '',
      radio: '我的对齐',
      SelectCycle: {
        ObjectType: 0,
        CycleType: '',
        Year: '',
        ObjectName: '',
        pageIndex: 1,
        pageSize: 100,
        Total: 110,
        IsAlign: false
      },
      datas: [
        {
          id: 1,
          cycle: '3季度医院目标',
          name: '医院总体院级临床目标',
          percent: '15',
          kr: '2',
          align: '3',
          person: '林徽因',
          childs: [
            {
              id: 2,
              name: '科室目标1',
              percent: '1',
              childs: [
                {
                  id: 5,
                  name: '目标1-1',
                  percent: '2',
                  childs: [
                    {
                      id: 8,
                      name: '目标1-1-1',
                      percent: '5',
                      childs: [
                        {
                          id: 10,
                          name: '目标1-1-1-1',
                          percent: '8'
                        }
                      ]
                    },
                    {
                      id: 18,
                      name: '目标1-1-2',
                      percent: '5',
                      childs: [
                        {
                          id: 31,
                          name: '目标1-1-2-1',
                          percent: '18',
                          childs: [
                            {
                              id: 32,
                              name: '目标1-1-2-1-1',
                              percent: '31',
                              childs: [
                                {
                                  id: 33,
                                  name: '目标1-1-2-1-1-1',
                                  percent: '32'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 11,
                  name: '目标1-2',
                  percent: '2',
                  childs: [
                    {
                      id: 12,
                      name: '目标1-2-1',
                      percent: '11',
                      childs: [
                        { id: 13, name: '目标1-2-1-1', percent: '12' },
                        { id: 17, name: '目标1-2-1-1', percent: '12' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: 3,
              name: '目标2',
              percent: '1',
              childs: [
                {
                  id: 6,
                  name: '目标2-1',
                  percent: '3',
                  childs: [
                    {
                      id: 9,
                      name: '目标2-1-1',
                      percent: '6',
                      childs: [
                        { id: 19, name: '目标2-1-1-1', percent: '9' },
                        { id: 20, name: '目标2-1-1-2', percent: '9' }
                      ]
                    }
                  ]
                },
                { id: 14, name: '目标2-2', percent: '3' },
                { id: 15, name: '目标2-3', percent: '3' },
                { id: 16, name: '目标2-4', percent: '3' }
              ]
            }
          ]
        },
        {
          id: 24,
          cycle: '6月份科室目标',
          name: '住院率',
          percent: '0',
          childs: [
            {
              id: 23,
              name: '目标3',
              percent: '24',
              childs: [{ id: 26, name: '目标3-1', percent: '23' }]
            },
            {
              id: 25,
              name: '目标4',
              percent: '24',
              childs: [{ id: 27, name: '目标4-1', percent: '25' }]
            }
          ]
        }
      ]
    };
  },
  created() {
    this.SelectInCycle();
  },
  methods: {
    async SelectInCycle(val) {
      this.SelectCycle.pageIndex =
        val === '搜索' ? 1 : this.SelectCycle.pageIndex;
      const { data } = await SelectInCycle(this.SelectCycle);
      this.CycleTableData = data.DataList;
      this.MyAlign(data.DataList[0].CycleID);
    },
    async MyAlign(CycleID) {
      const { data } = await MyAlign({
        CycleID: CycleID
      });
      this.datas = data;
    },
    async selectChang() {

    },
    /**
     * 添加节点
     * params: {
     *  type: 1|2     1是添加兄弟节点 2是添加节点
     *  name: '目标'   节点名称
     * }
     * obj: {
     *  data: {}    当前操作的对象
     *  parent: []  当前操作的对象的父级数据
     *  index: 1    当前操作对象的索引
     * }
     * closeModalCallback   关闭弹窗的回调参数
     */
    addChild({ params, form, closeModalCallback }) {
      if (form.type === 2) {
        // 子节点
        if (!params.data.childs) {
          this.$set(params.data, 'childs', []);
        }
        params.data.childs.push({ name: form.name });
      } else {
        // 兄弟节点
        params.parent.push({ name: form.name });
      }
      closeModalCallback();
    },
    editChild({ params, form, closeModalCallback }) {
      params.data.name = form.name;
      closeModalCallback();
    },
    /** *
     *  删除节点
     *  data: {}    当前操作的对象
     *  parent: []  当前操作的对象的父级数据
     *  index: 1    当前操作对象的索引
     */
    removeItem(data, parent, index) {
      parent.splice(index, 1);
    }
  }
};
</script>

<style lang="scss">
.alignboard {
  .el-header,
  .el-main {
    padding: 0px;
    margin: 0px;
  }
}
</style>
