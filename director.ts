import * as fs from 'fs';
import * as path from 'path';

const videoExt = ['.mov', '.mp4'];
const textExt = ['.txt'];

const lookupExt = videoExt;
const directoryPath = path.join('/', 'Users', 'user', 'Documents', 'art', '2020-07-04\ Fireshow');

// CODE_XXXX NAME meaning dist size cameramove number SPEED CAMERAPOS RATING

type AttributeName = 'CODE_XXXX' | 'NAME' | 'meaning' | 'dist' | 'size' | 'cameramove' | 'number' | 'SPEED' | 'CAMERAPOS' | 'RATING';

const enums = {
    meaning: {
        intro: 1, story: 2, accent: 3, fill: 4, outro: 5
    },
    dist: {
        'far': 1,
        'far-close': 1.5,
        'mid': 2,
        'close': 3,
        'closest': 4,
        'close-far': 2.5,
    },
    size: {
        'tiny': 1,
        'tiny-big': 10,
        'small': 100,
        'mid': 1000,
        'big-small': 10000,
        'big': 100000,
        'huge': 1000000
    },
    cameramove: {
        'fwd': 10,
        'roll': 15,
        'pan': 20,
        'rotate': 30,
        'helix': 35,
        'pan-back': 40,
        'steady': 50
    },
    num: {
        'n0': 0.5,
        'n1': 1,
        'n1-2': 1.5,
        'n2-1': 1.6,
        'n2': 2,
        'n3': 3,
        'n4': 4,
        'n5': 5,
        'n6': 6,
        'n7': 7
    },
    SPEED: {
        'SLOW': 100,
        'AVG': 300,
        'FAST': 1000,
    },
    CAMERAPOS: {
        'FRONT': 5,
        'TOP': 10,
        'ABOVE': 15,
        'BACK': 20,
        'TOP-BACK': 30,
    },
    RATING: {
        'r1': 10,
        'r2': 20,
        'r3': 30,
        'r4': 40,
        'r5': 50,
        'r6': 60,
        'r7': 70,
    }
}

interface MetaFile {
    filename: string,
    fileext: string,
    meaning: number,
    dist: number,
    size: number,
    cameramove: number,
    num: number,
    SPEED: number,
    CAMERAPOS: number,
    RATING: number,
    [index: string]: any,
    distText: string,
    sizeText: string,
}

interface SortPattern {
    attrName: AttributeName,
    pattern: any[],
    iterations?: number
}

function getMetafilesByFilenames(filenames: string[]): MetaFile[] {
    const metafiles: MetaFile[] = filenames.map((filename: string) => {
        const fname = filename.substring(0, filename.lastIndexOf('.'));
        const fext = filename.substring(filename.lastIndexOf('.'));
        const mf: MetaFile = {
            filename: fname,
            fileext: fext,

            meaning: getAttr(fname, enums.meaning, 2),
            dist: getAttr(fname, enums.dist, 3),
            size: getAttr(fname, enums.size, 4),
            cameramove: getAttr(fname, enums.cameramove, 5),
            num: getAttr(fname, enums.num, 6),
            SPEED: getAttr(fname, enums.SPEED, 7),
            CAMERAPOS: getAttr(fname, enums.CAMERAPOS, 8),
            RATING: getAttr(fname, enums.RATING, 9),

            meaningText: getAttrText(fname, 2),
            distText: getAttrText(fname, 3),
            sizeText: getAttrText(fname, 4),
            cameramoveText: getAttrText(fname, 5),
            numText: getAttrText(fname, 6),
            SPEEDText: getAttrText(fname, 7),
            CAMERAPOSText: getAttrText(fname, 8),
            RATINGText: getAttrText(fname, 9),
        };
        return mf;
    });
    return metafiles;
}

const getStructure = (file: string): string[] => {
    const result = file.split(' ');
    return result;
}

const getAttr = (filename: string, enumerator, order: number): number => {
    if (!getStructure(filename) || !getStructure(filename)[order] || !enumerator[getStructure(filename)[order]]) {
        console.log('File broken:', filename, ', enum key:', enumerator, getStructure(filename)[order]);
    }
    return enumerator[getStructure(filename)[order]] || -1;
}

const getAttrText = (filename: string, order: number): string => {
    if (!getStructure(filename) || !getStructure(filename)[order]) {
        console.log('File broken:', filename, getStructure(filename)[order]);
    }
    return getStructure(filename)[order] || '';
}

