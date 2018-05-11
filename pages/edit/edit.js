//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    uploadimgs: [], //上传图片列表
    editableImg: false, //是否可编辑
    editableVoice: false,
    isSpeaking: false,//是否正在说话
    voices: [], //音频数组
    isRecorded: false,
    isRecording: false,
    isPlaying: false,
    recordTime: 0,
    errorShowing: false,
    errorAnimation: {},
    errorText: '错误'
  },

  //表单提交
  submit: function () {
    var _this = this;
    wx.request({
      url: '',
      method: 'POST',
      data: {
        title: _this.data.title,
        text: _this.data.text,
        //不会填……realMode:

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        _this.setData({
          title: res.data.title,
          text: res.data.text,
          //不会填+1 realMode:
        });
        console.log(res.data)
      }
    })
  },


  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var _this = this;

    this.setData({
      uploadimgs: [],
      voices: []
    })

  },

  /**
     * 选择图片
     */
  chooseImage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },

  //选择照片（相册or拍照）
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({
          uploadimgs: _this.data.uploadimgs.concat(res.tempFilePaths)
        })
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: '',
          filePath: tempFilePaths[0],
          name: 'image',
          formData: {
            //可以在这里添加文件的附带信息
          },
          success: function (res) {

          },
          fail: function (res) {
            that.showError("上传失败，请重试")
          }
        })
      }
    })
  },

  editImage: function () {
    this.setData({
      editableImg: !this.data.editableImg
    })
  },

  //删除照片
  deleteImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var imgs = this.data.uploadimgs
    imgs.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      uploadimgs: imgs
    })

    wx.getSavedFileList({
      success: function (res) {
        var filePath = res.filePath
        if (res.fileList.length > 0) {
          wx.removeSavedFile({
            filePath: res.fileList[e.currentTarget.dataset.index].filePath,
            complete: function (res) {
              console.log(res)
            }
          })
        }
      }
    })
  },

  //开始录音
  startRecord: function () {
    this.setData({
      isRecording: true,
    })
    var _this = this;
    if (this.data.recordTime != 0) {
      this.setData({
        recordTime: 0,
      })
    }
    this.timeRequestId = setInterval(function () {
      _this.setData({
        recordTime: _this.data.recordTime + 1,
      })
      if (_this.data.recordTime > 60) {
        _this.stopRecord();
      }
    }, 1000)

    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        wx.uploadFile({
          url: '',
          filePath: tempFilePath[0],
          name: 'voice',
          formData: {
            //可以在这里添加文件的附带信息
          },
          success: function (res) {

          },
          fail: function (res) {
            that.showError("上传失败，请重试")
          }
        })
        console.log('tempFilePath:' + tempFilePath)

        //持久保存
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            //持久路径
            //本地文件存储的大小限制为 100M
            var savedFilePath = res.savedFilePath
            console.log("savedFilePath: " + savedFilePath)
          }
        })
        //获取录音音频列表
        wx.getSavedFileList({
          success: function (res) {
            var voices = [];
            for (var i = 0; i < res.fileList.length; i++) {
              //格式化时间
              var createTime = new Date(res.fileList[i].createTime*1000 )
              //将音频大小B转为KB
              var size = (res.fileList[i].size / 1024).toFixed(2);
              var voice = { filePath: res.fileList[i].filePath, createTime: Date(res.fileList[i].createTime * 1000), size: size };
              console.log("文件路径: " + res.fileList[i].filePath)
              console.log("文件时间: " + createTime)
              console.log("文件大小: " + size)
              voices = voices.concat(voice);
            }
            _this.setData({
              voices: voices
            })
          }
        })
        wx.showToast({
          title: '恭喜!录音成功',
          icon: 'success',
          duration: 1000
        })
        _this.data.recordFile = res.tempFilePath;
        _this.setData({
          isRecording: false,
        })
      },
      fail: function (res) {
        _this.showError('录音失败，请检查是否给予微信录音权限')
        _this.stopRecord();
      },

    })
  },

  //停止录音
  stopRecord: function () {
    clearInterval(this.timeRequestId);
    wx.stopRecord();
    this.setData({
      isRecording: false,
    })
  },

  //点击播放录音
  gotoPlay: function (e) {
    var filePath = e.currentTarget.dataset.key;
    //点击开始播放
    wx.showToast({
      title: '开始播放',
      icon: 'success',
      duration: 1000
    })
    wx.playVoice({
      filePath: filePath,
      success: function () {
        wx.showToast({
          title: '播放结束',
          icon: 'success',
          duration: 1000
        })
      }
    })
    this.setData({
      editableVoice: !this.data.editableVoice
    })
  },

  //删除录音
  deleteVoice: function (e) {
    console.log(e.currentTarget.dataset.index);
    var voices = this.data.voices
    voices.splice(e.currentTarget.dataset.index, 1)

    this.setData({
      voices: voices
    })

    wx.getSavedFileList({
      success: function (res) {
        var filePath = res.filePath
        if (res.fileList.length > 0) {
          wx.removeSavedFile({
            filePath: res.fileList[e.currentTarget.dataset.index].filePath,
            complete: function (res) {
              console.log(res)
            }
          })
        }
      }
    })

  },


  //显示错误信息
  showError: function (msg) {
    this.errorShowing = true;
    this.setData({
      errorText: msg
    });
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
      delay: 0
    });
    this.animation = animation;
    animation.opacity(1).step();
    this.setData({
      errorAnimation: this.animation.export()
    });
    setTimeout(this.hideError.bind(this), 2000)
  },

  hideError: function () {
    if (this.errorShowing === true) {
      this.errorShowing = false;
      this.animation.opacity(0).step();
      this.setData({
        errorAnimation: this.animation.export()
      })
    }
  },

})
