import RequestHelper from '../util/RequestHelper'

export const subscribe = async (body) => {
  return await RequestHelper.beesbid.post(`/subscribe`, body)
}
