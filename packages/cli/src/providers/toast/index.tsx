import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
  useMemo,
} from 'react'
import { useTerminalDimensions } from '@opentui/react'
import { DEFAULT_DURATION, type ToastOptions, type ToastVariant } from './types'
import { useTheme } from '../theme'

export type ToastContextValue = {
  show: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast must be used within a ToastProvider')

  return value
}

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [currentToast, setCurrentToast] = useState<ToastOptions | null>(null)

  const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null)

  const clearCurrentTimeout = useCallback(() => {
    if (timeoutHandleRef.current) {
      clearTimeout(timeoutHandleRef.current)
      timeoutHandleRef.current = null
    }
  }, [])

  const show = useCallback(
    (options: ToastOptions) => {
      const duration = options.duration ?? DEFAULT_DURATION

      clearCurrentTimeout()

      setCurrentToast({
        variant: options.variant || 'info',
        ...options,
        duration,
      })

      timeoutHandleRef.current = setTimeout(() => {
        setCurrentToast(null)
      }, duration).unref()
    },
    [clearCurrentTimeout],
  )

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      <Toast currentToast={currentToast} />
      {children}
    </ToastContext.Provider>
  )
}

type ToastProps = {
  currentToast: ToastOptions | null
}

function Toast({ currentToast }: ToastProps) {
  const { width } = useTerminalDimensions()

  const { colors } = useTheme()

  const variantColors: Record<ToastVariant, string> = {
    success: colors.success,
    error: colors.error,
    info: colors.info,
  }

  if (!currentToast) return null

  const borderColor = currentToast?.variant
    ? variantColors[currentToast.variant]
    : variantColors.info

  return (
    <box
      position="absolute"
      right={2}
      top={2}
      justifyContent="center"
      alignItems="flex-start"
      width={Math.max(1, Math.min(60, width - 6))}
      paddingLeft={2}
      paddingRight={2}
      paddingTop={1}
      paddingBottom={1}
      backgroundColor={colors.surface}
      borderColor={borderColor}
      border={['left', 'right']}
    >
      <box flexDirection="column" gap={1} width={'100%'}>
        <text fg={'#e1e1e1'} wrapMode="word" width={'100%'}>
          {currentToast.message}
        </text>
      </box>
    </box>
  )
}
