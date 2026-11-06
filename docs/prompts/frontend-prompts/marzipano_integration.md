# Marzipano API Integration

This Markdown file documents all of the file-folder structure of panoramic photos used in CIIT Virtual Campus Tour with Marzipano API.

## IMPORTANT RULES:

1. All of the headers are prerequesites, meaning that the first step must be accomplished first before jumping in to the second one. This should be the sequential flow of the Marizpano API Integration:

```
Assets Folder Structure
|
Panoramic Photos APP_DATA
|
HTML Structure
|
JavaScript Structure
|
CSS Style Structure

```

2. Sidebar navigation guide: Use the guide indicated below to integrate `PanoramaViewer.jsx` to `Sidebar.jsx` navigation buttons.

---

## Assets Folder Structre

**Navigation Buttons:** The navigation button images are contained inside the `img\` folder unders the `assets\` parent folder.

**Panoramic Photos Slices:** The panoramic photos are contained inside the `tiles\` folder under the `assets\` folder.

**Vendor files:** The information about the vendor "Marzipano API" is contained inside the `vendor\` folder, sitting on the root project folder to see about the partnered API's details.

---

## Panoramic photos APP_DATA

`data.js`: This JS file contains all of the information about the folder id, name of the floor, tile sizes, and all of the other parameters needed in the Marzipano API. - **File path**: `lib\` folder

---

## HTML Structure

This is the exact HTML structure of Marzipano API when displaying the fully-functional panoramic viewer.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>CIIT Glitch Tower Tour</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui"
    />
    <style>
      @-ms-viewport {
        width: device-width;
      }
    </style>
    <link rel="stylesheet" href="vendor/reset.min.css" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body class="multiple-scenes ">
    <div id="pano"></div>

    <div id="sceneList">
      <ul class="scenes">
        <a href="javascript:void(0)" class="scene" data-id="0-lg---1">
          <li class="text">LG - 1</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="1-lg---2">
          <li class="text">LG - 2</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="2-lg---3">
          <li class="text">LG - 3</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="3-lg---4">
          <li class="text">LG - 4</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="4-lg---5">
          <li class="text">LG - 5</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="5-ug---1">
          <li class="text">UG - 1</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="6-ug---2">
          <li class="text">UG - 2</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="7-ug---3">
          <li class="text">UG - 3</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="8-ug---4">
          <li class="text">UG - 4</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="9-ug---5">
          <li class="text">UG - 5</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="10-4f---1">
          <li class="text">4F - 1</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="11-4f---2">
          <li class="text">4F - 2</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="12-4f---3">
          <li class="text">4F - 3</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="13-4f---4">
          <li class="text">4F - 4</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="14-4f---6">
          <li class="text">4F - 6</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="15-4f---7">
          <li class="text">4F - 7</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="16-4f---11">
          <li class="text">4F - 11</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="17-4f---12">
          <li class="text">4F - 12</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="18-4f---14">
          <li class="text">4F - 14</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="19-4f---15">
          <li class="text">4F - 15</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="20-4f---17">
          <li class="text">4F - 17</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="21-4f---18">
          <li class="text">4F - 18</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="22-4f---19">
          <li class="text">4F - 19</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="23-5f---1">
          <li class="text">5F - 1</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="24-5f---2">
          <li class="text">5F - 2</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="25-5f---6">
          <li class="text">5F - 6</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="26-5f---7">
          <li class="text">5F - 7</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="27-5m---1">
          <li class="text">5M - 1</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="28-5m---2">
          <li class="text">5M - 2</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="29-6f---2">
          <li class="text">6F - 2</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="30-6f---5">
          <li class="text">6F - 5</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="31-6f---7">
          <li class="text">6F - 7</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="32-6f---8">
          <li class="text">6F - 8</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="33-6f---10">
          <li class="text">6F - 10</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="34-6f---11">
          <li class="text">6F - 11</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="35-7f---2">
          <li class="text">7F - 2</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="36-7f---3">
          <li class="text">7F - 3</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="37-7f---4">
          <li class="text">7F - 4</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="38-7f---5">
          <li class="text">7F - 5</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="39-7f---6">
          <li class="text">7F - 6</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="40-7f---7">
          <li class="text">7F - 7</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="41-7f---8">
          <li class="text">7F - 8</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="42-8f---2">
          <li class="text">8F - 2</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="43-8f---3">
          <li class="text">8F - 3</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="44-8f---4">
          <li class="text">8F - 4</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="45-8f---5">
          <li class="text">8F - 5</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="46-8f---6">
          <li class="text">8F - 6</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="47-8f---7">
          <li class="text">8F - 7</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="48-9f---1">
          <li class="text">9F - 1</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="49-9f---2">
          <li class="text">9F - 2</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="50-9f---4">
          <li class="text">9F - 4</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="51-9f---5">
          <li class="text">9F - 5</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="52-9f---6">
          <li class="text">9F - 6</li>
        </a>

        <a href="javascript:void(0)" class="scene" data-id="53-9f---8">
          <li class="text">9F - 8</li>
        </a>
      </ul>
    </div>

    <div id="titleBar">
      <h1 class="sceneName"></h1>
    </div>

    <a href="javascript:void(0)" id="autorotateToggle">
      <img class="icon off" src="img/play.png" />
      <img class="icon on" src="img/pause.png" />
    </a>

    <a href="javascript:void(0)" id="fullscreenToggle">
      <img class="icon off" src="img/fullscreen.png" />
      <img class="icon on" src="img/windowed.png" />
    </a>

    <a href="javascript:void(0)" id="sceneListToggle">
      <img class="icon off" src="img/expand.png" />
      <img class="icon on" src="img/collapse.png" />
    </a>

    <a
      href="javascript:void(0)"
      id="viewUp"
      class="viewControlButton viewControlButton-1"
    >
      <img class="icon" src="img/up.png" />
    </a>
    <a
      href="javascript:void(0)"
      id="viewDown"
      class="viewControlButton viewControlButton-2"
    >
      <img class="icon" src="img/down.png" />
    </a>
    <a
      href="javascript:void(0)"
      id="viewLeft"
      class="viewControlButton viewControlButton-3"
    >
      <img class="icon" src="img/left.png" />
    </a>
    <a
      href="javascript:void(0)"
      id="viewRight"
      class="viewControlButton viewControlButton-4"
    >
      <img class="icon" src="img/right.png" />
    </a>
    <a
      href="javascript:void(0)"
      id="viewIn"
      class="viewControlButton viewControlButton-5"
    >
      <img class="icon" src="img/plus.png" />
    </a>
    <a
      href="javascript:void(0)"
      id="viewOut"
      class="viewControlButton viewControlButton-6"
    >
      <img class="icon" src="img/minus.png" />
    </a>

    <script src="vendor/screenfull.min.js"></script>
    <script src="vendor/bowser.min.js"></script>
    <script src="vendor/marzipano.js"></script>

    <script src="data.js"></script>
    <script src="index.js"></script>
  </body>
</html>
```

