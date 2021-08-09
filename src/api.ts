import axios  from "axios";

const service = axios.create({
  baseURL:'http://127.0.0.1:7001', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

interface checkUserData {
  accountName:string
  userId:string | number
}

export const checkUserApi = (data:checkUserData) => {
  return service({
    url:'/api/checkUser',
    method:"post",
    data
  })
}




export const getUserAccountApi = (data:any) => {
  return service({
    url:'/api/getUserAccount',
    method:'post',
    data
  })
}


export const getTemplateApi = (params:{
  key:any
}) => {
  return service({
    url:"/api/getTemplate",
    method:'get',
    params
  })
}

export const getAlipayAddressApi = () => {
  return service({
      url:'/api/getAlipayAddress',
      method:'get'
  })
}

export const createRechargeApi = (data:any):any => {
  return service({
    url:'/api/createRecharge',
    method:'post',
    data
  })
}

export const updateRechargeApi = (data:any):any => {
  return service({
    url:'/api/updateRecharge',
    method:'post',
    data
  })
}

export const checkUserUsdtApi = (data:any):any => {
  return service({
    url:'/api/checkUserUsdt',
    method:'post',
    data
  })
}

export const checkUsdtRechargeApi = (data:any):any => {
  return service({
    url:'/api/checkUsdtRecharge',
    method:'post',
    data
  })
}


export const transApi = (data:any):any => {
  return service({
    url:'/api/accountTrans',
    method:'post',
    data
  })
}


export const addAddressApi = (data:any):any => {
  return service({
    url:'/api/addUserAddress',
    method:'post',
    data
  })
}

export const createRedPackApi = (data:any):any => {
  return service({
    url:'/api/createRedpack',
    method:"post",
    data
  })
}

export const getRedPackApi = (data:any):any => {
  return service({
    url:'/api/getRedPack',
    method:'post',
    data
  })
}

export const checkIsSelfPackApi = (data:any):any => {
  return service({
    url:'/api/checkIsSelfPack',
    method:'post',
    data
  })
}