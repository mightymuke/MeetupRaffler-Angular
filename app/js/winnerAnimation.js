var displayNoWinnerError = function($rootScope) {
	$rootScope.authNotifier.notify('error', 'Unable to find a winner');
}

var displayWinner = function(member, selectedPrizeText) {
	var $memberListings = $('.member-listing');
	var $parent = $memberListings.parent();
	var memberCount = $memberListings.length;
	var i = 0;

	// Fix their positions
	$memberListings.each(function(index) {
		var $this = $(this);
		var originalLeft = Math.max(0, $this.position().left) + "px";
		var originalTop = Math.max(0, $this.position().top) + "px";
		$this.css("left", originalLeft);
		$this.css("top", originalTop);
		$this.attr("data-original-left", originalLeft);
		$this.attr("data-original-top", originalTop);
		$this.css("z-index", index * -1);
	})
	$memberListings.css("position", "absolute");

	// Do a quick shuffle
	var $firstListing = $($memberListings[0]);
	var thisLeft = Math.max(0, (($parent.outerWidth() - $firstListing.outerWidth()) / 2) + $parent.position().left + $(window).scrollLeft());
	var thisTop = Math.max(0, (($(window).height() - $firstListing.outerHeight()) / 2) + $(window).scrollTop());
	$memberListings.each(function(index) {
		$(this)
			.animate(
			{
				'left' : thisLeft + "px",
				'top' : thisTop + "px"
			},
			{
				duration: 1000,
				easing: 'linear',
				done: function() {
					if (index === 0) {
						chain($memberListings, 0, -100, function() {
							var $winner = $('.member-' + member.member_id)
								.clone()
								.addClass('winner-highlight')
								.css("z-index", 1000)
								.prepend('<div class="winner-congrats">Congratulations!</div>')
								.append('<div class="winner-prize-label" style="display: none; visibility: hidden;">You have won a<div class="winner-prize">' + selectedPrizeText + '</div></div>')
								.appendTo('#member-listings');
							$winner.animate(
									{
										height: "350px",
										width: "350px",
										left: $winner.position().left - 175 + "px",
										top: $winner.position().top - 175 + "px"
									})
									.find('.member-photo').animate(
									{
										width: "100px",
										height: "100px",
										'margin-top': "25px"
									})
									.find('img').animate(
									{
										width: "100px"
									})
									.end()
									.end()
									.find('.winner-prize-label').animate(
									{
										display: 'block',
										visibility: 'visible'
									})
									.end()
									.find('.nametag-photo-name h5').animate(
									{
										"font-size": "28px"
									});
						});
					}
				}
			});
		});
}

var clearWinner = function() {
	$('.winner-highlight').animate(
	{
		opacity: 0
	},
	{
		duration: 500,
		easing: 'linear',
		done: function() {
			$('.winner-highlight').remove();
		}
	});

	var $memberListings = $('.member-listing');
	$memberListings.each(function(index) {
		var $this = $(this);
		var thisLeft = $this.attr("data-original-left");
		var thisTop = $this.attr("data-original-top");
		$this
			.animate(
			{
				'left' : thisLeft,
				'top' : thisTop
			},
			{
				duration: 500,
				easing: 'linear'
			})
		});
	$memberListings.css("z-index", 1);
}

var chain = function(toAnimate, ix, zindex, animationComplete) {
	zindex--;
	if(toAnimate[ix]){
		var moveLeft = 120;
		var moveTop = Math.floor(Math.random() * (120 + 50) - 50); //50
		var thisLeft = $(toAnimate[ix]).position().left;
		var thisTop = $(toAnimate[ix]).position().top;
		// $(toAnimate[ix])
		// 	.animate(
		// 		{
		// 			left: thisLeft - moveLeft + "px",
		// 			top: thisTop + moveTop + "px"
		// 		},
		// 		{
		// 			duration: 30,
		// 			easing: 'linear',
		// 			done: function() {
		// 				$(toAnimate[ix]).css('z-index', zindex);
		// 			}
		// 		})
		// 	.animate(
		// 		{
		// 			left: thisLeft + "px",
		// 			top: thisTop + "px"
		// 		},
		// 		{
		// 			duration: 30,
		// 			easing: 'linear',
		// 			done: function() {
		// 				chain(toAnimate, ix + 1, zindex);
		// 			}
		// 		});
		$(toAnimate[ix])
			.animate(
				{
					'z-index': zindex,
				},
				{
					duration: 10,
					easing: 'linear',
					done: function() {
						chain(toAnimate, ix + 1, zindex, animationComplete);
					}
				});
	} else if (typeof(animationComplete) == "function") {
		animationComplete();
	}
};
