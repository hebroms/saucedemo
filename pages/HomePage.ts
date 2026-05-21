import { Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { HomeElements } from '../elements/HomeElements'

export class HomePage extends BasePage {
  readonly acceptedusernamesarestandarduserlockedoutuserproblemuserperformanceglitchusererroruservisu = this.page.locator(HomeElements.acceptedusernamesarestandarduserlockedoutuserproblemuserperformanceglitchusererroruservisu)
  readonly username = this.page.locator(HomeElements.username)
  readonly password = this.page.locator(HomeElements.password)
  readonly loginbutton = this.page.locator(HomeElements.loginbutton)
  readonly acceptedusernamesarestandarduserlockedoutuserproblemuserperformanceglitchusererroruservisu = this.page.locator(HomeElements.acceptedusernamesarestandarduserlockedoutuserproblemuserperformanceglitchusererroruservisu)
  readonly acceptedusernamesarestandarduserlockedoutuserproblemuserperformanceglitchusererroruservisu = this.page.locator(HomeElements.acceptedusernamesarestandarduserlockedoutuserproblemuserperformanceglitchusererroruservisu)

  constructor(page: Page) {
    super(page)
  }

  async navigateTo(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/')
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    return this.page.url().includes('/')
  }
}
