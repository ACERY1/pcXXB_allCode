<template>
	<div class="">

		<!--test function-->
		<video :src="src" id="localVideo" autoplay></video>
	</div>
</template>

<script>
	export default {
		name: "",
		components: {},
		data () {
			return {
				src: '',
				recorder: null,
				blobs: []
			}
		},
		props: {},
		computed: {},
		created () {
		},
		mounted () {
			let self = this
			this.$desktopCapturer.getSources({types: ['window', 'screen']}, function (error, sources) {
				if (error) throw error;
//				console.log(sources)
//						console.log(sources[i].name == "Electron")

				for (var i = 0; i < sources.length; ++i) {
					if (sources[i].name == "学习宝") {
						navigator.mediaDevices.getUserMedia({
							audio: false,
							video: {
								mandatory: {
									chromeMediaSource: 'desktop',
									chromeMediaSourceId: sources[i].id,
									minWidth: 1280,
									maxWidth: 1280,
									minHeight: 720,
									maxHeight: 720
								}
							}
						}).then((stream) => {
//				  document.getElementById('localVideo').srcObject = stream
//					document.getElementById('localVideo').src = URL.createObjectURL(stream)
							self.recording(stream)
							setTimeout(() => {
								self.stopRecord()
							}, 3000)
						}).catch((err) => {
							console.log(err)
						});
						console.log(sources[i].id)

					}
				}
			});
		},
		methods: {
			gotStream(stream) {
				document.getElementById('localVideo').srcObject = stream

			},
			getUserMediaError(error){
				console.log(error)
			},
			recording(stream){
				let self = this
				this.recorder = new MediaRecorder(stream);
				console.log('starting')
				this.recorder.ondataavailable = function (event) {
					console.log(event.data)
					self.blobs.push(event.data);
//					self.blobs = event.data
					self.toArrayBuffer(new Blob(self.blobs, {type: 'video/webm'}), function (ab) {
//					self.toArrayBuffer(event.data, function (ab) {
						let buffer = self.toBuffer(ab);
						let file = `./example.webm`;
						self.$fs.writeFile(file, buffer, function (err) {
							if (err) {
								console.error('Failed to save video ' + err);
							} else {
								console.log('Saved video: ' + file);
								let proc = new self.$ffmpeg({source: file})
							  proc.save('test.mp4')
							  console.log(proc)
//								console.log(cmd)
//							  cmd.save('./example.mp4')
//								self.$ffmpeg(file).output('./example.mp4')
							}
						});
					})
					console.log(event.data)
				};
//				console.log(this.recorder)
				this.recorder.start();
			},
			stopRecord(){
				let self = this
				this.recorder.stop();
//				console.log(self.blobs)


			},
			toArrayBuffer(blob, cb) {
				let fileReader = new FileReader();
				fileReader.onload = function () {
					let arrayBuffer = this.result;
					console.log(arrayBuffer)
					cb(arrayBuffer);
				};
		  /*读取blol对象里的数据*/
				fileReader.readAsArrayBuffer(blob);
			},
			toBuffer(ab) {
				let buffer = new Buffer(ab.byteLength);
				let arr = new Uint8Array(ab);
				for (let i = 0; i < arr.byteLength; i++) {
					buffer[i] = arr[i];
				}
				return buffer;
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
