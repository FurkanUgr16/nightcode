import type { ToastContextValue } from '../../providers/toast'
import type { DialogContextValue } from '../../providers/dialog'
import type { Mode } from '@nightcode/database/enums'
import type { SupportedChatModelId } from '@nightcode/shared'

export type CommandContext = {
  exit: () => void
  toast: ToastContextValue
  dialog: DialogContextValue
  navigate: (path: string) => void
  mode: Mode
  setModel: (model: SupportedChatModelId) => void
  setMode: (mode: Mode) => void
}

export type Command = {
  name: string
  description: string
  value: string
  action?: (ctx: CommandContext) => void | Promise<void>
}
