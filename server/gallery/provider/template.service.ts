/**
 * Created by Jacob Xie on 9/16/2020.
 */

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { getConnection, Repository } from "typeorm"
import _ from "lodash"

import * as common from "../common"
import * as utils from "../../utils"
import { Element, Template } from "../entity"


const templateRepo = () => getConnection(common.db).getRepository(Template)
const elementRepo = () => getConnection(common.db).getRepository(Element)

const templateFullRelations = {
  relations: [
    common.dashboard,
    common.elements,
    common.elementsContents,
    common.elementsContentsMark,
  ]
}
const elementsRelations = {
  relations: [common.elements]
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
 * Heavy. Since content is a list, usually we only need the latest content (by date)
 */
export async function getTemplateElementsContents(dashboardName: string, templateName: string) {
  const ans = await templateRepo().findOne({
    ...templateFullRelations,
    ...common.whereDashboardNameAndTemplateEqual(dashboardName, templateName)
  })

  if (ans) return ans
  return {}
}

/**
 * Light. After result, each element should query its' own content in parallel
 */
export async function getTemplateElements(dashboardName: string, templateName: string) {
  const ans = await templateRepo().findOne({
    ...elementsRelations,
    ...common.whereDashboardNameAndTemplateEqual(dashboardName, templateName)
  })

  if (ans) return ans
  return {}
}

export async function saveTemplateInDashboard(dashboardName: string, template: Template) {
  const tr = templateRepo()
  const newTmp = tr.create({
    dashboard: {
      name: dashboardName
    },
    name: template.name,
    description: template.description
  })
  await tr.save(newTmp)

  return utils.HTMLStatus.SUCCESS_MODIFY
}

export async function deleteTemplateInDashboard(dashboardName: string, templateName: string) {
  const raw = await templateRepo()
    .createQueryBuilder(common.template)
    .leftJoinAndSelect(common.templateDashboard, common.dashboard)
    .select([common.templateName, common.dashboardName])
    .where(`${ common.dashboardName } = :dashboardName AND ${ common.templateName } = :templateName`, {
      dashboardName,
      templateName
    })
    .delete()
    .execute()

  if (raw) return utils.HTMLStatus.SUCCESS_DELETE
  return utils.HTMLStatus.FAIL_OPERATION
}

export async function copyTemplateElements(originDashboardName: string,
                                           originTemplateName: string,
                                           targetDashboardName: string,
                                           targetTemplateName: string) {
  const tr = templateRepo()

  const originTemplate = await getTemplateElements(originDashboardName, originTemplateName) as Template

  if (!_.isEmpty(originTemplate)) {
    const targetTemplate = await getTemplateElements(targetDashboardName, targetTemplateName)
    if (targetTemplate) {
      const tt = targetTemplate as Template

      // if target template is not empty, fail request
      if (tt.elements.length !== 0)
        return utils.HTMLStatus.FAIL_REQUEST

      const nt = {
        id: tt.id,
        dashboard: { name: targetDashboardName },
        elements: originTemplate.elements.map(i => _.omit(i, "id")),
      } as Template

      const newTemplate = tr.create(nt)
      await tr.save(newTemplate)

      return utils.HTMLStatus.SUCCESS_MODIFY
    }
  }

  return utils.HTMLStatus.FAIL_REQUEST
}

/**
 * IMPORTANT:
 *
 * if previous element in template has been removed, we need delete removed element as well
 */
export async function updateTemplateElements(template: Template) {
  const targetTemplateId = template.id

  const er = elementRepo()
  const originElementsId = await er
    .createQueryBuilder(common.element)
    .leftJoinAndSelect(common.elementTemplate, common.template)
    .select(common.elementId)
    .where(`${ common.templateId } = :targetTemplateId`, { targetTemplateId })
    .getMany()

  if (originElementsId) {
    const targetElementsId = template.elements.map(i => i.id)

    const removedIds = _.difference(originElementsId.map(i => i.id), targetElementsId)
    if (removedIds.length !== 0)
      await er.delete(removedIds)
  }

  return saveTemplate(template)
}

@Injectable()
export class TemplateService {
  constructor(@InjectRepository(Template) private repoTemplate: Repository<Template>,
              @InjectRepository(Element) private repoElement: Repository<Element>) {}

  getAllTemplates() {
    return this.repoTemplate.find(templateFullRelations)
  }

  getTemplateById(id: string) {
    return this.repoTemplate.findOne({
      ...templateFullRelations,
      ...utils.whereIdEqual(id)
    })
  }

  saveTemplate(template: Template) {
    const newTpl = this.repoTemplate.create(template)
    return this.repoTemplate.save(newTpl)
  }

  deleteTemplate(id: string) {
    return this.repoTemplate.delete(id)
  }

  // ===================================================================================================================

  getTemplateElementsContents(dashboardName: string, templateName: string) {
    return this.repoTemplate.findOne({
      ...templateFullRelations,
      ...common.whereDashboardNameAndTemplateEqual(dashboardName, templateName)
    })
  }

  getTemplateElements(dashboardName: string, templateName: string) {
    return this.repoTemplate.findOne({
      ...elementsRelations,
      ...common.whereDashboardNameAndTemplateEqual(dashboardName, templateName)
    })
  }

  saveTemplateInDashboard(dashboardName: string, template: Template) {
    const newTmp = this.repoTemplate.create({
      dashboard: {
        name: dashboardName
      },
      name: template.name,
      description: template.description
    })
    return this.repoTemplate.save(newTmp)
  }

  deleteTemplateInDashboard(dashboardName: string, templateName: string) {
    return this.repoTemplate
      .createQueryBuilder(common.template)
      .leftJoinAndSelect(common.templateDashboard, common.dashboard)
      .select([common.templateName, common.dashboardName])
      .where(`${ common.dashboardName } = :dashboardName AND ${ common.templateName } = :templateName`, {
        dashboardName,
        templateName
      })
      .delete()
      .execute()
  }

  async copyTemplateElements(originDashboardName: string,
                             originTemplateName: string,
                             targetDashboardName: string,
                             targetTemplateName: string) {

    const originTemplate = await this.getTemplateElements(originDashboardName, originTemplateName) as Template

    if (!_.isEmpty(originTemplate)) {
      const targetTemplate = await this.getTemplateElements(targetDashboardName, targetTemplateName)
      if (targetTemplate) {
        const tt = targetTemplate as Template

        // if target template is not empty, fail request
        if (tt.elements.length !== 0)
          return false

        const nt = {
          id: tt.id,
          dashboard: { name: targetDashboardName },
          elements: originTemplate.elements.map(i => _.omit(i, "id")),
        } as Template

        const newTemplate = this.repoTemplate.create(nt)
        await this.repoTemplate.save(newTemplate)

        return true
      }
    }

    return false
  }

  async updateTemplateElements(template: Template) {
    const targetTemplateId = template.id

    const originElementsId = await this.repoElement
      .createQueryBuilder(common.element)
      .leftJoinAndSelect(common.elementTemplate, common.template)
      .select(common.elementId)
      .where(`${ common.templateId } = :targetTemplateId`, { targetTemplateId })
      .getMany()

    if (originElementsId) {
      const targetElementsId = template.elements.map(i => i.id)

      const removedIds = _.difference(originElementsId.map(i => i.id), targetElementsId)
      if (removedIds.length !== 0)
        await this.repoElement.delete(removedIds)
    }

    return this.saveTemplate(template)
  }
}

