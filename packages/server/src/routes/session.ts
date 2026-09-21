import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { findSupportedChatModel } from '@nightcode/shared'
import { db } from '@nightcode/database'
import { Role, MessageStatus, Mode } from '@nightcode/database/enums'

const createSessionSchema = z.object({
  title: z.string(),
  cwd: z.string().optional(),
  initalMessage: z
    .object({
      role: z.enum(Role),
      content: z.string(),
      mode: z.enum(Mode),
      model: z
        .string()
        .refine((id) => !!findSupportedChatModel(id), 'Unsupported Model'),
    })
    .optional(),
})

const createSessionValidator = zValidator(
  'json',
  createSessionSchema,
  (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid request body' }, 400)
    }
  },
)

const app = new Hono()
  .get('/', async (c) => {
    const sessions = await db.session.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    })
    return c.json(sessions)
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const session = await db.session.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }

    return c.json(session)
  })
  .post('/', createSessionValidator, async (c) => {
    const { initalMessage, ...data } = c.req.valid('json')

    const session = await db.session.create({
      data: {
        ...data,
        userId: 'mock-user',
        ...(initalMessage && {
          messages: {
            create: {
              ...initalMessage,
              status: MessageStatus.COMPLETE,
            },
          },
        }),
      },
      include: { messages: true },
    })

    return c.json(session, 201)
  })

export default app
