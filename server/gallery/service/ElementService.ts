/**
 * Created by Jacob Xie on 9/16/2020.
 */

import { getConnection } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Element } from "../entity/Element"
import {Content} from "../entity/Content"


const elementRepo = () => getConnection(common.db).getRepository(Element)

const templateAndContentRelations = {
  relations: [
    common.template,
    common.contents
  ]
}

export async function getAllElements() {
  return elementRepo().find(templateAndContentRelations)
}

export async function getElementsByIds(ids: string[]) {
  return elementRepo().find({
    ...templateAndContentRelations,
    ...utils.whereIdsIn(ids)
  })
}

export async function saveElement(element: Element) {
  const er = elementRepo()
  const newEle = er.create(element)
  await er.save(newEle)

  return utils.HTMLStatus.SUCCESS_MODIFY
}

export async function deleteElement(id: string) {
  await elementRepo().delete(id)

  return utils.HTMLStatus.SUCCESS_DELETE
}

// =====================================================================================================================


export async function getElementLatestContent(id: string) {
  const ans = elementRepo()
    .createQueryBuilder(common.element)
    .select(common.elementId)
    .leftJoin(qb => qb
      .from(Content, common.content)
      .select(`MAX(${common.date})`, "date")
      .addSelect(`"elementId"`, "element_id")
      .groupBy(`"element_id"`),
      "last_date",
      `last_date."element_id" = element.id`
    )
    .leftJoinAndSelect(common.elementContents, common.content, `${common.contentDate} = last_date.date`)
    .where(`${ common.elementId } = :id`, { id })
    .getOne()

  if (ans) return ans
  return {}
}

