import fileType from 'file-type';
import { readAsArrayBuffer } from 'promise-file-reader';
import LineNavigator from 'line-navigator';

const LatticeValuesEnum = { EMPTY: 1, HORIZONTAL: 2, VERTICAL: 3 };

// const latticeSize = 256;
// const particleSize = 8;

function rejectError(string) {
    return { reason: string };
}

function validateFileType(file) {
    const blob = file.slice(0, 4100);
    return readAsArrayBuffer(blob).then((arrayBuffer) => {
        const type = fileType(arrayBuffer);
        if (type) {
            return Promise.reject(rejectError('file_is_not_text'));
        }
        return null;
    });
}

function parseFile(file, size, { empty = '1', vertical = '3', horizontal = '2' } = {}) {
    const navigator = new LineNavigator(file);

    return new Promise((resolve, reject) => {
        const arr = [];
        navigator.readSomeLines(0, function linesReadHandler(err, index, lines, isEof) {
            if (err) {
                reject(rejectError('something_is_wrong'));
            }

            for (const line of lines) {
                const newArrLine = [];
                for (const char of line) {
                    switch (char) {
                        case empty:
                            newArrLine.push(LatticeValuesEnum.EMPTY);
                            break;
                        case vertical:
                            newArrLine.push(LatticeValuesEnum.VERTICAL);
                            break;
                        case horizontal:
                            newArrLine.push(LatticeValuesEnum.HORIZONTAL);
                            break;
                        default:
                            break;
                    }
                }
                if (newArrLine.length !== size) {
                    console.log('reject!');
                    reject(rejectError('line_length_mismatch_size'));
                    return;
                }
                arr.push(newArrLine);
            }

            // End of file
            if (isEof) {
                if (arr.length !== size) {
                    reject(rejectError('line_number_mismatch_size'));
                } else {
                    resolve(arr);
                }
                return;
            }

            const nextLineIndex = index + lines.length;
            if (nextLineIndex >= size) {
                reject(rejectError('line_number_mismatch_size'));
                return;
            }

            // Reading next chunk, adding number of lines read to first line in current chunk
            navigator.readSomeLines(nextLineIndex, linesReadHandler);
        });
    });
}

export {
    validateFileType,
    parseFile,
    rejectError,
    LatticeValuesEnum,
};
