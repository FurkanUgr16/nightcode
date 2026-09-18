import type { Command } from './types'

export const COMMANDS: Command[] = [
  {
    name: 'new',
    description: 'Start a new conversation',
    value: '/new',
  },
  {
    name: 'agents',
    description: 'Switch agents',
    value: '/agents',
  },
  {
    name: 'models',
    description: 'Select ai model for generation',
    value: '/models',
  },
  {
    name: 'sessions',
    description: 'Browse past sessions',
    value: '/session',
  },
  {
    name: 'theme',
    description: 'Change color theme',
    value: '/theme',
  },
  {
    name: 'login',
    description: 'Sign in with your browser',
    value: '/login',
  },
  {
    name: 'logout',
    description: 'Sign out of your account',
    value: '/logout',
  },
  {
    name: 'usage',
    description: 'Open billging portal in your browser',
    value: '/usage',
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
