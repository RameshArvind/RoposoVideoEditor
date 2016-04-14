// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])
.controller('mainCtrl', function($scope,$ionicPopup,$cordovaProgress,$cordovaToast,$cordovaVibration) {
  $scope.VideofileStatus = true;
  $scope.videoName = "Choose a Video File";
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
    $cordovaToast.showShortBottom("Debug - " + uri);
    function videoSuccess(info){
      $scope.VideofileStatus = false;
      $cordovaVibration.vibrate(1000);
      $scope.videoName = "Current Video - "+uri.substring(uri.lastIndexOf("/")+1,uri.length);
      $scope.$apply();
      $cordovaToast.showShortBottom("videoinfo" + JSON.stringify(info, null, 2));
      $cordovaToast.showShortBottom($scope.videoName);
    }
    function videoError(err){
      $scope.VideofileStatus = true;
      $scope.videoName = "Choose a Video File";
      $cordovaToast.showShortBottom("Error Choosing Video - "+err);
      $scope.$apply();
    }
    VideoEditor.getVideoInfo(videoSuccess,videoError,{fileUri: uri}); 
});
};


$scope.openAudiofile = function(){
    fileChooser.open(function(uri) {
    $scope.fileStatus = false;
    $cordovaToast.showShortBottom("Debug - " + uri);
    $scope.videoName = "Current Video - "+uri.substring(uri.lastIndexOf("/")+1,uri.length);
    $scope.$apply();
    $cordovaToast.showShortBottom("videoinfo" + JSON.stringify(info, null, 2));
    $cordovaToast.showShortBottom($scope.videoName);
    function videoSuccess(info){
      
      $cordovaVibration.vibrate(1000);
      $scope.videoName = "Current Video - "+uri.substring(uri.lastIndexOf("/")+1,uri.length);
      $scope.$apply();
      $cordovaToast.showShortBottom("videoinfo" + JSON.stringify(info, null, 2));
      $cordovaToast.showShortBottom($scope.videoName);
    }
    function videoError(err){
      $scope.videoName = "Choose a Video File";
      $cordovaToast.showShortBottom("Error Choosing Video - "+err);
      $scope.$apply();
    }
    VideoEditor.getVideoInfo(videoSuccess,videoError,{fileUri: uri}); 
});
  // var myPopup = $ionicPopup.show({
  //   // template: '<input type="password" ng-model="data.wifi"><br><input type="number">',
  //   title: 'Choose a Timestamp to fade in and out',
  //   subTitle: 'Timestamp format is MM:SS',
  //   scope: $scope,
  //   buttons: [
  //     { text: 'Exit' },
  //     { text: 'Record' },
  //     {
  //       text: '<b>File</b>',
  //       type: 'button-positive',
  //       onTap: function(e) {
  //         if (!$scope.data.wifi) {
  //           //don't allow the user to close unless he enters wifi password
  //           e.preventDefault();
  //         } else {
  //           return $scope.data.wifi;
  //         }
  //       }
  //     }
  //   ]
  // });
};


$scope.confirmer = function(){
   var confirmPopup = $ionicPopup.confirm({
     title: 'Creating Video',
     template: 'Are you sure you want create this video?'
   });

   confirmPopup.then(function(res) {
     if(res) {
      $cordovaProgress.showSimpleWithLabelDetail(true, "Creating Video","Adding Overlay to Video");
      $cordovaProgress.hide();
      $cordovaProgress.showSimpleWithLabelDetail(true, "Creating Video","Processing Video"); // .hide()  
      // $cordovaProgress.showSimple(true);
       $cordovaToast.showShortBottom('You are sure');
     } else {
      // $cordovaToast.showShortBottom("Video Has been created.")
       $cordovaToast.showShortBottom('You are not sure');
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
