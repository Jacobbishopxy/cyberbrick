/**
 * Created by Jacob Xie on 9/16/2020.
 */

import { getConnection } from "typeorm"
import _ from "lodash"

import * as common from "../common"
import * as utils from "../../utils"
import { Template } from "../entity/Template"


const templateRepo = () => getConnection(common.db).getRepository(Template)

const templateFullRelations = {
  relations: [
    common.dashboard,
    common.elements,
    common.elementsContents
  ]
}
const dashboardAndElementRelations = {
  relations: [common.dashboard, common.elements]
}

export async function getAllTemplates() {
  return templateRepo().find(templateFullRelations)
}

export async function getTemplateById(id: string) {
  return templateRepo().findOne({
    ...templateFullRelations,
    ...utils.whereIdEqual(id)
  })
}

export async function saveTemplate(template: Template) {
  const tr = templateRepo()
  const newTmp = tr.create(template)
  await tr.save(newTmp)

  return utils.HTMLStatus.SUCCESS_MODIFY
}

export async function deleteTemplate(id: string) {
  await templateRepo().delete(id)
  return utils.HTMLStatus.SUCCESS_DELETE
}

// =====================================================================================================================

/**
 * too heavy, since content is a list, usually we only need the latest content (by date)
 */
export async function getTemplateElementsContents(dashboardName: string, templateName: string) {
  return templateRepo().findOne({
    ...templateFullRelations,
    ...common.whereDashboardNameAndTemplateEqual(dashboardName, templateName)
  })
}

export async function copyTemplateElements(originDashboardName: string,
                                           originTemplateName: string,
                                           targetDashboardName: string,
                                           targetTemplateName: string) {
  const tr = templateRepo()

  const originTemplate = await tr.findOne({
    ...dashboardAndElementRelations,
    ...common.whereDashboardNameAndTemplateEqual(originDashboardName, originTemplateName)
  })

  if (originTemplate) {
    const targetTemplate = {
      dashboard: {
        ...originTemplate.dashboard,
        name: targetTemplateName
      },
      name: targetTemplateName,
      elements: originTemplate.elements.map(i => _.omit(i, "id")),
      description: originTemplate.description
    } as Template

    const newTemplate = tr.create(targetTemplate)
    await tr.save(newTemplate)

    return utils.HTMLStatus.SUCCESS_MODIFY
  }

  return utils.HTMLStatus.FAIL_REQUEST
}
