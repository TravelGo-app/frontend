import api from './api'

export type EmailPreferences = {
  notifyDeposits: boolean
  notifyTransfersSent: boolean
  notifyTransfersReceived: boolean
  notifyExchanges: boolean
  notifyLoginDashboardReminder: boolean
}

export async function getEmailPreferences(): Promise<EmailPreferences> {
  const response = await api.get('/profile/email-preferences')

  return response.data.preferences ?? response.data
}

export async function updateEmailPreferences(
  changes: Partial<EmailPreferences>,
): Promise<EmailPreferences> {
  const response = await api.patch('/profile/email-preferences', changes)

  return response.data.preferences ?? response.data
}

export async function sendDashboardSummaryEmail(
  days: 7 | 30 = 30,
): Promise<any> {
  const response = await api.post('/profile/dashboard-summary-email', {
    days,
  })

  return response.data
}
