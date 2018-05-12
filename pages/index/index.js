//index.js

const context = (function () {
   return {
   }
})()

Page({
   data: {
      Height: 0,
      scale: 18,
      latitude: 22.93772,
      longitude: 113.38424,
      markers: [],
      controls: [],
      textData: {},
      city: '',
   },

   // 移动到当前位置
   moveToMyLocation: function () {
      context.map.moveToLocation()
   },

   // 地图控件点击事件
   controltap: function(e) {
      switch (e.controlId) {
         case "i-position":
            this.moveToMyLocation()
            break
      }
   },

   //点击marker
   markertap: function (e) {
   },

   // 中心点改变
   regionchange: function (e) {

   },

   onLoad: function (e) {
      // 提取this信息
      const _this = this

      // 初始化地图上下文
      context.map = wx.createMapContext("map")

      // 获取系统信息
      wx.getSystemInfo({
         success: function (res) {
            context.info = res
            _this.setData({
               controls: [
                  {
                     id: "i-position",
                     position: {
                        left: 25,
                        top: res.windowHeight - 45,
                        width: 18,
                        height: 18
                     },
                     iconPath: "/assets/img/i-position.png",
                     clickable: true
                  }
               ]
            })
         }
      })

      // 获取当前位置
      wx.getLocation({
         success: function (res) {
            console.log(res)
            _this.setData({
               latitude: res.latitude,
               longitude: res.longitude
            })
         }
      })
   }

})