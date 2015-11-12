var ProductDetail = React.createClass({
	getInitialState: function() {
    return {
			"brief": {},
			"rolling": [],
			"usingusers": [],
			"big_img": "",
			"text": []
		}
	},
	componentDidMount: function() {
		var baseurl = 'http://192.168.2.200:1338'
		var that = this;
		$.getJSON(baseurl + '/api2/store/product_detail')
		.then(function(json){
			that.setState(json.data);
		}).fail(function() {
			alert('数据异常');
		})
	},
	render: function() {
		return (
			<div className="ProductDetail">
				<ProductHeader
				  uptitle={this.props.pagetitle}
				  downtitle={this.state.brief.product_name}
				/>
				<ProductBriefInfoCard 
					item={this.state.rolling}
					brief={this.state.brief}
				/>
				<ProductUsingUser
				  item={this.state.usingusers}
				/>
				<ProductSectionWithoutTitle>
				  <img src={this.state.big_img} />
				</ProductSectionWithoutTitle>
				{
					this.state.text.map(function(item, index) {
						return(
						<ProductSection key={index} title={item.title}>{item.content}</ProductSection>)
					})
				}
				<ProductSectionPulldown title="种草设补充说明">
				  Q：小红唇商城的商品是正品吗？
				  <br />
				  A：小红唇商城和秒杀中的商品都是从海外直采或者与国内正规进口品牌商合作，敬请放心。
				  <br /><br />
				  Q：为什么我买的东西降价/涨价了？
				  <br />
				  A：海外商品不同时期的价格本身会进行调整，所以小红唇商城的价格也会作出相应改变。
				  <br /><br />
				  Q：想买的商品已抢光还会再上架吗？
				  <br />
				  A：小红唇商城的商品均以限时限量折扣的形式进行出售，大部分售完的商品会在再次海外直采后根据主题场次排期 对于热销商品商城会适时安排重出江湖。 
				  <br /><br />
				  Q：如何查看已买到商品的信息和使用方法？
				  <br />
				  A：只要进入商品所在的订单中点击要查询的商品，就可以在商品详情页查看该商品信息和使用方法。
				  <br /><br />
				  Q：从商城购买的商品有多新鲜？
				  <br />
				  A：商城有经验丰富的买手， 确保为小主们选购的商品都是当年最新批次。
				  <br /><br />
				  Q：为什么收到的商品和订购时的图片不一样？
				  <br />
				  A：由于部分商品包装更换较为频繁，所以您收到的货品可能和订购时图片不符，请您不用担心。
				  <br /><br />
				</ProductSectionPulldown>
				<ProductSectionPulldown title="消费者告知书">
				  尊敬的客户：<br /><br />
					在您选购境外商品前，麻烦仔细阅读此文，同意本文所告知内容后再进行下单购买：<br /><br />
					1. 您在本（公司）App里购买的境外商品为产地直销商品，仅限个人自用不得进行再销售，商品本身可能无中文标签，您可以查看商品详情页里的使用指南或者联系小红唇客服。<br /><br />
					2. 您购买的境外商品适用的品质、健康、标识等项目的使用标准符合原产国使用标准，但是可能与我国标准有所不同，所以在使用过程中由此可能产生的危害或损失以及其他风险，将由您个人承担。<br /><br />
					3. 您在本（公司）App里购买保税区发货的境外商品时，自动视为由小红唇代您向海关进行申报和代缴税款。<br /><br />
				</ProductSectionPulldown>
				<ProductBottomCommand cart_num={this.state.cart_num} status={this.state.product_status} />
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
				  <video className="RollingVideo" controls="controls" preload="none" width="750" height="750" id="player" poster={item.cover_url} webkit-playsinline>
				    <source type="video/mp4" src={item.video_url} />
				  </video>
				</div>);
			}
			else if(item.type == 'image'){
				return (
				<div className="product-rolling-item" key={index}>
				  <img src={item.cover_url} width="750" height="750" />
				</div>);
			}
		}));
	},
	componentDidUpdate: function() {
		var videoobj;

		mobile.videoplugin(750,".RollingVideo",function(e){
			videoobj = e;
		});

		$(this.refs.rolling.getDOMNode()).owlCarousel({
		  slideSpeed: 300,
		  paginationSpeed: 400,
		  singleItem: true,
		  afterMove: function() {
		  	if(videoobj)
			  	videoobj.forEach(function(item, index){
			  		item.pause();
			  	});
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
			      <span className="price">¥ {this.props.brief.price}</span>
			      <span className="nopromotion-price">¥ {this.props.brief.ex_price}</span>
			      <span className="otherinfo">{this.props.brief.note}</span>
			    </div>
			    <div className="clearfix"></div>
			    <div className="product-text">
			      <div className="title">{this.props.brief.product_name}</div>
			      <div className="desc">{this.props.brief.desc}</div>
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
			        {this.props.brief.features_1?this.props.brief.features_1.map(function(item, index){
			        	return(
			        		<span key={index}>
			        			<span id={item} className="icon"></span>
			        			<span className="text">{props_list[item]}</span>
			        		</span>
			        	)
			        }):''}
			        <div className="clearfix"></div>
			      </div>
			      
			      <div>
			      	<ul>
		      			{this.props.brief.features_2?this.props.brief.features_2.map(function(item, index){
				        	return(<li key={index}>· {item}</li>);
			        	}):''}
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
		return function() {
			location.href = './u/'+user_id;
			user_id = null;
		}
	},
	render: function() {
		return (
			<div className="card">
			<div className="left">
				<img src={this.props.item.cover_url} onClick={this.props.changeHandler(this.props.item.video_url, this.props.item.cover_url)} />
			</div>

			<div className="right">
				<div className="userinfo">
					<div className="avatar">
						<img src={this.props.item.face_img} className="avatar65 redborder" onClick={goToUserPage(this.props.item.user_id)}/>
					</div>
					<div className="info">
						<div className="username">
							{this.props.item.username}
						</div>
						<div className="joinindays">
							加入小红唇<span> {this.props.item.joindays} </span>天
						</div>
					</div>
					<div className="clearfix"></div>
				</div>
			  <div className="textwrapper">
			    <div className="desc">{this.props.item.comment}</div>
			  </div>
			</div>

			</div>
		);
	}
});

var ProductUsingUser = React.createClass({
	getInitialState: function() {
		return({
			mask_style_display: 'none',
			mask_style_background: 'rgba(0,0,0,0)',
			mask_style_opacity: '0',
			mask_style_transition1: 'background 0.8s',
			mask_style_transition2: 'opacity 0.8s ease 0.2s',
			video_url: "",
			cover_url: ""
		})
	},
	componentWillReceiveProps: function(nextProps) {
	  this.setState({
	    video_url: nextProps.item[0].video_url,
	    cover_url: nextProps.item[0].cover_url
	  });
	},
	componentDidUpdate: function(){
		// var that = this;
		// mobile.videoplugin(700,$(this.refs.inlinevideo.getDOMNode()),function(e){
		// 	that.videoobj = e[0];
		// });
	},
	render: function() {
		var that = this;
		var changeVideo = function(video_url, cover_url) {
			return function(){
				if(video_url != that.state.video_url)
					that.refs.inlinevideo.getDOMNode().load();
				that.setState({
					mask_style_display: '',
					mask_style_transition1: 'background 0.8s',
					mask_style_transition2: 'opacity 0.8s ease 0.2s',
				  video_url: video_url,
				  cover_url: cover_url
				});
				setTimeout(function(){
					that.setState({
						mask_style_background: 'rgba(0,0,0,0.8)',
						mask_style_opacity: '1'
					});
					that.refs.inlinevideo.getDOMNode().play();
				},0);
			}
		};
		var closeMask = function() {
			that.setState({
			  mask_style_background: 'rgba(0,0,0,0)',
			  mask_style_transition1: 'background 0.8s ease 0.2s',
				mask_style_transition2: 'opacity 0.8s',
				mask_style_opacity: '0'
			});
			that.refs.inlinevideo.getDOMNode().pause();
			setTimeout(function(){
				that.setState({
					mask_style_display: 'none',
				});
			},800);
		};
		return (
			<div className="product-using-user">
				<div className="title">看看谁在用</div>
				<div className="rolling" ref="rolling">
					{this.props.item?this.props.item.map(function(item,index){
						return <ProductUsingUserRollingItem item={item} changeHandler={changeVideo} key={index} />
					}):''}
				</div>
				<div className="MaskPlayer" ref="MaskPlayer" style={{display:this.state.mask_style_display,background:this.state.mask_style_background,transition:this.state.mask_style_transition1}} onClick={closeMask}>
					<div className="MaskPlayerInner" ref="MaskPlayerInner" style={{opacity: this.state.mask_style_opacity,transition:this.state.mask_style_transition2}}>
						<video preload="none" ref="inlinevideo" controls="controls" width="700" height="700" id="inline-video" poster={this.state.cover_url}>
						  <source type="video/mp4" src={this.state.video_url} />
						</video>
					</div>
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
				{this.props.children}
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
	componentDidMount: function() {
		// this.refs.test.getDOMNode().onclick = this.pullDownClick;
	},
	pullDownClick: function() {
		this.setState({
			isPullDown: !this.state.isPullDown 
		});
		if(this.state.isPullDown){
			this.refs.content.getDOMNode().setAttribute('style','display:none');
		}
		else {
			this.refs.content.getDOMNode().setAttribute('style','');
		}
	},
	render: function() {
		return (
			<div className="product-section-pulldown">
				<div className="title click" ref="test" onClick={this.pullDownClick} >
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
				<div className="goToPay">
					<div className="PayPanel">
						<div className="title">成功加入购物车</div>
						<div className="btn click">去支付</div>
					</div>
				</div>
				<div className="addToCart click" onClick={this.addToCart}>加入购物车</div>
				<div className={'cart'+this.props.status+' click'} onClick={this.cart}>
					<div className="Cart" id="Cart">{this.props.cart_num}</div>
				</div>
				<div className="clearfix"></div>
			</div>
		);
	}
});

var productBottomCommandHolder = 
	<div className="product-bottom-command-holder"></div>;


React.render(<ProductDetail pagetitle="小红唇种草机" />, document.body);
