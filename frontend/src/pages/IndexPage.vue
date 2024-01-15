<template>
  <q-card-section
    :style="$q.screen.lt.sm ? { width: '100%' }: { width: '75%' }"
    class="column justify-center items-center q-pt-md"
    style="min-width: 75%">
    <q-btn
      :disable="machine.currentState === states.GENERATING_POEM"
      class="q-mt-lg"
      @click="onGeneratePoemBtnClick">
      <q-spinner
        v-if="machine.currentState === states.GENERATING_POEM"
        :thickness="3"
        color="primary"
        size="1em"
      />
      <template v-if="machine.currentState !== states.GENERATING_POEM">Give me a new Poem!</template>
    </q-btn>

    <p class="text-body1 q-mt-md">This websites uses <a
      href="https://poetrydb.org/"
      target="_blank">PoetryDB</a>.
    </p>

    <p
      v-if="machine.currentState === states.POEM_GENERATION_ERROR"
      class="text-negative q-py-lg">An error
      occurred while generating your Poem, please try again later.</p>

  </q-card-section>

  <q-card-section
    v-if="machine.currentState === states.GENERATING_POEM || machine.currentState === states.POEM_GENERATED"
    class="flex justify-center"
    style="width: 100%"
  >
    <PoemComponent
      :is-loading="machine.currentState === states.GENERATING_POEM"
      :poem="machine.context.poem"/>
  </q-card-section>
</template>

<script lang="ts">
import { doTransition, FSMMachine } from '@minifsm/core'
import PoemComponent from 'components/poem/PoemComponent.vue'
import { PoemPageContext, poemPageFSMDefinition, PoemPageInput, PoemPageState, STATES } from 'src/machines/poem'
import { defineComponent } from 'vue'

type State = {
  states: typeof STATES,
  machine: FSMMachine<PoemPageState, PoemPageContext>
}

export default defineComponent({
  name: 'IndexPage',
  components: { PoemComponent },
  data (): State {
    return {
      states: STATES,
      machine: {
        currentState: STATES.READY,
        context: {
          onGeneratePoemRequest: () => this.generatePoem(),

          poem: {
            author: '',
            title: '',
            content: ''
          }
        }
      }
    }
  },
  methods: {
    doTransition (input: PoemPageInput) {
      this.machine = doTransition({
        definition: poemPageFSMDefinition,
        machine: this.machine,
        input
      })
    },
    onGeneratePoemBtnClick () {
      this.doTransition({ type: 'GENERATE_POEM_REQUEST' })
    },
    async generatePoem () {
      try {
        const { data } = await this.$api.post('/poetry/poem', {})

        this.doTransition({
          type: 'POEM_GENERATED',
          poem: { author: data.data.author, title: data.data.title, content: data.data.content }
        })
      } catch (error) {
        this.doTransition({
          type: 'POEM_GENERATION_ERROR'
        })
      }
    }
  }
})
</script>
