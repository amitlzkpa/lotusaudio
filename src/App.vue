<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
body {
  color: #222;
  background: #fff;
  font: 100% system-ui;
}
a {
  color: #0033cc;
}
i {
  margin: 4px;
}

@media (prefers-color-scheme: dark) {
  body {
    color: #eee;
    background: #121212;
  }

  body a {
    color: #809fff;
  }
}
</style>
