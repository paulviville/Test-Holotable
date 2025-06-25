export default class DisplayWindow {
	#window;
	#canvas;

	#callbacks;

	constructor ( callbacks ) {
		console.log(`DisplayWindow - constructor`);

		this.#callbacks = callbacks;
	}

	#onLoad ( ) {
		console.log(`DisplayWindow - #onLoad`);

		this.#canvas = this.#window.document.createElement('canvas');
		this.#window.document.body.appendChild(this.#canvas);
		this.#canvas.width = this.#window.innerWidth;
		this.#canvas.height = this.#window.innerHeight;

		this.#callbacks?.onLoad(this.#canvas);
	}

	#onResize ( ) {
		console.log(`DisplayWindow - #onResize`);
		
	}

	resize ( width, height ) {
		console.log(`DisplayWindow - resize`);

	}

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