<template>
  <el-container class="department_overview">
    <el-header>
      <el-form
        :inline="true"
        class="demo-form-inline"
        size="small"
      >
        <el-form-item
          v-show="!FillingIn"
          label="科室部门"
          prop="DeptID"
        >
          <default-depts
            v-if="IsSelectOtherDept == 1"
            w="100%"
            :value="DeptID"
            @getDefaultDeptsValue="getDefaultDeptValues"
          />
          <span v-else>{{ DeptName }}</span>
        </el-form-item>
        <el-form-item v-show="!FillingIn">
          <el-button
            size="small"
            type="success"
            plain
            @click="SelectDeptCatalog(InsertVal.DeptID)"
          >查看条款
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-show="FillingIn"
            size="small"
            type="success"
            plain
            icon="el-icon-refresh-left"
            @click="FillingIn = !FillingIn"
          >返回
          </el-button>
        </el-form-item>
        <el-form-item v-if="IsSelectOtherDept == 1">
          <el-button
            size="small"
            type="success"
            plain
            @click="SelectDeptTemplate"
          >查看填写情况
          </el-button>
        </el-form-item>
        <el-form-item v-show="FillingIn">
          <el-input
            v-model="SelectDeptTemplateVal.DeptName"
            placeholder="请输入科室部门名称"
            size="small"
            clearable
            @keyup.enter.native="SelectDeptTemplate('搜索')"
          />
        </el-form-item>
        <el-form-item v-show="FillingIn">
          <el-select
            v-model="SelectDeptTemplateVal.WriteState"
            size="small"
            placeholder="请选择状态"
            @change="selectChang"
          >
            <el-option
              label="全部"
              value=""
            />
            <el-option
              label="已填写"
              value="已填写"
            />
            <el-option
              label="未填写"
              value="未填写"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="FillingIn">
          <el-button
            icon="el-icon-search"
            type="primary"
            plain
            size="small"
            @click="SelectDeptTemplate('搜索')"
          >搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="main">
      <el-form
        v-show="!FillingIn"
        ref="InsertVal"
        :rules="rules"
        :model="InsertVal"
        label-position="top"
      >
        <h2>一、科室概况</h2>
        <el-form-item
          label="科室简介："
          prop="Introduction"
        >
          <el-input
            v-model="InsertVal.Introduction"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '科室简介'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('科室简介')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="荣誉奖励："
          prop="HonorAward"
        >
          <el-input
            v-model="InsertVal.HonorAward"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '荣誉奖励'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('荣誉奖励')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <h2>二、党风廉政</h2>
        <el-form-item
          label="支部建设："
          prop="Construction"
        >
          <el-input
            v-model="InsertVal.Construction"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '支部建设'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('支部建设')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="行风管理："
          prop="TheEnhancement"
        >
          <el-input
            v-model="InsertVal.TheEnhancement"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '行风管理'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('行风管理')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <h2>三、管理规范</h2>
        <el-form-item
          label="科室制度："
          prop="DeptInst"
        >
          <el-input
            v-model="InsertVal.DeptInst"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '科室制度'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('科室制度')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="科室应急预案："
          prop="DeptPlan"
        >
          <el-input
            v-model="InsertVal.DeptPlan"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '科室应急预案'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('科室应急预案')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="岗位职责："
          prop="Responsibility"
        >
          <el-input
            v-model="InsertVal.Responsibility"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '岗位职责'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('岗位职责')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <h2>四、规范诊疗</h2>
        <el-form-item
          label="临床诊疗规范/指南："
          prop="Guide"
        >
          <el-input
            v-model="InsertVal.Guide"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '临床诊疗规范/指南'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('临床诊疗规范/指南')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="临床操作规范："
          prop="CZSpecification"
        >
          <el-input
            v-model="InsertVal.CZSpecification"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '临床操作规范'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('临床操作规范')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="科室诊疗规范："
          prop="ZLSpecification"
        >
          <el-input
            v-model="InsertVal.ZLSpecification"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '科室诊疗规范'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('科室诊疗规范')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <h2>五、准入审批</h2>
        <el-form-item
          label="资质授予："
          prop="QualificationAwarded"
        >
          <el-input
            v-model="InsertVal.QualificationAwarded"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '资质授予'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('资质授予')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>

        <el-form-item
          label="技术权限："
          prop="TechnicalAuthority"
        >
          <el-input
            v-model="InsertVal.TechnicalAuthority"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '技术权限'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('技术权限')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="技术项目："
          prop="TechnologyProject"
        >
          <el-input
            v-model="InsertVal.TechnologyProject"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '技术项目'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('技术项目')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="重大手术审批："
          prop="Surgery"
        >
          <el-input
            v-model="InsertVal.Surgery"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '重大手术审批'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('重大手术审批')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <h2>六、会议记录</h2>
        <el-form-item
          label="培训考核："
          prop="Training"
        >
          <el-input
            v-model="InsertVal.Training"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '培训考核'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('培训考核')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="业务学习："
          prop="Business"
        >
          <el-input
            v-model="InsertVal.Business"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '业务学习'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('业务学习')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <h2>七、质量安全</h2>
        <el-form-item
          label="①PDCA项目："
          prop="PDCA"
        >
          <el-input
            v-model="InsertVal.PDCA"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '①PDCA项目'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('①PDCA项目')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="②不良事件及RCA分析："
          prop="RCA"
        >
          <el-input
            v-model="InsertVal.RCA"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '②不良事件及RCA分析'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('②不良事件及RCA分析')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <h2>八、专类管理</h2>
        <el-form-item
          label="①医院感染："
          prop="Infection"
        >
          <el-input
            v-model="InsertVal.Infection"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '①医院感染'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('①医院感染')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="②药事管理："
          prop="Medicine"
        >
          <el-input
            v-model="InsertVal.Medicine"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '②药事管理'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('②药事管理')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="③医保管理："
          prop="Healthcare"
        >
          <el-input
            v-model="InsertVal.Healthcare"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '③医保管理'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('③医保管理')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="④器械耗材："
          prop="Instrument"
        >
          <el-input
            v-model="InsertVal.Instrument"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '④器械耗材'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('④器械耗材')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="⑤输血管理："
          prop="BloodTransfusion"
        >
          <el-input
            v-model="InsertVal.BloodTransfusion"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '⑤输血管理'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('⑤输血管理')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <h2>九、科研教学</h2>
        <el-form-item
          label="①科研管理："
          prop="ScientificResearch"
        >
          <el-input
            v-model="InsertVal.ScientificResearch"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '①科研管理'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('①科研管理')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="②临床试验："
          prop="ClinicalTrials"
        >
          <el-input
            v-model="InsertVal.ClinicalTrials"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '②临床试验'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('②临床试验')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="③教学管理："
          prop="Teaching"
        >
          <el-input
            v-model="InsertVal.Teaching"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '③教学管理'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('③教学管理')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <h2>十、患者服务</h2>
        <el-form-item
          label="①健康教育："
          prop="Education"
        >
          <el-input
            v-model="InsertVal.Education"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '①健康教育'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('①健康教育')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="②患者随访："
          prop="FollowUp"
        >
          <el-input
            v-model="InsertVal.FollowUp"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '②患者随访'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('②患者随访')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="③患者满意度："
          prop="Satisfaction"
        >
          <el-input
            v-model="InsertVal.Satisfaction"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '③患者满意度'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('③患者满意度')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <h2>十一、学科辐射</h2>
        <el-form-item
          label="①学术活动"
          prop="Academic"
        >
          <el-input
            v-model="InsertVal.Academic"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '①学术活动'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('①学术活动')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="②对外交流"
          prop="Communication"
        >
          <el-input
            v-model="InsertVal.Communication"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '②对外交流'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('②对外交流')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="③社会活动"
          prop="Activity"
        >
          <el-input
            v-model="InsertVal.Activity"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '③社会活动'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('③社会活动')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="④媒体宣传"
          prop="Propaganda"
        >
          <el-input
            v-model="InsertVal.Propaganda"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="item1.Type == '④媒体宣传'"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :before-upload="() => beforeUpload('④媒体宣传')"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-form
        v-show="!FillingIn"
        :inline="true"
        label-position="top"
        size="mini"
        :rules="rules"
      >
        <el-form-item label="上传科室资料:">
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :before-upload="() => beforeUpload('')"
            :on-success="handleSuccess"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button
              size="mini"
              type="primary"
            >选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="已传文件">
          <div
            v-for="(item1, index1) in InsertVal.DeptTemplateFile_dto"
            :key="index1"
          >
            <div
              v-if="!item1.Type"
              class="trExpand"
            >
              <div class="item1">
                <el-link
                  :href="item1.OpenFileUrl"
                  target="_blank"
                >{{
                  item1.FileName
                }}
                </el-link>
              </div>
              <div class="item2">
                <el-link
                  :href="item1.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </div>
              <div class="item3">
                <el-link
                  target="_blank"
                  @click="PreviewFile(item1.FileUrl)"
                >查看
                </el-link>
              </div>
              <div class="item4">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile(index1)"
                /></span>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <h2 v-show="!FillingIn">年度计划总结（包括年度总结、下年度计划）</h2>
      <el-table
        v-show="!FillingIn"
        :data="InsertVal.DeptTemplateDetail_dto"
        style="width: 100%"
        border
        height="calc(100vh - 450px)"
        size="mini"
        stripe
      >
        <el-table-column
          prop="Year"
          label="年度"
          width="120"
        >
          <template slot-scope="{ row }">
            <el-date-picker
              v-model="row.Year"
              type="year"
              placeholder="选择年"
              size="mini"
              format="yyyy"
              value-format="yyyy"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="Summary"
          label="计划总结"
        >
          <template slot-scope="{ row }">
            <el-input
              v-model="row.Summary"
              type="textarea"
              size="mini"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="上传计划总结附件"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-upload
              :multiple="true"
              :show-file-list="false"
              :on-success="handleSuccess2"
              class="editor-slide-upload"
              action="/api/RC_File/UploadFile"
            >
              <el-button
                size="mini"
                circle
                class="iconfont al-icon-tijiao1"
                @click="handleSuccessIndex(scope)"
              />
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column
          label="附件查看"
          prop="DeptTemplateFile_dto"
        >
          <template slot-scope="{ row }">
            <el-tag
              v-for="(item, index) in row.DeptTemplateFile_dto"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleClose1(index,row.DeptTemplateFile_dto)"
            >
              <el-link
                target="_blank"
                @click="PreviewFile(item.FileUrl)"
              >{{ item.FileName }}
              </el-link>
            </el-tag>

          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          width="60"
        >
          <template slot-scope="{ row, $index }">
            <span
              class="CatalogName"
              @click="deletes(row, $index)"
            >移除</span>
          </template>
        </el-table-column>
      </el-table>

      <transition name="el-zoom-in-center">
        <el-table
          v-show="FillingIn"
          v-loading="tableloading"
          :data="SelectDeptTableData"
          border
          style="width: 100%"
          size="mini"
          stripe
        >
          <el-table-column
            prop="DeptName"
            label="科室部门"
          >
            <template slot-scope="{ row }">
              <span
                style="cursor: pointer !important; color: #3e84e9"
                @click="selectDept(row)"
              >{{ row.DeptName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="WriteState"
            width="100"
            label="填写状态"
            align="center"
          />
        </el-table>
      </transition>
    </el-main>
    <el-footer>
      <el-row
        v-show="!FillingIn"
        type="flex"
        justify="space-between"
      >
        <el-col>
          <el-button
            v-show="activeName == 'second' ? false : true"
            size="small"
            icon="el-icon-plus"
            @click="Insert"
          ><span class="CatalogName">新增一条</span></el-button>
          <span
            v-show="activeName == 'second' ? false : true"
            class="CatalogName"
          >（最多添加50条）</span>
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            size="small"
            @click="InsertDeptTemplate('InsertVal')"
          >提交
          </el-button>
        </el-col>
      </el-row>
      <el-row v-show="FillingIn">
        <el-col :span="3">
          <el-switch
            v-model="cellOverflow"
            style="margin: 6px 0px"
            active-text="收起"
            inactive-text="展开"
          />
        </el-col>
        <el-col :span="20">
          <el-pagination
            :current-page="SelectDeptTemplateVal.pageIndex"
            :page-sizes="[10, 15, 20, 30, 50, 100]"
            :page-size="SelectDeptTemplateVal.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="SelectDeptTemplateVal.Total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
      <el-drawer
        :visible.sync="drawer"
        direction="btt"
        size="75%"
        :with-header="false"
      >
        <el-table
          v-loading="DeptCatalogLoading"
          :data="CatalogData"
          border
          style="width: 100%"
          height="calc(100vh - 280px)"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          size="mini"
          stripe
          @expand-change="expandChange"
        >
          <el-table-column type="expand">
            <template>
              <el-table
                :data="articleTable"
                style="width: 100%"
                border
                size="mini"
                height="calc(100vh - 280px)"
                stripe
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="50"
                  align="center"
                />
                <el-table-column
                  label="状态"
                  width="50"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      circle
                      size="mini"
                      round
                      :type="
                        scope.row.AuditStatus === 0
                          ? 'info'
                          : scope.row.AuditStatus === 1
                            ? 'success'
                            : 'danger'
                      "
                      @click="statusView(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Title"
                  label="标题"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div
                      style="cursor: pointer !important; color: #3e84e9"
                      @click="seeRow(scope.row)"
                    >
                      {{ scope.row.Title }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="CatalogCode"
                  label="条款"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="CatalogName"
                  label="条款内容"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="VersionNumber"
                  label="版本号"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="GroupName"
                  label="资料类别"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="AuthorName"
                  label="录入用户"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="录入时间"
                  align="center"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">{{
                    scope.row.CreatDate.split('T').join(' ')
                  }}
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="CatalogCode"
            label="评审标准"
          />
          <el-table-column
            prop="TypeName"
            label="章节"
          />
          <el-table-column
            prop="IsPoint"
            label="核心条款"
            width="80"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag
                size="mini"
                :type="row.IsPoint === 0 ? 'danger' : 'success'"
              >{{ row.IsPoint === 0 ? '否' : '是' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="CatalogName"
            label="标准内容"
          />
          <el-table-column
            v-if="menu_one != undefined"
            prop="ReviewName"
            :label="menu_one"
          />
          <el-table-column
            v-if="menu_two != undefined"
            prop="ManageName"
            :label="menu_two"
          />
          <el-table-column
            v-if="menu_three != undefined"
            prop="VisitName"
            :label="menu_three"
          />
        </el-table>
        <el-row
          type="flex"
          justify="end"
        >
          <el-button
            size="small"
            @click="drawer = false"
          >关闭
          </el-button>
        </el-row>
      </el-drawer>
    </el-footer>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex';
import defaultDepts from '@/views/components/defaultDepts';
import {
  DeleteDeptTemplate,
  InsertDeptTemplate,
  SelectDeptCatalog,
  SelectDeptTemplate,
  SelectDeptTemplateDetail,
  SelectMyDeptInfo,
  UpdateDeptTemplate
} from '@/api/RC_DeptTemplate';
import { PreviewFile, SelectArticle } from '@/api/Article';

export default {
  components: { defaultDepts },
  data() {
    return {
      value: '',
      val: {},
      InsertTable: [],
      InsertVal: {
        DeptTemplateFile_dto: [],
        DeptTemplateDetail_dto: [],
        CreateUserID: window.userInfo[0].UserID,
        DeptID: window.userInfo[0].DeptID
      },
      DeptTemplateVal: [],
      DeptID: -1,
      IsSelectOtherDept: window.IsSelectOtherDept, // 0:禁用科室基本情况选择部门 1：开启
      DeptName: '',
      InsertValId: '',
      tableDataLoading: '',
      tableData: [],
      tableData2: [],
      fileList: [],
      fileList2: [],
      rules: {
        Introduction: [
          { required: true, message: '请填写科室概况', trigger: 'blur' }
        ],
        HonorAward: [
          { required: true, message: '请填写荣誉奖励', trigger: 'blur' }
        ],
        Construction: [
          { required: true, message: '请填写支部建设', trigger: 'blur' }
        ],
        TheEnhancement: [
          { required: true, message: '请填写行风管理', trigger: 'blur' }
        ],
        DeptInst: [
          { required: true, message: '请填写科室制度', trigger: 'blur' }
        ],
        DeptPlan: [
          { required: true, message: '请填写科室应急预案', trigger: 'blur' }
        ],
        Responsibility: [
          { required: true, message: '请填写岗位职责', trigger: 'blur' }
        ],
        PDCA: [{ required: true, message: '请填写PDCA项目', trigger: 'blur' }],
        RCA: [
          {
            required: true,
            message: '请填写不良事件及RCA分析',
            trigger: 'blur'
          }
        ],
        ScientificResearch: [
          { required: true, message: '请填写科研管理', trigger: 'blur' }
        ],
        ClinicalTrials: [
          { required: true, message: '请填写临床试验', trigger: 'blur' }
        ],
        Teaching: [
          { required: true, message: '请填写教学管理', trigger: 'blur' }
        ],
        Academic: [
          { required: true, message: '请填写学术活动', trigger: 'blur' }
        ],
        Communication: [
          { required: true, message: '请填写对外交流', trigger: 'blur' }
        ],
        Activity: [
          { required: true, message: '请填写社会活动', trigger: 'blur' }
        ],
        Propaganda: [
          { required: true, message: '请填写媒体宣传', trigger: 'blur' }
        ]
      },
      CatalogData: [],
      menu_one: '',
      menu_two: '',
      menu_three: '',
      expands: [],
      articleTable: [],
      listQuery: {
        Title: '',
        GroupID: 0,
        CatalogID: '',
        Content: '1',
        VersionNumber: '',
        AuthorID: window.userInfo[0].UserID
      },
      DeptCatalogLoading: false,
      tabsShow: false,
      DeptsData: [],
      drawer: false,
      filetype: '',
      activeName: 'first',
      FillingIn: false,
      SelectDeptTableData: [],
      SelectDeptTemplateVal: {
        pageIndex: 1,
        pageSize: 15,
        Total: 0,
        DeptName: '',
        WriteState: ''
      },
      cellOverflow: false,
      tableloading: false,
      expandChangeIndex: -1
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectMyDeptInfo();
  },
  mounted() {
    this.getIni();
  },
  methods: {
    // 年度计划总结附件点击叉叉关闭后的事件
    handleClose1(index, DeptTemplateFile_dto) {
      DeptTemplateFile_dto.splice(index, 1);
    },
    async SelectMyDeptInfo() {
      const data1 = await SelectMyDeptInfo({
        DeptID: window.userInfo[0].DeptID,
        DeptName: window.userInfo[0].DeptName
      });
      this.DeptID = data1.data.DeptID;
      this.DeptName = data1.data.DeptName;

      const { data } = await SelectDeptTemplateDetail({
        DeptID: this.DeptID
      });
      this.DeptTemplateVal = data.Introduction;
      if (!data.Introduction) {
        this.InsertVal = {
          DeptTemplateFile_dto: [],
          DeptTemplateDetail_dto: [],
          CreateUserID: window.userInfo[0].UserID,
          DeptID: data1.data.DeptID
        };
      } else {
        this.InsertVal = data;
      }
    },
    async SelectDeptTemplateDetail(val) {
      try {
        const { data } = await SelectDeptTemplateDetail({
          DeptID: val
        });
        this.DeptTemplateVal = data.Introduction;
        if (!data.Introduction) {
          this.InsertVal = {
            DeptTemplateFile_dto: [],
            DeptTemplateDetail_dto: [],
            CreateUserID: window.userInfo[0].UserID,
            DeptID: this.InsertVal.DeptID
          };
        } else {
          this.InsertVal = data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    beforeUpload(val) {
      this.filetype = val;
    },
    handleSuccess(response, file) {
      if (response.code === 200) {
        const data = response.data[0];
        this.InsertVal.DeptTemplateFile_dto.push({
          FileName: data.FileName,
          FileUrl: data.FileUrl,
          OpenFileUrl: data.OpenFileUrl,
          Type: this.filetype
        });
      } else {
        this.InsertVal.DeptTemplateFile_dto = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    deleteMeetingFile(index) {
      this.InsertVal.DeptTemplateFile_dto.splice(index, 1);
    },
    handleSuccess2(response, file) {
      if (response.code === 200) {
        const data = response.data[0];
        this.InsertVal.DeptTemplateDetail_dto[
          this.InsertValId
        ].DeptTemplateFile_dto.push({
          FileName: data.FileName,
          FileUrl: data.FileUrl,
          OpenFileUrl: data.OpenFileUrl
        });
        this.$message.success('上传成功');
      } else {
        this.InsertVal.DeptTemplateDetail_dto[
          this.InsertValId
        ].DeptTemplateFile_dto = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    Insert() {
      this.InsertVal.DeptTemplateDetail_dto =
        this.InsertVal.DeptTemplateDetail_dto == null
          ? []
          : this.InsertVal.DeptTemplateDetail_dto;
      if (this.InsertVal.DeptTemplateDetail_dto.length == 50) {
        this.$message.warning('最多添加50条');
        return;
      }
      this.InsertVal.DeptTemplateDetail_dto.push({
        Year: '',
        Summary: '',
        DeptTemplateFile_dto: []
      });
    },

    async InsertDeptTemplate(InsertVal) {
      this.$refs[InsertVal].validate(async valid => {
        if (valid) {
          // 提交
          try {
            const { code } =
              this.DeptTemplateVal == null
                ? await InsertDeptTemplate(this.InsertVal)
                : await UpdateDeptTemplate(this.InsertVal);
            if (code === 200) {
              this.$message.success('成功！');
              this.SelectDeptTemplateDetail(this.InsertVal.DeptID);
            }
          } catch (error) {
            this.$message.error('失败了！');
          }
        } else {
          return false;
        }
      });
    },
    async DeleteDeptTemplate(row) {
      if (window.userInfo[0].userName != row.CreateUserID) {
        if (window.userInfo[0].RoleName != '系统管理员') {
          this.$message.warning('只有上传人和管理员才能删除哦！');
          return;
        }
      }
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data, code } = await DeleteDeptTemplate({
            DeptTemplateID: row.DeptTemplateID
          });
          if (code == 200) {
            this.$message.success('删除成功');
          }
        })
        .catch(() => {
        });
    },
    async SelectDeptCatalog(val) {
      try {
        this.DeptCatalogLoading = true;
        this.drawer = true;
        const { data } = await SelectDeptCatalog({ DeptID: val });
        this.CatalogData = data.DataList;
      } catch (error) {
      }
      this.DeptCatalogLoading = false;
    },
    handleSuccessIndex(scope) {
      this.InsertValId = scope.$index;
    },
    deletes(row, $index) {
      this.InsertVal.DeptTemplateDetail_dto.splice($index, 1);
    },
    getDefaultDeptValues(val) {
      this.InsertVal.DeptID = val;
      this.SelectDeptTemplateDetail(val);
      // this.SelectDeptCatalog(val);
    },
    async getIni() {
      const para = this.$store.getters.iniPara;
      this.menu_one = para.menu_one;
      this.menu_two = para.menu_two;
      this.menu_three = para.menu_three;
    },
    async expandChange(row, expandedRows) {
      const { data } = await SelectArticle({
        CatalogID: row.CatalogID,
        pageIndex: 1,
        pageSize: 500
      });
      this.articleTable = data.DataList;
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.CatalogID);
        }
      } else {
        this.expands = [];
      }
    },
    getRowKeys(row) {
      return row.CatalogID;
    },
    seeRow(row) {
      this.listQuery = row;
    },
    handleClose(done) {
      done();
    },
    async PreviewFile(val) {
      /* 资料预览 */
      val = val.replace(/Annex\/file\/|\//g, '');
      const { data } = await PreviewFile({ Title: val });
      this.$nextTick(() => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = data;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
      });
    },
    async SelectDeptTemplate(value) {
      try {
        this.tableloading = true;
        this.SelectDeptTemplateVal.pageIndex =
          value == '搜索' ? 1 : this.SelectDeptTemplateVal.pageIndex;
        const { data } = await SelectDeptTemplate(this.SelectDeptTemplateVal);
        this.SelectDeptTableData = data.DataList;
        this.SelectDeptTemplateVal.Total = data.Total;
        this.FillingIn = true;
      } catch (error) {
        console.log(error);
      }
      this.tableloading = false;
    },
    handleSizeChange(val) {
      this.SelectDeptTemplateVal.pageSize = val;
      this.SelectDeptTemplate();
    },
    handleCurrentChange(val) {
      this.SelectDeptTemplateVal.pageIndex = val;
      this.SelectDeptTemplate();
    },
    selectChang(val) {
      this.SelectDeptTemplateVal.pageIndex = 1;
      this.SelectDeptTemplateVal.WriteState = val;
      this.SelectDeptTemplate();
    },
    selectDept(row) {
      this.DeptID = '';
      this.DeptID = row.DeptID;
      this.DeptName = row.DeptName;
      this.FillingIn = false;
      this.SelectDeptTemplateDetail(row.DeptID);
    }
  }
};
</script>
<style lang="scss">
.department_overview {
  .el-header {
    height: 40px !important;
    padding: 3px 0 0 0px;
  }

  .el-main {
    padding: 0 0px;
    height: calc(100vh - 180px);
    overflow-y: auto;
  }

  .el-footer {
    overflow-y: auto;
    height: 700px;
  }

  .CatalogName {
    cursor: pointer !important;
    color: #3e84e9;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100px;
  }

  .el-table__expanded-cell[class*='cell'] {
    padding: 0 !important;
  }

  .htmlPane {
    height: 400px;
    border: 2px solid whitesmoke;
    border-radius: 5px;
    padding: 5px;
    overflow-y: auto;
  }

  .Dept {
    height: 380px;
    overflow-y: auto;
    border: 1px solid red;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  .el-form-item__content {
    line-height: 30px;
  }

  .el-loading-spinner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    -webkit-animation: typing 1s linear infinite alternate;
    -moz-animation: Typing 1s linear infinite alternate;
    animation: typing 1s linear infinite alternate;
    margin: 0px auto; /* Not necessary- its only for layouting*/
    position: relative;
    left: -40px;
  }

  @-webkit-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }

  @-moz-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }
  @keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(0, 184, 220, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(249, 54, 0, 0.2),
      80px 0px 0px 0px rgb(2, 243, 130);
    }
  }

  .el-loading-spinner .circular {
    display: none; //隐藏之前element-ui默认的loading动画
  }

  .trExpand {
    display: flex;
    min-width: 900px;
    border: 1px solid #b8bcc5;

    .item1 {
      flex: 3;
      border-right: 1px solid #b8bcc5;
    }

    .item2 {
      flex: 1;
      text-align: center;
      border-right: 1px solid #b8bcc5;
    }

    .item3 {
      flex: 1;
      text-align: center;
      border-right: 1px solid #b8bcc5;
    }

    .item4 {
      flex: 1;
      text-align: center;
      border-right: 1px solid #b8bcc5;
    }
  }
}
</style>
