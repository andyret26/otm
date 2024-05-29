<template>
  <div class="map-card">
    <div class="map-card__add map-card__field" v-if="showBtns">
      <IconBtn
        v-if="isAdded"
        @click="handleAddClick"
        icon-name="fa-plus"
        text-color="black"
        color="green"
        title="Add to mappool"
        :size="25"
      />

      <IconBtn
        v-else
        @click="handleRemoveClick"
        icon-name="fa-minus"
        text-color="white"
        color="red"
        title="Remove from mappool"
        :size="25"
      />
    </div>

    <p class="map-card__map-id">{{ map.id }}</p>
    <p
      class="map-card__mod map-card__field"
      :style="{ backgroundColor: `var(--${map.mod.toLowerCase().substring(0, 2)}-color)` }"
    >
      {{ map.mod }}
    </p>

    <div class="map-card__banner-wrapper map-card__field">
      <img class="map-card__banner-img" :src="map.image" alt="banner" />
    </div>

    <a :href="map.url" class="map-card__title map-card__field"
      >{{ map.artist }} - {{ map.name }} [{{ map.version }}]</a
    >

    <div class="map-card__field3 map-card__field">
      <span class="map-card__sr">{{ map.difficulty_rating.toFixed(2) }}</span>
      |
      <span class="map-card__bpm">{{ map.bpm.toFixed() }}</span>
      |
      <span class="map-card__length">{{ lengthInMin }}</span>
    </div>

    <div class="map-card__field2 map-card__field">
      <span class="map-card__cs">{{ map.cs }}</span>
      |
      <span class="map-card__ar">{{
        map.ar % 1 === 0 ? map.ar.toFixed(0) : map.ar.toFixed(1)
      }}</span>
      |
      <span class="map-card__od">{{
        map.accuracy % 1 === 0 ? map.accuracy.toFixed(0) : map.accuracy.toFixed(1)
      }}</span>
    </div>

    <p class="map-card__mapper map-card__field">{{ map.mapper }}</p>
    <p class="map-card__notes map-card__field">{{ map.notes }}</p>
    <div class="map-card__remove map-card__field" v-if="showBtns">
      <IconBtn
        iconName="fa-trash"
        color="red"
        :size="25"
        :iconSize="0.75"
        title="Delete from suggestions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Map, ResponseError } from '@/Types'
import { computed } from 'vue'
import IconBtn from '@/components/common/IconBtn.vue'
import { addSuggestionToPool, removeSuggestionFromPool } from '@/Api/OtmApi'
import { useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useToast } from 'vue-toastification'
import type { AxiosError } from 'axios'

interface Props {
  map: Map
  mainPool: Map[]
  showBtns?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  showBtns: false
})

const emit = defineEmits(['suggestionToPool', 'removeSuggestionFromPool'])
const route = useRoute()
const toast = useToast()
const { idTokenClaims } = useAuth0()

const lengthInMin = computed(() => {
  const min = Math.floor(props.map.total_length / 60)
  const sec = props.map.total_length - 60 * min
  return `${min}:${sec.toString().padStart(2, '0')}`
})

const isAdded = computed<boolean>(() => {
  if (props.mainPool.some((map) => map.id === props.map.id && map.mod === props.map.mod)) {
    return false
  }
  return true
})

const handleAddClick = async () => {
  try {
    const resp = await addSuggestionToPool(
      {
        mapId: props.map.id,
        tournamentId: parseInt(route.path.split('/')[2]),
        roundId: parseInt(route.path.split('/')[4]),
        mod: props.map.mod
      },
      idTokenClaims.value!.__raw
    )

    emit('suggestionToPool', resp.data)
    toast.success('Map added to pool')
  } catch (error) {
    const e = error as AxiosError<ResponseError>
    toast.error(e.response?.data.detail)
  }
}

const handleRemoveClick = async () => {
  console.log('Remove clicked')
  try {
    await removeSuggestionFromPool(
      {
        mapId: props.map.id,
        tournamentId: parseInt(route.path.split('/')[2]),
        roundId: parseInt(route.path.split('/')[4]),
        mod: props.map.mod
      },
      idTokenClaims.value!.__raw
    )

    emit('removeSuggestionFromPool', props.map.id)
    toast.success('Map removed from pool')
  } catch (error) {
    ;('')
    const e = error as AxiosError<ResponseError>
    toast.error(e.response?.data.detail)
  }
}
</script>

<style scoped lang="scss">
.map-card {
  display: flex;
  align-items: center;
  height: 50px;
  background-color: var(--bg1);
  width: 1080px;
  max-width: 1080px;
  min-width: 1080px;

  &__add {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg1);
  }

  &__map-id {
    width: 20px;
    height: 100%;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.8px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    writing-mode: vertical-lr;
    transform: rotate(180deg);
    background-color: var(--bg3);
    margin: 0px;
  }

  &__mod {
    width: 50px;
    height: 50px;
    border-radius: var(base-border-radius);
    text-align: center;
    font-weight: 900;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
  }

  &__banner-wrapper {
    width: 180px;
    height: 50px;
    border-radius: var(base-border-radius);
    background-color: var(--bg2);
  }

  &__banner-img {
    width: 100%;
    height: 100%;
    border-radius: var(base-border-radius);
  }

  &__title {
    width: 350px;
    font-weight: 900;
    text-align: center;
    padding: 0px 5px;
    word-wrap: break-word;
    background-color: var(--bg3);
  }

  &__field {
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__field3 {
    width: 150px;
  }

  &__field2 {
    width: 120px;
    background-color: var(--bg2);
  }

  &__sr,
  &__bpm,
  &__length {
    width: 45px;
    display: inline-block;
  }

  &__cs,
  &__ar,
  &__od {
    width: 30px;
    display: inline-block;
  }

  &__mapper {
    width: 100px;
    text-align: center;
  }

  &__notes {
    width: 100px;
    text-align: center;
    background-color: var(--bg2);
  }

  &__remove {
    width: 50px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg1);
  }
}
</style>
