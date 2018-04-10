import { LatticeValuesEnum } from '@/assets/js/utils';

const coef = 0.1;

function checkSelfAssemblyByNeighbours(parsedSquareData, particleLength) {
    const maxY = parsedSquareData.length - 1;
    const maxX = parsedSquareData[0].length - 1;
    let horizontalCells = 0;
    let verticalCells = 0;
    let interracialContacts = 0;
    let currCell;
    let anotherDirection;

    function processCell(x, y, rightX, rightY, bottomX, bottomY) {
        currCell = parsedSquareData[y][x];
        if (currCell === LatticeValuesEnum.EMPTY) {
            return;
        } else if (currCell === LatticeValuesEnum.HORIZONTAL) {
            anotherDirection = LatticeValuesEnum.VERTICAL;
            horizontalCells++;
        } else {
            anotherDirection = LatticeValuesEnum.HORIZONTAL;
            verticalCells++;
        }

        if (parsedSquareData[bottomY][bottomX] === anotherDirection) {
            interracialContacts++;
        }
        if (parsedSquareData[rightY][rightX] === anotherDirection) {
            interracialContacts++;
        }
    }

    for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
            processCell(x, y, x + 1, y, x, y + 1);
        }
    }
    for (let y = maxY, x = 0; x < maxX; x++) {
        processCell(x, y, x + 1, y, x, 0);
    }
    for (let x = maxX, y = 0; y < maxY; y++) {
        processCell(x, y, 0, y, x, y + 1);
    }
    processCell(maxX, maxY, 0, maxY, maxX, 0);

    const countedCoef = interracialContacts / ((horizontalCells + verticalCells) / particleLength);
    return countedCoef < coef;
}

function checkSelfAssemblyPromise(parsedSquareData) {
    return new Promise((resolve, reject) => {
        let res;
        try {
            res = checkSelfAssemblyByNeighbours(parsedSquareData, 8);
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
