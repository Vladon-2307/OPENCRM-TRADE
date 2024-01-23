

export interface ICounterparty {
  id: number

  name: string

  account_number: string

  bank_name: string

  code_bank: string

  legal_address: string

  mailing_address: string

  phone: string

  unn: string

  okpo: string

  created_at: Date

  updated_at: Date
}

export interface IResCounterparty{
  count: number,
  data: ICounterparty[]
}

export interface ICounterpartyEdit {

  name: string

  account_number?: string

  bank_name?: string

  code_bank?: string

  legal_address?: string

  mailing_address?: string

  phone?: string

  unn?: string

  okpo?: string
}
