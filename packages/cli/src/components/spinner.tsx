import { useTheme } from '../providers/theme'
import 'opentui-spinner/react'
import { Mode } from '@nightcode/database/enums'

type Props = {
  mode?: Mode
}

export function Spinner({ mode = Mode.BUILD }: Props) {
  const { colors } = useTheme()

  return (
    <spinner
      name="aesthetic"
      color={mode === Mode.BUILD ? colors.primary : colors.planMode}
    />
  )
}
