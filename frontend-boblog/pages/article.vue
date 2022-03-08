<template>
  <div>
    <el-button @click="read" class="suspension">語音播放</el-button>
    <el-button @click="noread" class="suspen">停止播放</el-button>
    <div class="response-wrap">
      <div class="article">   
        <h1 class="title">
          {{ article.title }}
        </h1>
        <div class="info">
          <span v-if="nickname" class="author"> By {{ nickname }} </span>
          <span class="created-at">{{ article.created_at }}</span>
          <span v-if="article.category_info" class="category">
            文章分类：{{ article.category_info.name }}
          </span>
        </div>
        <div class="article-content" v-html="article.content"></div>
      </div>
      <div class="fixed-sidebar">
        <div class="fixed-scroll-top">
          <i class="el-icon-top" @click="scrollTop"></i>
        </div>
      </div>
    </div>

    <vue-lazy-component @after-leave="onLoadEnd">
      <ArticleComment class="response-wrap" />
      <img
        width="0"
        height="0"
        style="display: none"
        src="https://cdn.boblog.com/login-bg.png"
        alt="preload"
      />
    </vue-lazy-component>
  </div>
</template>
<script>
import { getArticleDetail } from '@/request/api/article'
import ArticleComment from '@/components/article/ArticleComment'
import { mapState } from 'vuex'
import { component as VueLazyComponent } from '@xunlei/vue-lazy-component'

export default {
  name: 'ArticleDetail',
  components: {
    ArticleComment,
    VueLazyComponent,
  },
  async asyncData(context) {
    const { id } = context.query
    const params = {
      id,
      is_markdown: true,
    }
    const [err, res] = await getArticleDetail(params)
    if (!err) {
      return {
        article: res.data.data,
      }
    }
  },
  data() {
    return {
      isLogin: false,
    }
  },
  async fetch({ store }) {
    await store.dispatch('category/getCategoryData')
  },
  head() {
    const article = this.article || {}
    return {
      title: article.title,
      meta: [
        { name: 'keywords', content: article.seo_keyword },
        { name: 'description', content: article.description },
      ],
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLoginStatus: (state) => state.user.isLoginStatus,
    }),
    nickname() {
      if(this.article && this.article.admin_info) {
        return this.article.admin_info.nickname
      }
      return ''
    }
  },
  beforeDestroy() {
    if(this.progress) {
      this.progress.removeProgress()
      this.progress = null
    }

  },
  mounted() {
    this.initData()
  },
  methods: {
    read(){
      var msg;
      var reg = /[\u4e00-\u9fa5]/g;
      var names = this.article.content.match(reg);
      
      if(names){
         msg = names.join("");
         console.log(msg)
         this.speechInstance = new SpeechSynthesisUtterance(msg);
         speechSynthesis.speak(this.speechInstance);
      }else{
        alert("此篇文章無法語音播放！")
        return
      }
    },
    noread(){
      window.speechSynthesis.cancel()
    },

    initData() {
      this.$nextTick(() => {
        const ProgressIndicator = require('@/lib/progress-indicator')
        // eslint-disable-next-line no-new
        this.progress = new ProgressIndicator()
      })
    },
    // 回到顶部
    scrollTop() {
      this.$scrollTo(0)
    },
    // 点击展开评论
    onLoadEnd() {
      this.$nextTick(() => {
        this.progress.calculateWidthPrecent()
      })
    }
  },
}
</script>

<style scoped lang="scss">
.suspension{
  position:fixed;
  background-color: rgb(167, 167, 247);
  color: #fff;
  left: 5px;
  top: 150px;
}
.suspen{
  position: fixed;
  background-color: rgb(167, 167, 247);
  color: #fff;
  top: 200px;
  left: 5px;
}

/deep/ .el-button+.el-button {
  margin-left: 0;
}

ul,
li {
  margin: 0;
  padding: 0;
}
.container {
  box-sizing: border-box;
  margin: 0 auto;
}

.article {
  box-sizing: border-box;
  width: 100%;
  margin: 80px auto 0;
  padding-bottom: 80px;
  border-bottom: 1px solid #e8e8e8;
}

.title {
  font-size: 36px;
  font-weight: 600;
  color: #222222;
  line-height: 42px;
  text-align: center;
}

.info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 22px 0 48px;
}

.info span {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-right: 65px;

  &:last-child {
    margin-right: 0;
  }
}
.fixed-sidebar {
  cursor: pointer;
  position: fixed;
  bottom: 32px;
  right: 32px;
}

@media screen and (max-width: 540px) {
  .article {
    margin: 32px auto 0;
  }
  .title {
    font-size: 32px;
    text-align: left;
  }
  .info {
    flex-direction: column;
    align-items: flex-start;

    & span {
      margin-right: 0;
    }
  }
}
</style>

