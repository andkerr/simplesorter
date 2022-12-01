/* Helpers */

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomPerm(elts) {
  let rand_idx;
  for (let i = 0; i < elts.length; ++i) {
    rand_idx = getRandomIntInclusive(i, elts.length - 1);
    [elts[i], elts[rand_idx]] = [elts[rand_idx], elts[i]];
  }

  return elts;
}

function deepCopy(x) {
  return JSON.parse(JSON.stringify(x));
}


/* Sorting Algorithms */

class SortingAlgorithm {
  constructor(n) {
    this.data = randomPerm([...Array(n).keys()]);
    this.steps = [deepCopy(this.data)];
    this.stepCounter = 0;
  }

  /* Public Variables */
  
  data;
  steps;
  stepCounter;

  /* Public Methods */

  step() {
    if (this.steps.length == 1) {
      this.sortAndComputeSteps(0, this.data.length - 1);
    }
    let currentStep = deepCopy(this.steps[this.stepCounter]);
    ++this.stepCounter;
    return currentStep;
  }

  done() {
    return this.stepCounter == this.steps.length;
  }

  sortAndComputeSteps() {
    return;
  }
}

class MergeSort extends SortingAlgorithm {
  constructor(n) {
    super(n);
  }

  /* Public Methods */

  sortAndComputeSteps(lo, hi) {
    if (lo == hi) {
      return;
    }

    let mid = Math.floor((lo + hi) / 2);
    this.sortAndComputeSteps(lo, mid);
    this.sortAndComputeSteps(mid + 1, hi);
    this.#mergeAndUpdateSteps(lo, mid, hi);
  }

  /* Private Methods */

  #mergeAndUpdateSteps(lo, mid, hi) {
    var buffer = Array();
    var l_idx = lo,
        r_idx = mid + 1;

    var l_curr, r_curr;
    while ((l_idx <= mid) || (r_idx <= hi)) {
      if (l_idx <= mid) {
        l_curr = this.data[l_idx];
      }
      else {
        l_curr = Infinity;
      }

      if (r_idx <= hi) {
        r_curr = this.data[r_idx];
      }
      else {
        r_curr = Infinity;
      }

      if (l_curr <= r_curr) {
        buffer.push(l_curr);
        ++l_idx;
      }
      else {
        buffer.push(r_curr);
        ++r_idx;
      }
    }

    for (let i = 0; i < buffer.length; ++i) {
      if (this.data[lo + i] != buffer[i]) {
        this.data[lo + i] = buffer[i];
        this.steps.push(deepCopy(this.data));
      }
    }
  }
}


class HeapSort extends SortingAlgorithm {
   constructor(n) {
    super(n);
  }

  /* Public Methods */

  sortAndComputeSteps() {
    this.#heapify();

    for (let i = this.data.length - 1; i >= 1; --i) {
      [this.data[0], this.data[i]] = [this.data[i], this.data[0]];
      this.steps.push(deepCopy(this.data));
      this.#siftDown(0, i);
    }
  }

  /* Private Methods */

  #left(idx) {
    return 2 * idx;
  }

  #right(idx) {
    return 2 * idx + 1;
  }

  #heapify() {
    for (let i = Math.floor(this.data.length / 2); i >= 0; --i) {
      this.#siftDown(i, this.data.length);
    }
  }

  #siftDown(idx, heapSize) {
    var l = this.#left(idx),
        r = this.#right(idx),
        largest = -1;

    if ((l < heapSize) && (this.data[l] > this.data[idx])) {
      largest = l;
    }
    else {
      largest = idx;
    }

    if ((r < heapSize) && (this.data[r] > this.data[largest])) {
      largest = r;
    }

    if (largest != idx) {
      [this.data[idx], this.data[largest]] = [this.data[largest], this.data[idx]];
      this.steps.push(deepCopy(this.data));
      this.#siftDown(largest, heapSize);
    }
  }
}

class QuickSort extends SortingAlgorithm {
  constructor(n) {
    super(n);
  }

  /* Public Methods */

  sortAndComputeSteps(lo, hi) {
    if (lo < hi) {
     let pivotIdx = this.#partition(lo, hi);
     this.sortAndComputeSteps(lo, pivotIdx - 1);
     this.sortAndComputeSteps(pivotIdx + 1, hi);
    }
  }

  #partition(lo, hi) {
    let compElement = this.data[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; ++j) {
      if (this.data[j] <= compElement) {
        ++i;
        if (this.data[i] != this.data[j]) {
          [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
          this.steps.push(deepCopy(this.data));
        }
      }
    }
    if (this.data[i + 1] != this.data[hi]) {
      [this.data[i + 1], this.data[hi]] = [this.data[hi], this.data[i + 1]];
      this.steps.push(deepCopy(this.data));
    }
    return i + 1;
  }
}
