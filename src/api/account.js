import request from '@/utils/request'

const accountApi = {
  GetAccountList: '/user/acclist',
  AddAccount: '/user/account',
  DeleteAccount: '/user/del',
  ModifyAccount: '/user/updateacc'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 * }
 * @param parameter
 * @returns {*}
 */
export function getAccountList(parameter) {
  return request({
    url: accountApi.GetAccountList,
    method: 'get',
    params: parameter
  })
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 * }
 * @param parameter
 * @returns {*}
 */
export function addAccount(parameter) {
  return request({
    url: accountApi.AddAccount,
    method: 'post',
    data: parameter
  })
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 * }
 * @param parameter
 * @returns {*}
 */
export function deleteAccount(parameter) {
  return request({
    url: accountApi.DeleteAccount,
    method: 'post',
    data: parameter
  })
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 * }
 * @param parameter
 * @returns {*}
 */
export function modifyAccount(parameter) {
  return request({
    url: accountApi.ModifyAccount,
    method: 'post',
    data: parameter
  })
}
