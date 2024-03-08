<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import rws from './Websocket';

export default defineComponent ({
    name: 'FeedViewer',
    setup() {
        const feedItems = ref<any>([]);

        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data && Array.isArray(data)) {
                feedItems.value = data;
            }
        };

        onMounted(() => {
            rws.addEventListener('message', handleMessage)
        });

        onUnmounted(() => {
            rws.removeEventListener('message', handleMessage)
        });

        return { feedItems };
    }
});

</script>

<template>
  <div class="Feed-container">
    <!--VG Nyheter overskrift og logo-->
    <div class="feed-header">
        <h1> <img src="https://vgc.no/gfx/vg-rss.png"
        alt="VG Logo" class="vg-logo"/>       
        Nyheter</h1>
    </div>
    <ul>
      <li v-for="item in feedItems" :key="item.guid"> 
        <h3>{{ item.title }}</h3>
        <p v-html="item.description"></p>
    </li>
    </ul>
  </div>
</template>

<style scoped>
.feed-header {
    text-align: center;
    margin-bottom: 40px;
}

.vg-logo {
    height:40px;
    width: auto;
}

.feed-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
}

.feed-item {
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    margin-left: 30px;
}

.feed-item h3 {
    margin: 0 0 10px 0;
}

.feed-item p {
    margin:0;
}

ul {
    list-style: none;
    padding-left: 0;
}

</style>