import {
  userInfoNav,
  userInfoNavMenu,
  profilePictureEdit,
  uploadProfilePicture,
  planInfInputs,
  customPlanSwitch,
  planLoad,
  readyMadePlans,
  navm,
  profilePictureNav,
} from "./ui.js";
import createPlan from "./createPlan.js";
function reactions() {
  const openPopUpButtons = document.querySelectorAll("*[openpopup]");

  closeOnTouchSlide("x", navm, navm);
  function closeOnTouchSlide(Direction, elementToTouch, elementToOpen) {
    if (elementToTouch) {
      var startX = null,
        startY = null,
        endX = null,
        endY = null;
      elementToTouch.ontouchstart = (event) => {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
      };
      elementToTouch.ontouchmove = (event) => {
        endX = event.touches[0].clientX;
        endY = event.touches[0].clientY;
      };
      elementToTouch.ontouchend = () => {
        if (Direction == "x" && endX != null) {
          if (startX - endX >= 50) {
            elementToOpen.classList.remove("open");
            endX = null;
          } else {
            elementToOpen.classList.add("open");
            endX = null;
          }
        }
      };
    }
  }
  function swap(Direction, elementToTouch, func) {
    if (elementToTouch) {
      var startX = null,
        startY = null,
        endX = null,
        endY = null;
      elementToTouch.addEventListener("touchstart", (event) => {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
      });
      elementToTouch.addEventListener("touchmove", (event) => {
        endX = event.touches[0].clientX;
        endY = event.touches[0].clientY;
      });
      elementToTouch.addEventListener("touchend", () => {
        if (endX != null) {
          if (Direction == "left") {
            if (startX - endX >= 50) {
              func();
              endX = null;
            }
          } else if (Direction == "right") {
            if (endX - startX >= 50) {
              func();
              endX = null;
            }
          }
        }
        if (endY != null) {
          if (Direction == "up") {
            if (startY - endY >= 50) {
              func();
              endX = null;
            }
          } else if (Direction == "down") {
            if (endY - startY >= 50) {
              func();
              endX = null;
            }
          }
        }
      });
    }
  }
  rangeInputs();
  function rangeInputs() {
    const allRanges = document.querySelectorAll("input[type='range']");
    allRanges.forEach((range) => {
      const label = range.parentElement;
      const sliderValueText = label.querySelector(".slider-value");
      if (sliderValueText) {
        range.oninput = () => {
          sliderValueText.innerHTML = range.value;
          if (range.getAttribute("req")) {
            if (Number(range.value) >= range.getAttribute("req")) {
              label
                .querySelector('input[type="range"]')
                .style.setProperty("--thumb-color", "#00e932");
            } else {
              label
                .querySelector('input[type="range"]')
                .style.setProperty("--thumb-color", "#1f10ff");
            }
          }
        };
      }
      if (range.getAttribute("req")) {
        const percentage =
          (range.getAttribute("req") / range.getAttribute("max")) * 100;
        range.style.background = `linear-gradient(90deg, #d3d3d3 ${percentage}%, #00e932 0%)`;
      }
    });
  }
  function toggleOpenClass(clickableElement, secondElement, exception) {
    if (clickableElement) {
      document.body.addEventListener("click", function () {
        secondElement.classList.remove("open");
      });
      clickableElement.onclick = (e) => {
        secondElement.classList.toggle("open");
        secondElement.onclick = function (x) {
          x.stopPropagation();
        };
        exception
          ? (exception.onclick = function (x) {
              x.stopPropagation();
            })
          : "";
        e.stopPropagation();
      };
    }
  }

  openPopUp();
  function openPopUp() {
    if (openPopUpButtons.length > 0) {
      openPopUpButtons.forEach((e) => {
        e.addEventListener("click", () => {
          document.querySelectorAll(".popup.open").forEach((opened) => {
            opened.classList.remove("open");
          });
        });
        const popupId = e.getAttribute("openpopup");
        const popup = document.getElementById(popupId);
        const popupClose = popup.querySelector(".popup-close");
        const popupNotCont = popup.querySelector(".container");
        popupNotCont.onclick = function (x) {
          x.stopPropagation();
        };
        popup.onclick = () => {
          popup.classList.remove("open");
        };
        popupClose.addEventListener("click", function () {
          popup.classList.remove("open");
        });
        toggleOpenClass(e, popup);
      });
    }
  }
  toggleOpenClass(userInfoNav, userInfoNavMenu);
  navm ? toggleOpenClass(navm.querySelector(".icon"), navm) : "";

  if (document.getElementById("summary")) {
    document
      .getElementById("summary")
      .querySelectorAll("input")
      .forEach((e, i, arr) => {
        e.onclick = () => {
          arr.forEach((x) => {
            document.getElementById(x.value).style.display = "none";
          });
          document.getElementById(e.value).style.display = "block";
        };
      });
  }
  const bannerButtons = document.querySelector(".banner-buttons");
  if (bannerButtons) {
    var bannerPos = 0;
    const siteBanner = document.querySelector(".site-banner");
    const bannerCollection = siteBanner.querySelector(
      ".banner-collection > div:first-child"
    );
    const bannerCount = siteBanner.querySelectorAll(
      ".banner-collection > div"
    ).length;
    const currentBannerIcons = siteBanner.querySelector(".current-banner");
    autoswap();
    function autoswap() {
      if (siteBanner.hasAttribute("autoswap")) {
        setTimeout(() => {
          bannerButtons.querySelector("button:last-child").click();
          autoswap();
        }, 6000);
      }
    }
    for (let i = 0; i < bannerCount; i++) {
      if (i == 0) {
        currentBannerIcons.innerHTML = `<div class="open" id="i${i}"></div>`;
      } else {
        currentBannerIcons.innerHTML += `<div id="i${i}"></div>`;
      }
    }
    currentBannerIcons.querySelectorAll("div").forEach((a) => {
      a.onclick = () => {
        bannerPos = Number(a.getAttribute("id")[1]);
        currentBannerIcons
          .querySelectorAll("div")
          .forEach((a) => a.classList.remove("open"));
        a.classList.add("open");
        bannerCollection.style.marginLeft = `-${bannerPos}00%`;
      };
    });
    bannerButtons.querySelector("button:last-child").onclick = () => {
      currentBannerIcons
        .querySelectorAll("div")
        .forEach((a) => a.classList.remove("open"));
      bannerPos < bannerCount - 1 ? (bannerPos += 1) : (bannerPos = 0);
      bannerCollection.style.marginLeft = `-${bannerPos}00%`;
      currentBannerIcons
        .querySelector(`div:nth-child(${bannerPos + 1})`)
        .classList.add("open");
    };
    bannerButtons.querySelector("button:first-child").onclick = () => {
      currentBannerIcons
        .querySelectorAll("div")
        .forEach((a) => a.classList.remove("open"));
      bannerPos > 0 ? (bannerPos -= 1) : (bannerPos = bannerCount - 1);
      bannerCollection.style.marginLeft = `-${bannerPos}00%`;
      currentBannerIcons
        .querySelector(`div:nth-child(${bannerPos + 1})`)
        .classList.add("open");
    };
    function bannerSwap(d) {
      if (d == "left") {
        bannerButtons.querySelector("button:last-child").click();
      } else {
        bannerButtons.querySelector("button:first-child").click();
      }
    }
    swap("left", siteBanner, () => {
      bannerSwap("left");
    });
    swap("right", siteBanner, () => {
      bannerSwap("right");
    });
  }
}

export default reactions;
