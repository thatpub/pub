(function(root, factory) {
    var snabbt = factory();
    if (typeof exports === "object") {
        module.exports = snabbt;
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return root.returnExportsGlobal = snabbt;
        });
    } else {
        root.snabbt = snabbt;
    }
})(this, function() {
    var tickRequests = [];
    var runningAnimations = [];
    var completedAnimations = [];
    var transformProperty = "transform";
    var styles = window.getComputedStyle(document.documentElement, "");
    var vendorPrefix = (Array.prototype.slice.call(styles).join("").match(/-(moz|webkit|ms)-/) || styles.OLink === "" && [ "", "o" ])[1];
    if (vendorPrefix === "webkit") transformProperty = "webkitTransform";
    var snabbt = function(arg1, arg2, arg3) {
        var elements = arg1;
        if (elements.length !== undefined) {
            var aggregateChainer = {
                chainers: [],
                then: function(opts) {
                    console.log("DeprecationWarning: then() is renamed to snabbt()");
                    return this.snabbt(opts);
                },
                snabbt: function(opts) {
                    var len = this.chainers.length;
                    this.chainers.forEach(function(chainer, index) {
                        chainer.snabbt(preprocessOptions(opts, index, len));
                    });
                    return aggregateChainer;
                },
                setValue: function(value) {
                    this.chainers.forEach(function(chainer) {
                        chainer.setValue(value);
                    });
                    return aggregateChainer;
                },
                finish: function() {
                    this.chainers.forEach(function(chainer) {
                        chainer.finish();
                    });
                    return aggregateChainer;
                },
                rollback: function() {
                    this.chainers.forEach(function(chainer) {
                        chainer.rollback();
                    });
                    return aggregateChainer;
                }
            };
            for (var i = 0, len = elements.length; i < len; ++i) {
                if (typeof arg2 == "string") aggregateChainer.chainers.push(snabbtSingleElement(elements[i], arg2, preprocessOptions(arg3, i, len))); else aggregateChainer.chainers.push(snabbtSingleElement(elements[i], preprocessOptions(arg2, i, len), arg3));
            }
            return aggregateChainer;
        } else {
            if (typeof arg2 == "string") return snabbtSingleElement(elements, arg2, preprocessOptions(arg3, 0, 1)); else return snabbtSingleElement(elements, preprocessOptions(arg2, 0, 1), arg3);
        }
    };
    var preprocessOptions = function(options, index, len) {
        if (!options) return options;
        var clone = cloneObject(options);
        if (isFunction(options.delay)) {
            clone.delay = options.delay(index, len);
        }
        if (isFunction(options.callback)) {
            console.log("DeprecationWarning: callback is renamed to complete");
            clone.complete = function() {
                options.callback.call(this, index, len);
            };
        }
        var hasAllDoneCallback = isFunction(options.allDone);
        var hasCompleteCallback = isFunction(options.complete);
        if (hasCompleteCallback || hasAllDoneCallback) {
            clone.complete = function() {
                if (hasCompleteCallback) {
                    options.complete.call(this, index, len);
                }
                if (hasAllDoneCallback && index == len - 1) {
                    options.allDone();
                }
            };
        }
        if (isFunction(options.valueFeeder)) {
            clone.valueFeeder = function(i, matrix) {
                return options.valueFeeder(i, matrix, index, len);
            };
        }
        if (isFunction(options.easing)) {
            clone.easing = function(i) {
                return options.easing(i, index, len);
            };
        }
        var properties = [ "position", "rotation", "skew", "rotationPost", "scale", "width", "height", "opacity", "fromPosition", "fromRotation", "fromSkew", "fromRotationPost", "fromScale", "fromWidth", "fromHeight", "fromOpacity", "transformOrigin", "duration", "delay" ];
        properties.forEach(function(property) {
            if (isFunction(options[property])) {
                clone[property] = options[property](index, len);
            }
        });
        return clone;
    };
    var snabbtSingleElement = function(element, arg2, arg3) {
        if (arg2 === "attention") return setupAttentionAnimation(element, arg3);
        if (arg2 === "stop") return stopAnimation(element);
        var options = arg2;
        clearOphanedEndStates();
        var currentState = currentAnimationState(element);
        var start = currentState;
        start = stateFromOptions(options, start, true);
        var end = cloneObject(currentState);
        end = stateFromOptions(options, end);
        var animOptions = setupAnimationOptions(start, end, options);
        var animation = createAnimation(animOptions);
        runningAnimations.push([ element, animation ]);
        animation.updateElement(element);
        var queue = [];
        var chainer = {
            snabbt: function(opts) {
                queue.unshift(preprocessOptions(opts, 0, 1));
                return chainer;
            },
            then: function(opts) {
                console.log("DeprecationWarning: then() is renamed to snabbt()");
                return this.snabbt(opts);
            }
        };
        function tick(time) {
            animation.tick(time);
            animation.updateElement(element);
            if (animation.isStopped()) return;
            if (!animation.completed()) return queueTick(tick);
            if (options.loop > 1 && !animation.isStopped()) {
                options.loop -= 1;
                animation.restart();
                queueTick(tick);
            } else {
                if (options.complete) {
                    options.complete.call(element);
                }
                if (queue.length) {
                    options = queue.pop();
                    start = stateFromOptions(options, end, true);
                    end = stateFromOptions(options, cloneObject(end));
                    options = setupAnimationOptions(start, end, options);
                    animation = createAnimation(options);
                    runningAnimations.push([ element, animation ]);
                    animation.tick(time);
                    queueTick(tick);
                }
            }
        }
        queueTick(tick);
        if (options.manual) return animation;
        return chainer;
    };
    var setupAttentionAnimation = function(element, options) {
        var movement = stateFromOptions(options);
        options.movement = movement;
        var animation = createAttentionAnimation(options);
        runningAnimations.push([ element, animation ]);
        function tick(time) {
            animation.tick(time);
            animation.updateElement(element);
            if (!animation.completed()) {
                queueTick(tick);
            } else {
                if (options.callback) {
                    options.callback(element);
                }
                if (options.loop && options.loop > 1) {
                    options.loop--;
                    animation.restart();
                    queueTick(tick);
                }
            }
        }
        queueTick(tick);
    };
    var stopAnimation = function(element) {
        for (var i = 0, len = runningAnimations.length; i < len; ++i) {
            var currentAnimation = runningAnimations[i];
            var animatedElement = currentAnimation[0];
            var animation = currentAnimation[1];
            if (animatedElement === element) {
                animation.stop();
            }
        }
    };
    var findAnimationState = function(animationList, element) {
        for (var i = 0, len = animationList.length; i < len; ++i) {
            var currentAnimation = animationList[i];
            var animatedElement = currentAnimation[0];
            var animation = currentAnimation[1];
            if (animatedElement === element) {
                var state = animation.getCurrentState();
                animation.stop();
                return state;
            }
        }
    };
    var clearOphanedEndStates = function() {
        completedAnimations = completedAnimations.filter(function(animation) {
            return findUltimateAncestor(animation[0]).body;
        });
    };
    var findUltimateAncestor = function(node) {
        var ancestor = node;
        while (ancestor.parentNode) {
            ancestor = ancestor.parentNode;
        }
        return ancestor;
    };
    var currentAnimationState = function(element) {
        var state = findAnimationState(runningAnimations, element);
        if (state) return state;
        return findAnimationState(completedAnimations, element);
    };
    var stateFromOptions = function(options, state, useFromPrefix) {
        if (!state) state = createState({});
        var position = "position";
        var rotation = "rotation";
        var skew = "skew";
        var rotationPost = "rotationPost";
        var scale = "scale";
        var width = "width";
        var height = "height";
        var opacity = "opacity";
        if (useFromPrefix) {
            position = "fromPosition";
            rotation = "fromRotation";
            skew = "fromSkew";
            rotationPost = "fromRotationPost";
            scale = "fromScale";
            width = "fromWidth";
            height = "fromHeight";
            opacity = "fromOpacity";
        }
        state.position = optionOrDefault(options[position], state.position);
        state.rotation = optionOrDefault(options[rotation], state.rotation);
        state.rotationPost = optionOrDefault(options[rotationPost], state.rotationPost);
        state.skew = optionOrDefault(options[skew], state.skew);
        state.scale = optionOrDefault(options[scale], state.scale);
        state.opacity = options[opacity];
        state.width = options[width];
        state.height = options[height];
        return state;
    };
    var setupAnimationOptions = function(start, end, options) {
        options.startState = start;
        options.endState = end;
        return options;
    };
    var polyFillrAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        return setTimeout(callback, 1e3 / 60);
    };
    var queueTick = function(func) {
        if (tickRequests.length === 0) polyFillrAF(tickAnimations);
        tickRequests.push(func);
    };
    var tickAnimations = function(time) {
        var len = tickRequests.length;
        for (var i = 0; i < len; ++i) {
            tickRequests[i](time);
        }
        tickRequests.splice(0, len);
        var finishedAnimations = runningAnimations.filter(function(animation) {
            return animation[1].completed();
        });
        completedAnimations = completedAnimations.filter(function(animation) {
            for (var i = 0, len = finishedAnimations.length; i < len; ++i) {
                if (animation[0] === finishedAnimations[i][0]) {
                    return false;
                }
            }
            return true;
        });
        completedAnimations = completedAnimations.concat(finishedAnimations);
        runningAnimations = runningAnimations.filter(function(animation) {
            return !animation[1].completed();
        });
        if (tickRequests.length !== 0) polyFillrAF(tickAnimations);
    };
    var createAnimation = function(options) {
        var startState = options.startState;
        var endState = options.endState;
        var duration = optionOrDefault(options.duration, 500);
        var delay = optionOrDefault(options.delay, 0);
        var perspective = options.perspective;
        var easing = createEaser(optionOrDefault(options.easing, "linear"), options);
        var currentState = startState.clone();
        var transformOrigin = options.transformOrigin;
        currentState.transformOrigin = options.transformOrigin;
        var startTime = 0;
        var currentTime = 0;
        var stopped = false;
        var started = false;
        var manual = options.manual;
        var manualValue = 0;
        var manualDelayFactor = delay / duration;
        var manualCallback;
        var tweener;
        if (options.valueFeeder) {
            tweener = createValueFeederTweener(options.valueFeeder, startState, endState, currentState);
        } else {
            tweener = createStateTweener(startState, endState, currentState);
        }
        return {
            stop: function() {
                stopped = true;
            },
            isStopped: function() {
                return stopped;
            },
            finish: function(callback) {
                manual = false;
                var manualDuration = duration * manualValue;
                startTime = currentTime - manualDuration;
                manualCallback = callback;
                easing.resetFrom = manualValue;
            },
            rollback: function(callback) {
                manual = false;
                tweener.setReverse();
                var manualDuration = duration * (1 - manualValue);
                startTime = currentTime - manualDuration;
                manualCallback = callback;
                easing.resetFrom = manualValue;
            },
            restart: function() {
                startTime = undefined;
                easing.resetFrom(0);
            },
            tick: function(time) {
                if (stopped) return;
                if (manual) {
                    currentTime = time;
                    this.updateCurrentTransform();
                    return;
                }
                if (!startTime) {
                    startTime = time;
                }
                if (time - startTime > delay) {
                    started = true;
                    currentTime = time - delay;
                    var curr = Math.min(Math.max(0, currentTime - startTime), duration);
                    easing.tick(curr / duration);
                    this.updateCurrentTransform();
                    if (this.completed() && manualCallback) {
                        manualCallback();
                    }
                }
            },
            getCurrentState: function() {
                return currentState;
            },
            setValue: function(_manualValue) {
                started = true;
                manualValue = Math.min(Math.max(_manualValue, 1e-4), 1 + manualDelayFactor);
            },
            updateCurrentTransform: function() {
                var tweenValue = easing.getValue();
                if (manual) {
                    var val = Math.max(1e-5, manualValue - manualDelayFactor);
                    easing.tick(val);
                    tweenValue = easing.getValue();
                }
                tweener.tween(tweenValue);
            },
            completed: function() {
                if (stopped) return true;
                if (startTime === 0) {
                    return false;
                }
                return easing.completed();
            },
            updateElement: function(element) {
                if (!started) return;
                var matrix = tweener.asMatrix();
                var properties = tweener.getProperties();
                updateElementTransform(element, matrix, perspective);
                updateElementProperties(element, properties);
            }
        };
    };
    var createAttentionAnimation = function(options) {
        var movement = options.movement;
        var currentMovement = createState({});
        options.initialVelocity = .1;
        options.equilibriumPosition = 0;
        var spring = createSpringEasing(options);
        var stopped = false;
        return {
            stop: function() {
                stopped = true;
            },
            isStopped: function(time) {
                return stopped;
            },
            tick: function(time) {
                if (stopped) return;
                if (spring.equilibrium) return;
                spring.tick();
                this.updateMovement();
            },
            updateMovement: function() {
                var value = spring.getValue();
                currentMovement.position[0] = movement.position[0] * value;
                currentMovement.position[1] = movement.position[1] * value;
                currentMovement.position[2] = movement.position[2] * value;
                currentMovement.rotation[0] = movement.rotation[0] * value;
                currentMovement.rotation[1] = movement.rotation[1] * value;
                currentMovement.rotation[2] = movement.rotation[2] * value;
                currentMovement.rotationPost[0] = movement.rotationPost[0] * value;
                currentMovement.rotationPost[1] = movement.rotationPost[1] * value;
                currentMovement.rotationPost[2] = movement.rotationPost[2] * value;
                if (movement.scale[0] !== 1 && movement.scale[1] !== 1) {
                    currentMovement.scale[0] = 1 + movement.scale[0] * value;
                    currentMovement.scale[1] = 1 + movement.scale[1] * value;
                }
                currentMovement.skew[0] = movement.skew[0] * value;
                currentMovement.skew[1] = movement.skew[1] * value;
            },
            updateElement: function(element) {
                updateElementTransform(element, currentMovement.asMatrix());
                updateElementProperties(element, currentMovement.getProperties());
            },
            getCurrentState: function() {
                return currentMovement;
            },
            completed: function() {
                return spring.equilibrium || stopped;
            },
            restart: function() {
                spring = createSpringEasing(options);
            }
        };
    };
    var linearEasing = function(value) {
        return value;
    };
    var ease = function(value) {
        return (Math.cos(value * Math.PI + Math.PI) + 1) / 2;
    };
    var easeIn = function(value) {
        return value * value;
    };
    var easeOut = function(value) {
        return -Math.pow(value - 1, 2) + 1;
    };
    var createSpringEasing = function(options) {
        var position = optionOrDefault(options.startPosition, 0);
        var equilibriumPosition = optionOrDefault(options.equilibriumPosition, 1);
        var velocity = optionOrDefault(options.initialVelocity, 0);
        var springConstant = optionOrDefault(options.springConstant, .8);
        var deceleration = optionOrDefault(options.springDeceleration, .9);
        var mass = optionOrDefault(options.springMass, 10);
        var equilibrium = false;
        return {
            tick: function(value) {
                if (value === 0) return;
                if (equilibrium) return;
                var springForce = -(position - equilibriumPosition) * springConstant;
                var a = springForce / mass;
                velocity += a;
                position += velocity;
                velocity *= deceleration;
                if (Math.abs(position - equilibriumPosition) < .001 && Math.abs(velocity) < .001) {
                    equilibrium = true;
                }
            },
            resetFrom: function(value) {
                position = value;
                velocity = 0;
            },
            getValue: function() {
                if (equilibrium) return equilibriumPosition;
                return position;
            },
            completed: function() {
                return equilibrium;
            }
        };
    };
    var EASING_FUNCS = {
        linear: linearEasing,
        ease: ease,
        easeIn: easeIn,
        easeOut: easeOut
    };
    var createEaser = function(easerName, options) {
        if (easerName == "spring") {
            return createSpringEasing(options);
        }
        var easeFunction = easerName;
        if (!isFunction(easerName)) {
            easeFunction = EASING_FUNCS[easerName];
        }
        var easer = easeFunction;
        var value = 0;
        var lastValue;
        return {
            tick: function(v) {
                value = easer(v);
                lastValue = v;
            },
            resetFrom: function(value) {
                lastValue = 0;
            },
            getValue: function() {
                return value;
            },
            completed: function() {
                if (lastValue >= 1) {
                    return lastValue;
                }
                return false;
            }
        };
    };
    var assignTranslate = function(matrix, x, y, z) {
        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = 0;
        matrix[5] = 1;
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = 0;
        matrix[10] = 1;
        matrix[11] = 0;
        matrix[12] = x;
        matrix[13] = y;
        matrix[14] = z;
        matrix[15] = 1;
    };
    var assignRotateX = function(matrix, rad) {
        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = 0;
        matrix[5] = Math.cos(rad);
        matrix[6] = -Math.sin(rad);
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = Math.sin(rad);
        matrix[10] = Math.cos(rad);
        matrix[11] = 0;
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        matrix[15] = 1;
    };
    var assignRotateY = function(matrix, rad) {
        matrix[0] = Math.cos(rad);
        matrix[1] = 0;
        matrix[2] = Math.sin(rad);
        matrix[3] = 0;
        matrix[4] = 0;
        matrix[5] = 1;
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = -Math.sin(rad);
        matrix[9] = 0;
        matrix[10] = Math.cos(rad);
        matrix[11] = 0;
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        matrix[15] = 1;
    };
    var assignRotateZ = function(matrix, rad) {
        matrix[0] = Math.cos(rad);
        matrix[1] = -Math.sin(rad);
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = Math.sin(rad);
        matrix[5] = Math.cos(rad);
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = 0;
        matrix[10] = 1;
        matrix[11] = 0;
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        matrix[15] = 1;
    };
    var assignSkew = function(matrix, ax, ay) {
        matrix[0] = 1;
        matrix[1] = Math.tan(ax);
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = Math.tan(ay);
        matrix[5] = 1;
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = 0;
        matrix[10] = 1;
        matrix[11] = 0;
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        matrix[15] = 1;
    };
    var assignScale = function(matrix, x, y) {
        matrix[0] = x;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = 0;
        matrix[5] = y;
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = 0;
        matrix[10] = 1;
        matrix[11] = 0;
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        matrix[15] = 1;
    };
    var assignIdentity = function(matrix) {
        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = 0;
        matrix[5] = 1;
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = 0;
        matrix[10] = 1;
        matrix[11] = 0;
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        matrix[15] = 1;
    };
    var copyArray = function(a, b) {
        b[0] = a[0];
        b[1] = a[1];
        b[2] = a[2];
        b[3] = a[3];
        b[4] = a[4];
        b[5] = a[5];
        b[6] = a[6];
        b[7] = a[7];
        b[8] = a[8];
        b[9] = a[9];
        b[10] = a[10];
        b[11] = a[11];
        b[12] = a[12];
        b[13] = a[13];
        b[14] = a[14];
        b[15] = a[15];
    };
    var createMatrix = function() {
        var data = new Float32Array(16);
        var a = new Float32Array(16);
        var b = new Float32Array(16);
        assignIdentity(data);
        return {
            data: data,
            asCSS: function() {
                var css = "matrix3d(";
                for (var i = 0; i < 15; ++i) {
                    if (Math.abs(data[i]) < 1e-4) css += "0,"; else css += data[i].toFixed(10) + ",";
                }
                if (Math.abs(data[15]) < 1e-4) css += "0)"; else css += data[15].toFixed(10) + ")";
                return css;
            },
            clear: function() {
                assignIdentity(data);
            },
            translate: function(x, y, z) {
                copyArray(data, a);
                assignTranslate(b, x, y, z);
                assignedMatrixMultiplication(a, b, data);
                return this;
            },
            rotateX: function(radians) {
                copyArray(data, a);
                assignRotateX(b, radians);
                assignedMatrixMultiplication(a, b, data);
                return this;
            },
            rotateY: function(radians) {
                copyArray(data, a);
                assignRotateY(b, radians);
                assignedMatrixMultiplication(a, b, data);
                return this;
            },
            rotateZ: function(radians) {
                copyArray(data, a);
                assignRotateZ(b, radians);
                assignedMatrixMultiplication(a, b, data);
                return this;
            },
            scale: function(x, y) {
                copyArray(data, a);
                assignScale(b, x, y);
                assignedMatrixMultiplication(a, b, data);
                return this;
            },
            skew: function(ax, ay) {
                copyArray(data, a);
                assignSkew(b, ax, ay);
                assignedMatrixMultiplication(a, b, data);
                return this;
            }
        };
    };
    var assignedMatrixMultiplication = function(a, b, res) {
        res[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
        res[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
        res[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
        res[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];
        res[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
        res[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
        res[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
        res[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];
        res[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
        res[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
        res[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
        res[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];
        res[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
        res[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
        res[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
        res[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
        return res;
    };
    var createState = function(config) {
        var matrix = createMatrix();
        var properties = {
            opacity: undefined,
            width: undefined,
            height: undefined
        };
        return {
            position: optionOrDefault(config.position, [ 0, 0, 0 ]),
            rotation: optionOrDefault(config.rotation, [ 0, 0, 0 ]),
            rotationPost: optionOrDefault(config.rotationPost, [ 0, 0, 0 ]),
            skew: optionOrDefault(config.skew, [ 0, 0 ]),
            scale: optionOrDefault(config.scale, [ 1, 1 ]),
            opacity: config.opacity,
            width: config.width,
            height: config.height,
            clone: function() {
                return createState({
                    position: this.position.slice(0),
                    rotation: this.rotation.slice(0),
                    rotationPost: this.rotationPost.slice(0),
                    skew: this.skew.slice(0),
                    scale: this.scale.slice(0),
                    height: this.height,
                    width: this.width,
                    opacity: this.opacity
                });
            },
            asMatrix: function() {
                var m = matrix;
                m.clear();
                if (this.transformOrigin) m.translate(-this.transformOrigin[0], -this.transformOrigin[1], -this.transformOrigin[2]);
                if (this.scale[0] !== 1 || this.scale[1] !== 1) {
                    m.scale(this.scale[0], this.scale[1]);
                }
                if (this.skew[0] !== 0 || this.skew[1] !== 0) {
                    m.skew(this.skew[0], this.skew[1]);
                }
                if (this.rotation[0] !== 0 || this.rotation[1] !== 0 || this.rotation[2] !== 0) {
                    m.rotateX(this.rotation[0]);
                    m.rotateY(this.rotation[1]);
                    m.rotateZ(this.rotation[2]);
                }
                if (this.position[0] !== 0 || this.position[1] !== 0 || this.position[2] !== 0) {
                    m.translate(this.position[0], this.position[1], this.position[2]);
                }
                if (this.rotationPost[0] !== 0 || this.rotationPost[1] !== 0 || this.rotationPost[2] !== 0) {
                    m.rotateX(this.rotationPost[0]);
                    m.rotateY(this.rotationPost[1]);
                    m.rotateZ(this.rotationPost[2]);
                }
                if (this.transformOrigin) m.translate(this.transformOrigin[0], this.transformOrigin[1], this.transformOrigin[2]);
                return m;
            },
            getProperties: function() {
                properties.opacity = this.opacity;
                properties.width = this.width + "px";
                properties.height = this.height + "px";
                return properties;
            }
        };
    };
    var createStateTweener = function(startState, endState, resultState) {
        var start = startState;
        var end = endState;
        var result = resultState;
        return {
            tween: function(tweenValue) {
                var dX = end.position[0] - start.position[0];
                var dY = end.position[1] - start.position[1];
                var dZ = end.position[2] - start.position[2];
                var dAX = end.rotation[0] - start.rotation[0];
                var dAY = end.rotation[1] - start.rotation[1];
                var dAZ = end.rotation[2] - start.rotation[2];
                var dBX = end.rotationPost[0] - start.rotationPost[0];
                var dBY = end.rotationPost[1] - start.rotationPost[1];
                var dBZ = end.rotationPost[2] - start.rotationPost[2];
                var dSX = end.scale[0] - start.scale[0];
                var dSY = end.scale[1] - start.scale[1];
                var dSkewX = end.skew[0] - start.skew[0];
                var dSkewY = end.skew[1] - start.skew[1];
                var dWidth = end.width - start.width;
                var dHeight = end.height - start.height;
                var dOpacity = end.opacity - start.opacity;
                result.position[0] = start.position[0] + tweenValue * dX;
                result.position[1] = start.position[1] + tweenValue * dY;
                result.position[2] = start.position[2] + tweenValue * dZ;
                result.rotation[0] = start.rotation[0] + tweenValue * dAX;
                result.rotation[1] = start.rotation[1] + tweenValue * dAY;
                result.rotation[2] = start.rotation[2] + tweenValue * dAZ;
                result.rotationPost[0] = start.rotationPost[0] + tweenValue * dBX;
                result.rotationPost[1] = start.rotationPost[1] + tweenValue * dBY;
                result.rotationPost[2] = start.rotationPost[2] + tweenValue * dBZ;
                result.skew[0] = start.skew[0] + tweenValue * dSkewX;
                result.skew[1] = start.skew[1] + tweenValue * dSkewY;
                result.scale[0] = start.scale[0] + tweenValue * dSX;
                result.scale[1] = start.scale[1] + tweenValue * dSY;
                if (end.width !== undefined) result.width = start.width + tweenValue * dWidth;
                if (end.height !== undefined) result.height = start.height + tweenValue * dHeight;
                if (end.opacity !== undefined) result.opacity = start.opacity + tweenValue * dOpacity;
            },
            asMatrix: function() {
                return result.asMatrix();
            },
            getProperties: function() {
                return result.getProperties();
            },
            setReverse: function() {
                var oldStart = start;
                start = end;
                end = oldStart;
            }
        };
    };
    var createValueFeederTweener = function(valueFeeder, startState, endState, resultState) {
        var currentMatrix = valueFeeder(0, createMatrix());
        var start = startState;
        var end = endState;
        var result = resultState;
        var reverse = false;
        return {
            tween: function(tweenValue) {
                if (reverse) tweenValue = 1 - tweenValue;
                currentMatrix.clear();
                currentMatrix = valueFeeder(tweenValue, currentMatrix);
                var dWidth = end.width - start.width;
                var dHeight = end.height - start.height;
                var dOpacity = end.opacity - start.opacity;
                if (end.width !== undefined) result.width = start.width + tweenValue * dWidth;
                if (end.height !== undefined) result.height = start.height + tweenValue * dHeight;
                if (end.opacity !== undefined) result.opacity = start.opacity + tweenValue * dOpacity;
            },
            asMatrix: function() {
                return currentMatrix;
            },
            getProperties: function() {
                return result.getProperties();
            },
            setReverse: function() {
                reverse = true;
            }
        };
    };
    var optionOrDefault = function(option, def) {
        if (typeof option == "undefined") {
            return def;
        }
        return option;
    };
    var updateElementTransform = function(element, matrix, perspective) {
        var cssPerspective = "";
        if (perspective) {
            cssPerspective = "perspective(" + perspective + "px) ";
        }
        var cssMatrix = matrix.asCSS();
        element.style[transformProperty] = cssPerspective + cssMatrix;
    };
    var updateElementProperties = function(element, properties) {
        for (var key in properties) {
            element.style[key] = properties[key];
        }
    };
    var isFunction = function(object) {
        return typeof object === "function";
    };
    var cloneObject = function(object) {
        if (!object) return object;
        var clone = {};
        for (var key in object) {
            clone[key] = object[key];
        }
        return clone;
    };
    if (window.jQuery) {
        (function($) {
            $.fn.snabbt = function(arg1, arg2) {
                return snabbt(this.get(), arg1, arg2);
            };
        })(jQuery);
    }
    snabbt.createMatrix = createMatrix;
    snabbt.setElementTransform = updateElementTransform;
    return snabbt;
});

(function() {
    function Z(a, b, c) {
        if (b !== b) {
            a: {
                b = a.length;
                for (c = (c || 0) - 1; ++c < b; ) {
                    var d = a[c];
                    if (d !== d) {
                        a = c;
                        break a;
                    }
                }
                a = -1;
            }
            return a;
        }
        c = (c || 0) - 1;
        for (d = a.length; ++c < d; ) if (a[c] === b) return c;
        return -1;
    }
    function v(a) {
        return typeof a == "string" ? a : null == a ? "" : a + "";
    }
    function ra(a, b) {
        for (var c = -1, d = a.length; ++c < d && -1 < b.indexOf(a.charAt(c)); ) ;
        return c;
    }
    function sa(a, b) {
        for (var c = a.length; c-- && -1 < b.indexOf(a.charAt(c)); ) ;
        return c;
    }
    function ta(a) {
        return ua[a];
    }
    function va(a) {
        return "\\" + wa[a];
    }
    function t(a) {
        return a && typeof a == "object" || false;
    }
    function $(a) {
        return 160 >= a && 9 <= a && 13 >= a || 32 == a || 160 == a || 5760 == a || 6158 == a || 8192 <= a && (8202 >= a || 8232 == a || 8233 == a || 8239 == a || 8287 == a || 12288 == a || 65279 == a);
    }
    function f() {}
    function aa(a, b, c, d) {
        return typeof a != "undefined" && u.call(d, c) ? a : b;
    }
    function D(a, b, c) {
        var d = E(b);
        if (!c) {
            d || (d = a, a = {});
            c = -1;
            for (var e = d.length; ++c < e; ) {
                var f = d[c];
                a[f] = b[f];
            }
            return a;
        }
        e = -1;
        for (f = d.length; ++e < f; ) {
            var p = d[e], m = a[p], g = c(m, b[p], p, a, b);
            (g === g ? g === m : m !== m) && (typeof m != "undefined" || p in a) || (a[p] = g);
        }
        return a;
    }
    function xa(a) {
        var b, c = 1, d = -1, e = a.length, c = null == c ? 0 : +c || 0;
        0 > c && (c = -c > e ? 0 : e + c);
        b = typeof b == "undefined" || b > e ? e : +b || 0;
        0 > b && (b += e);
        e = c > b ? 0 : b - c >>> 0;
        c >>>= 0;
        for (b = Array(e); ++d < e; ) b[d] = a[d + c];
        return b;
    }
    function ba(a, b) {
        for (var c = -1, d = b.length, e = Array(d); ++c < d; ) e[c] = a[b[c]];
        return e;
    }
    function O(a, b) {
        a = +a;
        b = null == b ? ca : b;
        return -1 < a && 0 == a % 1 && a < b;
    }
    function P(a, b, c) {
        if (!w(c)) return false;
        var d = typeof b;
        "number" == d ? (d = c.length, d = s(d) && O(b, d)) : d = "string" == d && b in c;
        return d && c[b] === a;
    }
    function s(a) {
        return typeof a == "number" && -1 < a && 0 == a % 1 && a <= ca;
    }
    function da(a) {
        for (var b = ea(a), c = b.length, d = c && a.length, e = f.support, e = d && s(d) && (F(a) || e.nonEnumStrings && G(a) || e.nonEnumArgs && H(a)), g = -1, p = []; ++g < c; ) {
            var m = b[g];
            (e && O(m, d) || u.call(a, m)) && p.push(m);
        }
        return p;
    }
    function Q(a, b, c) {
        var d = a ? a.length : 0;
        if (!d) return -1;
        if (typeof c == "number") c = 0 > c ? fa(d + c, 0) : c || 0; else if (c) {
            c = 0;
            d = a ? a.length : c;
            if (typeof b == "number" && b === b && d <= ya) {
                for (;c < d; ) {
                    var e = c + d >>> 1;
                    a[e] < b ? c = e + 1 : d = e;
                }
                c = d;
            } else {
                d = ga;
                c = d(b);
                for (var e = 0, f = a ? a.length : 0, g = c !== c, m = typeof c == "undefined"; e < f; ) {
                    var k = za((e + f) / 2), h = d(a[k]), l = h === h;
                    (g ? l : m ? l && typeof h != "undefined" : h < c) ? e = k + 1 : f = k;
                }
                c = Aa(f, Ba);
            }
            a = a[c];
            return (b === b ? b === a : a !== a) ? c : -1;
        }
        return Z(a, b, c);
    }
    function R(a, b, c) {
        var d = a ? a.length : 0;
        s(d) || (a = ha(a), d = a.length);
        if (!d) return false;
        c = typeof c == "number" ? 0 > c ? fa(d + c, 0) : c || 0 : 0;
        typeof a == "string" || !F(a) && G(a) ? a = c < d && -1 < a.indexOf(b, c) : (d = f.indexOf || Q, 
        d = d === Q ? Z : d, a = -1 < (a ? d(a, b, c) : d));
        return a;
    }
    function H(a) {
        return s(t(a) ? a.length : I) && q.call(a) == ia || false;
    }
    function S(a) {
        return t(a) && typeof a.message == "string" && q.call(a) == T || false;
    }
    function x(a) {
        return typeof a == "function" || false;
    }
    function w(a) {
        var b = typeof a;
        return "function" == b || a && "object" == b || false;
    }
    function A(a) {
        return null == a ? false : q.call(a) == U ? ja.test(Ca.call(a)) : t(a) && (Da(a) ? ja : Ea).test(a) || false;
    }
    function ka(a) {
        return w(a) && q.call(a) == la || false;
    }
    function G(a) {
        return typeof a == "string" || t(a) && q.call(a) == V || false;
    }
    function ea(a) {
        if (null == a) return [];
        w(a) || (a = Object(a));
        for (var b = a.length, c = f.support, b = b && s(b) && (F(a) || c.nonEnumStrings && G(a) || c.nonEnumArgs && H(a)) && b || 0, d = a.constructor, e = -1, d = x(d) && d.prototype || y, k = d === a, p = Array(b), m = 0 < b, n = c.enumErrorProps && (a === J || a instanceof Error), h = c.enumPrototypes && x(a); ++e < b; ) p[e] = e + "";
        for (var l in a) h && "prototype" == l || n && ("message" == l || "name" == l) || m && O(l, b) || "constructor" == l && (k || !u.call(a, l)) || p.push(l);
        if (c.nonEnumShadows && a !== y) for (b = a === Fa ? V : a === J ? T : q.call(a), 
        c = g[b] || g[W], b == W && (d = y), b = X.length; b--; ) l = X[b], e = c[l], k && e || (e ? !u.call(a, l) : a[l] === d[l]) || p.push(l);
        return p;
    }
    function ha(a) {
        return ba(a, E(a));
    }
    function ma(a) {
        return (a = v(a)) && Ga.test(a) ? a.replace(na, "\\$&") : a;
    }
    function oa(a) {
        try {
            return a.apply(I, xa(arguments));
        } catch (b) {
            return S(b) ? b : Error(b);
        }
    }
    function ga(a) {
        return a;
    }
    var I, ia = "[object Arguments]", T = "[object Error]", U = "[object Function]", W = "[object Object]", la = "[object RegExp]", V = "[object String]", Ha = /\b__p\+='';/g, Ia = /\b(__p\+=)''\+/g, Ja = /(__e\(.*?\)|\b__t\))\+'';/g, pa = /[&<>"'`]/g, Ka = RegExp(pa.source), qa = /<%=([\s\S]+?)%>/g, La = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Ma = /\w*$/, Ea = /^\[object .+?Constructor\]$/, K = /($^)/, na = /[.*+?^${}()|[\]\/\\]/g, Ga = RegExp(na.source), Na = /\bthis\b/, Oa = /['\n\r\u2028\u2029\\]/g, X = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), ua = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#96;"
    }, r = {
        function: true,
        object: true
    }, wa = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, B = r[typeof window] && window !== (this && this.window) ? window : this, C = r[typeof exports] && exports && !exports.nodeType && exports, r = r[typeof module] && module && !module.nodeType && module, n = C && r && typeof global == "object" && global;
    !n || n.global !== n && n.window !== n && n.self !== n || (B = n);
    var n = r && r.exports === C && C, Da = function() {
        try {
            Object({
                toString: 0
            } + "");
        } catch (a) {
            return function() {
                return false;
            };
        }
        return function(a) {
            return typeof a.toString != "function" && typeof (a + "") == "string";
        };
    }(), L = Array.prototype, J = Error.prototype, y = Object.prototype, Fa = String.prototype, Ca = Function.prototype.toString, u = y.hasOwnProperty, q = y.toString, ja = RegExp("^" + ma(q).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), za = Math.floor, z = y.propertyIsEnumerable, Pa = L.splice, M = A(M = B.Uint8Array) && M, Y = A(Y = Array.isArray) && Y, N = A(N = Object.keys) && N, fa = Math.max, Aa = Math.min, L = Math.pow(2, 32) - 1, Ba = L - 1, ya = L >>> 1, ca = Math.pow(2, 53) - 1, g = {};
    g["[object Array]"] = g["[object Date]"] = g["[object Number]"] = {
        constructor: true,
        toLocaleString: true,
        toString: true,
        valueOf: true
    };
    g["[object Boolean]"] = g[V] = {
        constructor: true,
        toString: true,
        valueOf: true
    };
    g[T] = g[U] = g[la] = {
        constructor: true,
        toString: true
    };
    g[W] = {
        constructor: true
    };
    (function(a, b) {
        for (var c = -1, d = a.length; ++c < d && false !== b(a[c], c, a); ) ;
        return a;
    })(X, function(a) {
        for (var b in g) if (u.call(g, b)) {
            var c = g[b];
            c[a] = u.call(c, a);
        }
    });
    var k = f.support = {};
    (function(a) {
        function b() {
            this.x = 1;
        }
        var c = {
            0: 1,
            length: 1
        }, d = [];
        b.prototype = {
            valueOf: 1,
            y: 1
        };
        for (var e in new b()) d.push(e);
        k.argsTag = q.call(arguments) == ia;
        k.enumErrorProps = z.call(J, "message") || z.call(J, "name");
        k.enumPrototypes = z.call(b, "prototype");
        k.funcDecomp = !A(B.WinRTError) && Na.test(function() {
            return this;
        });
        k.funcNames = typeof Function.name == "string";
        k.nonEnumStrings = !z.call("x", 0);
        k.nonEnumShadows = !/valueOf/.test(d);
        k.spliceObjects = (Pa.call(c, 0, 1), !c[0]);
        k.unindexedChars = "xx" != "x"[0] + Object("x")[0];
        try {
            k.nonEnumArgs = !z.call(arguments, 1);
        } catch (f) {
            k.nonEnumArgs = true;
        }
    })(0, 0);
    f.templateSettings = {
        escape: /<%-([\s\S]+?)%>/g,
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: qa,
        variable: "",
        imports: {
            _: f
        }
    };
    k.argsTag || (H = function(a) {
        return s(t(a) ? a.length : I) && u.call(a, "callee") && !z.call(a, "callee") || false;
    });
    var F = Y || function(a) {
        return t(a) && s(a.length) && "[object Array]" == q.call(a) || false;
    };
    if (x(/x/) || M && !x(M)) x = function(a) {
        return q.call(a) == U;
    };
    var E = N ? function(a) {
        if (a) var b = a.constructor, c = a.length;
        return typeof b == "function" && b.prototype === a || (typeof a == "function" ? f.support.enumPrototypes : c && s(c)) ? da(a) : w(a) ? N(a) : [];
    } : da;
    f.keys = E;
    f.keysIn = ea;
    f.values = ha;
    f.attempt = oa;
    f.escape = function(a) {
        return (a = v(a)) && Ka.test(a) ? a.replace(pa, ta) : a;
    };
    f.escapeRegExp = ma;
    f.identity = ga;
    f.includes = R;
    f.indexOf = Q;
    f.isArguments = H;
    f.isArray = F;
    f.isError = S;
    f.isFunction = x;
    f.isNative = A;
    f.isNumber = function(a) {
        return typeof a == "number" || t(a) && "[object Number]" == q.call(a) || false;
    };
    f.isObject = w;
    f.isRegExp = ka;
    f.isString = G;
    f.template = function(a, b, c) {
        var d = f.templateSettings;
        c && P(a, b, c) && (b = c = null);
        a = v(a);
        b = D(D({}, c || b), d, aa);
        c = D(D({}, b.imports), d.imports, aa);
        var e = E(c), g = ba(c, e), k, m, n = 0;
        c = b.interpolate || K;
        var h = "__p+='", l = "sourceURL" in b ? "//# sourceURL=" + b.sourceURL + "\n" : "";
        a.replace(RegExp((b.escape || K).source + "|" + c.source + "|" + (c === qa ? La : K).source + "|" + (b.evaluate || K).source + "|$", "g"), function(b, c, d, e, f, g) {
            d || (d = e);
            h += a.slice(n, g).replace(Oa, va);
            c && (k = true, h += "'+__e(" + c + ")+'");
            f && (m = true, h += "';" + f + ";\n__p+='");
            d && (h += "'+((__t=(" + d + "))==null?'':__t)+'");
            n = g + b.length;
            return b;
        });
        h += "';";
        (b = b.variable) || (h = "with(obj){" + h + "}");
        h = (m ? h.replace(Ha, "") : h).replace(Ia, "$1").replace(Ja, "$1;");
        h = "function(" + (b || "obj") + "){" + (b ? "" : "obj||(obj={});") + "var __t,__p=''" + (k ? ",__e=_.escape" : "") + (m ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + h + "return __p}";
        b = oa(function() {
            return Function(e, l + "return " + h).apply(I, g);
        });
        b.source = h;
        if (S(b)) throw b;
        return b;
    };
    f.trim = function(a, b, c) {
        var d = a;
        a = v(a);
        if (!a) return a;
        if (c ? P(d, b, c) : null == b) {
            for (b = a.length; b-- && $(a.charCodeAt(b)); ) ;
            c = -1;
            for (d = a.length; ++c < d && $(a.charCodeAt(c)); ) ;
            return a.slice(c, b + 1);
        }
        b += "";
        return a.slice(ra(a, b), sa(a, b) + 1);
    };
    f.trunc = function(a, b, c) {
        c && P(a, b, c) && (b = null);
        var d = 30;
        c = "...";
        if (null != b) if (w(b)) {
            var e = "separator" in b ? b.separator : e, d = "length" in b ? +b.length || 0 : d;
            c = "omission" in b ? v(b.omission) : c;
        } else d = +b || 0;
        a = v(a);
        if (d >= a.length) return a;
        d -= c.length;
        if (1 > d) return c;
        b = a.slice(0, d);
        if (null == e) return b + c;
        if (ka(e)) {
            if (a.slice(d).search(e)) {
                var f, g = a.slice(0, d);
                e.global || (e = RegExp(e.source, (Ma.exec(e) || "") + "g"));
                for (e.lastIndex = 0; a = e.exec(g); ) f = a.index;
                b = b.slice(0, null == f ? d : f);
            }
        } else a.indexOf(e, d) != d && (e = b.lastIndexOf(e), -1 < e && (b = b.slice(0, e)));
        return b + c;
    };
    f.contains = R;
    f.include = R;
    f.VERSION = "3.2.0";
    typeof define == "function" && typeof define.amd == "object" && define.amd ? (B._ = f, 
    define(function() {
        return f;
    })) : C && r ? n ? (r.exports = f)._ = f : C._ = f : B._ = f;
}).call(this);

"use strict";

var regPubMatch = /productNo(?:\.exact|\.raw)?(?=\:|$)/, regEmerge = / ?emerge/g, regHidden = / ?hidden/g, regLoad = / ?loading/g, regSelected = / ?selected/g, regFiltered = / ?filtered/g, regOpened = / ?opened/g, regDone = / ?done|$/gm, regFail = / ?failed/g;

function addEvent(element, evt, fnc) {
    return element.addEventListener(evt, fnc, false);
}

function removeEvent(element, evt, fnc) {
    return element.removeEventListener(evt, fnc, false);
}

function swapClass(element, string, regex) {
    if (string !== "") {
        element.className = regex.test(element.className) ? element.className.replace(regex, "") + " " + string : element.className + " " + string;
    } else {
        element.className = element.className.replace(regex, "");
    }
}

String.prototype.toTitle = function() {
    return this.replace(/(?:\W?)\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

String.prototype.toPubName = function() {
    var removed, count = 0, extraction = [], regQueryPubName = /(?:\b[\-_a-zA-Z]{1,3})?[ \t\-]*(?:(?:[\.\-]|[0-9]+)+)+(?:_?(?:sup|SUP)[A-Za-z]*)?/g, regEOLDashCheck = /[\-\cI\v\0\f]$/m;
    removed = this.replace(regQueryPubName, function(txt) {
        if (extraction && extraction.length > 0 && regEOLDashCheck.test(extraction[count - 1])) {
            extraction[count - 1] += txt.toUpperCase().replace(/\s/g, "");
        } else {
            extraction.push(txt.toUpperCase().replace(/\s/g, ""));
        }
        count += 1;
        return "";
    });
    return {
        extract: extraction,
        remove: removed
    };
};

window.downloader = function(el) {
    var link = document.createElement("a"), file = el.href || el.getAttribute("href") || "";
    if (file === "") {
        return false;
    }
    link.download = el.download || el.getAttribute("download");
    link.href = file;
    link.target = "_blank";
    try {
        link.click();
    } catch (e) {
        try {
            window.open(file);
        } catch (ee) {
            window.location.href = file;
        }
    }
    return false;
};

var App = function() {
    "use strict";
    var months = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    }, wrap_ = document.getElementById("wrap"), searchWrap_ = document.getElementById("search-wrap"), searchRestore_ = document.getElementById("search-restore"), page_ = document.getElementById("page"), pageHeader_ = document.getElementById("page-header"), results_ = document.getElementById("results"), noResults_ = document.getElementById("no-results"), summary_ = document.getElementById("summary"), count_ = document.getElementById("count"), term_ = document.getElementById("term"), total_ = document.getElementById("total"), query_ = document.getElementById("query"), send_ = document.getElementById("send"), moreMeta_ = document.getElementById("more-meta"), moreContent_ = document.getElementById("more-content"), related_ = document.getElementById("related"), infiniLabel_ = document.getElementById("infini-label"), infiniScroll_ = document.getElementById("infini-scroll"), loader_ = document.getElementById("loader"), placeContent = document.cookie.placeContent || "", placeMeta = document.cookie.placeMeta || "", bodyRect, relatedRect, resultsRect, relatedOffsetTop, stickyBarPosition;
    CSSStyleSheet.prototype.addCSSRule = function(selector, rules, index) {
        if ("insertRule" in this) {
            this.insertRule(selector + "{" + rules + "}", index);
        } else if ("addRule" in this) {
            this.addRule(selector, rules, index);
        }
    };
    function filterOutliers(someArray) {
        var values = someArray.concat();
        values.sort(function(a, b) {
            return a - b;
        });
        var q1 = values[Math.floor(values.length / 4)];
        var q3 = values[Math.ceil(values.length * (3 / 4))];
        var iqr = q3 - q1;
        var maxValue = q3 + iqr * 1.5;
        return values.filter(function(x) {
            return x > maxValue;
        });
    }
    return {
        wrap_: wrap_,
        searchWrap_: searchWrap_,
        searchRestore_: searchRestore_,
        page_: page_,
        pageHeader_: pageHeader_,
        results_: results_,
        noResults_: noResults_,
        summary_: summary_,
        count_: count_,
        term_: term_,
        total_: total_,
        query_: query_,
        send_: send_,
        moreMeta_: moreMeta_,
        moreContent_: moreContent_,
        related_: related_,
        placeContent: placeContent,
        placeMeta: placeMeta,
        infiniLabel_: infiniLabel_,
        infiniScroll_: infiniScroll_,
        loader_: loader_,
        infiniScroll: true,
        loading: {
            now: false,
            stillMore: false,
            currentHeight: 0
        },
        bodyRect: bodyRect,
        relatedRect: relatedRect,
        resultsRect: resultsRect,
        relatedOffsetTop: relatedOffsetTop,
        stickyBarPosition: stickyBarPosition,
        traveling: false,
        pos: 0,
        term: "",
        scoresContent: [],
        scoresRelatives: [],
        selectedResults: [],
        selectedTotal: 0,
        colors: {},
        isSearchOpen: null,
        isFailure: null,
        isDone: null,
        dataRender: function(data, allScores) {
            var output = {}, regType = /chapter|section/, index, group, number, fullPub, rawText, text, date, highlights, fileFormat;
            if (!data._source && data.key && data.score) {
                index = _.indexOf(allScores, data.score);
                group = index > -1 ? " match-" + index : "";
                app.colors[data.key] = index;
                output = {
                    url: ("https:" == document.location.protocol ? "https://that.pub/get/" : "http://get.that.pub/") + data.key.toLowerCase() + ".pdf",
                    key: data.key,
                    score: data.score,
                    gravitas: _.contains(filterOutliers(allScores), data.score) || data.score >= 1 ? " pretty" + group : " boring" + group
                };
            } else if (data._source.text) {
                number = data._source.number;
                text = data.highlight["text.english2"];
                rawText = data._source.text;
                fullPub = data._source.productNo;
                highlights = Object.keys(data.highlight);
                fileFormat = data._type !== "form" ? ".pdf" : ".xfdl";
                if (regPubMatch.test(highlights.join(":"))) {
                    fullPub = data.highlight["productNo.exact"] || data.highlight["productNo.raw"] || data.highlight.productNo;
                    fullPub = fullPub.shift();
                }
                date = data._source.releaseDate ? data._source.releaseDate.substring(6, 8) + " " + months[data._source.releaseDate.substring(4, 6)] + " " + data._source.releaseDate.substring(0, 4) : data._source.publishedDate.substring(0, 2) + " " + months[data._source.publishedDate.substring(2, 4)] + " " + data._source.publishedDate.substring(4, 8);
                if (regType.test(data._type) && data._type.length == 7) {
                    number = data._type.toTitle() + " " + data._source.number;
                }
                index = app.colors[data._source.productNo || data._source.pubName];
                group = _.isNumber(index) && (index >= 0 || index < 5) ? " match-" + index : "";
                output = {
                    score: data._score,
                    gravitas: _.contains(filterOutliers(allScores), data._score) || data._score >= 1 ? " pretty" + group : " boring" + group,
                    date: date,
                    url: ("https:" == document.location.protocol ? "https://that.pub/get/" : "http://get.that.pub/") + data._source.productNo.toLowerCase() + fileFormat,
                    fullPub: fullPub,
                    title: data.highlight.title || data._source.title || null,
                    rawTitle: data._source.title,
                    sub: rawText ? number : "",
                    details: {
                        chapter: data._source.chapter && data._source.chapter.number || null,
                        chapterTitle: data.highlight["chapter.title"] || data._source.chapter && data._source.chapter.title || null,
                        section: data._source.section && data._source.section.number || null,
                        sectionTitle: data.highlight["section.title"] || data._source.section && data._source.section.title || null
                    },
                    rawText: rawText,
                    concatText: data.highlight["text"] && data.highlight["text"][0] || null,
                    parts: Array.isArray(text) ? text : null,
                    fileFormat: fileFormat,
                    type: rawText ? " content" : " doc"
                };
            }
            return output || null;
        },
        querySetup: function(term) {
            return function(name) {
                return {
                    term: term,
                    pubName: name.extract,
                    noPubName: name.remove
                };
            }(term.toPubName());
        },
        addItem: function(results, templateCode, allScores) {
            var tmp = "", that = this, rl = results.length, a = 0;
            for (;a < rl; ++a) {
                tmp += _.template(templateCode)(that.dataRender(results[a], allScores));
            }
            return tmp;
        },
        searchToggle: function(action) {
            if (action === "close") {
                this.isSearchOpen = false;
                this.infiniScroll = this.infiniScroll_ ? this.infiniScroll_.checked || !!this.infiniScroll_.checked : true;
                swapClass(this.searchWrap_, "", regEmerge);
                swapClass(this.searchRestore_, "", regEmerge);
            } else if (action === "open") {
                this.isSearchOpen = true;
                this.infiniScroll = false;
                swapClass(this.searchRestore_, "emerge", regEmerge);
                swapClass(this.searchWrap_, "emerge", regEmerge);
            }
        }
    };
};

"use strict";

var app = new App();

app.resultTemplate = document.getElementById("result-template");

app.relatedTemplate = document.getElementById("related-template");

function revealText(event) {
    var open = regOpened.test(this.parentNode.className);
    this.innerHTML = "";
    if (!open) {
        swapClass(this.parentNode, "opened", regOpened);
        this.appendChild(document.createTextNode("collapse"));
    } else {
        this.parentNode.className = this.parentNode.className.replace(regOpened, "");
        this.appendChild(document.createTextNode("expand"));
    }
    event.preventDefault();
    return false;
}

function dataResponse(httpRequest, action) {
    var response = JSON.parse(httpRequest.responseText), content = response[0] || null, meta = response[1] || null;
    if (content && content.hits.total === 0 && meta && meta.hits.total === 0) {
        app.isFailure = true;
        app.infiniScroll = false;
        app.isDone = true;
        document.cookie = "placeContent=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        return swapClass(app.noResults_, "failed", regFail);
    }
    var a = 0, b = 0, reveals, rl;
    var expires = new Date(Date.now() + 36e5);
    app.isDone = true;
    expires = expires.toUTCString();
    if (content) {
        var currentContent = content.hits.hits.length;
        app.term_.innerHTML = app.term;
        app.total_.innerHTML = content.hits.total;
        app.placeContent = content._scroll_id;
        document.cookie = "placeContent=" + app.placeContent + "; expires=" + expires;
        if (action !== "more") {
            var currentRelatives = content.aggregations.related_doc.buckets.length;
            window.scroll(0, 0);
            for (;b < currentContent; ++b) {
                app.scoresContent[b] = content.hits.hits[b]._score;
            }
            for (b = 0; b < currentRelatives; ++b) {
                app.scoresContent[b] = content.aggregations.related_doc.buckets[b].score;
            }
            app.related_.innerHTML = app.addItem(content.aggregations.related_doc.buckets, app.relatedTemplate.textContent || app.relatedTemplate.innerText, app.scoresRelatives);
            app.results_.innerHTML = app.addItem(content.hits.hits, app.resultTemplate.textContent || app.resultTemplate.innerText, app.scoresContent);
            app.count_.innerHTML = currentContent;
            app.relatedRect = app.related_.getBoundingClientRect();
            app.bodyRect = document.body.getBoundingClientRect();
            app.stickyBarPosition = Math.abs(app.relatedRect.top) + Math.abs(app.bodyRect.top) + Math.abs(app.relatedRect.height);
        } else {
            var contentGathered = app.scoresContent.length;
            for (b = 0; b < currentContent; ++b) {
                app.scoresContent[b + contentGathered] = content.hits.hits[b]._score;
            }
            app.results_.innerHTML += app.addItem(content.hits.hits, app.resultTemplate.textContent || app.resultTemplate.innerText, app.scoresContent);
            app.count_.innerHTML = app.scoresContent.length;
        }
        reveals = document.querySelectorAll(".reveal-text");
        rl = reveals.length;
        for (;a < rl; ++a) {
            addEvent(reveals[a], "click", revealText);
        }
        if (content.hits.hits.length < 20) {
            swapClass(app.moreContent_, "hidden", regHidden);
            app.loading.stillMore = false;
        } else {
            swapClass(app.moreContent_, "", regHidden);
            app.loading.stillMore = true;
        }
    }
    if (meta) {
        app.placeMeta = meta._scroll_id;
        document.cookie = "placeMeta=" + app.placeMeta + "; expires=" + expires;
    }
    app.resultsRect = app.results_.getBoundingClientRect();
    app.loading.currentHeight = Math.abs(app.resultsRect.height);
}

function sendData(responder, query, type, action, spot, dot, clbk) {
    var httpRequest = new XMLHttpRequest();
    var url = "//that.pub/find/" + type + "/" + action;
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                responder(httpRequest, action);
                clbk(action === "more" ? null : "");
            }
        }
    };
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(JSON.stringify({
        t: app.querySetup(query),
        g: spot,
        s: dot
    }));
}

function more(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    if (app.loading.now !== true) {
        swapClass(app.loader_, "loading", regLoad);
    }
    sendData(dataResponse, document.cookie.placeContent || app.placeContent ? "" : app.term, "content", "more", document.cookie.placeContent || app.placeContent, null, endLoading);
    return false;
}

function modalClose(event) {
    if (event.target === event.currentTarget) {
        app.searchToggle("close");
    }
}

function scrollWheeler() {
    var t = document.documentElement || document.body.parentNode, pos = (t && typeof t.ScrollTop === "number" ? t : document.body).ScrollTop || window.pageYOffset, delta = pos - app.pos;
    if (app.infiniScroll === true && app.loading.now === false && app.loading.stillMore === true && delta > 0 && pos > app.loading.currentHeight - 1200) {
        app.loading.now = true;
        more();
    }
    app.pos = pos;
}

function infini() {
    var status, doThis;
    app.infiniScroll = this.checked || !!this.checked;
    status = app.infiniScroll ? "enabled" : "disabled";
    doThis = app.infiniScroll ? "Disable" : "Enable";
    app.infiniLabel_.className = status;
    app.infiniLabel_.setAttribute("title", doThis + " infinite scroll");
    if (!status) {
        this.removeAttribute("checked");
    }
}

function endLoading(el) {
    el = el === null ? app.moreContent_ : el === "" ? app.send_ : null;
    swapClass(app.loader_, "", regLoad);
    app.loading.now = false;
    if (app.isSearchOpen === true) {
        app.searchToggle("close");
    }
}

"use strict";

addEvent(app.send_, "click", function(event) {
    event.preventDefault();
    if (!_.trim(app.query_.value)) {
        app.query_.focus();
        snabbt(app.query_, "attention", {
            rotation: [ 0, 0, Math.PI / 2 ],
            springConstant: 1.9,
            springDeacceleration: .9
        });
        return false;
    }
    swapClass(app.loader_, "loading", regLoad);
    app.term = _.trim(app.query_.value);
    sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);
    return false;
});

addEvent(app.query_, "focus", function() {
    return false;
});

addEvent(app.query_, "keypress", function(event) {
    if (event.which === 13) {
        app.send_.click();
        return false;
    }
});

addEvent(document, "keyup", function(event) {
    if (event.which === 27) {
        event.preventDefault();
        if (app.isSearchOpen === true) {
            app.searchToggle("close");
        } else {}
    }
});

addEvent(app.moreContent_, "click", more);

addEvent(app.moreMeta_, "click", function(event) {
    event.preventDefault();
    swapClass(app.loader_, "loading", regLoad);
    sendData(dataResponse, document.cookie.placeMeta || app.placeMeta ? "" : app.term, "meta", "more", null, document.cookie.placeMeta || app.placeMeta, endLoading);
    return false;
});

addEvent(app.searchRestore_, "click", function(event) {
    event.preventDefault();
    if (app.isSearchOpen === true) {
        if (app.isDone === true) {
            app.searchToggle("close");
        } else {
            return false;
        }
    } else {
        app.searchToggle("open");
        app.query_.value = app.term || "";
        app.query_.focus();
    }
    return false;
});

addEvent(app.infiniScroll_, "change", infini);

addEvent(window, "scroll", scrollWheeler);

addEvent(window, "load", function() {
    app.isSearchOpen = true;
    app.query_.focus();
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.type = "text/css";
    l.href = "//fonts.googleapis.com/css?family=Lato:300,300italic,700";
    document.getElementsByTagName("head")[0].appendChild(l);
});
//# sourceMappingURL=script.js.map