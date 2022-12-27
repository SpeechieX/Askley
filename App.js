// /**
//  * Askley Application
//  *
//  * @format
//  * @flow strict-local
//  */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Voice from 'react-native-voice';
// import {NeuButton, NeuView} from 'neumorphism-ui';

const WINDOW_HEIGHT = Dimensions.get('window').height;

const App = () => {
  const [isRecording, setRecording] = useState(false);
  const [inputValue, setInputValue] = useState('');

  Voice.onSpeechStart = () => setRecording(true);
  Voice.onSpeechResults = e => setInputValue(e.value[0]);

  const handleStartRecording = async () => {
    await Voice.start('en-US');
  };

  const handleStopRecording = async () => {
    setRecording(false);
    await Voice.stop();
  };

  return (
    <View style={styles.container}>
      <View pressed style={styles.inputWrapper}>
        <TextInput
          autoFocus={false}
          value={inputValue}
          style={styles.input}
          textAlignVertical="top"
          placeholder="Start recording and dictating..."
          multiline
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleStartRecording}>
        <Text style={styles.btnLabel}>{isRecording ? 'STOP' : 'RECORD'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingVertical: 50,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: '#e0e5ec',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  inputWrapper: {
    marginBottom: 'auto',
    height: WINDOW_HEIGHT / 3,
  },
  input: {
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0)',
    height: '90%',
    margin: 20,
    padding: 20,
    color: 'rgba(0,0,0,0.7)',
    fontSize: 15,
  },
  btnLabel: {
    opacity: 0.7,
  },
});

export default App;

// import React, {useState, useEffect} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TouchableOpacity,
//   Dimensions,
//   EventSubscription,
//   NativeEventEmitter,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';

// import {
//   Leopard,
//   LeopardErrors,
//   LeopardWord,
// } from '@picovoice/leopard-react-native';

// import {
//   BufferEmitter,
//   VoiceProcessor,
// } from '@picovoice/react-native-voice-processor';
// import Recorder from './components/Recorder';

// const {width, height} = Dimensions.get('window');

// let accessKey = 'LpFNv0F7yhbTcfl+cccqpJQk70KTp5jlcziHSiZ6WOK6VSwKeZEs0g==';
// let modelPath = '/assets/voice/leopard_params.pv';

// const App = props => {
//   const [appState, setAppState] = useState('LOADING'); //  LOADING, INIT, RECORDING, PROCESSING, TRANSCRIBED, ERROR

//   const [errorMessage, setErrorMessage] = useState(null);

//   const [transcription, setTranscription] = useState('');

//   const [words, setWords] = useState([]);

//   const [recordSeconds, setRecordSeconds] = useState(0.0);

//   const [processSeconds, setProcessSeconds] = useState(0.0);

//   let _leopard = async () =>
//     await Leopard.create(accessKey, modelPath, {
//       enableAutomaticPunctuation: true,
//     });

//   let _voiceProcessor = VoiceProcessor.getVoiceProcessor(
//     512,
//     _leopard.sampleRate,
//   );

//   let _recorder = new Recorder();

//   let _bufferEmitter = new NativeEventEmitter(BufferEmitter);

//   let _recordInterval;

//   let _bufferListener = new BufferEmitter.addListener(
//     BufferEmitter.BUFFER_EMITTER_KEY,
//     async buffer => {
//       if (appState !== 'ERROR') {
//         try {
//           await _recorder.writeSamples(buffer);
//         } catch {
//           // handleError('');
//         }
//       }
//     },
//   );

//   let disabled =
//     appState === 'LOADING' || appState === 'ERROR' || appState === 'PROCESSING';

//   const _startProcessing = async () => {
//     setAppState('RECORDING');
//     setRecordSeconds(0);

//     let recordAudioRequest;

//     if (Platform.OS === 'android') {
//       recordAudioRequest = _requestRecordAndioPermission();
//     } else {
//       recordAudioRequest = new Promise(function (resolve, _) {
//         resolve(true);
//       });
//     }

//     recordAudioRequest.then(async hasPermission => {
//       if (!hasPermission) {
//         console.log('error at recAudioRequest, microphone was not found');
//         return;
//       }

//       try {
//         await _recorder.resetFile();
//         await _recorder.writeWavHeader();
//         await _voiceProcessor?.start();

//         _recordInterval = setInterval(() => {
//           if (recordSeconds < 120 - 0.1) {
//             setAppState(recordSeconds + 0.1);
//           } else {
//             _stopProcessing();
//           }
//         }, 100);
//       } catch (err) {
//         console.log(err);
//       }
//     });
//   };

//   const _stopProcessing = () => {
//     setAppState('PROCESSING');
//     // clearInterval(_recordInterval);

//     _voiceProcessor?.stop().then(async () => {
//       try {
//         const audioPath = await _recorder.finalize();
//         const start = Date.now();
//         const {transcript, word} = await _leopard.processFile(audioPath);
//         const end = Date.now();
//         setTranscription(transcript);
//         setWords(word);
//         setAppState('TRANSCRIBED');
//         setProcessSeconds((end - start) / 1000);
//       } catch (err) {
//         console.log(err);
//         // handleError(err)
//       }
//     });
//   };

//   const _toggleListening = async () => {
//     if (appState === 'RECORDING') {
//       _stopProcessing();
//     } else if (appState === 'INIT' || appState === 'TRANSCRIBED') {
//       _startProcessing();
//     }
//   };

//   const _requestRecordAndioPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         {
//           title: 'Microphone Permission',
//           message: 'Leopard needs access to your microphone to record audio',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.log('error at audio request');
//       return false;
//     }
//   };

//   useEffect(() => {
//     setAppState('INIT');
//     return () => {
//       appState === 'RECORDING'
//         ? _stopProcessing()
//         : _leopard !== undefined
//         ? () => {
//             _leopard.delete();
//             // _leopard = null;
//           }
//         : null;
//     };
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={styles.button}>
//           <Text>Start</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button}>
//           <Text>Stop</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: width,
//     height: height,
//     borderWidth: 1,
//     display: 'flex',
//     justifyContent: 'center',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   button: {
//     height: 65,
//     width: 140,
//     marginLeft: 10,
//     marginRight: 10,
//     borderWidth: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 12.5,
//   },
// });

// export default App;
