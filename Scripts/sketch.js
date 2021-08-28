let game;
let config;
let debug = false;

function preload() {
	document.addEventListener("OnAllAssetsReady", () => {
		game.gameState.gameStatus = "Ready to start game !!!";
		game.gameState.instructionText = "Ready? Open your hand palm \n to start the game !!!";
		game.ready = true;
		game.assets = config.getResourceAssets();
		runEditor();
	});

	config = new configuration();

	//Imaged
	config.loadAssets(
		"Image",
		{ Up: "./Images/Up.jpeg", Down: "./Images/Down.jpeg", Open: "./Images/Open.jpg", Left: "./Images/Left.jpeg", Right: "./Images/Right.jpeg" },
		(source) => {
			let images = {};
			for (const key in source) {
				const image = loadImage(source[key], () => config.onAssetReady());
				images[key] = image;
			}
			return images;
		}
	);

	//Models
	config.loadAssets(
		"Model",
		{
			Direction: {
				source: "https://teachablemachine.withgoogle.com/models/nNtbYUnn-/",
				instanceName: "imageClassifier",
				load: async function () {
					return await ml5.imageClassifier(this.source + "model.json");
				},
			}, //"https://teachablemachine.withgoogle.com/models/7WRHgCGqz/",
			Vertical: {
				source: "https://teachablemachine.withgoogle.com/models/gvwdkEKSF/",
				instanceName: "imageClassifier",
				load: async function () {
					return await ml5.imageClassifier(this.source + "model.json");
				},
			},
			Horizontal: {
				source: "https://teachablemachine.withgoogle.com/models/9r5lWuqRi/",
				instanceName: "imageClassifier",
				load: async function () {
					return await ml5.imageClassifier(this.source + "model.json");
				},
			},
		},
		(source) => {
			let models = {};
			for (const key in source) {
				const $classifier = eval(`new ${source[key].instanceName}(key)`);
				source[key]
					.load()
					.then((loadedModel) => {
						$classifier.model = loadedModel;
						config.onAssetReady();
					})
					.catch((err) => console.log(err));
				models[key] = $classifier;
			}
			return models;
		}
	);

	//Setup webcam video
	config.loadAssets("Video", { video: VIDEO }, (source) => {
		const video = createCapture(source.video, () => {
			config.onAssetReady();
		}).hide();
		video.size(240, 180);
		return video;
	});

	config.loadAssets("Difficulty", {
		difficultyOffset: 2,
		difficultySpeed: 1,
		difficultyAcceleration: 0.5,
	});

	//Colors
	config.loadAssets(
		"Color",
		{
			background: color("#FFB740"),
			maze: color("#DF711B"),
			mazeWall: color(255, 213, 126),
			player: color("#64C9CF"),
			target: color(255),
			text: color(200),
			button: color(100),
		},
		(source) => {
			for (let i = 0; i < Object.keys(source).length; i++) {
				config.onAssetReady();
			}
			return source;
		}
	);
}

function setup() {
	createCanvas(900, 700);
	const maze = new Maze(50, 580, 460);
	game = new gameSystem(maze, new Player());
}

function draw() {
	background(config.assets.getChildAssetByType("Color").data.background);
	game.update();
}
