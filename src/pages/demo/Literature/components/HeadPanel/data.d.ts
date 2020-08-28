/**
 * Created by Jacob Xie on 8/28/2020.
 */

export interface ControllerProps {
  categoryNames: string[]
  onSelectCategory: (value: string) => void
  onCreateCategory: (value: API.Category) => void
  onEdit: (value: boolean) => void
}
