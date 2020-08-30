/**
 * Created by Jacob Xie on 8/5/2020.
 */

import * as dashboardModel from '@/utilities/dashboardModel';

export interface ModulePanelProps {
  collection: string
  anchorKey: dashboardModel.AnchorKey
  globalConfig: Record<string, any> | null
  category: dashboardModel.CategoryType
  onRemove: () => void
  updateContent: (value: dashboardModel.Content) => void
  deleteContent: () => void
  headVisible: boolean
}
