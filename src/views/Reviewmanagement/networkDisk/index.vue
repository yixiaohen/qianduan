<template>

  <div class="container">


    <!--导航菜单开始-->
    <el-row class="nav">
      <el-col :span="14">
        <i class="el-icon-arrow-left" @click="goBack"/>
        <i v-show="isShowGo1" class="el-icon-arrow-right"/>
        <i
          v-show="isShowGo2"
          style="opacity: 1"
          class="el-icon-arrow-right"
          @click="dirEnter(nowmDirectoryID,nowDirectoryName)"
        />

        <!--        刷新重回首页-->
        <i class="el-icon-refresh-left" @click="refreshDisk"/>
        <!--    面包屑导航开始-->
        <el-breadcrumb v-for="item in brname" v-model="brname" separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/reviewmanagement/networkDisk' }">{{ item }} ></el-breadcrumb-item>
        </el-breadcrumb>
        <!--    面包屑导航结束-->

      </el-col>
      <el-col :span="10">
        <!-- 搜索开始-->
        <div style="width:60vh;height: 100%;">
          <el-input
            v-model="inputFileName"
            class="my-input"
            clearable
            placeholder="请输入搜索内容"
          >el-
          </el-input>
          <el-button type="primary" style="font-size: 2vh;" @click="SearchFiles">搜索</el-button>

        </div>

        <!--        搜索结束-->
      </el-col>
    </el-row>

    <!--导航菜单结束-->
    <!--头部操作标签开始-->
    <el-row class="myrow">
      <!-- 左边栏开始-->
      <el-col :span="8" class="Operation1">

        <!--          新建文件夹开始-->
        <el-button type="primary" plain style="font-size: 2vh;" size="mini" @click="adddirdialogVisible=true">
          <i class="el-icon-folder-add"/> 新建文件夹
        </el-button>
        <!--        添加附件开始-->
        <el-upload
          :on-success="addAccessory"
          action="/api/RC_File/UploadFile"
          class="upload-demo"
          multiple
          :file-list="FilsList"
          :show-file-list="false"
        >
          <el-button :loading="false" type="primary" plain style="font-size: 2vh;" size="mini">
            <i class="el-icon-upload2"/>上传资料
          </el-button>

        </el-upload>
        <!--        添加附件结束-->


      </el-col>
      <!-- 左边栏结束-->

      <!--中间栏开始-->
      <el-col v-show="isShowOperation" :span="8" class="Operation2">
        <!-- 下载开始-->

        <el-button
          v-show="isShowDownload"
          type="primary"
          plain
          size="mini"
          style="font-size: 2vh;"
          @click="fileEnter(nowMeanID, nowFileName,nowFileUrl)"
        >
          <i class="el-icon-download"/>
          下载（预览）
        </el-button>


        <!-- 下载结束-->
        <!-- 重命名开始-->
        <!--        重命名文件夹按钮-->
        <el-button
          v-show="isShowDirRename"
          type="primary"
          plain
          size="mini"
          style="font-size: 2vh;"
          @click="renameDir"
        >
          <i class="el-icon-edit-outline"/>
          重命名
        </el-button>
        <!--        重命名文件按钮-->
        <el-button
          v-show="isShowFileRename"
          type="primary"
          plain
          size="mini"
          style="font-size: 2vh;"
          @click="renameFile"
        >
          <i class="el-icon-edit-outline"/>
          重命名
        </el-button>
        <!--重命名结束-->

        <!-- 复制到开始-->
        <!--        <el-button type="primary" plain size="small">-->
        <!--          <i class="el-icon-document-copy"/>-->
        <!--          复制到-->
        <!--        </el-button>-->
        <!--        &lt;!&ndash;复制到结束&ndash;&gt;-->

        <!-- 移动到开始-->
        <el-button
          v-show="isShowMoveFileBtn"
          type="primary"
          plain
          size="mini"
          style="font-size: 2vh"
          @click="openMoveFileDialog"
        >
          <i class="el-icon-top-right"/>
          移动到
        </el-button>
        <!--移动到结束-->

      </el-col>
      <!--中间栏栏结束-->
      <!--      右边栏开始-->
      <el-col v-show="isShowOperation" :span="6" class="Operation3">


        <!-- 删除文件夹开始-->
        <el-button v-show="isShowDelDir" type="danger" plain size="mini" style="font-size: 2vh;" @click="delDirJudge">
          <i class="el-icon-delete"/>
          删除此目录
        </el-button>
        <!-- 删除文件夹结束-->

        <!-- 删除文件开始-->
        <el-button
          v-show="isShowDelFile"
          type="danger"
          plain
          size="mini"
          style="font-size: 2vh;"
          @click="delFileJudge"
        >
          <i class="el-icon-delete"/>
          删除此文件
        </el-button>
        <!-- 删除文件结束-->


        <!-- 批量删除开始-->
        <!--        <el-button type="danger" plain size="medium">-->
        <!--          <i class="el-icon-delete-solid"></i>-->
        <!--          批量删除-->
        <!--        </el-button>-->
        <!--批量删除结束-->
      </el-col>
      <!--      右边栏结束-->
    </el-row>
    <!--头部操作标签结束-->

    <!-- 展示以文件图标样式开始-->
    <!--    <el-card class="box-card">-->
    <el-card class="box-card el-card__body">
      <!--文件夹显示开始-->
      <div v-show="isShowFileList" class="filelist">
        <ul class="sUl1">
          <li
            v-for="(item,index) in dirData"
            class="file-item"
            @click="fileDirItemClick(item.mDirectoryID,item.DirectoryName,index)"
            @dblclick="dirEnter(item.mDirectoryID,item.DirectoryName)"
          >
            <div class="file1">
              <i v-show="indexFile1===index" class="el-icon-success"/>
              <div class="folderIcon">
                <i class="el-icon-folder-opened"/>
              </div>
              <div v-show="item.DirectoryName===nowDirectoryName ? false:isShowTotalName1" class="file2">
                {{ item.DirectoryName | guolvwenjian }}
              </div>
              <div v-show="item.DirectoryName===nowDirectoryName ? isShowTotalDirName2 : false " class="file2"> {{
                  item.DirectoryName
                                                                                                                }}
              </div>
            </div>
          </li>
          <!--文件夹显示结束-->
          <!--        文件显示开始-->
          <li
            v-for="(item,index) in fileData"
            class="file-item"
            @click="fileItemClick(item.MeanID,item.FileName,item.FileUrl,index)"
            @dblclick="fileEnter(item.MeanID,item.FileName,item.FileUrl)"
          >
            <div class="file1">
              <i v-show="indexFile2===index" class="el-icon-success"/>
              <i  v-if="(/^.+(\.docx)$/).test(item.FileName)"  class="el-icon-document"/>
              <i  v-else-if="(/^.+(\.doc)$/).test(item.FileName)"  class="el-icon-tickets"/>
              <i  v-else-if="(/^.+(\.pdf)$/).test(item.FileName)"  class="el-icon-mobile"/>
              <i  v-else-if="(/^.+(\.doc)$/).test(item.FileName)"  class="el-icon-tickets"/>
              <i  v-else-if="(/^.+(\.txt)$/).test(item.FileName)"  class="el-icon-document-remove"/>
              <i  v-else-if="(/^.+(\.jpg)$/).test(item.FileName)"  class="el-icon-picture-outline"/>
              <i  v-else-if="(/^.+(\.png)$/).test(item.FileName)"  class="el-icon-picture-outline"/>
              <i  v-else-if="(/^.+(\.jpeg)$/).test(item.FileName)"  class="el-icon-picture-outline"/>
              <i  v-else-if="(/^.+(\.gif)$/).test(item.FileName)"  class="el-icon-picture-outline"/>
              <i  v-else-if="(/^.+(\.mp4)$/).test(item.FileName)"  class="el-icon-video-camera-solid"/>
              <i  v-else-if="(/^.+(\.zip)$/).test(item.FileName)"  class="el-icon-s-cooperation"/>
              <i  v-else-if="(/^.+(\.rar)$/).test(item.FileName)"  class="el-icon-s-cooperation"/>
              <i  v-else class="el-icon-reading"/>
              <div v-show="item.FileName===nowFileName ? false:isShowTotalName1" class="file2">
                {{ item.FileName | guolvwenjian }}
              </div>
              <div v-show="item.FileName===nowFileName ? isShowTotalName2 : false " class="file2"> {{
                  item.FileName                                                                                                }}
              </div>
            </div>
          </li>
        </ul>
        <div v-show="isShowShu" class="not">
          <span>暂无数据</span>
        </div>
      </div>

      <!--        搜索后呈现文件结束-->
      <!--      搜索后展示的文件夹和文件结束-->
    </el-card>
    <!--    </el-card>-->
    <!-- 展示以文件图标样式结束-->

    <!--添加目录弹框-->
    <el-dialog
      :visible.sync="adddirdialogVisible"
      title="添加目录"
      width="40%"
      @close="addDialogClosed"
    >
      <el-input
        ref="addDialogRef"
        v-model="dir.DirectoryName"
        placeholder="请输入目录"
        type="text"
      />
      <!--      <span>这是一段信息</span>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddirdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertDirectory">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 弹出对话框开始-->
    <el-dialog :visible.sync="textdialogFormVisible" title="添加文本记录">
      <el-form>
        <el-form-item label="标题">
          <el-input v-model="title"/>
        </el-form-item>
        <el-form-item label="内容">
          <!--                富文本编辑器-->
          <quill-editor v-model="content"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="textdialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="textdialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出对话框结束-->


    <!--重命名文件夹弹窗-->
    <el-dialog title="请输入文件夹名称" :visible.sync="renamedialogFormVisible">
      <el-form>
        <el-form-item label="文件夹名称:">
          <el-input v-model="nowDirectoryName"/>
        </el-form-item>

      </el-form>
      <div class="dialog-footer">
        <el-button @click="renamedialogOut">取 消</el-button>
        <el-button type="primary" @click="renamedialogForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--重命名文件弹窗-->
    <el-dialog title="请输入文件名称" :visible.sync="renameFileFormVisible">
      <el-form>
        <el-form-item label="文件名称:">
          <el-input v-model="nowFileName"/>
        </el-form-item>

      </el-form>
      <div class="dialog-footer">
        <el-button @click="renameFileOut">取 消</el-button>
        <el-button type="primary" @click="renameFileForm">确 定</el-button>
      </div>
    </el-dialog>
    <!--    移动文件对话框-->
    <el-dialog title="请选择移动到" :visible.sync="isShowMovingFileDialog">

      <el-tree
        ref="dirTree"
        class="lineTree"
        :data="baseDir"
        :props="defaultProps"
        node-key="mDirectoryID"
        highlight-current
        default-expand-all
        show-checkbox
        accordion
        check-strictly
        check-on-click-node

        @check="handleCheckChangeArea"
      />
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="handleNodeClick">确 定</el-button>

    <el-button size="mini" @click="isShowMovingFileDialog = false" >取 消</el-button>
  </span>
    </el-dialog>


  </div>


