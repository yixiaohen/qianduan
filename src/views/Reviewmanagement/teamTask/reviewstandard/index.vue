<template>
  <div class="evaluation_not_validated">
    <split-pane split="horizontal"  :default-percent="60">

      <template slot="paneL">
        <el-card
          style="margin: 10px"
        >
          <div class="top-container">
            <div class="top-container-head">
              <el-form
                size="mini"
                label-position="left"
                :inline="true"
              >
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-circle-plus"
                    size="mini"
                    @click="addCatalogs"
                  >增加
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="success"
                    icon="el-icon-refresh"
                    :disabled="disabled"
                    size="mini"
                    @click="refreshRoot()"
                  />
                </el-form-item>
              </el-form>
            </div>
            <el-alert
              :title="catalogTitle || '当前栏目下不能添加资料，请选择子级栏目'"
              type="info"
              :closable="false"
            />
            <div class="top-container-body">
              <el-table
                ref="tableData"
                v-loading="loading"
                class="top-container-body-tb"
                :data="tableData"
                style="width: 100%"
                row-key="CatalogID"
                border
                size="mini"
                lazy
                height="40vh"
                :row-class-name="tableRowClassName"
                :load="addChildrenCatalog"
                :tree-props="{ children: 'Children', hasChildren: 'hasChildren' }"
                @row-click="cellClick"
              >
                <el-table-column
                  prop="CatalogCode"
                  label="编号"
                  width="160"
                  sortable
                />
                <el-table-column
                  prop="CatalogName"
                  label="内容"
                  min-width="300"
                />
                <!--              宁海妇幼保健院隐藏评审标准-->
                <el-table-column
                  v-if="CatalogVersion !== '宁海妇幼保健院'"
                  label="评审标准"
                  width="70"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <el-tag
                      size="mini"
                      effect="dark"
                      :type="row.IsCriterion ? 'success' : 'danger'"
                    >{{ row.IsCriterion ? '是' : '否' }}
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="Fraction"
                  label="总分值"
                  width="70"
                  align="center"
                />

                <!-- <el-table-column prop="name" label="核心条款" width="180" /> -->
                <el-table-column
                  label="操作"
                  width="160"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-circle-plus"
                      @click="addCatalog(scope.row)"
                    />
                    <el-button
                      type="info"
                      size="mini"
                      icon="el-icon-edit"
                      @click="updateCatalog(scope.row)"
                    />
                    <el-button
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      @click="deleteCatalog(scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>

      </template>

      <!-- <div style="display:flex;"> -->
      <template slot="paneR"  >
        <el-card
        style="margin: 0px"
        >


        <div class="bottom-container">
          <el-tabs
            v-model="activeName"
            class="bottom-container"
          >
            <el-tab-pane
              label="考评办法"
              name="first"
            >
              <div class="bottom-container">
                <div class="bottom-container-head">
                  <el-form
                    size="mini"
                    label-position="left"
                    :inline="true"
                  >
                    <el-form-item>
                      <el-button
                        icon="el-icon-circle-plus"
                        :disabled="ResortDisabled"
                        size="mini"
                        type="info"
                        @click="InsertResort"
                      >增加考评办法
                      </el-button>
                    </el-form-item>
                    <el-form-item>
                      <div class="block">
                        <el-pagination
                          background
                          :current-page.sync="pagination2.pageIndex"
                          :page-size="pagination2.pageSize"
                          :page-sizes="pagination2.pageSizes"
                          :total="pagination2.total"
                          layout="total, sizes, prev, pager, next, jumper"
                          @size-change="handleSizeChange2"
                          @current-change="handleCurrentChange2"
                        />
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
                <el-table
                  class="bottom-container-body-tb"
                  :data="Resort"
                  style="width: 100%"
                  border
                  size="mini"
                  height="20vh"
                >
                  <el-table-column
                    type="index"
                    width="50"
                    label="序号"
                    align="center"
                  />
                  <el-table-column
                    label="内容"
                    min-width="300"
                  >
                    <template slot-scope="{row}">
                      <p v-html="row.ResortName.replace(/\n/g, '<br/>') || ' '"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="150"
                    align="center"
                    fixed="right"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="info"
                        size="mini"
                        icon="el-icon-edit"
                        @click="UpdateResort(scope.row)"
                      />
                      <el-button
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                        @click="DeleteResort(scope.row)"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="扣分原因"
              name="second"
            >
              <div class="bottom-container">
                <div class="bottom-container-head">
                  <el-form
                    size="mini"
                    label-position="left"
                    :inline="true"
                  >
                    <el-form-item>
                      <el-button
                        icon="el-icon-circle-plus"
                        :disabled="ResortDisabled"
                        size="mini"
                        type="info"
                        @click="InsertPenalties"
                      >选择扣分原因
                      </el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        icon="el-icon-edit"
                        :disabled="ResortDisabled"
                        size="mini"
                        type="info"
                        @click="UpdatePenalties"
                      >修改扣分原因
                      </el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        icon="el-icon-plus"
                        :disabled="ResortDisabled"
                        size="mini"
                        type="info"
                        @click="addReorCa"
                      >添加扣分原因
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <el-table
                  class="bottom-container-body-tb"
                  :data="PenaltiesData"
                  style="width: 100%"
                  border
                  size="mini"
                  height="600"
                >
                  <el-table-column
                    prop="PenaltiesContent"
                    label="扣分内容"
                    width="300"
                  />
                  <el-table-column
                    prop="PenaltiesFraction"
                    label="扣分分数"
                    min-width="100"
                  />
                  <el-table-column
                    label="操作"
                    fixed="right"
                    align="center"
                    width="120"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="mini"
                        @click.native.prevent="editRows(scope.row)"
                      >编辑
                      </el-button>
                      <el-button
                        type="danger"
                        size="mini"
                        @click.native.prevent="deleteRows(scope.row)"
                      >删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        </el-card>
      </template>
    </split-pane>
    <el-dialog
      fullscreen
      modal
      title="专家手册添加"
      :visible.sync="dialogFormVisibleNote"
    >
      <div class="content-books">
        <el-card
          class="box-card"
          shadow="never"
        >
          <el-form
            ref="ExpertHandbooks"
            label-position="top"
            :rules="expertRules"
            :model="ExpertHandbooks"
            size="mini"
          >
            <el-form-item
              label="手册标题"
              prop="ExpertID"
              class="el-select-books"
            >
              <el-select
                v-model="ExpertHandbooks.ExpertID"
                clearable
                placeholder="请选择标题"
              >
                <el-option
                  v-for="item in selectChildrenExpert"
                  :key="item.ExpertID"
                  :label="item.ExpertTitle"
                  :value="item.ExpertID"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="分值"
              prop="Fraction"
            >
              <el-input v-model="ExpertHandbooks.Fraction"/>
            </el-form-item>
            <el-form-item
              label="扣分原因"
              prop="PenaltiesContent"
            >
              <el-select
                v-model="ExpertHandbooks.PenaltiesID"
                style="width: 100%"
                collapse-tags
                multiple
                placeholder="请选择"
              >
                <el-option
                  v-for="item in PenaltiesContent"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-card
              v-for="(book, index) in ExpertHandbooks.Books"
              :key="book.key"
              shadow="hover"
              style="margin: 5px 0"
              class="Books"
            >
              <el-form-item :label="'内容' + (index + 1)">
                <el-input
                  v-model="book.Content"
                  placeholder="请输入内容"
                  clearable
                />
                <div style="display: flex; align-items: center; margin-top: 5px">
                  <el-input-number
                    v-model="book.booksTypeNum"
                    :min="1"
                    :max="5"
                    label="描述文字"
                    controls-position="right"
                    @change="(v, o) => inputChange(v, o, book)"
                  />
                  <div
                    v-for="items in book.Type"
                    :key="items.key"
                    class="el-slot"
                  >
                    <el-input
                      v-model="items.ButtonValue"
                      placeholder="请输入内容"
                      clearable
                      class="input-with-select"
                    >
                      <el-select
                        slot="append"
                        v-model="items.ButtonID"
                        placeholder="请选择"
                        clearable
                      >
                        <el-option
                          v-for="item in selectData"
                          :key="item.ButtonID"
                          :label="item.ButtonName"
                          :value="[item.ButtonID, item.ButtonType]"
                        />
                      </el-select>
                    </el-input>
                  </div>
                  <el-button
                    type="danger"
                    plain
                    @click.prevent="removeBooks(book)"
                  >删除内容
                  </el-button>
                </div>
              </el-form-item>
            </el-card>
          </el-form>
        </el-card>
      </div>

      <div class="footer">
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="addBooks"
          >添 加</el-button>
          <el-button
            size="mini"
            @click="cancelExpertBooks"
          >取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="submitExpert"
          >确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="评审标准添加"
      :visible.sync="dialogCatalogVisible"
      @closed="closeds"
    >
      <el-form
        ref="installFormCatalog"
        :model="installFormCatalog"
        :rules="rules"
        size="mini"
        label-width="80px"
      >
        <el-form-item label="上级章节">
          <el-input
            v-model="rowObject.CatalogCode"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="条款编号"
          prop="CatalogCode"
        >
          <el-input
            v-model="installFormCatalog.CatalogCode"
            placeholder="请不要输入内容"
          />
        </el-form-item>
        <br>
        <el-form-item
          label="章节内容"
          prop="CatalogName"
        >
          <el-input
            v-model="installFormCatalog.CatalogName"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>
        <br>
        <el-form-item
          v-if="installFormCatalog.CatalogType !== 1"
          label="结果描述"
        >
          <el-input
            v-model="installFormCatalog.CataLogdescription"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>

        <el-form-item label="标准类别">
          <el-select
            v-model="installFormCatalog.CatalogType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in CatalogType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="installFormCatalog.CatalogType === 1"
          label="分数"
          prop="Fraction"
        >
          <el-input
            v-model="installFormCatalog.Fraction"
            clearable
          />
        </el-form-item>

        <el-form-item label="评审标准">
          <el-checkbox v-model="installFormCatalog.IsCriterion"/>
        </el-form-item>
        <el-form-item label="核心条款">
          <el-checkbox v-model="installFormCatalog.IsPoint"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="cancleAddCatalog"
        >取 消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="doAddCatalog"
        >确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="评审标准修改"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible_update"
    >
      <el-form
        ref="updateFormCatalog"
        :model="updateFormCatalog"
        :rules="rules"
        size="mini"
        label-width="80px"
      >
        <el-form-item label="当前章节">
          <el-input
            v-model="rowObject.CatalogCode"
            disabled
          />
        </el-form-item>
        <el-form-item label="条款编号">
          <el-input v-model="updateFormCatalog.CatalogCode"/>
        </el-form-item>
        <el-form-item
          label="章节内容"
          prop="CatalogName"
        >
          <el-input
            v-model="updateFormCatalog.CatalogName"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>

        <el-form-item
          v-if="updateFormCatalog.CatalogType !== 1"
          label="结果描述"
        >
          <el-input
            v-model="updateFormCatalog.CataLogdescription"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>

        <el-form-item label="标准类别">
          <el-select
            v-model="updateFormCatalog.CatalogType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in CatalogType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="updateFormCatalog.CatalogType === 1"
          label="分数"
          prop="Fraction"
        >
          <el-input
            v-model="updateFormCatalog.Fraction"
            clearable
          />
        </el-form-item>

        <el-form-item label="评审标准">
          <el-checkbox v-model="updateFormCatalog.IsCriterion"/>
        </el-form-item>
        <el-form-item label="核心条款">
          <el-checkbox v-model="updateFormCatalog.IsPoint"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="cancelUpdateCatalog"
        >取 消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="doUpdateCatalog"
        >确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="ResortTitle"
      :visible.sync="dialogFormVisible_resort"
    >
      <el-form
        ref="restorData"
        :rules="rules"
        :model="ResortData"
        size="mini"
        label-width="80px"
      >
        <el-form-item label="评审要点">
          <el-input
            v-model="row_title"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="内容"
          prop="ResortName"
        >
          <el-input
            v-model="ResortData.ResortName"
            type="textarea"
            placeholder="内容"
            :rows="8"
          />
        </el-form-item>

        <el-form-item label="附件上传">
          <el-upload
            :multiple="true"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-change="handleChange"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/Article/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            > 选择文件
            </el-button>
            <el-tag type="info" style="margin-left: 5vh">
              提示：只有点击“确定”按钮，内容和附件才会保存
            </el-tag>
          </el-upload>
          <filePreview
            ref="filePreview"
            :preview-data="ResortData.ResortFileList"
            :delete-show-file="true"
          />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="offKaoPin"
        >取 消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="
            ResortTitle === '添加考评办法' ? InsertResortContent() : UpdateResortContent()
          "
        >确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="PenaltiesTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible_penalties"
    >
      <el-form
        :model="listQuery"
        size="mini"
      >
        <el-form-item>
          <el-input
            v-model="listQuery.condition"
            style="width: 100%"
            clearable
            placeholder="扣分原因搜索"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="SelectPenalties"
          />
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTables"
        :data="PenaltiesData2"
        style="width: 100%"
        border
        size="mini"
        height="340"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40"
          align="center"
        />
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
        />
        <el-table-column
          prop="PenaltiesContent"
          label="扣分内容"
        />
        <el-table-column
          prop="PenaltiesFraction"
          label="扣分分数"
          align="center"
          width="80"
        />
      </el-table>
      <el-pagination
        style="margin: 6px 0 0 0"
        background
        :current-page.sync="pagination.pageIndex"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogFormVisible_penalties = false"
        >取 消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="InsertPenaltiesOnCatalog()"
        >确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="catalogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible_penaltiesA"
      @close="PeorCaCancel"
    >
      <el-form
        ref="PenaltiesFrom"
        :rules="rules"
        :model="PenaltiesFrom"
        size="mini"
        label-width="80px"
      >
        <el-form-item label="扣分原因">
          <el-input
            v-model="PenaltiesFrom.PenaltiesContent"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="扣分分数">
          <el-input v-model="PenaltiesFrom.PenaltiesFraction"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="mini"
          @click="!flag ? InsertPeorCa() : updatePeorCa()"
        >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import splitPane from 'vue-splitpane';
