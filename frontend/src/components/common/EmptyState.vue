<template>
  <div class="empty">
    <div class="mark">∅</div>
    <p><slot>暂无数据</slot></p>
  </div>
</template>

<style scoped>
.empty { padding:32px; text-align:center; color:#6b7280; border:1px dashed #b8c0c8; border-radius:8px; }
.mark { font-size:32px; color:#8a97a3; }
</style>
