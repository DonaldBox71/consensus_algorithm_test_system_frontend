const devBaseUrl = 'http://localhost:80'//本地Url
const wsurl_dev = 'ws://localhost:80/ws/'//websocket

const proBaseUrl = '/api'//部署url
const wsurl_pro = 'ws://218.77.107.189:8082/ws/'
//DEV PUSH测试2
let BASE_URL;
let wsurl;

if(process.env.NODE_ENV === 'development'){
  BASE_URL = devBaseUrl
  wsurl = wsurl_dev

}else {
  BASE_URL = proBaseUrl
  wsurl = wsurl_pro
}
//process.env.NODE_ENV === 'development' ? BASE_URL = devBaseUrl : BASE_URL = proBaseUrl ;
export default{
  BASE_URL,
  wsurl

}
