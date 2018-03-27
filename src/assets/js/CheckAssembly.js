import { LatticeValuesEnum } from '@/self_assembly_library/utils';

const mainCoef = 0.9;

/* function _clasterLatticeToString(clasterLattice) {
    const height = clasterLattice.length;
    const width = clasterLattice[0].length;
    let str = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (clasterLattice[y][x] === undefined) {
                str += '   ';
            } else {
                str += `${clasterLattice[y][x]}`.padStart(3);
            }
        }
        str += ' \n';
    }
    return str;
} */

function _getRightIndexForClaster(clastersArray, clasterIndex) {
    const currentIndexPointTo = clastersArray[clasterIndex];

    if (clasterIndex === currentIndexPointTo) {
        return clasterIndex;
    }

    const res = _getRightIndexForClaster(clastersArray, currentIndexPointTo);
    if (clastersArray[clasterIndex] !== res) {
        clastersArray[clasterIndex] = res;
    }
    return res;
}

function processCell(currentX, currentY, leftX, leftY, topX, topY, squareLattice, clastersLattice, clastersArray) {
    if (squareLattice[currentY][currentX] === LatticeValuesEnum.EMPTY) {
        return;
    }
    const withoutLeft = leftX === null && leftY === null;
    const withoutTop = topX === null && topY === null;

    // States of mask:
    // 0 - left and top cells doesn't fit
    // 1 - left fits, top doesn't
    // 2 - top fits, left doesn't
    // 3 - left and top cells fit
    let mask = 0;
    const currentCell = squareLattice[currentY][currentX];
    if (!withoutLeft && squareLattice[leftY][leftX] === currentCell) {
        mask += 1;
    }
    if (!withoutTop && squareLattice[topY][topX] === currentCell) {
        mask += 2;
    }

    if (mask === 0) {
        const nextClasterIndex = clastersArray.length;
        clastersLattice[currentY][currentX] = nextClasterIndex;
        clastersArray.push(nextClasterIndex);
    } else if (mask === 1) {
        clastersLattice[currentY][currentX] = clastersLattice[leftY][leftX];
    } else if (mask === 2) {
        clastersLattice[currentY][currentX] = clastersLattice[topY][topX];
    } else if (mask === 3) {
        const rightTopClaster = _getRightIndexForClaster(clastersArray, clastersLattice[topY][topX]);
        const rightLeftClaster = _getRightIndexForClaster(clastersArray, clastersLattice[leftY][leftX]);
        if (rightTopClaster < rightLeftClaster) {
            clastersLattice[currentY][currentX] = rightTopClaster;
            clastersArray[rightLeftClaster] = rightTopClaster;
        } else {
            clastersLattice[currentY][currentX] = rightLeftClaster;
            clastersArray[rightTopClaster] = rightLeftClaster;
        }
    } else {
        throw new Error(`Strange state of mask: ${mask}`);
    }
}

function processFinish(currentX, currentY, leftX, leftY, topX, topY, squareLattice, clastersLattice, clastersArray) {
    if (squareLattice[currentY][currentX] === LatticeValuesEnum.EMPTY) {
        return;
    }
    const prevClaster = _getRightIndexForClaster(clastersArray, clastersLattice[currentY][currentX]);
    if (prevClaster === undefined) {
        console.log('hmm, prev is undefined...');
        // console.log(currentY, currentX, squareLattice, clastersLattice);
    }
    processCell(currentX, currentY, leftX, leftY, topX, topY, squareLattice, clastersLattice, clastersArray);
    const newClaster = _getRightIndexForClaster(clastersArray, clastersLattice[currentY][currentX]);
    if (newClaster !== prevClaster) {
        if (newClaster > prevClaster) {
            clastersArray[newClaster] = prevClaster;
        } else {
            clastersArray[prevClaster] = newClaster;
        }
    }
}

