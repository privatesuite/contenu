async function editorMain () {

	const converter = new showdown.Converter();

	for (const editor of document.querySelectorAll(".editor")) {
		
		editor.getValue = () => {

			return editor.querySelector(".preview").innerHTML;

		}

		editor.setValue = value => {

			editor.querySelector("textarea").value = converter.makeMarkdown(value);
			editor.querySelector(".preview").innerHTML = value;

		}

	}

	document.addEventListener("keyup", event => {

		var target = event.target;

		if (target.tagName.toLowerCase() === "textarea" && target.parentElement.classList.contains("editor")) {

			target.parentElement.querySelector(".preview").innerHTML = converter.makeHtml(target.value);

		}

	});

}

document.addEventListener("DOMContentLoaded", editorMain);
