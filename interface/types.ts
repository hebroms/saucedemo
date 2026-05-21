import { ROUTES } from '../constants/routes'

export interface PageContext {
  baseUrl: string
  timeout?: number
}

export interface TestUser {
  username: string
  password: string
}

export interface ElementLocators {
  [key: string]: string
}

export type RouteName = keyof typeof ROUTES
