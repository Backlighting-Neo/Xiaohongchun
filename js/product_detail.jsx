var ProductDetail = React.createClass({
	getInitialState: function() {
    return {
			pagetitle:'小红唇种草机',
			rolling:[],
			brief:{
				price1: '',
				price2: '',
				otherinfo: '',
				title: '',
				description: '',
				country_code: '',
				country_name: '',
				props:[],
				info:[]
			},
			usinguser:[],
			comment:[],
			cart_num:0
    };
  },
	componentDidMount: function() {
		// TODO ajax
  	this.setState(data);
	},
	render: function() {
		return (
			<div className="ProductDetail">
				<ProductHeader
				  uptitle={this.state.pagetitle}
				  downtitle={this.state.brief.title}
				/>
				<ProductBriefInfoCard 
					item={this.state.rolling}
					brief={this.state.brief}
				/>
				<ProductUsingUser
				  item={this.state.usinguser}
				/>
				{	// 评论模块20101014删除
				// <ProductSection title="看大家怎么说">
				// 	{this.state.comment.map(function(item, index) {
				// 		return (
				// 			<ProductCommentCard key={index}
				// 				nick={item.nick}
				// 				face_url={item.face_url}
				// 				joinindays={item.joinindays}
				// 				comment={item.comment}
				// 				user_id={item.user_id}
				// 			/>
				// 		);
				// 	})}
				// </ProductSection>
				}
				<ProductSectionWithoutTitle>
				  <img src="images/video_screenshot.png" />
				</ProductSectionWithoutTitle>
				<ProductSection title="小贴士">
					巴拉巴拉
				</ProductSection>
				<ProductSection title="使用指南">
					巴拉巴拉
				</ProductSection>
				<ProductSectionPulldown title="种草设补充说明">
				  呀呀呀
				</ProductSectionPulldown>
				<ProductSectionPulldown title="消费者告知书">
				  呀呀呀
				</ProductSectionPulldown>
				<ProductBottomCommand cart_num={this.state.cart_num} />
				{productBottomCommandHolder}
			</div>
		);
	}
});

var goToUserPage =  function(user_id){
	return function(){
		location.href = './u/'+user_id;
		user_id = null;
	}
};

var ProductHeader = React.createClass({
	getInitialState: function() {
    return {
			title: this.props.uptitle
    };
  },
	componentDidMount: function() {
		mobile.scrolldown(function(height){
			if(height>660){
				this.setState({
					title:this.props.downtitle 
				});
			}
			else{
				this.setState({
					title:this.props.uptitle 
				});
			}
		}.bind(this));
		mobile.share.bind(
			this.refs.share.getDOMNode()
		);
	},
	goBack: function() {
		history.go(-1);
	},
	render: function() {
		return (
			<div className="product-header">
			  <div id="Back" className="icon" onClick={this.goBack}></div>
			  <div id="Share" className="icon" ref="share"></div>
			  <div className="title">
			    <div className="title2" ref="title">{this.state.title}</div>
			  </div>
			  <div className="clearfix"></div>
			</div>
		);
	}
});

var ProductBriefInfoCard = React.createClass({
	props_list:{
		FreePost: '满88包邮',
		Quality : '质量保证',
		Days7 : '七天无理由退货'
	},
	rolling_item_creator: function(item) {
		return (item.map(function(item,index){
			if(item.type == 'video'){
				return (
				<div className="product-rolling-item" key={index}>
				  <video controls="controls" preload="none" width="750" height="750" id="player" poster={item.cover_url} webkit-playsinline>
				    <source type="video/mp4" src={item.video_url} />
				  </video>
				</div>);
			}
			else if(item.type == 'image'){
				return (
				<div className="product-rolling-item" key={index}>
				  <img src={item.image_url} width="750" height="750" />
				</div>);
			}
		}));
	},
	componentDidUpdate: function() {
		var videoobj;

		mobile.videoplugin(750,function(e){
			videoobj = e;
		});

		$(this.refs.rolling.getDOMNode()).owlCarousel({
		  slideSpeed: 300,
		  paginationSpeed: 400,
		  singleItem: true,
		  afterMove: function() {
		  	if(videoobj) videoobj.pause();	// 切换页面后暂停视频
		  }
		});
	},
	render: function() {
		var props_list = this.props_list;
		return (
			<div className="product-brief-info-card">
			  <div className="product-rolling" ref="rolling">
			  	{this.rolling_item_creator(this.props.item)}
			  </div>
			  <div className="product-info">
			    <div className="product-price">
			      <span className="price">¥ {this.props.brief.price1}</span>
			      <span className="nopromotion-price">¥ {this.props.brief.price2}</span>
			      <span className="otherinfo">{this.props.brief.otherinfo}</span>
			    </div>
			    <div className="clearfix"></div>
			    <div className="product-text">
			      <div className="title">{this.props.brief.title}</div>
			      <div className="desc">{this.props.brief.description}</div>
			      {
			      // <div className="flag">
			      //   <img src={"images/flag_" + this.props.brief.country_code + ".png"} />
			      //   <span>{this.props.brief.country_name}</span>
			      //   <div className="clearfix"></div>
			      // </div>
			      }
			    </div>
			    <div className="product-property">
			      <div className="property">
			        {this.props.brief.props.map(function(item, index){
			        	return(
			        		<span key={index}>
			        			<span id={item} className="icon"></span>
			        			<span className="text">{props_list[item]}</span>
			        		</span>
			        	)
			        })}
			        <div className="clearfix"></div>
			      </div>
			      
			      <div>
			      	<ul>
		      			{this.props.brief.info.map(function(item, index){
				        	return(<li key={index}>· {item}</li>);
			        	})}
			      	</ul>
			      </div>
			    </div>
			  </div>
			</div>
		);
	}
});

