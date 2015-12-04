var ProductDetail = React.createClass({
	getInitialState: function() {
    return {
			"brief": {},
			"rolling": [],
			"usingusers": [],
			"big_img": "",
			"text": [],
			"text_card": [],
			"isdisplay": 'none'
		}
	},
	dataconverse: function(detail, setting, video) {
		var json = {};
		var timestamp = Math.round(new Date().getTime()/1000);
		json.text_card = [];
		if(setting.remark){
			json.text_card.push({
				title: '商城补充说明',
				content: setting.remark.replace(/\\n/g,'<br>')
			});
		}
		if(setting.instructionm){
			json.text_card.push({
				title: '消费者告知书',
				content: setting.instructionm.replace(/\\n/g,'<br>')
			});
		}
		json.usingusers = [];
		video.forEach(function(item) {
			json.usingusers.push({
				vid: item.id,
				cover_url: item.cover_url,
				video_url: '',
				face_img: item.icon_url,
				user_id: 0,
				username: item.nick,
				joindays: (function(){
					var days = 0;
					days = (timestamp - item.date_add) / 24 / 3600;
					days = Math.round(days);
					return days;
				})(),
				comment: item.vdesc
			})
		})
		json.text = [];
		if(detail.g_desc.usermenual){
			json.text.push({
				title: '使用指南',
				content: detail.g_desc.usermenual,
			});
		};
		if(detail.g_desc.tips){
			json.text.push({
				title: '小贴士',
				content: detail.g_desc.tips
			});
		};
		json.brief = {
			product_name: "【"+detail.g_title + "】" + detail.g_name,
			price: detail.g_price_shop,
			ex_price: detail.g_price_market,
			note: '',
			desc: detail.g_desc.content,
			features_1: setting.tags,
			features_2: setting.txts
		};
		json.rolling = [];
		json.big_img = '';
		detail.g_gallery.forEach(function(item) {
			switch(item.gg_type){
				case 2:
					json.rolling.push({
						type: 'image',
						cover_url: item.gg_image
					})
					break;
				case 4:
					json.rolling.push({
						type: 'video',
						cover_url: item.gg_image,
						video_url: item.gg_video
					});
					break;
				case 3:
					json.big_img = item.gg_image;
			}
		})
		
		mobile.weChat.bindWeChatShare({
			title: detail.g_name,
			desc: detail.g_desc.content,
			link: location.href,
			imgUrl: detail.g_image,
			type: 'link'
		});

		return json;
	},
	componentDidMount: function() {
		var pid = mobile.query('pid');
		if (!$.isNumeric(pid)) {
			location.href = 'list.html';
			return;
		}
		var that = this;

		var ajax = {};
		ajax.detail = $.getJSON(baseurl + '/goods/' + pid);
		ajax.setting = $.getJSON(baseurl + '/setting/goods');
		ajax.video = $.getJSON(baseurl + '/goods/' + pid + '/videos');
		$.when(ajax.detail, ajax.setting, ajax.video).done(function(detail, setting, video) {
			if(detail[0].code == 5001){
				location.href = 'list.html';
				return;
			}
			else{
				that.setState(that.dataconverse(detail[0].data, setting[0].data, video[0].data));
				document.title = detail[0].data.g_title + " - " + detail[0].data.g_name;
				$('.loading').remove();
				that.setState({
					isdisplay: '' 
				});
			}
		});

		mobile.binddownload(['download','footerdownloader']);
	},
	render: function() {
		return (
			<div ref="content" className="ProductDetail" style={{display:this.state.isdisplay}}>
				<ProductHeader
				  uptitle={this.props.pagetitle}
				  downtitle={this.state.brief.product_name}
				/>
				<div className="topHolder2"></div>
				<div className="top"><div className="title"><p className="t1">小红唇</p><p className="t2">你的变美频道</p></div><div className="download" id="download"><div>立即下载</div></div></div>
				<ProductBriefInfoCard 
					item={this.state.rolling}
					brief={this.state.brief}
				/>
				{
					this.state.usingusers.length>0?<ProductUsingUser item={this.state.usingusers}/>:''
				}
				{
					this.state.big_img?(<ProductSectionWithoutTitle><img src={this.state.big_img} /></ProductSectionWithoutTitle>):undefined
						
				}
				{
					this.state.text.map(function(item, index) {
						return(
						<ProductSection key={index} title={item.title}>{item.content}</ProductSection>)
					})
				}
				{
					this.state.text_card.map(function(item, index){
						return(<ProductSectionPulldown key={index} title={item.title} content={item.content}></ProductSectionPulldown>)
					})
				}
				
				{
				// <ProductBottomCommand cart_num={this.state.cart_num} status={this.state.product_status} />
				// {productBottomCommandHolder}
				}

				{productDownloadApp}
			</div>
		);
	}
});

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
				this.refs.title.getDOMNode().style['padding-left'] = 0;
				this.refs.title.getDOMNode().style['background-image'] = 'none';
			}
			else{
				this.setState({
					title:this.props.uptitle 
				});
				this.refs.title.getDOMNode().style['padding-left'] = '';
				this.refs.title.getDOMNode().style['background-image'] = '';
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
				<div className="BigBack" onClick={this.goBack}>
					<div id="Back" className="icon"></div>
				</div>
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
			        			<span><img className="features_icon" src={item.icon} /></span>
			        			<span className="text">{item.text}</span>
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
			location.href = 'http://www.xiaohongchun.com/u/'+user_id;
			user_id = null;
		}
	},
	goToVideoPage: function(video_id) {
		return function() {
			location.href = '../video/video.html?vid='+video_id;
			video_id = null;
		}
	},
	render: function() {
		return (
			<div className="card">
			<div className="left">
				{
				  // TODO 页内播放视频预留
				  //<img src={this.props.item.cover_url} onClick={this.props.changeHandler(this.props.item.video_url, this.props.item.cover_url)} />
				}
				<img src={this.props.item.cover_url} onClick={this.goToVideoPage(this.props.item.vid)} />
			</div>

			<div className="right">
				<div className="userinfo">
					<div className="avatar">
						{
						//<img src={this.props.item.face_img} className="avatar65 redborder" onClick={goToUserPage(this.props.item.user_id)}/>
						}
						<img src={this.props.item.face_img} className="avatar65 redborder"/>
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
				<div className="content" ref="content" style={{display:'none'}} dangerouslySetInnerHTML={{__html:this.props.content}}></div>
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

var productDownloadApp = 
	<div className="product-download-app" id="footerdownloader">下载小红唇APP</div>


React.render(<ProductDetail pagetitle="小红唇商城" />, document.body);
