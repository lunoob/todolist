import { FC, ReactElement, useState, useEffect, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { uniqueId } from '@/utils'
import Alert, { AlertProps, AlertTypes } from '../alert'

type MessageType = Record<AlertTypes, (msg: string) => void>

type MessageObject = AlertProps & {
  id: number | string
  timer?: number
}

type AddAlertFunction = (props: AlertProps) => void

type MessageProps = {
  onMounted?: (addAlert: AddAlertFunction) => void
}

const MAX_NUM = 3
let addAlert: AddAlertFunction

/**
 * 渲染函数
 */
function render (app: ReactElement, container: Element | DocumentFragment) {
  const root = createRoot(container)
  root.render(app)

  const originUnmount = root.unmount
  // 异步调用卸载钩子
  root.unmount = function () {
    setTimeout(originUnmount)
  }

  return root
}

/**
 * 创建 Message ID
 */
function createMessageId () {
  return uniqueId('$Message$')
}

function addInstance (type: AlertTypes, message: string) {
  if (addAlert != null && typeof addAlert === 'function') {
    return addAlert({ message, type })
  }
  const div = document.createElement('div')
  document.body.appendChild(div)

  render(
    <Message
      onMounted={(add) => {
        addAlert = add
        addAlert({ message, type })
      }}
    />,
    div
  )
}

// @ts-ignore
const Message: FC<MessageProps> & MessageType = (props) => {
  const [alerts, setAlerts] = useState<MessageObject[]>([])
  const { onMounted } = props

  const removeAlert = useCallback(() => {
    setAlerts(prev => {
      const newAlerts = prev.slice()
      newAlerts.shift()

      return newAlerts
    })
  }, [])

  const addAlert = useCallback((addProps: AlertProps) => {
    setAlerts(prev => {
      const alertProp: MessageObject = {
        ...addProps,
        id: createMessageId(),
        timer: -1
      }
      const newAlerts = [...prev, alertProp]

      if (newAlerts.length > MAX_NUM) {
        const alert = newAlerts.shift()
        clearTimeout(alert?.timer)
      }

      // @ts-ignore
      alertProp.timer = setTimeout(() => {
        removeAlert()
      }, 3000)

      return newAlerts
    })
  }, [])

  useEffect(() => {
    onMounted && onMounted(addAlert)
  }, [])

  return (
    <div className="fixed z-50 top-10 w-full space-y-4 flex flex-col items-center pointer-events-none">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
        />
      ))}
    </div>
  )
}

const messageTypes = ['error', 'info', 'warning', 'success']
messageTypes.forEach(type => {
  // @ts-ignore
  Message[type] = (message: string) => {
    return addInstance(type as AlertTypes, message)
  }
})

export default Message