var ProductUsingUserRollingItem = React.createClass({
	goToUserPage: function(user_id){
		return function(){
			location.href = './u/'+user_id;
			user_id = null;
		}
	},
	render: function() {
		return (
			<div className="card" key={this.props.key}>
			{
				// <img src={this.props.item.cover_url} style={{width:280,height:280}} className="screenshot" />
			 
			  // <div className="user" onClick={goToUserPage(this.props.item.user_id)}>
			  // 	<img src={this.props.item.face_url} className="avatar65 redborder" />
			  // 	<span className="username">{this.props.item.nick}</span>
			  //   <div className="clearfix"></div>
			  // </div>
			}
			<div className="left">
				<img src={this.props.item.cover_url} />
			</div>

			<div className="right">
				<div className="userinfo">
					<div className="avatar">
						<img src="images/avatar.png" className="avatar65 redborder" />
					</div>
					<div className="info">
						<div className="username">
							{this.props.item.nick}
						</div>
						<div className="joinindays">
							加入小红唇<span>{this.props.item.joinindays}</span>天
						</div>
					</div>
					<div className="clearfix"></div>
				</div>
			  <div className="textwrapper">
			    <div className="desc">{this.props.item.desc}</div>
			  </div>
			</div>

			</div>
		);
	}
});

var ProductUsingUser = React.createClass({
	// componentDidUpdate: function(){
	// 	$(this.refs.rolling.getDOMNode()).owlCarousel({
	// 		pagination:false,
	// 		allowimperfect:true,
	// 		customWidth:632
	// 	});
	// },
	render: function() {
		return (
			<div className="product-using-user">
				<div className="title">看看谁在用</div>
				<div className="rolling" ref="rolling">
					{this.props.item.map(function(item,index){
						return <ProductUsingUserRollingItem item={item} key={index} />
					})}
				</div>
			</div>
		);
	}
});

var ProductCommentCard = React.createClass({
	render: function() {
		return (
			<div className="product-comment-card">
				<div className="userinfo">
					<div className="avatar" onClick={goToUserPage(this.props.user_id)}>
						<img src={this.props.face_url} className="avatar65 redborder" />
					</div>
					<div className="info">
						<div className="username">
							{this.props.nick}
						</div>
						<div className="joinindays">
							加入小红唇<span>{this.props.joinindays}</span>天
						</div>
					</div>
					<div className="clearfix"></div>
				</div>
				<div className="comment">
					{this.props.comment}
				</div>
			</div>
		);
	}
});

var ProductSection = React.createClass({
	render: function() {
		return (
			<div className="product-section">
				<div className="title">{this.props.title}</div>
				<div className="content">{this.props.children}</div>
			</div>
		);
	}
});

var ProductSectionWithoutTitle = React.createClass({
	render: function() {
		return (
			<div className="product-section-without-title">
				<img src="images/video_screenshot.png" />
			</div>
		);
	}
});

var ProductSectionPulldown = React.createClass({
	getInitialState: function() {
		return {
			isPullDown : false
		}
	},
	pullDownClick: function() {
		this.setState({
			isPullDown: !this.state.isPullDown 
		});
		$(this.refs.content.getDOMNode()).slideToggle(200);

	},
	render: function() {
		return (
			<div className="product-section-pulldown">
				<div className="title" onClick={this.pullDownClick}>
					<span>{this.props.title}</span>
					<div className={'icon ib ' + (this.state.isPullDown?'flip':'')} id="PullDown"></div>
				</div>
				<div className="content" ref="content" style={{display:'none'}}>{this.props.children}</div>
			</div>
		);
	}
});

var ProductBottomCommand = React.createClass({
	addToCart: function() {
		alert('TODO: 加入购物车');
	},
	cart: function() {
		alert('TODO: 购物车页面');
	},
	render: function() {
		return (
			<div className="product-bottom-command">
				<div className="addToCart" onClick={this.addToCart}>加入购物车</div>
				<div className="cart" onClick={this.cart}>
					<div className="icon ib" id="Cart">{this.props.cart_num}</div>
				</div>
				<div className="clearfix"></div>
			</div>
		);
	}
});

var productBottomCommandHolder = 
	<div className="product-bottom-command-holder"></div>;



var data = {
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

React.render(<ProductDetail />, document.body);
