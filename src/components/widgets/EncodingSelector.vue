<template>
  <select :value="selectedEncoding" @change="submitEncodingChange">
    <option
      v-for="encoding in encodingOptionList"
      :key="encoding.label"
      :value="encoding.value"
    >
      {{ encoding.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMainStore } from '../../store/mainStore';

const mainStore = useMainStore();
const selectedEncoding = computed<string>(() => mainStore.getEncoding);

function submitEncodingChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  mainStore.setEncoding(target.value);
}

interface EncodingOption {
  label: string;
  value: string;
}

const encodingOptionList: EncodingOption[] = [
  {
    label: 'UTF-8',
    value: 'utf-8',
  },
  {
    label: 'IBM866',
    value: 'ibm866',
  },
  {
    label: 'ISO-8859-2',
    value: 'iso-8859-2',
  },
  {
    label: 'ISO-8859-3',
    value: 'iso-8859-3',
  },
  {
    label: 'ISO-8859-4',
    value: 'iso-8859-4',
  },
  {
    label: 'ISO-8859-5',
    value: 'iso-8859-5',
  },
  {
    label: 'ISO-8859-6',
    value: 'iso-8859-6',
  },
  {
    label: 'ISO-8859-7',
    value: 'iso-8859-7',
  },
  {
    label: 'ISO-8859-8',
    value: 'iso-8859-8',
  },
  {
    label: 'ISO-8859-8-I',
    value: 'iso-8859-8-i',
  },
  {
    label: 'ISO-8859-10',
    value: 'iso-8859-10',
  },
  {
    label: 'ISO-8859-13',
    value: 'iso-8859-13',
  },
  {
    label: 'ISO-8859-14',
    value: 'iso-8859-14',
  },
  {
    label: 'ISO-8859-15',
    value: 'iso-8859-15',
  },
  {
    label: 'ISO-8859-16',
    value: 'iso-8859-16',
  },
  {
    label: 'KOI8-R',
    value: 'koi8-r',
  },
  {
    label: 'KOI8-U',
    value: 'koi8-u',
  },
  {
    label: 'macintosh',
    value: 'macintosh',
  },
  {
    label: 'windows-874',
    value: 'windows-874',
  },
  {
    label: 'windows-1250',
    value: 'windows-1250',
  },
  {
    label: 'windows-1251',
    value: 'windows-1251',
  },
  {
    label: 'windows-1252',
    value: 'windows-1252',
  },
  {
    label: 'windows-1253',
    value: 'windows-1253',
  },
  {
    label: 'windows-1254',
    value: 'windows-1254',
  },
  {
    label: 'windows-1255',
    value: 'windows-1255',
  },
  {
    label: 'windows-1256',
    value: 'windows-1256',
  },
  {
    label: 'windows-1257',
    value: 'windows-1257',
  },
  {
    label: 'windows-1258',
    value: 'windows-1258',
  },
  {
    label: 'x-mac-cyrillic',
    value: 'x-mac-cyrillic',
  },
  {
    label: 'GBK',
    value: 'gbk',
  },
  {
    label: 'gb18030',
    value: 'gb18030',
  },
  {
    label: 'big5',
    value: 'big5',
  },
  {
    label: 'EUC-JP',
    value: 'euc-jp',
  },
  {
    label: 'ISO-2022-JP',
    value: 'iso-2022-jp',
  },
  {
    label: 'Shift_JIS',
    value: 'shift_jis',
  },
  {
    label: 'EUC-KR',
    value: 'euc-kr',
  },
  {
    label: 'UTF-16BE',
    value: 'utf-16be',
  },
  {
    label: 'UTF-16LE',
    value: 'utf-16le',
  },
];
</script>

<style scoped lang="scss">
select {
}
</style>
