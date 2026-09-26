import { useContext, createContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  DEFAULT_CHAT_MODEL_ID,
  type SupportedChatModelId,
} from '@nightcode/shared'
import { Mode } from '@nightcode/database/enums'

type PromptConfigContextValue = {
  mode: Mode
  toggleMode: () => void
  setMode: (mode: Mode) => void
  model: SupportedChatModelId
  setModel: (model: SupportedChatModelId) => void
}

const PromptConfigContext = createContext<PromptConfigContextValue | undefined>(
  undefined,
)

export function PromptConfigProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(Mode.BUILD)
  const [model, setModel] = useState<SupportedChatModelId>(
    DEFAULT_CHAT_MODEL_ID,
  )

  const toggleMode = useCallback(() => {
    setMode((m) => (m === Mode.BUILD ? Mode.PLAN : Mode.BUILD))
  }, [])

  return (
    <PromptConfigContext.Provider
      value={{
        mode,
        toggleMode,
        setMode,
        model,
        setModel,
      }}
    >
      {children}
    </PromptConfigContext.Provider>
  )
}

export function usePromptConfig(): PromptConfigContextValue {
  const value = useContext(PromptConfigContext)

  if (!value)
    throw new Error(
      'usePrompt config must be used within a PromptConfigProvider',
    )

  return value
}
