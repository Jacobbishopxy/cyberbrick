/**
 * Created by Jacob Xie on 2/4/2021
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"
import _ from "lodash"

import * as common from "../common"
import * as utils from "../../utils"
import {Tag} from "../entity"


@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag, common.db) private repo: Repository<Tag>) {}

  getAllTags() {
    return this.repo.find()
  }

  getTagById(id: string) {
    return this.repo.find({
      ...utils.whereIdEqual(id)
    })
  }

  saveTag(tag: Tag) {
    const newTag = this.repo.create(tag)
    return this.repo.save(newTag)
  }

  deleteTag(id: string | string[]) {
    return this.repo.delete(id)
  }

  async modifyTags(tags: Tag[]) {
    const ts = await this.getAllTags()

    if (ts) {
      const tsRemove = _.differenceWith(
        ts, tags, (prev, curr) => prev.id === curr.id
      )

      if (tsRemove.length > 0)
        await this.deleteTag(tsRemove.map(i => i.id))

      const newTags = tags.map(t => this.repo.create(t))
      await this.repo.save(newTags)
    }
  }
}

