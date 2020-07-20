// adapter from https://github.com/cosmith/loki-cordova-fs-adapter/blob/master/src/loki-cordova-fs-adapter.es6
import { Platform } from '@ionic/angular';
import { Storage } from 'redux-persist';

const TAG = '[FileStorage]';

// Messy Promise/Callback api for persist@4/5
const FileStorage = (): Storage => {
  const platform = new Platform();

  const getFile = (name: any, handleSuccess: any, handleError: any) => {
    platform.ready().then(() => {
      (window as any).resolveLocalFileSystemURL(
        (window as any).cordova.file.dataDirectory,
        (dir: any) => {
          const fileName = `${encodeURIComponent(name)}.persist.json`;
          dir.getFile(fileName, { create: true }, handleSuccess, handleError);
        },
        (err: any) => {
          throw new Error(
            'Unable to resolve local file system URL' + JSON.stringify(err)
          );
        }
      );
    });
  };

  // adapted from http://stackoverflow.com/questions/15293694/blob-constructor-browser-compatibility
  const createBlob = (data: any, datatype: any) => {
    let blob;

    try {
      blob = new Blob([data], { type: datatype });
    } catch (err) {
      (window as any).BlobBuilder =
        (window as any).BlobBuilder ||
        (window as any).WebKitBlobBuilder ||
        (window as any).MozBlobBuilder ||
        (window as any).MSBlobBuilder;

      if (err.name === 'TypeError' && (window as any).BlobBuilder) {
        const bb = new (window as any).BlobBuilder();
        bb.append(data);
        blob = bb.getBlob(datatype);
      } else if (err.name === 'InvalidStateError') {
        // InvalidStateError (tested on FF13 WinXP)
        blob = new Blob([data], { type: datatype });
      } else {
        // We're screwed, blob constructor unsupported entirely
        throw new Error('Unable to create blob' + JSON.stringify(err));
      }
    }
    return blob;
  };

  const setItem = (key: string, value: any, cb: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      getFile(
        key,
        (fileEntry: any) => {
          fileEntry.createWriter(
            (fileWriter: any) => {
              fileWriter.onwriteend = () => {
                if (fileWriter.length === 0) {
                  const blob = createBlob(value, 'text/plain');
                  fileWriter.write(blob);
                  resolve();
                }
              };
              fileWriter.truncate(0);
            },
            (err: any) => reject(err)
          );
        },
        (err: any) => reject(err)
      );
    })
      .then(() => {
        // console.log(TAG, 'setItem', key, value)
        if (cb) {
          cb(null);
        }
      })
      .catch(e => {
        console.error(TAG, 'setItem', key, value, e);
        if (cb) {
          cb(e);
        }
      });
  };

  const getItem = (key: string, cb: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      getFile(
        key,
        (fileEntry: any) => {
          fileEntry.file(
            (file: any) => {
              const reader = new FileReader();
              reader.onloadend = event => {
                const contents = (event as any).target.result;
                resolve(contents);
              };
              reader.readAsText(file);
            },
            (err: any) => reject(err)
          );
        },
        (err: any) => reject(err)
      );
    })
      .then(contents => {
        // console.log(TAG, 'getItem', key, contents);
        if (cb) {
          cb(null, contents);
        }
        return contents; // promise needs to re-resolve return value
      })
      .catch(e => {
        console.error(TAG, 'getItem', key, e);
        if (cb) {
          cb(e);
        }
      });
  };

  const removeItem = (key: string, cb: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      platform.ready().then(() => {
        (window as any).resolveLocalFileSystemURL(
          (window as any).cordova.file.dataDirectory,
          (dir: any) => {
            const fileName = `${encodeURIComponent(key)}.persist.json`;
            dir.getFile(
              fileName,
              { create: true },
              (fileEntry: any) => {
                return fileEntry.remove(
                  () => resolve(),
                  (err: any) => {
                    reject(err);
                  }
                );
              },
              (err: any) => {
                reject(err);
              }
            );
          },
          (err: any) => {
            reject(err);
          }
        );
      });
    })
      .then(() => {
        // console.log(TAG, 'removeItem', key);
        if (cb) {
          cb(null);
        }
      })
      .catch(e => {
        console.error(TAG, 'removeItem', key, e);
        if (cb) {
          cb(e);
        }
      });
  };
  return {
    setItem,
    getItem,
    removeItem
  };
};

export default FileStorage();
