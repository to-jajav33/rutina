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
        class="bg-primary text-white shadow-1 rounded-borders col-6"
    >
      <q-carousel-slide class="column no-wrap flex-center full-width" v-for="(slide, index) in slides" :key="`IndexSlidesWorkout${index}-${slide.name}`" :name="`IndexSlidesWorkout${index}-${slide.name}`">
        <q-card class="full-width column flex-center">
          <span :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
            {{slide.name}}
          </span>
        </q-card>
      </q-carousel-slide>
    </q-carousel>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

type Workout = {
  name: string,
  values: number[]
};

export default defineComponent({
  name: 'IndexPage',
  components: { },
  setup() {
    const slides = ref<Workout[]>([
      {
        name: 'Squats',
        values: [0]
      },
      {
        name: 'Dead Lifts',
        values: [0]
      }
    ]);

    const startingIndex = 0;
    let currentSlideName = ref(`IndexSlidesWorkout${startingIndex}-${slides.value[startingIndex].name}`);
    return { slides, currentSlideName };
  }
});
</script>
