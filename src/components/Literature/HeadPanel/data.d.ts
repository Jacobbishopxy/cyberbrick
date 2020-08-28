/**
 * Created by Jacob Xie on 8/28/2020.
 */

import { Category } from "../data"

export interface ControllerProps {
  categoryNames: string[]
  onSelectCategory: (value: string) => void
  onCreateCategory: (value: Category) => void
  onEdit: (value: boolean) => void
}
