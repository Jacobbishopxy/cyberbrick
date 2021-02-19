/**
 * Created by Jacob Xie on 2/9/2021
 */

import {ArticleToolbarProps} from "./data"

import {ArticleCreationModal} from "@/components/Article/ArticleCreationModal"
import {Editor} from "@/components/Editor"
import {TagModificationModal} from "@/components/Article/TagModificationModal"


export const ArticleToolbar = (props: ArticleToolbarProps) =>
  <>
    {
      props.editable ?
        <>
          <ArticleCreationModal
            trigger={c =>
              <Editor
                icons={{open: "🧾", close: "🧾"}}
                onChange={() => c.onClick()}
              />
            }
            onSubmit={props.articleCreationOnSubmit}
            tags={props.tags}
            modalHeight={"70vh"}
            modalWidth={"70vw"}
          />

          <TagModificationModal
            trigger={c =>
              <Editor
                icons={{open: "🏷️", close: "🏷️"}}
                onChange={() => c.onClick()}
              />
            }
            onSubmit={props.tagModificationModal}
            tags={props.tags}
          />
        </> : <></>
    }
    <Editor
      icons={{open: "⚙️", close: "✔️"}}
      onChange={props.onEdit}
    />
  </>
