import detect from "bpm-detective";

const RECORDING_TIME = 15000;

const MAX_AUDIO_PARTS = 15; // Количество хранящихся частей
const PART_LENGTH_MS = 1000; // Длина записываемой части
const MIN_REPEATING_VALUES = 5; // Необходимо, чтобы одно и то же значение было N раз, для того, чтобы bpm отправился слушателю

export class BPMRecognizer{

    _firstBlob; // первый кусок записи. хранит необходимые "флаги" поэтому всегда будет участвовать
    _blobs = []; // записи звука
    _gettingDataIntervalId; // id таймера, запрашивающего данные у _recorder
    _bpmValues = []; // Несколько последних значений
    _lastEventvalue; // Последнее значение, которое попало в event
    _inited = false;

    onBPM = () => {};
    onNoBPM = () => {};

    constructor(){
    }

    async init(){
        this._stream = await navigator.mediaDevices.getUserMedia({ audio: true});
        this._audioContext = new AudioContext();
        this._recorder = new MediaRecorder(this._stream);
        this._recorder.addEventListener("dataavailable",::this._onRecorderData);
        this._inited = true;
    }

    async _onRecorderData({data}){
        if (this._firstBlob == null) {
            this._firstBlob = data;
            return;
        }
        if (this._blobs.length >= MAX_AUDIO_PARTS) this._blobs.shift();
        this._blobs.push(data);
        const fullBlob = new Blob([this._firstBlob,...this._blobs], {type: "video/webm"});
        const audioBuffer = await this._convertBlobToAudio(fullBlob);
        this._recognizeBPM(audioBuffer);
        this._checkBpmValues();
    }

    get isStarted(){
        return Boolean(this._gettingDataIntervalId);
    }

    get isInited(){
        return this._inited
    }

    start(){
        if (!this._inited) return false;
        if (this.isStarted) return;
        this._recorder.start();
        this._gettingDataIntervalId = setInterval(async () => {
            this._recorder.requestData();
        }, PART_LENGTH_MS);
    }

    stop(){
        if (!this.isStarted) return;
        this._recorder.stop();
        clearInterval(this._gettingDataIntervalId);
        this._gettingDataIntervalId = null;
        // this._firstBlob = null;
        this._blobs = [];
    }

    async _convertBlobToAudio(blob){
        let fileReader = new FileReader();
        return new Promise((resolve) => {
            fileReader.onloadend = () => {
                resolve(fileReader.result)
            };
            fileReader.readAsArrayBuffer(blob);
        })
        .then(buffer => {
            return new Promise((resolve, reject) => {
                this._audioContext.decodeAudioData(buffer, resolve, reject);
            });
        })
    }

    _recognizeBPM(audioBuffer){
        let bpm;
        try {
            bpm = detect(audioBuffer)
        } catch (e) {
            bpm = null;
        }
        if (this._bpmValues.length >= MIN_REPEATING_VALUES) this._bpmValues.shift();
        this._bpmValues.push(bpm);
    }

    _checkBpmValues(){
        const value = this._bpmValues[0];
        const sameValuesCount = this._bpmValues.filter(x => x == value).length;
        if (sameValuesCount < MIN_REPEATING_VALUES) return;
        if (value === this._lastEventvalue) return;
        this._lastEventvalue = value;
        if (value == null) this.onNoBPM();
        else this.onBPM(value);
    }
}
