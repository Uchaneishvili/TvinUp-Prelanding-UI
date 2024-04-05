import axios from 'axios'

export default class RequestHelper {
  static BEESBID_BASE_URL = process.env.REACT_APP_BEESBID_API
  static _beesbid = null

  static get beesbid() {
    if (!this._beesbid) {
      this._beesbid = axios.create({
        baseURL: this.BEESBID_BASE_URL,
      })
    }
    return this._beesbid
  }
}
