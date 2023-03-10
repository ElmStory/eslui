import React, { useEffect } from 'react'

import { StudioId, Studio } from '../../data/types'

import { Modal, ModalProps, Form, Input, Button } from 'antd'

import api from '../../api'

interface SaveStudioModalProps extends ModalProps {
  studio?: Studio
  edit?: boolean
  onSave?: (studioId: StudioId) => void
  onRemove?: () => void
}

const SaveStudioModal: React.FC<SaveStudioModalProps> = ({
  visible = false,
  onCancel,
  afterClose,
  studio,
  edit,
  onSave,
  onRemove
}) => {
  const [saveStudioForm] = Form.useForm()

  let footerButtons: JSX.Element[] = []

  if (edit) {
    footerButtons.push(
      <Button
        key="remove"
        danger
        style={{ position: 'absolute', left: '16px' }}
        onClick={async () => {
          studio?.id && (await api().studios.removeStudio(studio.id))

          onRemove && onRemove()
        }}
      >
        Remove
      </Button>
    )
  }

  footerButtons = [
    ...footerButtons,
    <Button key="cancel" onClick={onCancel}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      form="save-studio-form"
      htmlType="submit"
      onClick={(event) => {
        event.preventDefault()
        saveStudioForm.submit()
      }}
    >
      Save
    </Button>
  ]

  useEffect(() => {
    if (edit && studio) {
      saveStudioForm.setFieldsValue({
        title: studio.title
      })
    }
  }, [visible])

  return (
    <Modal
      title={`${studio && edit ? 'Edit' : 'New'} Studio`}
      visible={visible}
      destroyOnClose
      onCancel={onCancel}
      centered
      footer={footerButtons}
    >
      <Form
        id="save-studio-form"
        form={saveStudioForm}
        preserve={false}
        onFinish={async ({ title }: { title: string }) => {
          try {
            const studioId = await api().studios.saveStudio(
              studio && edit
                ? { ...studio, title }
                : { title, tags: [], worlds: [] }
            )

            onSave && onSave(studioId)
            afterClose && afterClose()
          } catch (error) {
            throw error
          }
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Studio title is required.' }]}
        >
          <Input autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SaveStudioModal
