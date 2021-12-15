/**
 * Created by Jacob Xie on 10/28/2020.
 */

import { useEffect, useState } from "react"

import { Editor } from "@/components/Editor"
import { SpaceBetween } from "@/components/SpaceBetween"
import * as DataType from "../GalleryDataType"
import { Button, Table } from "antd"

import { StringField, NumberField, SelectionField, PasswordField, OperationField } from "./FieldView"
import { NewStorageModal } from "./NewStorageModal"
import { FormattedMessage } from "umi"


export interface StorageConfigTableProps {
  data: DataType.Storage[]
  saveStorage: (storage: DataType.Storage) => void
  deleteStorage: (id: string) => void
  checkConnection: (id: string) => void
  reloadConnection: (id: string) => void
}

export const StorageConfigTable = (props: StorageConfigTableProps) => {

  const [editable, setEditable] = useState<boolean>(false)
  const [selectedStorage, setSelectedStorage] = useState<DataType.Storage | undefined>()
  const [newStorageModalVisible, setNewStorageModalVisible] = useState<boolean>(false)

  useEffect(() => {
    if (!editable) setSelectedStorage(undefined)
  }, [editable])

  const nameOnChange = (name: string) => {
    if (selectedStorage) setSelectedStorage({ ...selectedStorage, name })
  }

  const descriptionOnChange = (description: string) => {
    if (selectedStorage) setSelectedStorage({ ...selectedStorage, description })
  }

  const typeOnChange = (type: string) => {
    if (selectedStorage) {
      const t = DataType.getStorageType(type)
      if (t) setSelectedStorage({ ...selectedStorage, type: t })
    }
  }

  const hostOnChange = (host: string) => {
    if (selectedStorage) setSelectedStorage({ ...selectedStorage, host })
  }

  const portOnChange = (port: number) => {
    if (selectedStorage) setSelectedStorage({ ...selectedStorage, port })
  }

  const databaseOnChange = (database: string) => {
    if (selectedStorage) setSelectedStorage({ ...selectedStorage, database })
  }

  const usernameOnChange = (username: string) => {
    if (selectedStorage) setSelectedStorage({ ...selectedStorage, username })
  }

  const passwordOnChange = (password: string) => {
    if (selectedStorage) setSelectedStorage({ ...selectedStorage, password })
  }

  const saveStorage = () => {
    if (selectedStorage) props.saveStorage(selectedStorage)
  }

  const deleteStorage = (id: string) => {
    if (selectedStorage) props.deleteStorage(id)
  }

  const newStorageOnSubmit = (value: DataType.Storage) => {
    props.saveStorage(value)
    setNewStorageModalVisible(false)
  }

  const tableFooter = () =>
    editable ?
      {
        footer: () =>
          <>
            <Button
              size="small"
              type="primary"
              onClick={() => setNewStorageModalVisible(true)}
            >
              New storage
            </Button>
            <NewStorageModal
              visible={newStorageModalVisible}
              onSubmit={newStorageOnSubmit}
              onCancel={() => setNewStorageModalVisible(false)}
            />
          </>
      } : {}

  return (
    <div>
      <Table
        dataSource={props.data.map(i => ({ ...i, key: i.id }))}
        title={() =>
          <SpaceBetween>
            <span style={{ fontWeight: "bold" }}>Storage configuration</span>
            <Editor
              onChange={setEditable}
              icons={{
                open: <FormattedMessage id="gallery.component.general14" />,
                close: <FormattedMessage id="gallery.component.general69" />,
              }}
            />
          </SpaceBetween>
        }
        size="small"
        bordered
        pagination={false}
        expandable={{
          expandedRowRender: (record: DataType.Storage) => <span>ID: {record.id}</span>
        }}
        rowSelection={editable ?
          {
            type: "radio",
            onSelect: ((record: DataType.Storage) => setSelectedStorage(record)),
          } : undefined
        }
        {...tableFooter()}
      >
        <Table.Column
          title={<FormattedMessage id="gallery.component.general5" />}
          dataIndex="name"
          key="name"
          render={(storages: DataType.Storage[], record: DataType.Storage) =>
            <StringField
              editable={editable && record.id === selectedStorage?.id}
              defaultValue={record.name}
              onChange={nameOnChange}
            />
          }
        />
        <Table.Column
          title={<FormattedMessage id="gallery.component.general6" />}
          dataIndex="description"
          key="description"
          render={(storages: DataType.Storage[], record: DataType.Storage) =>
            <StringField
              editable={editable && record.id === selectedStorage?.id}
              defaultValue={record.description}
              onChange={descriptionOnChange}
            />
          }
        />
        <Table.Column
          title={<FormattedMessage id="gallery.component.general16" />}
          dataIndex="type"
          key="type"
          render={(storages: DataType.Storage[], record: DataType.Storage) =>
            <SelectionField
              editable={editable && record.id === selectedStorage?.id}
              defaultValue={record.type}
              selections={DataType.storageTypeList}
              onChange={typeOnChange}
            />
          }
        />
        <Table.Column
          title={<FormattedMessage id="gallery.component.general17" />}
          dataIndex="host"
          key="host"
          render={(storages: DataType.Storage[], record: DataType.Storage) =>
            <StringField
              editable={editable && record.id === selectedStorage?.id}
              defaultValue={record.host}
              onChange={hostOnChange}
            />
          }
        />
        <Table.Column
          title={<FormattedMessage id="gallery.component.general18" />}
          dataIndex="port"
          key="port"
          render={(storages: DataType.Storage[], record: DataType.Storage) =>
            <NumberField
              editable={editable && record.id === selectedStorage?.id}
              defaultValue={record.port}
              onChange={portOnChange}
            />
          }
        />
        <Table.Column
          title={<FormattedMessage id="gallery.component.general19" />}
          dataIndex="database"
          key="database"
          render={(storages: DataType.Storage[], record: DataType.Storage) =>
            <StringField
              editable={editable && record.id === selectedStorage?.id}
              defaultValue={record.database}
              onChange={databaseOnChange}
            />
          }
        />
        <Table.Column
          title={<FormattedMessage id="gallery.component.general20" />}
          dataIndex="username"
          key="username"
          render={(storages: DataType.Storage[], record: DataType.Storage) =>
            <StringField
              editable={editable && record.id === selectedStorage?.id}
              defaultValue={record.username}
              onChange={usernameOnChange}
            />
          }
        />
        <Table.Column
          title={<FormattedMessage id="gallery.component.general21" />}
          dataIndex="password"
          key="password"
          render={(storages: DataType.Storage[], record: DataType.Storage) =>
            <PasswordField
              editable={editable && record.id === selectedStorage?.id}
              defaultValue={record.password}
              onChange={passwordOnChange}
            />
          }
        />
        <Table.Column
          title={<FormattedMessage id="gallery.component.general22" />}
          render={(storages: DataType.Storage[], record: DataType.Storage) =>
            <OperationField
              editable={editable}
              onUpdateClick={saveStorage}
              onDeleteClick={() => deleteStorage(record.id!)}
              onCheckClick={() => props.checkConnection(record.id!)}
              onReloadClick={() => props.reloadConnection(record.id!)}
              disabled={record.id !== selectedStorage?.id} />
          }
        />
      </Table>
    </div>
  )
}

