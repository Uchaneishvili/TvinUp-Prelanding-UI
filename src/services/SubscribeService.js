import RequestHelper from '../util/RequestHelper'

export const subscribe = async (body) => {
  return await RequestHelper.beesbid.post(`/subscribe`, body)
}

export const sendEmailViaMailchimp = async (body) => {
  return await RequestHelper.beesbid.post(`/sendEmail`, body)
}
