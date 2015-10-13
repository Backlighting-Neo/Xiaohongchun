var Downloader = React.createClass({
	componentDidMount: function() {
		this.refs.download.getDOMNode.bind('click', function(event) {
			alert('123');
		});
	},
	render: function() {
		return (
			<div className="Downloader">
				<div>
				  <div className="top">
				    <div className="title">
				      <p className="t1">小红唇</p>
				      <p className="t2">你的变美频道</p>
				    </div>
				    <div className="download" ref="download">
				      <div>立即下载</div>
				    </div>
				  </div>
				  <div className="clearfix"></div>
				  <div className="footerdownload" ref="footerdownload">
				    <div>下载小红唇</div>
				  </div>
				</div>;
			</div>
		);
	}
});


var downloaderHolder = 
	<div className="footerholder">
	</div>;

var ChannelDetail = React.createClass({
	render: function() {
		return (
			<div className="ChannelDetail"></div>
		);
	}
});

var VideoList = React.createClass({
	render: function() {
		return (
			<div className="VideoList"></div>
		);
	}
});

var HotChannel = React.createClass({
	render: function() {
		return (
			<div className="HotChannel"></div>
		);
	}
});

var ChannelShare = React.createClass({
	render: function() {
		return (
			<div className="content">
				<Downloader />
				<ChannelDetail />
				<VideoList />
				<HotChannel />
				{downloaderHolder}
			</div>
		);
	}
});	

React.render(<ChannelShare />,document.body);
