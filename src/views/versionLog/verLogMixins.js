// 更新系统版本数据在此添加
export const logData = {
  data() {
    return {
      activities: [
        {
          content1: '1.后台管理新增“数据维护”模块，方便以后功能设置',
          content2: '2.系统管理的菜单设置新增根据“菜单标题”进行搜索',
          content3: '3.后台指标管理新增“导入评审标准”功能，可以将评审标准作为指标名称导入。且导入的指标名称和原创建的指标名称用不同图标显示',
          content4: '4.新增和编辑指标的对话框布局优化，在指标定义旁新增精确到科室以及是否记录参数值明细',
          content5: '5.科级指标数据管理新增按照年份或者年月搜索数据，完善表格',
          content6: '6.监测数据新增按照年份或者年月搜索数据，新增查看单条监测数据的详情，优化柱形图显示',
          content7: '7.预警信息新增按照年份或者年月搜索数据',
          content8: '8.日常管理的表单制作分配科室时，可以勾选父级科室就全部勾选子级科室',
          timestamp: 'V1.0.8------2021-11-17',
          size: 'large',
          type: 'success',
          icon: 'el-icon-more'
        },
        {
          content1: '1.修复表单制作的类别管理不能删除的问题',
          content2: '2.调整日常管理搜索框与表格之间的对齐样式',
          content3: '3.监测数据修改页面，增加单条监测数据详情',
          content4: '4.不良事件增加默认提交审核部门为本部门',
          timestamp: 'V1.0.7------2021-11-16',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        },
        {
          content1: '1.指标监测>科级指标数据管理完成增删改查搜索功能的修改完善，界面进一步自适应屏幕',
          content2: '2.个人网盘界面优化',
          content3: '3.我的培训完成状态算法优化、观看课件视频和文件显示不同的界面',
          timestamp: 'V1.0.6------2021-11-11',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        },
        {
          content1: '1.评审标准进行排序',
          content2: '2.修复不良事件待处理审核意见丢失问题，在已处理报告增加可查询审核意见',
          content3: '3.个人网盘增加不同的文件图标',
          content4: '4.评审统计材料通过率加快加载速度',
          content5: '5.指标监测增加周期已经其他字段',
          timestamp: 'V1.0.5------2021-11-10',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        },
        {
          content1: '1.修复了评审统计的材料通过率当去掉科室选择时列表无加载条的问题',
          content2: '2.修复了质管督导上面导航条显示不全问题',
          content3: '3.表单制作——类别左边需要增加序号',
          content4: '4.个人网盘增加可点击面包屑后链接到相应文件，以及优化布局',
          content5: '5.上传评审资料时左边增加明显的醒目条',
          content6: '6.其他界面的元素组件对齐优化',
          timestamp: 'V1.0.4------2021-11-9',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        },
        {
          content1: '1.修复制度管理归档后附加文件不能下载和预览的问题',
          content2: '2.修复了指标管理，修改指标后，参数下面的sql语句丢失的问题',
          content3: '3.新增指标定义是否精确到科室的下拉框',
          content4: '4.不良事件优化列表的显示布局',
          content5: '5.修复了分类查询，一开始进来加载为空的问题',
          timestamp: 'V1.0.3------2021-11-8',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        },
        {
          content1: '1.在考试管理的考试统计，增加科室部门搜索',
          content2: '2.路由标签页更改颜色',
          content3: '3.不良事件提交报告时的进度条优化',
          timestamp: 'V1.0.2------2021-11-5',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        },
        {
          content1: '1.增加版本更新日志',
          content2: '2.培训管理>课件管理，新增课件和编辑课件中添加相应课件要求观看时长，培训管理>我的培训，详情中添加课件时长相应功能。',
          timestamp: 'V1.0.1------2021-11-4',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        }

      ]
    };
  }
};
