<template>
  <div class="quals-schedule__header">
    <div class="quals-schedule__header-id header-field1">Id</div>
    <div class="quals-schedule__header-date header-field2">Date</div>
    <div class="quals-schedule__header-time header-field1">Time</div>
    <div class="quals-schedule__header-ref header-field2">
      <div>Ref</div>
    </div>
    <div class="quals-schedule__header-names header-field1">
      <div>Names</div>
    </div>
    <div class="quals-schedule__header-mp-link header-field2">
      <div class="quals-schedule__header-mp-link-text">Mp Link</div>
      <div v-if="isAuthenticated" class="quals-schedule__header-mp-link-btns">
        <IconBtn
          v-if="!linksVisible"
          @click="handleHideMpLinks"
          icon-name="fa-eye-slash"
          title="Mp links are private. Click to make mp links public"
          :size="20"
          :icon-size="1.1"
          color="none"
          text-color="#ff5656"
        />
        <IconBtn
          v-else
          @click="handleHideMpLinks"
          icon-name="fa-eye"
          title="Mp links are public. Click to make mp links private"
          :size="20"
          :icon-size="1.1"
          color="none"
          text-color="lightgreen"
        />
      </div>
    </div>
    <div class="quals-schedule__header-edit"></div>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import IconBtn from '../common/IconBtn.vue'

interface Props {
  handleHideMpLinks: () => void
  linksVisible: boolean
}

defineProps<Props>()
const { isAuthenticated } = useAuth0()
</script>

<style scoped lang="scss">
.quals-schedule__header {
  display: flex;
  min-height: 40px;
  max-height: 40px;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 3;
  border-bottom: 5px solid var(--bg1);
  margin-bottom: -5px;

  &-id {
    min-width: 35px;
  }

  &-date {
    min-width: 110px;
  }

  &-time {
    min-width: 50px;
    width: 50px;
  }

  &-ref {
    min-width: 75px;
  }

  &-names {
    box-sizing: border-box;
    min-width: 400px;
    max-width: 400px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0px 10px;
    padding: 3px;
  }

  &-mp-link {
    min-width: 85px;
    max-width: 85px;
    text-align: center;
    text-wrap: wrap;

    &-text {
      max-width: 50px;
      line-height: 17px;
    }
  }

  &-edit {
    min-width: 35px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg1);
  }
}

.header-field1 {
  height: 40px;
  background-color: var(--bg3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-field2 {
  height: 40px;
  background-color: var(--bg2);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
