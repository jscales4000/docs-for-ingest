/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
(function() {
  'use strict';

  angular.module('helium', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'ngSanitize',
  ]);
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/*
 * Time-group-roller directive.
 *
 */
(function () {
    'use strict';

    angular
        .module('helium')
        .component('hlmTimeGroupRoller', {
            templateUrl: 'views/components/time-group-roller.html',
            controller: 'TimeRollerGroupCtrl',
            transclude: true,
            bindings: {
                formatTime: '<',
                hoursFormat: '<',
                minutesFormat: '<',
                ampmFormat: '<',
                langArabic: '<',
                startDate: '<',
                endDate: '<',
                step: '<',
                label: '=',
                data: '<',
                value: '=',
                hoursRange: '<',
                minutesRange: '<',
                ampmRange: '<',
                isSelected: '<'
            }
        });
})();

/*
 * Time-group-roller directive controller.
 *
 */
(function () {
    'use strict';

    angular
        .module('helium')
        .controller('TimeRollerGroupCtrl', TimeRollerGroupCtrl);

    TimeRollerGroupCtrl.$inject = [];

    function TimeRollerGroupCtrl() {
        var ctrl = this,
            old = {
                value: null,
                hour: null
            };

        function addMinutesToDate(date, mins) {
            return new Date(date.getTime() + mins * 60000);
        }

        function getCustomHours(startHour, endHour) {
            var generateHours = function () {
                    var ret = [],
                        hour = new Date(startHour);

                    while (hour < endHour) {
                        hour.setMinutes(0);
                        hour.setSeconds(0);
                        hour.setMilliseconds(0);
                        ret.push(hour);
                        hour = addMinutesToDate(hour, 60);
                    }
                    if (!ret.length || (endHour.getHours() !== ret[ret.length - 1].getHours())) {
                        ret.push(endHour);
                    }

                    return ret;
                },
                hours = generateHours();

            return {
                options: hours,
                value: hours[0]
            };
        }

        function getCustomMinutes(startMin, endMin) {
            var generateMinutes = function () {
                    var ret = [],
                        minute = startMin;
                    if (endMin.getHours() === 0) { //nextday
                        endMin = new Date(endMin);
                        endMin.setMinutes(0);
                    } else if (startMin.getHours() < endMin.getHours()) {
                        endMin = new Date(startMin);
                        endMin.setMinutes(59);
                    }
                    while (minute < endMin) {
                        ret.push(minute);
                        minute = addMinutesToDate(minute, 1);
                    }
                    if (!ret.length || (endMin.getMinutes() !== ret[ret.length - 1].getMinutes())) {
                        ret.push(endMin);
                    }

                    return ret;
                },
                mins = generateMinutes();

            return {
                options: mins,
                value: mins[0]
            };
        }

        function getCustomAmpm(startDate, endDate) {
            var startHour = startDate.getHours(),
                endHour = endDate.getDay() !== startDate.getDay() ? 24 : startDate.getHours();

            if (startHour < 12 && endHour < 12) {
                return {
                    options: [startDate],
                    value: startDate
                };
            }
            if (startHour < 12 && endHour >= 12) {
                return {
                    options: [startDate, endDate],
                    value: startDate
                };
            }
            if (startHour >= 12 && endHour >= 12) {
                if (endHour < 24) {
                    return {
                        options: [endDate],
                        value: endDate
                    };
                } else {
                    return {
                        options: [startDate],
                        value: startDate
                    };
                }
            }
        }

        function setCustomHour(startDate, endDate) {
            ctrl.hoursRange = getCustomHours(startDate, endDate);
        }

        function setCustomMinute(startDate, endDate) {
            ctrl.minutesRange = getCustomMinutes(startDate, endDate);
        }

        function setCustomAmpm(startDate, endDate) {
            if (ctrl.ampmFormat)
                ctrl.ampmRange = getCustomAmpm(startDate, endDate);
        }

        function setCustomTime() {
            if (!ctrl.startDate || !ctrl.endDate) return;
            ctrl.ampmFormat = ctrl.ampmFormat || false;
            setCustomHour(ctrl.startDate, ctrl.endDate);
            setCustomMinute(ctrl.startDate, ctrl.endDate);
            setCustomAmpm(ctrl.startDate, ctrl.endDate);
        }

        ctrl.$onInit = function () {
            if (!ctrl.data || !ctrl.data.options) {
                setCustomTime();
            }
        };

        ctrl.$onChanges = function (changes) {
            if (!ctrl.data || !ctrl.data.options) {
                if (changes.startDate || changes.endDate) {
                    setCustomTime();
                }
            }
        };

        ctrl.$doCheck = function () {
            if (!ctrl.data || !ctrl.data.options) {
                if (ctrl.hoursRange && ctrl.minutesRange) {
                    var value = new Date(),
                        dayNow = value.getDate(),
                        hoursRangeValue = new Date(ctrl.hoursRange.value);

                    value.setDate(hoursRangeValue.getDate());
                    value.setHours(hoursRangeValue.getHours());
                    value.setMinutes(dayNow !== hoursRangeValue.getDate() ? 0 : new Date(ctrl.minutesRange.value).getMinutes());
                    value.setSeconds(0);
                    value.setMilliseconds(0);
                    if (value.getTime() && (!old.value || old.value.getTime() !== value.getTime())) {
                        ctrl.value = old.value = value;
                    }
                    if (hoursRangeValue.getTime() && (!old.hour || hoursRangeValue.getTime() !== old.hour.getTime())) {
                        old.hour = hoursRangeValue;
                        if (ctrl.startDate) {
                            setCustomMinute(new Date(Math.max(hoursRangeValue.getTime(), ctrl.startDate.getTime())), ctrl.endDate);
                            setCustomAmpm(new Date(Math.max(hoursRangeValue.getTime(), ctrl.startDate.getTime())), ctrl.endDate);
                        }
                    }
                    if (hoursRangeValue.getTime() && (!old.hour || hoursRangeValue.getTime() !== old.hour.getTime())) {
                        old.hour = hoursRangeValue;
                        if (ctrl.startDate) {
                            setCustomMinute(new Date(Math.max(hoursRangeValue.getTime(), ctrl.startDate.getTime())), ctrl.endDate);
                            setCustomAmpm(new Date(Math.max(hoursRangeValue.getTime(), ctrl.startDate.getTime())), ctrl.endDate);
                        }
                    }
                }
            } else {
                if (ctrl.data.value && (!old.value || old.value.getTime() !== ctrl.data.value.getTime())) {
                    ctrl.value = old.value = ctrl.data.value;
                }
            }
        };
    }
}());;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

/*
 * Timeline component.
 *
 */

(function() {
  'use strict';

  angular.module('helium').component('hlmTimeline', {
    templateUrl: function() {
      //TODO Add arguments ( $element, $attrs ) if needed
      return 'views/components/timeline.html';
    },
    controller: 'TimelineCtrl',
    transclude: true,
    bindings: {
      timelinePlacement: '@',
      // timelineViewport sets the width or height of the timeline, based on the layout. Defaults to full width or height of panel
      timelineViewport: '@',
      // timelineBlockSize sets the width of each hour in the timeline
      timelineBlockSize: '@',
      timelineBlockHorizontalSize: '@',
      timelineBlockVerticalSize: '@',
      timelineNrHours: '@',
      timelineStartHour: '@',
      timelineMinutesScale: '@',
      timelineEvents: '<',
      timelineDisableInteraction: '<',
      timelinePauseAutoScroll: '<',

      timelineOpenNewEvent: '&',
      timelineOpenEvent: '&',

      timelineDisableClick: '<',
      timelineDisableDetailsClick: '<',
      timelineDisableAutoScroll: '<',

      timelineDialog: '@',
      timelineLabelTop: '@',
      timelineLabelRight: '@',
      timelineArabic: '@',
      timelineDateHourMarker: '<',
      timelineDateHourFormat: '<',
      timelineDateTimeFormat: '<',

      timelineIntervalAutoScroll: '@',

      timelineEvent: '<',
      timelineEventTitle: '<',
      timelineLabelNoon: '<',

      timelineNextMeetingCheckedIn: '<'
    },
  });
})();

/**
 * Timeline components controller
 *
 * Business login for the timeline
 */
(function() {
  'use strict';

  angular.module('helium').controller('TimelineCtrl', TimelineCtrl);

  TimelineCtrl.$inject = ['$rootScope', '$scope', '$interval', 'SmoothScrollService'];

  function TimelineCtrl($rootScope, $scope, $interval, SmoothScrollService) {
    var ctrl = this,
      timelineDefault = {
        blockHorizontalSize: 322,
        blockVerticalSize: 113,
        dialogWidthPercent: 0.43,
        dialogBlockPercent: 3.5,
        nrHours: 24,
        lastHour: 24,
        startHour: 0,
        scale: 2,
        placement: 'horizontal',
        disableClick: false,
        disableDetailsClick: false,
        disableAutoScroll: false,
        pauseAutoScroll: false,
        labelTop: true,
        labelRight: true,
        verticalVisibleBlocks: 6,
        horizontalVisibleBlocks: 10,
        dateHourFormat: 'h',
        dateHourMarker: 'a',
        dateTimeFormat: 'h:mm a',
        intervalScrollToNow: 1000 * 60,
        intervalScrollToCurrentHour: 1000 * 60 * 60,
        intervalAutoScroll: 1000 * 10,
        //
      },
      smoothScrollCfg = {
        stopScrolling: false,
      },
      timelineTouchListenersAdded = false,
      fingerDown = false,
      timeoutAutoScrollToCurrentHour,
      intervalCurrentMinute,
      timeoutCurrentMinute,
      timelineElement;

    SmoothScrollService.setConfig(smoothScrollCfg);

    /**
     * Remove auto scroll event from tineline.
     * @function TimelineController#removeAutoScrollEvents
     */
    function removeAutoScrollEvents() {
      if (timelineElement) {
        timelineElement.removeEventListener('touchstart', touchStartHandler, { passive: true });
        timelineElement.removeEventListener('touchend', touchEndHandler, { passive: false });
      }

      timelineTouchListenersAdded = false;

      clearTimeout(timeoutAutoScrollToCurrentHour);
    }

    /**
     * Add auto scroll event to tineline.
     * @function TimelineController#addAutoScrollEvents
     */
    function addAutoScrollEvents() {
      if (timelineElement && timelineTouchListenersAdded === false) {
        timelineTouchListenersAdded = true;
        timelineElement.addEventListener('touchstart', touchStartHandler, { passive: true });
        timelineElement.addEventListener('touchend', touchEndHandler, { passive: false });
      }
    }

    /**
     * Handle Touch Start Event on timeline.
     * @function TimelineController#touchStartHandler
     */
    function touchStartHandler(event) {
      //Only handle single touch events
      if (event.touches.length > 1) {
        return;
      }

      fingerDown = true;
      smoothScrollCfg.stopScrolling = true;

      if (!ctrl.disableAutoScroll && !ctrl.pauseAutoScroll) {
        deactivateAutoScroll();
        return;
      }
    }

    /**
     * Handle Touch End Event on timeline.
     * @function TimelineController#touchEndHandler
     */
    function touchEndHandler(event) {
      if (event.touches.length > 0) {
        return;
      }

      fingerDown = false;
      smoothScrollCfg.stopScrolling = false;

      if (!ctrl.disableAutoScroll && !ctrl.pauseAutoScroll) {
        activateAutoScroll();
        return;
      }
    }

    /**
     * Start/reset auto-scroll timeout. Call when user is finished interacting with timeline.
     * @function TimelineController#activateAutoScroll
     * @param {object} event - The event.
     */
    function activateAutoScroll() {
      if (ctrl.disableAutoScroll || ctrl.pauseAutoScroll || fingerDown) {
        return;
      }

      var milliseconds = ctrl.intervalAutoScroll;

      clearTimeout(timeoutAutoScrollToCurrentHour);

      timeoutAutoScrollToCurrentHour = setTimeout(function() {
        if (fingerDown) {
          //Do not allow the list to auto-scroll while it is being pressed
          activateAutoScroll(); //to reset the timeout
          return;
        }

        if (timelineElement !== null && timelineElement !== undefined) {
          scrollToCurrentPosition(timelineElement);
        } else {
          setPositionCurrentTime();
        }
      }, milliseconds);
    }

    /**
     * Clear auto-scroll timeout. Call when user is interacting with timeline.
     * @function TimelineController#deactivateAutoScroll.
     */
    function deactivateAutoScroll() {
      clearTimeout(timeoutAutoScrollToCurrentHour);
    }

    /**
     * Scroll timeline to current time position.
     * @function TimelineController#scrollToCurrentPosition.
     * @param {object} element - The timeline element.
     */
    function scrollToCurrentPosition(element) {
      var position = getHourPositionCurrentTime();

      if (ctrl.placement === 'vertical' || ctrl.placement === 'portrait') {
        SmoothScrollService.scroll(element, position, 2000, 'vertical');
      } else {
        SmoothScrollService.scroll(element, position, 2000);
      }
    }

    /**
     * Returns an object with the hours and minutes based on the position given.
     * @function TimelineController#getTimeByPosition.
     * @param {number} position - The position.
     * @returns {Object} The hours and the minutes calculated based on the position.
     */
    function getTimeByPosition(position) {
      var hours, minutes;

      if (position && !isNaN(position)) {
        hours = Math.floor(position / ctrl.blockSize) + ctrl.startHour;
        minutes = Math.floor(((position % ctrl.blockSize) * 60) / ctrl.blockSize);
      }

      return {
        hours: hours,
        minutes: minutes,
      };
    }

    /**
     * Returns a position based on current time.
     * @function TimelineController#getHourPositionCurrentTime.
     * @returns {number} The position based on the current time.
     */
    function getHourPositionCurrentTime() {
      var currentTime = getTimeByPosition(ctrl.currentTimePosition),
        position,
        result;

      currentTime.minutes = 0;
      position = getPositionByTime(currentTime);

      if (!isNaN(position)) {
        if (ctrl.isArabic) {
          position = ctrl.timelineSize - position - ctrl.timelineViewport;
        }
        result = !isNaN(position) ? position : 0;
      } else {
        result = 0;
      }

      return result;
    }

    /**
     * Returns a position based on time given.
     * @function TimelineController#getPositionByTime.
     * @param {object} time - An object with the hours and minutes.
     * @returns {number} The position based on the time given.
     */
    function getPositionByTime(time) {
      var position;

      if (time && !isNaN(time.hours) && !isNaN(time.minutes)) {
        position = ctrl.blockSize * (time.hours - ctrl.startHour);
        position += (ctrl.blockSize / 60) * time.minutes;
      }

      return position;
    }

    /**
     * Calculate the offset of the element relative to window.
     * @function TimelineController#offsetXY.
     * @param {object} element - An element.
     * @returns {object} The offset left and top of the element given.
     */
    function offsetXY(element) {
      var el = element,
        left = 0,
        top = 0;

      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        left += el.offsetLeft - el.scrollLeft;
        top += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
      }

      return {
        left: left,
        top: top,
      };
    }

    /**
     * Limit the nr of hours with available ones.
     * @function TimelineController#adjustNrHours.
     */
    function adjustNrHours() {
      var availableNrOfHours = timelineDefault.lastHour - ctrl.startHour;

      if (availableNrOfHours < ctrl.nrHours) {
        ctrl.nrHours = availableNrOfHours;
      }
    }

    /**
     * Checking if now is between given dates.
     * @function TimelineController#isNowBetweenDates.
     * @param {Datetime} startDate - start event.
     * @param {Datetime} endDate - end event.
     */
    function isNowBetweenDates(startDate, endDate) {
      var now = new Date();

      return startDate < now && now <= endDate;
    }

    /**
     * Checking if now is between given dates.
     * @function TimelineController#isNowAfterDate.
     * @param {Datetime} date - date.
     */
    function isNowAfterDate(date) {
      var now = new Date();

      return date < now;
    }

    /**
     * Sets the position and the size of the timeline events.
     * If there is an event, the size and the position will be set for this event.
     * @function TimelineController#setSizeAndPositionForEachEvent.
     */
    function setSizeAndPositionForEachEvent() {
      ctrl.timelineEvents = ctrl.timelineEvents || [];

      angular.forEach(ctrl.timelineEvents, function(event) {
        var sizeAndPosition = getSizeAndPositionForEvent(event);

        event.finished = isNowAfterDate(event.dtEnd) ? true : false;
        event.active = isNowBetweenDates(event.dtStart, event.dtEnd) ? true : false;
        event.startPosition = sizeAndPosition.startPosition;
        event.size = sizeAndPosition.size;
      });

      if (ctrl.timelineEvent) {
        var event = ctrl.timelineEvent;
        var evSizePos = getSizeAndPositionForEvent(event);

        event.startPosition = evSizePos.startPosition;
        event.size = evSizePos.size;
      }
    }

    /**
     * Return object time with hours/ minutes and seconds left between dow dates given.
     * @function TimelineController#getTimeLeftBetweenDates.
     * @param {String} date1 - Format '2017-01-10T09:00:00Z
     * @param {String} date2 - Format '2017-01-10T09:00:00Z
     */
    function getTimeLeftBetweenDates(date1, date2) {
      var diff = Math.abs(date1 - date2) / 1000,
        hours,
        minutes;
      // seconds;

      hours = Math.floor(diff / 3600);
      diff -= hours * 3600;

      minutes = Math.floor(diff / 60) % 60;
      diff -= minutes * 60;

      // seconds = diff % 60;

      return {
        hours: hours,
        minutes: minutes,
        // seconds: seconds,
      };
    }

    /**
     * Returns the position and the size of the timeline event.
     * @function TimelineController#getSizeAndPositionForEvent.
     * @param {object} event - The event.
     * @returns {object} The position and the size of event.
     */
    function getSizeAndPositionForEvent(event) {
      var dtStart = event.dtStart;
      var dtEnd = event.dtEnd;
      var timeStart = {
        hours: dtStart.getHours(),
        minutes: dtStart.getMinutes(),
      };
      var timeBetweenDates = getTimeLeftBetweenDates(dtEnd, dtStart);
      var ret = {
        startPosition: getPositionByTime(timeStart),
        size: getPositionByTime(timeBetweenDates),
      };

      return ret;
    }

    /**
     * Set interval for position of current time.
     * @function TimelineController#setIntervalPositionCurrentTime.
     */
    function setIntervalPositionCurrentTime() {
      timeoutCurrentMinute = setTimeout(function() {
        setPositionCurrentTime();

        intervalCurrentMinute = $interval(function() {
          setPositionCurrentTime();
        }, timelineDefault.intervalScrollToNow);
      }, 60020 - (new Date().getTime() % 60000));
    }

    /**
     * Set the position of current time indicator, and scrolls the timeline to .
     * @function TimelineController#setPositionCurrentTime.
     */
    function setPositionCurrentTime() {
      var now = new Date(),
        time = {
          hours: now.getHours(),
          minutes: now.getMinutes(),
        };

      ctrl.now = now;

      // This sets the current time indicator position with the ctrl.currentTimePosition binding
      ctrl.currentTimePosition = getPositionByTime(time);

      if (timelineElement && (!ctrl.disableAutoScroll && !ctrl.pauseAutoScroll && !fingerDown)) {
        scrollToCurrentPosition(timelineElement);
      }
    }

    /**
     * Generate list of hours for timeline.
     * @function TimelineController#generateHours.
     * @param {object} nr - Number of hours.
     * @param {object} start - The starting point of hours array.
     * @returns {array} The timeline array.
     */
    function generateHours(nr, start) {
      var timeArray = [],
        i = start,
        customEnd = nr + start,
        end = customEnd > timelineDefault.lastHour ? timelineDefault.lastHour : customEnd,
        today,
        sub1Start,
        sub2Start;

      for (i; i < end; i++) {
        today = new Date();
        today.setHours(i);
        today.setMinutes(0);
        today.setSeconds(0);

        sub1Start = new Date();
        sub1Start.setHours(i);
        sub1Start.setMinutes(0);
        sub1Start.setSeconds(0);

        sub2Start = new Date();
        sub2Start.setHours(i);
        sub2Start.setMinutes(30);
        sub2Start.setSeconds(0);

        var hourObj = {
          date: today,
          subHours: [
            {
              start: sub1Start,
            },
            {
              start: sub2Start,
            },
          ],
        };

        timeArray.push(hourObj);
      }

      return timeArray;
    }

    /**
     * Set jumpScrollToPosition property.
     * If there is an event the scroll position will be the event position
     * or it will be the position of current time hour.
     * @function TimelineController#jumpScrollToPosition.
     */
    function jumpScrollToPosition() {
      var position, eventDetails;

      if (ctrl.timelineEvent) {
        eventDetails = getSizeAndPositionForEvent(ctrl.timelineEvent);
        position = eventDetails.startPosition;
      } else {
        position = getHourPositionCurrentTime();
      }

      ctrl.jumpScrollToPosition = position;
    }

    /**
     * Set setLabelPosition property.
     * @function TimelineController#setLabelPosition.
     */
    function setLabelPosition() {
      if (ctrl.placement === 'vertical' || ctrl.placement === 'portrait') {
        ctrl.labelTop =
          ctrl.timelineLabelRight && ctrl.timelineLabelRight === 'true'
            ? false
            : timelineDefault.labelTop;
      } else {
        ctrl.labelTop =
          ctrl.timelineLabelTop && ctrl.timelineLabelTop === 'false'
            ? false
            : timelineDefault.labelTop;
      }
    }

    function setSizeVisibleTimeline(timeline) {
      if (timeline) {
        if (ctrl.placement === 'vertical' || ctrl.placement === 'portrait') {
          timeline.style.setProperty('height', ctrl.timelineViewport + 'px');
        } else {
          timeline.style.setProperty('width', ctrl.timelineViewport + 'px');
        }
      }
    }

    function setTimelineViewport() {
      if (ctrl.placement === 'portrait') {
        ctrl.timelineViewport = window.innerHeight * 0.375;
      } else if (ctrl.placement === 'vertical') {
        ctrl.timelineViewport = ctrl.timelineViewport
          ? parseInt(ctrl.timelineViewport)
          : window.innerHeight;
      } else {
        ctrl.timelineViewport = ctrl.timelineViewport
          ? parseInt(ctrl.timelineViewport)
          : window.innerWidth;
      }
    }

    function setStaticEvents() {
      var cloneEvents = ctrl.timelineEvents;

      angular.forEach(ctrl.timelineEvents, function(event) {
        event.selected = false;
      });

      ctrl.timelineEvents = [];
      angular.extend(ctrl.timelineEvents, cloneEvents);
    }

    function disableInteractionTimeline() {
      ctrl.disableClick = true;
      ctrl.disableDetailsClick = true;
      ctrl.disableAutoScroll = true;
      ctrl.centerEvent = true;
      setStaticEvents();
      $interval.cancel(intervalCurrentMinute);
    }

    function isString(param) {
      return typeof param === 'string' || param instanceof String;
    }

    /**
     * Calculate style height/width/position for event block
     * @function TimelineController#getStyle.
     * @param {object} event - The event.
     * @returns {string} The style of an event.
     */
    ctrl.getStyle = function(event) {
      var sizeAndPosition = getSizeAndPositionForEvent(event);
      var ret = {};

      if (ctrl.placement === 'vertical' || ctrl.placement === 'portrait') {
        ret = { height: sizeAndPosition.size + 'px', top: sizeAndPosition.startPosition + 'px' };
      } else {
        ret = { width: sizeAndPosition.size + 'px', left: sizeAndPosition.startPosition + 'px' };
      }

      return ret;
    };

    ctrl.isEventActive = function(event) {
      var isActive = false;

      if (!ctrl.timelineDisableInteraction) {
        if (isNowBetweenDates(event.dtStart, event.dtEnd)) {
          isActive = true;
        }
      }

      return isActive;
    };

    ctrl.isEventFinished = function(event) {
      var isFinished = false;

      if (!ctrl.timelineDisableInteraction) {
        if (isNowAfterDate(event.dtEnd)) {
          isFinished = true;
        }
      }

      return isFinished;
    };

    ctrl.isEventSelected = function(event) {
      var isSelected = false;

      if (ctrl.timelineDisableInteraction && event.selected) {
        isSelected = true;
      }

      return isSelected;
    };

    ctrl.isRoomReserved = function() {
      return $rootScope.Helium.values.mainRoom.currentEvent !== null;
    };

    function getTimelineHourResolution() {
      var oneHourInMinutes = 60;
      var scale = ctrl.scale;
      var resolution = scale; //Old default
      var minDurationProperty;

      if ($rootScope.Helium.settings && $rootScope.Helium.settings.reservation && $rootScope.Helium.settings.reservation.reserveNowMinDur) {
        minDurationProperty = $rootScope.Helium.settings.reservation.reserveNowMinDur;
        if (minDurationProperty > 60) minDurationProperty = 60;
        else if (minDurationProperty < 5) minDurationProperty = 5;
      } else {
        minDurationProperty = 15; //Default if not found
      }

      resolution = oneHourInMinutes / minDurationProperty;

      return resolution;
    }

    ctrl.isSubBlockFinished = function(hour, n) {
      var currentPosition = ctrl.currentTimePosition;
      var currentTime = getTimeByPosition(currentPosition);
      var scale = getTimelineHourResolution();
      var oneHourInMinutes = 60;
      var subBlockMinutes = oneHourInMinutes / scale;
      var currentSubBlockTime = {
        hours: hour.subHours[n].start.getHours(),
        minutes: hour.subHours[n].start.getMinutes(),
      };

      //Return an array that contains only meetings that begin in the future.
      var filterOutPastMeetings = function (item) {
        if (item.dtStart.getHours() > currentTime.hours || (item.dtStart.getHours() === currentTime.hours && item.dtStart.getMinutes() > currentTime.minutes)) {
          return true;
        } else {
          return false;
        }
      };

      if (currentTime.hours > currentSubBlockTime.hours) {
        //The whole 1 hour time block is in the past. Disable press
        return true;
      } else if (currentTime.hours === currentSubBlockTime.hours && currentSubBlockTime.minutes === 0) {
        //Currently within the 1 hour time block, and checking the first 30 minute sub-block, make sure it has not expired
        if (currentTime.minutes >= 30) {
          return true;
        }
      }

      if ($rootScope.Helium.settings.reservation.reserveNowEvenEndTime) {
        var events = $rootScope.Helium.values.mainRoom.events;
        if (events !== undefined) {

          var futureEvents = events.filter(filterOutPastMeetings);

          var i = 0;
          for (i = 0; i < futureEvents.length; i++) {
            var event = futureEvents[i];
            if (event.dtStart.getHours() === currentSubBlockTime.hours && event.dtStart.getMinutes() > currentSubBlockTime.minutes) {
              //There is another meeting starting within the 30 minute block. Check to see if block must be disabled, based on Even End Time rule
              if (event.dtStart.getMinutes() - currentSubBlockTime.minutes < subBlockMinutes) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }

      return false;
    };

    /**
     * On Click block calculate time and call callback parent function.
     * @function TimelineController#onClickBlock.
     * @param {object} eventData - The click event data that is required.
     */
    ctrl.onClickBlock = function(eventData) {
      if (ctrl.disableClick) {
        return;
      }

      var elPageX = eventData.pageX,
        elPageY = eventData.pageY,
        timeline = eventData.currentTarget.parentElement, //Should return "timeline__content", the scrolling portion of the timeline
        timelineScroll = timeline.parentElement, //Should return "timeline". It's the container for the scrolling list
        offsetTimeline = offsetXY(timeline), //Returns an object with the top and left scroll offsets
        position,
        time,
        now = new Date(),
        today = new Date();

      if (
        eventData.target.className.indexOf('timeline__content__block__subBlocks__subBlock') >= 0
      ) {
        if (ctrl.placement === 'vertical' || ctrl.placement === 'portrait') {
          position = elPageY - offsetTimeline.top + timelineScroll.scrollTop;
        } else {
          position = elPageX - offsetTimeline.left + timelineScroll.scrollLeft;
        }

        if (ctrl.isArabic) {
          position = !isNaN(position) ? ctrl.timelineSize - position : 0;
        }

        time = getTimeByPosition(position);
        today.setHours(time.hours, time.minutes, 0, 0);
        if (now <= today) {
          ctrl.timelineOpenNewEvent()(today);
        } else {
          var clickPosition = offsetXY(eventData.target),
            rightSubBlockPosition = ctrl.subBlockSize + clickPosition.left,
            bottomSubBlockPosition = ctrl.subBlockSize + clickPosition.top,
            currentTimePosition = ctrl.currentTimePosition;

            if (ctrl.placement === 'vertical' || ctrl.placement === 'portrait') {
              if (currentTimePosition > clickPosition.top && currentTimePosition < bottomSubBlockPosition) {
                ctrl.timelineOpenNewEvent()(now);
              }
            } else {
              if (currentTimePosition > clickPosition.left && currentTimePosition < rightSubBlockPosition) {
                ctrl.timelineOpenNewEvent()(now);
              }
            }
        }
      }
    };

    /**
     * On Click event block call callback parent function.
     * @function TimelineController#onClickEventBlock.
     * @param {object} event - The event that you clicked.
     */
    ctrl.onClickEventBlock = function(event) {
      if (ctrl.disableDetailsClick) {
        return;
      }

      event.selected = true;
      ctrl.timelineOpenEvent()(event);
    };

    ctrl.$onInit = function() {
      var countSubBlockBorders;

      //set timeout and intervals milliseconds for scroll to current position
      ctrl.intervalAutoScroll = ctrl.timelineIntervalAutoScroll
        ? parseInt(ctrl.timelineIntervalAutoScroll)
        : timelineDefault.intervalAutoScroll;

      // Set the time format
      ctrl.timelineDateHourFormat = isString(ctrl.timelineDateHourFormat)
        ? ctrl.timelineDateHourFormat
        : timelineDefault.dateHourFormat;
      ctrl.timelineDateHourMarker = isString(ctrl.timelineDateHourMarker)
        ? ctrl.timelineDateHourMarker
        : timelineDefault.dateHourMarker;
      ctrl.timelineDateTimeFormat = isString(ctrl.timelineDateTimeFormat)
        ? ctrl.timelineDateTimeFormat
        : timelineDefault.dateTimeFormat;

      // Set the timeline position - horizontal or vertical
      ctrl.placement = ctrl.timelinePlacement || timelineDefault.placement;
      ctrl.scale = ctrl.timelineMinutesScale
        ? parseInt(ctrl.timelineMinutesScale) + 1
        : timelineDefault.scale;

      ctrl.timelineArabic =
        ctrl.timelineArabic === 'true'
          ? true
          : ctrl.timelineArabic === 'false'
            ? false
            : ctrl.timelineArabic === true
              ? true
              : false;
      ctrl.showNoon = ctrl.timelineArabic ? false : true;
      ctrl.isArabic = ctrl.timelineArabic && ctrl.placement === 'horizontal' ? true : false;
      setTimelineViewport();

      if (ctrl.placement === 'vertical' || ctrl.placement === 'portrait') {
        ctrl.blockSize = ctrl.timelineBlockVerticalSize
          ? parseInt(ctrl.timelineBlockVerticalSize)
          : timelineDefault.blockVerticalSize;
      } else {
        ctrl.blockSize = ctrl.timelineBlockHorizontalSize
          ? parseInt(ctrl.timelineBlockHorizontalSize)
          : timelineDefault.blockHorizontalSize;
      }

      // Calculate numbers of subBlock of a block.
      ctrl.subBlockSize = Math.round(ctrl.blockSize / ctrl.scale);

      //Count of 1px border for each subBlock. Remove 1px border for first element.
      countSubBlockBorders = ctrl.scale; // - borderFirstElement;

      // Add to block size the 1px border from each subBlock.
      ctrl.blockSize = ctrl.blockSize + countSubBlockBorders / 2;

      // Calculate timeline size depending on number of hours set.
      ctrl.startHour = parseInt(ctrl.timelineStartHour) || timelineDefault.startHour;
      ctrl.nrHours = parseInt(ctrl.timelineNrHours) || timelineDefault.nrHours;
      adjustNrHours();

      ctrl.timelineSize = ctrl.blockSize * ctrl.nrHours;

      //Genrate array of hours
      ctrl.arrayHours = generateHours(ctrl.nrHours, ctrl.startHour);

      setSizeAndPositionForEachEvent();

      setPositionCurrentTime();
      setIntervalPositionCurrentTime();

      ctrl.disableClick =
        ctrl.timelineDisableClick !== undefined && ctrl.timelineDisableClick === true
          ? true
          : timelineDefault.disableClick;

      ctrl.disableAutoScroll =
        ctrl.timelineDisableAutoScroll !== undefined && ctrl.timelineDisableAutoScroll === true
          ? true
          : timelineDefault.disableAutoScroll;

      ctrl.pauseAutoScroll =
        ctrl.timelinePauseAutoScroll !== undefined && ctrl.timelinePauseAutoScroll === true
          ? true
          : false;

      ctrl.timelineEventTitle =
        ctrl.timelineEventTitle !== undefined && ctrl.timelineEventTitle === true ? true : false;

      ctrl.disableDetailsClick =
        ctrl.timelineDisableDetailsClick !== undefined && ctrl.timelineDisableDetailsClick === true
          ? true
          : timelineDefault.disableDetailsClick;

      //Set the component not to be interactive
      if (ctrl.timelineDisableInteraction) {
        disableInteractionTimeline();
      }

      jumpScrollToPosition();
      setLabelPosition();
    };

    function setTimelineElementReference() {
      setTimeout(function() {
        removeAutoScrollEvents();

        var timeline = document.getElementsByClassName('timeline--' + ctrl.placement);

        if (timeline.length && !timelineTouchListenersAdded) {
          timelineElement = timeline[0];

          setTimelineViewport();
          setSizeVisibleTimeline(timelineElement);

          addAutoScrollEvents();
        }
      }, 0);
    }

    ctrl.$onChanges = function(changesObj) {
      if (angular.isDefined(changesObj.timelinePlacement)) {
        ctrl.placement = changesObj.timelinePlacement.currentValue;
        setTimelineElementReference();
      }

      if (angular.isDefined(changesObj.timelineColorTheme)) {
        setTimelineElementReference();
      }

      if (angular.isDefined(changesObj.timelineDisableClick)) {
        ctrl.disableClick = changesObj.timelineDisableClick.currentValue;
      }

      if (angular.isDefined(changesObj.timelineDisableDetailsClick)) {
        ctrl.disableDetailsClick = changesObj.timelineDisableDetailsClick.currentValue;
      }

      if (changesObj.timelinePauseAutoScroll) {
        ctrl.pauseAutoScroll = changesObj.timelinePauseAutoScroll.currentValue;
        if (ctrl.pauseAutoScroll) {
          deactivateAutoScroll();
        } else {
          activateAutoScroll();
        }
      }

      if (changesObj.timelineDisableAutoScroll) {
        ctrl.disableAutoScroll = changesObj.timelineDisableAutoScroll.currentValue;
        if (ctrl.disableAutoScroll) {
          removeAutoScrollEvents();
        } else {
          addAutoScrollEvents();
        }
      }
    };

    ctrl.$postLink = function() {
      setTimelineElementReference();
    };

    ctrl.$onDestroy = function() {
      removeAutoScrollEvents();
      $interval.cancel(intervalCurrentMinute);
      clearTimeout(timeoutAutoScrollToCurrentHour);
      clearTimeout(timeoutCurrentMinute);
      timelineElement = null;
    };
  }
})();

/**
	Smoothly scroll element for the given duration
	Returns a promise that's fulfilled when done
*/
(function() {
  'use strict';

  angular.module('helium').service('SmoothScrollService', SmoothScrollService);

  SmoothScrollService.$inject = [];

  function SmoothScrollService() {
    var svc = this;

    /**
     * Smoothly interpolates between 0 and 1, based on
     * http://en.wikipedia.org/wiki/Smoothstep
     * @function SmoothScrollService#smoothStep.
     * @param {number} edge0 - The left edge.
     * @param {number} edge1 - The right edge.
     * @param {number} x - Value between edge0 and edge1.
     */
    function smoothStep(edge0, edge1, point) {
      var x;
      x = clamp((point - edge0) / (edge1 - edge0), 0.0, 1.0);

      return x * x * x * (x * (x * 6 - 15) + 10);
    }

    function clamp(x, lowerlimit, upperlimit) {
      if (x < lowerlimit) x = lowerlimit;
      if (x > upperlimit) x = upperlimit;
      return x;
    }

    /**
     * Set config
     * @function SmoothScrollService#setConfig.
     * @param {object} cfg - Config object.
     */
    this.setConfig = function(cfg) {
      svc.config = cfg;
    };

    /**
     * Scroll element position to target with specified duration.
     * @function SmoothScrollService#scroll.
     * @param {object} element - The element being scrolled.
     * @param {object} target - The final position of the scroll.
     * @param {object} duration - The duration of the scroll.
     * @param {object} placement - The direction of the scroll. Default 'horizontal'.
     */
    this.scroll = function(element, target, duration, placement) {
      var scrollPlacement = placement === 'vertical' ? 'scrollTop' : 'scrollLeft';
      var start_position = element[scrollPlacement];
      var start_time = Date.now();
      var end_time;
      var distance;

      svc.config.stopScrolling = false;

      var iTarget = parseInt(target),
        iDuration = parseInt(duration);

      if (iDuration === 0) {
        element[scrollPlacement] = iTarget;
        return Promise.resolve();
      }

      end_time = start_time + iDuration;
      distance = iTarget - start_position;

      if (Math.round(distance) === 0) {
        return Promise.resolve();
      }

      return new Promise(function(resolve) {
        var previous_position;
        var scrollFrame = function() {
          var now = Date.now();
          var point, nextPosition, currentPosition;

          // Force stop the smooth scrolling
          if (svc.config.stopScrolling === true) {
            resolve();
            return;
          }

          // Set the scrollPosition for this frame
          point = smoothStep(start_time, end_time, now);
          // nextPosition = Math.round( start_position + ( distance * point ) );
          nextPosition = parseFloat(start_position + distance * point).toFixed(2);
          // Get current position of element
          currentPosition = element[scrollPlacement];

          // Where it reached the end of limit, done.
          if (
            now >= end_time ||
            (currentPosition === previous_position && currentPosition !== nextPosition)
          ) {
            resolve();
            return;
          }

          // Set the scroll position for this frame of the animation
          element[scrollPlacement] = nextPosition;
          // Store position for use in next frame
          previous_position = nextPosition;

          window.requestAnimationFrame(scrollFrame);
        };

        // Kick off scroll animation
        window.requestAnimationFrame(scrollFrame);
      });
    };
  }
})();

/*
 * Scroll Init Directive
 * Scroll timeline to current position on init component.
 */

(function() {
  'use strict';

  angular.module('helium').directive('hlmScrollInit', ScrollInitDirective);

  ScrollInitDirective.$inject = ['$rootScope'];

  function ScrollInitDirective($rootScope) {
    return {
      restrict: 'A',
      scope: {
        jumpTo: '=',
        // placement - horizontal, vertical, portrait
        placement: '=',
        event: '<',
        // timelineSize is the total width or height of the timeline, including off-screen portions
        timelineSize: '<',
        // timelineViewport is the total width or height of the viewable area of the timeline
        timelineViewport: '<',
        // isArabic - RTL language mode
        isArabic: '<',
        // is this timeline on details dialog? If so we will offset the margin
        timelineDialog: '<',
      },
      replace: false,
      link: function(scope, element) {
        var unbindWatcher = scope.$watch('jumpTo', function(newValue) {
          var parent = element.parent().parent();

          var parentSize =
            scope.placement === 'vertical' || scope.placement === 'portrait'
              ? parent.height()
              : parent.width();

          var availableSize;
          var val = newValue;

          if (scope.placement === 'portrait') {
            parentSize = parent.height() * 0.375;
          }

          if (scope.event) {
            if (scope.isArabic) {
              availableSize = parentSize - scope.event.size;
              val =
                scope.timelineSize - scope.event.startPosition - scope.event.size - availableSize;
            }

            if (parentSize) {
              setTimeout(function() {
                element[0].style.width = parentSize + 'px';
                if (scope.placement === 'vertical' || scope.placement === 'portrait') {
                  element[0].scrollTop = val;
                } else {
                    if (scope.timelineDialog && $rootScope.isRtl) {
                      var offsetNum = 0.016;
                      var devicePixelRatio = window.devicePixelRatio;
                      if( devicePixelRatio > 1) {
                        if(scope.timelineViewport > 500) {
                          offsetNum = 0.018;
                        } else {
                          offsetNum = 0.028;
                        }

                      } else if (devicePixelRatio < 1) {
                        offsetNum = 0.014;
                      }
                      element[0].scrollLeft = val - (scope.timelineViewport * offsetNum);
                    } else {
                      element[0].scrollLeft = val;
                    }
                }
              }, 500);
            }
          }

          if (scope.placement === 'vertical' || scope.placement === 'portrait') {
            element[0].scrollTop = val;
          } else {
            element[0].scrollLeft = val;
          }

          unbindWatcher();
        });
      },
    };
  }
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

(function() {
	'use strict';

	angular
		.module('helium')
		.config(routeConfig);

	routeConfig.$inject = ['$routeProvider'];

	function routeConfig($routeProvider) {
		var url = null,
			defaultURL = 'views/partials/room.html';

		$routeProvider
			.when('/page/:page', {
				resolve: {
					checkTemplate: ['$rootScope', '$route', 'templateService', '$q', function ($rootScope, $route, templateService, $q) {
						var deferred = $q.defer();

						url = templateService.getPageTemplateUrl($route.current.params.page);
						if ($rootScope.Helium.state.offlineLimit) {
							if (url === defaultURL) {
								deferred.resolve();
							} else {
								deferred.reject();
								url = defaultURL;
							}
						} else {
							deferred.resolve();
						}

						return deferred.promise;
					}]
				},
				templateUrl: function() {
					return url ? url : defaultURL;
				}
			})
			.otherwise({
				redirectTo: defaultURL
			});
	}
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/**
 * Application localization
 */

(function () {
  'use strict';

  angular
    .module('helium')
    .config(translateProvider)
    .config(translateDynamicLocale);

  translateProvider.$inject = ['$translateProvider'];
  translateDynamicLocale.$inject = ['tmhDynamicLocaleProvider'];

  function translateProvider($translateProvider) {
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');
  }

  function translateDynamicLocale(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.defaultLocale('en');
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
  }

})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
/**
 * Application Config
 *
 * Configuration for application
 */

(function() {
    'use strict';

    angular
        .module('helium')
        .constant('AppConfig', {
            delayTime: 10 * 1000,// Number of milliseconds between each function call.
            hourInMin: 60,
            arabicLanguage: false,
            template: {
                arabicTemplateSuffix: '_arabic',
                modalFolderPath: 'views/modals/',
                pageFolderPath: 'views/partials/'
            },
            screenSaverDelay:  5 * 60 * 1000,
            errorMsgCloseDelay: 10 * 1000,
            successMsgCloseDelay: 10 * 1000,
            timeoutLoadingMask: 60 * 1000,
            timeoutPendingRoom: 60 * 1000,
        });
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

( function( ) {
	'use strict';

	angular
		.module( 'helium' )
		.controller( 'AboutCtrl', AboutCtrl );

	AboutCtrl.$inject = [ '$scope', '$rootScope', '$uibModalInstance', '$http' ,'CommunicationService', 'AppStateService'];

	function AboutCtrl( $scope, $rootScope, $uibModalInstance, $http, CommunicationService, AppStateService) {
        var initialized = false,
            loading = {
                state: true,
                message: $rootScope.Helium.labels.details.loadingMessage
            };

        $scope.working = false;
        $scope.data = {};

        angular.extend( $rootScope.Helium.state.loading, loading );

        $rootScope.$watch( 'Helium.state.isOnline', function( newValue ) {
            if ( initialized ) {
                $scope.data.helpProviderData.isOnline = newValue;
            }
        });

        $rootScope.$watch( 'Helium.state.refreshingProvider', function( newValue ) {
            $scope.working = newValue;
        });

        CommunicationService.sendAbout (
            function ( success, resp ) {
                $rootScope.$evalAsync( function( ) {
                    if ( success ) {
                        $scope.data = resp.data;
                        initialized = true;
                        $http.get('appInfo.json')
                            .then(function ( res ) {
                                $rootScope.Helium.state.loading.state = false;
                                $scope.data.helpVersionData = $scope.data.helpVersionData || {};
                                $scope.data.helpVersionData.web = res.data.version;
                            }, function ( ) {
                                console.log( 'Invalid appInfo.json file' );
                                $rootScope.Helium.state.loading.state = false;
                            });
                    } else {
                        console.log( 'NO data received' );
                        $uibModalInstance.close( );
                        $rootScope.Helium.state.loading.state = false;
                    }
                } );
            }
        );

        $scope.cancel = function () {
            $uibModalInstance.dismiss( 'cancel' );
        };

        $scope.refresh = function ( ) {
            if( !$scope.working ) {
                $scope.working = true;
                AppStateService.setRefreshProviderTimeout();
                CommunicationService.sendRefreshSchedule( function ( ) {
                    //Do nothing in callback
                });
            }
        };
	}
} )( );
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
( function( ) {
	'use strict';

	angular
		.module( 'helium' )
		.controller( 'DetailsCtrl', DetailsCtrl );

	DetailsCtrl.$inject = [ '$scope', '$uibModalInstance', 'event' ];

	function DetailsCtrl( $scope, $uibModalInstance, event ) {
        $scope.event = event;

        $scope.cancel = function () {
			$uibModalInstance.dismiss( 'cancel' );
		};
	}
} )( );
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
( function( ) {
	'use strict';

	angular
		.module( 'helium' )
		.controller( 'EndEventCtrl', EndEventCtrl );

	EndEventCtrl.$inject = [ '$scope', '$rootScope', '$uibModalInstance', 'CommunicationService', 'AppConfig'];

	function EndEventCtrl( $scope, $rootScope, $uibModalInstance, CommunicationService, AppConfig ) {
		var startEndEventAction = false;

		$scope.loading = {
            state: false,
			message: $rootScope.Helium.labels.endEvent.loadingMessage,
			showErrorMessageTimeout: false,
			responseReceived: false
		};

		$scope.event = $rootScope.Helium.values.mainRoom.currentEvent;

		$rootScope.$on( 'currentEvent', $uibModalInstance.close );

		$scope.end = function ( ) {
			if ( !startEndEventAction ) {
				var currentEvent = $rootScope.Helium.values.mainRoom.currentEvent;

				$rootScope.$evalAsync( function( ) {
					startEndEventAction = true;
					$scope.loading.state = true;
					angular.extend( $rootScope.Helium.state.loading, $scope.loading );
				} );

				var timeoutErrorMessage = setTimeout( function( ) {
					$rootScope.$evalAsync( function( ) {
						if ( !$scope.loading.responseReceived ) {
							$scope.loading.showErrorMessageTimeout = true;
							$scope.loading.state = $rootScope.Helium.state.loading.state = false;
							$uibModalInstance.close( );
							$rootScope.Helium.methods.openMsgError('EndEvent');
						}
					} );
				}, AppConfig.timeoutLoadingMask );

				CommunicationService.sendEndEvent(currentEvent.id, currentEvent.instanceId, function ( success ) {
					if ( !$scope.loading.showErrorMessageTimeout ) {
						$scope.loading.responseReceived = true;
						clearTimeout( timeoutErrorMessage );
						$rootScope.$evalAsync( function( ) {
							$scope.loading.state = $rootScope.Helium.state.loading.state = false;
							startEndEventAction = false;
							if ( !success ) {
								$rootScope.Helium.methods.openMsgError('EndEvent');
							}
							$uibModalInstance.close( );
						} );
					}

				});
			}
		};

        $scope.cancel = function ( ) {
		    $uibModalInstance.dismiss( 'cancel' );
        };
	}
} )( );
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
( function( ) {
	'use strict';
	  
	angular
		.module( 'helium' )
		.controller( 'ErrorMsgCtrl', ErrorMsgCtrl );
		
	ErrorMsgCtrl.$inject = [ '$scope', '$uibModalInstance', 'AppConfig', 'addEvent' ];

	function ErrorMsgCtrl( $scope, $uibModalInstance, AppConfig, addEvent ) {
		var timeoutErrorMsg = setTimeout( function( ) {
				$uibModalInstance.close( );
			}, AppConfig.errorMsgCloseDelay );

		$scope.addEvent = addEvent;

		$scope.cancel = function ( ) {
		    $uibModalInstance.dismiss( 'cancel' );
        };
		
		$scope.$on( '$destroy', function ( ) {
			clearTimeout( timeoutErrorMsg );
		} );
	}
} )( );;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
( function( ) {
	'use strict';

	angular
		.module( 'helium' )
		.controller( 'ExtendEventCtrl', ExtendEventCtrl );

    ExtendEventCtrl.$inject = [ '$scope', '$rootScope', '$uibModalInstance', 'TimelineService', 'CommunicationService', 'AppConfig' ];

	function ExtendEventCtrl( $scope, $rootScope, $uibModalInstance, TimelineService, CommunicationService, AppConfig ) {
		var mainRoom = $scope.Helium.values.mainRoom,
			currentEvent = mainRoom.currentEvent,
			nextEvent = mainRoom.nextEvent,
			startExtendEventAction = false;

		$rootScope.$on( 'currentEvent', $uibModalInstance.close );

		$scope.loading = {
			state: false,
			message: $rootScope.Helium.labels.extendEvent.loadingMessage,
			showErrorMessageTimeout: false,
			responseReceived: false
		};

		$scope.event = $rootScope.Helium.values.mainRoom.currentEvent;

		$scope.duration = { };

		$scope.duration.options = TimelineService.generateAvailableExtendTime (
			currentEvent.dtEnd,
			nextEvent && nextEvent.dtStart ? nextEvent.dtStart : null,
			15
		);

		$scope.duration.value = $scope.duration.options[0];

        $scope.extend = function ( ) {
			if ( !startExtendEventAction ) {
				$rootScope.$evalAsync( function( ) {
					startExtendEventAction = true;
					$scope.loading.state = true;
					angular.extend( $rootScope.Helium.state.loading, $scope.loading );
				} );

				var timeoutErrorMessage = setTimeout( function( ) {
					$rootScope.$evalAsync( function( ) {
						if ( !$scope.loading.responseReceived ) {
							$scope.loading.showErrorMessageTimeout = true;
							$scope.loading.state = $rootScope.Helium.state.loading.state = false;
							$uibModalInstance.close( );
              $rootScope.Helium.methods.openMsgError('ExtendEvent');
						}
					} );
				}, AppConfig.timeoutLoadingMask );

				CommunicationService.sendExtendEvent(currentEvent.id, currentEvent.instanceId, $scope.duration.value, function ( success ) {
					if ( !$scope.loading.showErrorMessageTimeout ) {
						$scope.loading.responseReceived = true;
						clearTimeout( timeoutErrorMessage );
						$rootScope.$evalAsync( function( ) {
							$scope.loading.state = $rootScope.Helium.state.loading.state = false;
							startExtendEventAction = false;
							if ( !success ) {
                $rootScope.Helium.methods.openMsgError('ExtendEvent');
							}
							$uibModalInstance.close( );
						} );
					}
				});
			}
		};

        $scope.cancel = function ( ) {
		    $uibModalInstance.dismiss( 'cancel' );
        };
	}
} )( );
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

(function () {
  'use strict';

  angular
    .module('helium')
    .controller('FindRoomCtrl', FindRoomCtrl);

  FindRoomCtrl.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'CommunicationService'];

  function FindRoomCtrl($scope, $rootScope, $uibModalInstance, CommunicationService) {
    var roomId = $rootScope.Helium.values.roomId;

    //RWP - Changed to 'OR' comparison. Can't be null 'AND' undefined at the same time
    roomId = (roomId === null || roomId === undefined) ? '' : roomId;
    $scope.model = {
      rooms: [],
      isLoading: true
    };

    CommunicationService.sendRoomSearch(roomId, function (success, resp) {
      $scope.$evalAsync(function () {
        $scope.model.isLoading = false;
        if (success) {
          var eventDate,
            model = $scope.model;

          model.rooms = resp.data && resp.data.rooms ? resp.data.rooms : [];
          model.noRooms = !(resp.data && resp.data.rooms && resp.data.rooms.length);

          // if a room was just saved without errors
          // the pending reservation will be used to not show
          // the room until after a minute has expired.
          if (model.rooms.length > 0) {
            for (var i = 0; i < model.rooms.length; i++) {
              if (model.rooms[i].id === $rootScope.pendingReservation.prevRoomID) {
                model.rooms.splice(i, 1);
              }
            }
          }

          angular.forEach($scope.model.rooms, function (room) {
            if (room.freeUntil) {
              eventDate = room.freeUntil;
            } else {
              eventDate = false;
            }
            room.availableForDuration = $rootScope.Helium.state.getRemainingTimeString({ dtEnd: eventDate });
          });
        }
      });
    });

    $scope.openReservation = function (room) {
      if ($rootScope.Helium.settings.reservation.reservationEnable) {
        $rootScope.Helium.methods.openReservation(false, room);
      }
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
( function( ) {
	'use strict';
	  
	angular
		.module( 'helium' )
		.controller( 'PinCtrl', PinCtrl );
		
	PinCtrl.$inject = [ '$scope', '$rootScope', '$uibModalInstance' ];

	function PinCtrl( $scope, $rootScope, $uibModalInstance) {
		var accessControl = $rootScope.Helium.settings.accessControl.pin ? $rootScope.Helium.settings.accessControl.pin.toString( ) : [];

		$scope.pin = '';
		$scope.pinCircles = [ ];
		$scope.disablePinEntry = false;

		function setPinCircles( ) {
			var length = accessControl.length,
				i;

			if ( length ) {
				for ( i = 0; i < length; i++ ) {
					$scope.pinCircles.push( {
						set: false
					} );
				}
			}
		}

		function shakePin ( ) {
			$scope.disablePinEntry = true;
			$( '.pin__container__header__password' ).addClass( 'shake' );
			setTimeout( function( ) {
				deletePin( );
				$( '.pin__container__header__password' ).removeClass( 'shake' );
			}, 400 );
		}

		function deletePin( ) {
			$scope.$evalAsync( function( ) {
				$scope.pin = '';
				$scope.pinCircles.splice( 0, $scope.pinCircles.length );
				setPinCircles( );
				$scope.disablePinEntry = false;
			} );
		}

		setPinCircles( );
		
		$scope.deteleCircle = function( ) {
			$scope.$evalAsync( function( ) {
				$scope.pin = $scope.pin.substr(0, $scope.pin.length - 1);
				$scope.pinCircles[$scope.pin.length].set = false;
			} );
		};

		$scope.$watch( 'pin', function( newValue ) {
			if ( newValue ) {
				if ( newValue.length <= accessControl.length ) {
					$scope.pinCircles[newValue.length - 1].set = true; 
					if ( newValue === accessControl ) {
						//ToDo: (Maybe) Add animation that shows user that PIN was accepted. Something simple, like the circles fade out and a check mark fades in. 250ms animation length.
						setTimeout( function( ) {
							$uibModalInstance.close( true );
						}, 300 );
					} else {
						if ( newValue.length === accessControl.length ) {
							shakePin( );
						}
					}
				}
			}
		}, true );

		$scope.cancel = function () {
			$uibModalInstance.dismiss( 'cancel' );
        };

		$scope.getPinLength = function( ) {
			var length = accessControl.length;

			return new Array( length );
		};


		$scope.onClickKeys = function( number ) {
			var pin = $scope.pin.toString( );
			pin = pin.concat( number );

			$scope.$evalAsync( function( ) {
				$scope.pin = pin;
			} );
		};
	}
} )( );;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
( function( ) {
	'use strict';

	angular
		.module( 'helium' )
		.controller( 'ReservationCtrl', ReservationCtrl );

	ReservationCtrl.$inject = [ '$scope', '$rootScope', '$uibModalInstance', 'TimelineService', 'CommunicationService', 'ModalService', 'DatetimeFactory',  'setNow', 'room', 'AppConfig' ];

	function ReservationCtrl( $scope, $rootScope, $uibModalInstance, TimelineService, CommunicationService, ModalService, DatetimeFactory, setNow, room, AppConfig) {
        var endOfTheDay = DatetimeFactory.getMidnightTommorrow( ),
            startReservationAction = false,
            scrollBottom = 0,
            reservationContainer = null,
            heliumSettings = $rootScope.Helium.settings;

        function getNextEventFromEventsAfterSetNow( ) {
            var nextMeeting,
                min;

            if ( setNow ) {
                angular.forEach( $rootScope.Helium.values.mainRoom.events, function ( event ) {
                    var diff = event.dtStart - setNow;

                    min = min ? min : ( ( diff > 0 ) ? diff : min );
                    if ( diff > 0 && diff <= min ) {
                        min = diff;
                        nextMeeting = event;
                    }
                } );
            }

            return nextMeeting;
        }

        function getMaximumDuration( ) {
            var duration;
            var maxDurationProperty = 120;

            if (heliumSettings.reservation && heliumSettings.reservation.reserveNowMaxDur) {
                maxDurationProperty = heliumSettings.reservation.reserveNowMaxDur;
            }

            if ( setNow ) {
                //Reserve timeline
              var nextEvent = getNextEventFromEventsAfterSetNow();
                if ( nextEvent ) {
                    duration = DatetimeFactory.getTotalMinutesBetweenDates( $scope.reservation.now, nextEvent.dtStart );
                } else {
                    duration = DatetimeFactory.getTotalMinutesBetweenDates( $scope.reservation.now, endOfTheDay );
                }

                //Should never exceed maxReserveLength property value
                if(duration > maxDurationProperty) {
                    duration = maxDurationProperty;
                }
            } else {
                //Reserve now && Find room - Reserve now
                duration = maxDurationProperty;
            }

            return duration;
        }

        function getListStepDuration() {
          var minDurationProperty;

          if (heliumSettings.reservation && heliumSettings.reservation.reserveNowMinDur) {
              minDurationProperty = heliumSettings.reservation.reserveNowMinDur;
          } else {
              minDurationProperty = 15; //Default if not found
          }

          return minDurationProperty;
        }

        function getContainerHeight( ) {
            var height = 0,
                container = $( '.reservation__container' );

            if ( container.length ) {
                reservationContainer = reservationContainer ? reservationContainer : container[0];
                height = reservationContainer.scrollHeight - reservationContainer.clientHeight - 10;
            }

            return height;
        }

        function generateArray ( length ) {
            var ret = [];

            for(var i = 0; i < length; i++)
                ret.push(undefined);
            ret = ret.length ? ret : [undefined];

            return ret;
        }

        function getPreviousMeetingEndDatefromDate( date ) {
            var ret;
            if ($scope.reservations && $scope.reservations.length) {
                for( var i = $scope.reservations.length - 1; i >= 0; i-- ) {
                    if ($scope.reservations[i].dtEnd <= date) {
                        ret = $scope.reservations[i].dtEnd;
                        break;
                    }
                }
            }
            return ret || DatetimeFactory.getMidnightToday( );
        }

        function roundTimeQuarterHour(time, max, inc) {
            var timeToReturn = new Date(time);
            var roundedMinutes = Math.round(timeToReturn.getMinutes() / inc) * inc;

            //timeToReturn.setMilliseconds(Math.round(time.getMilliseconds() / 1000) * 1000);
            //timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
            timeToReturn.setMilliseconds(0);
            timeToReturn.setSeconds(0);
            timeToReturn.setMinutes(roundedMinutes);

            if (timeToReturn > max) {
                // reduce back to last avalilable time within max
                timeToReturn.setMinutes(timeToReturn.getMinutes() - inc);
            }

            return timeToReturn;
        }

        function getNextMeetingStartDatefromDateOrMax( date ) {
            var ret;
            var maxDate = DatetimeFactory.addMinutesToDate( date > $scope.reservation.now ? date : $scope.reservation.now, $scope.cfg.maximumDuration );
            var i = 0;
            for (i = 0; i < $scope.reservations.length; i++) {
                // console.log('$scope.reservations[i].dtStart = ' + $scope.reservations[i].dtStart);
                if ($scope.reservations[i].dtStart >= date) {
                    ret = $scope.reservations[i].dtStart;
                    break;
                }
            }
            if ( !ret ) {
                ret = DatetimeFactory.getMidnightTommorrow( );
            }

            ret = new Date(Math.min(ret.getTime( ), maxDate.getTime( )));
            //console.log('ret = ' + ret);

            return ret;
        }

        //setup the date on the $scope.reservation.now
        //this is date is rounded
        function getCalculatedReservationNow ( date ) {
            var step = 30;
            var roundedMinutes = setNow ? setNow.getMinutes() % step : 0;
            var roundedDate = new Date(date.getTime() - (roundedMinutes === step ? 0 : (roundedMinutes * 60 * 1000)));
            var previosMeetingEndDate = getPreviousMeetingEndDatefromDate(date);
            var ret = new Date(Math.max(new Date().getTime(), roundedDate.getTime(), previosMeetingEndDate.getTime()));

            ret.setMilliseconds(0);
            ret.setSeconds(0);

            return ret;            
        }

        $scope.focusEl = function( selected, up ) {
            var height;

            $rootScope.$evalAsync( function( ) {
                $scope.activeTimeRoll.selected = selected;
            } );

            setTimeout( function( ) {
                height = getContainerHeight( );
                scrollBottom = height > scrollBottom ? height : scrollBottom;
                scrollBottom =  up ? 0 : scrollBottom;
                $( reservationContainer ).animate( {
                    scrollTop: scrollBottom
                }, 350 );
             }, 250 );
        };

        $scope.loading = {
            state: false,
            message: $rootScope.Helium.labels.reservation.loadingMessage,
            showErrorMessageTimeout: false,
            responseReceived: false
        };
        $scope.room = room;
        $scope.setNow = setNow;
        $scope.reservations = room !== undefined ? [] : $rootScope.Helium.values.mainRoom.events;
        $scope.disableOrganizerEntry =
          (heliumSettings.schedule.source !== 'Fusion' && heliumSettings.schedule.source !== 'fusion' ) &&
          (heliumSettings.schedule.source !== 'DEMO' && heliumSettings.schedule.source !== 'Demo' && heliumSettings.schedule.source !== 'demo' );

        $scope.model = {
            subject: '',
            organizer: '',
            startDate: null,
            endDate: null
        };

        $scope.cfg = {
            step: getListStepDuration(),
            customTime: setNow ? heliumSettings.schedule.reserveCustomEn : false
        };
        $scope.reservation = {
            now: getCalculatedReservationNow(setNow || new Date()),
            lockedStart: setNow === undefined,
            startRange: { options: null, value: 0 },
            endRange: { options: null, value: 0 },
            roomId: room !== undefined ? room.id : null,
        };
        $scope.cfg.maximumDuration = getMaximumDuration ( );

        $scope.onKeypress = function( e ) {
            if ( e.which === 13 ) {
                e.preventDefault( );
                var inputs = Array.prototype.slice.call( $( 'input[type=text]' ) ),
                    index = inputs.indexOf( document.activeElement ),
                    nextInput = inputs[index + 1];

                if ( nextInput && !$scope.disableOrganizerEntry ) {
                    nextInput.focus( );
                } else if ( inputs[index] ) {
					//141413 - Behavior may change in the future, but this was an easy change and makes UX better
                    //Remove focus from current imput if there are no more to traverse
                    inputs[index].blur();
                }
            }
        };

        $scope.generateStartRange = function ( ) {
            var step = $scope.cfg.step;
            var now = $scope.reservation.now;
            var lastDateStart = getNextMeetingStartDatefromDateOrMax(now);
            var maximumDuration = DatetimeFactory.getTotalMinutesBetweenDates(now, lastDateStart);
            var generateRange = function () {
                    var ret;

                    ret = generateArray (Math.min( $scope.cfg.maximumDuration, maximumDuration ) / step )
                        .map(function( c, i ) {
                            var date = new Date(+ now + (i * step * 60 * 1000));
                            return date;
                        })
                        .filter(function( date ) {
                            return !$scope.reservations.some( function ( reservation ) {
                                return ( ( date >= reservation.dtStart ) && ( date < reservation.dtEnd ) ) || ( date > endOfTheDay );
                            });
                        });

                    return ret;
                },

                range = generateRange( );

            if ( $scope.cfg.customTime ) {
                $scope.reservation.startRange.options = null;
                $scope.reservation.startRange.startDate = $scope.reservation.now;
                $scope.reservation.startRange.endDate = DatetimeFactory.addMinutesToDate( lastDateStart, -1 );
                $scope.model.startDate = now;
            } else {
                $scope.reservation.startRange.options = range;
                $scope.reservation.startRange.value = $scope.reservation.startRange.options[0];
            }
        };

        $scope.generateEndRange = function () {
            if (!$scope.model.startDate) return;

            var step = $scope.cfg.step;
            var reserveNowEvenEndTime = heliumSettings.reservation.reserveNowEvenEndTime;
            var roundedMinutes = !setNow && reserveNowEvenEndTime ? step - ($scope.reservation.now.getMinutes() % step) : 0;
            var now = new Date($scope.model.startDate.getTime() + (roundedMinutes * 60 * 1000));
            var lastDateEnd = getNextMeetingStartDatefromDateOrMax(reserveNowEvenEndTime ? now : $scope.reservation.now);
            var maximumDuration = DatetimeFactory.getTotalMinutesBetweenDates(now, lastDateEnd);

            var generateRange = function () {
                var ret;
                // console.log('generateRange() now = ' + now + ', lastDateEnd = ' + lastDateEnd);

                var minutesAvailableToBook = Math.min($scope.cfg.maximumDuration, maximumDuration);
                var arrayLength = minutesAvailableToBook / step;

                ret = generateArray(arrayLength)
                    .map(function (c, i) {
                        var endDate;
                        if (reserveNowEvenEndTime) {
                            endDate = new Date(+roundTimeQuarterHour(now, now, step) + ((i) * step * 60 * 1000));
                            return endDate;
                        }

                        endDate = new Date(+now + ((i) * step * 60 * 1000));
                        return endDate;
                    })
                    .filter(function (date) {
                        if (date <= $scope.model.startDate) {
                            return false;
                        }

                        return !$scope.reservations.some(function (reservation) {
                            return ((date > reservation.dtStart) && (now < reservation.dtEnd)) || (date > endOfTheDay);
                        });
                    });

                if (maximumDuration <= $scope.cfg.maximumDuration && ret.indexOf(lastDateEnd) === -1) {
                    if (reserveNowEvenEndTime) {
                        // needs to be even number of step
                        var prevLastDateEnd = lastDateEnd;
                        lastDateEnd = roundTimeQuarterHour(lastDateEnd, prevLastDateEnd, step);
                    }

                    if (ret.length > 0 && lastDateEnd > ret[ret.length - 1]) {
                        //avoid duplicate of the last?
                        ret.push(lastDateEnd);
                    }
                    else {
                        // only one entry apparently, this one
                        if (ret.length === 0) {
                            ret.push(lastDateEnd);
                        }
                    }
                }

                return ret;
            };

            var options = generateRange();
            if ($scope.cfg.customTime && !reserveNowEvenEndTime) {
                //This condition causes the end time list to split into hours and minutes selections, with an interval of 1 minute
                var totalMinutes = DatetimeFactory.getTotalMinutesBetweenDates(now, options[0]);

                $scope.reservation.endRange.options = null;
                $scope.reservation.endRange.startDate = DatetimeFactory.addMinutesToDate(now, totalMinutes);
                $scope.reservation.endRange.endDate = lastDateEnd;
                $scope.reservation.endRange.value = $scope.reservation.endRange.startDate;
                $scope.model.endDate = $scope.reservation.endRange.startDate;
            } else {
                $scope.reservation.endRange.options = options;
                $scope.reservation.endRange.value = options[0];
            }
        };

        $scope.$watch('model.startDate', function( ) {
            $scope.generateEndRange( );
        });

        $scope.generateStartRange();

        $scope.activeTimeRoll = {
            selected: null,
            setSelected: function(who) {
                if (who === $rootScope.Helium.labels.reservation.starts && $scope.reservation.lockedStart) {
                    return;
                }

                $scope.activeTimeRoll.selected = who;
            },
            isSelected: function(who) {

                return $scope.activeTimeRoll.selected === who;
            }
        };

        $scope.cancel = function () {
            if ( $scope.room ) {
                $uibModalInstance.dismiss('cancel');
                ModalService.closeAll( );
            } else {
		        $uibModalInstance.dismiss('cancel');
            }
        };

        $scope.back = function ( ) {
            var callbackFn = function( ) {
                    $uibModalInstance.dismiss( 'cancel' );
                };

            if ( $scope.reservation.roomId ) {
                $( '.modal-reservation.slide-right' ).removeClass( 'modal-show' );
                setTimeout( callbackFn , 350 );
            } else {
                callbackFn( );
            }
        };

        $scope.add = function() {
            if ( !startReservationAction ) {
                $rootScope.$evalAsync( function( ) {
                    startReservationAction = false;
                    $scope.loading.state = true;
                    angular.extend( $rootScope.Helium.state.loading, $scope.loading );
                } );
                var timeoutPendingRoom = setTimeout( function(){
                    $rootScope.pendingReservation.prevRoomID = 0;
                }, AppConfig.timeoutPendingRoom);

                var timeoutErrorMessage = setTimeout( function( ) {
                    $rootScope.$evalAsync( function( ) {
                        if ( !$scope.loading.responseReceived ) {
                            ModalService.closeAll( );
                            $scope.loading.showErrorMessageTimeout = true;
                            $scope.loading.state = $rootScope.Helium.state.loading.state = false;
                            $rootScope.Helium.methods.openMsgError('CreateEvent');
                            clearTimeout( timeoutPendingRoom );
                            $rootScope.pendingReservation.prevRoomID = 0;
                        }
					} );
                }, AppConfig.timeoutLoadingMask );

                $rootScope.pendingReservation.prevRoomID = $scope.reservation.roomId;

                CommunicationService.sendCreateEvent(
                    $scope.setNow ? true : false,
                    $scope.reservation.roomId,
                    $scope.model.subject ? $scope.model.subject : $rootScope.Helium.labels.reservation.defaultSubject,
                    $scope.model.organizer ? $scope.model.organizer : $rootScope.Helium.labels.reservation.defaultOrganizer,
                    $scope.model.startDate,
                    $scope.model.endDate,
                    function( success ) {
                        if ( !$scope.loading.showErrorMessageTimeout ) {
                            $scope.loading.responseReceived = true;
                            clearTimeout( timeoutErrorMessage );
                            $rootScope.$evalAsync( function( ) {
                                $scope.loading.state = $rootScope.Helium.state.loading.state = false;
                                startReservationAction = false;
                                ModalService.closeAll( );
                                if ( !success ) {
                                    $rootScope.Helium.methods.openMsgError('CreateEvent');
                                    $rootScope.pendingReservation.prevRoomID = 0;
                                } else {
                                    if ( !$scope.setNow && $scope.room && $scope.room.name ) {
                                      $rootScope.Helium.methods.openMsgSuccess('CreateEvent');
                                    }
                                }
                            } );
                        }
                    }
                );
            }
        };

        $scope.validReservation = function( ) {
            return  $scope.model.startDate < $scope.model.endDate;
        };

        $scope.isValidDate = function(date) {
            return date && date.getTime() === date.getTime();
        };
	}
} )( );
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

(function() {
  'use strict';

  angular.module('helium').controller('RoomCtrl', RoomCtrl);

  RoomCtrl.$inject = ['$scope', '$rootScope', 'AppClockService', 'CommunicationService', 'ThemeService', 'DatetimeFactory'];

  function RoomCtrl($scope, $rootScope, AppClockService, CommunicationService, ThemeService, DatetimeFactory) {
    var refreshCurrentTime = function () {
      $scope.currentTime = Date.now();
    };

  var startCheckInAction = false,
      timeoutFade;

    $scope.currentEvent = $rootScope.Helium.values.mainRoom.currentEvent;
    $scope.nextEvent = $rootScope.Helium.values.mainRoom.nextEvent;

    $scope.loading = { state: false, message: $rootScope.Helium.labels.checkInEvent ? $rootScope.Helium.labels.checkInEvent.loadingMessage : '' };

    // TODO: Move this to  higher level so that it isn't duplicated in screensaver.js
    var refreshMeetingData = function() {
      $scope.currentEvent = $rootScope.Helium.values.mainRoom.currentEvent;
      $scope.nextEvent = $rootScope.Helium.values.mainRoom.nextEvent;
    };

    $rootScope.$watch('Helium.values.mainRoom.currentEvent', function () {
      // console.log('roomCtrl: current event changed');
      // console.log($rootScope.Helium.values.mainRoom.currentEvent);
      refreshMeetingData();
    });
    $rootScope.$watch('Helium.values.mainRoom.nextEvent', function () {
      // console.log('roomCtrl: next event changed');
      // console.log($rootScope.Helium.values.mainRoom.nextEvent);
      refreshMeetingData();
    });
    $rootScope.$watch('Helium.state.roomOccupied', function () {
      // console.log('roomCtrl: roomOccupied changed');
      // console.log('' + $rootScope.Helium.state.roomOccupied);
    });
    $rootScope.$watch('Helium.settings.room.enableAvailableOccupiedState', function () {
      // console.log('roomCtrl: enableAvailableOccupiedState changed');
      // console.log('' + $rootScope.Helium.settings.room.enableAvailableOccupiedState);
    });

    $rootScope.Helium.methods.setMenu(true);

    $scope.currentTime = Date.now();

    AppClockService.subscribe(refreshCurrentTime);
    // AppClockService.subscribe($rootScope.Helium.state.setRoomReserved);

    $scope.openEventDetails = function(event) {
      $rootScope.Helium.methods.openModal('details', { event: event });
    };

    $scope.checkInEvent = function() {
      var event = $rootScope.Helium.state.checkInEvent,
        callbackFn = function() {
          $scope.checkIn();
        };

      if (!event.checkedIn && $rootScope.Helium.state.needPin) {
        var modal = $rootScope.Helium.methods.openPin();

        if (modal) {
          modal.result.then(function() {
            callbackFn();
          });
        }
      } else {
        callbackFn();
      }
    };

    $scope.checkIn = function() {
      var event = $rootScope.Helium.state.checkInEvent;

      if (!event.checkedIn && !startCheckInAction) {
        $rootScope.Helium.methods.closeMenu();
        startCheckInAction = true;
        $scope.loading.state = true;
        angular.extend($rootScope.Helium.state.loading, $scope.loading);

        CommunicationService.sendCheckInEvent(
          event.id,
          event.instanceId,
          function(success) {
            $rootScope.$evalAsync(function() {
              $scope.loading.state = $rootScope.Helium.state.loading.state = false;
              startCheckInAction = false;
              if (success) {
                event.checkedIn = 1;
              } else {
                $rootScope.Helium.methods.openMsgError();
              }
            });
          }
        );
      }
    };

    $scope.endEvent = function() {
      if (!$rootScope.Helium.state.setDisableEndNow()) $rootScope.Helium.methods.openEndEvent();
    };

    $scope.extendEvent = function() {
      if (!$rootScope.Helium.state.setDisableExtendNow()) {
        $rootScope.Helium.methods.openExtendEvent();
      }
    };

    $scope.isCurrentEventEndingBeforeMidnightToday = function() {
      var currentEvent = $rootScope.Helium.values.mainRoom.currentEvent;

      if (currentEvent.dtEnd < DatetimeFactory.getMidnightTommorrow()) {
        return true;
      }

      return false;
    };

    $scope.setVision = function() {
      $rootScope.Helium.state.vision = !$rootScope.Helium.state.vision;
      ThemeService.updateTheme('impair-theme');
      $rootScope.$evalAsync(function() {
        $rootScope.Helium.methods.closeMenu();
      });
      setVisionButtonClass();
    };

    $scope.clickMenu = function() {
      changeOpenMenuState();
      $rootScope.Helium.methods.openMenu();
      openMenuClickEvent();
    };

    $('.menu__item').css('visibility', 'hidden');

    // Hide Menu Button background when in vertical or portrait mode
    if ($rootScope.Helium.state.layout === 'vertical' || $rootScope.Helium.state.layout === 'portrait') {
      $('.menu__open__button').css('background', 'transparent');
    }
    setVisionButtonClass();

    $('.menu__open').on('click', function() {
      changeOpenMenuState();
    });

    function changeOpenMenuState() {
      var menuOpen = $('.menu__open');

      if (menuOpen[0].checked) {
        menuOpen[0].checked = false;
      } else {
        menuOpen[0].checked = true;
      }
    }

    function setVisionButtonClass() {
      var vision = $('.menu__item--vision');

      if ($rootScope.Helium.state.vision) {
        vision.addClass('bg__theme-color-6');
        vision.removeClass('bg__main-color-7');
      } else {
        vision.addClass('bg__main-color-7');
        vision.removeClass('bg__theme-color-6');
      }
    }

    function openMenuClickEvent() {
      var close = $('.menu-close-label'),
        openButton = $('.menu__open__button');

      if (close.is(':visible')) {
        $('.menu__item').css('visibility', 'visible');
        openButton[0].setAttribute('style', '');
        openButton.css('border', '0px');
      } else {
        openButton[0].setAttribute('style', '');
      }

      timeoutFade = setTimeout(function() {
        var close = $('.menu-close-label'),
          open = $('.menu-open-label');

        if (close.is(':visible')) {
          $('.menu__item').css('visibility', 'visible');
        } else if (open.is(':visible')) {
          $('.menu__item')
            .delay(1)
            .animate({ visibility: 'visible' }, 180, function() {
              var close = $('.menu-close-label');

              if (close.is(':visible')) {
                $('.menu__item').css('visibility', 'visible');
              }
            });
        }
      }, 180);
    }

    $scope.$on('$destroy', function() {
      AppClockService.unsubscribe(refreshCurrentTime);
      // AppClockService.unsubscribe($rootScope.Helium.state.setRoomReserved);
      clearTimeout(timeoutFade);
    });
  }
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/**
 * Screensaver
 *
 * It supports images, gif and videos.
 * In the appInfo.json the screenSaver options are set.
 *
 * Here are some examples:
 * *****************************
 *  "screenSaver": {
 *            "media": {
 *                "img": "assets/media/media.jpg",
 *                "video":"assets/media/media.mp4",
 *                "type":"mp4"
 *            }
 *        },
 * *****************************
 * "screenSaver": {
 * 		"image": [
 *			"assets/images/screensaver.gif"
 *		]
 * }
 * *****************************
 * "screenSaver": {
 * 		"image": [
 *			"assets/images/screensaver_bg.jpg"
 *		]
 * }
 * *****************************
 */

(function () {
  'use strict';

  angular
    .module('helium')
    .controller('ScreensaverCtrl', ScreensaverCtrl);

  ScreensaverCtrl.$inject = ['$scope', '$rootScope', '$timeout', 'AppClockService'];

  function ScreensaverCtrl($scope, $rootScope, $timeout, AppClockService) {
    var animationTimeout;
    var animationFreqMinutes = 5;

    $scope.swapFields = false;
    $scope.firstSwap = false;
    var updateAnimation = function () {
      $scope.swapFields = !$scope.swapFields;
      $scope.firstSwap = true;
    };

    var tick = function () {
      animationTimeout = $timeout(tick, animationFreqMinutes * 60000); // reset the timeout after every completion
      updateAnimation();
    };

    animationTimeout = $timeout(tick, animationFreqMinutes * 60000);

    var refreshCurrentTime = function () {
      $scope.currentTime = Date.now();
    };

    $scope.currentTime = Date.now();
    AppClockService.subscribe(refreshCurrentTime);

    $scope.goToRoom = function () {
      $rootScope.Helium.methods.openPage('room');
    };

    $scope.getLogo = function () {
      var newValue = $rootScope.Helium.settings.display.projectIconUrl;
      return newValue ? newValue : '';
    };

    var refreshMeetingData = function () {
      $scope.currentEvent = $rootScope.Helium.values.mainRoom.currentEvent || null;
      $scope.nextEvent = $rootScope.Helium.values.mainRoom.nextEvent || null;
    };

    $rootScope.$watch('Helium.values.mainRoom.currentEvent', function () {
      refreshMeetingData();
    });
    $rootScope.$watch('Helium.values.mainRoom.nextEvent', function () {
      refreshMeetingData();
    });

    $scope.$on('$destroy', function () {
      AppClockService.unsubscribe(refreshCurrentTime);
      $timeout.cancel(animationTimeout);
    });
  }
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
( function( ) {
	'use strict';
	  
	angular
		.module( 'helium' )
		.controller( 'SuccessMsgCtrl', SuccessMsgCtrl );
		
	SuccessMsgCtrl.$inject = [ '$scope', '$uibModalInstance', 'AppConfig', 'addEvent' ];

	function SuccessMsgCtrl( $scope, $uibModalInstance, AppConfig, addEvent ) {
		var timeoutSuccessMsg = setTimeout( function( ) {
				$uibModalInstance.close( );
			}, AppConfig.successMsgCloseDelay );

		$scope.addEvent = addEvent;

		$scope.cancel = function ( ) {
		    $uibModalInstance.dismiss( 'cancel' );
        };
		
		$scope.$on( '$destroy', function ( ) {
			clearTimeout( timeoutSuccessMsg );
		} );
	}
} )( );;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/*
 * Loading mask directive
 *
 */

(function () {
  'use strict';

  angular
    .module('helium')
    .directive('hlmLoadingMask', LoadingMaskDirective);

  function LoadingMaskDirective() {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        loading: '=',
        message: '='
      },
      template: '<div class="loading bg__theme-color-6">' +
                  '<div class="loading__mask">' +
                    '<i class="loading__mask__img fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom"></i>' +
                    '<p class="loading__mask__message">{{ message }}</p>' +
                  '</div>' +
                '</div>',
      link: function (scope, element) {
        scope.$watch('loading', function (val) {
          if (val) {
            $(element).show();
          } else {
            $(element).hide();
          }
        });
      }
    };
  }
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
/*
 * Long press element.
 *
 * If long press is done do a action else do another action
 */

(function() {
    'use strict';
	
	angular
		.module('helium')
		.directive('helLongPressEl', LongPressElDirective);

	function LongPressElDirective( ) {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                duration: '@',
                callFnShort: '&',
                callFnLong: '&'
            },
            link: function ( scope, element ) {
                var timeout,
                    longPress = true;

                scope.duration = scope.duration || 5000;
                scope.callFnShort = scope.callFnShort || function ( ) { };
                scope.callFnLong = scope.callFnLong || function ( ) { };

                element[0].addEventListener('touchstart', function ( ) {
                    longPress = false;
                    timeout = setTimeout( function  () {
                        longPress = true;
                        scope.callFnLong( );
                        }, scope.duration
                    );
                }, {passive: true});

                element[0].addEventListener( 'touchend', function ( event ) {
                    if ( !longPress ) {
                        clearTimeout( timeout );
                        event.preventDefault();
                        scope.callFnShort( event );
                    }
                });
            }
        };
	}
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron's Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that's contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/*
 * Simple press event directive for scrolling elements
 * Will call bound function on press event
 * Able to receive a press cancel event from the parent ctrl if the list starts to scroll
 *
 */

( function( ) {
	'use strict';

	angular
		.module( 'helium' )
        .directive( 'scrollingPressEvent', scrollingPressEvent );

	function scrollingPressEvent( ) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                scrollDirection: '@',
                scrollingPressEvent: '&',
                disablePress: '<'
            },
            link: function ( scope, element ) {
                // Need to extract the DOM element from the jqlite object that Angular provides, so that an addEventListener call can be made
                // Need to use addEventListener for touchStart and touchMove, so that the passive option can be turned on
                var domElement = element ? element[0] : null;

                var lastTouchEvent = {};
                var maxDriftPx = 30; // Maximum amount of movement (pixels) in the scroll direction before press is cancelled and it is just considered a scroll action
                var pressCancelled = false;

                // Get list scroll direction for use in the touchMove handler
                scope.scrollDirection = scope.scrollDirection || 'horizontal';
                scope.scrollingPressEvent = scope.scrollingPressEvent || function() {};

                var setLastTouchEvent = function ( event ) {
                    lastTouchEvent = {};
                    lastTouchEvent.pageX = event.touches[0].pageX;
                    lastTouchEvent.pageY = event.touches[0].pageY;
                    lastTouchEvent.currentTarget = event.currentTarget;
                    lastTouchEvent.target = event.target;
                };

                var callPress = function() {
                    if (!pressCancelled) {
                      scope.scrollingPressEvent()(lastTouchEvent);
                    }
                };

                var touchMoveHandler = function (event) {
                    if (!scope.disablePress && !pressCancelled) {
                        if (event.touches.length > 1) {
                            pressCancelled = true;
                            return;
                        }

                        if (scope.scrollDirection && (scope.scrollDirection === 'vertical' || scope.scrollDirection === 'portrait')) {
                            // Calculate total distance moved in Y direction
                            var distanceY = lastTouchEvent ? Math.abs(lastTouchEvent.pageY - event.changedTouches.item(0).pageY) : 0;
                            // If vertical distance moved is greater than the maxDriftPx property...
                            if (distanceY > maxDriftPx) {
                                pressCancelled = true;
                            }
                        } else {
                            // Calculate total distance moved in X direction
                            var distanceX = lastTouchEvent ? Math.abs(lastTouchEvent.pageX - event.changedTouches.item(0).pageX) : 0;
                            // If horizontal distance moved is greater than the maxDriftPx property...
                            if (distanceX > maxDriftPx) {
                                pressCancelled = true;
                            }
                        }

                        if(pressCancelled) {
                            domElement.removeEventListener('touchmove', touchMoveHandler, { passive: true });
                        }
                    }
                };

                var touchEndHandler = function ( event ) {
                    if(!scope.disablePress) {
                        //141458 - only handle 1 touch
                        if (event.touches.length > 0) {
                            return;
                        }

                        domElement.removeEventListener('touchmove', touchMoveHandler, { passive: true });
                        domElement.removeEventListener('touchend', touchEndHandler, { passive: false });

                        if ( !pressCancelled ) {
                            //Wrap in scope.$apply if it seems like timing is an issue here
                            callPress();
                        }
                    }
                };

                var touchStartHandler = function ( event ) {
                    if(!scope.disablePress) {
                        //141458 - only handle 1 touch
                        if (event.touches.length > 1) {
                            pressCancelled = true;
                            return;
                        }

                        pressCancelled = false;
                        setLastTouchEvent(event);

                        domElement.addEventListener('touchmove', touchMoveHandler, { passive: true });
                        domElement.addEventListener('touchend', touchEndHandler, { passive: false });
                    }
                };

                domElement.addEventListener('touchstart', touchStartHandler, { passive: true } );

                scope.$on('destroy', function() {
                    domElement.removeEventListener('touchstart', touchStartHandler, { passive: true } );
                    domElement.removeEventListener('touchmove', touchMoveHandler, { passive: true });
                    domElement.removeEventListener('touchend', touchEndHandler, { passive: false });
                });
            }
        };
	}
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron's Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that's contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/*
 * TouchStart and TouchEnd directive for scrolling element group
 * Sets CCS styles for element up and down states, and optionally calls a bound function on a press event
 * Able to receive a press cancel event from the parent ctrl if the list starts to scroll
 *
 */

(function () {
    'use strict';

    angular
        .module('helium')
        .directive('hlmScrollTouchEl', hlmScrollTouchEl);

    function hlmScrollTouchEl() {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                scrollDirection: '@',

                addClassName: '@',
                removeClassName: '@',

                childrenClassName: '@',
                childrenAddClassName: '@',
                childrenRemoveClassName: '@',

                disableInteraction: '<',
                enablePressAction: '<',

                callPressFn: '&'
            },
            link: function (scope, element) {
                var domElement = element ? element[0] : null;
                var lastTouchEvent = {};
                var maxDriftPx = 30; // Maximum amount of movement (pixels) in the scroll direction before press is cancelled and it is just considered a scroll action
                var pressCancelled = false;

                // Get list scroll direction for use in the touchMove handler
                scope.scrollDirection = scope.scrollDirection || 'horizontal';

                scope.addClassName = scope.addClassName || '';
                scope.removeClassName = scope.removeClassName || '';

                scope.childrenClassName = scope.childrenClassName || '';
                scope.childrenAddClassName = scope.childrenAddClassName || '';
                scope.childrenRemoveClassName = scope.childrenRemoveClassName || '';

                scope.callPressFn = scope.callPressFn || function () { };

                var setLastTouchEvent = function (event) {
                    lastTouchEvent = {};
                    lastTouchEvent.pageX = event.touches[0].pageX;
                    lastTouchEvent.pageY = event.touches[0].pageY;
                    lastTouchEvent.currentTarget = event.currentTarget;
                    lastTouchEvent.target = event.target;
                };

                var completeListItemPressFn = function () {
                    scope.callPressFn(lastTouchEvent);
                };

                var releaseTriggered;
                /**
                 * This is to allow enough time for a display of the button press
                 */
                var completeListItemRelease = function () {
                    if (releaseTriggered) return;

                    releaseTriggered = true;

                    if (scope.enablePressAction === true && pressCancelled === false) {
                        completeListItemPressFn();
                    }

                    if ($(element).hasClass(scope.addClassName)) {
                        $(element).removeClass(scope.addClassName);
                        $(element).addClass(scope.removeClassName);

                        if (scope.childrenClassName) {
                            var children = $(element).children(),
                                i,
                                child;

                            for (i = 0; i < children.length; i++) {
                                if (children[i].className.indexOf(scope.childrenClassName) !== -1) {
                                    child = $(children[i]);
                                    child.removeClass(scope.childrenAddClassName);
                                    child.addClass(scope.childrenRemoveClassName);
                                    break;
                                }
                            }
                        }
                    }
                };

                var touchMoveHandler = function (event) {
                    if (!scope.disableInteraction) {
                        if (scope.scrollDirection && (scope.scrollDirection === 'vertical' || scope.scrollDirection === 'portrait')) {
                            // Calculate total distance moved in Y direction
                            var distanceY = lastTouchEvent ? Math.abs(lastTouchEvent.pageY - event.changedTouches.item(0).pageY) : 0;
                            // If vertical distance moved is greater than the maxDriftPx property...
                            if (distanceY > maxDriftPx) {
                                pressCancelled = true;
                            }
                        } else {
                            // Calculate total distance moved in Y direction
                            var distanceX = lastTouchEvent ? Math.abs(lastTouchEvent.pageX - event.changedTouches.item(0).pageX) : 0;
                            // If horizontal distance moved is greater than the maxDriftPx property...
                            if (distanceX > maxDriftPx) {
                                pressCancelled = true;
                            }
                        }
                    }

                    if (pressCancelled) {
                        domElement.removeEventListener('touchmove', touchMoveHandler, { passive: true });

                        completeListItemRelease();
                    }
                };

                var touchEndHandler = function (event) {
                    if (!scope.disableInteraction) {
                        domElement.removeEventListener('touchmove', touchMoveHandler, { passive: true });
                        domElement.removeEventListener('touchend', touchEndHandler, { passive: false });

                        completeListItemRelease();

                        if (!pressCancelled) {
                            event.preventDefault();
                        }
                    }
                };

                var touchStartHandler = function (event) {
                    if (!scope.disableInteraction) {
                        //141458 - only handle 1 touch
                        if (event.touches.length > 1) {
                            pressCancelled = true;
                            return;
                        }

                        pressCancelled = false;
                        releaseTriggered = false;

                        setLastTouchEvent(event);

                        domElement.addEventListener('touchmove', touchMoveHandler, { passive: true });
                        domElement.addEventListener('touchend', touchEndHandler, { passive: false });

                        $(element).removeClass(scope.removeClassName);
                        $(element).addClass(scope.addClassName);

                        if (scope.childrenClassName) {
                            var children = $(element).children(),
                                i,
                                child;

                            for (i = 0; i < children.length; i++) {
                                if (children[i].className.indexOf(scope.childrenClassName) !== -1) {
                                    child = $(children[i]);

                                    child.addClass(scope.childrenAddClassName);
                                    child.removeClass(scope.childrenRemoveClassName);
                                    break;
                                }
                            }
                        }
                    } else {
                        pressCancelled = true;
                        event.stopPropagation(); //This is to stop the event from bubbling up the display chain to the parent directive and triggering its listener
                    }
                };

                domElement.addEventListener('touchstart', touchStartHandler, { passive: true });

                scope.$on('destroy', function () {
                    domElement.removeEventListener('touchstart', touchStartHandler, { passive: true });
                    domElement.removeEventListener('touchmove', touchMoveHandler, { passive: true });
                    domElement.removeEventListener('touchend', touchEndHandler, { passive: false });
                });
            }
        };
    }
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
/*
 * Shrink to fit directive.
 */

(function() {
	'use strict';
	
	angular
		.module( 'helium' )
		.directive( 'hlmShrinkToFit', ShrinkToFitDirective );
	
	function ShrinkToFitDirective( ) {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                string: '<',
                minSize: '<'
            },
            link : function(scope, element ) {
                var resizeNameToFit = function ( el, minSize ) {
                    var element = $( el ),
                        parent = element.parent( ),
                        fontsize = parseFloat( element.css( 'font-size' ) );

                    if ( fontsize > minSize ) {
                        if ( element.get(0).scrollWidth > Math.ceil( parent.width( ) ) ) {
                            element.css( 'fontSize', fontsize - 1 );
                            resizeNameToFit( el, minSize );
                        }
                    } else {
                        element.addClass( 'ellipsis' );
                    }
                };

                scope.minSize = scope.minSize || 24;

                scope.$watch( 'string', function( newValue ) { 
                    if ( newValue ) {
                        resizeNameToFit( element, scope.minSize );
                    }
                } );     
            }
        };
	}
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
( function( ) {
	'use strict';
	  
	angular
		.module( 'helium' )
		.controller( 'SplashCtrl', SplashCtrl );
		
	SplashCtrl.$inject = [ ];

	function SplashCtrl( ) {
    
    }
} )( );;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/*
 * timeRoll directive.
 *
 */

(function() {
	'use strict';

	angular
		.module('helium')
        .directive('hlmTimeRoll', TimeRollDirective);

    function TimeRollDirective( ) {
        return {
            scope: {
                data: '=',
                label: '=',
                langArabic: '<',
                formatTime: '<',
                isSelected: '<'
            },
            restrict: 'E',
            replace: true,
            template: [
                '<div class="time-roll border__theme-color-4"> ' +
                    '<div style="display:none">{{data.value | date: formatTime}}</div>'+
                    '<div class="time-roll__center border__theme-color-9"></div>' +
                    '<div class="time-roll__top"></div>' +
                    '<div class="time-roll__bottom"></div>' +
                    '<div class="time-roll__viewport">' +
                        '<ul>' +
                        '<li class="color__theme-color-6"><span></span></li>' +
                        '<li class="color__theme-color-6" data-ng-repeat="value in data.options track by $index">' +
                            '<span data-ng-if="!langArabic" data-value="{{$index}}">{{formatTime ? (value | date: formatTime) : value}} {{label}}</span>' +
                            '<span data-ng-if="langArabic" data-value="{{$index}}">{{label}} {{formatTime ? (value | date: formatTime) : value}} </span>' +
                        '</li>' +
                        '<li class="color__theme-color-6"><span></span></li>' +
                    '</ul>' +
                    '</div>' +
                '</div>'
            ].join(''),
            link: function ( scope, timeRoll ) {
                var tapDown = 0,
                    timer,
                    element = timeRoll.find( '.time-roll__viewport' ),
                    domElement = element ? element[0] : null,
                    firstItem = element.find( 'li' ).first( ),
                    itemHeight = firstItem.height( ),
                    halfThresholdHeight = itemHeight / 2,
                    selectClassName = 'time-roll__viewport__selected';

                 function getItems ( ) {
                    return timeRoll.find( '.time-roll__viewport > ul li' );
                }

                scope.$watch('data.options', function ( ) {
                    removeClassSelectedForAllItems( );
                    selectItem( 0 );
                    addClassSelectedForItem(timeRoll.find( '.time-roll__viewport > ul li:nth-child(' + 2 + ')' ));
                });

                scope.$watch('isSelected', function ( ) {
                    setTimeout(function() {
                        var parent = timeRoll.parent(),

                        sel = parent.find('.time-roll__viewport ul');

                        if(sel) {
                            sel.css('display', 'none');
                            sel.offset();
                            sel.css('display', '');

                        }
                    }, 100);
                });

                addListeners( );

                function getScrollHeight( ) {
                    return element.get( 0 ).scrollTop;
                }

                function addClassSelectedForItem ( el ) {
                    $( el ).addClass( selectClassName );
                }

                function removeClassSelectedForAllItems ( ) {
                    var el = getItems();

                    $( el ).removeClass( selectClassName );
                }

                function selectItem( item ) {
                    var newScroll = item * itemHeight;

                    element.animate( {
                        scrollTop: newScroll
                    }, 300 );
                }

                function scrollFinish( event ) {
                    clearTimeout( timer );

                    timer = setTimeout( refresh, 700, event );
                }

                function refresh( ) {
                    var scrollHeight = getScrollHeight( );

                    if ( tapDown === 0) {
                        if (scrollHeight % itemHeight > halfThresholdHeight ) {
                            element.animate( {
                                scrollTop: scrollHeight + itemHeight - ( scrollHeight % itemHeight )
                            }, 100 );
                        } else {
                            element.animate( {
                                scrollTop: scrollHeight - ( scrollHeight % itemHeight )
                            }, 100 );
                        }
                    }
                }

                function onScroll( ) {
                    var scrollHeight = getScrollHeight( ),
                        item,
                        blank_item = 1,
                        index_first_child = 1,
                        add = blank_item + index_first_child;

                    if ( scrollHeight % itemHeight > halfThresholdHeight ) {
                        item = ( scrollHeight + itemHeight - ( scrollHeight % itemHeight ) ) / itemHeight + add;
                    } else {
                        item = ( scrollHeight - ( scrollHeight % itemHeight ) ) / itemHeight + add;
                    }

                    removeClassSelectedForAllItems( );
                    addClassSelectedForItem(timeRoll.find( '.time-roll__viewport > ul li:nth-child(' + Math.round(item) + ')' ));
                    if ( scope.data.value !== scope.data.options[Math.round(item)-1-blank_item] ) {
                        scope.data.value = scope.data.options[Math.round(item)-1-blank_item];
                        scope.$apply();
                    }
                }

                function touchStartHandler () {
                    ++tapDown;
                    clearTimeout( timer );
                }

                function addListeners () {
                    element.bind( 'scroll', onScroll);

                    if(domElement) {
                        domElement.addEventListener('touchstart', touchStartHandler, { passive: true } );
                    }

                    element.bind( 'touchend', function ( ) {
                        tapDown = 0;
                        scrollFinish( );
                    } );
                }
            }
        };
	}
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
/*
 * TouchStart and TouchEnd directive for stationary elements
 * Sets CCS styles for element up and down states, and optionally calls a bound function on a press event and/or a long press
 *
 */

( function( ) {
	'use strict';

	angular
		.module( 'helium' )
		.directive( 'hlmTouchEl', hlmTouchEl );

	function hlmTouchEl( ) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                addClassName: '@',
                removeClassName: '@',

                childrenClassName: '@',
                childrenAddClassName: '@',
                childrenRemoveClassName: '@',

                disableInteraction: '<',
                enablePressAction: '<',
                enableLongPressAction: '<',

                duration: '@',
                callFnShort: '&',
                callFnLong: '&'
            },
            link: function ( scope, element ) {
                var timeout,
                    longPress = true;
                var domElement = element ? element[0] : null;

                scope.addClassName = scope.addClassName || '';
                scope.removeClassName = scope.removeClassName || '';

                scope.childrenClassName = scope.childrenClassName || '';
                scope.childrenAddClassName = scope.childrenAddClassName || '';
                scope.childrenRemoveClassName = scope.childrenRemoveClassName || '';

                scope.duration = scope.duration || 2000;
                scope.enableLongPressAction = scope.enableLongPressAction || false;
                scope.callFnShort = scope.callFnShort || function ( ) { };
                scope.callFnLong = scope.callFnLong || function ( ) { };

                var touchEndHandler = function ( event ) {
                    domElement.removeEventListener('touchend', touchEndHandler, { passive: false } );

                    if ( scope.disableInteraction !== true ) {
                        window.requestAnimationFrame( function( ) {
                            $( element ).removeClass( scope.addClassName );
                            $( element ).addClass( scope.removeClassName );

                            if ( scope.childrenClassName ) {
                                var children = $( element ).children(),
                                    i,
                                    child;

                                for ( i = 0; i < children.length; i++ ) {
                                    if ( children[i].className.indexOf( scope.childrenClassName ) !== -1 ) {
                                        child = $( children[i] );
                                        child.removeClass( scope.childrenAddClassName );
                                        child.addClass( scope.childrenRemoveClassName );
                                        break;
                                    }
                                }
                            }

                            if ( scope.enablePressAction === true ) {
                                if ( !longPress ) {
                                    clearTimeout( timeout );
                                    scope.callFnShort( event );
                                }
                            }
                        });
                    }
                };

                var touchStartHandler = function ( ) {
                    domElement.addEventListener('touchend', touchEndHandler, { passive: false } );

                    if ( scope.disableInteraction !== true ) {
                        window.requestAnimationFrame( function( ) {
                            $( element ).removeClass( scope.removeClassName );
                            $( element ).addClass( scope.addClassName );

                            if ( scope.childrenClassName ) {
                                var children = $( element ).children(),
                                    i,
                                    child;

                                for ( i = 0; i < children.length; i++ ) {
                                    if ( children[i].className.indexOf( scope.childrenClassName ) !== -1 ) {
                                        child = $( children[i] );
                                        child.addClass( scope.childrenAddClassName );
                                        child.removeClass( scope.childrenRemoveClassName );
                                        break;
                                    }
                                }
                            }

                            if ( scope.enablePressAction === true ) {
                                longPress = false;
                                timeout = setTimeout(
                                    function ( ) {
                                        if(scope.enableLongPressAction === true) {
                                            longPress = true;
                                            scope.callFnLong( );
                                        }
                                    }, scope.duration
                                );
                            }
                        });
                    }
                };

                domElement.addEventListener('touchstart', touchStartHandler, { passive: true } );
            },
        };
    }
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron's Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that's contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/**
 * Simple directive to call a function bound to the scope, when a touch-end event occurs on the element
 */

( function ( ) {
	'use strict';

	/* Simple directive to call a function bound to the scope, when a touch-end event occurs on the element */

	angular
		.module('helium')
		.directive('elTouchEnd', elTouchEnd);

		function elTouchEnd ( ) {
			return {
				restrict: 'A',
				replace: false,
				scope: {
					touchEndFn: '&'
				},
				link: function ( scope, element ) {
					var domElement = element ? element[0] : null;

					scope.touchEndFn = scope.touchEndFn || function ( ) { };

					var touchEndHandler = function () {
						scope.$apply(function() {
                            scope.$eval(scope.touchEndFn);
						});
					};

					domElement.addEventListener('touchend', touchEndHandler, {passive: false});
				},
			};
		}
} ) ( );;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
/*
 * Video Poster directive
 */

( function( ) {
	'use strict';

	angular
		.module( 'helium' )
		.directive( 'hlmVideoPoster', hlmVideoPoster );

	function hlmVideoPoster( ) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                hlmVideoPoster: '=',
            },
            link: function ( scope, element ) {
                scope.$watch('hlmVideoPoster', function( newValue ) {
                    if ( newValue ) {
                        element.attr('poster', newValue);
                    }
                });

                scope.hlmVideoPoster = scope.hlmVideoPoster || '';

                element.attr('poster', scope.hlmVideoPoster);
            }
        };
	}
} ) ( );;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

(function() {
  'use strict';

  angular.module('helium').factory('DatetimeFactory', function() {
    this.getMidnightToday = function() {
      var ret = new Date();
      ret.setHours(0, 0, 0, 0);

      return ret;
    };

    this.getMidnightTommorrow = function() {
      var ret = new Date();
      ret.setHours(24, 0, 0, 0);

      return ret;
    };

    /**
     * Checking if now is between given dates.
     * @function DatetimeFactory#isNowBetweenDates.
     * @param {Datetime} startDate
     * @param {Datetime} endDate
     */
    this.isNowBetweenDates = function(startDate, endDate) {
      var now = new Date();
      return startDate < now && now <= endDate;
    };

    /**
     * Return round time left between now and a given date
     * By round we mean that between minute 01:00 + 20 milisecond ( our interval ) and 01:01
     * we need to show 1 minute difference
     * @function DatetimeFactory#getRoundTimeLeft.
     * @param {Datetime} date
     */
    this.getRoundTimeLeftTill = function(date) {
      var now = new Date().getTime();
      var minutes = this.getTimeLeftBetweenDates(date, now - 60000);

      return minutes;
    };

    /**
     * Return time left between now and given date.
     * @function DatetimeFactory#getTimeLeft.
     * @param {Datetime} date
     */
    this.getTimeLeftTill = function(date) {
      var now = new Date().getTime();

      return this.getTimeLeftBetweenDates(date, now);
    };

    /**
     * Return total minutes left between the two dates given.
     * @function DatetimeFactory#getTimeLeftBetweenDates.
     * @param {Number} date1 - timestamp
     * @param {Number} date2 - timestamp
     */
    this.getTotalMinutesBetweenDates = function(date1, date2) {
      // Need "Whole" minutes for calculation. Ex: 13:45:00.000 - 13:15:00.000
      // Figure out how many seconds need to be subtracted from each date before doing calculation
      var date1ExtraMillis = date1 % 60000;
      var date2ExtraMillis = date2 % 60000;

      if (date1ExtraMillis && date1ExtraMillis !== undefined && date1ExtraMillis !== 0) {
        date1 -= date1ExtraMillis;
      }

      if (date2ExtraMillis && date2ExtraMillis !== undefined && date2ExtraMillis !== 0) {
        date2 -= date2ExtraMillis;
      }

      var secondsDiff = Math.abs(date2 - date1) / 1000;
      var minutes = Math.floor(secondsDiff / 60);

      return minutes;
    };

    /**
     * Return object time with hours/ minutes and seconds left between dow dates given.
     * @function DatetimeFactory#getTimeLeftBetweenDates.
     * @param {Number} date1 - timestamp
     * @param {Number} date2 - timestamp
     */
    this.getTimeLeftBetweenDates = function(date1, date2) {
      var diff = Math.abs(date1 - date2) / 1000;

      var hours = Math.floor(diff / 3600) % 24;
      diff -= hours * 3600;

      var minutes = Math.floor(diff / 60) % 60;
      diff -= minutes * 60;

      var seconds = diff % 60;

      return {
        hours: hours,
        minutes: minutes,
        seconds: seconds
      };
    };

    /**
     * Add minutes to date
     * @function DatetimeFactory#Add Minutes to date.
     * @param {Date} date - date
     * @param {Number} mins - number
     */
    this.addMinutesToDate = function(date, mins) {
      return new Date(date.getTime() + mins * 60000);
    };

    /**
     * Checking if date is before second date.
     * @function DatetimeFactory#isDateBeforeDate.
     * @param {Datetime} date
     * @param {Datetime} startDate
     * @param {Datetime} endDate
     */
    this.isDateBeforeDate = function(date1, date2) {
      return date1 <= date2;
    };

    return this;
  });
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

(function () {
  'use strict';

  angular
    .module('helium')
    .factory('UtilFactory', function () {
      this.getControllerModal = function (modal) {
        var arrayModal = modal ? modal.split('-') : [],
          string = '',
          i = 0;

        for (i; i < arrayModal.length; i++) {
          string += this.capitalizeFirstLetter(arrayModal[i]);
        }

        return string ? string + 'Ctrl' : string;
      };
      this.capitalizeFirstLetter = function (string) {
        return string ? string.charAt(0).toUpperCase() + string.slice(1) : string;
      };

      this.isString = function (param) {
        return (typeof param === 'string' || param instanceof String);
      };

      this.existClass = function () {
        //TODO - implement
        return true;
      };

      this.existsTemplate = function () {
        //TODO - implement
        return true;
      };

      return this;
    });
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
/**
 * Application run
 */

(function() {
  'use strict';

  angular.module('helium').run(runSources);

  runSources.$inject = [
    '$rootScope',
    'AppStateService',
    '$location',
    '$document',
    'ModalService',
    'ThemeService',
    'LayoutService'
  ];

  function runSources($rootScope, AppStateService, $location, $document, ModalService, ThemeService, LayoutService) {
    var flagStart = false;

    AppStateService.listenForActions();
    AppStateService.createMethods();

    // Load splash screen on startup
    $location.path('page/splash');

    // Configure UI
    ThemeService.loadTheme();
    LayoutService.loadLayout();

    // Set timeline block dimensions based on panel type
    AppStateService.setTimelineBlockDimensions();

    var touchEndHandler = function () {
      AppStateService.startScreensaverTimeout();

      $document[0].removeEventListener('touchend', touchEndHandler, { passive: false });
      $document[0].removeEventListener('touchcancel', touchEndHandler, { passive: false });
    };

    var touchStartHandler = function () {
      // Stop screensaver timeout until user is finished interacting
      AppStateService.stopScreensaverTimeout();
      $document[0].addEventListener('touchend', touchEndHandler, { passive: false });
      $document[0].addEventListener('touchcancel', touchEndHandler, { passive: false });
    };

    $rootScope.$on('$locationChangeStart', function() {
      flagStart = true;
      ModalService.closeAll();
      $rootScope.Helium.state.loading.state = false;
    });

    $rootScope.$on('$routeChangeSuccess', function() {
      if (!flagStart) {
        ModalService.closeAll();
      }
      flagStart = false;
    });

    $rootScope.$on('$routeChangeError', function(event, current, previous) {
      $rootScope.Helium.methods.openPage(previous.params.page);
    });

    // Listen for user interaction event to stop screensaver timeout
    $document[0].addEventListener('touchstart', touchStartHandler, { passive: true });

    $rootScope.$on('destroy', function() {
      $document[0].removeEventListener('touchstart', touchStartHandler, { passive: true });
      $document[0].removeEventListener('touchend', touchEndHandler, { passive: false });
      $document[0].removeEventListener('touchcancel', touchEndHandler, { passive: false });
    });
  }
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

 
/**
 * Interval service. Create a universal interval for the application.
 * Where we need to call a function at that interval just subscribe to the interval
 */
( function( ) {
    'use strict';

    angular
        .module( 'helium' )
        .service( 'AppClockService', AppClockService );

    AppClockService.$inject =  [ '$timeout' ];

    function AppClockService ( $timeout ) {
        var callbacks = [],
            timeout,
            tickRunning = false,
            callCallbacks = function ( ) {
                for (var i = 0; i < callbacks.length; i++ )  {
                    //Added try/catch to protect against a missing callback causing the rest not to fire
                    try {
                        callbacks[i]();
                    } catch ( ex ) {
                        console.log('AppClockService: Exception while processing a callback function: ' + ex);
                    }
                }
            },
            tick = function() {
                callCallbacks( );
                //Get time to next full minute + 750ms
              var millisToNextMinutes = 60500 - (new Date().getTime() % 60000);
                timeout = $timeout(tick, millisToNextMinutes); // reset the timeout after every completion
            },
            cancelTick = function ( ) {
                if(tickRunning){
                    $timeout.cancel(timeout);
                    tickRunning = false;
                }
            },
            createTick = function startTick(){
                if(tickRunning){
                    cancelTick();
                }
                //Notify subscribers before creating timeout
                callCallbacks( );
                //Get time to next full minute + 20ms
              var millisToNextMinutes = 60500 - (new Date().getTime() % 60000);
                // Start the timer
                timeout = $timeout(tick, millisToNextMinutes);
                tickRunning = true;
            };

        this.subscribe = function ( callback ) {
            if (!callbacks.length) {
                createTick();
            }
            callbacks.push( callback );
        };

        this.unsubscribe = function ( callback ) {
            for (var i = callbacks.length; i >= 0; i-- ) {
                if ( callbacks[i] === callback ) {
                    callbacks.splice(i, 1);
                    break;
                }
            }
            if (!callbacks.length) {
                cancelTick();
            }
        };
    }

} )( );
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

(function () {
  'use strict';

  angular.module('helium')
    .service('AppStateService', AppStateService);

  AppStateService.$inject = [
    '$rootScope',
    '$location',
    '$uibModal',
    'templateService',
    'UtilFactory',
    'LocalizationService',
    'TimelineService',
    '$timeout',
    'CommunicationService',
    'AppConfig',
    'SettingsService',
    'DatetimeFactory',
    'ThemeService',
    'BackgroundService',
    'AppClockService',
  ];

  function AppStateService(
    $rootScope,
    $location,
    $uibModal,
    templateService,
    UtilFactory,
    LocalizationService,
    TimelineService,
    $timeout,
    CommunicationService,
    AppConfig,
    SettingsService,
    DatetimeFactory,
    ThemeService,
    BackgroundService,
    AppClockService)
  {
    var me = this;
    var timeoutShowScreenSaver;
    var initInfo = {
      config: false,
      providerStatus: false,
    };
    var readyStart = false;

    $rootScope.Helium = {
      methods: {},
      language: {},
      settings: {
        countDownScreenSaver: AppConfig.screenSaverDelay,
        schedule: {
          source: '',
        },
        room: {
          enableAvailableOccupiedState: true,
        },
      },
      settingsExtra: {
        supportsInstanceManipulation: false,
        readOnlyModeEnabled: false,
      },
      labels: {},
      values: {
        mainRoom: { events: [], currentEvent: null, nextEvent: null },
      },
      state: {
        layout: '',
        portraitPanel: false,
        countOpenModals: 0,
        modalOpen: false,
        help: false,
        loading: {
          state: false,
          message: 'Loading',
        },
        isOnline: true,
        roomOccupied: false,
        isArabic: false,
        buttons: {
          disable: {},
        },
        needPin: false,
        checkInEvent: null,
        openAbout: false,
        refreshingProvider: false,
        timelineBlockHorizontalSize: 322,
        timelineBlockVerticalSize: 113,
      },
    };

    $rootScope.pendingReservation = {
      prevRoomID: 0
    };

    function setButtonsStatus() {
      var disable = $rootScope.Helium.state.buttons.disable;
      var isOnline = $rootScope.Helium.state.isOnline;

      $rootScope.Helium.state.setVisibleEndNow();
      $rootScope.Helium.state.setVisibleExtendNow();
      $rootScope.Helium.state.setVisibleCheckInNow();

      $rootScope.Helium.state.setDisableEndNow();
      $rootScope.Helium.state.setDisableExtendNow();
      $rootScope.Helium.state.setDisableCheckIn();

      disable.findRoom = !isOnline;
      disable.reserveNow = !isOnline;
    }

    function setRoomState() {
      setButtonsStatus();
      $rootScope.Helium.state.setRoomReserved();
    }

    // Update the state of the room and the buttons every minute
    AppClockService.subscribe(function () {
      console.log('AppStateService: Clock update');

      // Refresh state every minute
      setRoomState();
    });

    $rootScope.$watch('Helium.values.mainRoom.currentEvent', setRoomState);
    $rootScope.$watch('Helium.values.mainRoom.currentEvent.privacyLevel', setRoomState);
    $rootScope.$watch('Helium.values.mainRoom.nextEvent', setRoomState);
    $rootScope.$watch('Helium.values.mainRoom.currentEvent.checkedIn', setButtonsStatus);
    $rootScope.$watch('Helium.values.mainRoom.nextEvent.checkedIn', setRoomState);
    $rootScope.$watch('Helium.state.isOnline', setButtonsStatus);
    $rootScope.$watch('Helium.values.mainRoom.currentEvent.dtEnd', setButtonsStatus);
    $rootScope.$watch('Helium.values.mainRoom.nextEvent.dtStart', setRoomState);

    this.setTimelineBlockDimensions = function () {
      var screenWidth = window.screen ? window.screen.width : 0;
      var screenHeight = window.screen ? window.screen.height : 0;
      var isPortrait = screenHeight >= screenWidth;
      var blockWidth = 322;
      var blockHeight = 113;

      //Set portrait mode
      $rootScope.Helium.state.portraitPanel = isPortrait;

      //TSW-1060 = 1280x800
      //TSW-760  = 1261x739
      //TSW-560  = 640x363
      //TSW-570  = 640x360
      //TSW-770  = 1280x800
      //TSW-1070 = 1440x846??
      //Determine panel type by size and orientation
      if (isPortrait) {
        // console.log('AppStateService: setTimelineBlockDimensions: Panel is portrait');
        switch (screenHeight) {
          case 1280:
            blockWidth = 322;
            blockHeight = 113;
            break;
          case 640:
            blockWidth = 160;
            blockHeight = 70;
            break;
        }
      } else {
        switch (screenHeight) {
          case 800:
            blockWidth = 322;
            blockHeight = 113;
            break;
          case 739:
            blockWidth = 322;
            blockHeight = 113;
            break;
          case 363:
            blockWidth = 160;
            blockHeight = 68;
            break;
          case 360:
            blockWidth = 160;
            blockHeight = 68;
            break;
        }
      }

      $rootScope.Helium.state.timelineBlockHorizontalSize = blockWidth;
      $rootScope.Helium.state.timelineBlockVerticalSize = blockHeight;
    };

    this.listenForActions = function () {
      var doneInit = function () {
        if (initInfo.config && initInfo.providerStatus) {
          $timeout(function () {
            readyStart = true;
            $rootScope.Helium.methods.openPage('room');
            if ($rootScope.Helium.settings.display.disableIdleScreen) {
              console.log('AppStateService: Received action: Idle screen disabled. Stop timeout operation');
              me.stopScreensaverTimeout();
            } else {
              console.log('AppStateService: Received action: Idle screen enabled. Start timeout operation');
              me.startScreensaverTimeout();
            }
          }, 2000);
        }
      };

      CommunicationService.listenForProviderStatus(function (resp) {
        initInfo.providerStatus = true;
        $rootScope.$evalAsync(function () {
          $rootScope.Helium.state.vision = false;
          SettingsService.applyProviderState(resp);
          doneInit();
          BackgroundService.applyBackground();
        });
      });

      CommunicationService.listenForTimeline(function (resp) {
        $rootScope.$evalAsync(function () {
          TimelineService.applyRoomTimeline(resp.data);
        });
      });

      CommunicationService.listenForEvents(function (resp) {
        $rootScope.$evalAsync(function () {
          TimelineService.applyRoomEvents(resp.data);
        });
      });



      CommunicationService.listenForConfig(function (resp) {
        $rootScope.$evalAsync(function () {
          console.log('AppStateService: Received config: display.disableIdleScreen: ' + resp.data.settings.display.disableIdleScreen);
          $rootScope.Helium.state.vision = false;
          initInfo.config = true;
          LocalizationService.changeLanguage(resp.data.settings.room, function () {
            SettingsService.applySettings(resp.data);
            setRoomState();
            SettingsService.setNeedsPin(resp.data);
            if (SettingsService.isFirstInitialization()) {
              if (resp.data.settings.display.disableIdleScreen) {
                console.log('AppStateService: Received config: Idle screen disabled. Stop timeout operation');
                me.stopScreensaverTimeout();
              } else {
                console.log('AppStateService: Received config: Idle screen enabled. Start timeout operation');
                me.startScreensaverTimeout();
              }
            }
            doneInit();
            BackgroundService.applyBackground();
          });
          TimelineService.refreshStateOnCurrentMeeting();
        });
      });
    };

    this.createMethods = function () {
      $rootScope.Helium.methods.openPage = function (page) {
        if (readyStart) $location.path('/page/' + page);
      };

      var working = false;
      $rootScope.Helium.methods.openModal = function (modal, resolve, customOptions) {
        console.log('AppState: openModal called: ' + modal);
        if (working) {
          console.log('AppState: openModal: ' + modal + '. Already working on previous request. Return');
          return;
        }
        var controllerName = UtilFactory.getControllerModal(modal);
        var templateUrl = templateService.getModalTemplateUrl(modal);
        var mainDiv = $('main');
        var instance;

        $rootScope.Helium.methods.closeMenu();

        if (UtilFactory.existClass(controllerName) && templateUrl) {
          //Don't allow multiple quick presses to trigger multiple modal instances
          working = true;
          setTimeout(function () {
            working = false;
          }, 250);

          instance = $uibModal.open(
            angular.extend(
              {
                animation: true,
                backdrop: 'static',
                keyboard: false,
                templateUrl: templateUrl,
                controller: controllerName,
                windowClass: 'modal-' + modal,
                resolve: resolve || {},
              },
              customOptions
            )
          );

          instance.opened.then(function () {
            $rootScope.Helium.state.countOpenModals++;
            mainDiv.addClass('blur');
            $rootScope.Helium.state.modalOpen = true;
          });
          instance.closed.then(function () {
            $rootScope.Helium.state.countOpenModals--;
            if ($rootScope.Helium.state.countOpenModals < 1) {
              mainDiv.removeClass('blur');
              $rootScope.Helium.state.modalOpen = false;

              //Make sure the count doesn't go below 0 for some reason
              if ($rootScope.Helium.state.countOpenModals < 0) $rootScope.Helium.state.countOpenModals = 0;
            }
          });
        }
        return instance;
      };

      $rootScope.Helium.methods.openEndEvent = function () {
        console.log('AppState: openEndEvent called;');
        var callbackFn = function () {
          $rootScope.Helium.methods.openModal(
            'end-event'
          ).result.catch(function (resp) {
            if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
        };

        if ($rootScope.Helium.state.needPin) {
          var modal = $rootScope.Helium.methods.openPin();

          if (modal) {
            modal.result.then(function () {
              callbackFn();
            });
          }
        } else {
          callbackFn();
        }
      };

      $rootScope.Helium.methods.openExtendEvent = function () {
        console.log('AppState: openExtendEvent called;');
        var callbackFn = function () {
          if ($rootScope.Helium.values.mainRoom.currentEvent.state.maxExtend) {
            $rootScope.Helium.methods.openModal(
              'extend-event'
            ).result.catch(function (resp) {
              if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
            });
          }
        };

        if ($rootScope.Helium.state.needPin) {
          var modal = $rootScope.Helium.methods.openPin();
          if (modal) {
            modal.result.then(function () {
              callbackFn();
            });
          }
        } else {
          callbackFn();
        }
      };

      $rootScope.Helium.methods.closeHelp = function () {
        console.log('AppState: closeHelp called;');
        // document.removeEventListener('touchend', closeHelp);
        $rootScope.$evalAsync(function () {
          $rootScope.Helium.state.help = false;
        });
      };

      $rootScope.Helium.methods.openHelp = function () {
        console.log('AppState: openHelp called;');
        var closeHelp = function () {
          document.removeEventListener('touchend', closeHelp);
          $rootScope.$evalAsync(function () {
            $rootScope.Helium.state.help = false;
          });
        };

        $rootScope.Helium.methods.closeMenu();

        $rootScope.$evalAsync(function () {
          $rootScope.Helium.state.help = true;
        });

        setTimeout(function () {
          // TODO: Probably need to remove this listener in the $rootScope.Helium.methods.closeHelp function too
          document.addEventListener('touchend', $rootScope.Helium.methods.closeHelp);
        }, 10);
      };

      $rootScope.Helium.methods.openReservation = function (setNow, room) {
        //This is sent when a timeline block is pressed. It will be the time associated with the position pressed
        // console.log('appState: openReservation: setNow:');
        // console.log(setNow);

        //If room is not null, this is the result of a find rooms operation
        // console.log('appState: openReservation: room:');
        // console.log(room);

        var roomSettings = $rootScope.Helium.settings.room;
        var mainRoom = $rootScope.Helium.values.mainRoom;

        if (
          setNow &&
          $rootScope.Helium.state.isReserved() &&
          roomSettings &&
          roomSettings.availabilityThresholdRoomState &&
          DatetimeFactory.isDateBeforeDate(setNow, mainRoom.currentEvent.dtStart) &&
          DatetimeFactory.getTotalMinutesBetweenDates(setNow, mainRoom.currentEvent.dtStart) <= roomSettings.availabilityThresholdMin
        ) {
          console.log('AppState: Cannot create new reservation at the selected time. Within Availability Threshold of next meeting');
          return false;
        }

        var callbackFn = function () {
          var customOptions = room ? { windowClass: 'modal-reservation slide-right', animation: false } : {};

          if ($rootScope.Helium.state.isOnline) {
            var instanceReservation = $rootScope.Helium.methods.openModal(
              'reservation',
              {
                setNow: function () { return setNow; },
                room: function () { return room; },
              },
              customOptions
            );

            instanceReservation.result.catch(function (resp) {
              if (['cancel', 'backdrop click', 'escape key press', 'undefined'].indexOf(resp) === -1) throw resp;
            });

            if (room) {
              instanceReservation.rendered.then(function () {
                var modalReservation = $('.modal-reservation.slide-right');
                modalReservation.addClass('modal-show');
              });
            }
          }
        };

        if (!room && $rootScope.Helium.state.needPin) {
          var modal = $rootScope.Helium.methods.openPin();

          if (modal) {
            modal.result.then(function () {
              callbackFn();
            });
          }
        } else {
          callbackFn();
        }
      };

      $rootScope.Helium.methods.openFindRoom = function () {
        var callbackFn = function () {
          $rootScope.Helium.methods.openModal(
            'find-room'
          ).result.catch(function (resp) {
            if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
          });
        };

        if ($rootScope.Helium.state.needPin) {
          var modal = $rootScope.Helium.methods.openPin();

          if (modal) {
            modal.result.then(function () {
              callbackFn();
            });
          }
        } else {
          callbackFn();
        }
      };

      $rootScope.Helium.methods.openAbout = function () {
        $rootScope.Helium.methods.closeHelp();
        $rootScope.Helium.methods.closeMenu();
        var instance = $rootScope.Helium.methods.openModal(
          'about'
        );

        instance.opened.then(function () {
          $rootScope.Helium.state.openAbout = true;
        });
        instance.closed.then(function () {
          $rootScope.Helium.state.openAbout = false;
        });

        instance.result.catch(function (resp) {
          if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
        });
      };

      $rootScope.Helium.methods.openMsgError = function (addEvent) {
        $rootScope.Helium.methods.openModal('error-msg', {
          addEvent: function () {
            return addEvent;
          },
        }).result.catch(function (resp) {
          if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
        });
      };

      $rootScope.Helium.methods.openMsgSuccess = function (addEvent) {
        $rootScope.Helium.methods.openModal('success-msg', {
          addEvent: function () {
            return addEvent;
          },
        }).result.catch(function (resp) {
          if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
        });
      };

      $rootScope.Helium.methods.openPin = function () {
        if (!$rootScope.Helium.state.isOnline) {
          return false;
        }

        return $rootScope.Helium.methods.openModal('pin', null, {
          backdropClass: 'modalOpacity',
          backdrop: 'true',
        });
      };

      this.startScreensaverTimeout = function () {
        $timeout.cancel(timeoutShowScreenSaver);

        // Do not start timeout operation if Idle screen is disabled in configuration
        if ($rootScope.Helium.settings.display && $rootScope.Helium.settings.display.disableIdleScreen) {
          console.log('AppStateService: Idle screen disabled. Do not start timeout operation');
          return;
        }

        timeoutShowScreenSaver = $timeout(function () {
          $rootScope.Helium.state.vision = false;
          ThemeService.loadTheme();
          $rootScope.Helium.methods.openPage('screensaver');
        }, $rootScope.Helium.settings.countDownScreenSaver);
      };

      this.stopScreensaverTimeout = function () {
        $timeout.cancel(timeoutShowScreenSaver);
      };

      // Keeps the "Refresh" button in the animated, unpressable state for 30 seconds after a refresh
      this.setRefreshProviderTimeout = function () {
        $rootScope.Helium.state.refreshingProvider = true;
        setTimeout(function () {
          $rootScope.Helium.state.refreshingProvider = false;
        }, 30000);
      };

      $rootScope.Helium.methods.openMenu = function () {
        var menu = $('.menu__open');
        var menuOverlay = $('.menu__overlay');

        if (menu.length && menu.is(':checked')) {
          $rootScope.Helium.methods.setMenu(false);
          if (menuOverlay.length) {
            menuOverlay.addClass('menu__overlay--display');
          }
        } else {
          $rootScope.Helium.methods.setMenu(true);
          menuOverlay.removeClass('menu__overlay--display');
        }
      };

      $rootScope.Helium.methods.closeMenu = function () {
        var menu = $('.menu__open');
        var menuOverlay = $('.menu__overlay');

        if (menu.length && menu.is(':checked')) {
          menu.prop('checked', false);
          if (menuOverlay.length) {
            menuOverlay.removeClass('menu__overlay--display');
          }
        }
        $rootScope.Helium.methods.setMenu(true);
      };

      function setMenuButtonBgColor(hide) {
        var openButton = $('.menu__open__button');

        if (hide) {
          openButton.removeClass('bg__main-color-8');
        } else {
          openButton.addClass('bg__main-color-8');
        }
      }

      $rootScope.Helium.methods.setMenu = function (hide) {
        setMenuButtonBgColor(hide);
        setTimeout(function () {
          $rootScope.Helium.methods.setMenuItemVisibility(hide);
        }, 180);
      };

      $rootScope.Helium.methods.setMenuItemVisibility = function (hide) {
        var openButton = $('.menu__open__button');
        var close = $('.menu-close-label');
        var menuItem = $('.menu__item');

        if (hide) {
          menuItem
            .delay(1)
            .animate({ visibility: 'hidden' }, 0, function () {
              if (close.is(':visible')) {
                window.requestAnimationFrame(function () {
                  menuItem.css('visibility', 'visible');
                  openButton.css('border', '0');
                });
              } else {
                menuItem.css('visibility', 'hidden');
                window.requestAnimationFrame(function () {
                  openButton[0].setAttribute('style', '');
                  if ($rootScope.Helium.state.layout === 'vertical' || $rootScope.Helium.state.layout === 'portrait') {
                    openButton[0].setAttribute('style', 'background: transparent');
                  }
                });
              }
            });
        } else {
          if ($rootScope.Helium.state.layout === 'vertical' || $rootScope.Helium.state.layout === 'portrait') {
            window.requestAnimationFrame(function () {
              menuItem.css('visibility', 'visible');
              openButton[0].setAttribute('style', '');
              openButton.css('border', '0');
            });
          }
        }
      };

      $rootScope.Helium.state.isReserved = function () {
        return TimelineService.isReserved();
      };

      $rootScope.Helium.state.isAvailable = function () {
        return TimelineService.isAvailable();
      };

      $rootScope.Helium.state.isAvailableForTheRestOfTheDay = function () {
        return TimelineService.isAvailableForTheRestOfTheDay();
      };

      $rootScope.Helium.state.isOccupied = function () {
        return $rootScope.Helium.state.roomOccupied;
      };

      /**
       * Returns a formatted, localized string representing the remaining time
       * @param {object} event - The event for which the remaining time will be formatted
       * @returns {string} Formatted string 'x hours and x minutes', localized for current locale
       *
       */
      $rootScope.Helium.state.getRemainingTimeString = function (event) {
        var now = new Date();
        var endsIn = DatetimeFactory.getTimeLeftBetweenDates(now, event.dtEnd);
        var result = '';

        if (endsIn && endsIn.hours > 0) {
          result += endsIn.hours + ' ';
          result += endsIn.hours > 1 ? $rootScope.Helium.labels.hours : $rootScope.Helium.labels.hour;
          result += ' ' + $rootScope.Helium.labels.and + ' ';
        }
        result += endsIn.minutes + 1 + ' ';
        result += endsIn.minutes > 1 ? $rootScope.Helium.labels.minutes : $rootScope.Helium.labels.minute;

        return result;
      };

      $rootScope.Helium.state.setVisibleEndNow = function () {
        if ($rootScope.Helium.settingsExtra.readOnlyModeEnabled) {
          return false;
        }

        var endEarlyType = $rootScope.Helium.settings.reservation && $rootScope.Helium.settings.reservation.endEarlyType;
        var currentEvent = $rootScope.Helium.values.mainRoom ? $rootScope.Helium.values.mainRoom.currentEvent : null;

        if (currentEvent === null) return false;

        if (currentEvent && !$rootScope.Helium.settingsExtra.supportsInstanceManipulation && currentEvent.isRecurring) {
          // todo: Set visible state to false for recurring meetings? The button is disabled in the setDisabled function
          return false;
        }

        //Check if the reserved state is due to Availability Threshold mode or Reserved State for Check-in
        if (($rootScope.Helium.settings.room && $rootScope.Helium.settings.room.availabilityThresholdRoomState) ||
          ($rootScope.Helium.settings.display && $rootScope.Helium.settings.display.reservedColorForCheckedIn)) {

          var nextEvent = $rootScope.Helium.values.mainRoom ? $rootScope.Helium.values.mainRoom.nextEvent : null;

          if (nextEvent && currentEvent && nextEvent.id === currentEvent.id) {
            currentEvent.state.visibleEndNow = false;
            return false;
          }
        }

        // 141580 Add check for endEarlyType !== undefined or null
        if ($rootScope.Helium.state.isReserved() && (endEarlyType && endEarlyType.toLowerCase() !== 'off')) {
          var now = new Date();
          var totalMinEvent = DatetimeFactory.getTotalMinutesBetweenDates(currentEvent.dtStart, currentEvent.dtEnd);
          var totalMinPassedEvent = now > currentEvent.dtStart ? DatetimeFactory.getTotalMinutesBetweenDates(currentEvent.dtStart, now) : 0;

          if (endEarlyType.toLowerCase() === 'minutes') {
            var minutes = $rootScope.Helium.settings.reservation.freeUpRoomEnMin;

            if (angular.isNumber(minutes) && totalMinPassedEvent >= minutes) {
              currentEvent.state.visibleEndNow = true;
              return true;
            }
          } else if (endEarlyType.toLowerCase() === 'percentage') {
            var percentage = $rootScope.Helium.settings.reservation.freeUpRoomEnPer;
            var percentageMinEvent;

            if (angular.isNumber(percentage)) {
              // 141890 - Incorrect order of operations not returning correct percentage
              percentageMinEvent = percentage / 100 * totalMinEvent;
            }

            if (angular.isNumber(percentageMinEvent) && totalMinPassedEvent >= percentageMinEvent) {
              currentEvent.state.visibleEndNow = true;
              return true;
            }
          }
        }

        currentEvent.state.visibleEndNow = false;
        return false;
      };

      $rootScope.Helium.state.setDisableEndNow = function () {
        var disableButtons = $rootScope.Helium.state.buttons.disable;
        var isOnline = $rootScope.Helium.state.isOnline;
        var disable = false;

        if (
          $rootScope.Helium.values.mainRoom.currentEvent &&
          !$rootScope.Helium.settingsExtra.supportsInstanceManipulation &&
          $rootScope.Helium.values.mainRoom.currentEvent.isRecurring
        ) {
          disable = true;
        }

        var ret = isOnline ? disable : !isOnline;
        disableButtons.end = ret;
        return ret;
      };

      $rootScope.Helium.state.setVisibleExtendNow = function () {
        if ($rootScope.Helium.settingsExtra.readOnlyModeEnabled) {
          return false;
        }

        var reservation = $rootScope.Helium.settings.reservation;
        var extendReservationType = reservation && reservation.extendReservationType;
        var currentEvent = $rootScope.Helium.values.mainRoom ? $rootScope.Helium.values.mainRoom.currentEvent : null;

        if (currentEvent === null) return false;

        if (currentEvent && !$rootScope.Helium.settingsExtra.supportsInstanceManipulation && currentEvent.isRecurring) {
          // todo: Set visible state to false for recurring meetings? The button is disabled in the setDisabled function
          return false;
        }

        //Check if reserved state is due to Availability Threshold mode or Reserved State for Check-in
        if (($rootScope.Helium.settings.room && $rootScope.Helium.settings.room.availabilityThresholdRoomState) ||
          ($rootScope.Helium.settings.display && $rootScope.Helium.settings.display.reservedColorForCheckedIn)) {

          var nextEvent = $rootScope.Helium.values.mainRoom ? $rootScope.Helium.values.mainRoom.nextEvent : null;

          if (nextEvent && currentEvent && nextEvent.id === currentEvent.id) {
            currentEvent.state.visibleExtendNow = false;
            return false;
          }
        }

        // 141580 Add check for extendReservationType !== undefined or null
        if ($rootScope.Helium.state.isReserved() && (extendReservationType && extendReservationType.toLowerCase() !== 'off')) {
          var now = new Date();
          var totalMinEvent = DatetimeFactory.getTotalMinutesBetweenDates(currentEvent.dtEnd, currentEvent.dtStart);
          var totalMinPassedEvent = now > currentEvent.dtStart ? Math.round(DatetimeFactory.getTotalMinutesBetweenDates(currentEvent.dtStart, now)) : 0;
          var totalMinutesRemaining = totalMinEvent - totalMinPassedEvent;
          var minutes;

          var setExtendNowVisibility = function (mins) {
            if (totalMinutesRemaining <= 0) {
              currentEvent.state.visibleExtendNow = false;
              return false;
            }

            if (mins >= totalMinutesRemaining) {
              currentEvent.state.visibleExtendNow = true;
              return true;
            }

            currentEvent.state.visibleExtendNow = false;
            return false;
          };

          if (extendReservationType.toLowerCase() === 'minutes') {
            minutes = angular.isNumber(reservation.extendReservationMinAfter) ? reservation.extendReservationMinAfter : 0;

            return setExtendNowVisibility(minutes);
          } else if (extendReservationType.toLowerCase() === 'percentage') {
            var percentage = angular.isNumber(reservation.extendReservationPerAfter) ? reservation.extendReservationPerAfter : 0;

            // 141890 - Incorrect order of operations not returning correct percentage
            minutes = Math.max(1, Math.round(percentage / 100 * totalMinEvent));
            return setExtendNowVisibility(minutes);
          }
        }

        currentEvent.state.visibleExtendNow = false;
        return false;
      };

      $rootScope.Helium.state.setDisableExtendNow = function () {
        var disableButtons = $rootScope.Helium.state.buttons.disable;
        var isOnline = $rootScope.Helium.state.isOnline;
        var disable = false;
        var currentEvent = $rootScope.Helium.values.mainRoom.currentEvent;
        var nextEvent = $rootScope.Helium.values.mainRoom.nextEvent;
        var getTotalMinutesBetweenDates = nextEvent && currentEvent ? DatetimeFactory.getTotalMinutesBetweenDates(currentEvent.dtEnd, nextEvent.dtStart) : -1;

        if (
          (currentEvent && !$rootScope.Helium.settingsExtra.supportsInstanceManipulation && currentEvent.isRecurring) ||
          (nextEvent && currentEvent && getTotalMinutesBetweenDates === 0)
        ) {
          disable = true;
        }

        disableButtons.extend = isOnline ? disable : !isOnline;

        return disableButtons.extend;
      };

      function setVisibleCheckInNextEvent() {
        var nextEvent = $rootScope.Helium.values.mainRoom.nextEvent;
        var now;
        var totalMinLeftUntilNextEvent;
        var forceOrgCheckInMin = $rootScope.Helium.settings.automation && $rootScope.Helium.settings.automation.forceOrgCheckInMin;

        if (nextEvent) {
          now = new Date();
          totalMinLeftUntilNextEvent = DatetimeFactory.getTotalMinutesBetweenDates(now, nextEvent.dtStart);

          // Changed comparison operator to time til next meeting <= forceOrgCheckInMin
          // If forceOrgCheckInMin = 10, we want the check in button to appear when the next meeting starts in 10 minutes, not 9
          if (forceOrgCheckInMin && angular.isNumber(forceOrgCheckInMin) && totalMinLeftUntilNextEvent <= forceOrgCheckInMin) {
            nextEvent.state.visibleCheckInNow = true;
            $rootScope.Helium.state.checkInEvent = nextEvent;

            return true;
          } else {
            // console.log('D4NS_Debug: AppState: SetVisibleCheckInNext: Found next event, but not within threshold for check in');
            nextEvent.state.visibleCheckInNow = false;
            $rootScope.Helium.state.checkInEvent = null;

            return false;
          }
        }

        // console.log('D4NS_Debug: AppState: SetVisibleCheckInNext: Next event not found');
        $rootScope.Helium.state.checkInEvent = null;
        return false;
      }

      $rootScope.Helium.state.setVisibleCheckInNow = function () {
        if ($rootScope.Helium.settings.automation && $rootScope.Helium.settings.automation.forceOrgCheckIn) {
          if ($rootScope.Helium.state.isReserved()) {
            var event = $rootScope.Helium.values.mainRoom.currentEvent;
            var now = new Date();
            var totalMinPassedEvent = now > event.dtStart ? DatetimeFactory.getTotalMinutesBetweenDates(event.dtStart, now) : -1;
            var forceOrgCheckInEndMin = $rootScope.Helium.settings.automation.forceOrgCheckInEndMin;

            if (forceOrgCheckInEndMin && angular.isNumber(forceOrgCheckInEndMin)) {
              if (totalMinPassedEvent >= 0 && totalMinPassedEvent < forceOrgCheckInEndMin) {
                event.state.visibleCheckInNow = true;
                $rootScope.Helium.state.checkInEvent = event;
                return true;
              } else if (setVisibleCheckInNextEvent()) {
                event.state.visibleCheckInNow = false;
                return true;
              }
            } else if (setVisibleCheckInNextEvent()) {
              event.state.visibleCheckInNow = false;
              return true;
            }

            event.state.visibleCheckInNow = false;
            $rootScope.Helium.state.checkInEvent = null;
            return false;
          } else if ($rootScope.Helium.state.isAvailable()) {
            // console.log('D4NS_Debug: AppState: SetVisibleCheckIn: Room is available');
            return setVisibleCheckInNextEvent();
          }
        } else {
          $rootScope.Helium.state.checkInEvent = null;
          return false;
        }
      };

      $rootScope.Helium.state.setDisableCheckIn = function () {
        var disableButtons = $rootScope.Helium.state.buttons.disable;
        var isOnline = $rootScope.Helium.state.isOnline;
        var mainRoom = $rootScope.Helium.values.mainRoom;
        var disable = false;

        if (mainRoom.currentEvent && mainRoom.currentEvent.state.visibleCheckInNow) {
          disable = mainRoom.currentEvent.checkedIn;
        } else if (mainRoom.nextEvent && mainRoom.nextEvent.state.visibleCheckInNow) {
          disable = mainRoom.nextEvent.checkedIn;
        }

        var disableBtn = isOnline ? disable : true;
        disableButtons.checkIn = disableBtn;

        return disableButtons.checkIn;
      };

      //This function should really be called forceReservedState()
      //It is checking for conditions like Availability Threshold and Next Meeting Check In
      //If enabled, the conditions will set the UI to the Reserved state, before the meeting actually begins
      $rootScope.Helium.state.setRoomReserved = function () {
        var settings = $rootScope.Helium.settings;

        //Availability Threshold Mode - Set reserved state x minutes before a meeting starts
        var availabilityThresholdModeEnabled = settings.room && settings.room.availabilityThresholdRoomState;
        var availabilityThresholdMin =
          settings.room && settings.room.availabilityThresholdMin
            ? settings.room.availabilityThresholdMin
            : 0;
        var availablilityThresholdStateActive = false;

        //Set Reserved state if next meeting is checked in
        var checkInBeforeMinutes = 0;
        var checkInEnabled = settings.automation && settings.automation.forceOrgCheckIn;
        if (checkInEnabled) {
          checkInBeforeMinutes =
            settings.automation && settings.automation.forceOrgCheckInMin
              ? settings.automation.forceOrgCheckInMin
              : 0;
        }
        var reservedColorForCheckInEnabled = checkInEnabled && settings.display && settings.display.reservedColorForCheckedIn;
        var reservedColorForCheckInStateActive = false;

        var now = new Date().getTime();
        var currentEvent = $rootScope.Helium.values.mainRoom.currentEvent;
        var nextEvent = $rootScope.Helium.values.mainRoom.nextEvent;
        var totalMinLeftUntilNextEvent = nextEvent
          ? DatetimeFactory.getTotalMinutesBetweenDates(now, nextEvent.dtStart)
          : DatetimeFactory.getTotalMinutesBetweenDates(now, DatetimeFactory.getMidnightTommorrow());

        if (availabilityThresholdModeEnabled) {
          //If enabled, and next meeting starts within the threshold, set next meeting as current meeting
          if (angular.isNumber(availabilityThresholdMin) && totalMinLeftUntilNextEvent <= availabilityThresholdMin) {
            console.log('AppStateService: setRoomReserved: Within Availability Thrershold');
            availablilityThresholdStateActive = true;
          }
        }

        if (reservedColorForCheckInEnabled) {
          if (angular.isNumber(checkInBeforeMinutes) && totalMinLeftUntilNextEvent <= checkInBeforeMinutes) {
            if (nextEvent && nextEvent.checkedIn) {
              console.log('AppStateService: setRoomReserved: Next event checked in');
              reservedColorForCheckInStateActive = true;
            }
          }
        }

        //If in the Available state, check for coditions to force the Reserved state
        if ($rootScope.Helium.state.isAvailable()) {
          if (availablilityThresholdStateActive || reservedColorForCheckInStateActive) {
            console.log('AppStateService: setRoomReserved: Availability Threshold State active or Next Meeting is Checked In. Set reserved');
            TimelineService.setCurrentEvent(nextEvent);
          }
        }
        //If the UI is already in a forced Reserved state, check for conditions to revert to Available
        else if ($rootScope.Helium.state.isReserved() && (nextEvent && currentEvent) && (nextEvent.id === currentEvent.id)) {
          if (!availablilityThresholdStateActive && !reservedColorForCheckInStateActive) {
            console.log('AppStateService: setRoomReserved: Availability Threshold State NOT active or enabled, and Reserved State for Checked In NOT active or enabled. Set available');
            TimelineService.setCurrentEvent(null);
          }
        }

        return false;
      };
    };
  }
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/**
 * Background service
 */
(function () {
    'use strict';

    angular
        .module('helium')
        .service('BackgroundService', BackgroundService);

    BackgroundService.$inject = ['$rootScope'];

    function BackgroundService($rootScope) {
        var poster = '',
            containerScreensaverImage,
            containerScreensaverVideo,
            containerRoomImage,
            containerRoomVideo,
            initPoster = function() {
                var defaultPoster = 'assets/images/dark-theme.png';

                if ($rootScope.Helium.state.theme) {
                    poster = 'assets/images/' + $rootScope.Helium.state.theme + '.png';
                }
                poster = $rootScope.Helium.state.vision ? defaultPoster : poster;
            },
            initContainerScreensaver = function () {
                if (!$rootScope.Helium.settings.screenSaverBg) {
                    $rootScope.Helium.settings.screenSaverBg = {
                        img: {},
                        media: {}
                    };
                }

                containerScreensaverImage = $rootScope.Helium.settings.screenSaverBg.img;
                containerScreensaverVideo = $rootScope.Helium.settings.screenSaverBg.media;
            },
            initContainerRoom = function () {
                if (!$rootScope.Helium.settings.roomBg) {
                    $rootScope.Helium.settings.roomBg = {
                        img: {},
                        media: {}
                    };
                }

                containerRoomImage = $rootScope.Helium.settings.roomBg.img;
                containerRoomVideo = $rootScope.Helium.settings.roomBg.media;
            },
            setBackgroundScreensaverImage = function (background) {
                initContainerScreensaver();
                angular.extend(containerScreensaverVideo, { 'video': '', 'type': '', 'poster': '' });
                angular.extend(containerScreensaverImage, { 'src': background });
            },
            setBackgroundScreensaverVideo = function (background) {
                var video = document.getElementsByClassName('screensaver__video');

                initContainerScreensaver();
                initPoster();
                angular.extend(containerScreensaverImage, { 'src': '' });
                angular.extend(containerScreensaverVideo, { 'video': background.url, 'type': background.mediaSubType, 'poster': poster });

                if (video.length) {
                    video[0].load();
                }
            },
            setBackgroundRoomImage = function (background) {
                initContainerRoom();
                angular.extend(containerRoomVideo, { 'video': '', 'type': '', 'poster': '' });
                angular.extend(containerRoomImage, { 'src': background });
            },
            setBackgroundRoomVideo = function (background) {
                var video = document.getElementsByClassName('room__video');

                initContainerRoom();
                initPoster();
                $rootScope.Helium.settings.roomBg.img.src = '';
                angular.extend(containerRoomImage, { 'src': '' });
                angular.extend(containerRoomVideo, { 'video': background.url, 'type': background.mediaSubType, 'poster': poster });
                if (video.length) {
                    video[0].load();
                }
			};

        function setBgScreensaver(background) {
            if (background.mediaType.toLowerCase() === 'image') {
                setBackgroundScreensaverImage(background.url);
            } else if (background.mediaType.toLowerCase() === 'video') {
                setBackgroundScreensaverVideo(background);
            }
        }

        function setBgRoom(background) {
            if (background.mediaType.toLowerCase() === 'image') {
                setBackgroundRoomImage(background.url);
            } else if (background.mediaType.toLowerCase() === 'video') {
                setBackgroundRoomVideo(background);
            }
        }

        this.applyBackground = function () {
            this.setBackground();
        };

        this.setBackground = function () {
            var display = $rootScope.Helium.settings.display,
                backgrounds = display ? display.backgrounds : null;

            if (angular.isObject(backgrounds)) {
                setBackgroundScreensaverImage('assets/images/bg.jpg');
                setBackgroundRoomImage('assets/images/bg.jpg');

                if (!$rootScope.Helium.state.isReserved()) {
                    if ($rootScope.Helium.state.roomOccupied) {
                        if (backgrounds.availableActiveOccupied && backgrounds.availableActiveOccupied.enabled) {
                            setBgRoom(backgrounds.availableActiveOccupied);
                        } else if (backgrounds.availableActive && backgrounds.availableActive.enabled) {
                            setBgRoom(backgrounds.availableActive);
                        }

                        if (backgrounds.availableIdleOccupied && backgrounds.availableIdleOccupied.enabled) {
                            setBgScreensaver(backgrounds.availableIdleOccupied);
                        } else if (backgrounds.availableIdle && backgrounds.availableIdle.enabled) {
                            setBgScreensaver(backgrounds.availableIdle);
                        }
                    } else {
                        if (backgrounds.availableActive && backgrounds.availableActive.enabled) {
                            setBgRoom(backgrounds.availableActive);
                        }
                        if (backgrounds.availableIdle && backgrounds.availableIdle.enabled) {
                            setBgScreensaver(backgrounds.availableIdle);
                        }
                    }
                } else {
                    if (backgrounds.reservedActive && backgrounds.reservedActive.enabled) {
                        setBgRoom(backgrounds.reservedActive);
                    }
                    if (backgrounds.reservedIdle && backgrounds.reservedIdle.enabled) {
                        setBgScreensaver(backgrounds.reservedIdle);
                    }
                }
            } else {
                setBackgroundScreensaverImage('assets/images/bg.jpg');
                setBackgroundRoomImage('assets/images/bg.jpg');
            }
        };
    }
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/**
 * Communication service with SchedulePanel
 */
(function () {
    'use strict';

    angular
        .module('helium')
        .service('CommunicationService', CommunicationService);

    function CommunicationService() {
        var SPC = SchedulingPanel.webUI;
        var actionWaitCallback = function ( callback ) {
                var callbackWait = function () {
                    SPC.unsubscribe.data.timeline(callbackWait);
                    SPC.unsubscribe.data.providerStatus(callbackWait);
                    callback();
                };

                SPC.subscribe.data.timeline(callbackWait, false);
                SPC.subscribe.data.providerStatus(callbackWait, false);
            };

        this.listenForConfig = function (callback) {
            SPC.subscribe.data.config(callback);
        };

        // Not used. The language comes in with the config update
        this.listenForLanguage = function (callback) {
            SPC.subscribe.data.language(callback);
        };

        this.listenForTimeline = function (callback) {
            SPC.subscribe.data.timeline(callback);
        };

        this.listenForProviderStatus = function (callback) {
            SPC.subscribe.data.providerStatus(callback);
        };

        this.listenForEvents = function (callback) {
            SPC.subscribe.data.events(callback);
        };

        this.sendExtendEvent = function (meetingId, instanceId, duration, callback) {
            SPC.send.action.extendEvent(meetingId.toString(), instanceId === null ? null : instanceId.toString(), duration.toString(), function (success, data) {
                if (success) {
                    actionWaitCallback(function () {
                        callback(success, data);
                    });
                } else {
                    callback(success, data);
                }
            });
        };

        this.sendEndEvent = function (meetingId, instanceId, callback) {
            SPC.send.action.endEvent(meetingId.toString(), instanceId === null ? null : instanceId.toString(), function (success, data) {
                if (success) {
                    actionWaitCallback(function () {
                        callback(success, data);
                    });
                } else {
                    callback(success, data);
                }
            });
        };

        this.sendCreateEvent = function (timeline, roomId, subject, organizer, startDate, endDate, callback) {
            SPC.send.action.createEvent(
                timeline,
                roomId === null ? null : roomId.toString(),
                subject.toString(),
                organizer.toString(),
                startDate.getTime(),
                endDate.getTime(),
                function (success, data) {
                    if (success && roomId === null) {
                        actionWaitCallback(function () {
                            callback(success, data);
                        });
                    } else {
                        callback(success, data);
                    }
                });
        };

        this.sendRoomSearch = function (roomId, callback) {
            SPC.send.action.roomSearch(roomId.toString(), callback);
        };

        this.sendDetailsEvent = function (eventId, instanceId, callback) {
            SPC.send.action.detailsEvent(eventId.toString(), instanceId === null ? null : instanceId.toString(), callback);
        };

        this.sendCheckInEvent = function (meetingId, instanceId, callback) {
            SPC.send.action.checkInEvent(meetingId.toString(), instanceId === null ? null : instanceId.toString(), callback);
        };

        this.sendOpenSettings = function () {
            SPC.send.action.openSettings();
        };

        this.sendAbout = function (callback) {
            SPC.send.action.statusScreenInfo(callback);
        };

        this.sendRefreshSchedule = function (callback) {
            SPC.send.action.refreshSchedule(callback);
        };
    }
})();
;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/**
 * Layout service
 *
 * Updates the layout of the application
 */
(function () {
    'use strict';

    angular
        .module('helium')
        .service('LayoutService', LayoutService);

    LayoutService.$inject = ['$rootScope'];

    function LayoutService($rootScope) {
        this.updateLayout = function (verticalLayout) {
            var newLayout = verticalLayout ? 'vertical' : 'horizontal';

            /* Forcing layout to 'portrait here if state.portraitPanel (set in appState.js setTimelineBlockDimensions) is true.  */
            if ($rootScope.Helium.state.portraitPanel) {
                newLayout = 'portrait';
            }

            $rootScope.Helium.state.layout = newLayout;
            localStorage.setItem('layout', newLayout);
        };

        this.loadLayout = function () {
            $rootScope.Helium.state.layout = localStorage.getItem('layout') || 'horizontal';
        };
    }
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

(function () {
  'use strict';

  angular
    .module('helium')
    .service('LocalizationService', LocalizationService);

  LocalizationService.$inject = ['$rootScope', 'tmhDynamicLocale', '$http', 'AppConfig', '$route'];

  function LocalizationService($rootScope, tmhDynamicLocale, $http, AppConfig, $route) {
    var _lang;
    function setLabels(labels) {
      $rootScope.Helium.labels = labels;
    }

    function getLabels(language) {
      return $http.get('assets/translations/' + language + '.json');
    }

    this.changeLanguage = function (settings, callback) {
      var lang = settings.language,
        rtl = settings.rtl,
        setLanguage = function () {
          tmhDynamicLocale.set(lang);
          AppConfig.arabicLanguage = (lang === 'iw' || lang === 'he' || lang === 'ar');
          $rootScope.Helium.state.isArabic = AppConfig.arabicLanguage;
          $rootScope.isRtl = rtl;
        };

      lang = lang || 'en-us';
      lang = lang.toLowerCase().split('_').join('-');

      getLabels(lang).then(function (response) {
        _lang = lang;
        setLanguage();
        setLabels(response.data);
        $route.reload();
        callback();
      }, function () {
        getLabels(_lang || 'en-us').then(function (response) {
          setLanguage();
          setLabels(response.data);
          $route.reload();
          callback();
        }, function () {
          callback();
        });
      });
    };
  }
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/**
 * Communication service with SchedulePanel
 */
(function () {
    'use strict';

    angular
        .module('helium')
        .service('ModalService', ModalService);

    ModalService.$inject = ['$uibModalStack'];

    function ModalService($uibModalStack) {
        this.closeAll = function () {
            $uibModalStack.dismissAll();
        };
    }

} )( );;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

(function() {
    'use strict';

    angular
        .module('helium')
        .service('SettingsService', SettingsService);

    SettingsService.$inject = ['$rootScope', 'AppConfig', 'LayoutService', 'ThemeService'];

    function SettingsService($rootScope, AppConfig, LayoutService, ThemeService) {
        var _settings,
            _settingsExtra,
            initialization = 0; //0 not setup, 1-init first time 2- not first init

        function overwriteSettings() {
            $rootScope.Helium.settings = angular.extend(
                {},
                _settings.settings,
                {
                    countDownScreenSaver: _settings.settings && _settings.settings.room && _settings.settings.room.idleTimeoutMinutes ? _settings.settings.room.idleTimeoutMinutes * 60 * 1000 : AppConfig.screenSaverDelay
                });

            //Set the {values.roomName} variable to the value of {settings.room.name}. UI elements are bound to the former
            if(_settings.settings && _settings.settings.room) {
              if (_settings.settings.room.name) {
                $rootScope.Helium.values.roomName = _settings.settings.room.name;
              }
              if (_settings.settings.room.enableAvailableOccupiedState !== null) {
                $rootScope.Helium.settings.room.enableAvailableOccupiedState = _settings.settings.room.enableAvailableOccupiedState;
              }
            }
        }

        this.isFirstInitialization = function () {
            return initialization === 1;
        };

        this.applySettings = function (config) {
            if (config) {
                var room = config.settings.room;

                // TimeFormat === false is 24hr format - ex. 13:45:00
                if (room.timeFormat) {
                    room.timeFormat = 'h:mm a';
                    room.hoursFormat = 'h';
                    room.hoursAmpmFormat = 'h a';
                    room.ampmFormat = 'a';
                } else {
                    room.timeFormat = 'HH:mm';
                    room.hoursFormat = 'HH';
                    room.hoursAmpmFormat = 'HH';
                    room.ampmFormat = '';
                }

                room.minutesFormat = 'mm';

                switch (room.dateFormat) {
                    case ('WMDY'):
                        room.dateFormat = $rootScope.Helium.state.isArabic ? ' y, EEEE, dd MMMM' : 'EEEE, MMMM dd, y';
                        break;
                    case ('WDMY'):
                        room.dateFormat = $rootScope.Helium.state.isArabic ? 'EEEE, y-MMMM-dd' : 'EEEE, dd-MMMM-y';
                        break;
                    case ('WYMD'):
                        room.dateFormat = $rootScope.Helium.state.isArabic ? 'EEEE, dd-MMMM-y' : 'EEEE, y-MMMM-dd';
                        break;
                    case ('WMD'):
                        room.dateFormat = $rootScope.Helium.state.isArabic ? 'EEEE, dd MMMM' : 'EEEE, MMMM dd';
                        break;
                    case ('WDM'):
                        room.dateFormat = $rootScope.Helium.state.isArabic ? 'EEEE, MMMM-dd' : 'EEEE, dd-MMMM';
                        break;
                    case ('MDY'):
                        room.dateFormat = $rootScope.Helium.state.isArabic ? 'y, dd MMMM' : 'MMMM dd, y';
                        break;
                    case ('DMY'):
                        room.dateFormat = $rootScope.Helium.state.isArabic ? 'y-MMMM-dd' : 'dd-MMMM-y';
                        break;
                    case ('YMD'):
                        room.dateFormat = $rootScope.Helium.state.isArabic ? 'dd-MMMM-y' : 'y-MMMM-dd';
                        break;
                    case ('M.DY'):
                        room.dateFormat = $rootScope.Helium.state.isArabic ? 'y dd MMMM' : 'MMMM.dd y';
                        break;
                    case ('D.MY'):
                        room.dateFormat = $rootScope.Helium.state.isArabic ? 'y MMMM.dd' : 'dd.MMMM y';
                        break;
                    default:
                        room.dateFormat = $rootScope.Helium.state.isArabic ? 'EEEE, y, dd MMMM' : 'fullDate';
                        break;
                }

                _settings = config;
                overwriteSettings();
                this.applySettingsExtras($rootScope.Helium.settings.extras);

                ThemeService.loadTheme(room.theme);
                LayoutService.updateLayout(room.verticalOrientation);
                this.applyCustomCss(room.styleOverrideUrl);
                if (initialization < 2)
                    initialization++;
            }
        };

        this.applySettingsExtras = function (obj) {
            _settingsExtra = obj;
            $rootScope.Helium.settingsExtra = angular.extend({}, _settingsExtra);
        };

        this.applyCustomCss = function (url) {
            if (url) {
                $rootScope.Helium.state.customCss = url + '?v=' + new Date().getTime();
            } else {
                $rootScope.Helium.state.customCss = 'custom.css';
            }
        };

        this.setNeedsPin = function (config) {
            var accessControl = config.settings.accessControl;

            if (accessControl &&
                accessControl.securityLevel &&
                accessControl.securityLevel.toLowerCase() === 'anonymous') {
                $rootScope.Helium.state.needPin = false;
            } else {
                $rootScope.Helium.state.needPin = true;
            }
        };

        this.applyProviderState = function (obj) {
            var data = obj.data;

            $rootScope.Helium.state.isOnline = data.isOnline;
            $rootScope.Helium.state.needsAuthorization = data.needsAuthorization;
            $rootScope.Helium.state.offlineLimit = data.offlineLimit;
            $rootScope.Helium.state.roomOccupied = data.roomOccupied;

            if ($rootScope.Helium.state.offlineLimit) {
                $rootScope.$evalAsync(function () {
                    $rootScope.Helium.methods.openPage('room');
                });
            }
        };
    }
} )( );;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */


/**
 * Template service
 */
( function( ) {
    'use strict';

    angular
        .module( 'helium' )
        .service( 'templateService', TemplateService );

    TemplateService.$inject =  [ '$templateCache', 'AppConfig' ];

    function TemplateService ( $templateCache, AppConfig ) {
        this.getPageTemplateUrl = function ( page ) {
            var template = AppConfig.template,
                isArabicTemplate = AppConfig.arabicLanguage &&
                        $templateCache.get(template.pageFolderPath + page + template.arabicTemplateSuffix + '.html') !== undefined,
                url = template.pageFolderPath + page + (isArabicTemplate ? template.arabicTemplateSuffix : '') +'.html';

            return $templateCache.get(url) !== undefined ? url : null;
        };

        this.getModalTemplateUrl = function ( modal ) {
            var template = AppConfig.template,
                isArabicTemplate = AppConfig.arabicLanguage &&
                        $templateCache.get(template.modalFolderPath + modal + template.arabicTemplateSuffix + '.html') !== undefined,
                url = template.modalFolderPath + modal + (isArabicTemplate ? template.arabicTemplateSuffix : '') +'.html'; 
            
            return $templateCache.get(url) !== undefined ? url : null;
        };
    }

} )( );

;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

/**
 * Theme service
 *
 * Updates the theme of the application
 */
( function( ) {
    'use strict';

    angular
        .module( 'helium' )
        .service( 'ThemeService', ThemeService );

    ThemeService.$inject = [ '$rootScope' ];

    function ThemeService( $rootScope ) {
        this.updateTheme = function( theme ) {
            if ( !$rootScope.Helium.state.vision ) {
                this.loadTheme( );
            } else {
                $rootScope.Helium.state.theme = theme;
            }
        };

        this.loadTheme = function( theme ) {
            $rootScope.Helium.state.theme = theme ? theme : localStorage.getItem( 'theme' ) || 'dark-theme';
            localStorage.setItem( 'theme', $rootScope.Helium.state.theme );
        };
    }
})();;/**
 * This software development kit (SDK) consisting of HTML and JavaScript sample code is licensed under the general terms of Crestron’s Software Development Tools
 * License Agreement, with the exception that you are granted permission to redistribute derivative works of the provided sample code in source code format.
 * This license is located at http://www.crestron.com/legal/software-license-agreement.  This SDK can be used to customize the user experience with Crestron scheduling panels.
 * If edited in a way that’s contrary to our instructions, this SDK could result in unexpected behavior and a diminished user experience.
 */

(function () {
  'use strict';

  angular
    .module('helium')
    .service('TimelineService', TimelineService);

  TimelineService.$inject = ['$rootScope', 'DatetimeFactory', 'AppClockService', 'UtilFactory', 'BackgroundService'];

  function TimelineService($rootScope, DatetimeFactory, AppClockService, UtilFactory, BackgroundService) {
    var initialized = false;
    var me = this;

    this.applyPrivacyLevelEvent = function (event) {
      if (event.privacyLevel !== null && event.privacyLevel.toLowerCase() !== 'public') {
        event.subject = $rootScope.Helium.labels.private;

        if (event.privacyLevel.toLowerCase() === 'private') {
          event.organizer = $rootScope.Helium.labels.private;
        }
      }
      return event;
    };

    /**
    * Return an array containing a range of elements.
    * @function TimelineService#generateAvailableExtendTime.
    * @param {Number} startDate - Start date of the sequence.
    * @param {Number} endDate - End date of the sequence.
    * @param {Number} step - The step it will be used as the increment between elements in the sequence (minutes)
    *                        If not specified, step will default to milissecond .
   */
    this.generateAvailableExtendTime = function (startDate, endDate, step) {
      var ret = [];
      var value = 0;
        //Todo: Check for proper implementation. Should maxAllowMin be bounded by (maxMeetingLength - duration)?
      var maximumAllowMin = $rootScope.Helium.settings.reservation.reserveNowMaxDur || 120;
      var originalStartDate = new Date(startDate);
      var endDateMaximumAllow = new Date(new Date(startDate).setMinutes(startDate.getMinutes() + maximumAllowMin));

      endDate = new Date(Math.min(
        endDate ? endDate.getTime() : Infinity,
        endDateMaximumAllow.getTime(),
        DatetimeFactory.getMidnightTommorrow().getTime()
      ));

      while (startDate < endDate) {
        startDate = new Date(startDate.getTime() + step * 60000);
        if (startDate <= endDate) {
          value = value + step;
        } else {
          //This creates a final extend time in the list for the "max time" if that time is not a multiple of "step"
          //For example, if there is a next meeting starting 37 minutes after the end of the current meeting...
          //If "step" is 15, the extend times would be 15, 30, 37
          value = DatetimeFactory.getTotalMinutesBetweenDates(originalStartDate.getTime(), endDate.getTime());
        }
        ret.push(value);
      }

      return ret;
    };

    /**
     * Init values object and set room details.
     * @function TimelineService#initValues.
     * @param {object} timeline - The timeline event data sent by the APK.
    */
    this.initValues = function (timeline) {
      var events = timeline.events || [],
        event,
        i;

      $rootScope.Helium.values.roomId = timeline.roomId;
      $rootScope.Helium.values.roomName = timeline.roomName;
      $rootScope.Helium.values.mainRoom = $rootScope.Helium.values.mainRoom || {};
      $rootScope.Helium.values.mainRoom.events = $rootScope.Helium.values.mainRoom.events || [];
      $rootScope.Helium.values.mainRoom.events.splice(0, $rootScope.Helium.values.mainRoom.events.length);
      for (i = 0; i < events.length; i++) {
        event = events[i];
        event.dtStart = new Date(event.dtStart);
        event.dtEnd = new Date(event.dtEnd);
        event.instanceId = UtilFactory.isString(event.instanceId) ? event.instanceId : null;
        $rootScope.Helium.values.mainRoom.events.push(events[i]);

        this.applyPrivacyLevelEvent(event);
      }

      return $rootScope.Helium.values;
    };

    /**
     * Return current event if exists on the timeline
     *
     * @function TimelineService#getCurrentEvent.
     * @param {object} events - The new params send by android.
    */
    this.getCurrentEvent = function (events) {
      var currentEvent = null;
      var i;
      var event;
      var now = new Date();

      if (events && events.length > 0) {
        for (i = 0; i < events.length; i++) {
          event = events[i];

          if (event.dtStart <= now && now < event.dtEnd) {
            currentEvent = event;
            break;
          }
        }
      }

      return currentEvent;
    };

    /**
     * Return next event if exists on timeline
     *
     * @function TimelineService#getNextEvent.
     * @param {object} events - The new events send by android.
    */
    this.getNextEvent = function (events) {
      var nextEvent = null,
        i,
        event,
        now = new Date();

      if (events && events.length > 0) {
        for (i = 0; i < events.length; i++) {
          event = events[i];

          if (now < event.dtStart) {
            nextEvent = event;
            break;
          }
        }
      }

      return nextEvent;
    };


    /**
     * Set current event object.
     * @function TimelineService#setCurrentEvent.
     * @param {object} event - The event
    */
    this.setCurrentEvent = function (event) {
      if (event) {
        $rootScope.Helium.values.mainRoom.currentEvent = {
          id: event.id,
          subject: event.subject,
          organizer: event.organizer,
          dtStart: new Date(event.dtStart),
          dtEnd: new Date(event.dtEnd),
          checkedIn: event.checkedIn,
          state: {
            countdown: DatetimeFactory.getRoundTimeLeftTill(event.dtEnd),
            maxExtend: 0,
            visibleEndNow: false,
            visibleExtendNow: false,
            visibleCheckInNow: false
          },
          instanceId: UtilFactory.isString(event.instanceId) ? event.instanceId : null,
          isRecurring: event.isRecurring,
          privacyLevel: event.privacyLevel || 'public'
        };
      } else {
        $rootScope.Helium.values.mainRoom.currentEvent = null;
        $rootScope.$broadcast('currentEvent', null);
      }

      if ($rootScope.Helium.values.mainRoom.currentEvent) {
        this.applyPrivacyLevelEvent($rootScope.Helium.values.mainRoom.currentEvent);
      }
      BackgroundService.applyBackground();
    };

    /**
     * Set next event object.
     * @function TimelineService#setNextEvent.
     * @param {object} event - The event
    */
    this.setNextEvent = function (event) {
      $rootScope.Helium.values.mainRoom.nextEvent = event ?
        {
          id: event.id,
          subject: event.subject,
          organizer: event.organizer,
          dtStart: new Date(event.dtStart),
          dtEnd: new Date(event.dtEnd),
          checkedIn: event.checkedIn,
          state: {
            countdown: DatetimeFactory.getRoundTimeLeftTill(event.dtStart),
            visibleCheckInNow: false
          },
          isRecurring: event.isRecurring,
          instanceId: UtilFactory.isString(event.instanceId) ? event.instanceId : null,
          privacyLevel: event.privacyLevel || 'public'
        } : null;

      if ($rootScope.Helium.values.mainRoom.nextEvent) {
        this.applyPrivacyLevelEvent($rootScope.Helium.values.mainRoom.nextEvent);
      }
    };

    this.refreshStateOnCurrentMeeting = function () {
      var mainRoom = $rootScope.Helium.values.mainRoom;
      var currentEvent = mainRoom.currentEvent;
      var nextEvent = mainRoom.nextEvent;
      var state;

      if (currentEvent) {
        state = currentEvent.state;

        //Check for Availability Threshold state before setting max Extend
        if (nextEvent && (currentEvent.id === nextEvent.id)) {
          state.maxExtend = 0;
        } else {
          if (!nextEvent) {
            state.maxExtend = 90;
          } else {
            var maxMinutes = Math.min(90, DatetimeFactory.getTotalMinutesBetweenDates(
              currentEvent.dtEnd,
              nextEvent.dtStart
            ));

            state.maxExtend = maxMinutes;

            if (state.maxExtend < 1) {
              state.maxExtend = 0;
            }
          }
        }
      }
    };

    this.createIntervalRefresh = function () {
      initialized = true;
      AppClockService.subscribe(function () {
        var mainRoom = $rootScope.Helium.values.mainRoom,
          mainRoomCurrentEvent = mainRoom.currentEvent || {},
          mainRoomNextEvent = mainRoom.nextEvent || {};

        if (mainRoomCurrentEvent.dtEnd)
          mainRoomCurrentEvent.state.countdown = DatetimeFactory.getRoundTimeLeftTill(mainRoomCurrentEvent.dtEnd.getTime());
        if (mainRoomNextEvent.dtEnd)
          mainRoomNextEvent.state.countdown = DatetimeFactory.getRoundTimeLeftTill(mainRoomNextEvent.dtStart.getTime());

        me.refreshStateOnCurrentMeeting();
      });
    };

    /**
     * Set the main room timeline
     * @function TimelineService#applyRoomTimeline.
     * @param {object} timeline - The new params send by android.
    */
    this.applyRoomTimeline = function (timeline) {
      this.initValues(timeline);

      var currentEvent = this.getCurrentEvent(timeline.events);
      this.setCurrentEvent(currentEvent);

      this.refreshStateOnCurrentMeeting();
    };

    /**
     * Set the main room events (current and next events)
     * @function TimelineService#setRoomEvents.
     *
     * @param {object} events - The new params send by android.
    */
    this.applyRoomEvents = function (events) {
      this.setNextEvent(events.nextEvent);
      this.setCurrentEvent(events.currentEvent);
      this.refreshStateOnCurrentMeeting();
      if (!initialized) {
        this.createIntervalRefresh();
      }
    };

    this.isReserved = function () {
      var currentEvent = $rootScope.Helium.values.mainRoom.currentEvent;

      return (currentEvent !== null);
    };

    this.isAvailable = function () {
      var currentEvent = $rootScope.Helium.values.mainRoom.currentEvent,
        nextEvent = $rootScope.Helium.values.mainRoom.nextEvent;

      return (currentEvent === null && nextEvent !== null);
    };

    this.isAvailableForTheRestOfTheDay = function () {
      var nextEvent = $rootScope.Helium.values.mainRoom.nextEvent;
      var currentEvent = $rootScope.Helium.values.mainRoom.currentEvent;

      return (currentEvent === null && nextEvent === null);
    };
  }
})();
