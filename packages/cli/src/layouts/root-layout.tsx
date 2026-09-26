import { Outlet } from 'react-router'
import { ToastProvider } from '../providers/toast'
import { DialogProvider } from '../providers/dialog'
import { KeyboardLayerProvider } from '../providers/keyboard-layer'
import { ThemeProvider } from '../providers/theme'
import { PromptConfigProvider } from '../providers/prompt-config'
import { ThemedRoot } from './themed-root'

export function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <KeyboardLayerProvider>
          <DialogProvider>
            <PromptConfigProvider>
              <ThemedRoot>
                <Outlet />
              </ThemedRoot>
            </PromptConfigProvider>
          </DialogProvider>
        </KeyboardLayerProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
