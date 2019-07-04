function main () {

	document.addEventListener("click", event => {

		/**
		 * @type {HTMLElement}
		 */
		var target = event.target;

		if (target.parentElement.classList.contains("select")) {

			target.parentElement.querySelector("*[selected]").removeAttribute("selected");
			target.setAttribute("selected", "");
			target.parentElement.querySelector("input").setAttribute("value", target.getAttribute("value"));

		}

	});

}

document.addEventListener("DOMContentLoaded", main);