const directMetafiles = (filenames: string[], attr: AttributeName, sortPattern: SortPattern = null): MetaFile[] => {
    const result: MetaFile[] = [];

    let keys = Object.keys(enums[attr]);
    let vals = Object.values(enums[attr]);
    const patternText = sortPattern.pattern.map(item => {
        let idx = vals.indexOf(item);
        return `${vals[idx]}: ${keys[idx]}`;
    })

    // console.log(`\nSort by ${attr}: ${sortPattern ? JSON.stringify(patternText, null, 2) : ''}`);
    const metafiles = getMetafilesByFilenames(filenames);

    let patternStep = 0;
    let nextPatternStepValue;
    const patternStepTotal = sortPattern.pattern.length - 1;
    const fileCount = metafiles.length;

    for (let n = 0; n < fileCount; n++) {
        nextPatternStepValue = sortPattern.pattern[patternStep];
        let idx = vals.indexOf(nextPatternStepValue);

        let matchIndex = metafiles.findIndex((mf: MetaFile) => {
            return mf[attr] === nextPatternStepValue;
        });

        if (matchIndex !== -1) {
            result.push(metafiles.splice(matchIndex, 1)[0]);
        } else {
            matchIndex = nextPatternStep(metafiles, attr, sortPattern, patternStep, patternStepTotal, vals, keys);
            result.push(metafiles.splice(matchIndex > 0 ? matchIndex : 0, 1)[0]);
        }

        patternStep = patternStep < patternStepTotal ? patternStep + 1 : 0;
    }
    logReduced(result, attr);

    return result;
}

const nextPatternStep = (metafiles: MetaFile[], attr: AttributeName, sortPattern: SortPattern, patternStep: number, patternStepTotal: number, vals, keys) => {
    patternStep = patternStep < patternStepTotal ? patternStep + 1 : 0;
    let nextPatternStepValue = sortPattern.pattern[patternStep];
    let idx = vals.indexOf(nextPatternStepValue);
    const matchIndex = metafiles.findIndex((mf: MetaFile) => {
        return mf[attr] === nextPatternStepValue;
    });
    if (matchIndex === -1 && patternStep < patternStepTotal) {
        nextPatternStep(metafiles, attr, sortPattern, patternStep, patternStepTotal, vals, keys);
    } else {
        return matchIndex;
    }
}

const logReduced = (metafiles: MetaFile[], attr: AttributeName) => {
    let reduced = metafiles.reduce((prev: string, cur: MetaFile) => {
        let keys = Object.keys(enums[attr]);
        let vals = Object.values(enums[attr]);
        let idx = vals.indexOf(cur[attr]);
        return `${prev}${cur[attr]}(${keys[idx]})-`;
    }, '');
    console.log(`---- Reduced by ${attr}: ${reduced}`);
}

const format = (files: MetaFile[], attr: AttributeName): string[] => {
    const stringArray: string[] = [];
    files.forEach(file => { stringArray.push(file.filename + ' - ' + attr + ': ' + file[attr]) });
    return stringArray;
}

export function directFilenames(filenames: string[], attr: AttributeName): string[] {
    return format(directMetafiles(filenames, attr), attr);
}

///////////////////////////

function fileextMatch(str: string, strs: string[]) {
    return strs.some(s => str.toLowerCase().endsWith(s.toLowerCase()));
}

function sortFilesByAttributes(sortPattern: SortPattern = null, cleanup = false) {
    const attr = sortPattern.attrName;
    const filenames: string[] = [];
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Error reading dir: ' + err);
        }
        files.forEach(function (file) {
            if (fileextMatch(file, lookupExt)) {
                console.log('Old name:', file);
                filenames.push(file);
            }
        });

        const directed = directMetafiles(filenames, attr, sortPattern);

        directed.forEach((mf: MetaFile, index) => {
            const oldname = `${mf.filename}${mf.fileext}`;
            const newname = cleanup
                ? oldname.split('-X-')[oldname.split('-X-').length - 1]
                : `${attr.substr(0, 3)}-${index.toString().padStart(3, '0')}-${mf[attr]}${mf[attr+'Text'].padStart(9, '_')}-X-${mf.filename}${mf.fileext}`;
            console.log('New name:', newname);
            fs.rename(directoryPath + '/' + oldname, directoryPath + '/' + newname, function (e) {
                if (e) console.log('Renaming error: ' + e);
            });
        })
    })
};

const dist = enums.dist;
const size = enums.size;
const m = enums.meaning;

const restoreFileNames = () => sortFilesByAttributes(meaningSortPattern, true);

const meaningSortPattern: SortPattern = {
    attrName: 'meaning' as AttributeName,
    pattern: [m.intro, m.story, m.accent, m.fill, m.story, m.accent, m.fill, m.story, m.accent, m.fill, m.story, m.accent, m.fill, m.outro]
}

const distSortPattern: SortPattern = {
    attrName: 'dist' as AttributeName,
    pattern: [dist.far, dist["far-close"], dist.mid, dist.close, dist["close-far"], dist.closest]
}

const sizeSortPattern: SortPattern = {
    attrName: 'size' as AttributeName,
    pattern: [size.tiny, size["tiny-big"], size.small, size.mid, size["big-small"], size.big, size.huge]
}

console.clear();

// sortFilesByAttributes(distSortPattern);

restoreFileNames();

// TODO: Add multiple attrs and tolerance to each attr. Like taking videos of specific meaning and camera distance  
// TODO: read file metadata: DURATION, EXIF etc.
// TODO: Groups by episodes.
// TODO: Split by sub-episodes.