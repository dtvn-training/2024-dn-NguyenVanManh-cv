document.addEventListener('DOMContentLoaded', function() {
    var timelines = document.querySelectorAll('.cd-horizontal-timeline');
    var eventsMinDistance = 60;

    if (timelines.length > 0) {
        initTimeline(timelines);
    }

    function initTimeline(timelines) {
        timelines.forEach(function(timeline) {
            var timelineComponents = {};

            timelineComponents['timelineWrapper'] = timeline.querySelector('.events-wrapper');
            timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].querySelector('.events');
            timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].querySelector('.filling-line');
            timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].querySelectorAll('a');
            timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
            timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
            timelineComponents['timelineNavigation'] = timeline.querySelector('.cd-timeline-navigation');
            timelineComponents['eventsContent'] = timeline.querySelector('.events-content');

            setDatePosition(timelineComponents, eventsMinDistance);
            var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
            timeline.classList.add('loaded');

            timelineComponents['timelineNavigation'].querySelector('.next').addEventListener('click', function(event) {
                event.preventDefault();
                updateSlide(timelineComponents, timelineTotWidth, 'next');
            });

            timelineComponents['timelineNavigation'].querySelector('.prev').addEventListener('click', function(event) {
                event.preventDefault();
                updateSlide(timelineComponents, timelineTotWidth, 'prev');
            });

            timelineComponents['eventsWrapper'].addEventListener('click', function(event) {
                if (event.target.tagName === 'A') {
                    event.preventDefault();
                    timelineComponents['timelineEvents'].forEach(function(eventItem) {
                        eventItem.classList.remove('selected');
                    });
                    event.target.classList.add('selected');
                    updateOlderEvents(event.target);
                    updateFilling(event.target, timelineComponents['fillingLine'], timelineTotWidth);
                    updateVisibleContent(event.target, timelineComponents['eventsContent']);
                }
            });

            timelineComponents['eventsContent'].addEventListener('swipeleft', function() {
                var mq = checkMQ();
                (mq === 'mobile') && showNewContent(timelineComponents, timelineTotWidth, 'next');
            });

            timelineComponents['eventsContent'].addEventListener('swiperight', function() {
                var mq = checkMQ();
                (mq === 'mobile') && showNewContent(timelineComponents, timelineTotWidth, 'prev');
            });

            document.addEventListener('keyup', function(event) {
                if (event.which === 37 && elementInViewport(timeline)) {
                    showNewContent(timelineComponents, timelineTotWidth, 'prev');
                } else if (event.which === 39 && elementInViewport(timeline)) {
                    showNewContent(timelineComponents, timelineTotWidth, 'next');
                }
            });
        });
    }

    function updateSlide(timelineComponents, timelineTotWidth, string) {
        var translateValue = getTranslateValue(timelineComponents['eventsWrapper']);
        var wrapperWidth = Number(window.getComputedStyle(timelineComponents['timelineWrapper']).getPropertyValue('width').replace('px', ''));
        (string === 'next')
            ? translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth)
            : translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
    }

    function showNewContent(timelineComponents, timelineTotWidth, string) {
        var visibleContent = timelineComponents['eventsContent'].querySelector('.selected');
        var newContent = (string === 'next') ? visibleContent.nextElementSibling : visibleContent.previousElementSibling;

        if (newContent) {
            var selectedDate = timelineComponents['eventsWrapper'].querySelector('.selected');
            var newEvent = (string === 'next') ? selectedDate.parentElement.nextElementSibling.querySelector('a') : selectedDate.parentElement.previousElementSibling.querySelector('a');

            updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotWidth);
            updateVisibleContent(newEvent, timelineComponents['eventsContent']);
            newEvent.classList.add('selected');
            selectedDate.classList.remove('selected');
            updateOlderEvents(newEvent);
            updateTimelinePosition(string, newEvent, timelineComponents, timelineTotWidth);
        }
    }

    function updateTimelinePosition(string, event, timelineComponents, timelineTotWidth) {
        var eventStyle = window.getComputedStyle(event);
        var eventLeft = Number(eventStyle.getPropertyValue('left').replace('px', ''));
        var timelineWidth = Number(window.getComputedStyle(timelineComponents['timelineWrapper']).getPropertyValue('width').replace('px', ''));
        var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

        if ((string === 'next' && eventLeft > timelineWidth - timelineTranslate) || (string === 'prev' && eventLeft < -timelineTranslate)) {
            translateTimeline(timelineComponents, -eventLeft + timelineWidth / 2, timelineWidth - timelineTotWidth);
        }
    }

    function translateTimeline(timelineComponents, value, totWidth) {
        var eventsWrapper = timelineComponents['eventsWrapper'];
        value = (value > 0) ? 0 : value;
        value = (!(typeof totWidth === 'undefined') && value < totWidth) ? totWidth : value;
        setTransformValue(eventsWrapper, 'translateX', value + 'px');

        if (value === 0) {
            timelineComponents['timelineNavigation'].querySelector('.prev').classList.add('inactive');
        } else {
            timelineComponents['timelineNavigation'].querySelector('.prev').classList.remove('inactive');
        }

        if (value === totWidth) {
            timelineComponents['timelineNavigation'].querySelector('.next').classList.add('inactive');
        } else {
            timelineComponents['timelineNavigation'].querySelector('.next').classList.remove('inactive');
        }
    }

    function updateFilling(selectedEvent, filling, totWidth) {
        var eventStyle = window.getComputedStyle(selectedEvent);
        var eventLeft = eventStyle.getPropertyValue('left');
        var eventWidth = eventStyle.getPropertyValue('width');
        eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', '')) / 2;
        var scaleValue = eventLeft / totWidth;
        setTransformValue(filling, 'scaleX', scaleValue);
    }

    function setDatePosition(timelineComponents, min) {
        for (var i = 0; i < timelineComponents['timelineDates'].length; i++) {
            var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]);
            var distanceNorm = Math.round(distance / timelineComponents['eventsMinLapse']) + 2;
            timelineComponents['timelineEvents'][i].style.left = distanceNorm * min + 'px';
        }
    }

    function setTimelineWidth(timelineComponents, width) {
        var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length - 1]);
        var timeSpanNorm = timeSpan / timelineComponents['eventsMinLapse'];
        timeSpanNorm = Math.round(timeSpanNorm) + 4;
        var totalWidth = timeSpanNorm * width;
        timelineComponents['eventsWrapper'].style.width = totalWidth + 'px';
        updateFilling(timelineComponents['timelineEvents'][0], timelineComponents['fillingLine'], totalWidth);

        return totalWidth;
    }

    function updateVisibleContent(event, eventsContent) {
        var eventDate = event.dataset.date;
        var visibleContent = eventsContent.querySelector('.selected');
        var selectedContent = eventsContent.querySelector('[data-date="' + eventDate + '"]');
        var selectedContentHeight = selectedContent.offsetHeight;

        if (selectedContent.index > visibleContent.index) {
            var classEntering = 'selected enter-right';
            var classLeaving = 'leave-left';
        } else {
            var classEntering = 'selected enter-left';
            var classLeaving = 'leave-right';
        }

        selectedContent.setAttribute('class', classEntering);
        visibleContent.setAttribute('class', classLeaving);

        visibleContent.addEventListener('webkitAnimationEnd', function() {
            visibleContent.classList.remove('leave-right', 'leave-left');
            selectedContent.classList.remove('enter-left', 'enter-right');
        });

        eventsContent.style.height = selectedContentHeight + 'px';
    }

    function updateOlderEvents(event) {
        var eventParent = event.parentElement;
        eventParent.querySelectorAll('li').forEach(function(li) {
            var link = li.querySelector('a');
            link.classList.remove('older-event');
        });

        eventParent.previousElementSibling.querySelectorAll('li').forEach(function(li) {
            var link = li.querySelector('a');
            link.classList.add('older-event');
        });

        eventParent.nextElementSibling.querySelectorAll('li').forEach(function(li) {
            var link = li.querySelector('a');
            link.classList.remove('older-event');
        });
    }

    function getTranslateValue(timeline) {
        var timelineStyle = window.getComputedStyle(timeline);
        var timelineTranslate = timelineStyle.getPropertyValue('-webkit-transform') ||
            timelineStyle.getPropertyValue('-moz-transform') ||
            timelineStyle.getPropertyValue('-ms-transform') ||
            timelineStyle.getPropertyValue('-o-transform') ||
            timelineStyle.getPropertyValue('transform');

        if (timelineTranslate.indexOf('(') >= 0) {
            timelineTranslate = timelineTranslate.split('(')[1];
            timelineTranslate = timelineTranslate.split(')')[0];
            timelineTranslate = timelineTranslate.split(',');
            var translateValue = timelineTranslate[4];
        } else {
            var translateValue = 0;
        }

        return Number(translateValue);
    }

    function setTransformValue(element, property, value) {
        element.style['-webkit-transform'] = property + '(' + value + ')';
        element.style['-moz-transform'] = property + '(' + value + ')';
        element.style['-ms-transform'] = property + '(' + value + ')';
        element.style['-o-transform'] = property + '(' + value + ')';
        element.style['transform'] = property + '(' + value + ')';
    }

    function parseDate(events) {
        var dateArrays = [];
        events.forEach(function(event) {
            var dateComp = event.dataset.date.split('/');
            var newDate = new Date(dateComp[2], dateComp[1] - 1, dateComp[0]);
            dateArrays.push(newDate);
        });
        return dateArrays;
    }

    function daydiff(first, second) {
        return Math.round((second - first));
    }

    function minLapse(dates) {
        var dateDistances = [];
        for (var i = 1; i < dates.length; i++) {
            var distance = daydiff(dates[i - 1], dates[i]);
            dateDistances.push(distance);
        }
        return Math.min.apply(null, dateDistances);
    }

    function elementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }

    function checkMQ() {
        return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, '').replace(/"/g, '');
    }
});
