/* eslint-disable */
import axios from 'axios'
import qs from 'qs'
import config from '@/config/config'

axios.defaults.baseURL = config.host

let api = {
  waitForRefreshToken: null,
  isRefreshing: false,
  requestHeaders: {
    'Content-Type': 'application/json'
  },
  request: function (config) {
    let that = this

    that.requestHeaders['Authorization'] = localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
    config['headers'] = that.requestHeaders

    // 创建一个Promise，以实现token检查以及
    let promise = new Promise(function (resolve, reject) {
      if(that.isRefreshing) {
        waitForRefreshToken.then(function (res) {
          that.tryDorequestAgain(config, resolve, reject)
        }).catch(function (err) {
          reject(err)
        })
      } else {
        axios(config).then(function (res) {
          resolve(res)
        }).catch(function(err){
          if(err.response && err.response.status == 401) {
            if(that.isRefreshing) {
              waitForRefreshToken.then(function (res) {
                that.tryRequestAgain(config, resolve, reject)
              }).catch(function (err) {
                reject(err)
              })
            } else {
              that.refreshToken().then(function (res) {
                localStorage.setItem('access_token', res.data.access_token)
                localStorage.setItem('refresh_token', res.data.refresh_token)
                that.tryRequestAgain(config, resolve, reject)
              }).catch(function (err) {
                console.log('refresh failed')
                localStorage.clear()
                window.location.href = '/login'
              }).finally(function (e) {
                that.isRefreshing = false
              })
            }
          } else {
            reject(err)
          }
        })
      }
    })
    return promise
  },
  refreshToken: function () {
    let that = this
    that.isRefreshing = true
    that.waitForRefreshToken = axios.post(config.host + '/oauth/token', qs.stringify({
      'grant_type': 'refresh_token',
      'refresh_token': localStorage.getItem('refresh_token'),
      'client_id': 'hycloud-manage-user',
      'client_secret': '123'
    }),{
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    return that.waitForRefreshToken
  },
  tryRequestAgain: function (config, resolve, reject) {
    let that = this
    that.waitForRefreshToken.then(function(res){
      that.requestHeaders['Authorization'] = localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      config['headers'] = that.requestHeaders
      axios(config).then(function(res){
        resolve(res)
      }).catch(function(err){
        reject(err)
      })
    }).catch(function (err) {
      reject(err)
    })
  },
  storeToken: function (token) {
    localStorage.setItem('access_token', token.access_token)
    localStorage.setItem('token_type', token.token_type)
    localStorage.setItem('expires_in', token.expires_in)
    localStorage.setItem('refresh_token', token.refresh_token)
  },
  get: function (url, data) {
    return this.request({
      method: 'get',
      url: url,
      data: data
    })
  },
  post: function (url, data) {
    return this.request({
      method: 'post',
      url: url,
      data: data
    })
  },
  put: function (url, data) {
    return this.request({
      method: 'put',
      url: url,
      data: data
    })
  },
  delete: function (url, data) {
    return this.request({
      method: 'delete',
      url: url,
      data: data
    })
  },
  login: function (username, password) {
    let req = axios.create({})
    return req.post('/oauth/token?grant_type=password',
      qs.stringify({
        'username': username,
        'password': password,
        'client_id': 'hycloud-manage-user',
        'client_secret': '123'
      }), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
  }
}

export default api
