// 本json格式是为Mock.js生成用的
// 语法规则：http://mockjs.com/#数据模板定义 DTD
// 测试地址：http://mockjs.com/editor.html
var json_template = {
  "code": "0",
  "data": {
  	"product_status": "@integer(0,2)",
  	// 商品状态 0-可买， 1-无货， 2-补货
  	"cart_num": "@integer(0,99)",
  	"brief":{
	    "product_name": "@cname - @cname",
	    // 商品名
	    "price": "@float(1,499,2,2)",
	    // 售价
	    "ex_price": "@float(500,999,2,2)",
	    // 原价
	    "note": "@cname",
	    // 优惠信息，例如："买一送一"
	    "desc": "@paragraph(2,3)",
	    // 商品描述
	    "features_1": [
	      // 特性，在下方icon显示
	      "FreePost", // 满88包邮
	      "Quality", // 品质保证
	      "Days7", // 七天无理由退还
	    ],
	    "features_2|3": [
	      // 其他特性，在icon下方的ul>li中显示
	      "@string(8,16)"
	    ]
  	},
    "rolling|2-4": [
      // 页面最上方轮播的内容
      {
        "type|1": ["video", "image"],
        // 类型，视频或者图片，一个商品最多只能有一个视频
        "cover_url": "@image('750x750', '@color', '750 x 750')",
        // 图片地址，如果type为视频则为poster的地址
        "video_url": "http://v.xiaohongchun.com/688C485F89B9442B"
          // 视频地址，若type为image，不需要video_url
      }
    ],
    "usingusers|2-4": [
      // 看看谁在用，评论模块
      {
        "cover_url": "@image('700x700', '@color', '700 x 700')",
        // 图片地址
        "video_url|1": [
        	"http://v.xiaohongchun.com/688C485F89B9442B",
        	"http://v.xiaohongchun.com/490353CEAA93DD7F",
        	"http://v.xiaohongchun.com/F09E8A09578A9DE9",
        	"http://v.xiaohongchun.com/10F7C01695BA145A",
        	"http://v.xiaohongchun.com/79DF0D23F9A91B1B"
        ],
        // 视频地址
        "face_img": "@image('65x65', '@color', '65x65')",
        // 头像地址
        "user_id": "@integer(100000,300000)",
        // 用户ID
        "username": "@word(3,15)",
        // 用户名
        "joindays": "@integer(0,300)",
        // 注册天数
        "comment": "@paragraph(1,2)"
          // 评论内容
      }
    ],
    "big_img": "@image('678x678', '@color', '678 x 678')",
    // 下方大图地址
    "text|1-3": [
      // 文字模块，例如小贴士等
      {
        "title": "@word(3,15)",
        // 标题
        "content": "@paragraph(1,3)"
        // 内容
      }
    ]
  }
};


var real_data = {
	pagetitle:'小红唇种草机',
	rolling:[
		{
			type:'video',
			cover_url:'http://i.xiaohongchun.com/A70F0EF39F6CAA48',
			video_url:'http://v.xiaohongchun.com/688C485F89B9442B'
		},
		{
			type:'image',
			image_url:'http://i.xiaohongchun.com/F9DC889CE20AC2E0'
		},
		{
			type:'image',
			image_url:'http://i.xiaohongchun.com/4483C36292BF2AE6'
		},
		{
			type:'image',
			image_url:'http://i.xiaohongchun.com/9B78D899E3F52114'
		}
	],
	brief:{
		price1:'000.00',
		price2:'0000.00',
		otherinfo: '我也不知道在这写点什么',
		title: '商品标题',
		description: '啦啦啦，在这写点什么呢，呀呀呀',
		country_code: 'usa',
		country_name: '美国',
		props:[
			'FreePost',
			'Quality',
			'Days7',
		],
		info:[
			'这是第一条',
			'这是第二条',
			'这是第三条'
		]
	},
	usinguser:[
		{
			cover_url:'http://i.xiaohongchun.com/F6EA05CDE1655CE9',
			desc:'#陆小丫的美妆教程#不用卧蚕笔也能打造美美的卧蚕哦，产品：ZA大地色系四色眼影（全国专柜··',
			face_url:'images/avatar.png',
			nick:'用户名',
			joinindays:276,
			user_id:123
		},
		{
			cover_url:'http://i.xiaohongchun.com/4F1CE61C911FA3DC',
			desc:'#陆小丫的美妆教程#不用卧蚕笔也能打造美美的卧蚕哦，产品：ZA大地色系四色眼影（全国专柜··',
			face_url:'images/avatar.png',
			nick:'用户名',
			joinindays:276,
			user_id:234
		},
		{
			cover_url:'http://i.xiaohongchun.com/F17259DD197146EE',
			desc:'#陆小丫的美妆教程#不用卧蚕笔也能打造美美的卧蚕哦，产品：ZA大地色系四色眼影（全国专柜··',
			face_url:'images/avatar.png',
			nick:'用户名',
			joinindays:276,
			user_id:345
		},
		{
			cover_url:'http://i.xiaohongchun.com/F9DC889CE20AC2E0',
			desc:'#陆小丫的美妆教程#不用卧蚕笔也能打造美美的卧蚕哦，产品：ZA大地色系四色眼影（全国专柜··',
			face_url:'images/avatar.png',
			nick:'用户名',
			joinindays:276,
			user_id:456
		},
	],
	comment: [
		{
			nick:'逆光Neo',
			user_id:1234,
			face_url:'images/avatar.png',
			comment:'看我怎么说，我怎么知道说什么……呵呵呵'
		},
		{
			nick:'逆光Neo',
			user_id:1234,
			face_url:'images/avatar.png',
			comment:'看我怎么说，我怎么知道说什么……呵呵呵'
		},
		{
			nick:'逆光Neo',
			user_id:1234,
			face_url:'images/avatar.png',
			comment:'看我怎么说，我怎么知道说什么……呵呵呵'
		}
	],
	cart_num:9
}

var json = Mock.mock(json_template);
// var json = real_data;