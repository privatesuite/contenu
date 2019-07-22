async function editorMain () {

	document.addEventListener("input", event => {
		
		if (!event.target) return;

		var element = event.target;

		if (element.classList.contains("block")) {

			if (element.classList.contains("text")) {

				element.style.height = `auto`;
				element.style.height = `${element.scrollHeight}px`;

			}

		}

	});

}

document.addEventListener("DOMContentLoaded", editorMain);
