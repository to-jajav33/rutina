<template>
  <q-page class="row items-center justify-evenly">
    <q-carousel
        v-if="slides && slides.length"
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
          <div class="row q-pa-md">
            <div :class="`${$q.dark.isActive ? 'text-white' : 'text-dark'} text-h4 q-pa-md`">
              {{slide.name}}
            </div>
            <q-btn @click="onAddWorkout" icon="add" size="sm" flat></q-btn>
          </div>
          <div class="row no-wrap flex full-width justify-center items-end">

            <!-- bar graph -->
            <div @click="updateValue(index, barValIndex)" v-for="(barValue, barValIndex) in slide.values.slice(-maxNumberOfValuesToShow)" :key="`indexPageCarouselBarVal${slide.values.length - 1 - barValIndex}`" class="column col-2 justify-end q-px-xs" :style="{height: '100%'}">
              <div class="row" :style="{border: '2px solid var(--q-primary)', borderRadius: '4px', height: '80%'}">
                <div class="bg-primary col self-end" :style="{height: `${Math.min(barValue / Math.max(slide.maxValue, 1.0), 1.0) * 100.0}%`}">&nbsp;</div>
              </div>
              <div class="self-center col" style="font-size: 10px; height: 5%;">{{barValue}} {{slide.measurement}}</div>
            </div>

            <!-- add btn -->
            <div class="row col-2 justify-center items-center q-ml-md" :style="{height: '100%'}">
              <q-btn @click="onCreateNewValueModal(index)" icon="add" color="secondary" outline stack></q-btn>
            </div>
          </div>
        </q-card>
      </q-carousel-slide>
    </q-carousel>
  
    <q-carousel v-else v-model="currentSlideName">
      <q-carousel-slide class="column no-wrap flex-center full-width" name="no-name">
        <q-btn @click="onAddWorkout" icon="add" label="Add a Workout"></q-btn>
      </q-carousel-slide>
    </q-carousel>

  </q-page>
    <q-dialog :model-value="openAddWorkoutDialog" v-close-popup>
      <q-card class="column col q-pa-md" dark>
        <q-card-section>
          <div class="text-h4">Create Workout</div>
          <q-input v-model="newWorkoutName" label="Workout Name"></q-input>
          <q-input v-model="newMeasurement" label="Unit of Measurement"></q-input>
        </q-card-section>
        <q-card-section>
          <q-card-actions align="right">
            <q-btn @click="onCreateNewWorkoutDialog" label="OK"></q-btn>
            <q-btn @click="onCancelAddWorkoutDialog" label="CANCEL"></q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

type Workout = {
  name: string,
  values: number[],
  maxValue: number,
  measurement: string,
};

type RoutinaDB = {rutina: {profiles: Record<string,{ workouts: Workout[], version: string }>}}

export default defineComponent({
  name: 'IndexPage',
  components: { },
  setup() {
    const profileID = 'default';
    const slides = ref<Workout[]>([]);

    const openAddWorkoutDialog = ref(false);
    const newWorkoutName = ref('');
    const newMeasurement = ref('lbs');

    let currentSlideName = ref('no-name');
    const maxNumberOfValuesToShow = 5;

    const profileData = ref({
      workouts: [] as Workout[],
      version: ''
    });

    return { slides, currentSlideName, maxNumberOfValuesToShow, openAddWorkoutDialog, newWorkoutName, newMeasurement, profileID, profileData };
  },
  methods: {
    onAddWorkout() {
      this.openAddWorkoutDialog = true;
    },
    onCancelAddWorkoutDialog() {
      this.openAddWorkoutDialog = false;
    },
    onCreateNewValueModal(slideIndex: number) {
      this.$q.dialog({
        title: 'Whats your new weight?',
        message: 'Nice work!',
        cancel: true,
        persistent: true,
        prompt: {
          model: '',
          type: 'number' // optional
        },
      }).onOk((data) => {
        const currSlide = this.slides[slideIndex];
        const newVal = Number(data);
        const maxValue = Math.max(currSlide.maxValue, data);

        currSlide.values.push(Number(newVal));
        currSlide.maxValue = maxValue;
      });
    },
    async onCreateNewWorkoutDialog() {
      if (!this.newWorkoutName) return console.warn('no workout name was provided');

      this.slides.push({
        name: this.newWorkoutName,
        values: [ 0 ],
        maxValue: 1,
        measurement: this.newMeasurement,
      });

      this.newWorkoutName = '';
      this.openAddWorkoutDialog = false;

      const startingIndex = this.slides.length - 1;
      this.currentSlideName = `IndexSlidesWorkout${startingIndex}-${this.slides[startingIndex].name}`;

      await this.save();
    },
    async save() {
      let db = (await this.$storage.get('rutina') as unknown) as RoutinaDB;
      if (!db) db = {rutina: {profiles: {}}};

      db.rutina.profiles[this.profileID] = this.profileData;
      this.profileData.workouts = this.slides;

      await this.$storage.set('rutina', db);
    },
    updateValue(slideIndex: number, valIndex: number) {
      this.$q.dialog({
        title: 'ChangeValue',
        message: '',
        cancel: true,
        persistent: true,
        prompt: {
          model: '',
          type: 'number' // optional
        },
      }).onOk((data) => {
        const currSlide = this.slides[slideIndex];
        const newVal = Number(data);

        currSlide.values[currSlide.values.length - this.maxNumberOfValuesToShow + valIndex] = Number(newVal);

        const maxValue = Math.max(...this.slides[slideIndex].values);
        currSlide.maxValue = maxValue;
      });
    }
  },
  async mounted() {
    let db : RoutinaDB | undefined = (await this.$storage.get('rutina') as unknown) as RoutinaDB;
    if (!db) {
        await this.save();
    }
    db = (await this.$storage.get('rutina') as unknown) as RoutinaDB;

    this.profileData = db.rutina.profiles[this.profileID]
    this.profileData.workouts.concat(db.rutina.profiles[this.profileID].workouts);

    let storedSlides = this.profileData.workouts;

    if (storedSlides) {
      this.slides.splice(0, 0, ...storedSlides);
    }

    if (this.profileData.workouts.length) {
      const startingIndex = 0;
      this.currentSlideName = `IndexSlidesWorkout${startingIndex}-${this.slides[startingIndex].name.replace(' ', '_')}`;
    }
  }
});
</script>
