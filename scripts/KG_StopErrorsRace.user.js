// ==UserScript==
// @name         KG_StopErrorsRace
// @namespace    klavogonki
// @version      1.0.0
// @description  Останавливает заезд и создает новый если количество ошибок больше, чем указанное в настройках.
// @author       Akmat
// @include      http://klavogonki.ru/g/*
// ==/UserScript==

"use strict";

function createElements() {
	const is_on = localStorage.selectedItem !== 'off';
	const div    = document.createElement("div");
	const select = document.createElement("select");
	const label  = document.createElement("label");
	
	label.textContent = 'Выберите количество ошибок';
	select.name = 'stopErrorsSelect';
	label.id = 'stopLabelId';
	div.setAttribute.id = 'stopSelectedDivId';
	select.id = 'stopSelectId';

	const node = document.getElementsByClassName("rc");
	node[2].appendChild(div);
	div.appendChild(label);
	div.appendChild(select);
	label.style.margin = '0 5px 0 0';

	let option = document.createElement("option");
	
	if (!is_on) {
		option.selected = selected;
	}
	option.innerText = 'off';
	
	select.appendChild(option);


	for (let i = 1; i < 6; i++) {
		option = document.createElement("option");
		option.value = i;
		option.innerText = i;

		if (localStorage.selectedItem !== 'off' && +localStorage.selectedItem === i) {
			option.selected = true;
		}
		select.appendChild(option);
	}
}

function checkSelect() {
	document.getElementById("stopSelectId")
	.addEventListener("change", (e) => {
		const value = e.target.selectedOptions[0].textContent;
		localStorage.selectedItem = value;
	});
}

if (localStorage.selectedItem === undefined) {
	localStorage.selectedItem = 'off';
}

window.addEventListener('load', () => {
	const rightUrl = window.location.href;
	const normalRaceX = document.getElementById('gamedesc').innerText.match(/Обычный, соревнование/);

	if (!!rightUrl.match(/gmid/) && normalRaceX === null) {
		createElements();
		checkSelect();
	}
});

function stopGame() {
	const input  = document.getElementById("inputtext");
	input.disabled = true;
	input.style.backgroundColor = '#ccc';
}

function createNewGameAndRedirect() {
	const url = window.location.href.match(/[0-9]+/)[0];
	window.location = `/g/${url}.replay`;
}

const errors = document.getElementById("errors-label");
const rightUrl = window.location.href.match(/gmid/);

window.addEventListener("keyup", (event) => {
	if (!!rightUrl && localStorage.selectedItem !== 'off') {
		if (errors.innerText > localStorage.selectedItem) {	
			stopGame();
			createNewGameAndRedirect();
		}
	}
});