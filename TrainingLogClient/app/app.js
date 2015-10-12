(function () {

    'use strict';
    var id = 'trainingLogApp';
    var trainingLogApp = angular.module('trainingLogApp', ['ngMaterial', 'ngMdIcons', 'ui.router', 'smart-table']);
    trainingLogApp.constant('VERSION', '0.1');

    trainingLogApp.config(function($stateProvider, $urlRouterProvider, $httpProvider, $provide) {

      $urlRouterProvider.otherwise('/viewLogEntries');
      $stateProvider
        .state('viewLogEntries', {
            url: '/viewLogEntries',
            templateUrl: 'partials/viewLogEntries/viewLogEntries.html',
            controller: 'ViewLogEntryCtrl'
        })
        .state('addLogEntry', {
            url: '/addLogEntry',
            templateUrl: 'partials/addLogEntry/addLogEntry.html',
            controller: 'AddLogEntryCtrl'
        })
        .state('editLogEntry', {
            url: '/editLogEntry',
            templateUrl: 'partials/editLogEntry/editLogEntry.html',
            controller: 'EditLogEntryCtrl'
        });
    });

    trainingLogApp.run(['$q', '$rootScope', function ($q, $rootScope) {

    }]);

    trainingLogApp.factory('TrainingLogService', ['$http', function ($http) {

      var urlBase = 'http://localhost:62293/api';
      var TrainingLogService = {};
      TrainingLogService.getAllTrainingLogs = function () {
          return $http.get(urlBase + '/LogEntries');
      };

      TrainingLogService.getTrainingLog = function (id) {
          return $http.get(urlBase + '/LogEntries/' + id);
      };

      TrainingLogService.deleteTrainingLog = function (id) {
          return $http.delete(urlBase + '/LogEntries/' + id);
      };

      TrainingLogService.addTrainingLog = function (trainingLogModelData) {
          return $http.post(urlBase + '/LogEntries/2', trainingLogModelData);
      };

      TrainingLogService.editTrainingLog = function (id, trainingLogModelData) {
          return $http.put(urlBase + '/LogEntries/' + id + '', trainingLogModelData);
      };

      return TrainingLogService;
    }]);

    trainingLogApp.controller('appCtrl', function ($scope, $mdDialog, $filter, TrainingLogService) {
      $scope.status = '';

      $scope.exerciseTypes = [
        {'id': 1, 'label': 'Standing'},
        {'id': 2, 'label': 'Striking'},
        {'id': 3, 'label': 'Turning'},
        {'id': 4, 'label': 'Changing'}
      ];

      var originatorEv;

      $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      };

      $scope.showDialog = function(ev, item) {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: ev,
          templateUrl: 'partials\\editLogEntry\\editLogEntry.html',
          clickOutsideToClose:true,
          locals: {
           itemToEdit:item,
           exerciseTypes:$scope.exerciseTypes
         },
         controller: DialogController
        });
      };

      $scope.getExerciseType = function(id) {
        for (var i = 0; i < $scope.exerciseTypes.length; i++) {
            if ($scope.exerciseTypes[i].id === id) {
              return $scope.exerciseTypes[i].label;
            }
        }
      };

      function getAllTrainingLogs() {
        TrainingLogService.getAllTrainingLogs().success(function (trainingLogs) {
          $scope.trainingLogs = formatTrainingLogData(trainingLogs);
        })
        .error(function (error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });
      }

      function formatTrainingLogData(trainingLogData) {
        for (var i = 0; i < trainingLogData.length; i++) {
          trainingLogData[i].Date = new Date($filter('date')(trainingLogData[i].Date, 'yyyy-MM-dd'));
        }
        return trainingLogData;
      }

      function DialogController($scope, $mdDialog, itemToEdit, exerciseTypes) {
        $scope.itemToEdit = itemToEdit;
        $scope.exerciseTypes = exerciseTypes;

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      }

      getAllTrainingLogs();
    });

    trainingLogApp.controller('ViewLogEntryCtrl', function ($scope, $window, TrainingLogService) {

      $scope.deleteTrainingLog = function(id) {
        TrainingLogService.deleteTrainingLog(id).success(function (trainingLog) {
          $window.location.reload();
          console.warn('Training log with id ' + id + ' was deleted');
        })
        .error(function (error) {
            $scope.status = 'Unable to delete training log';
        });
      };

    });

    trainingLogApp.controller('EditLogEntryCtrl', function ($scope, TrainingLogService) {

      $scope.editTrainingLog = function(id, trainingLogModelData) {
        TrainingLogService.editTrainingLog(id, trainingLogModelData).success(function (trainingLog) {
          console.warn('Training log successfully edited');
        })
        .error(function (error) {
          $scope.status = 'Unable to edit training log';
        });
      };

    });

    trainingLogApp.controller('AddLogEntryCtrl', function ($scope, TrainingLogService) {

       $scope.addTrainingLog = function (trainingLogModelData) {
         console.warn(trainingLogModelData);
         TrainingLogService.addTrainingLog(trainingLogModelData).success(function (trainingLog) {
              console.warn('Training log successfully added');
          })
          .error(function (error) {
              $scope.status = 'Unable to add training log';
           });
         };
    });

}());
