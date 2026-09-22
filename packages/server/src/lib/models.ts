import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import {
  findSupportedChatModel,
  type SupportedChatModel,
  type SupportedChatModelId,
  type SupportedProvider,
} from '@nightcode/shared'

import type { LanguageModel } from 'ai'

type AnthropicModelId = Extract<
  SupportedChatModel,
  { provider: 'anthropic' }
>['id']

type OpenAIModelId = Extract<SupportedChatModel, { provider: 'openai' }>['id']

export type ResolvedModel = {
  model: LanguageModel
  provider: SupportedProvider
  modelId: SupportedChatModelId
}

function assertUnsupportedProvider(provider: never): never {
  throw new Error(`Unsuppoerted Provider, ${provider}`)
}

function resolveAnthropicModel(modelId: AnthropicModelId): ResolvedModel {
  return {
    model: anthropic(modelId),
    modelId,
    provider: 'anthropic',
  }
}

function resolveOpenAIModel(modelId: OpenAIModelId): ResolvedModel {
  return {
    model: openai(modelId),
    modelId,
    provider: 'openai',
  }
}

function resolveSupportedChatModel(model: SupportedChatModel): ResolvedModel {
  const provider = model.provider

  switch (provider) {
    case 'anthropic':
      return resolveAnthropicModel(model.id)
    case 'openai':
      return resolveOpenAIModel(model.id)
    default:
      return assertUnsupportedProvider(provider)
  }
}

export function isSupportedChatModel(
  modelId: string,
): modelId is SupportedChatModelId {
  return findSupportedChatModel(modelId) != null
}

export function resolveChatModel(modelId: string): ResolvedModel {
  const model = findSupportedChatModel(modelId)

  if (!model) throw new Error(`Unsupported Model ${modelId}`)

  return resolveSupportedChatModel(model)
}
