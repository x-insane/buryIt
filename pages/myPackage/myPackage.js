// pages/myPackage/myPackage.js
Page({
  data: {
    currentTab: 0,
    swiperItem:[0,1],
    packages:[{
      id:1,
      name:"xixi",
      hasBuried:false,
      infor:"hello world",
      stared:false
    },
    {
      id: 2,
      name: "xixi",
      hasBuried:true,
      infor:"hihihi",
      stared: true
    },
    {
      id: 3,
      name: "xixi",
      hasBuried: true,
      infor: "hihihi",
      stared: false
    },
    {
      id: 4,
      name: "dsadasda",
      hasBuried: false,
      infor: "eqwecxzcxi",
      stared: false
    },
    {
      id: 5,
      name: "xixi",
      hasBuried: true,
      infor: "hihihi",
      stared: true
    },
    {
      id: 6,
      name: "xixi",
      hasBuried: true,
      infor: "hihihi",
      stared: true
    },
    {
      id: 7,
      name: "dsadasd",
      hasBuried: false,
      infor: "vxcvfdadsa",
      stared: true
    },
    {
      id: 8,
      name: "xixi",
      hasBuried: true,
      infor: "hihihi",
      stared: false
    }
    ]
  },
  //滑动换页
  swiperTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  //点击换页
  clickTab: function (e) {
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //点击跳转到details页
  goToDetails: function(e){
    var packageId=e.currentTarget.dataset.packageId;
    wx.navigateTo({
      url: '/pages/packageDetails/packageDetails?id='+packageId
    })
  },
  //悬浮add按钮
  add:function(e){
    wx.navigateTo({
      url: '/pages/addPackage/addPackage',
    })
  },
  //star按钮
  starIt:function(e){
    var index=e.currentTarget.dataset.xuHao;
    var stars=e.currentTarget.dataset.hasStared;
    if(stars==true){
      this.data.packages[index].stared=false;
      this.setData({
        packages:this.data.packages
      })
    }
    else{
      this.data.packages[index].stared=true;
      this.setData({
        packages:this.data.packages
      })
    }
  }
})