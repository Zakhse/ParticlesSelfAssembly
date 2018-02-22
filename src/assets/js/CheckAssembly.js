import { LatticeValuesEnum } from '@/self_assembly_library/utils';

function clasters(squareLattice) {
    const empty = LatticeValuesEnum.EMPTY;
    const size = squareLattice.length;
    const clasterIndex = [];
    const clasters = new Array(size);
    for (let i = 0; i < size; i++) {
        clasters[i] = new Array(size);
    }
    let newClasterIndex = 0;

    //region Left column and top row first checking
    clasters[0][0] = newClasterIndex;
    clasterIndex.push(newClasterIndex);
    newClasterIndex++;

    for (let y = 0, x = 1; x < size; x++) {
        if (squareLattice[y][x] === empty) {
            continue;
        }
        if (squareLattice[y][x - 1] !== empty) {
            clasters[y][x] = clasters[y][x - 1];
        } else {
            clasters[y][x] = newClasterIndex;
            clasterIndex.push(newClasterIndex);
            newClasterIndex++;
        }
    }

    for (let x = 0, y = 1; y < size; y++) {
        if (squareLattice[y][x] === empty) {
            continue;
        }
        if (squareLattice[y - 1][x] !== empty) {
            clasters[y][x] = clasters[y - 1][x];
        } else {
            clasters[y][x] = newClasterIndex;
            clasterIndex.push(newClasterIndex);
            newClasterIndex++;
        }
    }
    //endregion

    for (let y = 1; y < size; y++) {
        for (let x = 1; x < size; x++) {
            if (squareLattice[y][x] === empty) {
                continue;
            }
            if (squareLattice[y][x - 1] === empty && squareLattice[y - 1][x] === empty) {
                clasters[y][x] = newClasterIndex;
                clasterIndex.push(newClasterIndex);
                newClasterIndex++;
            } else if (squareLattice[y][x - 1] === empty && squareLattice[y - 1][x] !== empty) {
                clasters[y][x] = clasters[y - 1][x];
            } else if (squareLattice[y][x - 1] !== empty && squareLattice[y - 1][x] === empty) {
                clasters[y][x] = clasters[y][x - 1];
            } else {

            }
        }
    }
}

function checkSelfAssembly(parsedSquareData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const rnd = Math.random();
            if (rnd > 0.5) {
                resolve(parsedData);
            } else {
                reject();
            }
        }, 2000);
    });
}

export default checkSelfAssembly;
