`以下说明以10.35.80.17平台为例：`     
`1`在icc平台运维
https://10.35.80.17/config/#/securityConfig 中系统管理-安全管理-Nginx配置-开启http调试模式   
`2`吧h265Websocket文件夹复制到 10.35.80.17环境 /opt/evoWpms/static 路径  
`3`登录http://10.35.80.17:83/#/login 后，访问 http://10.35.80.17:83/static/h265Websocket/index.html 看到demo页面  
`4`配置录像计划等视频配置并在客户端-录像回放查询到录像。  
`5`把查询到录像的设备通道编码和平台服务器ip填入demo相应输入框中，accessToken是从localStroage 中获取的，失效后刷新平台页面即可
`6`选择录像类型，点击获取RTSP地址，获取成功后点击开始拉流即可拉流