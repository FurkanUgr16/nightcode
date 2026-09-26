import { useCallback } from 'react'
import { useDialog } from '../../providers/dialog'
import { DialogSearchList } from '../dialog-search-list'
import { Mode } from '@nightcode/database/enums'

type AgentsDialogContentProps = {
  currentMode: Mode
  onSelectMode: (mode: Mode) => void
}

function getModeLabel(mode: Mode) {
  return mode === Mode.PLAN ? 'Plan' : 'Build'
}

export const AgentsDialogContent = ({
  currentMode,
  onSelectMode,
}: AgentsDialogContentProps) => {
  const dialog = useDialog()

  const handleSelect = useCallback(
    (nextMode: Mode) => {
      onSelectMode(nextMode)
      dialog.close()
    },
    [onSelectMode, dialog],
  )

  const AVAILABLE_MODES: Mode[] = [Mode.BUILD, Mode.PLAN]

  return (
    <DialogSearchList
      items={AVAILABLE_MODES}
      onSelect={handleSelect}
      filterFn={(item, query) =>
        getModeLabel(item).toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(item, isSelected) => (
        <text selectable={false} fg={isSelected ? 'black' : 'white'}>
          {item === currentMode ? '●' : ' '}
          {getModeLabel(item)}
        </text>
      )}
      getKey={(mode) => mode}
      placeholder="Search agenst"
      emptyText="No matching agents"
    />
  )
}
