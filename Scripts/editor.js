function runEditor() {
	const buttons = [];

	const editorButtons = Array.from(document.querySelectorAll(".editor-button"));
	editorButtons.forEach((button) => {
		button.style.display = "inline";
	});
	const setColorsButton = document.querySelector("#customise-color-button");
	const useSavedColorButton = document.querySelector("#use-save-color-button");
	const saveColorsButton = createButton("Save colors");

	buttons.push(setColorsButton, saveColorsButton, useSavedColorButton);

	const spacing = 30;
	for (let i = 0, x = width / 2; i < buttons.length; i++) {
		buttons[i].position(x + i * spacing, height);
		x += buttons[i].size().width;
	}

	saveColorsButton.hide();

	setColorsButton.mousePressed(() => {
		buttonPos = setColorsButton.position();
		setColorsButton.hide();
		saveColorsButton.show();
		const colorsData = config.assets.getChildAssetByType("Color").data;
		const colorEditors = showColors(colorsData, buttonPos, undefined, undefined, { x: 0, y: 20 });
		createCloseButton(
			{
				x: buttonPos.x,
				y: buttonPos.y,
			},
			() => {
				colorEditors.colorPickers.forEach((element) => element.colorPicker.remove());
				colorEditors.colorLabels.forEach((element) => element.remove());
				setColorsButton.show();
				saveColorsButton.hide();
			}
		);

		saveColorsButton.mousePressed(() => {
			const data = {};

			colorEditors.colorPickers.forEach((element) => {
				data[element.key] = element.colorPicker.color();
			});

			createStringDict(data).saveJSON("m_Colors");
		});
	});

	useSavedColorButton.mousePressed(() => {
		const fileInput = createFileInput((file) => {
			if (file.type !== "application") {
				console.log("File type is invalid !!!");
				return;
			}
			const colorAsset = config.assets.getChildAssetByType("Color").data;
			loadJSON(file.data, (data) => {
				for (const key in data) {
					colorAsset[key].levels = data[key].levels;
				}
			});
		});

		fileInput.position(useSavedColorButton.position().x, useSavedColorButton.position().y);
		useSavedColorButton.hide();
		createCloseButton(
			{
				x: fileInput.position().x,
				y: fileInput.position().y + fileInput.size().height,
			},
			() => {
				fileInput.remove();
				useSavedColorButton.show();
			}
		);
	});
}

function showColors(colorData, labelPosition, widthSpacing = 100, lineSpacing = 5, initialOffset = { x: 0, y: 0 }) {
	const colorPickers = [];
	const colorLabels = [];

	let row = 0;
	for (const key in colorData) {
		const colorValues = colorData[key].levels;
		const colorPicker = createColorPicker(color(colorValues[0], colorValues[1], colorValues[2]));
		const colorLabel = createP(key);
		colorLabel.style("color", color(255));
		colorLabel.position(initialOffset?.x + labelPosition.x, initialOffset?.y + labelPosition.y + (lineSpacing + colorPicker.size().height) * row);
		colorPicker.position(colorLabel.position().x + widthSpacing, colorLabel.position().y);
		colorLabels.push(colorLabel);
		colorPickers.push({ key, colorPicker });
		row++;
	}
	return { colorPickers, colorLabels };
}

function createCloseButton(position, onExit) {
	const closeButton = createButton("Close").position(position.x, position.y);
	closeButton.mousePressed(() => {
		closeButton.remove();
		onExit();
	});
}
