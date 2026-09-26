import { CommandMenu } from './command-menu'
import { StatusBar } from './statusbar'
import type { KeyBinding, TextareaRenderable } from '@opentui/core'
import { useEffect, useCallback, useRef } from 'react'
import { useRenderer, useKeyboard } from '@opentui/react'
import type { Command } from './command-menu/types'
import { useCommandMenu } from './command-menu/use-command-menu'
import { useToast } from '../providers/toast'
import { useKeyboardLayer } from '../providers/keyboard-layer'
import { useDialog } from '../providers/dialog'
import { useTheme } from '../providers/theme'
import { useNavigate } from 'react-router'
import { usePromptConfig } from '../providers/prompt-config'
import { Mode } from '@nightcode/database/enums'

type Props = {
  onSubmit: (text: string) => void
  disabled?: boolean
}

export const TEXT_AREA_KEYBINDINGS: KeyBinding[] = [
  { name: 'return', action: 'submit' },
  { name: 'enter', action: 'submit' },
  { name: 'return', shift: true, action: 'newline' },
  { name: 'enter', shift: true, action: 'newline' },
]

export function InputBar({ onSubmit, disabled }: Props) {
  const textareaRef = useRef<TextareaRenderable>(null)
  const onSubmitRef = useRef<() => void>(() => {})
  const renderer = useRenderer()
  const {
    resolveCommand,
    commandQuery,
    handleContentChange,
    scrollRef,
    selectedIndex,
    setSelectedIndex,
    showCommandMenu,
  } = useCommandMenu()
  const toast = useToast()
  const { setResponder, isTopLayer } = useKeyboardLayer()
  const dialog = useDialog()
  const navigate = useNavigate()
  const { mode, model, setMode, setModel, toggleMode } = usePromptConfig()

  const handleTextAreaContentChange = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const text = textarea.plainText

    handleContentChange(text)
  }, [handleContentChange])

  const handleSubmit = useCallback(() => {
    if (disabled) return

    const textarea = textareaRef.current
    if (!textarea) return

    const text = textarea.plainText.trim()

    if (text.length === 0) return

    onSubmit(text)
    textarea.setText('')
  }, [disabled, onSubmit])

  const handleCommand = useCallback(
    (command: Command | undefined) => {
      const textarea = textareaRef.current

      if (!textarea || !command) return

      textarea.setText('')

      if (command.action) {
        command.action({
          exit: () => renderer.destroy(),
          toast,
          dialog,
          navigate,
          mode,
          setMode,
          setModel,
        })
      } else {
        textarea.insertText(command.value + ' ')
      }
    },
    [renderer, toast, dialog, navigate, mode, setMode, setModel],
  )

  const handleCommandExecute = useCallback(
    (index: number) => {
      const command = resolveCommand(index)
      handleCommand(command)
    },
    [handleCommand, resolveCommand],
  )

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.onSubmit = () => {
      onSubmitRef.current()
    }
  }, [])

  onSubmitRef.current = () => {
    if (disabled) return
    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex)
      handleCommand(command)
      return
    }
    handleSubmit()
  }

  useKeyboard((key) => {
    if (disabled) return

    if (!isTopLayer('base')) return

    if (key.name === 'tab') {
      key.preventDefault()
      toggleMode()
    }
  })

  useEffect(() => {
    setResponder('base', () => {
      if (disabled) return false

      const textarea = textareaRef.current
      if (textarea && textarea.plainText.length > 0) {
        textarea.setText('')
      }
      return false
    })

    return () => setResponder('base', null)
  }, [disabled, setResponder])

  const { colors } = useTheme()

  return (
    <box width={'100%'}>
      <box
        border={['left']}
        borderColor={mode === Mode.BUILD ? colors.primary : colors.planMode}
      >
        <box
          position="relative"
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor={colors.surface}
          width={'100%'}
          gap={1}
        >
          {showCommandMenu && (
            <box
              position={'absolute'}
              bottom={'100%'}
              left={0}
              width={'100%'}
              zIndex={10}
              backgroundColor={colors.surface}
            >
              <CommandMenu
                query={commandQuery}
                selectedIndex={selectedIndex}
                scrollRef={scrollRef}
                onSelect={setSelectedIndex}
                onExecute={handleCommandExecute}
              />
            </box>
          )}
          <textarea
            focused={!disabled && (isTopLayer('base') || isTopLayer('command'))}
            keyBindings={TEXT_AREA_KEYBINDINGS}
            placeholder={'Ask anything... "Fix a bug in the database"'}
            onContentChange={handleTextAreaContentChange}
            ref={textareaRef}
          />
          <StatusBar />
        </box>
      </box>
    </box>
  )
}