### Migration Rules:

1. Read and analyze the HTML structure provided above, migrate this HTML to `PanoramaViewer.jsx` to integrate from vanilla HTML to React component.

2. All of the global codes should in this HTML shall be migrated to `App.jsx`, `index.css`, or `main.jsx` if possible.

---

## JavaScript Structure

This is the exact JS structure of Marzipano API to make the HTML functional and usable. This is the full code from Marzipano API to be migrated in `Marzipano.jsx` then this file will be imported in `PanoramaViewer.jsx` for integration.

```javascript
/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

(function () {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // Grab elements from DOM.
  var panoElement = document.querySelector("#pano");
  var sceneNameElement = document.querySelector("#titleBar .sceneName");
  var sceneListElement = document.querySelector("#sceneList");
  var sceneElements = document.querySelectorAll("#sceneList .scene");
  var sceneListToggleElement = document.querySelector("#sceneListToggle");
  var autorotateToggleElement = document.querySelector("#autorotateToggle");
  var fullscreenToggleElement = document.querySelector("#fullscreenToggle");

  // Detect desktop or mobile mode.
  if (window.matchMedia) {
    var setMode = function () {
      if (mql.matches) {
        document.body.classList.remove("desktop");
        document.body.classList.add("mobile");
      } else {
        document.body.classList.remove("mobile");
        document.body.classList.add("desktop");
      }
    };
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    setMode();
    mql.addListener(setMode);
  } else {
    document.body.classList.add("desktop");
  }

  // Detect whether we are on a touch device.
  document.body.classList.add("no-touch");
  window.addEventListener("touchstart", function () {
    document.body.classList.remove("no-touch");
    document.body.classList.add("touch");
  });

  // Use tooltip fallback mode on IE < 11.
  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add("tooltip-fallback");
  }

  // Viewer options.
  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode,
    },
  };

  // Initialize viewer.
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  // Create scenes.
  var scenes = data.scenes.map(function (data) {
    var urlPrefix = "tiles";
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + "/" + data.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/preview.jpg" },
    );
    var geometry = new Marzipano.CubeGeometry(data.levels);

    var limiter = Marzipano.RectilinearView.limit.traditional(
      data.faceSize,
      (100 * Math.PI) / 180,
      (120 * Math.PI) / 180,
    );
    var view = new Marzipano.RectilinearView(
      data.initialViewParameters,
      limiter,
    );

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true,
    });

    // Create link hotspots.
    data.linkHotspots.forEach(function (hotspot) {
      var element = createLinkHotspotElement(hotspot);
      scene
        .hotspotContainer()
        .createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    // Create info hotspots.
    data.infoHotspots.forEach(function (hotspot) {
      var element = createInfoHotspotElement(hotspot);
      scene
        .hotspotContainer()
        .createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    return {
      data: data,
      scene: scene,
      view: view,
    };
  });

  // Set up autorotate, if enabled.
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2,
  });
  if (data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add("enabled");
  }

  // Set handler for autorotate toggle.
  autorotateToggleElement.addEventListener("click", toggleAutorotate);

  // Set up fullscreen mode, if supported.
  if (screenfull.enabled && data.settings.fullscreenButton) {
    document.body.classList.add("fullscreen-enabled");
    fullscreenToggleElement.addEventListener("click", function () {
      screenfull.toggle();
    });
    screenfull.on("change", function () {
      if (screenfull.isFullscreen) {
        fullscreenToggleElement.classList.add("enabled");
      } else {
        fullscreenToggleElement.classList.remove("enabled");
      }
    });
  } else {
    document.body.classList.add("fullscreen-disabled");
  }

  // Set handler for scene list toggle.
  sceneListToggleElement.addEventListener("click", toggleSceneList);

  // Start with the scene list open on desktop.
  if (!document.body.classList.contains("mobile")) {
    showSceneList();
  }

  // Set handler for scene switch.
  scenes.forEach(function (scene) {
    var el = document.querySelector(
      '#sceneList .scene[data-id="' + scene.data.id + '"]',
    );
    el.addEventListener("click", function () {
      switchScene(scene);
      // On mobile, hide scene list after selecting a scene.
      if (document.body.classList.contains("mobile")) {
        hideSceneList();
      }
    });
  });

  // DOM elements for view controls.
  var viewUpElement = document.querySelector("#viewUp");
  var viewDownElement = document.querySelector("#viewDown");
  var viewLeftElement = document.querySelector("#viewLeft");
  var viewRightElement = document.querySelector("#viewRight");
  var viewInElement = document.querySelector("#viewIn");
  var viewOutElement = document.querySelector("#viewOut");

  // Dynamic parameters for controls.
  var velocity = 0.7;
  var friction = 3;

  // Associate view controls with elements.
  var controls = viewer.controls();
  controls.registerMethod(
    "upElement",
    new Marzipano.ElementPressControlMethod(
      viewUpElement,
      "y",
      -velocity,
      friction,
    ),
    true,
  );
  controls.registerMethod(
    "downElement",
    new Marzipano.ElementPressControlMethod(
      viewDownElement,
      "y",
      velocity,
      friction,
    ),
    true,
  );
  controls.registerMethod(
    "leftElement",
    new Marzipano.ElementPressControlMethod(
      viewLeftElement,
      "x",
      -velocity,
      friction,
    ),
    true,
  );
  controls.registerMethod(
    "rightElement",
    new Marzipano.ElementPressControlMethod(
      viewRightElement,
      "x",
      velocity,
      friction,
    ),
    true,
  );
  controls.registerMethod(
    "inElement",
    new Marzipano.ElementPressControlMethod(
      viewInElement,
      "zoom",
      -velocity,
      friction,
    ),
    true,
  );
  controls.registerMethod(
    "outElement",
    new Marzipano.ElementPressControlMethod(
      viewOutElement,
      "zoom",
      velocity,
      friction,
    ),
    true,
  );

  function sanitize(s) {
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
  }

  function switchScene(scene) {
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo();
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
  }

  function updateSceneName(scene) {
    sceneNameElement.innerHTML = sanitize(scene.data.name);
  }

  function updateSceneList(scene) {
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      if (el.getAttribute("data-id") === scene.data.id) {
        el.classList.add("current");
      } else {
        el.classList.remove("current");
      }
    }
  }

  function showSceneList() {
    sceneListElement.classList.add("enabled");
    sceneListToggleElement.classList.add("enabled");
  }

  function hideSceneList() {
    sceneListElement.classList.remove("enabled");
    sceneListToggleElement.classList.remove("enabled");
  }

  function toggleSceneList() {
    sceneListElement.classList.toggle("enabled");
    sceneListToggleElement.classList.toggle("enabled");
  }

  function startAutorotate() {
    if (!autorotateToggleElement.classList.contains("enabled")) {
      return;
    }
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(3000, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    if (autorotateToggleElement.classList.contains("enabled")) {
      autorotateToggleElement.classList.remove("enabled");
      stopAutorotate();
    } else {
      autorotateToggleElement.classList.add("enabled");
      startAutorotate();
    }
  }

  function createLinkHotspotElement(hotspot) {
    // Create wrapper element to hold icon and tooltip.
    var wrapper = document.createElement("div");
    wrapper.classList.add("hotspot");
    wrapper.classList.add("link-hotspot");

    // Create image element.
    var icon = document.createElement("img");
    icon.src = "img/link.png";
    icon.classList.add("link-hotspot-icon");

    // Set rotation transform.
    var transformProperties = [
      "-ms-transform",
      "-webkit-transform",
      "transform",
    ];
    for (var i = 0; i < transformProperties.length; i++) {
      var property = transformProperties[i];
      icon.style[property] = "rotate(" + hotspot.rotation + "rad)";
    }

    // Add click event handler.
    wrapper.addEventListener("click", function () {
      switchScene(findSceneById(hotspot.target));
    });

    // Prevent touch and scroll events from reaching the parent element.
    // This prevents the view control logic from interfering with the hotspot.
    stopTouchAndScrollEventPropagation(wrapper);

    // Create tooltip element.
    var tooltip = document.createElement("div");
    tooltip.classList.add("hotspot-tooltip");
    tooltip.classList.add("link-hotspot-tooltip");
    tooltip.innerHTML = findSceneDataById(hotspot.target).name;

    wrapper.appendChild(icon);
    wrapper.appendChild(tooltip);

    return wrapper;
  }

  function createInfoHotspotElement(hotspot) {
    // Create wrapper element to hold icon and tooltip.
    var wrapper = document.createElement("div");
    wrapper.classList.add("hotspot");
    wrapper.classList.add("info-hotspot");

    // Create hotspot/tooltip header.
    var header = document.createElement("div");
    header.classList.add("info-hotspot-header");

    // Create image element.
    var iconWrapper = document.createElement("div");
    iconWrapper.classList.add("info-hotspot-icon-wrapper");
    var icon = document.createElement("img");
    icon.src = "img/info.png";
    icon.classList.add("info-hotspot-icon");
    iconWrapper.appendChild(icon);

    // Create title element.
    var titleWrapper = document.createElement("div");
    titleWrapper.classList.add("info-hotspot-title-wrapper");
    var title = document.createElement("div");
    title.classList.add("info-hotspot-title");
    title.innerHTML = hotspot.title;
    titleWrapper.appendChild(title);

    // Create close element.
    var closeWrapper = document.createElement("div");
    closeWrapper.classList.add("info-hotspot-close-wrapper");
    var closeIcon = document.createElement("img");
    closeIcon.src = "img/close.png";
    closeIcon.classList.add("info-hotspot-close-icon");
    closeWrapper.appendChild(closeIcon);

    // Construct header element.
    header.appendChild(iconWrapper);
    header.appendChild(titleWrapper);
    header.appendChild(closeWrapper);

    // Create text element.
    var text = document.createElement("div");
    text.classList.add("info-hotspot-text");
    text.innerHTML = hotspot.text;

    // Place header and text into wrapper element.
    wrapper.appendChild(header);
    wrapper.appendChild(text);

    // Create a modal for the hotspot content to appear on mobile mode.
    var modal = document.createElement("div");
    modal.innerHTML = wrapper.innerHTML;
    modal.classList.add("info-hotspot-modal");
    document.body.appendChild(modal);

    var toggle = function () {
      wrapper.classList.toggle("visible");
      modal.classList.toggle("visible");
    };

    // Show content when hotspot is clicked.
    wrapper
      .querySelector(".info-hotspot-header")
      .addEventListener("click", toggle);

    // Hide content when close icon is clicked.
    modal
      .querySelector(".info-hotspot-close-wrapper")
      .addEventListener("click", toggle);

    // Prevent touch and scroll events from reaching the parent element.
    // This prevents the view control logic from interfering with the hotspot.
    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  // Prevent touch and scroll events from reaching the parent element.
  function stopTouchAndScrollEventPropagation(element, eventList) {
    var eventList = [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
      "wheel",
      "mousewheel",
    ];
    for (var i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function (event) {
        event.stopPropagation();
      });
    }
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) {
        return scenes[i];
      }
    }
    return null;
  }

  function findSceneDataById(id) {
    for (var i = 0; i < data.scenes.length; i++) {
      if (data.scenes[i].id === id) {
        return data.scenes[i];
      }
    }
    return null;
  }

  // Display the initial scene.
  switchScene(scenes[0]);
})();
```

