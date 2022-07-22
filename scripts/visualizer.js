class Grid {

  /* Constructor */

  constructor(canvasEltId) {
    this.#canvasElt = document.getElementById(canvasEltId);
  }

  initFromCellDimensions(cellWidth, cellHeight, gutter) {
    this.#cellWidth = cellWidth;
    this.#cellHeight = cellHeight;
    this.#gutter = gutter;

    this.#nCols = Math.floor((this.#canvasElt.width - this.#gutter) / (this.#cellWidth + this.#gutter));
    this.#nRows = Math.floor((this.#canvasElt.height - this.#gutter) / (this.#cellHeight + this.#gutter));

    this.#gridWidth = this.#nCols * (this.#cellWidth + this.#gutter) + this.#gutter;
    this.#gridHeight = this.#nRows * (this.#cellHeight + this.#gutter) + this.#gutter;

    // permanently center the grid in the excess horizontal and vertical canvas space
    let extraX = this.#canvasElt.width - this.#gridWidth;
    let extraY = this.#canvasElt.height - this.#gridHeight;
    let context = this.#canvasElt.getContext('2d');
    context.translate(Math.floor(extraX / 2), Math.floor(extraY / 2));

    // to start, render an empty grid
    this.#setBackground();
    this.clear();
  }

  /* Public Methods */

  get nCols() {
    return this.#nCols;
  }

  get nRows() {
    return this.#nRows;
  }

  setInvertYAxis(invert) {
    this.#invertYAxis = invert;
  }

  fillCell(i, j, color = '#cc8800') {
    let context = this.#canvasElt.getContext('2d');
    context.fillStyle = color;
    context.save();

    context.translate(i * (this.#cellWidth + this.#gutter) + this.#gutter,
                      j * (this.#cellHeight + this.#gutter) + this.#gutter);
    context.fillRect(0, 0, this.#cellWidth, this.#cellHeight);

    context.restore();
  }

  clearCell(i, j) {
    this.fillCell(i, j, '#ffffff');
  }

  clear() {
    for (let i = 0; i < this.#nCols; ++i) {
      for (let j = 0; j < this.#nRows; ++j) {
        this.clearCell(i, j);
      }
    }
  }

  drawYData(data) {
    this.clear();
    for (let i = 0; i < data.length; ++i) {
      if (this.#invertYAxis) {
        this.fillCell(i, this.#nRows - data[i] - 1);
      }
      else {
        this.fillCell(i, data[i]);
      }
    }
  }

  drawSortedData() {
    this.drawYData([...Array(this.nCols).keys()]);
  }

  /* Private Variables */

  #canvasElt;
  #cellWidth;
  #cellHeight;
  #gridWidth;
  #gridHeight;
  #gutter;
  #nCols;
  #nRows;
  #invertYAxis;

  /* Private Methods */

  #setBackground(bgColor = '#cccccc') {
    let context = this.#canvasElt.getContext('2d');
    context.fillStyle = bgColor;
    context.fillRect(0, 0, this.#gridWidth, this.#gridHeight);
  }
}

class Visualizer extends Grid {

  /* Constructor */

  constructor(canvasEltId, cellWidth, cellHeight, gutter, msPerInterval = 100) {
    super(canvasEltId, cellWidth, cellHeight, gutter);
    this.#msPerInterval = msPerInterval;
    this.#currentRunningAlgoID = null;
  }

  /* Public Methods */

  mountButtons(algorithms) {
    const buttonContainer = document.getElementById('button-container');
    algorithms.forEach(algorithm => {
        const button = document.createElement('button');
        button.innerHTML = algorithm.name;
        button.addEventListener('click', () => {
            this.#run(algorithm);
        });
        buttonContainer.appendChild(button);
    });
  }

  /* Private Variables */

  #msPerInterval;
  #currentRunningAlgoID;

  /* Private Methods */

  #run(algo) {
    if (this.#currentRunningAlgoID != null) {
      window.clearInterval(this.#currentRunningAlgoID);
    }

    this.#currentRunningAlgoID = window.setInterval((algo) => {
        this.drawYData(algo.step());

        if (algo.done()) {
            window.clearInterval(this.#currentRunningAlgoID);
        }
    }, this.#msPerInterval, new algo(this.nCols));
  }
}
