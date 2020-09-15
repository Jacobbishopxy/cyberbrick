/**
 * Created by Jacob Xie on 9/14/2020.
 */

import { getConnection } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Mark } from "../entity/Mark"


const markRepo = () => getConnection(common.db).getRepository(Mark)

const markFullRelations = {
  relations: [
    common.category,
    common.contents
  ]
}

const markCategoryRelations = {
  relations: [common.category]
}

export async function getAllMarks() {
  return markRepo().find(markFullRelations)
}

export async function getMarksByName(name: string) {
  return markRepo().find({
    ...markFullRelations,
    ...utils.whereNameEqual(name)
  })
}

export async function saveMark(mark: Mark) {
  const mr = markRepo()
  const newMrk = mr.create(mark)
  await mr.save(newMrk)

  return utils.HTMLStatus.SUCCESS_MODIFY
}

export async function deleteMark(id: string) {
  await markRepo().delete(id)
  return utils.HTMLStatus.SUCCESS_DELETE
}

// =====================================================================================================================


export async function getCategoriesByMarkName(name: string) {
  const raw = await markRepo().find({
    ...markCategoryRelations,
    ...utils.whereNameEqual(name)
  })

  if (raw) return raw.map(i => i.category)
  return []
}

export async function deleteMarkInCategory(categoryName: string, markName: string) {
  const raw = await markRepo()
    .createQueryBuilder(common.mark)
    .leftJoinAndSelect(common.markCategory, common.category)
    .select([common.markName, common.categoryName])
    .where(`${ common.categoryName } = :categoryName AND ${ common.markName } = :markName`, { categoryName, markName })
    .delete()
    .execute()

  if (raw) return utils.HTMLStatus.SUCCESS_DELETE
  return utils.HTMLStatus.FAIL_OPERATION
}