function computeClastersLattice(squareLattice) {
    if (!Array.isArray(squareLattice)) {
        throw new Error('Provided argument is not array');
    }
    if (squareLattice.length < 2 || squareLattice[0].length < 2) {
        throw new Error('Provided array is too small');
    }
    const lastY = squareLattice.length - 1;
    const lastX = squareLattice[0].length - 1;
    const size = squareLattice.length;
    const clastersIndices = [];
    const clastersLattice = Array(size);
    for (let i = 0; i < size; i++) {
        clastersLattice[i] = Array(size);
    }

    // region Left column and top row first checking
    processCell(0, 0, null, null, null, null, squareLattice, clastersLattice, clastersIndices);
    for (let y = 0, x = 1; x < size; x++) {
        processCell(x, y, x - 1, y, null, null, squareLattice, clastersLattice, clastersIndices);
    }
    for (let x = 0, y = 1; y < size; y++) {
        processCell(x, y, null, null, x, y - 1, squareLattice, clastersLattice, clastersIndices);
    }
    // endregion

    // region All except top and left cells
    for (let y = 1; y < size; y++) {
        for (let x = 1; x < size; x++) {
            processCell(x, y, x - 1, y, x, y - 1, squareLattice, clastersLattice, clastersIndices);
        }
    }
    // endregion

    // region Left column and top row finish checking
    processFinish(0, 0, lastX, 0, 0, lastY, squareLattice, clastersLattice, clastersIndices);
    for (let x = 1; x <= lastX; x++) {
        processFinish(x, 0, x - 1, 0, x, lastY, squareLattice, clastersLattice, clastersIndices);
    }
    for (let y = 1; y <= lastY; y++) {
        processFinish(0, y, lastX, y, 0, y - 1, squareLattice, clastersLattice, clastersIndices);
    }
    // endregion

    // Turn all claster indices in lattice to right indices
    let currClasterIndex;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            currClasterIndex = clastersLattice[y][x];
            if (currClasterIndex !== undefined) {
                clastersLattice[y][x] = _getRightIndexForClaster(clastersIndices, currClasterIndex);
            }
        }
    }

    return clastersLattice;
}

function computeClastersSize(squareLattice) {
    const clastersLattice = computeClastersLattice(squareLattice);
    const res = {
        horizontal: {},
        vertical: {},
    };
    const height = squareLattice.length;
    const width = squareLattice[0].length;
    let currCell;
    let currClaster;
    let directionKey;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            currCell = squareLattice[y][x];
            if (currCell === LatticeValuesEnum.EMPTY) {
                continue;
            }

            currClaster = clastersLattice[y][x];
            directionKey = currCell === LatticeValuesEnum.HORIZONTAL ? 'horizontal' : 'vertical';
            if (res[directionKey][currClaster] !== undefined) {
                res[directionKey][currClaster] += 1;
            } else {
                res[directionKey][currClaster] = 1;
            }
        }
    }
    return res;
}

function checkSelfAssembly(parsedSquareData) {
    const sizes = computeClastersSize(parsedSquareData);

    let maxHorizontal = 0;
    let sumHorizontal = 0;
    let maxVertical = 0;
    let sumVertical = 0;
    Object.values(sizes.vertical).forEach((size) => {
        sumVertical += size;
        if (size > maxVertical) {
            maxVertical = size;
        }
    });
    Object.values(sizes.horizontal).forEach((size) => {
        sumHorizontal += size;
        if (size > maxHorizontal) {
            maxHorizontal = size;
        }
    });

    return maxHorizontal / sumHorizontal >= mainCoef && maxVertical / sumVertical >= mainCoef;
}

function checkSelfAssemblyPromise(parsedSquareData) {
    return new Promise((resolve, reject) => {
        let res;
        try {
            res = checkSelfAssembly(parsedSquareData);
        } catch (err) {
            console.warn('error:', err);
        }
        console.log('res is:', res);
        if (res) {
            resolve();
        } else {
            reject();
        }
    });
}

export default checkSelfAssemblyPromise;
