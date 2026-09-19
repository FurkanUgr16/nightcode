import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

import { TextAttributes, RGBA, t } from '@opentui/core'
import { useKeyboard, useTerminalDimensions } from '@opentui/react'
import type { DialogConfig } from './types'
import { useKeyboardLayer } from '../keyboard-layer'
import { useTheme } from '../theme'

export type DialogContextValue = {
  open: (config: DialogConfig) => void
  close: () => void
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined)

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [currentDialog, setCurrentDialog] = useState<DialogConfig | null>(null)
  const { pop, push } = useKeyboardLayer()

  const close = useCallback(() => {
    setCurrentDialog(null)
    pop('dialog')
  }, [pop])

  const open = useCallback(
    (config: DialogConfig) => {
      setCurrentDialog(config)
      push('dialog', () => {
        close()
        return true
      })
    },
    [push, close],
  )

  return (
    <DialogContext.Provider value={{ open, close }}>
      <Dialog currentDialog={currentDialog} close={close} />
      {children}
    </DialogContext.Provider>
  )
}

export const useDialog = (): DialogContextValue => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}

type DialogProps = {
  currentDialog: DialogConfig | null
  close: () => void
}

function Dialog({ currentDialog, close }: DialogProps) {
  const { isTopLayer } = useKeyboardLayer()
  const { colors } = useTheme()

  const dimensions = useTerminalDimensions()
  useKeyboard((key) => {
    if (!currentDialog || !isTopLayer('dialog')) return

    if (key.name === 'escape') close()
  })

  if (!currentDialog) return null
  const { children, title } = currentDialog

  return (
    <box
      position="absolute"
      left={0}
      top={0}
      width={dimensions.width}
      height={dimensions.height}
      justifyContent="center"
      alignItems="center"
      backgroundColor={RGBA.fromInts(0, 0, 0, 150)}
      zIndex={100}
      onMouseDown={() => close()}
    >
      <box
        width={Math.min(60, dimensions.width - 4)}
        height={'auto'}
        backgroundColor={colors.dialogSurface}
        paddingX={4}
        paddingY={4}
        flexDirection="column"
        gap={1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <box
          paddingBottom={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <text attributes={TextAttributes.BOLD}>{title}</text>
          <text attributes={TextAttributes.DIM} onMouseDown={() => close()}>
            esc
          </text>
        </box>
        <box flexGrow={1}>{children}</box>
      </box>
    </box>
  )
}
