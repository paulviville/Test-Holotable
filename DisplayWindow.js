import { GUI } from './three/libs/lil-gui.module.min.js'; 

export default class DisplayWindow {
	#window;
	#title;
	#canvas;

	#callbacks;

	constructor ( title, callbacks ) {
		console.log(`DisplayWindow - constructor`);

		this.#title = title;
		this.#callbacks = callbacks;
	}

	#onLoad ( ) {
		console.log(`DisplayWindow - #onLoad`);

		this.#canvas = this.#window.document.createElement('canvas');
		this.#window.document.body.appendChild(this.#canvas);
		this.#canvas.width = this.#window.innerWidth;
		this.#canvas.height = this.#window.innerHeight;

		this.#callbacks.onLoad?.(this.#window, this.#canvas);

		this.#window.onresize = this.#onResize.bind(this);
		this.#window.document.title = this.#title;
	}

	#onResize ( ) {
		console.log(`DisplayWindow - #onResize`);
		
		this.#canvas.width = this.#window.innerWidth;
		this.#canvas.height = this.#window.innerHeight;

		this.#callbacks.onResize?.(this.#window.innerWidth, this.#window.innerHeight);
	}

	// resize ( width, height ) {
	// 	console.log(`DisplayWindow - resize`);

	// }

	open ( parameters = "width=500, height=500") {
		console.log(`DisplayWindow - open`);

		this.#window = window.open("./display.html", "", parameters);
		this.#window.addEventListener("load", this.#onLoad.bind(this));
	}

	close ( ) {
		console.log(`DisplayWindow - close`);

		this.#window?.close();
	}

	get canvas ( ) {
		return this.#canvas;
	}
}