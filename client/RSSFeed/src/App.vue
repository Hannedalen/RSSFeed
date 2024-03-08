<script lang="ts">
import { defineComponent } from 'vue';
import FeedViewer from './FeedViewer.vue';

export default defineComponent ({
  name: 'App',
  components: {
    FeedViewer
  }
}) 

</script>

<template>
  <div id = "app">
    <FeedViewer/>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
