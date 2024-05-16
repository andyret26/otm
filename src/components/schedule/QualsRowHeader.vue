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
    <div class="quals-schedule__header-edit"></div>
  </div>
</template>

<style scoped lang="scss">
.quals-schedule__header {
  display: flex;
  min-height: 40px;
  max-height: 40px;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 3;

  &-id {
    min-width: 30px;
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
    font-size: 12px;
    min-width: 400px;
    max-width: 400px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0px 10px;
    padding: 3px;
  }

  &-edit {
    min-width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
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
