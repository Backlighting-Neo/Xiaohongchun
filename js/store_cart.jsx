var CartItem = React.createClass({
	render: function() {
		return (
			<div className="item">
				<div className={'isselect '+icon_selected}>
				</div>
				<div className="image">
					<img src="images/video_screenshot.png" width="100%" height="100%" />
					<div class="note"><span>换购</span></div>
				</div>
				<div className="info">
					<div className="pro_title">{this.props.item.pro_title}</div>
					<div className="bin icon_bin"></div>
					<div className="clearfix"></div>
					<div class="limit">限购1件</div>
					<div className="num">
						<div className="minus">-</div>
						<div className="plus">+</div>
						<div className="now">{this.props.item.pro_title}</div>
					</div>
					<div className="price">
						<span className="p1">{this.props.item}</span>
						<span className="p2">000</span>
					</div>
				</div>
				<div className="clearfix"></div>
			</div>
		);
	}
});

var CartList = React.createClass({
	render: function() {
		return (
			<div className="store-cart-list">
				<div className="title">
					<div className="icon">
						<img src="images/logo.png" width="40px" height="40px" />
					</div>
					<div className="text">首单包邮</div>
					<div className="clearfix"></div>
				</div>
				<CartItem/>
			</div>
		);
	}
});