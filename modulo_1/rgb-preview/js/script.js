const previewElement = document.querySelector('#preview');

const rangeInputs = Array.from(document.body.querySelectorAll('input[type="range"]'));

const changePreviewBackgroundColor = () => {
	const rbgColor = `rgb(${rangeInputs.map((el) => el.value).join(',')})`;
	previewElement.style.backgroundColor = rbgColor;
};

const initRangeInputs = () => {
	rangeInputs.forEach((el) => {
		const input = document.querySelector(`#${el.id}-value`);
		el.value = 0;
		input.value = el.value;
		el.addEventListener('input', (event) => {
			input.value = event.target.value;
			changePreviewBackgroundColor();
		});
	});
};

const init = () => {
	initRangeInputs();
	changePreviewBackgroundColor();
};

window.addEventListener('load', init);
