//index.js
//获取应用实例
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');

var lonlat;
var city;

var markersData = [];
const app = getApp()

Page({
  data: {
    Height: 0,
    scale: 18,
    latitude: "",
    longitude: "",
    markers: [],
    textData: {},
    city: '',
    tips: {}
  },

  //点击marker
  markertap: function (e) {
    console.log(e.markerId)
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },

  onLoad: function (e) {
    lonlat = e.lonlat;
    city = e.city;

    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    var params = {
      iconPathSelected: "../../images/marker_checked.png",
      iconPath: "../../images/marker.png",
      success: function (data) {
        markersData = data.markers;
        var poisData = data.poisData;
        var markers_new = [];
        markersData.forEach(function (item, index) {
          markers_new.push({
            id: item.id,
            latitude: item.latitude,
            longitude: item.longitude,
            iconPath: item.iconPath,
            width: item.width,
            height: item.height
          })
        })

        if (markersData.length > 0) {
          that.setData({
            markers: markers_new,
            city: poisData[0].cityname || '',
            latitude: markersData[0].latitude,
            longitude: markersData[0].longitude,
          });
          that.showMarkerInfo(markersData, 0);
        } else {
          wx.getLocation({
            type: 'gcj02',
            success: function (res) {
              that.setData({
                latitude: res.latitude,
                longitude: res.longitude,
                city: '北京市'
              });
            },
            fali: function () {
              that.setData({
                latitude: 39.909729,
                longitude: 116.398419,
                city: '北京市'
              });
            }
          })

          that.setData({
            textData: {
              name: '抱歉，未找到结果',
              desc: ''
            }
          });
        }
      },

      fail: function (info) {
        // wx.showModal({title:info.errMsg})
      }
    }

    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        that.setData({
          view: {
            Height: res.windowHeight
          }
        })
      }
    })

    if (e && e.keywords) {
      params.querykeywords = e.keywords;
    }
    myAmapFun.getPoiAround(params)

    console.log("1")

  },

  /* onShow:function(){
    console.log('onshow');
    this.onLoad();
  }, */

  showMarkerInfo: function (data, i) {
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },

  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: lonlat,
      city: city,
      success: function (data) {
        if (data && data.tips) {
          that.setData({
            tips: data.tips
          });
        }
      }
    })
  },

  bindInputStart: function (e) {
    var that = this;
    var url = '../inputtips/input';
    if (e.target.dataset.latitude && e.target.dataset.longitude && e.target.dataset.city) {
      var dataset = e.target.dataset;
      url = url + '?lonlat=' + dataset.longitude + ',' + dataset.latitude + '&city=' + dataset.city;
    }
    wx.redirectTo({
      url: url
    })

  },

  //用户选择好地点后，需要调用网络请求来重新渲染当前页面
  bindSearch: function (e) {

    var keywords = e.target.dataset.keywords;
    var url = '../poi/poi';
    url = url + '?keywords=' + keywords;
    wx.redirectTo({
      url: url
    })

    console.log(url)

  },

  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        data[j].iconPath = "../../images/marker_checked.png";
      } else {
        data[j].iconPath = "../../images/marker.png";
      }
      markers.push({
        id: data[j].id,
        latitude: data[j].latitude,
        longitude: data[j].longitude,
        iconPath: data[j].iconPath,
        width: data[j].width,
        height: data[j].height
      })
    }
    that.setData({
      markers: markers
    });
  }

})