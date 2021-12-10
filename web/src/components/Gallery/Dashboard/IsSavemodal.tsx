import { Modal } from 'antd'
import { useState, useImperativeHandle, forwardRef } from 'react'
interface isSaveModalProps {
  modalData?: any
  onOk: (obj: any) => void
}
export interface isSaveModalRef {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>
}
export default forwardRef((props: isSaveModalProps, ref) => {

  const [isModal, setIsModal] = useState(false)
  useImperativeHandle(ref, () => {
    return {
      setIsModal
    }
  })
  return (
    <Modal
      title={'提示'}
      visible={isModal}
      onOk={() => {
        props.onOk(props.modalData)
        setIsModal(false)
      }}
      onCancel={() => setIsModal(false)}
    >
      内容未保存， 是否离开？
    </Modal>
  )

})