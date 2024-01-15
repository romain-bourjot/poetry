<template>
  <div
    :style="$q.screen.lt.sm ? { width: '100%' }: { width: '75%' }"
    class="q-mt-md q-pa-md"
    style="background-color: #f8efdf;">

    <div
      v-if="isLoading"
      class="column justify-center"
      style="max-width: 100%">
      <q-skeleton
        class="q-my-sm"
        type="rect"
        width="90%"/>
      <q-skeleton
        class="q-my-sm"
        type="rect"
        width="30%"/>
      <q-skeleton
        class="text-body1 q-mt-md"
        height="15lh"
        style="white-space: pre-wrap"
        type="rect"
        width="70%"/>
    </div>

    <div
      v-if="!isLoading"
      class="column justify-center"
      style="max-width: 100%">
      <h4 class="q-my-none">{{ poem.title }}</h4>
      <h6 class="q-my-none">By {{ poem.author }}</h6>

      <pre
        class="text-body1 q-mt-lg"
        style="white-space: pre-wrap">{{ poem.content }}</pre>
    </div>

  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'

type Poem = {
  author: string,
  content: string,
  title: string,
}

export default {
  name: 'PoemComponent',
  props: {
    isLoading: {
      type: Boolean,
      required: true
    },
    poem: {
      type: Object as PropType<Poem>,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
