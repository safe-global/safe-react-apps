import SHA256 from 'crypto-js/sha256';
import { BatchFile } from '../typings/models';

const serializeJSONObject = (json: any): string => {
  if (Array.isArray(json)) {
    return `[${json.map((el) => serializeJSONObject(el)).join(',')}]`;
  }

  if (typeof json === 'object' && json !== null) {
    let acc = '';
    const keys = Object.keys(json).sort();
    acc += `{${JSON.stringify(keys)}`;

    for (let i = 0; i < keys.length; i++) {
      acc += `${serializeJSONObject(json[keys[i]])},`;
    }

    return `${acc}}`;
  }

  return `${JSON.stringify(json)}`;
};

const calculateChecksum = (batchFile: BatchFile): string => {
  return SHA256(serializeJSONObject(batchFile)).toString();
};

export const addChecksum = (batchFile: BatchFile): BatchFile => {
  return {
    ...batchFile,
    meta: {
      ...batchFile.meta,
      checksum: calculateChecksum(batchFile),
    },
  };
};

export const validateChecksum = (batchFile: BatchFile): boolean => {
  const targetObj = { ...batchFile };
  const checksum = targetObj.meta.checksum;
  delete targetObj.meta.checksum;

  return calculateChecksum(targetObj) === checksum;
};
