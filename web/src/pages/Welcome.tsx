/**
 * Created by Jacob Xie on 9/24/2020.
 */

import { Typography } from "antd"
import { FormattedMessage, useStore, connect, useSelector } from "umi"

import { GenericArticle, GenericTag } from "@/components/Article/data"
import { Article } from "@/components/Article"
import * as innService from "@/services/inn"

//test 
import Test from './test'
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
const getArticles = (pagination?: [number, number]) =>
    innService.getLatestUpdate(pagination) as Promise<GenericArticle[]>

const getArticlesCount = () =>
    innService.getUpdateCount()

const getTags = () =>
    innService.getAllTag() as Promise<GenericTag[]>

const modifyArticle = (v: GenericArticle) =>
    innService.saveUpdate(v as InnAPI.Update)

const deleteArticle = (v: string) =>
    innService.deleteUpdate(v)

const modifyTags = (v: GenericTag[]) =>
    innService.modifyTags(v as InnAPI.Tag[])


export default () => {
    return (
        <Provider store={store}>
            <Typography>
                {/* <Test></Test> */}
                <Typography.Title>
                    <FormattedMessage id="pages.welcome.title1" />
                </Typography.Title>

                <Article
                    getArticles={getArticles}
                    getArticlesCount={getArticlesCount}
                    getTags={getTags}
                    modifyArticle={modifyArticle}
                    deleteArticle={deleteArticle}
                    modifyTags={modifyTags}
                />
            </Typography>
        </Provider>

    )
}
