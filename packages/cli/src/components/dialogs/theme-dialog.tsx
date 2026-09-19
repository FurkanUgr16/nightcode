import { useCallback, useEffect, useRef } from 'react'
import { useDialog } from '../../providers/dialog'
import { useTheme } from '../../providers/theme'
import { DialogSearchList } from '../dialog-search-list'
import { type Theme, THEMES } from '../../theme'

export const ThemeDialogContent = () => {
  const dialog = useDialog()
  const { setTheme, currentTheme } = useTheme()

  const originalThemeRef = useRef(currentTheme)
  const confirmedRef = useRef(false)

  // revert to original theme if the user dismisses without confirming
  useEffect(() => {
    if (!confirmedRef.current) {
      setTheme(originalThemeRef.current)
    }
  }, [setTheme])

  const handleSelect = useCallback(
    (theme: Theme) => {
      confirmedRef.current = true
      setTheme(theme)
      dialog.close()
    },
    [setTheme, dialog],
  )

  const handleHighlight = useCallback(
    (theme: Theme) => {
      setTheme(theme)
    },
    [setTheme],
  )

  return (
    <DialogSearchList
      items={THEMES}
      onHighlight={handleHighlight}
      onSelect={handleSelect}
      filterFn={(t, query) =>
        t.name.toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(theme, isSelected) => (
        <text selectable={false} fg={isSelected ? 'black' : 'white'}>
          {theme.name === originalThemeRef.current.name
            ? '\u0020\u2022\u0020'
            : '\u0020\u0020\u0020'}
          {theme.name}
        </text>
      )}
      getKey={(t) => t.name}
      placeholder="Search Themes"
      emptyText="No matching themes"
    />
  )
}
