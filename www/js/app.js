// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])
.controller('mainCtrl', function($scope,$ionicPopup,$cordovaProgress,$cordovaToast,$cordovaVibration,$cordovaFileOpener2) {
  $scope.speed = 1;
  $scope.volumeVal = 100;
  $scope.audioFade = false;
  $scope.videoFade = false;
  $scope.videoDuration = 0;
  $scope.audioDuration = 0;
  $scope.VideofileStatus = true;
  $scope.AudiofileStatus = true;
  $scope.videoURI = "";
  $scope.audioURI = "";
  $scope.videoName = "Choose a Video File";
  $scope.audioName = "Choose an Audio File";
  // $scope.$apply();
  $scope.overlay = function(){
    console.log($scope.volumeVal+" "+$scope.speed+" "+1/$scope.speed+" "+$scope.videoFade+" "+$scope.audioFade);
    $cordovaToast.showLongBottom('This Feature is under development. Coming Soon!');
  }
  $scope.aboutUs = function(){
        window.open('https://github.com/RameshArvind/RoposoVideoEditor', '_blank');
  }
  $scope.createVideoDisable = function(){
    return $scope.VideofileStatus || $scope.AudiofileStatus;
  }
   // An alert dialog
   var alertPopup = $ionicPopup.alert({
     title: 'Welcome to Haute Video Editor!',
     template: '<div style="width: 240px;">Step 1: Choose a video file which you wish to process <br>Step 2: Choose an audio file to go along with the video<br>Step 3 : Choose optional video modification parameters<br>Step 4 : Hit \'Create Video\' and wait patiently for about 2-5 minutes<br>Step 5 : Share your new Video!!!</div>'
   });

   alertPopup.then(function(res) {
     $cordovaToast.showLongBottom('Let\'s get cracking on that new video');
   });
   $scope.openVideofile = function(){
    fileChooser.open(function(uri) {
      console.log("Debug - " + uri.replace("file://",""));
      $scope.videoURI = uri;
      function videoSuccess(info){
        $scope.VideofileStatus = false;
        $scope.videoName = "Current Video - "+uri.substring(uri.lastIndexOf("/")+1,uri.length);
        $scope.$apply();
        $scope.videoDuration = Math.round(info.duration);
        // $cordovaToast.showLongBottom("videoinfo" + JSON.stringify(info, null, 2));
        console.log($scope.videoName+$scope.videoDuration);
      }
      function videoError(err){
        $scope.VideofileStatus = true;
        $scope.videoDuration = 0;
        $scope.videoName = "Choose a Video File";
        $cordovaToast.showShortBottom("Error Choosing Video - "+err);
        $scope.$apply();
      }
      VideoEditor.getVideoInfo(videoSuccess,videoError,{fileUri: uri}); 
    });
  };


  $scope.openAudiofile = function(){
    fileChooser.open(function(uri) {
      $scope.audioURI = uri;
      $scope.AudiofileStatus = false;
      console.log("Debug - " + uri);
      $scope.audioName = "Current Audio - "+uri.substring(uri.lastIndexOf("/")+1,uri.length);
      $scope.$apply();
      // $cordovaToast.showShortBottom("audioInfo" + JSON.stringify(info, null, 2));
      // $cordovaToast.showShortBottom($scope.videoName);
      var mediasuccess = function(){
        // $cordovaToast.showLongBottom(" "+media.duration);
      }
      function mediaError(err){
        $scope.AudiofileStatus = true;
        $scope.audioName = "Choose an audio File";
        $cordovaToast.showShortBottom("Error Choosing Audio - "+ err);
        $scope.$apply();
      }
      var media = new Media($scope.audioURI.replace("file://",""),mediasuccess,mediaError,null);

      media.play();
      media.setVolume(0.0);
      var counter = 0;
      var timerDur = setInterval(function() {
        counter = counter + 100;
        if(counter > 2000) {clearInterval(timerDur);}
        var duration = media.getDuration();
        if(duration > 0) {
          media.stop();
          clearInterval(timerDur);
          $scope.audioDuration = Math.round(duration);
          console.log($scope.audioDuration + ' seconds');
        }
      }, 100);
      // media.play();
      // $cordovaToast.showLongBottom(" "+media.duration);

      
    });
};


$scope.confirmer = function(){
  $scope.progresspercent = 0;
  var confirmPopup = $ionicPopup.confirm({
   title: 'Creating Video',
   template: 'Are you sure you want create this video?'
 });

  confirmPopup.then(function(res) {
   if(res) {
    $cordovaProgress.showSimpleWithLabelDetail(true, "Creating Video","This might take a while..");
      // $cordovaProgress.hide();
      $scope.videoURI.replace("file://","");
      var duration = 0;

      function onVideoEditorProgress(info) {
        if (!duration) {
          var matches = (info) ? info.match(/Duration: (.*?), start:/) : [];
          if (matches && matches.length > 0) {
            var rawDuration = matches[1];
            // convert rawDuration from 00:00:00.00 to seconds.
            var ar = rawDuration.split(":").reverse();
            duration = parseFloat(ar[0]);
            if (ar[1]) duration += parseInt(ar[1]) * 60;
            if (ar[2]) duration += parseInt(ar[2]) * 60 * 60;  
          }
          return;
        }

    // get the time
    var matches = info.match(/time=(.*?) bitrate/g);

    if (matches && matches.length > 0) {
      var time = 0;
      var progress = 0;
      var rawTime = matches.pop();
      rawTime = rawTime.replace('time=', '').replace(' bitrate', '');

        // convert rawTime from 00:00:00.00 to seconds.
        var ar = rawTime.split(":").reverse();
        time = parseFloat(ar[0]);
        if (ar[1]) time += parseInt(ar[1]) * 60;
        if (ar[2]) time += parseInt(ar[2]) * 60 * 60;

        //calculate the progress
        progress = Math.round((time / duration) * 100);

        var progressObj = {
          duration: duration,
          current: time,
          progress: progress
        };

        console.log('progressObj: ' + JSON.stringify(progressObj, null, 2));
        // $cordovaProgress.showSimpleWithLabelDetail(true, "Creating Video",progress+"%");
        /* update your progress indicator here with above values ... */
      }
    }
    // outputfile = $scope.videoURI.substring(0,$scope.videoURI.lastIndexOf("/")+1).replace("file://","") + "outp34343ut.mp4";
    outputfile = cordova.file.externalRootDirectory.replace("file://","") + "output.mp4";
    // outputformat = $scope.videoURI.substring($scope.videoURI.lastIndexOf(".")+1,$scope.videoURI.length);
    // outputfile = outputfile + outputformat;
    console.log(outputfile);
    function ffmpegSuccess(result) {
      $cordovaProgress.hide();
      // $cordovaToast.showLongBottom('execFFMPEG success'+outputfile+" "+$scope.videoURI.replace("file://","")+"  "+result);
      function success(){
        $cordovaVibration.vibrate(1000);
        $cordovaToast.showLongBottom('Creation of Video Complete');
        console.log("Exists"+result);
        // VideoPlayer.play(outputfile);
        var confirmPlayPopup = $ionicPopup.confirm({
         title: 'Play Video',
         template: 'Would you like to play the created video?'
       });
        confirmPlayPopup.then(function(res){
          if(res){
            $cordovaFileOpener2.open(
              outputfile.replace("file://",""),
              'video/*'
              ).then(function() {
                console.log('Success');
              }, function(err) {
                console.log('An error occurred: ' + JSON.stringify(err));
              });
            }
          });

      }
      function fail(){
        $cordovaVibration.vibrate(1000);
        $cordovaToast.showShortBottom('Video Creation failed!');
        console.log("Doesnt"+result);
      }
      window.resolveLocalFileSystemURL("file://"+outputfile, success, fail);
    }

    function ffmpegError(err) {
      $cordovaVibration.vibrate(1000);
      $cordovaToast.showShortBottom('Video Creation failed ffmpegError, err: ' + err);
    }
    command = ['-y','-i',$scope.videoURI.replace("file://",""),'-i',$scope.audioURI.replace("file://","")];
    // ,'-vf','fade=in:0:d=3,fade=out:st='+($scope.videoDuration-3)+':d=3,setpts='+1/$scope.speed+'*PTS','-af','afade=t=in:ss=0:d=3,afade=t=out:st='+($scope.audioDuration-3)+':d=3,atempo='+$scope.speed+',volume='+($scope.volumeVal)/100,'-shortest',outputfile
    videoFilters = 'setpts='+1/$scope.speed+'*PTS';
    audioFilters = 'atempo='+$scope.speed;
    minDuration = ($scope.videoDuration<$scope.audioDuration)?$scope.videoDuration:$scope.audioDuration;
    if($scope.videoFade){
      videoFilters = 'fade=in:0:d=3,fade=out:st='+(minDuration-3)+':d=3,setpts='+1/$scope.speed+'*PTS';
    }
    command = command.concat(['-vf',videoFilters]);
    if($scope.audioFade){
      audioFilters = 'afade=t=in:ss=0:d=3,afade=t=out:st='+(minDuration-3)+':d=3,atempo='+$scope.speed;
    }
    console.log($scope.videoDuration*(1/$scope.speed)-3)
    command = command.concat(['-af',audioFilters,'-shortest',outputfile]);
    VideoEditor.execFFMPEG(
        ffmpegSuccess, // success cb
        ffmpegError, // error cb
        {
            // cmd: ['-y','-i',$scope.videoURI.replace("file://",""),'-i',$scope.audioURI.replace("file://",""),'-codec','copy','-shortest',outputfile],
            cmd: command,
            // cmd: ['-y','-i',$scope.videoURI.replace("file://",""),'-vf','fade=in:0:d=2,fade=out:st=17:d=3',outputfile],
            progress: onVideoEditorProgress // see example below
            // ffmpeg -i audio.mp3 -i video.avi output.mp4
            // ffmpeg -i slide.mp4 -y -vf fade=in:0:30 slide_fade_in.mp4
            // ffmpeg -i audio.mp3 -af 'afade=t=in:ss=0:d=3,afade=t=out:st=27:d=3' out.mp3
          }
          );
    // $cordovaToast.showShortBottom('You are sure');
  } else {
  }
});
};

})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
