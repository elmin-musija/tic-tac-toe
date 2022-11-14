const inputButton = document.getElementsByTagName(`button`);
const resetButton = document.querySelector(`.restart`);
const outputPlayer = document.querySelectorAll(`[class*="player"]`);
const numFields = 3;
let counterCheckedFields = 0;

const playerObj = [
	{
		active: true,
		name: `Player 1`,
		symbol: `O`,
	},
	{
		active: false,
		name: `Player 2`,
		symbol: `X`,
	},
];

const selectedFields = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0],
];

const inputButtonArray = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0],
];

const checkRow = (paramArray, paramCol) => {
	let tmpCounter = 0;
	for (let i = 0; i < numFields; i++) {
		paramArray[paramCol][i] === getActivePlayerSymbol() ? tmpCounter++ : false;
	}
	if (tmpCounter === numFields) {
		inputButtonArray[paramCol].forEach((element) => {
			element.classList.add(`won`);
		});
		return true;
	} else {
		return false;
	}
};

const checkRows = (paramArray) => {
	let tmpCounter = 0;
	for (let i = 0; i < numFields; i++) {
		checkRow(paramArray, i) ? tmpCounter++ : false;
	}
	return tmpCounter > 0 ? true : false;
};

const checkColumn = (paramArray, paramRow) => {
	let tmpCounter = 0;
	for (let i = 0; i < numFields; i++) {
		paramArray[i][paramRow] === getActivePlayerSymbol() ? tmpCounter++ : false;
	}
	if (tmpCounter === numFields) {
		for (let i = 0; i < numFields; i++) {
			inputButtonArray[i][paramRow].classList.add(`won`);
		}
		return true;
	} else {
		return false;
	}
};

const checkColumns = (paramArray) => {
	let tmpCounter = 0;
	for (let i = 0; i < numFields; i++) {
		checkColumn(paramArray, i) ? tmpCounter++ : false;
	}
	return tmpCounter > 0 ? true : false;
};

const checkDiagonalLTR = (paramArray) => {
	let tmpCounter = 0;
	for (let i = 0; i < numFields; i++) {
		paramArray[i][i] === getActivePlayerSymbol() ? tmpCounter++ : false;
	}
	if (tmpCounter === numFields) {
		for (let i = 0; i < numFields; i++) {
			inputButtonArray[i][i].classList.add(`won`);
		}
		return true;
	} else {
		return false;
	}
};

const checkDiagonalRTL = (paramArray) => {
	let tmpCounter = 0;
	for (let i = numFields - 1; i >= 0; i--) {
		paramArray[numFields - 1 - i][i] === getActivePlayerSymbol()
			? tmpCounter++
			: false;
	}
	if (tmpCounter == numFields) {
		for (let i = 0; i < numFields; i++) {
			inputButtonArray[numFields - 1 - i][i].classList.add(`won`);
		}
		return true;
	} else {
		return false;
	}
};

const getCountFieldsChecked = () => {};

const checkForWinner = (paramArray) => {
	const tmp = getCountFieldsChecked();
	if (
		checkRows(paramArray) ||
		checkColumns(paramArray) ||
		checkDiagonalRTL(paramArray) ||
		checkDiagonalLTR(paramArray)
	) {
		return true;
	}
};

const checkFieldIsChecked = (paramCol, paramRow) => {
	return selectedFields[Number(paramCol)][Number(paramRow)] === 0
		? false
		: true;
};

const setFieldIsChecked = (paramArray, paramCol, paramRow) => {
	paramArray[Number(paramCol)][Number(paramRow)] = getActivePlayerSymbol();
};

const displayActivePlayer = () => {
	outputPlayer[getActivePlayerIndex()].classList.add(`active`);
	outputPlayer[getInactivePlayerIndex()].classList.remove(`active`);
};

const resetDisplayAllPlayers = () => {
	outputPlayer.forEach((element) =>
		element.classList.remove(`active`, `won`, `lost`)
	);
};

const getActivePlayerName = () => {
	const [{ name, ...rest }] = playerObj.filter(
		(element) => element.active === true
	);
	return name;
};

const getActivePlayerSymbol = () => {
	const [{ symbol, ...rest }] = playerObj.filter(
		(element) => element.active === true
	);
	return symbol;
};

const getActivePlayerIndex = () => {
	const tmp = playerObj.findIndex((element) => element.active === true);
	return tmp;
};

const getInactivePlayerIndex = () => {
	return playerObj.findIndex((element) => element.active === false);
};

const switchActivePlayer = () => {
	playerObj.forEach((element) => {
		element.active ? (element.active = false) : (element.active = true);
	});
};

const setFieldMarker = (event) =>
	(event.target.innerHTML = `${getActivePlayerSymbol()}`);

const blockUserInput = () => {
	inputButtonArray.forEach((element) => {
		element.forEach((element) => {
			element.removeEventListener(`click`, game);
		});
	});
};

const addEventListenerButton = () => {
	let countEventListener = 0;
	for (let i = 0; i < numFields; i++) {
		for (let j = 0; j < numFields; j++) {
			inputButtonArray[i][j] = inputButton[countEventListener++];
			inputButtonArray[i][j].addEventListener(`click`, game);
		}
	}
};

const game = (event) => {
	const [tmpCols, tmpRows] = event.target.id.split(`-`);
	if (!checkFieldIsChecked(tmpCols, tmpRows)) {
		setFieldMarker(event);
		setFieldIsChecked(selectedFields, tmpCols, tmpRows);
		if (checkForWinner(selectedFields)) {
			resetDisplayAllPlayers();
			outputPlayer[getActivePlayerIndex()].classList.add(`won`);
			outputPlayer[getInactivePlayerIndex()].classList.add(`lost`);
			blockUserInput();
			return;
		} else {
			switchActivePlayer();
		}
		counterCheckedFields++;
		if (counterCheckedFields == Math.pow(numFields, 2)) {
			resetDisplayAllPlayers();
			outputPlayer[getActivePlayerIndex()].classList.add(`won`);
			outputPlayer[getInactivePlayerIndex()].classList.add(`won`);
			blockUserInput();
			return;
		}
	}
	displayActivePlayer();
};

const resetGame = () => {
	inputButtonArray.forEach((element) => {
		element.forEach((element) => {
			element.innerHTML = ``;
			element.classList.remove(`won`);
		});
	});
	selectedFields.forEach((element) => {
		element.fill(0);
	});
	playerObj[0].active = true;
	playerObj[1].active = false;
	counterCheckedFields = 0;
	resetDisplayAllPlayers();
	displayActivePlayer();
	addEventListenerButton();
};

resetButton.addEventListener(`click`, resetGame);

addEventListenerButton();
displayActivePlayer();
