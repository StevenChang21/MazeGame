class imageClassifier extends classifier {
	constructor(name, model) {
		super(name, model);
	}

	async classify(data) {
		super.classify(data);
		const prediction = await this._model.classify(data).catch((err) => console.log(err));
		return {
			label: prediction[0].label,
			probability: prediction[0].confidence,
		};
	}
}