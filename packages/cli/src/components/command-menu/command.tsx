import type { Command } from './types'
import { ThemeDialogContent } from '../dialogs'

export const COMMANDS: Command[] = [
  {
    name: 'new',
    description: 'Start a new conversation',
    value: '/new',
    action: (ctx) => {
      ctx.toast.show({ message: 'New conversation started' })
    },
  },
  {
    name: 'agents',
    description: 'Switch agents',
    value: '/agents',
    action: (ctx) => {
      ctx.dialog.open({
        title: 'Select Mode',
        children: <text>Agent selection coming soon</text>,
      })
    },
  },
  {
    name: 'models',
    description: 'Select ai model for generation',
    value: '/models',
    action: (ctx) => {
      ctx.toast.show({ message: 'Selecting model' })
    },
  },
  {
    name: 'sessions',
    description: 'Browse past sessions',
    value: '/session',
    action: (ctx) => {
      ctx.toast.show({ message: 'Loading sessions' })
    },
  },
  {
    name: 'theme',
    description: 'Change color theme',
    value: '/theme',
    action: (ctx) => {
      ctx.dialog.open({
        title: 'Select Theme',
        children: <ThemeDialogContent />,
      })
    },
  },
  {
    name: 'login',
    description: 'Sign in with your browser',
    value: '/login',
    action: (ctx) => {
      ctx.toast.show({ message: 'Opening browser to login' })
    },
  },
  {
    name: 'logout',
    description: 'Sign out of your account',
    value: '/logout',
    action: (ctx) => {
      ctx.toast.show({ message: 'Logging out', variant: 'success' })
    },
  },
  {
    name: 'upgrade',
    description: 'Buy more credits',
    value: '/upgrade',
    action: (ctx) => {
      ctx.toast.show({ message: 'Opening credits checkout' })
    },
  },
  {
    name: 'usage',
    description: 'Open billging portal in your browser',
    value: '/usage',
    action: (ctx) => {
      ctx.toast.show({ message: 'Opening billing portal' })
    },
  },
  {
    name: 'exit',
    description: 'Quit the application',
    value: '/exit',
    action: (ctx) => {
      ctx.exit()
    },
  },
]
