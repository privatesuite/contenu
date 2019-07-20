const itemSelectedEvent = new Event("itemSelected");

function qs (querystring) {

	querystring = querystring.substring(querystring.indexOf('?')+1).split('&');
	let params = {}, pair, d = decodeURIComponent;

	for (let i = querystring.length - 1; i >= 0; i--) {
		
		pair = querystring[i].split('=');
		params[d(pair[0])] = d(pair[1] || '');
	
	}

	return params;

}

function cookies () {

	return document.cookie.split(";").reduce((res, c) => {
	
		const [key, val] = c.trim().split("=").map(decodeURIComponent)
		const allNumbers = str => /^\d+$/.test(str);
		
		try {
		
			return Object.assign(res, { [key]: allNumbers(val) ?  val : JSON.parse(val) })
		
		} catch (e) {
		
			return Object.assign(res, { [key]: val })
		
		}
	
	}, {});

}

function typeize (value) {

	if (value === "true") return true;
	if (value === "false") return false;
	if (/^[+-]?\d+(\.\d+)?$/.test(value)) return parseFloat(value)
	return value;

}

function updateFields () {

	fields = {};

	for (const field of document.getElementById("fields").children) {

		fields[field.children[0].value] = typeize(field.children[1].value);

	}

	document.querySelector("*[name=fields]").value = JSON.stringify(fields);

}

function redrawFields () {

	for (const el of document.querySelectorAll("#fields>*")) el.remove();

	for (const key of Object.keys(fields)) {
			
		const div = document.createElement("div");

		const input = document.createElement("input");

		input.value = key;

		input.type = "text";

		const input2 = document.createElement("textarea");

		input2.value = fields[key];

		div.appendChild(input);
		div.append(" ");
		div.appendChild(input2);
		div.append(" ");

		const span = document.createElement("span");

		span.innerText = "Delete";
		span.classList.add("btn");
		span.classList.add("delete_field");

		span.style.textIndent = "0";

		div.appendChild(span);

		document.getElementById("fields").appendChild(div);

	}

	document.querySelector("*[name=fields]").value = JSON.stringify(fields);

}

function updateTemplate () {

	let selected = templates.find(_ => _.id === document.querySelector("input[name=template]").value);

	for (const el of document.querySelectorAll("#template_fields>*")) el.remove();

	if (selected) {

		fields = {...selected.fields, ...fields};

		redrawFields();

		for (const key of Object.keys(selected.fields)) {
			
			const value = selected.fields[key];

			const div = document.createElement("div");

			const input = document.createElement("input");
			
			input.value = key;

			input.type = "text";
			input.disabled = "true";

			const input2 = document.createElement("textarea");

			input2.value = value;
			input2.readOnly = true;

			div.appendChild(input);
			div.append(" ");
			div.appendChild(input2);
			div.append(" ");

			document.getElementById("template_fields").appendChild(div);

		}

	}

}

async function main () {

	feather.replace();

	if (qs(location.search).to) {

		if ("scrollRestoration" in window.history) {
			
			window.history.scrollRestoration = "manual";
		
		}

		const to = qs(location.search).to;
		history.replaceState("", "", location.pathname);

		less.pageLoadFinished.then(() => {
			
			window.scrollTo(0, document.getElementById(to).offsetTop);

		});

	}

	if (typeof element !== "undefined") {

		var res = await fetch(`/api/elements?token=${cookies().token}`);
		fields = ((await res.json()).find(_ => _.id === element) || {fields: {}}).fields;

		redrawFields();

	}

	if (typeof fields !== "undefined") updateFields();
	if (typeof templates !== "undefined") updateTemplate();

	document.addEventListener("click", event => {

		/**
		 * @type {HTMLElement}
		 */
		const target = event.target;

		if (target.parentElement.classList.contains("select")) {

			if (target.parentElement.querySelector("*[selected]")) target.parentElement.querySelector("*[selected]").removeAttribute("selected");
			target.setAttribute("selected", "");
			target.parentElement.querySelector("input").setAttribute("value", target.getAttribute("value"));

			if (target.parentElement.id === "theme_select") {
				
				document.getElementById("theme").href = `/admin/static/themes/${target.getAttribute("value")}.less`;
				// less.sheets = [];
				document.querySelector("style").remove();
				less.refresh();
				document.cookie=`theme=${target.getAttribute("value")}; path=/admin;`;

			}

			if (typeof templates !== "undefined") updateTemplate();

		}

		if (target.id === "add_field") {

			// <div><input type="text"> <input type="text"> <span class="btn delete_field" style="text-indent: 0;">Delete</span></div>

			const div = document.createElement("div");

			const input = document.createElement("input");

			input.type = "text";

			div.appendChild(input);
			div.append(" ");
			div.appendChild(document.createElement("textarea"));
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
