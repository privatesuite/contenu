function typeize (value) {

	if (value === "true") return true;
	if (value === "false") return false;
	if (/^[+-]?\d+(\.\d+)?$/.test(value)) return parseFloat(value)
	return value;

}

function updateFields () {

	let fields = {};

	for (const field of document.getElementById("fields").children) {

		fields[field.children[0].value] = typeize(field.children[1].value);

	}

	document.querySelector("*[name=fields]").value = JSON.stringify(fields);

}

function main () {

	if (typeof fields !== "undefined") updateFields();

	document.addEventListener("click", event => {

		/**
		 * @type {HTMLElement}
		 */
		const target = event.target;

		if (target.parentElement.classList.contains("select")) {

			target.parentElement.querySelector("*[selected]").removeAttribute("selected");
			target.setAttribute("selected", "");
			target.parentElement.querySelector("input").setAttribute("value", target.getAttribute("value"));

		}

		if (target.id === "add_field") {

			// <div><input type="text"> <input type="text"> <span class="btn delete_field" style="text-indent: 0;">Delete</span></div>

			const div = document.createElement("div");

			const input = document.createElement("input");

			input.type = "text";

			div.appendChild(input);
			div.append(" ");
			div.appendChild(input.cloneNode());
			div.append(" ");

			const span = document.createElement("span");

			span.innerText = "Delete";
			span.classList.add("btn");
			span.classList.add("delete_field");

			span.style.textIndent = "0";

			div.appendChild(span);

			document.getElementById("fields").appendChild(div);

			updateFields();

		}

		if (target.classList.contains("delete_field")) {

			target.parentElement.remove();

			updateFields();

		}

	});

	document.addEventListener("input", event => {

		/**
		 * @type {HTMLElement}
		 */
		const target = event.target;

		if (target.parentElement.parentElement && target.parentElement.parentElement.id === "fields") updateFields();

	});

}

document.addEventListener("DOMContentLoaded", main);
