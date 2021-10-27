<script>
import { GetcatalogSecond } from '@/api/catalog';
import ArticleConponents from './ArticleConponents';

export default {
  name: 'Header',
  components: {
    ArticleConponents
  },
  props: {
    catalogID: {
      type: Number,
      default: 0,
      menu_one: '',
      menu_two: ''
    }
  },
  data() {
    return {
      tableData: [],
      dataArticle: 1,
      ShowRes: '显示全部',
      x: 0
    };
  },
  created() {
    this.getIni();
    this.GetcatalogSecond();
  },

  methods: {

    async GetcatalogSecond(val) {
      // this.x = val;
      const { data } = await GetcatalogSecond({
        CatalogID: val,
        UserID: window.userInfo[0].UserID
      });

      this.tableData = data;
      // console.log(this.tableData);
    },
    async getIni() {
      const para = this.$store.getters.iniPara;
      this.menu_one = para.menu_one;
      this.menu_two = para.menu_two;
      this.Resort = para.Resort;
      this.loading = false;
    }
  },

  render() {
    const header = value => {
      const html = (

        <div style="background: #dfe7f9;">
          <div style="display:flex;align-items:center">
            <div style="flex:2;font-weight: 700;font-size: 15px;">
              评审标准 {value.CatalogCode} {value.CatalogName}
            </div>
            <div style="flex:1;border-left:1px solid #999;font-weight: 700;font-size: 13px;">
              <p>
                <span>
                  {this.menu_two}:{value.manage}

                </span>
              </p>
              <p>
                <span>组别督导：{value.GroupName}</span>
              </p>
              <p>
                <el-popover
                  placement="top-start"
                  width="200px"
                  trigger="hover"
                >
                  <span> 存在问题：{value.matter}</span><br/>
                  <span> 改进措施：{value.solution}</span>
                  <span slot="reference" class="showDeatil">评审状态：{value.isAudit}</span>
                </el-popover>


              </p>
            </div>
          </div>
        </div>

      );
      return html;
    };
    const footer = value => {
      const points = (
        <div style="flex:1;border: 1px solid rgb(223, 223, 223);">
          <div
            style="text-align:center;color: rgb(0, 102, 204);font-weight: bold;border-bottom: 1px solid rgb(223, 223, 223);"
          >
            评审要点
          </div>
          <div>
            {value.Children.map(items => (
              <div
                key={items.CatalogID}
                style="border-bottom: 1px solid rgb(223, 223, 223);margin-left:10px"
              >
                <p>
                  {items.Children.length === 0 ? (
                    <div>
                      【{items.CatalogCode}】 <p>{items.CatalogName}</p>
                    </div>
                  ) : (
                    <div>
                      <p>【{items.CatalogCode}】</p>
                      {items.Children.map(items2 => {
                        return (
                          <p>
                            {items2.CatalogCode}：{items2.CatalogName}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
      const
        evaluationMethod = (
          <div style="flex:1;border: 1px solid rgb(223, 223, 223);">
            <div
              style="text-align:center;color: rgb(0, 102, 204);font-weight: bold;border-bottom: 1px solid rgb(223, 223, 223);"
            >
              考评办法
            </div>
            <div>
              {value.Resort.map((items, index) => (
                <div key={items.CatalogID} style="margin-left:10px">
                  <p
                    domPropsInnerHTML={index + 1 + '.' + items.ResortName.replace(/\n/g, '<br/>') || ' '}
                  ></p>


                </div>
              ))}
            </div>
          </div>
        );
      const relevantInformation = () => {
        return (
          <ArticleConponents
            style="flex:1;border: 1px solid rgb(223, 223, 223);"
            value={value}
          ></ArticleConponents>
        );
      };
      return (
        <div style="display:flex;">
          {points}
          {evaluationMethod}
          {relevantInformation()}
        </div>
      );
    };
    const container = value => {
      const html =
        value.IsCriterion === 1 ? (
          <el-card>
            {header(value)}
            {footer(value)}
          </el-card>
        ) : (
          <el-card>
            {value.Children.map(items => {
              return (
                <div key={items.CatalogID}>
                  {items.IsCriterion === 1 ? (
                    <div>
                      {header(items)}
                      {footer(items)}
                    </div>
                  ) : (
                    container(items)
                  )}
                </div>
              );
            })}
          </el-card>
        );
      return html;
    };
    return (
      <el-row type="flex" justify="center">
        <el-col span="16" xs="24">
          {this.tableData.map(item => (
            <div key={item.CatalogID}>
              <h2>{item.CatalogCode}</h2>
              <div style="border-top:2px solid #0066cc;border-bottom:2px solid #0066cc;margin-bottom:5px;">
                {container(item)}
              </div>
            </div>
          ))}
        </el-col>
      </el-row>
    );
  }
};
</script>
<style lang="scss" scoped>
.spanABC {
  padding: 5px;
  height: 25px;
  background: #eee;
  border: 1px solid #999;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px;
}

.spanABC:hover {
  background: #84C1FF;
  cursor: pointer;
}

.showDeatil {
  color: #3daacf;
}
</style>
