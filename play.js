var ground = [],
	nbTiles = 100,
	tileWidth = 20,
	shift = 0,
	noVary = false,
	darkColor = false,

	playerDblJump = false,
	playerAcceleration = 0,
	playerBottom = 100,
	playerOnFloor = true,

	gameOver = true,

	score = 0,
	topScore = 0,

	loop = function () {
		var swap = false;
		if (shift == tileWidth) {
			shift = 0;
			swap = true;
		}
		// adjust ground
		ground.forEach(function (item, index) {
			var tile = item.tile;
			tile.style.left = index * tileWidth - shift;
			if (swap) {
				if (index < nbTiles - 1) {
					item.height = ground[index + 1].height;
				} else {
					if (!noVary) {
						noVary = false;
					} else {
						noVary--;
					}
					var withVariation = !noVary && Math.random() < 0.1,
						variation = withVariation ? 200 : 4,
						diff = -variation / 2 + Math.random() * variation;
					// make sure gap is a real gap
					if (withVariation) {
						if (diff > 0) {
							diff += 20;
						} else {
							diff -= 20;
						}
						// no variation for 10 cycles
						noVary = 10;
					}
					item.height = Math.max(Math.min(item.height + diff, 300), 50);
				}
				tile.style.height = item.height + "px";
			}
		});
		shift = shift + 10;

		// adjust player on 5th tile
		var playerTile = ground[5],
			target = playerTile.height,
			diff = playerBottom - target,
			dino = document.getElementById("dino")
		absoluteDiff = diff < 0 ? -diff : diff;
		if (absoluteDiff < 5) {
			playerBottom = target;
			playerAcceleration = 0;
			playerOnFloor = true;
			playerDblJump = false;
		} else if (diff > 0) {
			playerAcceleration++;
			playerBottom = playerBottom - playerAcceleration;
			if (playerBottom < target) {
				playerBottom = target;
				playerOnFloor = true;
				playerDblJump = false;
			}
		} else {
			// GAME OVER
			gameOver = true;
			if (score > topScore) {
				topScore = score;
				document.getElementById("topscore").innerHTML = "Top score: " + topScore;
			}
			dino.style.transform = "scale(1)";
			document.getElementById("gameover").style.display = "block";
			return;
		}
		var scale = playerOnFloor ? 1 : 1 + 1 / (Math.abs(playerAcceleration / 20) + 1);
		dino.style.bottom = playerBottom + "px";
		dino.style.transform = "scale(" + scale + ")";

		// adjust score
		score++;
		document.getElementById("score").innerHTML = "score: " + score;

		requestAnimationFrame(loop);
	},
	init = function () {
		var player = document.getElementById("player");
		document.getElementById("gameover").style.display = "none";
		document.getElementById("splash").style.display = "none";
		document.getElementById("dino").style.display = "block";
		// init ground
		player.innerHTML = "";
		ground.splice(0, ground.length);
		for (var i = 0; i < nbTiles; i++) {
			var tile = document.createElement("div");
			ground.push({
				height: 100,
				tile: tile
			});
			tile.classList.add("ground");
			player.appendChild(tile);
		}
		// init player
		playerDblJump = false;
		playerAcceleration = 0;
		playerBottom = 100;
		playerOnFloor = true;
		score = 0;
	};

// event listener
document.addEventListener("keydown", function () {
	if (gameOver) {
		init();
		requestAnimationFrame(loop);
		gameOver = false;
		return;
	}
	if (!playerOnFloor && playerDblJump || gameOver) {
		return;
	}
	if (playerOnFloor) {
		playerOnFloor = false;
		playerAcceleration = -20;
		playerBottom += 10;
	} else {
		playerDblJump = true;
		playerAcceleration = -15;
		darkColor = !darkColor;
	}
	// generate a random color
	var color = Math.floor(Math.random() * 360),
		light = darkColor ? "80%" : "7%";
	document.getElementById("player").style.backgroundColor = "hsl(" + color + ", 100%, " + light + ")";
});
