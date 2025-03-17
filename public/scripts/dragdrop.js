var DragDropFunctions =
    {
        dragoverqueue: [],
        GetMouseBearingsPercentage: function ($element, elementRect, mousePos) {
            if (!elementRect)
                elementRect = $element.get(0).getBoundingClientRect();
            var mousePosPercent_X = ((mousePos.x - elementRect.left) / (elementRect.right - elementRect.left)) * 100;
            var mousePosPercent_Y = ((mousePos.y - elementRect.top) / (elementRect.bottom - elementRect.top)) * 100;

            return { x: mousePosPercent_X, y: mousePosPercent_Y };
        },
        OrchestrateDragDrop: function ($element, elementRect, mousePos, validDropZone) {
            //If no element is hovered or element hovered is the placeholder -> not valid -> return false;
            
            if (!$element || $element.length == 0 || !elementRect || !mousePos)
                return false;

            if ($element.is('html'))
                $element = $element.find('body');
            //Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]
            var breakPointNumber = { x: 5, y: 5 };

            var mousePercents = this.GetMouseBearingsPercentage($element, elementRect, mousePos);


           // console.log($element); console.log(mousePercents); console.log((mousePercents.x > breakPointNumber.x && mousePercents.x < breakPointNumber.x) && (mousePercents.y > breakPointNumber.y && mousePercents.y < breakPointNumber.y));

            if ($element.is('.content')){
                return this.PlaceInside($element, validDropZone);
            } else if ((mousePercents.x > breakPointNumber.x && mousePercents.x < 100 - breakPointNumber.x) && (mousePercents.y > breakPointNumber.y && mousePercents.y < 100 - breakPointNumber.y)) {
                //Case 1 -
                $tempelement = $element.clone();
                $tempelement.find(".drop-marker").remove();

                if ($tempelement.html().trim() == "" && $element.is(validDropZone)) {
                    if (mousePercents.y < 90)
                        return this.PlaceInside($element, validDropZone);
                } else {
                    if ($tempelement.children().length == 0) {
                        this.DecideBeforeAfter($element.closest('[data-type]'), mousePercents, undefined, validDropZone);
                    }
                    //else if ($tempelement.children().length == 1) {
                    //    this.DecideBeforeAfter($element.closest('[data-type]').children(":not(.drop-marker,[data-dragcontext-marker])").first(), mousePercents, validDropZone);
                    //}
                    else {
                        var positionAndElement = this.findNearestElement($element, mousePos.x, mousePos.y);
                        this.DecideBeforeAfter(positionAndElement.el.closest('[data-type]'), mousePercents, mousePos, validDropZone);
                    }
                }
            }
            else if ((mousePercents.x <= breakPointNumber.x) || (mousePercents.y <= breakPointNumber.y)) {
                var validElement = null
                if (mousePercents.y <= mousePercents.x)
                    validElement = this.FindValidParent($element, 'top');
                else
                    validElement = this.FindValidParent($element, 'left');

                if (!validElement || validElement.length == 0) return false;
                this.DecideBeforeAfter(validElement, mousePercents, mousePos, validDropZone);
            }
            else if ((mousePercents.x >= 100 - breakPointNumber.x) || (mousePercents.y >= 100 - breakPointNumber.y)) {
                var validElement = null
                if (mousePercents.y >= mousePercents.x)
                    validElement = this.FindValidParent($element, 'bottom');
                else
                    validElement = this.FindValidParent($element, 'right');

                //if (validElement.is("[data-dropzone]"))
                //validElement = validElement.closest('[data-field]');

                if (!validElement || validElement.length == 0) return false;
                this.DecideBeforeAfter(validElement, mousePercents, mousePos, validDropZone);
            }
        },
        DecideBeforeAfter: function ($targetElement, mousePercents, mousePos, validDropZone) {
            
            //if (!$targetElement.parent().is(validDropZone)) return;

            if (mousePos) {
                mousePercents = this.GetMouseBearingsPercentage($targetElement, null, mousePos);
            }

            /*if(!mousePercents)
             {
             mousePercents = this.GetMouseBearingsPercentage($targetElement, $targetElement.get(0).getBoundingClientRect(), mousePos);
             } */

            $orientation = (($targetElement.css('display') == "flex" && $targetElement.css('flex-direction') == "row") || $targetElement.css('display') == "inline" || $targetElement.css('display') == "inline-block");
            if ($targetElement.is("br"))
                $orientation = false;

            if ($orientation) {
                if (mousePercents.x < 50) {
                    return this.PlaceBefore($targetElement, validDropZone);
                }
                else {
                    return this.PlaceAfter($targetElement, validDropZone);
                }
            }
            else {
                if (mousePercents.y < 50) {
                    return this.PlaceBefore($targetElement, validDropZone);
                }
                else {
                    return this.PlaceAfter($targetElement, validDropZone);
                }
            }
        },
        checkVoidElement: function ($element) {
            var voidelements = ['i', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'video', 'iframe', 'source', 'track', 'wbr'];
            var selector = voidelements.join(",")
            if ($element.is(selector))
                return true;
            else
                return false;
        },
        calculateDistance: function (elementData, mouseX, mouseY) {
            return Math.sqrt(Math.pow(elementData.x - mouseX, 2) + Math.pow(elementData.y - mouseY, 2));
        },
        FindValidParent: function ($element, direction) {
            switch (direction) {
                case "left":
                    while (true) {
                        if ($element.length == 0) return undefined;
                        var elementRect = $element.get(0).getBoundingClientRect();
                        var $tempElement = $element.parent();
                        var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                        if ($element.is("body"))
                            return $element;
                        if (Math.abs(tempelementRect.left - elementRect.left) == 0)
                            $element = $element.closest('dropzone');
                        else
                            return $element.closest('[data-dropzone]');
                    }
                    break;
                case "right":
                    while (true) {
                        if ($element.length == 0) return undefined;
                        if ($element.length == 0) return undefined;
                        var elementRect = $element.get(0).getBoundingClientRect();
                        var $tempElement = $element.parent();
                        var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                        if ($element.is("body"))
                            return $element;
                        if (Math.abs(tempelementRect.right - elementRect.right) == 0)
                            $element = $element.closest('dropzone');
                        else
                            return $element.closest('[data-dropzone]');
                    }
                    break;
                case "top":
                    while (true) {
                        if ($element.length == 0) return undefined;
                        var elementRect = $element.get(0).getBoundingClientRect();
                        var $tempElement = $element.parent();
                        var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                        if ($element.is("body"))
                            return $element;
                        if (Math.abs(tempelementRect.top - elementRect.top) == 0)
                            $element = $element.closest('dropzone');
                        else
                            return $element.closest('[data-dropzone]');
                    }
                    break;
                case "bottom":
                    while (true) {
                        if ($element.length == 0) return undefined;
                        var elementRect = $element.get(0).getBoundingClientRect();
                        var $tempElement = $element.parent();
                        var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                        if ($element.is("body"))
                            return $element;
                        if (Math.abs(tempelementRect.bottom - elementRect.bottom) == 0)
                            $element = $element.closest('dropzone');
                        else
                            return $element.closest('[data-dropzone]');
                    }
                    break;
            }
        },
        addPlaceHolder: function ($element, position, placeholder, validDropZone) {
            if (!placeholder)
                placeholder = this.getPlaceHolder();
            this.removePlaceholder();
            switch (position) {
                case "before":
                    if (!$element.parent().is(validDropZone)) return;
                    $element.before(placeholder);
                    console.log("BEFORE");
                    this.AddContainerContext($element, 'sibling');
                    break;
                case "after":
                    if (!$element.parent().is(validDropZone)) return;
                    $element.after(placeholder);
                    console.log("AFTER" + " : " + $element.attr('id'));
                    this.AddContainerContext($element, 'sibling');
                    break
                case "inside-prepend":
                    if (!$element.is(validDropZone)) return;
                    $element.prepend(placeholder);
                    this.AddContainerContext($element, 'inside');
                    console.log("PREPEND");
                    break;
                case "inside-append":
                    if (!$element.is(validDropZone)) return;
                    $element.append(placeholder);
                    this.AddContainerContext($element, 'inside');
                    console.log("APPEND");
                    break;
            }
        },
        removePlaceholder: function () {
            $('#canvas').contents().find(".drop-marker").remove();
        },
        getPlaceHolder: function () {
            return $("<li class='drop-marker'></li>");
        },
        PlaceInside: function ($element, validDropZone) {
            var placeholder = this.getPlaceHolder();
            placeholder.addClass('horizontal').css('width', $element.width() + "px");
            this.addPlaceHolder($element, "inside-append", placeholder, validDropZone);
        },
        PlaceBefore: function ($element, validDropZone) {
            var placeholder = this.getPlaceHolder();
            
            var inlinePlaceholder = (($element.parent().css('display') == "flex" && $element.parent().css("flex-direction") != "column") || $element.css('display') == "inline" || $element.css('display') == "inline-block");
            if ($element.is("br")) {
                inlinePlaceholder = false;
            }
            else if ($element.is("td,th")) {
                placeholder.addClass('horizontal').css('width', $element.width() + "px");
                return this.addPlaceHolder($element, "inside-prepend", placeholder, validDropZone);
            }
            if (inlinePlaceholder == true)
                placeholder.addClass("vertical").css('height', $element.innerHeight() + "px");
            else
                placeholder.addClass("horizontal").css('width', $element.parent().width() + "px");
            this.addPlaceHolder($element, "before", placeholder, validDropZone);
        },

        PlaceAfter: function ($element, validDropZone) {
            var placeholder = this.getPlaceHolder();
            var inlinePlaceholder = (($element.css('display') == "flex" && $element.css("flex-direction") != "column") || $element.css('display') == "inline" || $element.css('display') == "inline-block");
            if ($element.is("br")) {
                inlinePlaceholder = false;
            }
            else if ($element.is("td,th")) {
                placeholder.addClass('horizontal').css('width', $element.width() + "px");
                return this.addPlaceHolder($element, "inside-append", placeholder, validDropZone);
            }
            if (inlinePlaceholder == true)
                placeholder.addClass("vertical").css('height', $element.innerHeight() + "px");
            else
                placeholder.addClass("horizontal").css('width', $element.parent().width() + "px");
            this.addPlaceHolder($element, "after", placeholder, validDropZone);
        },
        findNearestElement: function ($container, clientX, clientY) {
            var _this = this;
            var previousElData = null;
            var childElement = $container.children(":not(.drop-marker,[data-dragcontext-marker])");
            if (childElement.length > 0) {
                childElement.each(function () {
                    if ($(this).is(".drop-marker"))
                        return;

                    var offset = $(this).get(0).getBoundingClientRect();
                    var distance = 0;
                    var distance1, distance2 = null;
                    var position = '';
                    var xPosition1 = offset.left;
                    var xPosition2 = offset.right;
                    var yPosition1 = offset.top;
                    var yPosition2 = offset.bottom;
                    var corner1 = null;
                    var corner2 = null;

                    //Parellel to Yaxis and intersecting with x axis
                    if (clientY > yPosition1 && clientY < yPosition2) {
                        if (clientX < xPosition1 && clientY < xPosition2) {
                            corner1 = { x: xPosition1, y: clientY, 'position': 'before' };
                        }
                        else {
                            corner1 = { x: xPosition2, y: clientY, 'position': 'after' };
                        }

                    }
                        //Parellel to xAxis and intersecting with Y axis
                    else if (clientX > xPosition1 && clientX < xPosition2) {
                        if (clientY < yPosition1 && clientY < yPosition2) {
                            corner1 = { x: clientX, y: yPosition1, 'position': 'before' };
                        }
                        else {
                            corner1 = { x: clientX, y: yPosition2, 'position': 'after' };
                        }

                    }
                    else {
                        //runs if no element found!
                        if (clientX < xPosition1 && clientX < xPosition2) {
                            corner1 = { x: xPosition1, y: yPosition1, 'position': 'before' };          //left top
                            corner2 = { x: xPosition1, y: yPosition2, 'position': 'after' };       //left bottom
                        }
                        else if (clientX > xPosition1 && clientX > xPosition2) {
                            corner1 = { x: xPosition2, y: yPosition1, 'position': 'before' };   //Right top
                            corner2 = { x: xPosition2, y: yPosition2, 'position': 'after' }; //Right Bottom
                        }
                        else if (clientY < yPosition1 && clientY < yPosition2) {
                            corner1 = { x: xPosition1, y: yPosition1, 'position': 'before' }; //Top Left
                            corner2 = { x: xPosition2, y: yPosition1, 'position': 'after' }; //Top Right
                        }
                        else if (clientY > yPosition1 && clientY > yPosition2) {
                            corner1 = { x: xPosition1, y: yPosition2, 'position': 'before' }; //Left bottom
                            corner2 = { x: xPosition2, y: yPosition2, 'position': 'after' } //Right Bottom
                        }
                    }

                    distance1 = _this.calculateDistance(corner1, clientX, clientY);

                    if (corner2 !== null)
                        distance2 = _this.calculateDistance(corner2, clientX, clientY);

                    if (distance1 < distance2 || distance2 === null) {
                        distance = distance1;
                        position = corner1.position;
                    }
                    else {
                        distance = distance2;
                        position = corner2.position;
                    }

                    if (previousElData !== null) {
                        if (previousElData.distance < distance) {
                            return true; //continue statement
                        }
                    }
                    previousElData = { 'el': this, 'distance': distance, 'xPosition1': xPosition1, 'xPosition2': xPosition2, 'yPosition1': yPosition1, 'yPosition2': yPosition2, 'position': position }
                });
                if (previousElData !== null) {
                    var position = previousElData.position;
                    return { 'el': $(previousElData.el), 'position': position };
                }
                else {
                    return false;
                }
            }
        },
        AddEntryToDragOverQueue: function ($element, elementRect, mousePos, validDropZone) {
            var newEvent = [$element, elementRect, mousePos, validDropZone];
            this.dragoverqueue.push(newEvent);
        },
        ProcessDragOverQueue: function ($element, elementRect, mousePos) {
            var processing = this.dragoverqueue.pop();
            this.dragoverqueue = [];
            if (processing && processing.length == 4) {
                var $el = processing[0];
                var $elRect = processing[1];
                var mousePos = processing[2];
                var validDropZone = processing[3];
                this.OrchestrateDragDrop($el, $elRect, mousePos, validDropZone);
            }

        },
        GetContextMarker: function () {
            $contextMarker = $("<div data-dragcontext-marker><span data-dragcontext-marker-text></span></div>");
            return $contextMarker;
        },
        AddContainerContext: function ($element, position) {

            $contextMarker = this.GetContextMarker();
            this.ClearContainerContext();
            if ($element.is('html,body')) {
                position = 'inside';
                $element = $('#canvas').contents().find("body");
            }
            switch (position) {
                case "inside":
                    $(window).trigger('positionContextMarker');
                    if ($element.hasClass('stackhive-nodrop-zone'))
                        $contextMarker.addClass('invalid');
                    var name = this.getElementName($element);
                    $contextMarker.find('[data-dragcontext-marker-text]').html(name);
                    if ($('#canvas').contents().find("body [data-sh-parent-marker]").length != 0)
                        $('#canvas').contents().find("body [data-sh-parent-marker]").first().before($contextMarker);
                    else
                        $('#canvas').contents().find("body").append($contextMarker);
                    break;
                case "sibling":
                    $(window).trigger('positionContextMarker');
                    //if ($element.parent().hasClass('stackhive-nodrop-zone'))
                    //    $contextMarker.addClass('invalid');
                    var name = this.getElementName($element.closest('[data-dropzone]')) || '';
                    $contextMarker.find('[data-dragcontext-marker-text]').html(name);
                    $contextMarker.attr("data-dragcontext-marker", name.toLowerCase());
                    if ($('#canvas').contents().find("body [data-sh-parent-marker]").length != 0)
                        $('#canvas').contents().find("body [data-sh-parent-marker]").first().before($contextMarker);
                    else
                        $('#canvas').contents().find("body").append($contextMarker);
                    break;
            }
        },
        //PositionContextMarker: function ($contextMarker, $element) {
        //    try {
        //        var rect = $element.get(0).getBoundingClientRect();
        //        $contextMarker.css({
        //            height: (rect.height + 4) + "px",
        //            width: (rect.width + 4) + "px",
        //            top: (rect.top + $($('#canvas').get(0).contentWindow).scrollTop() - 2) + "px",
        //            left: (rect.left + $($('#canvas').get(0).contentWindow).scrollLeft() - 2) + "px"
        //        });
        //        if (rect.top + $('#canvas').contents().find("body").scrollTop() < 24)
        //            $contextMarker.find("[data-dragcontext-marker-text]").css('top', '0px');
        //    }
        //    catch (e) {
        //        console.log(e);
        //    }
        //},
        ClearContainerContext: function () {
            $('#canvas').contents().find('[data-dragcontext-marker]').remove();
        },
        getElementName: function ($element) {
            return $element.closest('[data-field]').attr('data-field');
        }
    };