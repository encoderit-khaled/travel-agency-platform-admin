export type SignInMethod = 'email' | 'google' | 'mobile'

export interface B2CCustomer {
  id: string
  name: string
  initials: string
  avatarColor: 'dark' | 'light'
  email: string | null
  mobile: string | null
  signinMethods: SignInMethod[]
  accountType: string
  isSampleData: boolean
  createdAt?: string
}

export type SignInMethodFilter = 'all' | SignInMethod
