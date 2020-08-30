/**
 * Created by Jacob Xie on 8/5/2020.
 */

import * as dashboardModel from '@/utilities/dashboardModel';


export interface ModuleSelectionViewProps {
  onSelectModule: (value: dashboardModel.CategoryType) => void
}

export interface AddModuleModalProps {
  onAddModule: (value: dashboardModel.CategoryType) => void
  visible: boolean
  onOk: () => void
  onCancel: () => void
}

export interface ConfirmSaveModalProps {
  onSaveModule: () => void
  template: string
  onSaveTemplate: (value: string) => void
  visible: boolean
  onOk: () => void
  onCancel: () => void
}

export interface DashboardEditorProps {
  onAddModule: (value: dashboardModel.CategoryType) => void
  onSaveModule: () => void
  onEditModule: (value: boolean) => void
}

export interface SymbolSelectorProps {
  onSelectSymbol: (value: string) => string
  defaultSymbol: string
}

