/**
 * Created by Jacob Xie on 9/16/2020.
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"
import _ from "lodash"

import * as common from "../common"
import * as utils from "../../utils"
import {Element, Template} from "../entity"


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

@Injectable()
export class TemplateService {
  constructor(@InjectRepository(Template, common.db) private repoTemplate: Repository<Template>,
              @InjectRepository(Element, common.db) private repoElement: Repository<Element>) {}

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

  getTemplateElementsContents(templateId: string) {
    return this.repoTemplate.findOne({
      ...templateFullRelations,
      ...utils.whereIdEqual(templateId)
    })
  }

  getTemplateElements(templateId: string) {
    return this.repoTemplate.findOne({
      ...elementsRelations,
      ...utils.whereIdEqual(templateId)
    })
  }

  saveTemplateInDashboard(dashboardId: string, template: Template) {
    const newTmp = this.repoTemplate.create({
      dashboard: {id: dashboardId},
      name: template.name,
      description: template.description
    })
    return this.repoTemplate.save(newTmp)
  }

  async modifyTemplate(id: string, template: Template) {
    const tp = await this.repoTemplate.findOne({...utils.whereIdEqual(id)})

    if (tp) {
      const newTemplate = this.repoTemplate.create({
        ...tp,
        ...template
      })
      await this.repoTemplate.save(newTemplate)
      return true
    }
    return false
  }

  async copyTemplateElements(originTemplateId: string,
                             targetTemplateId: string) {

    const originTemplate = await this.getTemplateElements(originTemplateId) as Template

    if (!_.isEmpty(originTemplate)) {
      const targetTemplate = await this.getTemplateElements(targetTemplateId)
      if (targetTemplate) {
        const tt = targetTemplate as Template

        // if target template is not empty, fail request
        if (tt.elements.length !== 0)
          return false

        const nt = {
          id: tt.id,
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
      .where(`${common.templateId} = :targetTemplateId`, {targetTemplateId})
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

