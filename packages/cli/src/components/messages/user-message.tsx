import { Mode } from '@nightcode/database/enums'
import { useTheme } from '../../providers/theme'

type Props = {
  message: string
  mode: Mode
}

export function UserMessage({ message, mode }: Props) {
  const { colors } = useTheme()

  return (
    <box width={'100%'} alignItems="center">
      <box
        borderColor={mode === Mode.PLAN ? colors.planMode : colors.primary}
        width={'100%'}
        border={['left']}
      >
        <box
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor={colors.surface}
          width={'100%'}
        >
          <text>{message}</text>
        </box>
      </box>
    </box>
  )
}