import { DeleteCatalog, InsertCatalog, SelectCatalog, UpdateCatalog } from '@/api/catalog';
import { DeleteResort, InsertResort, SelectResort, SelectResortFile, UpdateResort } from '@/api/Resort';
import {
  DeletePenaltiesOnCatalog,
  InsertPenaltiesOnCatalog,
  InsertPeorCa,
  SelectPenalties,
  SelectPenaltiesByCatalogID,
  UpdatePenalties
} from '@/api/Penalties';

import { InsertExpertIndicators, SelectExpertIndicators } from '@/api/ExpertIndicators';
import { SelectExpert } from '@/api/ButtonType';
import { SelectChildrenExpert } from '@/api/Expert';
import { debounce } from '@/utils';
import filePreview from '@/views/components/file/filePreview';
import { sortS } from '@/views/mixin/sortmixin';

export default {
  components: { splitPane, filePreview },
  mixins: [sortS],
  data() {
    return {
      CatalogVersion: window.CatalogVersion,
      activeName: 'first',
      disabled: false,
      flag: false,
      resizeHeight: 330,
      dialogCatalogVisible: false,
      dialogFormVisibleNote: false,
      dialogFormVisible_update: false,
      dialogFormVisible_resort: false,
      dialogFormVisible_penalties: false,
      dialogFormVisible_penaltiesA: false,
      loading: true,
      CatalogID: 0,
      maps: new Map(),
      formCatalog: {
        CatalogID: 0,
        SerialNo: '',
        CatalogCode: '',
        CatalogName: '',
        IsCriterion: false,
        IsPoint: false,
        Fraction: 0,
        CatalogID2: 0
      },
      installFormCatalog: {
        CatalogType: 1,
        Fraction: 0,
        CatalogID: 0,
        sort: 0,
        SerialNo: '',
        CatalogCode: '',
        CatalogName: '',
        IsCriterion: false,
        IsPoint: false,
        CataLogdescription: ''
      },
      updateFormCatalog: {
        CatalogType: 1,
        Fraction: 0,
        CatalogID: 0,
        SerialNo: '',
        CatalogCode: '',
        CatalogName: '',
        IsCriterion: false,
        IsPoint: false,
        CataLogdescription: ''
      },
      CatalogType: [
        {
          value: 1,
          label: '三类标准'
        },
        {
          value: 2,
          label: '一类标准'
        },
        {
          value: 3,
          label: '二类标准'
        }
      ],
      catalogTitle: '',
      ResortData: {
        ResortID: 0,
        CatalogID: 0,
        ParentID: 0,
        ResortName: '',
        ResortFileList: []
      },
      fileList: [],
      rules: {
        CatalogName: [{ required: true, message: '请输入章节内容', trigger: 'blur' }],
        ResortID: [{ required: true, message: '请输入考评办法编码', trigger: 'blur' }],
        CatalogCode: [
          { required: true, message: '请输入条款编号', trigger: 'blur' }
        ],
        ResortName: [{ required: true, message: '请输入考评办法内容', trigger: 'blur' }],
        Fraction: [{ required: true, message: '请输入分数', trigger: 'blur' }]
      },
      expertRules: {
        ExpertID: [{ required: true, message: '请选择标题', trigger: 'change' }],
        Content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        ButtonValue: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        ButtonID: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      tableData: [],
      Resort: [],
      PenaltiesData: [],
      PenaltiesData2: [],
      ResortDisabled: true,
      ResortTitle: '',
      PenaltiesTitle: '',
      PenaltiesDataForm: {
        PenaltiesIDs: '',
        CatalogID: 0
      },
      PenaltiesFrom: {
        CatalogID: 0,
        PenaltiesFraction: 0,
        PenaltiesContent: ''
      },
      listQuery: {
        pageSize: 20,
        pageIndex: 1,
        condition: ''
      },
      listQuery2: {
        pageSize: 20,
        pageIndex: 1,
        condition: ''
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 20,
        pageSizes: [20, 50, 100]
      },

      pagination2: {
        CatalogID: '',
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [10, 20, 30, 40, 50, 100]
      },
      row_title: '',
      rowObject: {},
      selectData: [],
      selectChildrenExpert: [],
      PenaltiesContent: [],
      ExpertHandbooks: {
        ExpertID: '',
        CatalogID: 0,
        PenaltiesID: [],
        Fraction: 0,
        Books: [
          {
            key: Math.random().toString(36).slice(2),
            Content: '',
            booksTypeNum: 1,
            Type: [
              {
                key: Math.random().toString(36).slice(2),
                ButtonID: '',
                ButtonValue: ''
              }
            ]
          }
        ]
      },
      ExpertIndicators: []
    };
  },
  created() {
    this.SelectCatalog();
    this.SelectPenalties();
    this.SelectExpert();
    this.SelectChildrenExpert();
  },
  methods: {
    // 考评办法上传附件成功
    handleSuccess(response, file) {
      if (response.hasOwnProperty('data')) {
        this.ResortData.ResortFileList.push({
          FileName: file.name,
          FileUrl: response.data[0].Content
        });
      } else {
        this.fileList = [];
        this.$message.error(file.name + '   上传失败');
      }
      console.log(this.ResortData);
    },
    // 考评办法上传附件更改
    handleChange(file, fileList) {
      this.uploadEnd = true;
      fileList.forEach(item => {
        if (item.response && item.response.code === 200) {
          this.uploadEnd = false;
        } else {
          this.uploadEnd = false;
        }
      });
    },
    closeds() {
      this.installFormCatalog = {
        CatalogType: 1,
        Fraction: 0,
        CatalogID: 0,
        SerialNo: '',
        CatalogCode: '',
        CatalogName: '',
        IsCriterion: false,
        IsPoint: false,
        CataLogdescription: ''
      };
    },
    resize(x, y) {
      this.resizeHeight = parseInt(x * 2 + 330);
    },
    debounce(x) {
      debounce(this.resize(x), 200);
    },
    submitExpert() {
      this.$refs.ExpertHandbooks.validate(async(v) => {
        if (v) {
          const Content = [];
          const ButtonIdvalue = [];
          const content = [];
          this.ExpertHandbooks.Books.forEach((item, index) => {
            Content.push(item.Content);
            const val = [];
            item.Type.forEach((i) => {
              val.push({
                ButtonID: i.ButtonID[0],
                ButtonType: i.ButtonID[1],
                ButtonValue: i.ButtonValue
              });
            });
            ButtonIdvalue.push(val);
          });
          ButtonIdvalue.forEach((i) => {
            i.forEach((it) => {
              content.push([it.ButtonID, it.ButtonType, it.ButtonValue]);
            });
          });
          const res = Content.concat(content);
          if (res.flat().includes('') || res.flat().includes(undefined)) {
            this.$message({
              type: 'warning',
              message: '请填写所需要的内容！'
            });
            return;
          }
          const arr = [];
          ButtonIdvalue.map((item) => {
            arr.push(JSON.stringify(item));
          });
          const formData = {
            Content,
            ButtonIdvalue: arr,
            ExpertID: this.ExpertHandbooks.ExpertID,
            Fraction: this.ExpertHandbooks.Fraction,
            PenaltiesID: this.ExpertHandbooks.PenaltiesID.join(','),
            CatalogID: this.ExpertHandbooks.CatalogID
          };
          try {
            const { data } = await InsertExpertIndicators(formData);
            this.$message({
              type: 'success',
              message: data
            });
          } catch (error) {
            console.log(error);
          } finally {
            this.dialogFormVisibleNote = false;
          }
        }
      });
    },
    cancelExpertBooks() {
      this.ExpertHandbooks = {
        ExpertID: '',
        CatalogID: 0,
        PenaltiesID: [],
        Fraction: 0,
        Books: [
          {
            key: Math.random().toString(36).slice(2),
            Content: '',
            booksTypeNum: 1,
            Type: [
              {
                key: Math.random().toString(36).slice(2),
                ButtonID: '',
                ButtonValue: ''
              }
            ]
          }
        ]
      };
      this.dialogFormVisibleNote = false;
    },
    addExpertBooks() {
      const PenaltiesContent = [];
      this.PenaltiesData.forEach((item) => {
        PenaltiesContent.push({
          value: item.PenaltiesID,
          label: item.PenaltiesContent
        });
      });
      this.PenaltiesContent = PenaltiesContent;
      this.dialogFormVisibleNote = true;
    },
    inputChange(NewValue, OldValue, Book) {
      const TypeData = {
        key: Math.random().toString(36).slice(2),
        ButtonID: '',
        ButtonValue: ''
      };
      const index = this.ExpertHandbooks.Books.indexOf(Book);
      index !== -1 &&
      this.ExpertHandbooks.Books.map((item) => {
        Book.key === item.key
          ? NewValue > OldValue
            ? item.Type.push(TypeData)
            : item.Type.splice(0, 1)
          : false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeBooks(book) {
      const index = this.ExpertHandbooks.Books.indexOf(book);
      index !== -1 && this.ExpertHandbooks.Books.splice(index, 1);
    },
    addBooks() {
      this.ExpertHandbooks.Books.push({
        key: Math.random().toString(36).slice(2),
        Content: '',
        booksTypeNum: 1,
        Type: [
          {
            key: Math.random().toString(36).slice(2),
            ButtonID: '',
            ButtonValue: ''
          }
        ]
      });
    },
    async SelectExpert() {
      try {
        const { data } = await SelectExpert();
        this.selectData = data;
      } catch (error) {
        console.log(error);
      }
    },
    async SelectChildrenExpert() {
      try {
        const { data } = await SelectChildrenExpert();
        this.selectChildrenExpert = data;
      } catch (error) {
        console.log(error);
      }
    },
    PeorCaCancel() {
      this.dialogFormVisible_penaltiesA = false;
      this.PenaltiesFrom.PenaltiesFraction = 0;
      this.PenaltiesFrom.PenaltiesContent = '';
    },
    InsertPeorCa() {
      this.$refs.PenaltiesFrom.validate(async(v) => {
        if (v) {
          const form = {
            CatalogID: this.rowObject.CatalogID,
            PenaltiesFraction: this.PenaltiesFrom.PenaltiesFraction,
            PenaltiesContent: this.PenaltiesFrom.PenaltiesContent
          };
          try {
            const { msg } = await InsertPeorCa(form);
            this.$message({
              type: 'success',
              message: msg
            });

            this.SelectPenaltiesByCatalogID(this.rowObject.CatalogID);
            this.PenaltiesFrom.PenaltiesFraction = 0;
            this.PenaltiesFrom.PenaltiesContent = '';
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
    addReorCa() {
      this.flag = false;
      this.dialogFormVisible_penaltiesA = true;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTables.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.multipleTables.clearSelection();
      }
    },
    updatePeorCa() {
      this.$refs.PenaltiesFrom.validate(async(v) => {
        if (v) {
          const form = {
            PenaltiesFraction: this.PenaltiesFrom.PenaltiesFraction,
            PenaltiesContent: this.PenaltiesFrom.PenaltiesContent,
            PenaltiesID: this.PenaltiesFrom.PenaltiesID,
            Type: 0
          };
          try {
            const { msg } = await UpdatePenalties(form);
            this.$message({
              type: 'success',
              message: msg
            });

            this.SelectPenaltiesByCatalogID(this.rowObject.CatalogID);
          } catch (error) {
            console.log(error);
          } finally {
            this.dialogFormVisible_penaltiesA = false;
          }
        }
      });
    },
    editRows(row) {
      row = JSON.parse(JSON.stringify(row));
      this.PenaltiesFrom = {
        PenaltiesFraction: row.PenaltiesFraction,
        PenaltiesContent: row.PenaltiesContent,
        PenaltiesID: row.PenaltiesID
      };
      this.flag = true;
      this.dialogFormVisible_penaltiesA = true;
    },
    async deleteRows(row) {
      this.$confirm(`此操作将永久删除 ${row.PenaltiesContent} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const formData = {
            PenaltiesID: row.PenaltiesID,
            CatalogID: this.PenaltiesDataForm.CatalogID
          };
          try {
            const { msg } = await DeletePenaltiesOnCatalog(formData);
            this.$message({
              type: 'success',
              message: msg
            });

            this.SelectPenaltiesByCatalogID(this.PenaltiesDataForm.CatalogID);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((e) => e);
    },
    async InsertPenaltiesOnCatalog() {
      if (this.PenaltiesDataForm.PenaltiesIDs === '') {
        this.$message({
          type: 'error',
          message: '至少选择一条扣分原因!'
        });
        return;
      }
      try {
        const { msg } = await InsertPenaltiesOnCatalog(this.PenaltiesDataForm);
        this.$message({
          type: 'success',
          message: msg
        });
        this.SelectPenaltiesByCatalogID(this.PenaltiesDataForm.CatalogID);
        this.SelectPenalties();
      } catch (error) {
        console.log(error);
      } finally {
        this.dialogFormVisible_penalties = false;
      }
    },
    async SelectPenalties() {
      try {
        const { data } = await SelectPenalties(this.listQuery);
        this.pagination.total = data.Total;
        this.PenaltiesData2 = data.DataList;
      } catch (error) {
        console.log(error);
      }
    },
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectPenalties();
    },
    handleCurrentChange2(index) {
      this.pagination2.pageIndex = index;
      this.SelectResort();
    },
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.SelectPenalties();
    },
    handleSizeChange2(page) {
      this.pagination2.pageSize = page;
      this.SelectResort();
    },
    handleSelectionChange(value) {
      const PenaltiesIDs = value.map((v) => v.PenaltiesID);
      this.PenaltiesDataForm.PenaltiesIDs = PenaltiesIDs;
    },
    UpdatePenalties() {
      this.dialogFormVisible_penalties = true;
      this.PenaltiesTitle = '修改扣分原因';
      this.SelectPenalties();
    },
    InsertPenalties() {
      this.dialogFormVisible_penalties = true;
      this.PenaltiesTitle = '添加扣分原因';
      this.SelectPenalties();
    },
    DeleteResort(row) {
      this.$confirm(`此操作将永久删除 ${row.ResortName} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          row.type = 1;
          try {
            const { msg } = await DeleteResort({ ResortID: row.ResortID });
            this.$message({
              type: 'success',
              message: msg
            });

            this.pagination2.CatalogID = row.CatalogID;
            this.SelectResort();
          } catch (error) {
            console.log(error);
          }
        })
        .catch((e) => e);
    },
    UpdateResortContent() {
      this.ResortData.ResortName = this.ResortData.ResortName.replace(/\n/g, '\n');
      this.$refs.restorData.validate(async(v) => {
        if (v) {
          try {
            const { msg } = await UpdateResort(this.ResortData);
            this.$message({
              type: 'success',
              message: msg
            });
            this.SelectResort();
          } catch (error) {
            console.log(error);
          } finally {
            this.dialogFormVisible_resort = false;
            this.$refs.filePreview.currentEdit = -1;// 将修改input框隐藏
          }
        } else {
          this.$message({
            type: 'error',
            message: '信息请填写!'
          });
        }
      });
    },
    // 主要是用来取消考评办法框时，将附件那里更改名字的input隐藏掉以及将对话框关闭
    offKaoPin() {
      this.$refs.filePreview.currentEdit = -1;// 将修改input框隐藏
      this.dialogFormVisible_resort = false;
      this.fileList.push('-');
      this.fileList = []; // 当点击进增加考评办法时，以防先前加载了其他考评办法加载的附件列表再次出现在新的增加内容中，就把附件列表清空
    },
    async UpdateResort(row) {
      row = JSON.parse(JSON.stringify(row));
      this.ResortData = row;
      this.ResortTitle = '编辑考评办法';
      this.dialogFormVisible_resort = true;
      const { data } = await SelectResortFile({
        ResortID: this.ResortData.ResortID
      });
      console.log(data);
      this.ResortData.ResortFileList = data;
      console.log(this.ResortData);
      this.fileList = this.ResortData;
    },
    InsertResortContent() {
      this.$refs.restorData.validate(async(v) => {
        if (v) {
          try {
            this.ResortData.ResortName = this.ResortData.ResortName.replace(/\n/g, '\n');
            const { msg } = await InsertResort(this.ResortData);
            this.$message({
              type: 'success',
              message: msg
            });
            this.SelectResort();
          } catch (error) {
            console.log(error);
          } finally {
            this.dialogFormVisible_resort = false;
            this.$refs.filePreview.currentEdit = -1;// 将修改input框隐藏
          }
        } else {
          this.$message({
            type: 'error',
            message: '信息请填写!'
          });
        }
      });
    },
    InsertResort() {
      this.ResortTitle = '添加考评办法';
      this.dialogFormVisible_resort = true;
      this.ResortData.ResortName = '';
      this.ResortData.ResortID = 0;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.CatalogID === this.rowObject.CatalogID) {
        return 'warning-row';
      }
      return '';
    },
    cellClick(row) {
      this.rowObject = JSON.parse(JSON.stringify(row));
      this.pagination2.CatalogID = row.CatalogID;
      this.SelectResort();
      this.SelectPenaltiesByCatalogID(row.CatalogID);
      this.SelectExpertIndicators(row.CatalogID);
      this.catalogTitle = `${row.CatalogCode} : ${row.CatalogName}`;
      if (row.Count === 0) {
        this.ResortDisabled = false;
        this.row_title = row.CatalogName;
        this.ResortData.CatalogID = row.CatalogID;
        this.ExpertHandbooks.CatalogID = row.CatalogID;
        this.PenaltiesDataForm.CatalogID = row.CatalogID;
        return;
      }
      this.ResortDisabled = true;
    },
    async SelectExpertIndicators(CatalogID = 0) {
      try {
        const { data } = await SelectExpertIndicators({ CatalogID });
        this.ExpertIndicators = data;
      } catch (error) {
        console.log(error);
      }
    },
    async SelectPenaltiesByCatalogID(CatalogID = 0) {
      try {
        const { data } = await SelectPenaltiesByCatalogID({ CatalogID });
        this.PenaltiesData = data.DataList;
      } catch (error) {
        console.log(error);
      }
    },
    async SelectResort(v = 0) {
      this.pagination2.CatalogID = this.rowObject.CatalogID;
      const val = {
        CatalogID: this.pagination2.CatalogID,
        pageIndex: this.pagination2.pageIndex,
        pageSize: this.pagination2.pageSize
      };
      try {
        const { data } = await SelectResort(val);
        this.pagination2.total = data.Total;
        this.Resort = data.DataList;
      } catch (error) {
        console.log(error);
      }
    },
    async addCatalogs(row = {}) {
      row = JSON.parse(JSON.stringify(row));
      this.rowObject = row;
      this.installFormCatalog.CatalogType = row.CatalogType;
      this.installFormCatalog.CatalogName = '';
      this.installFormCatalog.Fraction = 0;
      this.installFormCatalog.CatalogID = row.CatalogID || 0;
      this.dialogCatalogVisible = true;
    },
    async addCatalog(row = {}) {
      row = JSON.parse(JSON.stringify(row));
      this.rowObject = row;
      this.installFormCatalog.CatalogType = row.CatalogType;
      this.installFormCatalog.CatalogName = '';
      this.installFormCatalog.Fraction = 0;
      this.installFormCatalog.CatalogID = row.CatalogID || 0;
      this.dialogCatalogVisible = true;
    },
    async doAddCatalog() {
      this.$refs.installFormCatalog.validate(async(v) => {
        if (v) {
          const code = this.installFormCatalog.CatalogCode.split('.');
          const arr = [];
          const reg = /^[a-zA-Z]+$/;
          if (reg.test(this.rowObject.CatalogCode)) { // 如果上级章节为字母，代表已经是最底层了，加所在层级的标识，比如c,加完就成了c1,c2之类的条款
            code.forEach((e) => {
              // if (!isNaN(parseInt(e))) {
              //   arr.push(e < 10 ? '0' + e : e);
              // } // 这个是如果是个位数，前面加0
              if (!isNaN(parseInt(e))) { // 前面都加上级章节，比如c,加完就成了c1,c2之类的条款
                // 如果是直接点击左上角的添加，this.rowObject.CatalogCode这个是为不明确的，就赋值为空
                if (!this.rowObject.CatalogCode) {
                  this.rowObject.CatalogCode = '';
                }
                arr.push(e < 10 ? this.rowObject.CatalogCode + e : this.rowObject.CatalogCode + e);
                console.log('我第一', this.rowObject.CatalogCode);
              }
            });
          } else {
            code.forEach((e) => {
              // if (!isNaN(parseInt(e))) {
              //   arr.push(e < 10 ? '0' + e : e);
              // } // 这个是如果是个位数，前面加0
              if (!isNaN(parseInt(e))) { //  如果不是最底层条款，前面不加任何东西
                arr.push(e < 10 ? e : e);
                console.log('我第二');
              }
            });
          }
          console.log('此时CatalogCode', this.installFormCatalog.CatalogCode);
          console.log('此时arr', arr.join('.'));
          console.log('此时SerialNo', this.installFormCatalog.SerialNo);
          this.installFormCatalog.sort = 0;
          this.installFormCatalog.SerialNo =
            arr.join('.') || this.installFormCatalog.CatalogCode;
          console.log('后来的SerialNo', this.installFormCatalog.SerialNo);

          // this.installFormCatalog.CatalogCode = this.rowObject.CatalogCode + this.installFormCatalog.CatalogCode ;
          this.installFormCatalog.IsCriterion =
            this.installFormCatalog.IsCriterion === true ? 1 : 0;
          this.installFormCatalog.IsPoint =
            this.installFormCatalog.IsPoint === true ? 1 : 0;
          this.installFormCatalog.Fraction =
            this.installFormCatalog.CatalogType === 1
              ? this.installFormCatalog.Fraction
              : 0;
          try {
            const { msg } = await InsertCatalog(this.installFormCatalog);
            this.refreshRow(this.rowObject.CatalogID);
            this.$message({
              type: 'success',
              message: msg
            });
          } catch (error) {
            console.log(error);
          } finally {
            this.dialogCatalogVisible = false;
          }
        }
      });
    },
    cancleAddCatalog() {
      this.dialogCatalogVisible = false;
    },
    updateCatalog(row) {
      this.rowObject = JSON.parse(JSON.stringify(row));
      this.updateFormCatalog = JSON.parse(JSON.stringify(row)); // 复制当前row，而非直接引用row，假如 = row，则随着dialogbox对话框修改，跟着实时修改，假如点击取消，则麻烦了
      this.updateFormCatalog.CataLogdescription = row.CataLogdescription || '';
      if (row.IsCriterion === 0 || row.IsCriterion === false) {
        this.updateFormCatalog.IsCriterion = false;
      } else {
        this.updateFormCatalog.IsCriterion = true;
      }

      if (row.IsPoint === 0 || row.IsPoint === false) {
        this.updateFormCatalog.IsPoint = false;
      } else {
        this.updateFormCatalog.IsPoint = true;
      }
      this.dialogFormVisible_update = true;
    },
    doUpdateCatalog() {
      this.$refs.updateFormCatalog.validate(async(v) => {
        if (v) {
          const code = this.updateFormCatalog.CatalogCode.split('.');
          const arr = [];
          code.forEach((e) => {
            if (!isNaN(parseInt(e))) {
              arr.push(e < 10 ? '0' + e : e);
            }
          });
          const formData = { ...this.updateFormCatalog };
          formData.SerialNo = arr.join('.') || formData.CatalogCode;
          formData.IsCriterion = formData.IsCriterion === true ? 1 : 0;
          formData.IsPoint = formData.IsPoint === true ? 1 : 0;
          formData.Fraction = formData.CatalogType === 1 ? formData.Fraction : 0;
          delete formData.hasChildren;
          try {
            const { msg } = await UpdateCatalog(formData);
            this.$message({
              type: 'success',
              message: msg
            });
            if (this.rowObject.ParentID) {
              this.refreshRow(this.rowObject.ParentID);
            } else {
              this.refreshRoot();
            }
          } catch (error) {
            console.log(error);
          } finally {
            this.dialogFormVisible_update = false;
          }
        }
      });
    },
    cancelUpdateCatalog() {
      this.dialogFormVisible_update = false;
    },
    deleteCatalog(row) {
      if (window.userInfo[0].UserName !== '系统管理员') {
        this.$message.warning('只有管理员才能删除哦！');
        return;
      }
      this.$confirm(`此操作将永久删除 <br>  ${row.CatalogName}`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      })
        .then(async() => {
          try {
            const { code, msg } = await DeleteCatalog({
              CatalogID: row.CatalogID
            });
            code === 200
              ? this.$message({
                type: 'success',
                message: msg
              })
              : this.$message({
                type: 'error',
                message: msg
              });
            this.maps.delete(row.CatalogID);
            if (row.ParentID) {
              // 当存在父节点, 在父节点的子数组array中找到当前删除的节点
              const arr = this.$refs.tableData.store.states.lazyTreeNodeMap[row.ParentID];
              arr.splice(
                arr.findIndex((item) => item.CatalogID === row.CatalogID),
                1
              );
            } else {
              this.refreshRoot();
            } // 根节点
          } catch (error) {
            console.log(error);
          }
        })
        .catch((e) => e);

      this.refreshRoot();
    },
    refreshRow(id) {
      if (this.rowObject.ParentID !== undefined) {
        const cur = this.maps.get(id);
        if (cur) {
          // 假如当前部门节点已经展开
          const { tree, treeNode, resolve } = cur;
          this.addChildrenCatalog(tree, treeNode, resolve);
        }
      } else {
        this.refreshRoot();
      }
    },
    refreshRoot() {
      this.disabled = true;
      this.SelectCatalog();
      setTimeout(() => {
        this.disabled = false;
      }, 500);
    },
    async SelectCatalog(ParentID = 0) {
      try {
        const { data } = await SelectCatalog({ ParentID });
        if (data instanceof Array) {
          data.map((item) => {
            item.hasChildren = true;
          });
          this.tableData = sortS.sortw(data);
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async addChildrenCatalog(tree, treeNode, resolve) {
      // 当前节点已经展开，之下插入子节点，自动显示新插入节点
      this.maps.set(tree.CatalogID, { tree, treeNode, resolve });
      try {
        const { data } = await SelectCatalog({ CatalogID: tree.CatalogID });
        if (data instanceof Array) {
          data.map((item) => {
            item.hasChildren = true;
          });
          resolve(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss">
.evaluation_not_validated {
  margin: 2px;
  position: relative;
  height: calc(100vh - 100px);

  .el-table--mini th,
  .top-container {
    width: 100%;
    height: 100%;

    .top-container-head {
      height: 32px;
    }

    .top-container-body {
      height: calc(100% - 34px);
      overflow-y: hidden;

      .top-container-body-tb {
        max-height: calc(100% - 37px);
      }
    }
  }

  .bottom-container {
    width: 100%;
    height: 100%;

    .bottom-container-head {
      height: 32px;
    }

    .bottom-container-body-tb {
      max-height: calc(100% - 65px);
    }
  }

  .el-tabs__header {
    margin: 3px;
  }

  .el-tabs__content {
    height: 100%;
  }

  .el-tab-pane {
    height: 100%;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-alert--info.is-light {
    background-color: #f4f4f5;
    color: #303133;
    font-weight: bold;
  }
}
</style>