</template>

<script>
// 导入目录的增删改查api接口，分别是删除目录、插入目录、根据父级查子集、查全部SelectDirectorys,修改目录
import {
  DeleteDirectory,
  InsertDirectory,
  SelectDirectory,
  SelectDirectorys,
  UpdateDirectory
} from '@/api/reviewmanagement/networkDisk/MeanDirectory';

// 导入文件的增删改查api接口，分别是根据目录id查询目录和文件,根据网盘文件名搜索，上传资料到云盘，删除文件
import {
  Andmean,
  DeleteMean,
  InsertMean,
  SelectMeanOrDirName,
  UpdateMeanMove
} from '@/api/reviewmanagement/networkDisk/Mean';

// 预览文件的接口
import { PreviewFile } from '@/api/Article';

export default {
  name: 'NetworkDisk',
  filters: {
    guolvwenjian(val) {
      const data = [];
      data.push(val);
      let obj = {};
      obj = data.join('');
      const newa = [];

      for (var i in obj) {
        newa.push(obj[i]);
      }
      // while (newa.length > 10) {
      //   newa.splice(-6, 1);
      //   newa.splice(-4, 0, '...');
      // }

      // if (newa.length <= 7) {
      //   newa.shift();
      // }
      // if (newa.length === 6) {
      //   newa.shift();
      // }
      obj = '';
      obj = newa.join('');
      val = obj;
      //
      return val;
    }

  },
  data() {
    return {
      baseDir: [{
        mDirectoryID: 0,
        DirectoryName: '个人网盘',
        Children: []
      }],
      dirTitle: '',
      dir: {
        mDirectoryID: 0,
        DirectoryName: '',
        FileUrl: '',
        ParentID: 0
      },
      selected: {
        // color:'red'
        // background-image:'url(./file_txt.png)'
      },

      isShowfile: true, // 是否显示父级文件夹
      isShowfile2: false, // 是否显示子代文件夹
      isShowOperation: false, // 是否显示头部操作栏右边的标签
      isShowFileList: true, // 是否显示文件列表
      isShowSerachList: false, // 是否显示文件搜索列表
      isShowIcon: false, // 是否显示选中文件后的图标提示
      isShowGo1: true, // 是否显示下一层级灰暗的小图标
      isShowGo2: false, // 是否显示下一层级高亮的小图标
      isShowDownload: false, // 是否显示下载图标
      isShowDelDir: false, // 是否显示删除文件夹按钮
      isShowDelFile: false, // 是否显示删除文件按钮
      isShowDirRename: false, // 是否显示重命名文件夹按钮
      isShowFileRename: false, // 是否显示重命名文件夹按钮
      isShowTotalName1: true, //  是否显示省略文件名
      isShowTotalName2: false, // 是否显示全部文件名
      isShowTotalDirName1: true, //  是否显示省略文件夹名
      isShowTotalDirName2: false, // 是否显示全部文件夹名
      isShowMoveFileBtn: false, // 是否显示移动文件按钮
      isShowMovingFileDialog: false, // 是否显示移动文件对话框
      brname: ['个人网盘'], // 面包屑字段
      brname2: ['个人网盘'], // 面包屑不省略字段
      zancun: [],

      nowId: 0, // 当前目录下id
      textdialogFormVisible: false, // 判断是否显示添加文本弹出框
      adddirdialogVisible: false,
      renamedialogFormVisible: false, // 判断是否显示重命名文件夹弹框
      renameFileFormVisible: false, // 判断是否显示重命名文件弹框
      isShowShu: false, // 是否显示“暂无数据”
      nowmDirectoryID: 0, // 当前单击的文件夹目录id
      nowDirectoryName: '', // 当前单击的文件夹目录名称
      nowMeanID: 0, // 当前单击的文件id
      nowFileName: '', // 当前单击的文件名称
      nowFileUrl: '', // 当前单击的文件url地址
      // nowParentID: 0, // 当前父级文件夹的id
      inputFileName: '', // 搜索框输入的内容
      title: '', // 富文本编辑器中的标题
      content: '', // 富文本编辑器中的内容
      indexFile1: -1, // 点击的文件夹下标
      indexFile2: -1, // /点击的文件下标
      goBackNum: 0, // 记录层级的起始数
      recordDirId: [], // 记录双击后的nowId总数
      fileList: {
        mDirectoryID: 0,
        FileName: '',
        FileUrl: '',
        CreateUserID: window.userInfo[0].UserID

      },
      FilsList: [],
      // 上传的文件列表
      totalData: [], // 根据目录id获取而来的文件夹及文件
      dirData: [], // 存储文件夹
      fileData: [], // 存储文件
      SearchFile: [], // 存储搜索出来的文件数据
      SearchFileDir: [], // 存储搜索出来的文件夹数据
      DirName: [], // 文件夹名
      onmitDirName: [], // 省略的文件夹名字
      newDirName: [], // 新的的文件夹名字
      // TransferObj:{}
      treeData: [],
      defaultProps: {

        children: 'Children',
        label: 'DirectoryName'
      },
      toMoveRes: [], // 要移动资料所在的文件目录id
      toMoveDirId: 0,
      toMoveDirName: ''

    };
  },
  created() {
    this.SelectDirectorys();
    this.Andmean();

  },

  methods: {
    // 刚进网盘获取目录和数据
    async SelectDirectorys() {
      try {
        const { data } = await SelectDirectorys();
        this.treeData = data;
        console.log(this.treeData);
      } catch (error) {
        console.log(error);
      }
    },

    async Andmean() {
      try {
        const { data } = await Andmean({ mDirectoryID: this.nowId });
        this.totalData = data;
        this.fileData = data.MeanList;// 存储文件内容
        this.dirData = data.DirectoryList;// 存储文件夹内容
        if (this.fileData === '' && this.dirData === '') {
          this.isShowShu = true;// 如何没有数据显示“暂无数据”
        }
      } catch (error) {
        console.log(error);
      }
    },


    // 操作按钮
    // 回退上一层级
    goBack() {
      if (this.recordDirId.length === 0) {
        this.nowId = 0;
        this.mDirectoryID = 0;
        this.Andmean();
        this.brname = ['个人网盘'];
        this.isShowShu = false;// 如果有数据隐藏“暂无数据”
        this.$message.info('已返回第一层级！');
      } else {
        this.nowId = this.recordDirId[this.recordDirId.length - 2];
        this.Andmean();
        this.recordDirId.pop();// 如果回退了删除记录的最后一个
        this.brname.pop();// 删掉最后一个
        if (this.recordDirId.length === 0) {
          this.nowId = 0;
          this.mDirectoryID = 0;
          this.Andmean();
          this.brname = ['个人网盘'];
          this.isShowShu = false;// 如果有数据隐藏“暂无数据”
          this.$message.info('已返回第一层级！');
        }
      }
    },
    // 刷新返回网盘首页
    refreshDisk() {
      this.$router.push('/reviewmanagement/networkDisk');
      this.nowmDirectoryID = 0;// 将再次查询全部目录和文件的0赋值给nowId，使得Andmean的参数变化视图跟着改变
      this.nowId = 0;// 将再次查询全部目录和文件的0赋值给nowId，使得Andmean的参数变化视图跟着改变
      this.Andmean();// 再次查找数据，显示视图
      this.brname = ['个人网盘'];// 重置面包屑字段
      this.recordDirId = [];// 返回第一层了，就把层级记录给重置
      this.indexFile1 = -1;// 赋值一个不存在的下标，使得勾选图标的v-show为false,隐藏单击文件后的勾选图标
      this.indexFile2 = -1;// 赋值一个不存在的下标，使得勾选图标的v-show为false,隐藏单击文件的勾选图标
      this.$message.success('已重新加载');// 提示语
      this.inputFileName = '';// 清除搜索框
      this.isShowShu = false;// 隐藏“暂无数据”提示
      this.isShowOperation = false; // 隐藏右边操作栏
    },
    // 重命名文件夹名
    renameDir() {
      this.renamedialogFormVisible = true;// 将重命名文件夹对话框打开
    },
    renamedialogOut() {
      this.renamedialogFormVisible = false;
      this.$message.info('取消修改');
    },
    // 重命名文件夹对话框操作
    async renamedialogForm() {
      try {
        const { data } = await UpdateDirectory({
          mDirectoryID: this.nowmDirectoryID,
          DirectoryName: this.nowDirectoryName
        });
        if (data === 1) {
          this.$message.success('重命名成功');
          this.renamedialogFormVisible = false;// 关闭修改框
          this.DirectoryName = '';// 清除已输入的数据
          this.Andmean();
          this.isShowGo1 = true;// 单击后将灰暗的下一层级图标显示
          this.isShowGo2 = false;// 单击后将高亮的下一层级图标隐藏
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 重命名文件名
    renameFile() {
      this.renameFileFormVisible = true; // 将重命名文件对话框打开
    },
    renameFileOut() {
      this.renameFileFormVisible = false; // 将重命名文件对话框关闭
      this.$message.info('取消修改');
    },
    // 重命名文件名提交
    async renameFileForm() {
      try {
        const { data } = await InsertMean({
          MeanID: this.nowMeanID,
          mDirectoryID: this.nowmDirectoryID,
          FileName: this.nowFileName,
          FileUrl: this.nowFileUrl,
          CreateUserID: window.userInfo[0].UserID
        });
        // console.log('现在的url是' + this.nowFileUrl);
        if (data === 1) {
          this.$message.success('重命名成功');
          this.renameFileVisible = false;// 关闭修改框
          this.nowFileName = '';// 清除已输入的数据
          this.Andmean();
          this.isShowGo1 = true;// 单击后将灰暗的下一层级图标显示
          this.isShowGo2 = false;// 单击后将高亮的下一层级图标隐藏
          this.renameFileFormVisible = false; // 将重命名文件对话框关闭
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 打开移动文件对话框
    openMoveFileDialog() {
      this.isShowMovingFileDialog = true;
      this.baseDir[0].Children = this.treeData; // 将获取的树形数据，加入具有根目录“个人网盘”的数组中
      this.SelectDirectorys();
    },

    // 当复选框被点击的时候触发 ，树形控件实现单选
    handleCheckChangeArea(data) {
      var labvalojb = data; // 暂存选中节点
      // console.log(data);
      this.$refs.dirTree.setCheckedKeys([]); // 删除所有选中节点
      this.$refs.dirTree.setCheckedNodes([labvalojb]); // 选中已选中节点
    },
    // 移动资料
    handleNodeClick() {
      this.toMoveRes = this.$refs.dirTree.getCheckedNodes(); // 获取移动到所在的目录数据
      this.toMoveDirId = this.toMoveRes[0].mDirectoryID;
      this.toMoveDirName = this.toMoveRes[0].DirectoryName;
      if (this.toMoveDirId === 0) {
        this.brname = [];// 如果是移到根目录重置面包屑字段
      }
      this.UpdateMeanMove(); // 移动到相应目录

      this.dirEnter(this.toMoveDirId, this.toMoveDirName); // 页面跳到相应目录
      this.isShowMovingFileDialog = false; // 关闭对话框
    },
    // 移动资料处理
    async UpdateMeanMove() {
      try {
        const { code } = await UpdateMeanMove({
          MeanID: this.nowMeanID,
          mDirectoryID: this.toMoveDirId
        });
        if (code === 200) {
          this.$message.success('移动成功');
        } else {
          this.$message.error('移动失败');
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 搜索框
    async SearchFiles() {
      if (this.inputFileName === '') {
        this.$message.warning('请输入搜索内容');
      } else {
        try {
          const { data } = await SelectMeanOrDirName({ name: this.inputFileName });
          this.dirData = [];
          this.fileData = [];
          // console.log(data[0]);
          // console.log('得到的数据是' + data);
          for (let i = 0; i < data.length; i++) {
            // console.log(data[i].FileUrl);
            if (data[i].MeanID === null) {
              this.dirData.push(data[i]);
            } else {
              this.fileData.push(data[i]);
            }
          }
          // this.dirData.push(data[3]);
          console.log(this.dirData);
          console.log(this.fileData);
          this.isShowDirRename = false;// 搜索完成后将两个重命名的按钮都隐藏
          this.isShowFileRename = false;
          this.isShowDownload = false;// 搜索后将下载、移动到，删除此文件，删除此目录隐藏

          this.isShowMoveFileBtn = false;

          this.isShowDelFile = false;

          this.isShowDelDir = false;
          // console.log('目录是' + this.dirData);
          // console.log('文件是' + this.fileData);
          // this.Andmean();
          this.brname = ['个人网盘'];// 面包屑恢复原样
          this.$message.success('已查找完成！');
          // console.log('得到的数据' + data);
          if (data.length === 0) {
            this.isShowGo1 = true;// 单击后将灰暗的下一层级图标显示
            this.isShowGo2 = false;// 单击后将高亮的下一层级图标隐藏
            this.isShowShu = true;// 如果没有数据显示“暂无数据”
            this.brname = ['个人网盘'];// 面包屑恢复原样
          } else {
            this.isShowGo1 = true;// 单击后将灰暗的下一层级图标显示
            this.isShowGo2 = false;// 单击后将高亮的下一层级图标隐藏
            this.isShowShu = false;// 如果有数据隐藏“暂无数据”
            this.brname = ['个人网盘'];// 面包屑恢复原样
          }
        } catch (error) {
          console.log(error);
        }
      }
    },

    // 单击了文件夹的事件处理
    fileDirItemClick(mDirectoryID, DirectoryName, index) {
      this.nowmDirectoryID = mDirectoryID;// 将现在所单击的文件夹id存到nowmDirectoryID
      this.nowDirectoryName = DirectoryName;// 将现在所单击的文件夹名称存到nowDirectoryName
      console.log('此目录id为' + mDirectoryID);
      this.indexFile1 = index;// 将点击后文件夹的下标存在indexFile中
      this.indexFile2 = -1;// 选中了文件夹就把选中的文件勾选去掉
      this.isShowIcon = true;// 单击选中后显示左上角的勾选图标
      this.isShowOperation = true;// 显示操作栏
      this.isShowDownload = false;// 点击文件夹之后将下载的按钮隐藏
      this.isShowGo1 = false;// 单击后将灰暗的下一层级图标隐藏
      this.isShowGo2 = true;// 单击后将高亮的下一层级图标显示
      this.isShowDelDir = true;// 单击后将删除文件夹按钮显示
      this.isShowDelFile = false;// 单击后将删除文件按钮隐藏
      this.isShowDirRename = true; // 显示重命名文件夹按钮
      this.isShowFileRename = false;// 将重命名文件按钮隐藏
      this.isShowMoveFileBtn = false; // 将移动到按钮隐藏
      this.isShowTotalDirName2 = true; // 一开始时隐藏全部文件夹名的,后因单击了给文件,此时将他显示
      console.log('当前点击的是' + this.indexFile);
    },

    // 单击文件的事件处理
    fileItemClick(MeanID, FileName, FileUrl, index) {
      this.nowMeanID = MeanID;// 将现在所单击的文件id存到nowMeanID
      this.nowFileName = FileName;// 将现在所单击的文件名称存到nowFileName
      this.nowFileUrl = FileUrl;// 将现在所单击的文件名称存到nowFileName
      this.indexFile2 = index;// 将点击后文件的下标存在indexFile中
      this.indexFile1 = -1;// 选中了文件就把选中的文件夹勾选去掉
      this.isShowIcon = true;// 单击选中后显示左上角的勾选图标
      this.isShowOperation = true;// 显示操作栏
      this.isShowDownload = true;// 显示下载按钮
      this.isShowGo1 = true;// 单击后将灰暗的下一层级图标显示
      this.isShowGo2 = false;// 单击后将高亮的下一层级图标隐藏
      this.isShowDelDir = false;// 单击后将删除文件夹按钮隐藏
      this.isShowDelFile = true;// 单击后将删除文件按钮显示
      this.isShowDirRename = false; // 隐藏重命名文件夹按钮
      this.isShowFileRename = true;// 显示重命名文件按钮
      this.isShowTotalName2 = true; // 一开始时隐藏全部文件名的,后因单击了给文件,此时将他显示
      this.isShowMoveFileBtn = true; // 显示移动按钮
      console.log('此文件id为' + MeanID);
      console.log('此文件名为' + FileName);
    },

    // 双击进入文件夹
    async dirEnter(id, name) {
      this.isShowShu = false;
      this.indexFile1 = -1;// 赋值一个不存在的下标，使得勾选图标的v-show为false,隐藏单击文件后的勾选图标
      this.nowId = id;// 当前目录的id
      this.recordDirId.push(this.nowId);// 将当前父级的目录id放进一个数组，以确保能构建回退层级功能

      this.Andmean();// 重新加载，刷新页面
      if (this.brname.length > 2) {
        this.brname = ['个人网盘', '...'];// 如果点击的层数太多，面包屑太长，就删了重新赋值，留一个，并加省略号
      }
      if (this.recordDirId.length === 0) {
        this.brname = ['个人网盘'];// 如果记录的数组已经减完元素，就是第一层
      }
      if (this.nowId === id) {
        this.brname.push(name);// //将当前目录的名字存进面包屑数组中
      }

      // this.brname = this.guolvwenjian(this.brname);
      this.isShowOperation = false;// 双击文件夹就把选中的头部右边操作栏隐藏
      if (this.fileData === '' && this.dirData === '') {
        this.isShowShu = true;// 如果没有数据显示“暂无数据”
      }
      this.isShowGo1 = true;// 双击后将灰暗的下一层级图标显示
      this.isShowGo2 = false;// 双击后将高亮的下一层级图标隐藏
    },

    // 双击文件进行预览
    async fileEnter(MeanID, FileName, FileUrl) {
      console.log('你双击了一个文件' + FileUrl);
      /* 资料预览 */
      FileUrl = FileUrl.replace(/Annex\/file\/|\//g, '');
      const { data } = await PreviewFile({ Title: FileUrl });
      this.$nextTick(() => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = data;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
      });
    },
    // 新建目录
    openDialog() {
      this.adddirdirVisible = true;// 打开新建目录对话框
    },
    // 关闭新建文件夹对话框时清空已经写的文字
    addDialogClosed() {
      this.dir.DirectoryName = '';
    },



    // 插入添加新建文件夹
    async insertDirectory() {
      this.dir.ParentID = this.nowId;// 将现在所在层级的父级id存到data的dir对象中
      const { code } = await InsertDirectory(this.dir);// 将dir对象的数据发送到接口请求数据得到code

      // 根据ParentID查询当前目录
      const { data } = await SelectDirectory({ ParentID: this.nowId });// 根据父级查子集的接口，传父级id进去查当前层级数据
      this.dirData = data;// 将当前文件夹的目录数据存放在data的sonSource数组中，子集文件夹视图已经双向绑定了此数据，此数据发生改变视图就会相应改变
      this.dir.DirectoryName = '';// 清空对话框内容
      this.adddirdialogVisible = false;// 关闭新建目录的对话框
      this.indexFile1 = -1;// 新建文件夹之后不让他选中任何文件状态
      this.indexFile2 = -1;
    },



    // 测试
    async ceshi() {
      try {
        const { data } = await InsertMean(this.fileList);
        this.Andmean();
        this.$message.success(this.fileList.FileName + '上传成功');

        console.log('返回的data是' + data);
      } catch (error) {
        console.log(error);
      }
    },
    // 上传附件
    addAccessory(response, file) {
      this.fileList.FileName = response.data[0].FileName;
      this.fileList.FileUrl = response.data[0].FileUrl;
      this.fileList.mDirectoryID = this.nowId;
      console.log('现在的目录文件id是' + this.nowId);
      this.ceshi();
    },
    // 添加文本
    // addText() {
    //   this.textdialogFormVisible = true;
    // },
    //
    // // 富文本编辑器取消按钮事件
    // textdialogFormL() {
    //   this.textdialogFormVisible = false;
    //   this.title = '';
    //   this.content = '';
    // },

    // 删除单个目录事件
    delDirJudge() {
      this.$confirm('此操作将永久删除<' + this.nowDirectoryName + '>目录,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        const { data } = await DeleteDirectory({ mDirectoryID: this.nowmDirectoryID });
        if (data !== 1) {
          return this.$message.error('删除失败');
        }
        this.Andmean();
        // this.SearchFiles();
        this.isShowDelFile = false;
        this.$message.success('删除成功');
      }).catch(() => {
        this.isShowDelFile = false;
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 删除单个文件事件
    delFileJudge() {
      this.$confirm('此操作将永久删除<' + this.nowFileName + '>文件,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        const { data } = await DeleteMean({
          MeanID: this.nowMeanID,
          mDirectoryID: this.nowmDirectoryID
        });
        if (data !== 1) {
          return this.$message.error('删除失败');
        }
        this.Andmean();
        // this.SearchFiles();
        this.isShowDelFile = false;
        this.nowMeanID = null; // 删除成功后将现在选中的文件id清空
        this.isShowIcon = false; // 删除成功后将现在选中的文件勾选图标隐藏
        this.$message.success('删除成功');
      }).catch(() => {
        this.isShowDelFile = false;
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<style scoped>

@import '../KS_Styles/index.scss';

.file-item {
  position: relative;
  width: 14vh;
  height: 15vh;
  display: inline-block;
  padding-top: 10px;
}

/*第一层文件夹*/
.file1 {
  display: inline-block;
  position: absolute;
  width: 14vh;
  height: 9vh;
  font-size: 2vh;

}


.file2 {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 14vh;
  height: 6vh;
  font-size: 1.5vh;
  /*padding-top: 1vh;*/
  text-align: center;
}

/*这是文件及文件夹显示全名不省略的样式*/
/*.file3 {*/
/*  display: flex;*/
/*  position: absolute;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  width: 14vh;*/
/*  height: 6vh;*/
/*  font-size: 1.8vh;*/
/*  !*padding-top: 1vh;*!*/
/*  text-align: center;*/
/*}*/


/*文件夹图标*/
.folderIcon {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 6vh;
  height: 7vh;
  color: #2e9ad0;
}

/*文件图标*/
.el-icon-tickets,.el-icon-reading,
.el-icon-picture-outline,.el-icon-document-remove,
.el-icon-mobile,.el-icon-document,.el-icon-video-camera-solid,
.el-icon-s-cooperation{
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 6vh;
  height: 7vh;
  color: #3a835d;
}


/*导航菜单*/
.nav {
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-size: 2vh;
  overflow: hidden;
  width: 90%;
  border-top: 2px solid #F2F6FC;
  border-bottom: 2px solid #F2F6FC;
}

.upload-demo {
  margin-left: 12px;
}

/*刷新重回首页*/
.el-icon-refresh-left:hover {
  color: #3e84e9;
}

/*选中文件之后显示选中图标*/
.el-icon-success {
  position: absolute;

  color: cornflowerblue;
}

/*左边操作栏*/
.Operation1 {
  display: flex;
  justify-content: flex-end;
  text-align: center;

}

/*中间操作栏*/
.Operation2 {
  display: flex;
  justify-content: flex-end;
  text-align: center;

}

/*右边操作栏*/
.Operation3 {
  display: flex;
  justify-content: flex-start;
  margin-left: 10px;
  text-align: center;

}

/*面包屑导航*/
.breadcrumb {
  font-size: 1.2vh;
  display: inline-block;
  padding-left: 10px;

}

/*返回上一级*/
.el-icon-arrow-left {
  font-size: 1.5vh;


}

/*进入下一级*/
.el-icon-arrow-right {
  font-size: 1.5vh;

}

/*下一层级*/
.el-icon-arrow-right {
  opacity: 0.2;
}

/*刷新*/
.el-icon-refresh-left {
  font-size: 1.5vh;
  margin-left: 10px;
}


.not {
  font-size: 2vh;
  text-align: center;
}

.myrow {
  margin-top: 6px;
}


.my-input {
  width: 30vh;
  height: 4vh;
  font-size: 1.5vh;
  margin-right: 4px;
}


.filelist {

  padding-top: 20px;
  font-size: 2vh;


}

/*.filelist::after {*/
/*  content: "";*/
/*  display: block;*/
/*  clear: both;*/
/*}*/


/*.file-item2 {*/
/*  display: inline-block;*/

/*}*/

.file-item:hover {
  background-color: #c1d9f3;
}


.box-card {
  display: flex;
  position: relative;
  justify-content: flex-start;
  align-items: flex-start;
  height: 600px;
  overflow: auto;
  width: 100%;

}

.el-card__body {
  padding: 10px;
}

ul, li {
  padding: 0;
  margin: 0;
  list-style: none
}
</style>
