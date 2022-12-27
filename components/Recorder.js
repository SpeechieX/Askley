import React, {useState} from 'react';
import {Platform} from 'react-native';

import RNFS from 'react-native-fs';

const Recorder = async () => {
  const [recordingPath, setRecordingPath] = useState('');
  const [encoding, setEncoding] = useState('ascii');
  let [totalCount, setTotalCount] = useState(0);

  if (Platform.OS === 'android') {
    this._recordingPath = `${RNFS.DocumentDirectoryPath}/recording.wav`;
  } else if (Platform.OS === 'ios') {
    this._recordingPath = `${RNFS.MainBundlePath}/recording.wav`;
  } else {
    throw new Error('Unsupported platform');
  }

  const writeWavHeader = async () => {
    let totalSampleCount = 0;
    let channelCount = 1;
    let bitDepth = 16;
    let sampleRate = 16000;

    const buffer = new ArrayBuffer(44);
    const dv = new DataView(buffer);

    let p = 0;
    let d;

    function writeString(str) {
      for (let i = 0; i < str.length; i++) {
        dv.setUint8(p + i, str.charCodeAt(i));
      }
      p += str.length;
    }

    function writeUint32(digits) {
      dv.setUint32(p, d, true);
      p += 4;
    }
    function writeUint16(digits) {
      dv.setUint32(p, d, true);
      p += 2;
    }

    writeString('RIFF');
    writeUint32((bitDepth / 8) * totalSampleCount + 36);
    writeString('WAVE');
    writeString('fmt ');
    writeUint32(16);
    writeUint16(1);
    writeUint16(channelCount);
    writeUint32(sampleRate);
    writeUint32((sampleRate * channelCount * bitDepth) / 8);
    writeUint16((channelCount * bitDepth) / 8);
    writeUint16(bitDepth);
    writeString('data');
    writeUint32((bitDepth / 8) * totalSampleCount);

    const header = Recorder.bufferToString(buffer);

    setTotalCount(totalSampleCount);

    await RNFS.write(recordingPath, header, 0, encoding);
  };

  const writeSamples = async pcm => {
    const buffer = new ArrayBuffer(pcm.length * 2);
    const dv = new DataView(buffer);

    let p = 0;
    let d;

    function writeUint16(digits) {
      dv.setInt16(p, d, true);
      p += 2;
    }

    for (let i = 0; i < pcm.length; i++) {
      writeUint16(pcm[i]);
    }

    const data = Recorder.bufferToString(buffer);

    await RNFS.appendFile(recordingPath, data, encoding);

    setTotalCount((totalCount += pcm.length));
  };

  const finalize = async () => {
    await writeWavHeader(totalCount);
    return recordingPath;
  };

  const bufferToString = buffer => {
    let res = '';
    const bytes = new Uint8Array(buffer);
    for (const byte of bytes) {
      res += String.fromCharCode(byte);
    }
    return res;
  };
};
export default Recorder;
