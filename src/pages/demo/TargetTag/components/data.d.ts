import { Tag, Target } from "@/services/targetTag"

/**
 * Created by Jacob Xie on 8/17/2020.
 */

interface TagsViewProps {
  tags: Tag[]
  editable: boolean
  tagOnCreate?: (value: Tag) => Promise<void>
  tagOnRemove?: (value: string) => Promise<void>
}

interface TagCreateModalProps {
  visible: boolean
  onOk: () => void
  onCancel: () => void
  inputName: (vale: string) => void
  inputDescription: (value: string) => void
}

interface TargetsViewProps {
  targets: Target[]
  tags: Tag[]
  editable: boolean
  targetOnCreate?: (value: Target) => Promise<void>
  targetOnDelete?: (value: number) => Promise<void>
}

interface NewTargetFormProps {
  tags: Tag[]
  onSubmit: (value: Target) => Promise<void>
}

interface TagsSelectorProps {
  tags: Tag[]
  onChange: (value: string[]) => void
  onAddNewTagInputChange: (value: string) => void
  onAddNewTag: () => void
}
