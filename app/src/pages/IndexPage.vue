<template>
  <q-page class="row items-center justify-evenly">
    <q-carousel
        v-model="currentSlideName"
        transition-prev="scale"
        transition-next="scale"
        swipeable
        animated
        control-color="white"
        navigation
        padding
        arrows
        height="300px"
        class="bg-primary text-white shadow-1 rounded-borders col-8"
    >
      <q-carousel-slide class="column no-wrap flex-center full-width" v-for="(slide, index) in slides" :key="`IndexSlidesWorkout${index}-${slide.name}`" :name="`IndexSlidesWorkout${index}-${slide.name}`">
        <q-card class="full-width column flex-center q-pa-sm">
          <div :class="`${$q.dark.isActive ? 'text-white' : 'text-dark'} text-h4 q-pa-md`">
            {{slide.name}}
          </div>
          <div class="row no-wrap flex full-width q-gutter-x-xs justify-center items-end">

            <!-- bar graph -->
            <div v-for="(barValue, barValIndex) in slide.values.slice(-4)" :key="`indexPageCarouselBarVal${slide.values.length - 1 - barValIndex}`" class="column col-2 justify-end" :style="{height: '100%'}">
              <div class="row" :style="{border: '2px solid var(--q-primary)', borderRadius: '4px', height: '80%'}">
                <div class="bg-primary col self-end" :style="{height: `${Math.min(barValue / Math.max(slide.maxValue, 1.0), 1.0) * 100.0}%`}">&nbsp;</div>
              </div>
              <div class="self-center col" style="font-size: 10px; height: 5%;">{{barValue}} {{slide.measurement}}</div>
            </div>
            <div class="column col-2 flex-center q-pa-md" :style="{height: '100%'}">
              <q-btn class="row flex-center" color="secondary">
                <q-icon name="add"></q-icon>
              </q-btn>
              <div class="self-center col" style="font-size: 10px;">ADD</div>
            </div>
          </div>
        </q-card>
      </q-carousel-slide>
    </q-carousel>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

type Workout = {
  name: string,
  values: number[],
  maxValue: number,
  measurement: string,
};

export default defineComponent({
  name: 'IndexPage',
  components: { },
  setup() {
    const slides = ref<Workout[]>([
      {
        name: 'Squats',
        values: [ 8, 10, 20],
        maxValue: 20,
        measurement: 'lbs',
      },
      {
        name: 'Dead Lifts',
        values: [0],
        maxValue: 20,
        measurement: 'lbs',
      }
    ]);

    const startingIndex = 0;
    let currentSlideName = ref(`IndexSlidesWorkout${startingIndex}-${slides.value[startingIndex].name}`);
    return { slides, currentSlideName };
  }
});
</script>
