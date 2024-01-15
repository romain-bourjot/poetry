<template>
  <q-layout view="lHh LpR lFf">
    <q-page-container class="bg-main">
      <q-page
        class="row justify-evenly"
        style="background-color: rgb(245, 245, 245)">
        <div
          :class="{ 'q-mt-lg': !$q.screen.lt.sm, 'q-mt-sm': $q.screen.lt.sm  }"
          :style="$q.screen.lt.sm ? { width: '100%' }: { width: '80%' }">
          <q-card
            :class="{ 'q-px-lg': !$q.screen.lt.sm, 'q-px-md': $q.screen.lt.sm }"
            class="bg-transparent q-py-lg q-mb-lg justify-center column items-center"
            flat
            square
          >
            <q-card-section class="q-pa-none">
              <div
                :class="{ 'q-my-md': !$q.screen.lt.sm, 'q-my-xs': $q.screen.lt.sm }"
                class="row justify-around"
              >
                <div class="col-3 flex justify-center items-center">
                  <q-img
                    src="~assets/favicon.png"
                    style="max-width: 128px"></q-img>
                </div>
                <div class="flex justify-center items-center">
                  <h1
                    :class="{ 'text-h2': !$q.screen.lt.sm, 'text-h3': $q.screen.lt.sm }"
                    class="q-my-none">
                    Poetry</h1>
                </div>
              </div>
            </q-card-section>

            <router-view v-slot:="{ Component }">
              <keep-alive>
                <component :is="Component"/>
              </keep-alive>
            </router-view>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  components: {}
})
</script>
