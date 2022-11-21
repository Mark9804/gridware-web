<script setup lang="ts">
import { Ref, ref } from "vue";

interface MenuHoverStatus {
  [key: string]: boolean;
}

const menuHoverStatus: Ref<MenuHoverStatus> = ref({
  convert: false,
});

function toggleSubMenu(menu: keyof MenuHoverStatus) {
  if (menuHoverStatus.value[menu]) {
    setTimeout(() => {
      menuHoverStatus.value[menu] = false;
    }, 200);
  } else {
    menuHoverStatus.value[menu] = true;
  }
}
</script>

<template>
  <div class="navbar shadow-near-below">
    <div class="level-1">
      <router-link to="/" title="Return to home screen">Home</router-link>
    </div>
    <div class="level-1">
      <router-link to="/analyze" title="Analyze your data">Analyze</router-link>
    </div>
    <div
      class="level-1"
      @mouseenter="toggleSubMenu('convert')"
      @mouseleave="toggleSubMenu('convert')"
    >
      <router-link to="/convert" title="Convert to GridWare format"
        >Convert</router-link
      >
      <transition name="submenu">
        <div class="sub-menu shadow-far" v-show="menuHoverStatus.convert">
          <router-link
            to="/convert/to-gridware"
            title="Convert to GridWare format"
            >To GridWare format
          </router-link>
          <router-link
            to="/convert/from-gridware"
            title="Convert from GridWare format"
            >From GridWare format
          </router-link>
        </div>
      </transition>
    </div>
  </div>
  <div id="main-view">
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  display: flex;
  position: sticky;
  top: 0;
  justify-content: center;
  background-color: var(--color-navbar-background);
  width: 100vw;

  .level-1 {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & > a {
      display: flex;
      position: relative;
      padding: 0.75rem 1rem;

      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        transition: all 0.125s ease-in-out;
        background-color: magenta;
        width: 100%;
        height: 0;
        content: "";
      }

      &:is(.router-link-exact-active, .router-link-active)::after {
        height: 0.25rem;
      }
    }
  }
}

#main-view {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 1rem;
  width: 100vw;
}

.sub-menu {
  display: flex;
  position: absolute;
  top: 100%;
  flex-direction: column;
  background-color: var(--color-navbar-background);
  font-size: 0.8rem;

  a {
    display: flex;
    position: relative;
    padding: 0.5rem 1rem;
  }
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.375s;
}

.submenu-enter-from,
.submenu-leave-to {
  transform: translateY(-0.5rem);
  opacity: 0;
}
</style>