## Migration Rules:

1. Make sure that all of the exact codes are included inside the `Marzipano.jsx` file and shall be useable and recognized by `PanoramaViewer.jsx`

2. Do not change anything inside the `Marzipano.jsx` file.

---

## CSS Style Structure

This is the exact vanilla CSS structure created by Marzipano API. This CSS styles must be migrated to Tailwind CSS inside the `PanoramaViewer.jsx`.

```css
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -ms-text-size-adjust: none;
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  -ms-content-zooming: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  background-color: #000;
  color: #fff;
}

a,
a:hover,
a:active,
a:visited {
  text-decoration: none;
  color: inherit;
}

#pano {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#titleBar {
  position: absolute;
  top: 0;
  left: 0;
  right: 40px;
  height: 40px;
  text-align: center;
}

.mobile #titleBar {
  height: 50px;
  right: 50px;
}

/* If there is a fullscreen button the title bar must make space for it */
body.fullscreen-enabled #titleBar {
  right: 80px;
}

body.fullscreen-enabled.mobile #titleBar {
  right: 100px;
}

/* If there are multiple scenes the title bar must make space for the scene list toggle */
body.multiple-scenes #titleBar {
  left: 40px;
}

body.multiple-scenes.mobile #titleBar {
  left: 50px;
}

#titleBar .sceneName {
  width: 100%;
  height: 100%;
  line-height: 30px;
  padding: 5px;
  background-color: rgb(58, 68, 84);
  background-color: rgba(58, 68, 84, 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.mobile #titleBar .sceneName {
  line-height: 40px;
}

#fullscreenToggle {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  padding: 5px;
  background-color: rgb(103, 115, 131);
  background-color: rgba(103, 115, 131, 0.8);
}

.mobile #fullscreenToggle {
  width: 50px;
  height: 50px;
}

body.fullscreen-enabled #fullscreenToggle {
  display: block;
}

#fullscreenToggle .icon {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
}

.mobile #fullscreenToggle .icon {
  top: 10px;
  right: 10px;
}

#fullscreenToggle .icon.on {
  display: none;
}

#fullscreenToggle .icon.off {
  display: block;
}

#fullscreenToggle.enabled .icon.on {
  display: block;
}

#fullscreenToggle.enabled .icon.off {
  display: none;
}

#autorotateToggle {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  padding: 5px;
  background-color: rgb(103, 115, 131);
  background-color: rgba(103, 115, 131, 0.8);
}

.mobile #autorotateToggle {
  width: 50px;
  height: 50px;
}

/* If there is a fullscreen button, autorotate must placed a bit to the left */
body.fullscreen-enabled #autorotateToggle {
  right: 40px;
}

body.fullscreen-enabled.mobile #autorotateToggle {
  right: 50px;
}

#autorotateToggle .icon {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
}

.mobile #autorotateToggle .icon {
  top: 10px;
  right: 10px;
}

#autorotateToggle .icon.on {
  display: none;
}

#autorotateToggle .icon.off {
  display: block;
}

#autorotateToggle.enabled .icon.on {
  display: block;
}

#autorotateToggle.enabled .icon.off {
  display: none;
}

#sceneListToggle {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  padding: 5px;
  background-color: rgb(103, 115, 131);
  background-color: rgba(103, 115, 131, 0.8);
}

.mobile #sceneListToggle {
  width: 50px;
  height: 50px;
}

#sceneListToggle .text {
  position: absolute;
  top: 5px;
  left: 15px;
  width: 100%;
  line-height: 30px;
}

#sceneListToggle .icon {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
}

.mobile #sceneListToggle .icon {
  top: 10px;
  right: 10px;
}

#sceneListToggle .icon.on {
  display: none;
}

#sceneListToggle .icon.off {
  display: block;
}

#sceneListToggle.enabled .icon.on {
  display: block;
}

#sceneListToggle.enabled .icon.off {
  display: none;
}

#sceneList {
  position: absolute;
  top: 0;
  left: -220px;
  padding-top: 40px;
  width: 220px;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  margin-left: 0;
  -webkit-transition: margin-left 0.5s ease-in-out;
  transition: margin-left 0.5s ease-in-out;
}

.mobile #sceneList {
  padding-top: 50px;
}

#sceneList .scenes {
  width: 100%;
  background-color: rgb(58, 68, 84);
  background-color: rgba(58, 68, 84, 0.8);
}

.mobile #sceneList {
  width: 100%;
  height: 100%;
  left: -100%;
}

.mobile #sceneList.enabled {
  margin-left: 100%;
}

.mobile #sceneList .scenes {
  height: 100%;
}

#sceneList.enabled {
  margin-left: 220px;
}

#sceneList .scene {
  display: block;
  width: 100%;
  height: 30px;
}

.mobile #sceneList .scene {
  height: 40px;
}

#sceneList .scene .text {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile #sceneList .scene .text {
  line-height: 40px;
}

.no-touch #sceneList .scene:hover {
  background-color: rgb(103, 115, 131);
  background-color: rgba(103, 115, 131, 0.8);
}

#sceneList .scene.current {
  background-color: rgb(103, 115, 131);
  background-color: rgba(103, 115, 131, 0.8);
}

/* Hide scene list when only a single scene exists */
body.single-scene #sceneList,
body.single-scene #sceneListToggle {
  display: none;
}

/* Link hotspot */

.link-hotspot {
  width: 60px;
  height: 60px;
  margin-left: -30px;
  margin-top: -30px;
  opacity: 0.9;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
}

.no-touch .link-hotspot:hover {
  opacity: 1;
}

.mobile .link-hotspot {
  width: 70px;
  height: 70px;
}

.link-hotspot-icon {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.link-hotspot-tooltip {
  position: absolute;
  left: 100%;
  top: 14px; /* ( 60 - (16 + 2*8) ) / 2 */

  margin-left: 3px;

  font-size: 16px;

  max-width: 300px;

  padding: 8px 10px;

  border-radius: 5px;

  background-color: rgb(58, 68, 84);
  background-color: rgba(58, 68, 84, 0.8);

  color: #fff;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  cursor: pointer;

  opacity: 0;

  -ms-transform: translateX(-8px);
  -webkit-transform: translateX(-8px);
  transform: translateX(-8px);

  -webkit-transition:
    -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    opacity 0.3s;
  transition:
    -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    opacity 0.3s;
}

.mobile .link-hotspot {
  top: 19px; /* ( 70 - (16 + 2*8) ) / 2 */
}

.no-touch .link-hotspot:hover .link-hotspot-tooltip {
  opacity: 1;
  -ms-transform: translateX(0);
  -webkit-transform: translateX(0);
  transform: translateX(0);
}

/* Prevent tooltip from triggering */
.link-hotspot-tooltip {
  pointer-events: none;
}
.no-touch .link-hotspot:hover .link-hotspot-tooltip {
  pointer-events: all;
}

/* Fallback mode without pointer-events (IE8-10) */
.tooltip-fallback .link-hotspot-tooltip {
  display: none;
}
.no-touch .tooltip-fallback .link-hotspot:hover .link-hotspot-tooltip {
  display: block;
}

/* Info hotspot */

.info-hotspot {
  line-height: 1.2em;
  opacity: 0.9;
  -webkit-transition: opacity 0.2s 0.2s;
  transition: opacity 0.2s 0.2s;
}

.no-touch .info-hotspot:hover {
  opacity: 1;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
}

.info-hotspot.visible {
  opacity: 1;
}

.info-hotspot .info-hotspot-header {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgb(103, 115, 131);
  cursor: pointer;
  -webkit-transition:
    width 0.3s ease-in-out 0.5s,
    border-radius 0.3s ease-in-out 0.5s;
  transition:
    width 0.3s ease-in-out 0.5s,
    border-radius 0.3s ease-in-out 0.5s;
}

.mobile .info-hotspot .info-hotspot-header {
  width: 50px;
  height: 50px;
  border-radius: 25px;
}

.desktop.no-touch .info-hotspot .info-hotspot-header:hover {
  width: 260px;
  border-radius: 5px;
  -webkit-transition:
    width 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
  transition:
    width 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
}

.desktop .info-hotspot.visible .info-hotspot-header,
.desktop.no-touch .info-hotspot.visible .info-hotspot-header:hover {
  width: 260px;
  border-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  -webkit-transition:
    width 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
  transition:
    width 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
}

.info-hotspot .info-hotspot-icon-wrapper {
  width: 40px;
  height: 40px;
}

.mobile .info-hotspot .info-hotspot-icon-wrapper {
  width: 50px;
  height: 50px;
}

.info-hotspot .info-hotspot-icon {
  width: 90%;
  height: 90%;
  margin: 5%;
}

.info-hotspot .info-hotspot-title-wrapper {
  position: absolute;
  left: 40px;
  top: 0;
  width: 0;
  height: 40px;
  padding: 0;
  overflow: hidden;
  -webkit-transition:
    width 0s 0.4s,
    padding 0s 0.4s;
  transition:
    width 0s 0.4s,
    padding 0s 0.4s;
}

.desktop .info-hotspot.visible .info-hotspot-title-wrapper,
.desktop.no-touch
  .info-hotspot
  .info-hotspot-header:hover
  .info-hotspot-title-wrapper {
  width: 220px;
  padding: 0 5px;
  -webkit-transition:
    width 0s 0.4s,
    padding 0s 0.4s;
  transition:
    width 0s 0.4s,
    padding 0s 0.4s;
}

.info-hotspot .info-hotspot-title-wrapper:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}

.info-hotspot .info-hotspot-title {
  display: inline-block;
  vertical-align: middle;

  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.info-hotspot .info-hotspot-close-wrapper {
  position: absolute;
  left: 260px;
  top: 0;
  height: 40px;
  width: 40px;
  border-top-right-radius: 5px;
  background-color: rgb(78, 88, 104);
  visibility: hidden;
  -ms-transform: perspective(200px) rotateY(90deg);
  -webkit-transform: perspective(200px) rotateY(90deg);
  transform: perspective(200px) rotateY(90deg);
  -ms-transform-origin: 0 50% 0;
  -webkit-transform-origin: 0 50% 0;
  transform-origin: 0 50% 0;
  -webkit-transition:
    -ms-transform 0.3s 0.3s,
    -webkit-transform 0.3s 0.3s,
    transform 0.3s 0.3s,
    visibility 0s 0.6s;
  transition:
    -ms-transform 0.3s 0.3s,
    -webkit-transform 0.3s 0.3s,
    transform 0.3s 0.3s,
    visibility 0s 0.6s;
}

.desktop .info-hotspot.visible .info-hotspot-close-wrapper {
  visibility: visible;
  -ms-transform: perspective(200px) rotateY(0deg);
  -webkit-transform: perspective(200px) rotateY(0deg);
  transform: perspective(200px) rotateY(0deg);
  -webkit-transition:
    -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    visibility 0s 0s;
  transition:
    -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    visibility 0s 0s;
}

.info-hotspot .info-hotspot-close-icon {
  width: 70%;
  height: 70%;
  margin: 15%;
}

.info-hotspot .info-hotspot-text {
  position: absolute;
  width: 300px;
  height: auto;
  max-height: 200px;
  top: 40px;
  left: 0;
  padding: 10px;
  background-color: rgb(58, 68, 84);
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  overflow-y: auto;
  visibility: hidden;
  /* rotate(90deg) causes transition flicker on Firefox 58 */
  -ms-transform: perspective(200px) rotateX(-89.999deg);
  -webkit-transform: perspective(200px) rotateX(-89.999deg);
  transform: perspective(200px) rotateX(-89.999deg);
  -ms-transform-origin: 50% 0 0;
  -webkit-transform-origin: 50% 0 0;
  transform-origin: 50% 0 0;
  -webkit-transition:
    -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    visibility 0s 0.3s;
  transition:
    -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    visibility 0s 0.3s;

  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.desktop .info-hotspot.visible .info-hotspot-text {
  visibility: visible;
  -ms-transform: perspective(200px) rotateX(0deg);
  -webkit-transform: perspective(200px) rotateX(0deg);
  transform: perspective(200px) rotateX(0deg);
  -webkit-transition:
    -ms-transform 0.3s 0.3s,
    -webkit-transform 0.3s 0.3s,
    transform 0.3s 0.3s,
    visibility 0s 0s;
  transition:
    -ms-transform 0.3s 0.3s,
    -webkit-transform 0.3s 0.3s,
    transform 0.3s 0.3s,
    visibility 0s 0s;
}

/* Info hotspot modal */

.desktop .info-hotspot-modal {
  display: none;
}

.info-hotspot-modal {
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 11000 !important;
  background-color: rgba(0, 0, 0, 0.5);
  line-height: 1.2em;
  opacity: 0;
  visibility: hidden;
  -webkit-transition:
    opacity 0.2s ease-in-out 0.5s,
    visibility 0s 0.7s;
  transition:
    opacity 0.2s ease-in-out 0.5s,
    visibility 0s 0.7s;
}

.info-hotspot-modal.visible {
  opacity: 1;
  visibility: visible;
  -webkit-transition:
    opacity 0.2s ease-in-out,
    visibility 0s 0s;
  transition:
    opacity 0.2s ease-in-out,
    visibility 0s 0s;
}

.info-hotspot-modal .info-hotspot-header {
  position: absolute;
  top: 60px;
  left: 10px;
  right: 10px;
  width: auto;
  height: 50px;
  background-color: rgb(103, 115, 131);
  background-color: rgba(103, 115, 131, 0.8);
  opacity: 0;
  -webkit-transition: opacity 0.3s ease-in-out 0.2s;
  transition: opacity 0.3s ease-in-out 0.2s;
}

.info-hotspot-modal.visible .info-hotspot-header {
  opacity: 1;
  -webkit-transition: opacity 0.3s ease-in-out 0.2s;
  transition: opacity 0.3s ease-in-out 0.2s;
}

.info-hotspot-modal .info-hotspot-icon-wrapper {
  width: 50px;
  height: 50px;
}

.info-hotspot-modal .info-hotspot-icon {
  width: 90%;
  height: 90%;
  margin: 5%;
}

.info-hotspot-modal .info-hotspot-title-wrapper {
  position: absolute;
  top: 0;
  left: 50px;
  right: 50px;
  width: auto;
  height: 50px;
  padding: 0 10px;
}

.info-hotspot-modal .info-hotspot-title-wrapper:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}

.info-hotspot-modal .info-hotspot-title {
  display: inline-block;
  vertical-align: middle;

  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.info-hotspot-modal .info-hotspot-close-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 50px;
  background-color: rgb(78, 88, 104);
  background-color: rgba(78, 88, 104, 0.8);
  cursor: pointer;
}

.info-hotspot-modal .info-hotspot-close-icon {
  width: 70%;
  height: 70%;
  margin: 15%;
}

.info-hotspot-modal .info-hotspot-text {
  position: absolute;
  top: 110px;
  bottom: 10px;
  left: 10px;
  right: 10px;
  padding: 10px;
  background-color: rgb(58, 68, 84);
  background-color: rgba(58, 68, 84, 0.8);
  overflow-y: auto;
  opacity: 0;
  -webkit-transition: opacity 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;

  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.info-hotspot-modal.visible .info-hotspot-text {
  opacity: 1;
  -webkit-transition: opacity 0.3s ease-in-out 0.4s;
  transition: opacity 0.3s ease-in-out 0.4s;
}

/* View control buttons */

.viewControlButton {
  display: none;
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 40px;
  height: 40px;
  padding: 5px;
  background-color: rgb(103, 115, 131);
  background-color: rgba(103, 115, 131, 0.8);
}

body.view-control-buttons .viewControlButton {
  display: block;
}

/* Hide controls when width is too small */
@media (max-width: 600px) {
  body.view-control-buttons .viewControlButton {
    display: none;
  }
}

.viewControlButton .icon {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
}

/* Center is at margin-left: -20px */
.viewControlButton-1 {
  margin-left: -145px;
}
.viewControlButton-2 {
  margin-left: -95px;
}
.viewControlButton-3 {
  margin-left: -45px;
}
.viewControlButton-4 {
  margin-left: 5px;
}
.viewControlButton-5 {
  margin-left: 55px;
}
.viewControlButton-6 {
  margin-left: 105px;
}
```

