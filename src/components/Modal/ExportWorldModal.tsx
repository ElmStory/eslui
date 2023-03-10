import React from 'react'

import { Modal } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const ExportWorldModal: React.FC<{ title: string; visible?: boolean }> = ({
  title,
  visible
}) => {
  return (
    <Modal
      visible={visible}
      destroyOnClose
      closable={false}
      centered
      footer={null}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 20 }}>{title}</div>
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </div>
    </Modal>
  )
}

ExportWorldModal.displayName = 'ExportWorldModal'

export default ExportWorldModal
