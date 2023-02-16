import React, { memo } from 'react'
import { Affix } from '@arco-design/web-react'
import type { FC } from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import styles from './index.module.less'
import MarkDown from '@/components/mark-down'
import { PostAuthor, User } from '@/components/author'
import Banner from '@/components/banner'
import PostCpns from '@/components/post'
import { fetchPostData, wrapper } from '@/store'

import type { AppState } from '@/store'
import { getArticleById } from '@/service/api'
import type { IArticle } from '@/service/api/types'

export interface IProps {
  article: IArticle
}

const PostId: FC<IProps> = memo((props) => {
  const { article } = props
  const { title, image, content, article_tags, author, info } = article

  const { postData } = useSelector((store: AppState) => ({
    postData: store.post.postData,
  }))

  const { banners, articles } = postData

  // 假数据
  const category = '前端'
  const column = 'javaWeb'
  const columnInfo = '前端react、next.js开发专项'
  const columnImgUrl
    = 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95414745836549ce9143753e2a30facd~tplv-k3u1fbpfcp-no-mark:160:160:160:120.awebp'

  return (
    <div className="post-wrapper">
      <div className={styles.left}>
        <h1 className={styles['article-title']}>{title}</h1>

        <div>
          <User author={{ ...author, position: `2022年10月26日 20:13 · 阅读 ${info.view}` }} />
        </div>
        {/* 此处width和height仅为适配组件必须属性，生效样式在less中体现 */}
        {image && <Image src={image} priority alt={'文章封面'} width={200} height={200} className={styles.postCover}/>}

        <MarkDown content={content} />

        <div className={styles.articleEnd}>
          {/* 分类 标签 */}
          <PostCpns.PostInfo article_tags={article_tags} category={category} />
          <PostCpns.Column column={column} columnInfo={columnInfo} columnImgUrl={columnImgUrl} />
          <PostCpns.Extension />
        </div>
      </div>
      <div className={styles.right}>
        <PostAuthor author={author}/>

        { banners.map(item => <Banner key={item.id} {...item} hasDesc={false} />) }

        <PostCpns.Related articles={articles}/>

        <Affix offsetTop={80}>
          <div className={styles['article-catalog']}>
            <PostCpns.Toc />
          </div>
        </Affix>
      </div>
    </div>
  )
})

export const getServerSideProps = wrapper.getServerSideProps(
  store => async ({ params }) => {
    const id = params?.id
    const article = await getArticleById(parseInt(id as string))
    await store.dispatch(fetchPostData())

    return {
      props: {
        article,
      },
    }
  },
)

PostId.displayName = 'PostId'
export default PostId
