class classifier {
	constructor(name, model_URL, onModelReady, onGotResults) {
		this.Name = name;
		this.Value = ml5.imageClassifier(model_URL + "model.json");
		this.Value.ready
			.then(() => {
				// console.log(this.Name + " model is ready !!!");
				this.IsReady = true;
				onModelReady();
			})
			.catch((err) => console.log(err));
		this.onGotResults = onGotResults;
	}

	async classify(info) {
		if (!info) {
			console.warn("There is no image to classify!");
			return;
		}
		if (!(info.gameSystem.gameState instanceof PlayState)) {
			console.log("Classifier only classfy images during play state !");
			return;
		}
		const results = await this.Value.classify(info.image).catch((err) => console.log(err));
		this.onGotResults({
			gameSystem: info.gameSystem,
			image: info.image,
			results,
		});
	}
}