### Migration Rules:

1. Read and analyze the `PanoramaViewer.jsx`, convert each classes to Tailwind CSS.
2. All of the global styles shall be migrated to `index.css` file in the parent `src\` folder.

---

## `PanoramaViewer.jsx` and `Sidebar.jsx` Integration

This section is the basis of all tile IDs from `APP_DATA`:

### Lower Ground (LG)

- This floor should be displayed at the LG button of `Sidebar.jsx`.
- This is the first panorama that will be displayed when first time visiting the website. Display the tile with ID `0-lg---1`

#### Interconnected tile IDs

These are the tiles that are connected with each other under the LG button referencing by their `APP_DATA` IDs specifically IDs `x-lg---x`

### Upper Ground Floor (UG)

- This floor should be displayed at the UG button of `Sidebar.jsx`.
- Display the tile ID `5-ug---1` first.

#### Interconnected tile IDs

These are the tiles that are connected with each other under the LG button referencing by their `APP_DATA` IDs specifically IDs `x-ug---x`

### 4F Floor (4F)

- This floor should be displayed at the 4F button of `Sidebar.jsx`.
- Display the tile ID `10-4f---1` first.

#### Interconnected tile IDs

These are the tiles that are connected with each other under the LG button referencing by their `APP_DATA` IDs specifically IDs `x-4f---x`

### 5F Floor (5F)

- This floor should be displayed at the 5F button of `Sidebar.jsx`.
- Display the tile ID `23-5f---1` first.

#### Interconnected tile IDs

These are the tiles that are connected with each other under the LG button referencing by their `APP_DATA` IDs specifically IDs `x-5f---x`

### 5M Floor (5M)

- This floor should be displayed at the 5M button of `Sidebar.jsx`.
- Display the tile ID `27-5m---1` first.

#### Interconnected tile IDs

These are the tiles that are connected with each other under the LG button referencing by their `APP_DATA` IDs specifically IDs `x-5m---x`

### 6F Floor (6F)

- This floor should be displayed at the 6F button of `Sidebar.jsx`.
- Display the tile ID `29-6f---2` first.

#### Interconnected tile IDs

These are the tiles that are connected with each other under the LG button referencing by their `APP_DATA` IDs specifically IDs `x-6f---x`

### 7F Floor (7F)

- This floor should be displayed at the 7F button of `Sidebar.jsx`.
- Display the tile ID `39-7f---2` first.

#### Interconnected tile IDs

These are the tiles that are connected with each other under the LG button referencing by their `APP_DATA` IDs specifically IDs `x-7f---x`

### 8F Floor (8F)

- This floor should be displayed at the 68 button of `Sidebar.jsx`.
- Display the tile ID `42-8f---2` first.

#### Interconnected tile IDs

These are the tiles that are connected with each other under the LG button referencing by their `APP_DATA` IDs specifically IDs `x-8f---x`

### 9F Floor (9F)

- This floor should be displayed at the 68 button of `Sidebar.jsx`.
- Display the tile ID `48-9f---1` first.

#### Interconnected tile IDs

These are the tiles that are connected with each other under the LG button referencing by their `APP_DATA` IDs specifically IDs `x-9f---x`
