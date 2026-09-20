import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { SessionShell } from '../components/session-shell'
import { UserMessage, BotMessage, ErrorMessage } from '../components/messages'

export function NewSession() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as { message: string } | null

  useEffect(() => {
    if (!state?.message) {
      navigate('/', { replace: true })
    }
  }, [state, navigate])

  if (!state?.message) return null

  return (
    <SessionShell onSubmit={() => {}} inputDisabled loading>
      <UserMessage message={state.message} />
      <BotMessage
        model="opus-4-6"
        content="This is a sample bot response demonstrate the message layout"
      />
      <ErrorMessage message="This is a sample Error message" />
    </SessionShell>
  )
}
